import type { LogEntry } from '../../../backend/src/types';
import { InspectIconUI } from './InspectPacketIconUI';
import { LogSnippetUI } from './logsSnippetUI';

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
        return 'border-l-4 border-emerald-500 bg-emerald-900/10 text-emerald-400';
      case 'ERROR':
        return 'border-l-4 border-red-500 bg-red-900/20 text-red-300';
      default:
        return 'border-l-4 border-blue-500 bg-slate-900/50 text-slate-300';
    }
  };

  const getStatusIcon = () => {
    switch (log.type) {
      case 'SUCCESS':
        return '✓';
      case 'ERROR':
        return '✗';
      default:
        return 'ℹ';
    }
  };

  const formattedTime = new Date(log.timestamp).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
    fractionalSecondDigits: 3,
  });

  return (
    <div
      onClick={hasSnapShot ? onClick : undefined}
      className={`group relative p-2.5 my-1 font-mono text-[11px] sm:text-xs rounded flex items-start space-x-3 animate-in fade-in slide-in-from-bottom-2 duration-300 ${
        hasSnapShot
          ? 'cursor-pointer hover:bg-slate-800 active:scale-[0.995] transition-all'
          : 'cursor-default'
      } ${isSelected ? 'ring-1 ring-slate-500 bg-slate-800/80' : ''} ${getLogStyle()}`}
    >
      <span className="text-slate-500 whitespace-nowrap w-[90px] shrink-0">
        [{formattedTime}]
      </span>
      <span className="font-bold text-slate-400 w-[110px] shrink-0">
        [{log.layer}]
      </span>
      <span
        className={`font-bold w-[80px] shrink-0 flex gap-1 ${log.type === 'SUCCESS' ? 'text-emerald-400' : log.type === 'ERROR' ? 'text-amber-400' : 'text-blue-400'}`}
      >
        <span>{getStatusIcon()}</span>
        <span>[{log.type}]</span>
      </span>
      <span className="flex-1 break-words leading-relaxed">{log.message}</span>

      {hasSnapShot && <InspectIconUI />}

      {hasSnapShot && <LogSnippetUI />}
    </div>
  );
};
