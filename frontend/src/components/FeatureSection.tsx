import {  Layers, Search, Zap } from 'lucide-react';
export const FeaturesSection = () => {
  const features = [
    { icon: Search, title: "Real-time Packet Inspection", desc: "Break open live packets as they traverse the network. Inspect IP headers, TCP flags, and payloads dynamically." },
    { icon: Layers, title: "Layer-by-Layer Architecture", desc: "Understand the OSI model intuitively. See exact transformations and encapsulations across all 7 layers of the stack." },
    { icon: Zap, title: "Bidirectional Protocol Simulation", desc: "Watch 3-way handshakes, acknowledge sequencing, and error handling in interactive, visual architectures." }
  ];

  return (
    <section id="features" className="py-24 bg-slate-950 relative z-10 border-t border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-white mb-4">Unpack the Infrastructure</h2>
          <p className="text-slate-400 max-w-2xl mx-auto">Explore protocols with absolute clarity using our zero-latency educational engine.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((f, i) => (
            <div key={i} className="p-6 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-indigo-500/30 transition-all hover:bg-white/[0.04] shadow-sm">
              <div className="w-12 h-12 rounded-lg bg-indigo-500/10 flex items-center justify-center mb-6">
                <f.icon className="w-6 h-6 text-indigo-400" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">{f.title}</h3>
              <p className="text-slate-400 text-sm leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};