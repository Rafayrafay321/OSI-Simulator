import { type ElementType } from 'react';
import { motion } from 'framer-motion';
import { Monitor, Router as RouterIcon, Server } from 'lucide-react';

// --- Animation Configurations ---
const containerVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.15 } }
};

const nodeVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 100, damping: 15 } }
};

// --- Component Interfaces ---
interface NetworkNodeProps {
  icon: ElementType;
  label: string;
  x: number;
  y: number;
  colorClass?: string;
};

interface DataPulseProps {
  d: string;
  duration?: number;
  delay?: number;
  color?: string;
};

export const NetworkNode = ({ icon: Icon, label, x, y, colorClass }: NetworkNodeProps) => (
  <motion.div
    variants={nodeVariants}
    className="absolute flex flex-col items-center -translate-x-1/2 -translate-y-1/2"
    style={{ left: `${x}%`, top: `${y}%` }}
  >
    <div className="relative w-14 h-14 rounded-lg bg-slate-900 border-2 border-slate-700 flex items-center justify-center transition-colors duration-300 hover:border-slate-400 z-10">
      <Icon className={`w-7 h-7 ${colorClass}`} strokeWidth={2} />
    </div>
    <div className="mt-2 px-3 py-1 bg-slate-900 border border-slate-800 rounded shadow-sm relative z-10">
      <span className="text-[11px] font-mono font-medium text-slate-300 tracking-wider">{label}</span>
    </div>
  </motion.div>
);

export const DataPulse = ({ d, duration = 1.5, delay = 0, color = "#6366f1" }: DataPulseProps) => (
  <motion.path
    d={d} stroke={color} strokeWidth="2.5" strokeLinecap="round" fill="none"
    initial={{ pathLength: 0, opacity: 0 }}
    animate={{ pathLength: [0, 1], opacity: [0, 1, 0] }}
    transition={{ duration: duration, repeat: Infinity, ease: "linear", delay: delay, times: [0, 0.8, 1] }}
  />
);

export const NetworkTopology = () => (
  <div className="relative w-full aspect-[21/9] max-w-4xl mx-auto flex items-center justify-center">
    <motion.div
      className="relative w-full h-full bg-slate-950 rounded-xl border border-slate-800 shadow-lg overflow-hidden"
      variants={containerVariants} initial="hidden" animate="show"
    >
      <div className="absolute inset-0" style={{ backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.03) 1px, transparent 1px)', backgroundSize: '24px 24px' }}></div>

      <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 100 100" preserveAspectRatio="none">
        <path d="M 20 50 L 50 50" fill="none" stroke="#334155" strokeWidth="1.5" strokeDasharray="4 4" />
        <path d="M 50 50 L 80 50" fill="none" stroke="#334155" strokeWidth="1.5" strokeDasharray="4 4" />

        <DataPulse d="M 20 50 L 50 50" delay={0} duration={1.5} color="#ec4899" />
        <DataPulse d="M 50 50 L 80 50" delay={1.5} duration={1.5} color="#06b6d4" />

        <DataPulse d="M 80 50 L 50 50" delay={4.0} duration={1.5} color="#f59e0b" />
        <DataPulse d="M 50 50 L 20 50" delay={5.5} duration={1.5} color="#3b82f6" />
      </svg>


      <NetworkNode icon={Monitor} label="HOST_A" x={20} y={50} colorClass="text-pink-400" />
      <NetworkNode icon={RouterIcon} label="CORE_ROUTER" x={50} y={50} colorClass="text-slate-200" />
      <NetworkNode icon={Server} label="HOST_B" x={80} y={50} colorClass="text-cyan-400" />

    </motion.div>
  </div>
);