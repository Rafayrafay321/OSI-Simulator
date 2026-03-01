// Interface for logging the packet.
export interface LogEntry {
  timestamp: string;
  message: string;
  layer: string;
  type: 'INFO' | 'SUCCESS' | 'ERROR';
}
