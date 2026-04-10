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
  const getRiskLevel = (chance: number) => {
    if (chance < 0.1) return { label: 'LOW', color: 'text-emerald-400' };
    if (chance < 0.5) return { label: 'MEDIUM', color: 'text-amber-400' };
    return { label: 'HIGH', color: 'text-red-400' };
  };

  const risk = getRiskLevel(values.dropChance || 0);

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col bg-slate-900 rounded-xl shadow-lg shadow-black/40 border border-slate-800 w-full max-w-lg bg-gradient-to-b from-white/[0.03] to-transparent shadow-[inset_0_1px_0_rgba(255,255,255,0.05)] overflow-hidden"
    >
      {/* Header & Presets */}
      <div className="bg-slate-900/80 px-6 py-4 border-b border-slate-800 flex justify-between items-center shrink-0">
        <h2 className="font-semibold tracking-tight text-slate-200 text-lg flex items-center">
          <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
          Control Center
        </h2>
        <div className="flex gap-2">
          <button
            type="button"
            className="text-[10px] font-bold px-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded border border-slate-700 transition-colors active:scale-95"
          >
            Normal
          </button>
          <button
            type="button"
            className="text-[10px] font-bold px-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded border border-slate-700 transition-colors active:scale-95"
          >
            Loss Test
          </button>
        </div>
      </div>

      {/* Form Content */}
      <div className="flex-1 p-6 space-y-8">
        {/* Section: Payload */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
            <span className="text-slate-500 font-mono text-xs">01</span>
            <h3 className="text-sm font-semibold text-slate-300 tracking-tight uppercase">
              Data Payload
            </h3>
          </div>
          <div>
            <textarea
              name="payload"
              value={values.payload}
              onChange={handleChange}
              placeholder="Enter packet data..."
              className={`w-full h-20 p-2.5 bg-slate-950 border ${
                errors.payload
                  ? 'border-red-500 focus:ring-red-500/50'
                  : 'border-slate-700 focus:border-blue-500 focus:ring-blue-500/50'
              } rounded-md text-slate-200 font-mono text-xs placeholder-slate-600 focus:outline-none focus:ring-1 shadow-[inset_0_1px_2px_rgba(0,0,0,0.3)] transition-all resize-none`}
            />
            {errors.payload && (
              <p className="text-red-400 text-[10px] mt-1 font-mono">
                {errors.payload}
              </p>
            )}
          </div>
        </div>

        {/* Section: Network Config */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
            <span className="text-slate-500 font-mono text-xs">02</span>
            <h3 className="text-sm font-semibold text-slate-300 tracking-tight uppercase">
              Network Routing
            </h3>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Source IP
              </label>
              <input
                type="text"
                name="srcIp"
                value={values.srcIp}
                onChange={handleChange}
                className={`w-full p-2 bg-slate-950 border ${
                  errors.srcIp
                    ? 'border-red-500'
                    : 'border-slate-700 focus:border-blue-500'
                } rounded-md text-slate-200 font-mono text-xs focus:outline-none focus:ring-1 focus:ring-blue-500/50 shadow-[inset_0_1px_2px_rgba(0,0,0,0.3)] transition-all`}
              />
              {errors.srcIp && (
                <p className="text-red-400 text-[10px] font-mono">
                  {errors.srcIp}
                </p>
              )}
            </div>
            <div className="space-y-1.5">
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Destination IP
              </label>
              <input
                type="text"
                name="destIp"
                value={values.destIp}
                onChange={handleChange}
                className={`w-full p-2 bg-slate-950 border ${
                  errors.destIp
                    ? 'border-red-500'
                    : 'border-slate-700 focus:border-blue-500'
                } rounded-md text-slate-200 font-mono text-xs focus:outline-none focus:ring-1 focus:ring-blue-500/50 shadow-[inset_0_1px_2px_rgba(0,0,0,0.3)] transition-all`}
              />
              {errors.destIp && (
                <p className="text-red-400 text-[10px] font-mono">
                  {errors.destIp}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Section: Transport Config */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
            <span className="text-slate-500 font-mono text-xs">03</span>
            <h3 className="text-sm font-semibold text-slate-300 tracking-tight uppercase">
              Transport & Application
            </h3>
          </div>

          {/* Segmented Controls for Protocol/Method */}
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="space-y-1.5">
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Protocol
              </label>
              <div className="flex bg-slate-950 border border-slate-700 rounded-md p-1 shadow-[inset_0_1px_2px_rgba(0,0,0,0.3)]">
                {['HTTP', 'HTTPS', 'FTP'].map((proto) => (
                  <label
                    key={proto}
                    className="flex-1 text-center cursor-pointer"
                  >
                    <input
                      type="radio"
                      name="appProtocol"
                      value={proto}
                      checked={values.appProtocol === proto}
                      onChange={handleChange}
                      className="sr-only"
                    />
                    <div
                      className={`text-xs py-1 rounded transition-colors ${values.appProtocol === proto ? 'bg-slate-700 text-blue-400 font-bold shadow-sm' : 'text-slate-500 hover:text-slate-300'}`}
                    >
                      {proto}
                    </div>
                  </label>
                ))}
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Method
              </label>
              <div className="flex bg-slate-950 border border-slate-700 rounded-md p-1 shadow-[inset_0_1px_2px_rgba(0,0,0,0.3)]">
                {['GET', 'POST', 'PUT'].map((method) => (
                  <label
                    key={method}
                    className="flex-1 text-center cursor-pointer"
                  >
                    <input
                      type="radio"
                      name="appMethod"
                      value={method}
                      checked={values.appMethod === method}
                      onChange={handleChange}
                      className="sr-only"
                    />
                    <div
                      className={`text-xs py-1 rounded transition-colors ${values.appMethod === method ? 'bg-slate-700 text-emerald-400 font-bold shadow-sm' : 'text-slate-500 hover:text-slate-300'}`}
                    >
                      {method}
                    </div>
                  </label>
                ))}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Source Port
              </label>
              <input
                type="number"
                name="srcPort"
                value={values.srcPort}
                onChange={handleChange}
                className={`w-full p-2 bg-slate-950 border ${
                  errors.srcPort
                    ? 'border-red-500'
                    : 'border-slate-700 focus:border-blue-500'
                } rounded-md text-slate-200 font-mono text-xs focus:outline-none focus:ring-1 focus:ring-blue-500/50 shadow-[inset_0_1px_2px_rgba(0,0,0,0.3)] transition-all`}
              />
              {errors.srcPort && (
                <p className="text-red-400 text-[10px] font-mono">
                  {errors.srcPort}
                </p>
              )}
            </div>
            <div className="space-y-1.5">
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Dest Port
              </label>
              <input
                type="number"
                name="destPort"
                value={values.destPort}
                onChange={handleChange}
                className={`w-full p-2 bg-slate-950 border ${
                  errors.destPort
                    ? 'border-red-500'
                    : 'border-slate-700 focus:border-blue-500'
                } rounded-md text-slate-200 font-mono text-xs focus:outline-none focus:ring-1 focus:ring-blue-500/50 shadow-[inset_0_1px_2px_rgba(0,0,0,0.3)] transition-all`}
              />
              {errors.destPort && (
                <p className="text-red-400 text-[10px] font-mono">
                  {errors.destPort}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Section: Simulation Physics */}
        <div className="space-y-3 pb-4">
          <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
            <span className="text-slate-500 font-mono text-xs">04</span>
            <h3 className="text-sm font-semibold text-slate-300 tracking-tight uppercase">
              Network Physics
            </h3>
          </div>

          <div className="space-y-2 bg-slate-950/50 p-4 rounded-lg border border-slate-800/50">
            <div className="flex justify-between items-center mb-2">
              <label className="text-xs font-semibold text-slate-300">
                Packet Drop Probability
              </label>
              <div className="flex items-center gap-2">
                <span
                  className={`text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-900 border border-slate-700 ${risk.color}`}
                >
                  {risk.label} RISK
                </span>
                <span className="text-sm font-mono text-slate-300 w-8 text-right">
                  {Math.round((values.dropChance || 0) * 100)}%
                </span>
              </div>
            </div>

            <div className="relative h-2 w-full bg-slate-800 rounded-full overflow-hidden">
              {/* Colored Track Background */}
              <div className="absolute top-0 left-0 h-full w-full bg-gradient-to-r from-emerald-500 via-amber-500 to-red-500 opacity-30"></div>
              {/* Active Colored Track */}
              <div
                className="absolute top-0 left-0 h-full bg-gradient-to-r from-emerald-500 via-amber-500 to-red-500"
                style={{ width: `${(values.dropChance || 0) * 100}%` }}
              ></div>
              <input
                type="range"
                name="dropChance"
                min="0"
                max="1"
                step="0.01"
                value={values.dropChance || 0}
                onChange={handleChange}
                className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer"
              />
            </div>
            <p className="text-[10px] text-slate-500 text-center mt-2">
              Simulates Layer 1/2 connection instability.
            </p>
          </div>
        </div>
      </div>

      {/* Footer Action */}
      <div className="p-6 border-t border-slate-800 bg-slate-900/90 shrink-0">
        <button
          type="submit"
          disabled={isSubmitting || Object.keys(errors).length > 0}
          className={`w-full py-3 px-4 font-bold tracking-wide rounded shadow-md transform active:scale-[0.98] transition-all duration-150 border flex justify-center items-center gap-2 ${
            isSubmitting
              ? 'bg-slate-800 text-slate-500 border-slate-700 cursor-wait'
              : Object.keys(errors).length > 0
                ? 'bg-slate-800/50 text-slate-500 border-red-900/50 cursor-not-allowed'
                : 'bg-blue-600 hover:brightness-110 text-white border-blue-500 hover:shadow-[0_0_15px_rgba(59,130,246,0.3)]'
          }`}
        >
          {isSubmitting ? (
            <>
              <svg
                className="animate-spin h-4 w-4 text-slate-400"
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
              <span>Executing Sequence...</span>
            </>
          ) : Object.keys(errors).length > 0 ? (
            <span className="text-red-400/80">Invalid Configuration</span>
          ) : (
            <>
              <svg
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              Initialize Simulation
            </>
          )}
        </button>
      </div>
    </form>
  );
};
