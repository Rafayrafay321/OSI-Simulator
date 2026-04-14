import { useRef } from 'react';
import { motion, useScroll, useTransform, MotionValue } from 'framer-motion';

interface PacketLayerProps {
  width: MotionValue<string>;
  opacity: MotionValue<number>;
  label: string;
  bg: string;
  text: string;
}

export const PacketLayer = ({ width, opacity, label, bg, text }: PacketLayerProps) => (
  <motion.div
    style={{ width, opacity }}
    className={`${bg} ${text} flex items-center justify-center font-mono text-xs font-bold shrink-0 overflow-hidden shadow-inner border border-white/10`}
  >
    <div className="min-w-max px-2">{label}</div>
  </motion.div>
);

export const JourneySection = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  // Title
  const titleOp = useTransform(scrollYProgress, [0, 0.05, 0.95, 1], [0, 1, 1, 0]);
  const titleY = useTransform(scrollYProgress, [0, 0.05, 0.95, 1], ["20px", "0px", "0px", "-20px"]);

  // Layer 1
  const text1Op = useTransform(scrollYProgress, [0, 0.15, 0.18, 1], [1, 1, 0, 0]);
  const text1Y = useTransform(scrollYProgress, [0, 0.15, 0.18, 1], ["0px", "0px", "-40px", "-40px"]);

  // Layer 2
  const text2Op = useTransform(scrollYProgress, [0, 0.18, 0.20, 0.35, 0.38, 1], [0, 0, 1, 1, 0, 0]);
  const text2Y = useTransform(scrollYProgress, [0, 0.18, 0.20, 0.35, 0.38, 1], ["40px", "40px", "0px", "0px", "-40px", "-40px"]);

  // Layer 3
  const text3Op = useTransform(scrollYProgress, [0, 0.38, 0.40, 0.55, 0.58, 1], [0, 0, 1, 1, 0, 0]);
  const text3Y = useTransform(scrollYProgress, [0, 0.38, 0.40, 0.55, 0.58, 1], ["40px", "40px", "0px", "0px", "-40px", "-40px"]);

  // Layer 4
  const text4Op = useTransform(scrollYProgress, [0, 0.58, 0.60, 0.75, 0.78, 1], [0, 0, 1, 1, 0, 0]);
  const text4Y = useTransform(scrollYProgress, [0, 0.58, 0.60, 0.75, 0.78, 1], ["40px", "40px", "0px", "0px", "-40px", "-40px"]);

  // Layer 5
  const text5Op = useTransform(scrollYProgress, [0, 0.78, 0.80, 1], [0, 0, 1, 1]);
  const text5Y = useTransform(scrollYProgress, [0, 0.78, 0.80, 1], ["40px", "40px", "0px", "0px"]);

  // Visual Graphics
  const tcpWidth = useTransform(scrollYProgress, [0, 0.20, 0.23, 1], ["0px", "0px", "80px", "80px"]);
  const tcpOp = useTransform(scrollYProgress, [0, 0.20, 0.23, 1], [0, 0, 1, 1]);

  const ipWidth = useTransform(scrollYProgress, [0, 0.40, 0.43, 1], ["0px", "0px", "80px", "80px"]);
  const ipOp = useTransform(scrollYProgress, [0, 0.40, 0.43, 1], [0, 0, 1, 1]);

  const macWidth = useTransform(scrollYProgress, [0, 0.60, 0.63, 1], ["0px", "0px", "80px", "80px"]);
  const macOp = useTransform(scrollYProgress, [0, 0.60, 0.63, 1], [0, 0, 1, 1]);

  const fcsWidth = useTransform(scrollYProgress, [0, 0.60, 0.63, 1], ["0px", "0px", "60px", "60px"]);
  const fcsOp = useTransform(scrollYProgress, [0, 0.60, 0.63, 1], [0, 0, 1, 1]);

  // Final bits dissolve
  const packetOp = useTransform(scrollYProgress, [0, 0.80, 0.83, 1], [1, 1, 0, 0]);
  const packetScale = useTransform(scrollYProgress, [0, 0.80, 0.83, 1], [1, 1, 0.95, 0.95]);
  const bitsOp = useTransform(scrollYProgress, [0, 0.80, 0.83, 1], [0, 0, 1, 1]);
  const bitsY = useTransform(scrollYProgress, [0, 0.80, 1], ["20px", "20px", "-20px"]);

  return (
    <div ref={containerRef} className="h-[500vh] bg-slate-950 relative border-t border-white/5">
      <div className="sticky top-0 h-screen flex flex-col md:flex-row items-center justify-center max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <motion.div style={{ opacity: titleOp, y: titleY }} className="absolute top-24 left-0 w-full text-center z-30 pointer-events-none px-4">
          <h2 className="text-3xl md:text-5xl font-bold text-white tracking-tight">The Journey of a Packet</h2>
        </motion.div>

        {/* Left: Sticky Text Container */}
        <div className="w-full md:w-5/12 h-full md:h-full relative flex items-center">

          <motion.div style={{ opacity: text1Op, y: text1Y }} className="absolute top-0 left-0 md:pr-12 pointer-events-none w-full flex flex-col justify-center text-center md:text-left h-full pb-10 md:pb-0">
            <h3 className="text-sm font-bold text-indigo-400 tracking-wider uppercase mb-2">Step 1 — Application Layer</h3>
            <h2 className="text-3xl font-bold text-white mb-4">Raw Data Generation</h2>
            <p className="text-slate-400 leading-relaxed text-lg max-w-sm mx-auto md:mx-0">The user generates a request. At this high-level, it assumes the form of raw, unstructured data ready for network transmission.</p>
          </motion.div>

          <motion.div style={{ opacity: text2Op, y: text2Y }} className="absolute top-0 left-0 md:pr-12 pointer-events-none w-full flex flex-col justify-center text-center md:text-left h-full pb-10 md:pb-0">
            <h3 className="text-sm font-bold text-cyan-400 tracking-wider uppercase mb-2">Step 2 — Transport Layer</h3>
            <h2 className="text-3xl font-bold text-white mb-4">Segment Formation</h2>
            <p className="text-slate-400 leading-relaxed text-lg max-w-sm mx-auto md:mx-0">TCP encapsulates the data, adding source and destination ports. This initiates the 'Segmentation' reliable delivery layer.</p>
          </motion.div>

          <motion.div style={{ opacity: text3Op, y: text3Y }} className="absolute top-0 left-0 md:pr-12 pointer-events-none w-full flex flex-col justify-center text-center md:text-left h-full pb-10 md:pb-0">
            <h3 className="text-sm font-bold text-amber-400 tracking-wider uppercase mb-2">Step 3 — Network Layer</h3>
            <h2 className="text-3xl font-bold text-white mb-4">Packet Formation</h2>
            <p className="text-slate-400 leading-relaxed text-lg max-w-sm mx-auto md:mx-0">IP addressing is applied for logical routing. The segment has now been converted into a 'Packet'.</p>
          </motion.div>

          <motion.div style={{ opacity: text4Op, y: text4Y }} className="absolute top-0 left-0 md:pr-12 pointer-events-none w-full flex flex-col justify-center text-center md:text-left h-full pb-10 md:pb-0">
            <h3 className="text-sm font-bold text-blue-400 tracking-wider uppercase mb-2">Step 4 — Data Link Layer</h3>
            <h2 className="text-3xl font-bold text-white mb-4">Frame Formation</h2>
            <p className="text-slate-400 leading-relaxed text-lg max-w-sm mx-auto md:mx-0">Hardware MAC addressing is added to the front, and a Frame Check Sequence (FCS) trailer to the end, forming the final 'Frame'.</p>
          </motion.div>

          <motion.div style={{ opacity: text5Op, y: text5Y }} className="absolute top-0 left-0 md:pr-12 pointer-events-none w-full flex flex-col justify-center text-center md:text-left h-full pb-10 md:pb-0">
            <h3 className="text-sm font-bold text-emerald-400 tracking-wider uppercase mb-2">Step 5 — Physical Layer</h3>
            <h2 className="text-3xl font-bold text-white mb-4">Transmission to Interconnects</h2>
            <p className="text-slate-400 leading-relaxed text-lg max-w-sm mx-auto md:mx-0">The fully structured frame smoothly dissolves into raw electrical bits, preparing to traverse the physical medium.</p>
          </motion.div>

        </div>

        {/* Right: Graphic Container */}
        <div className="w-full md:w-7/12 h-2/3 md:h-full flex items-center justify-center md:justify-end">
          <div className="relative w-full max-w-lg aspect-[4/3] flex flex-col items-center justify-center p-8 bg-slate-900 border border-white/5 rounded-2xl shadow-xl overflow-hidden">

            {/* The Packet Visualization */}
            <motion.div style={{ opacity: packetOp, scale: packetScale }} className="flex flex-col items-center gap-6 w-full">

              <div className="h-8 relative w-full">
                <motion.div style={{ opacity: text1Op }} className="absolute top-0 w-full text-center font-mono text-sm tracking-widest text-slate-500 font-bold">RAW DATA</motion.div>
                <motion.div style={{ opacity: text2Op }} className="absolute top-0 w-full text-center font-mono text-sm tracking-widest text-cyan-400 font-bold">SEGMENT</motion.div>
                <motion.div style={{ opacity: text3Op }} className="absolute top-0 w-full text-center font-mono text-sm tracking-widest text-amber-400 font-bold">PACKET</motion.div>
                <motion.div style={{ opacity: text4Op }} className="absolute top-0 w-full text-center font-mono text-sm tracking-widest text-blue-400 font-bold">FRAME</motion.div>
              </div>

              {/* Encapsulation Blocks Layered */}
              <div className="flex items-stretch shadow-2xl border border-white/10 rounded-xl bg-slate-950 overflow-hidden shrink-0">
                <PacketLayer width={macWidth} opacity={macOp} label="MAC" bg="bg-blue-500/80" text="text-white" />
                <PacketLayer width={ipWidth} opacity={ipOp} label="IP Header" bg="bg-amber-500/80" text="text-white" />
                <PacketLayer width={tcpWidth} opacity={tcpOp} label="TCP" bg="bg-cyan-500/80" text="text-white" />

                <div className="w-[120px] bg-pink-500/80 text-white flex items-center justify-center font-mono text-xs font-bold py-6 px-2 shadow-inner border border-white/10 shrink-0">
                  DATA
                </div>

                <PacketLayer width={fcsWidth} opacity={fcsOp} label="FCS" bg="bg-blue-500/80" text="text-white" />
              </div>
            </motion.div>

            {/* The Bits Visualization */}
            <motion.div style={{ opacity: bitsOp, y: bitsY }} className="absolute inset-0 flex items-center justify-center pointer-events-none p-12">
              <div className="font-mono text-slate-300/80 tracking-[0.5em] text-lg max-w-full break-all text-center leading-[2.5]">
                1 0 1 1 0 0 1 0 1 1 0 0 0 0 1 0 1 1 1 1 0 0 1 1 0 0 1 0
              </div>
            </motion.div>

          </div>
        </div>

      </div>
    </div>
  );
};