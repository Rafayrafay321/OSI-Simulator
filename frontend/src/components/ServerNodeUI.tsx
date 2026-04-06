import React from 'react';

interface ServerNodeProps {
  label: string;
  type: 'host' | 'router';
  colorClass: string;
  statusColor: string;
}

const ServerNode: React.FC<ServerNodeProps> = ({
  label,
  type,
  colorClass,
  statusColor,
}) => {
  return (
    <div className="flex flex-col items-center group">
      <div
        className={`
      relative w-24 h-32 sm:w-28 sm:h-36 
      ${colorClass} 
      border-2 border-white/10 rounded-lg 
      shadow-[0_10px_20px_rgba(0,0,0,0.4)] 
      flex flex-col p-3 transition-transform group-hover:-translate-y-1
    `}
      >
        <div className="space-y-1 mb-3">
          <div className="h-[2px] w-full bg-black/20 rounded"></div>
          <div className="h-[2px] w-full bg-black/20 rounded"></div>
          <div className="h-[2px] w-full bg-black/20 rounded"></div>
        </div>

        {/* Center Icon/Emoji */}
        <div className="flex-1 flex items-center justify-center text-3xl">
          {type === 'host' ? '🖥️' : '🌐'}
        </div>

        {/* Bottom Status Panel */}
        <div className="mt-auto flex items-center justify-between bg-black/30 p-1.5 rounded-md border border-white/5">
          <div
            className={`w-2 h-2 rounded-full ${statusColor} animate-pulse shadow-[0_0_8px_currentcolor]`}
          ></div>
          <div className="flex gap-1">
            <div className="w-1 h-1 bg-white/20 rounded-full"></div>
            <div className="w-1 h-1 bg-white/20 rounded-full"></div>
          </div>
        </div>
      </div>

      <span className="mt-3 font-mono text-[11px] font-bold text-slate-400 uppercase tracking-[0.2em]">
        {label}
      </span>
    </div>
  );
};

export default ServerNode;
