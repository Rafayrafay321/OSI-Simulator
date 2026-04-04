import type { LogEntry } from '../../../backend/src/types';

export const LogItem = ({ log }: { log: LogEntry }) => {
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
    <div className={`p-3 my-1 font-mono text-sm rounded shadow-sm flex items-start space-x-3 ${getLogStyle()}`}>
      <span className="text-gray-500 whitespace-nowrap">[{formattedTime}]</span>
      <span className="font-bold min-w-[120px]">[{log.layer}]</span>
      <span className="flex-1">{log.message}</span>
    </div>
  );
};
