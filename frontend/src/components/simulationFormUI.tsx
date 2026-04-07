import type React from 'react';

import type { FormSchemaType } from '../schemas/simulationSchema';

interface SimulationFormProp {
  values: FormSchemaType;
  errors: Record<string, string>;
  isSubmitting: boolean;
  handleChange: (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => void;
  handleSubmit: (e: React.SubmitEvent<HTMLFormElement>) => void;
}

export const SimulationFormUI: React.FC<SimulationFormProp> = ({
  values,
  errors,
  isSubmitting,
  handleChange,
  handleSubmit,
}) => {
  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 bg-slate-800 p-8 rounded-xl shadow-2xl border border-slate-700 w-full max-w-lg"
    >
      <div className="space-y-2">
        <label className="block text-sm font-medium text-slate-300">
          Payload
        </label>
        <textarea
          name="payload"
          value={values.payload}
          onChange={handleChange}
          placeholder="Enter the message you want to simulate..."
          className={`w-full h-24 p-3 bg-slate-900 border ${
            errors.payload
              ? 'border-red-500 focus:ring-red-500'
              : 'border-slate-600 focus:ring-network-blue'
          } rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 transition-all`}
        />
        {errors.payload && (
          <p className="text-red-500 text-xs text-left mt-1">
            {errors.payload}
          </p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-slate-300 text-left">
            Source IP
          </label>
          <input
            type="text"
            name="srcIp"
            value={values.srcIp}
            onChange={handleChange}
            placeholder="192.168.1.10"
            className={`w-full p-2.5 bg-slate-900 border ${
              errors.srcIp
                ? 'border-red-500 focus:ring-red-500'
                : 'border-slate-600 focus:ring-network-blue'
            } rounded-lg text-white focus:outline-none focus:ring-2 transition-all`}
          />
          {errors.srcIp && (
            <p className="text-red-500 text-xs text-left mt-1">
              {errors.srcIp}
            </p>
          )}
        </div>
        <div className="space-y-2">
          <label className="block text-sm font-medium text-slate-300 text-left">
            Destination IP
          </label>
          <input
            type="text"
            name="destIp"
            value={values.destIp}
            onChange={handleChange}
            placeholder="192.168.2.10"
            className={`w-full p-2.5 bg-slate-900 border ${
              errors.destIp
                ? 'border-red-500 focus:ring-red-500'
                : 'border-slate-600 focus:ring-network-blue'
            } rounded-lg text-white focus:outline-none focus:ring-2 transition-all`}
          />
          {errors.destIp && (
            <p className="text-red-500 text-xs text-left mt-1">
              {errors.destIp}
            </p>
          )}
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
            value={values.srcPort}
            onChange={handleChange}
            placeholder="8080"
            className={`w-full p-2.5 bg-slate-900 border ${
              errors.srcPort
                ? 'border-red-500 focus:ring-red-500'
                : 'border-slate-600 focus:ring-network-blue'
            } rounded-lg text-white focus:outline-none focus:ring-2 transition-all`}
          />
          {errors.srcPort && (
            <p className="text-red-500 text-xs text-left mt-1">
              {errors.srcPort}
            </p>
          )}
        </div>
        <div className="space-y-2">
          <label className="block text-sm font-medium text-slate-300 text-left">
            Destination Port
          </label>
          <input
            type="number"
            name="destPort"
            value={values.destPort}
            onChange={handleChange}
            placeholder="8081"
            className={`w-full p-2.5 bg-slate-900 border ${
              errors.destPort
                ? 'border-red-500 focus:ring-red-500'
                : 'border-slate-600 focus:ring-network-blue'
            } rounded-lg text-white focus:outline-none focus:ring-2 transition-all`}
          />
          {errors.destPort && (
            <p className="text-red-500 text-xs text-left mt-1">
              {errors.destPort}
            </p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 items-end">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-slate-300 text-left">
            App Protocol
          </label>
          <select
            name="appProtocol"
            value={values.appProtocol}
            onChange={handleChange}
            className={`w-full p-2.5 bg-slate-900 border ${
              errors.appProtocol
                ? 'border-red-500 focus:ring-red-500'
                : 'border-slate-600 focus:ring-network-blue'
            } rounded-lg text-white focus:outline-none focus:ring-2 transition-all cursor-pointer`}
          >
            <option value="HTTP">HTTP</option>
            <option value="HTTPS">HTTPS</option>
            <option value="FTP">FTP</option>
          </select>
          {errors.appProtocol && (
            <p className="text-red-500 text-xs text-left mt-1">
              {errors.appProtocol}
            </p>
          )}
        </div>
        <div className="space-y-2">
          <label className="block text-sm font-medium text-slate-300 text-left">
            App Method
          </label>
          <select
            name="appMethod"
            value={values.appMethod}
            onChange={handleChange}
            className={`w-full p-2.5 bg-slate-900 border ${
              errors.appMethod
                ? 'border-red-500 focus:ring-red-500'
                : 'border-slate-600 focus:ring-network-blue'
            } rounded-lg text-white focus:outline-none focus:ring-2 transition-all cursor-pointer`}
          >
            <option value="POST">POST</option>
            <option value="GET">GET</option>
            <option value="PUT">PUT</option>
            <option value="DELETE">DELETE</option>
          </select>
          {errors.appMethod && (
            <p className="text-red-500 text-xs text-left mt-1">
              {errors.appMethod}
            </p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <label className="block text-sm font-medium text-slate-300 text-left">
              Packet Drop Chance
            </label>
            <span className="text-sm font-bold text-network-blue">
              {Math.round((values.dropChance || 0) * 100)}%
            </span>
          </div>

          <input
            type="range"
            name="dropChance"
            min="0"
            max="1"
            step="0.01"
            value={values.dropChance || 0}
            onChange={handleChange}
            className={`w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer ${
              errors.dropChance ? 'accent-red-500' : 'accent-network-blue'
            }`}
          />
          {errors.dropChance && (
            <p className="text-red-500 text-xs text-left mt-1">
              {errors.dropChance}
            </p>
          )}
        </div>
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className={`w-full py-3 px-4 font-bold rounded-lg shadow-lg transform active:scale-95 transition-all duration-150 ${
          isSubmitting
            ? 'bg-slate-600 text-slate-400 cursor-not-allowed'
            : 'bg-network-blue hover:bg-blue-600 text-white hover:shadow-blue-500/20'
        }`}
      >
        {isSubmitting ? (
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
