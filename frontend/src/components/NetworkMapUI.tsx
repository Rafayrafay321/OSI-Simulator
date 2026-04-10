import ServerNode from './ServerNodeUI';
import ConnectionWireUI from './ConnectionWireUI';
import { LayerLevel, type LogEntry } from '../../../backend/src/types';

import { useState, useEffect } from 'react';

interface NetworkMapProps {
  logs: LogEntry[];
  currentIndex: number;
  srcIpAddress: string;
  destIpAddress: string;
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

const NetworkMapUI = ({
  logs,
  currentIndex,
  srcIpAddress,
  destIpAddress,
}: NetworkMapProps) => {
  const [activeNode, setActiveNode] = useState<string | null>('hostA');

  // Determine active node based on current index
  useEffect(() => {
    if (logs.length === 0) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
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
    <div className="w-full bg-slate-900 rounded-xl p-8 border border-slate-800 shadow-lg shadow-black/40 bg-gradient-to-b from-white/[0.03] to-transparent shadow-[inset_0_1px_0_rgba(255,255,255,0.05)] mb-8 relative overflow-hidden">
      <h2 className="text-lg font-semibold text-slate-200 mb-10 text-center tracking-tight relative z-10">
        Live Network Topology
      </h2>

      <div className="flex items-center justify-between max-w-6xl mx-auto relative z-10 px-4">
        <ServerNode
          label="Host A"
          type="host"
          colorClass="bg-slate-800"
          statusColor="bg-emerald-500"
          isActive={activeNode === 'hostA' || activeNode === 'linkA'}
          ipAddress={srcIpAddress}
          macAddress="AA:AA:AA:AA:AA:AA"
          activePort={0}
        />

        <ConnectionWireUI
          isActive={activeNode === 'linkA'}
          direction="forward"
        />

        <ServerNode
          label="Router"
          type="router"
          colorClass="bg-slate-800"
          statusColor="bg-emerald-500"
          isActive={
            activeNode === 'router' ||
            activeNode === 'linkA' ||
            activeNode === 'linkB'
          }
          ipAddress="192.168.1.1"
          macAddress="00:00:5E:00:53:AA"
          activePort={activeNode === 'linkB' ? 1 : 0}
        />

        <ConnectionWireUI
          isActive={activeNode === 'linkB'}
          direction="forward"
        />

        <ServerNode
          label="Host B"
          type="host"
          colorClass="bg-slate-800"
          statusColor="bg-emerald-500"
          isActive={activeNode === 'hostB' || activeNode === 'linkB'}
          ipAddress={destIpAddress}
          macAddress="BB:BB:BB:BB:BB:BB"
          activePort={0}
        />
      </div>
    </div>
  );
};

export default NetworkMapUI;
