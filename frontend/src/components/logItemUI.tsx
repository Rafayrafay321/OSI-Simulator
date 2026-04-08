import type { LogEntry } from '../../../backend/src/types';
import { InspectIconUI } from './InspectPacketIconUI';

interface LogItemProps {
  log: LogEntry;
  isSelected: boolean;
  onClick: () => void;
}

export const LogItem = ({ log, isSelected, onClick }: LogItemProps) => {
  const hasSnapShot = !!log.packetSnapshot;
  const getLogStyle = () => {
    switch (log.type) {
      case 'SUCCESS':
        return 'border-l-4 border-network-success bg-network-success/10 text-green-400';
      case 'ERROR':
        return 'border-l-4 border-network-error bg-network-error/10 text-red-400';
      default:
        return 'border-l-4 border-network-blue bg-network-blue/10 text-blue-300';
    }
  };

  const formattedTime = new Date(log.timestamp).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  });

  return (
    <div
      onClick={hasSnapShot ? onClick : undefined}
      className={`group relative p-3 my-1 font-mono text-sm rounded shadow-sm flex items-start space-x-3 ${hasSnapShot ? 'cursor-pointer transition-all duration-200 hover:brightness-125 hover:pl-4' : 'cursor-default'} ${
        isSelected ? 'ring-2 ring-white bg-slate-800' : ''
      } ${getLogStyle()}`}
    >
      <span className="text-gray-500 whitespace-nowrap">[{formattedTime}]</span>
      <span className="font-bold min-w-[120px]">[{log.layer}]</span>
      <span className="flex-1 truncate">{log.message}</span>
      {hasSnapShot && <InspectIconUI />}
      {hasSnapShot && (
        <span className="absolute bottom-full right-4 mb-2 px-3 py-1.5 bg-slate-800 text-emerald-400 text-xs font-bold font-sans rounded-md shadow-xl border border-emerald-500/30 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 translate-y-2 group-hover:translate-y-0 z-50 whitespace-nowrap pointer-events-none flex items-center gap-1">
          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
          </svg>
          Click to Inspect
        </span>
      )}
    </div>
  );
};
