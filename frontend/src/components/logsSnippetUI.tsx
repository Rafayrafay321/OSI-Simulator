import type React from 'react';

export const LogSnippetUI: React.FC = () => {
  return (
    <div className="absolute bottom-full right-4 mb-1 p-2 bg-slate-900 border border-slate-700 rounded shadow-lg shadow-black/60 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-150 translate-y-1 group-hover:translate-y-0 z-50 whitespace-nowrap pointer-events-none flex flex-col gap-1 text-[10px] font-mono text-slate-300">
      <div className="flex items-center gap-1 font-bold text-emerald-400 mt-1 font-sans">
        <svg
          className="w-3 h-3"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
          />
        </svg>
        Click to Inspect
      </div>
    </div>
  );
};
