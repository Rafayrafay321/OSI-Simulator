import ServerNode from './ServerNodeUI';
import ConnectionWireUI from './ConnectionWireUI';
import { LayerLevel, type LogEntry } from '../../../backend/src/types';

import { useState, useEffect } from 'react';

interface NetworkMapProps {
  logs: LogEntry[];
  currentIndex: number;
}

const determineActiveNode = (
  log: LogEntry,
  index: number,
  total: number,
): 'hostA' | 'router' | 'hostB' | 'linkA' | 'linkB' | null => {
  if (!log) return null;
  const message = log.message;
  const progress = index / total;

  if (message.includes('Transmission: HostA -> RouterA')) return 'linkA';
  if (message.includes('Transmission: RouterA -> HostB')) return 'linkB';

  switch (log.layer) {
    case LayerLevel.APPLICATION:
    case LayerLevel.TRANSPORT:
      return progress < 0.5 ? 'hostA' : 'hostB';

    case LayerLevel.DATA_LINK:
    case LayerLevel.NETWORK:
    case LayerLevel.PHYSICAL:
      if (progress < 0.3) return 'hostA';
      if (progress > 0.7) return 'hostB';
      return 'router';
    default:
      return null;
  }
};

const NetworkMapUI = ({ logs, currentIndex }: NetworkMapProps) => {
  const [activeNode, setActiveNode] = useState<string | null>('hostA');

  // Determine active node based on current index
  useEffect(() => {
    if (logs.length === 0) {
      setActiveNode(null);
      return;
    }
    
    if (!logs[currentIndex]) return;

    const calculatedNode = determineActiveNode(
      logs[currentIndex],
      currentIndex,
      logs.length,
    );

    if (calculatedNode) setActiveNode(calculatedNode);
  }, [currentIndex, logs]);

  return (
    <div className="w-full bg-slate-900 rounded-xl p-8 border border-slate-800 shadow-2xl mb-8 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-900/20 via-slate-900/0 to-slate-900/0 pointer-events-none"></div>

      <h2 className="text-xl font-bold text-slate-200 mb-10 text-center uppercase tracking-widest text-sm relative z-10">
        Live Network Topology
      </h2>

      <div className="flex items-center justify-between max-w-5xl mx-auto relative z-10">
        <ServerNode
          label="Host A"
          type="host"
          colorClass="bg-gradient-to-b from-blue-600 to-slate-900"
          statusColor="bg-slate-500"
          isActive={activeNode === 'hostA'}
        />

        <ConnectionWireUI isActive={activeNode === 'linkA'} />

        <ServerNode
          label="Router"
          type="router"
          colorClass="bg-gradient-to-b from-slate-700 to-slate-900"
          statusColor="bg-slate-500"
          isActive={activeNode === 'router'}
        />

        <ConnectionWireUI isActive={activeNode === 'linkB'} />

        <ServerNode
          label="Host B"
          type="host"
          colorClass="bg-gradient-to-b from-indigo-600 to-slate-900"
          statusColor="bg-slate-500"
          isActive={activeNode === 'hostB'}
        />
      </div>
    </div>
  );
};

export default NetworkMapUI;
