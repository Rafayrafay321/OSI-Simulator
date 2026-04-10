import React, { useState } from 'react';
import type { Header, LogEntry } from '../../../backend/src/types';

interface PacketInspectorProps {
  log: LogEntry | null;
  stepIndex?: number;
  packetSize: number;
}

const SyntaxHighlightedJson = ({ data }: { data: Record<string, string> }) => {
  const jsonStr = JSON.stringify(data, null, 2);
  const highlighted = jsonStr
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(
      /("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+-]?\d+)?)/g,
      (match) => {
        let cls = 'text-amber-300';
        if (/^"/.test(match)) {
          if (/:$/.test(match)) {
            cls = 'text-blue-400';
          } else {
            cls = 'text-emerald-400';
          }
        } else if (/true|false/.test(match)) {
          cls = 'text-pink-400';
        } else if (/null/.test(match)) {
          cls = 'text-slate-500';
        }
        return `<span class="${cls}">${match}</span>`;
      },
    );

  return (
    <pre
      className="text-xs font-mono whitespace-pre-wrap break-all"
      dangerouslySetInnerHTML={{ __html: highlighted }}
    />
  );
};

export const PacketInspectorUI: React.FC<PacketInspectorProps> = ({
  log,
  stepIndex,
  packetSize,
}) => {
  const [copied, setCopied] = useState(false);
  const [expandedAll, setExpandedAll] = useState(true);

  if (!log || !log.packetSnapshot) {
    return null;
  }

  const snapshot = log.packetSnapshot;
  const time = new Date(log.timestamp).toLocaleTimeString([], {
    hour12: false,
    fractionalSecondDigits: 3,
  });

  const handleCopy = () => {
    navigator.clipboard.writeText(JSON.stringify(snapshot, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="w-full max-w-7xl mx-auto bg-slate-900 rounded-xl border border-slate-800 shadow-lg shadow-black/40 bg-gradient-to-b from-white/[0.03] to-transparent shadow-[inset_0_1px_0_rgba(255,255,255,0.05)] mb-12 animate-in fade-in slide-in-from-bottom-4 duration-200 overflow-hidden flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-slate-800 bg-slate-900/50">
        <div className="flex items-center gap-4">
          <h2 className="text-lg font-semibold text-slate-200 flex items-center tracking-tight">
            <span className="text-blue-500 mr-2">🔍</span> Packet Inspector
          </h2>
          <div className="h-4 w-px bg-slate-700"></div>
          <span className="font-mono text-xs text-slate-400">
            STEP {stepIndex !== undefined ? stepIndex + 1 : '--'}
          </span>
          <span className="font-mono text-xs text-slate-400">{time}</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs font-mono text-slate-400 bg-slate-950 border border-slate-800 px-2 py-1 rounded shadow-[inset_0_1px_2px_rgba(0,0,0,0.5)]">
            {packetSize} Bytes
          </span>
          <span className="font-mono text-xs font-bold text-blue-400 bg-blue-900/20 border border-blue-500/30 px-2.5 py-1 rounded">
            {log.layer}
          </span>
        </div>
      </div>

      <p className="text-slate-300 p-4 font-mono text-sm border-b border-slate-800 bg-slate-900">
        <span className="border-l-2 border-blue-500 pl-3 block">
          {log.message}
        </span>
      </p>

      {/* Main Content Split */}
      <div className="flex flex-col lg:flex-row max-h-[500px]">
        {/* Left Panel: Structured Breakdown */}
        <div className="w-full lg:w-1/2 p-4 border-r border-slate-800 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-slate-300">
              Structured Breakdown
            </h3>
            <button
              onClick={() => setExpandedAll(!expandedAll)}
              className="text-xs text-blue-400 hover:text-blue-300 transition-colors"
            >
              {expandedAll ? 'Collapse All' : 'Expand All'}
            </button>
          </div>

          <div className="space-y-3">
            {/* Metadata Section */}
            {snapshot.metadata && (
              <details
                className="group border border-slate-800 rounded bg-slate-950/50"
                open={expandedAll}
              >
                <summary className="text-xs font-semibold text-slate-300 cursor-pointer p-2.5 bg-slate-800/50 hover:bg-slate-800 transition-colors select-none flex items-center justify-between">
                  Metadata
                  <span className="text-slate-500 group-open:rotate-180 transition-transform">
                    ▼
                  </span>
                </summary>
                <div className="p-3 border-t border-slate-800 text-xs font-mono text-slate-400 space-y-1.5">
                  {Object.entries(snapshot.metadata).map(([k, v]) => (
                    <div key={k} className="flex justify-between">
                      <span className="text-slate-500">{k}:</span>
                      <span className="text-slate-300">{String(v)}</span>
                    </div>
                  ))}
                </div>
              </details>
            )}
            {/* // TODO Highlight the changed headers eg: TTL */}
            {/* Headers Section */}
            {snapshot.headers &&
              Array.isArray(snapshot.headers) &&
              snapshot.headers.map((h: Header, i: number) => (
                <details
                  key={i}
                  className="group border border-slate-800/60 rounded-lg bg-slate-900/30 mb-2 overflow-hidden transition-all duration-200"
                  open={expandedAll}
                >
                  <summary className="text-xs font-bold text-slate-300 cursor-pointer p-3 bg-slate-800/40 hover:bg-slate-800/70 transition-all select-none flex items-center justify-between group-open:border-b group-open:border-slate-800">
                    <div className="flex items-center gap-3">
                      {/* Subtle Layer Badge */}
                      <span className="bg-slate-700 text-[10px] px-1.5 py-0.5 rounded text-slate-400 uppercase tracking-wider">
                        L{i + 1}
                      </span>
                      <span>
                        {h.layerName
                          ? `${h.layerName} Header`
                          : `Header ${i + 1}`}
                      </span>
                    </div>
                    <span className="text-slate-500 group-open:rotate-180 transition-transform duration-200 ease-in-out">
                      <svg
                        xmlns="http://w3.org"
                        className="h-3 w-3"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={3}
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </span>
                  </summary>

                  <div className="p-4 bg-slate-950/40 text-[11px] font-mono space-y-2.5 leading-relaxed">
                    {Object.entries(h)
                      .filter(([k]) => k !== 'layerName')
                      .map(([k, v]) => (
                        <div
                          key={k}
                          className="flex border-b border-slate-800/30 pb-1.5 last:border-0 last:pb-0 group/row hover:bg-white/[0.02]"
                        >
                          <span className="text-slate-500 w-32 shrink-0">
                            {k}:
                          </span>

                          <div className="flex-1 break-all">
                            {typeof v !== 'object' || v === null ? (
                              <span
                                className={
                                  typeof v === 'number'
                                    ? 'text-blue-400'
                                    : 'text-amber-400 font-medium'
                                }
                              >
                                {String(v)}
                              </span>
                            ) : (
                              <div className="bg-slate-900/50 rounded p-2 mt-1 border border-slate-800">
                                <SyntaxHighlightedJson data={v} />
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                  </div>
                </details>
              ))}

            {/* Payload Section */}
            {snapshot.payload && (
              <details
                className="group border border-slate-800 rounded bg-slate-950/50"
                open={expandedAll}
              >
                <summary className="text-xs font-semibold text-slate-300 cursor-pointer p-2.5 bg-slate-800/50 hover:bg-slate-800 transition-colors select-none flex items-center justify-between">
                  Payload
                  <span className="text-slate-500 group-open:rotate-180 transition-transform">
                    ▼
                  </span>
                </summary>
                <div className="p-3 border-t border-slate-800 text-xs font-mono text-emerald-400 break-all">
                  {typeof snapshot.payload === 'object'
                    ? JSON.stringify(snapshot.payload)
                    : String(snapshot.payload)}
                </div>
              </details>
            )}
          </div>
        </div>

        {/* Right Panel: Raw JSON */}
        <div className="w-full lg:w-1/2 p-4 bg-slate-950 flex flex-col overflow-hidden shadow-[inset_1px_0_10px_rgba(0,0,0,0.5)]">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-slate-300">Raw JSON</h3>
            <button
              onClick={handleCopy}
              className="flex items-center gap-1 px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded text-xs font-semibold text-slate-300 transition-colors active:scale-95 shadow-sm shadow-black/30"
            >
              {copied ? (
                <span className="text-emerald-400">Copied!</span>
              ) : (
                <span>Copy</span>
              )}
            </button>
          </div>
          <div className="flex-1 overflow-auto scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent bg-slate-900/50 rounded border border-slate-800 p-4 shadow-[inset_0_1px_3px_rgba(0,0,0,0.5)]">
            <SyntaxHighlightedJson data={snapshot} />
          </div>
        </div>
      </div>
    </div>
  );
};
