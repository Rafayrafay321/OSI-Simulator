import { NetworkTopology } from "./NetworkTopology";

export const HeroSection = () => {
    return (
        <main className="pt-32 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto relative z-10 overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
                <div className="space-y-8">
                    <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-slate-900 border border-slate-800">
                        <span className="flex w-2 h-2 rounded-full bg-indigo-500 animate-pulse"></span>
                        <span className="text-xs font-medium text-slate-400">Interactive OSI Learning Platform</span>
                    </div>

                    <h1 className="text-5xl lg:text-6xl lg:leading-[1.1] font-bold text-white tracking-tight">
                        Network Protocols, <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">
                            Visualized
                        </span> and Simplified.
                    </h1>

                    <p className="text-lg text-slate-400 max-w-xl leading-relaxed">
                        Packetforge helps students and educators understand networking concepts through structured, visual simulations. Transform complex abstract architecture into clear mental models.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-4 pt-4">
                        <button className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-medium transition-colors shadow-[0_0_30px_rgba(99,102,241,0.2)]">
                            Start Sandbox Free
                        </button>
                        <button className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-slate-900/80 backdrop-blur-sm hover:bg-slate-800 text-slate-300 font-medium border border-slate-800 transition-colors">
                            View Architecture
                        </button>
                    </div>
                </div>

                <NetworkTopology />
            </div>
        </main>
    );
}