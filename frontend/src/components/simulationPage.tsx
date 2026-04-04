// React Imports
import React, { useState } from 'react';

// Custom Imports
import { SimulationFormUI } from './simulationFormUI.tsx';
import { LogItem } from './logItemUI.tsx';

// Types
import type {
  LogEntry,
  simulationConfig,
} from '../../../backend/src/types/index.ts';

export const SimulationContainer = () => {
  const [formData, setFormData] = useState<simulationConfig>({
    payload: 'Hello world',
    srcIp: '192.168.1.10',
    destIp: '192.168.2.10',
    srcPort: 8000,
    destPort: 8001,
    appProtocol: 'HTTPS',
    appMethod: 'POST',
  });
  const [simulationLogs, setSimulationLogs] = useState<LogEntry[]>([]);
  const [loading, setLoading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name.includes('Port') ? Number(value) : value,
    }));
  };

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      setLoading(true);
      setSimulationLogs([]);
      const response = await fetch('http://localhost:3001/api/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await response.json();

      // In your backend response, it's called 'response' based on your previous logs
      setSimulationLogs(data.response || []);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.log('Simulation Failed', error);
    }
  };

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

      <main className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
        <section className="flex justify-center">
          <SimulationFormUI
            formData={formData}
            handleChange={handleChange}
            handleSubmit={handleSubmit}
            loading={loading}
          />
        </section>

        <section className="bg-slate-900 rounded-xl border border-slate-800 shadow-2xl overflow-hidden flex flex-col h-[600px]">
          <div className="bg-slate-800 px-6 py-4 border-b border-slate-700 flex justify-between items-center">
            <h2 className="font-bold text-slate-200 uppercase tracking-wider text-sm flex items-center">
              <span className="w-2 h-2 bg-emerald-500 rounded-full mr-2 animate-pulse"></span>
              Live Simulation Logs
            </h2>
            <span className="text-xs text-slate-500 font-mono">
              {simulationLogs.length} entries
            </span>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-1 scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent">
            {simulationLogs.length > 0 ? (
              simulationLogs.map((log: LogEntry, index: number) => (
                <LogItem key={index} log={log} />
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
