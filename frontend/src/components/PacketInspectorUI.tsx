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
    <div className="w-full max-w-7xl mx-auto bg-slate-900 rounded-xl p-6 border border-slate-800 shadow-2xl mb-12 animate-in fade-in slide-in-from-bottom-4 duration-300">
      <div className="flex items-center justify-between mb-4 border-b border-slate-700 pb-4">
        <h2 className="text-xl font-bold text-slate-200 flex items-center">
          <span className="text-emerald-400 mr-2">🔍</span> Packet Inspector
        </h2>
        <div className="text-sm">
          <span className="text-slate-400">Layer: </span>
          <span className="font-bold text-network-blue bg-blue-900/30 px-2 py-1 rounded">
            {log.layer}
          </span>
        </div>
      </div>
      
      <p className="text-slate-300 mb-4 font-mono text-sm border-l-2 border-emerald-500 pl-3">
        {log.message}
      </p>

      <div className="bg-slate-950 p-4 rounded-lg overflow-x-auto border border-slate-800 shadow-inner">
        <pre className="text-emerald-400 text-xs font-mono">
          {JSON.stringify(log.packetSnapshot, null, 2)}
        </pre>
      </div>
    </div>
  );
};
