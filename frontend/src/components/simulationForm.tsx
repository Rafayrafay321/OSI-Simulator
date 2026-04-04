import React, { useState } from 'react';

// Types
import type { simulationConfig } from '../../../backend/src/types/index.ts';

export const SimulationForm = () => {
  const [formData, setFormData] = useState<simulationConfig>({
    payload: '',
    srcIp: '',
    destIp: '',
    srcPort: 0,
    destPort: 0,
    appProtocol: 'HTTP',
    appMethod: 'POST',
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log('Form Data for Orchestrator: ', formData);
  };

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
        maxWidth: '400px',
      }}
    >
      <label>
        Payload:
        <input
          type="text"
          name="payload"
          value={formData.payload}
          onChange={handleChange}
          required
        />
      </label>

      <div style={{ display: 'flex', gap: '10px' }}>
        <label>
          Src IP:
          <input
            type="text"
            name="srcIp"
            value={formData.srcIp}
            onChange={handleChange}
          />
        </label>
        <label>
          Dest IP:
          <input
            type="text"
            name="destIp"
            value={formData.destIp}
            onChange={handleChange}
          />
        </label>
      </div>

      <div style={{ display: 'flex', gap: '10px' }}>
        <label>
          Src Port:
          <input
            type="text"
            name="srcPort"
            value={formData.srcPort}
            onChange={handleChange}
          />
        </label>
        <label>
          Dest Port:
          <input
            type="text"
            name="destPort"
            value={formData.destPort}
            onChange={handleChange}
          />
        </label>
      </div>

      <label>
        Protocol:
        <select
          name="appProtocol"
          value={formData.appProtocol}
          onChange={handleChange}
        >
          <option value="HTTP">HTTP</option>
          <option value="HTTPS">HTTPS</option>
          <option value="FTP">FTP</option>
        </select>
      </label>

      <button
        type="submit"
        style={{ marginTop: '10px', padding: '10px', cursor: 'pointer' }}
      >
        Run Network Simulation
      </button>
    </form>
  );
};
