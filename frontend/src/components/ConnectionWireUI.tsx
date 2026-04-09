interface ConnectionWireProp {
  isActive: boolean;
  direction?: 'forward' | 'backward';
}

const ConnectionWireUI = ({
  isActive,
  direction = 'forward',
}: ConnectionWireProp) => {
  return (
    <div className="flex-1 relative mx-2 h-16 flex items-center justify-center">
      <svg
        className="w-full h-full absolute top-0 left-0"
        preserveAspectRatio="none"
      >
        <line
          x1="0"
          y1="50%"
          x2="100%"
          y2="50%"
          stroke="currentColor"
          className="text-slate-800"
          strokeWidth="4"
          strokeDasharray="8 4"
        />

        {isActive && (
          <line
            x1="0"
            y1="50%"
            x2="100%"
            y2="50%"
            stroke="currentColor"
            className="text-blue-400 drop-shadow-[0_0_8px_rgba(96,165,250,0.8)]"
            strokeWidth="4"
            strokeDasharray="20 1000"
            strokeLinecap="round"
          >
            <animate
              attributeName="stroke-dashoffset"
              values={direction === 'forward' ? '1000;0' : '0;1000'}
              dur="0.6s"
              repeatCount="indefinite"
              timingFunction="linear"
            />
          </line>
        )}
      </svg>
    </div>
  );
};

export default ConnectionWireUI;
