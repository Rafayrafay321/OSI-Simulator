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
      className="space-y-6 bg-slate-900 p-8 rounded-xl shadow-lg shadow-black/40 border border-slate-800 w-full max-w-lg bg-gradient-to-b from-white/[0.03] to-transparent shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]"
    >
      <div className="space-y-2">
        <label className="block text-sm font-semibold text-slate-300 tracking-tight">
          Payload
        </label>
        <textarea
          name="payload"
          value={values.payload}
          onChange={handleChange}
          placeholder="Enter the message you want to simulate..."
          className={`w-full h-24 p-3 bg-slate-950 border ${
            errors.payload
              ? 'border-red-500 focus:ring-red-500/50'
              : 'border-slate-800 focus:border-blue-500 focus:ring-blue-500/50'
          } rounded-md text-slate-200 font-mono text-sm placeholder-slate-600 focus:outline-none focus:ring-2 transition-all`}
        />
        {errors.payload && (
          <p className="text-red-500 text-xs text-left mt-1">
            {errors.payload}
          </p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-slate-300 text-left tracking-tight">
            Source IP
          </label>
          <input
            type="text"
            name="srcIp"
            value={values.srcIp}
            onChange={handleChange}
            placeholder="192.168.1.10"
            className={`w-full p-2.5 bg-slate-950 border ${
              errors.srcIp
                ? 'border-red-500 focus:ring-red-500/50'
                : 'border-slate-800 focus:border-blue-500 focus:ring-blue-500/50'
            } rounded-md text-slate-200 font-mono text-sm focus:outline-none focus:ring-2 transition-all`}
          />
          {errors.srcIp && (
            <p className="text-red-500 text-xs text-left mt-1">
              {errors.srcIp}
            </p>
          )}
        </div>
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-slate-300 text-left tracking-tight">
            Destination IP
          </label>
          <input
            type="text"
            name="destIp"
            value={values.destIp}
            onChange={handleChange}
            placeholder="192.168.2.10"
            className={`w-full p-2.5 bg-slate-950 border ${
              errors.destIp
                ? 'border-red-500 focus:ring-red-500/50'
                : 'border-slate-800 focus:border-blue-500 focus:ring-blue-500/50'
            } rounded-md text-slate-200 font-mono text-sm focus:outline-none focus:ring-2 transition-all`}
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
          <label className="block text-sm font-semibold text-slate-300 text-left tracking-tight">
            Source Port
          </label>
          <input
            type="number"
            name="srcPort"
            value={values.srcPort}
            onChange={handleChange}
            placeholder="8080"
            className={`w-full p-2.5 bg-slate-950 border ${
              errors.srcPort
                ? 'border-red-500 focus:ring-red-500/50'
                : 'border-slate-800 focus:border-blue-500 focus:ring-blue-500/50'
            } rounded-md text-slate-200 font-mono text-sm focus:outline-none focus:ring-2 transition-all`}
          />
          {errors.srcPort && (
            <p className="text-red-500 text-xs text-left mt-1">
              {errors.srcPort}
            </p>
          )}
        </div>
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-slate-300 text-left tracking-tight">
            Destination Port
          </label>
          <input
            type="number"
            name="destPort"
            value={values.destPort}
            onChange={handleChange}
            placeholder="8081"
            className={`w-full p-2.5 bg-slate-950 border ${
              errors.destPort
                ? 'border-red-500 focus:ring-red-500/50'
                : 'border-slate-800 focus:border-blue-500 focus:ring-blue-500/50'
            } rounded-md text-slate-200 font-mono text-sm focus:outline-none focus:ring-2 transition-all`}
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
          <label className="block text-sm font-semibold text-slate-300 text-left tracking-tight">
            App Protocol
          </label>
          <select
            name="appProtocol"
            value={values.appProtocol}
            onChange={handleChange}
            className={`w-full p-2.5 bg-slate-950 border ${
              errors.appProtocol
                ? 'border-red-500 focus:ring-red-500/50'
                : 'border-slate-800 focus:border-blue-500 focus:ring-blue-500/50'
            } rounded-md text-slate-200 font-mono text-sm focus:outline-none focus:ring-2 transition-all cursor-pointer`}
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
          <label className="block text-sm font-semibold text-slate-300 text-left tracking-tight">
            App Method
          </label>
          <select
            name="appMethod"
            value={values.appMethod}
            onChange={handleChange}
            className={`w-full p-2.5 bg-slate-950 border ${
              errors.appMethod
                ? 'border-red-500 focus:ring-red-500/50'
                : 'border-slate-800 focus:border-blue-500 focus:ring-blue-500/50'
            } rounded-md text-slate-200 font-mono text-sm focus:outline-none focus:ring-2 transition-all cursor-pointer`}
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
            <label className="block text-sm font-semibold text-slate-300 text-left tracking-tight">
              Packet Drop Chance
            </label>
            <span className="text-sm font-mono text-blue-400">
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
            className={`w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer ${
              errors.dropChance ? 'accent-red-500' : 'accent-blue-500'
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
        className={`w-full py-2.5 px-4 font-semibold tracking-wide rounded-md shadow-md transform active:scale-[0.98] transition-all duration-150 border ${
          isSubmitting
            ? 'bg-slate-800 text-slate-500 border-slate-700 cursor-not-allowed'
            : 'bg-blue-600 hover:brightness-110 text-white border-blue-500 active:shadow-inner'
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
