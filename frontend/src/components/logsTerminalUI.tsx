import type React from 'react';
import { LogItem } from './logItemUI';

// types
import type { LogEntry } from '../../../backend/src/types';

export interface LogsTerminalUIProps {
  currentIndex: number;
  simulationLogs: LogEntry[];
  visibleLogs: LogEntry[];
  selectedLog: LogEntry | null;
  setSelectedLog: (log: LogEntry) => void;
}

export const LogsTerminalUI: React.FC<LogsTerminalUIProps> = ({
  currentIndex,
  simulationLogs,
  visibleLogs,
  selectedLog,
  setSelectedLog,
}) => {
  return (
    <section className="bg-slate-950 rounded-xl border border-slate-800 shadow-lg shadow-black/40 overflow-hidden flex flex-col h-[600px] shadow-[inset_0_1px_0_rgba(255,255,255,0.05)] relative font-mono">
      {/* Subtle Scanline Effect for Terminal */}
      <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_4px,3px_100%] z-0 opacity-20"></div>

      {/* Sticky Header with Controls */}
      <div className="bg-slate-900/90 backdrop-blur border-b border-slate-800 flex flex-col z-10 sticky top-0">
        <div className="px-6 py-3 flex justify-between items-center border-b border-slate-800/50">
          <div className="flex items-center gap-3">
            <h2 className="font-semibold tracking-tight text-slate-200 text-sm flex items-center font-sans">
              <span
                className={`w-2 h-2 rounded-full mr-2 ${currentIndex > 0 && currentIndex < simulationLogs.length - 1 ? 'bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.8)]' : 'bg-slate-600'}`}
              ></span>
              Logs Terminal
            </h2>
            <div className="h-4 w-px bg-slate-700"></div>
            <span
              className={`text-[10px] font-bold px-2 py-0.5 rounded ${currentIndex > 0 && currentIndex < simulationLogs.length - 1 ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-slate-800 text-slate-400 border border-slate-700'}`}
            >
              {currentIndex > 0 && currentIndex < simulationLogs.length - 1
                ? 'LIVE'
                : 'STOPPED'}
            </span>
            <span className="text-xs text-slate-500">
              {simulationLogs.length > 0
                ? (visibleLogs.length / (currentIndex * 0.6 || 1)).toFixed(1)
                : 0}{' '}
              logs/sec
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button className="px-3 py-1 bg-slate-800 hover:bg-slate-700 active:scale-95 border border-slate-700 rounded text-xs font-semibold text-slate-300 transition-all shadow-sm">
              Pause Stream
            </button>
            <button className="px-3 py-1 bg-slate-800 hover:bg-slate-700 active:scale-95 border border-slate-700 rounded text-xs font-semibold text-slate-300 transition-all shadow-sm flex items-center gap-1">
              <svg
                className="w-3 h-3"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
              Replay
            </button>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="px-6 py-2 bg-slate-900/50 flex gap-6 text-xs font-sans shadow-inner shadow-black/20">
          <div className="flex items-center gap-2">
            <span className="text-slate-500">Layer:</span>
            <select className="bg-slate-950 border border-slate-800 rounded px-2 py-1 text-slate-300 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all cursor-pointer">
              <option>All Layers</option>
              <option>APPLICATION</option>
              <option>TRANSPORT</option>
              <option>NETWORK</option>
              <option>DATA_LINK</option>
              <option>PHYSICAL</option>
            </select>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-slate-500">Status:</span>
            <select className="bg-slate-950 border border-slate-800 rounded px-2 py-1 text-slate-300 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all cursor-pointer">
              <option>All Status</option>
              <option>INFO</option>
              <option>SUCCESS</option>
              <option>ERROR</option>
            </select>
          </div>
          <div className="ml-auto text-slate-500 flex items-center font-mono">
            {visibleLogs.length} / {simulationLogs.length || 0} entries
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-1 scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent z-10 relative">
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
  );
};
