interface ConnectionWireProp {
  isActive: boolean;
}

const ConnectionWireUI = ({ isActive }: ConnectionWireProp) => {
  return (
    <div className="flex-1 relative mx-4 flex items-center">
      {/* Base wire */}
      <div className="absolute w-full h-[2px] bg-slate-700"></div>
      
      {/* Glowing active wire */}
      <div
        className={`absolute w-full h-[3px] transition-all duration-300 ${
          isActive
            ? 'bg-emerald-400 shadow-[0_0_15px_rgba(52,211,153,0.8)] animate-pulse opacity-100'
            : 'bg-transparent opacity-0'
        }`}
      ></div>
    </div>
  );
};

export default ConnectionWireUI;
