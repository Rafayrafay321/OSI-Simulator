// React Imports
import React, { useState } from 'react';

// Custom Imports
import { SimulationFormUI } from './simulationFormUI.tsx';

// Types
import type {
  LogEntry,
  simulationConfig,
} from '../../../backend/src/types/index.ts';
import { LogItem } from './logItemUI.tsx';

export const SimulationContainer = () => {
  const [formData, setFormData] = useState<simulationConfig>({
    payload: '',
    srcIp: '',
    destIp: '',
    srcPort: 0,
    destPort: 0,
    appProtocol: 'HTTP',
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
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      setLoading(true);
      const response = await fetch('http://localhost:3001/api/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      setSimulationLogs(data.logs);
      setLoading(false);
      console.log('Received logs:', data.logs);
    } catch (error) {
      setLoading(false);
      console.log('Simulation Failed', error);
    }
  };

  return (
    <div>
      <h1>Network Simulation</h1>
      <SimulationFormUI
        formData={formData}
        handleChange={handleChange}
        handleSubmit={handleSubmit}
        loading={loading}
      />

      <hr />

      <div className="logList">
        {simulationLogs.map((log: LogEntry, index: number) => {
          return <LogItem key={index} log={log} />;
        })}
      </div>
    </div>
  );
};
