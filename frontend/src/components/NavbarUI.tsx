import { Activity } from 'lucide-react';

export const NavbarUI = () => {

  return (
    <nav className="fixed top-0 w-full z-50 bg-slate-950/60 backdrop-blur-xl border-b border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-3 group cursor-pointer">
            <div className="w-8 h-8 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center group-hover:bg-indigo-500/20 transition-colors">
              <Activity className="h-5 w-5 text-indigo-400 group-hover:text-indigo-300" />
            </div>
            <span className="font-semibold text-lg text-slate-100 tracking-tight">Packetforge</span>
          </div>
          <div className="hidden md:flex items-center space-x-10">
            <a href="#features" className="text-sm font-medium text-slate-400 hover:text-white transition-colors">Features</a>
            <a href="#journey" className="text-sm font-medium text-slate-400 hover:text-white transition-colors">Journey</a>
            <button className="px-5 py-2 rounded-lg bg-white text-slate-950 text-sm font-semibold hover:bg-slate-200 transition-colors shadow-[0_0_20px_rgba(255,255,255,0.1)]">
              Start Free
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default NavbarUI;
