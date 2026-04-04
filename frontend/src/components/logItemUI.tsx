import type { LogEntry } from '../../../backend/src/types';

export const LogItem = ({ log }: { log: LogEntry }) => {
  return (
    <div style={{ color: log.type === 'ERROR' ? 'red' : 'black' }}>
      <strong>{log.layer}</strong>: {log.message}
    </div>
  );
};
