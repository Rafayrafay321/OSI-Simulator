import React from 'react';

interface ServerNodeProps {
  label: string;
  type: 'host' | 'router';
  colorClass: string;
  statusColor: string;
  isActive: boolean;
  ipAddress?: string;
  macAddress?: string;
  activePort?: number; // 0 or 1 to indicate which port is active
}

const ServerNode: React.FC<ServerNodeProps> = ({
  label,
  type,
  colorClass,
  statusColor,
  isActive,
  ipAddress = '---.---.---.---',
  macAddress = '--:--:--:--:--:--',
  activePort = 0,
}) => {
  const portCount = type === 'router' ? 2 : 1;

  return (
    <div className="relative group z-10 flex flex-col items-center">
      {/* Hardware Chassis */}
      <div
        className={`
          w-40 sm:w-48 h-16 sm:h-20
          ${colorClass}
          bg-gradient-to-b from-white/[0.04] to-transparent
          border border-slate-700 rounded shadow-lg shadow-black/60
          shadow-[inset_0_1px_0_rgba(255,255,255,0.1),inset_0_-1px_0_rgba(0,0,0,0.4)]
          flex items-center justify-between px-3
          transition-transform duration-75
          ${isActive ? 'scale-[0.99] border-blue-500/30' : ''}
        `}
      >
        {/* Left Side: Brand/Label */}
        <div className="flex flex-col justify-center h-full">
          <span className="font-mono text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">
            {label}
          </span>
          <div className="flex items-center space-x-1.5 opacity-60">
            <span className="text-xl leading-none">{type === 'host' ? '🖥️' : '🖲️'}</span>
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_5px_rgba(16,185,129,0.8)]"></div>
          </div>
        </div>

        {/* Middle: Vents/Cooling */}
        <div className="flex-1 px-4 flex justify-center space-x-1">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="w-1 h-8 bg-black/40 rounded-sm shadow-[0_1px_0_rgba(255,255,255,0.05)] border border-white/5"></div>
          ))}
        </div>

        {/* Right Side: Network Interfaces (Ports) */}
        <div className="flex space-x-2">
          {Array.from({ length: portCount }).map((_, idx) => {
            const isPortActive = isActive && activePort === idx;
            return (
              <div key={idx} className="flex flex-col items-center space-y-1">
                {/* Link/Act LED */}
                <div
                  className={`w-1.5 h-1.5 rounded-sm transition-colors duration-75 ${
                    isPortActive
                      ? 'bg-blue-400 shadow-[0_0_8px_rgba(96,165,250,0.8)] animate-pulse'
                      : 'bg-slate-700 shadow-[inset_0_1px_1px_rgba(0,0,0,0.5)]'
                  }`}
                ></div>
                {/* RJ45 Port Hole */}
                <div className="w-4 h-4 bg-black/60 rounded-sm border border-slate-800 shadow-[inset_0_2px_4px_rgba(0,0,0,0.8)] relative overflow-hidden">
                   {/* Fake pins */}
                   <div className="absolute top-0 left-0 w-full h-1/2 flex justify-evenly px-0.5 pt-0.5">
                      <div className="w-px h-full bg-amber-500/30"></div>
                      <div className="w-px h-full bg-amber-500/30"></div>
                      <div className="w-px h-full bg-amber-500/30"></div>
                   </div>
                </div>
                {/* Port Label */}
                <span className="text-[8px] font-mono text-slate-500">eth{idx}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Diagnostic Tooltip (Hover) */}
      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 p-2 bg-slate-900 border border-slate-700 rounded-md shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 translate-y-1 group-hover:translate-y-0 z-50 pointer-events-none">
        <div className="text-[10px] font-mono text-slate-300 space-y-1">
          <div className="flex justify-between border-b border-slate-800 pb-1 mb-1">
            <span className="text-slate-500">IP:</span>
            <span className="text-blue-400">{ipAddress}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">MAC:</span>
            <span className="text-emerald-400">{macAddress}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">TYPE:</span>
            <span className="uppercase">{type}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServerNode;
