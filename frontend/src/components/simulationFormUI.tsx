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
      className="space-y-6 bg-slate-800 p-8 rounded-xl shadow-2xl border border-slate-700 w-full max-w-lg"
    >
      <div className="space-y-2">
        <label className="block text-sm font-medium text-slate-300">
          Payload
        </label>
        <textarea
          name="payload"
          value={props.formData.payload}
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          onChange={props.handleChange as any}
          required
          placeholder="Enter the message you want to simulate..."
          className="w-full h-24 p-3 bg-slate-900 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-network-blue transition-all"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-slate-300 text-left">
            Source IP
          </label>
          <input
            type="text"
            name="srcIp"
            value={props.formData.srcIp}
            onChange={props.handleChange}
            placeholder="192.168.1.10"
            className="w-full p-2.5 bg-slate-900 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-network-blue transition-all"
          />
        </div>
        <div className="space-y-2">
          <label className="block text-sm font-medium text-slate-300 text-left">
            Destination IP
          </label>
          <input
            type="text"
            name="destIp"
            value={props.formData.destIp}
            onChange={props.handleChange}
            placeholder="192.168.2.10"
            className="w-full p-2.5 bg-slate-900 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-network-blue transition-all"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-slate-300 text-left">
            Source Port
          </label>
          <input
            type="number"
            name="srcPort"
            value={props.formData.srcPort}
            onChange={props.handleChange}
            placeholder="8080"
            className="w-full p-2.5 bg-slate-900 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-network-blue transition-all"
          />
        </div>
        <div className="space-y-2">
          <label className="block text-sm font-medium text-slate-300 text-left">
            Destination Port
          </label>
          <input
            type="number"
            name="destPort"
            value={props.formData.destPort}
            onChange={props.handleChange}
            placeholder="8081"
            className="w-full p-2.5 bg-slate-900 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-network-blue transition-all"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 items-end">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-slate-300 text-left">
            App Protocol
          </label>
          <select
            name="appProtocol"
            value={props.formData.appProtocol}
            onChange={props.handleChange}
            className="w-full p-2.5 bg-slate-900 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-network-blue transition-all cursor-pointer"
          >
            <option value="HTTP">HTTP</option>
            <option value="HTTPS">HTTPS</option>
            <option value="FTP">FTP</option>
          </select>
        </div>
        <div className="space-y-2">
          <label className="block text-sm font-medium text-slate-300 text-left">
            App Method
          </label>
          <select
            name="appMethod"
            value={props.formData.appMethod}
            onChange={props.handleChange}
            className="w-full p-2.5 bg-slate-900 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-network-blue transition-all cursor-pointer"
          >
            <option value="POST">POST</option>
            <option value="GET">GET</option>
            <option value="PUT">PUT</option>
            <option value="DELETE">DELETE</option>
          </select>
        </div>
      </div>

      <button
        type="submit"
        disabled={props.loading}
        className={`w-full py-3 px-4 font-bold rounded-lg shadow-lg transform active:scale-95 transition-all duration-150 ${
          props.loading
            ? 'bg-slate-600 text-slate-400 cursor-not-allowed'
            : 'bg-network-blue hover:bg-blue-600 text-white hover:shadow-blue-500/20'
        }`}
      >
        {props.loading ? (
          <span className="flex items-center justify-center space-x-2">
            <svg
              className="animate-spin h-5 w-5 text-white"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
                fill="none"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            <span>Processing...</span>
          </span>
        ) : (
          'Run Network Simulation'
        )}
      </button>
    </form>
  );
};
