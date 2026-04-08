import React, { useState, useEffect } from 'react';

// Custom Imports
import { SimulationFormUI } from './simulationFormUI';
import NetworkMapUI from './NetworkMapUI';
import { LogItem } from './logItemUI';
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

  useEffect(() => {
    if (simulationLogs.length === 0) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setCurrentIndex(0);

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
  }, [simulationLogs]);

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

      const response = await fetch('http://localhost:3001/api/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      setSimulationLogs(data.response || []);

      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.log('Simulation Failed', error);
    }
  };
  const visibleLogs = simulationLogs.slice(0, currentIndex + 1);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6 md:p-12 w-full">
      <header className="max-w-7xl mx-auto mb-12 text-center">
        <h1 className="text-4xl md:text-5xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-emerald-400 mb-4">
          OSI Packet Simulator
        </h1>
        <p className="text-slate-400 text-lg">
          Visualize data flow through the networking stack in real-time
        </p>
      </header>

      <NetworkMapUI logs={simulationLogs} currentIndex={currentIndex} />
      
      <PacketInspectorUI log={selectedLog} />

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

        <section className="bg-slate-900 rounded-xl border border-slate-800 shadow-2xl overflow-hidden flex flex-col h-[600px]">
          <div className="bg-slate-800 px-6 py-4 border-b border-slate-700 flex justify-between items-center">
            <h2 className="font-bold text-slate-200 uppercase tracking-wider text-sm flex items-center">
              <span className="w-2 h-2 bg-emerald-500 rounded-full mr-2 animate-pulse"></span>
              Live Simulation Logs
            </h2>
            <span className="text-xs text-slate-500 font-mono">
              {visibleLogs.length} / {simulationLogs.length || 0} entries
            </span>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-1 scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent">
            {visibleLogs.length > 0 ? (
              visibleLogs.map((log: LogEntry, index: number) => (
                <LogItem
                  key={index}
                  log={log}
                  onClick={() => setSelectedLog(log)}
                  isSelected={selectedLog === log}
                />
              ))
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-slate-600 space-y-4">
                <svg
                  className="w-16 h-16 opacity-20"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                <p className="italic">Waiting for simulation to start...</p>
              </div>
            )}
          </div>
        </section>
      </main>

      <footer className="max-w-7xl mx-auto mt-12 pt-8 border-t border-slate-900 text-center text-slate-600 text-sm">
        <p>&copy; 2026 OSI Packet Simulator. All layers active.</p>
      </footer>
    </div>
  );
};
