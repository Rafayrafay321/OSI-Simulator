import React, { useState, useEffect } from 'react';

// Custom Imports
import { SimulationFormUI } from './simulationFormUI';
import NetworkMapUI from './NetworkMapUI';
import { LogsTerminalUI } from './logsTerminalUI';
import { PacketInspectorUI } from './PacketInspectorUI';

// Types
import type { LogEntry } from '../../../backend/src/types/index';
import {
  simulationConfigSchema,
  type FormSchemaType,
} from '../schemas/simulationSchema';


export const SimulationContainer = () => {
  const [formData, setFormData] = useState<FormSchemaType>({
    payload: 'Hey bitch',
    srcIp: '127.0.0.1',
    destIp: '192.168.1.2',
    srcPort: 49152,
    destPort: 80,
    appProtocol: 'HTTP',
    appMethod: 'POST',
    dropChance: 0,
  });
  const [formError, setFormError] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [simulationLogs, setSimulationLogs] = useState<LogEntry[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedLog, setSelectedLog] = useState<LogEntry | null>(null);
  const [packetSize, setPacketSize] = useState<number>(0);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [layerFilter, setLayerFilter] = useState<string>('All Layers');
  const [statusFilter, setStatusFilter] = useState<string>('All Status');
  const [socketId, setSocketId] = useState<string>('');

  useEffect(() => {

    const socket = new WebSocket(import.meta.env.VITE_WSS_API_URL as string);

    socket.addEventListener('message', (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.type === 'connected') {
          setSocketId(data.socketId);
        } else {
          setSimulationLogs((prev) => [...prev, data])
        }
      } catch (error) {
        console.log('failed to Parse the data')
      }
    })

    return () => {
      if (socket.readyState === WebSocket.OPEN || socket.readyState === WebSocket.CONNECTING) {
        socket.close();
      }
    }

  }, []);

  useEffect(() => {
    if (simulationLogs.length > 0) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setCurrentIndex(0);
    }
  }, [simulationLogs]);

  useEffect(() => {
    if (simulationLogs.length === 0 || isPaused) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => {
        if (prev >= simulationLogs.length - 1) {
          clearInterval(interval);
          return prev;
        }
        return prev + 1;
      });
    }, 600);

    return () => clearInterval(interval);
  }, [simulationLogs, isPaused]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    const { name, value } = e.target;
    const newValue =
      name.includes('Port') || name === 'dropChance' ? Number(value) : value;

    setFormData((prev) => ({
      ...prev,
      [name]: newValue,
    }));

    if (formError[name]) {
      setFormError((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();

    const result = simulationConfigSchema.safeParse(formData);

    if (!result.success) {
      const newErrors: Record<string, string> = {};
      result.error.issues.forEach((err) => {
        if (err.path[0]) {
          newErrors[err.path[0].toString()] = err.message;
        }
      });
      setFormError(newErrors);
      return;
    }

    try {
      setLoading(true);
      setSimulationLogs([]);
      setSelectedLog(null);

      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/send`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ config: formData, socketId }),
      });

      const data = await response.json();
      setSimulationLogs(data.logs || []);
      setPacketSize(data.packetSize);

      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.log('Simulation Failed', error);
    }
  };

  const visibleLogs = simulationLogs
    .slice(0, currentIndex + 1)
    .filter((log) => {
      const layerMatch =
        layerFilter === 'All Layers' || log.layer === layerFilter;
      const statusMatch =
        statusFilter === 'All Status' || log.type === statusFilter;
      return layerMatch && statusMatch;
    });

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6 md:p-12 w-full">
      <div className="bg-noise"></div>
      <div className="relative z-10">
        <header className="max-w-7xl mx-auto mb-12 text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-emerald-400 mb-4">
            OSI Packet Simulator
          </h1>
          <p className="text-slate-400 text-lg">
            Visualize data flow through the networking stack in real-time
          </p>
        </header>

        <NetworkMapUI
          logs={simulationLogs}
          currentIndex={currentIndex}
          srcIpAddress={formData.srcIp}
          destIpAddress={formData.destIp}
        />

        <PacketInspectorUI
          log={selectedLog}
          stepIndex={
            selectedLog ? simulationLogs.indexOf(selectedLog) : undefined
          }
          packetSize={packetSize}
        />

        <main className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          <section className="flex justify-center">
            <SimulationFormUI
              values={formData}
              handleChange={handleChange}
              handleSubmit={handleSubmit}
              isSubmitting={loading}
              errors={formError || {}}
            />
          </section>
          <LogsTerminalUI
            currentIndex={currentIndex}
            simulationLogs={simulationLogs}
            setSelectedLog={setSelectedLog}
            selectedLog={selectedLog}
            visibleLogs={visibleLogs}
            isPaused={isPaused}
            setIsPaused={setIsPaused}
            resetIndex={() => setCurrentIndex(0)}
            setLayerFilter={setLayerFilter}
            setStatusFilter={setStatusFilter}
          />
        </main>

        <footer className="max-w-7xl mx-auto mt-12 pt-8 border-t border-slate-900 text-center text-slate-600 text-sm">
          <p>&copy; 2026 OSI Packet Simulator. All layers active.</p>
        </footer>
      </div>
    </div>
  );
};
