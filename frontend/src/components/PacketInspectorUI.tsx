import React from 'react';
import type { LogEntry } from '../../../backend/src/types';

interface PacketInspectorProps {
  log: LogEntry | null;
}

export const PacketInspectorUI: React.FC<PacketInspectorProps> = ({ log }) => {
  if (!log || !log.packetSnapshot) {
    return null;
  }

  return (
    <div className="w-full max-w-7xl mx-auto bg-slate-900 rounded-xl p-6 border border-slate-800 shadow-lg shadow-black/40 bg-gradient-to-b from-white/[0.03] to-transparent shadow-[inset_0_1px_0_rgba(255,255,255,0.05)] mb-12 animate-in fade-in slide-in-from-bottom-4 duration-200">
      <div className="flex items-center justify-between mb-4 border-b border-slate-800 pb-4">
        <h2 className="text-lg font-semibold text-slate-200 flex items-center tracking-tight">
          <span className="text-blue-400 mr-2">🔍</span> Packet Inspector
        </h2>
        <div className="text-sm">
          <span className="text-slate-400">Layer: </span>
          <span className="font-mono text-blue-400 bg-slate-950 border border-slate-800 px-2.5 py-1 rounded">
            {log.layer}
          </span>
        </div>
      </div>
      
      <p className="text-slate-300 mb-4 font-mono text-sm border-l-2 border-blue-500 pl-3">
        {log.message}
      </p>

      <div className="bg-slate-950 p-4 rounded-md overflow-x-auto border border-slate-800 shadow-[inset_0_1px_3px_rgba(0,0,0,0.5)]">
        <pre className="text-slate-300 text-xs font-mono">
          {JSON.stringify(log.packetSnapshot, null, 2)}
        </pre>
      </div>
    </div>
  );
};
