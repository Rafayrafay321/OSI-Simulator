// Type
import type React from 'react';
import type { simulationConfig } from '../../../backend/src/types';

interface FormProp {
  formData: Partial<simulationConfig>;
  handleChange: (
    e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>,
  ) => void;
  handleSubmit: (e: React.SubmitEvent<HTMLFormElement>) => void;
  loading: boolean;
}

export const SimulationFormUI = (props: FormProp) => {
  return (
    <form
      onSubmit={props.handleSubmit}
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
          value={props.formData.payload}
          onChange={props.handleChange}
          required
        />
      </label>

      <div style={{ display: 'flex', gap: '10px' }}>
        <label>
          Src IP:
          <input
            type="text"
            name="srcIp"
            value={props.formData.srcIp}
            onChange={props.handleChange}
          />
        </label>
        <label>
          Dest IP:
          <input
            type="text"
            name="destIp"
            value={props.formData.destIp}
            onChange={props.handleChange}
          />
        </label>
      </div>

      <div style={{ display: 'flex', gap: '10px' }}>
        <label>
          Src Port:
          <input
            type="text"
            name="srcPort"
            value={props.formData.srcPort}
            onChange={props.handleChange}
          />
        </label>
        <label>
          Dest Port:
          <input
            type="text"
            name="destPort"
            value={props.formData.destPort}
            onChange={props.handleChange}
          />
        </label>
      </div>

      <label>
        Protocol:
        <select
          name="appProtocol"
          value={props.formData.appProtocol}
          onChange={props.handleChange}
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
