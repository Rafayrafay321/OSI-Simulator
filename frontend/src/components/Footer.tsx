import { Activity } from 'lucide-react';
export const Footer = () => (
  <footer className="bg-slate-950 py-12 border-t border-white/5">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between">
      <div className="flex items-center space-x-2 opacity-70">
        <Activity className="h-5 w-5 text-indigo-400" />
        <span className="font-semibold text-slate-300">Packetforge</span>
      </div>
      <div className="mt-4 md:mt-0 text-sm text-slate-500">
        © 2026 Packetforge Educational Systems. Open architecture.
      </div>
    </div>
  </footer>
);