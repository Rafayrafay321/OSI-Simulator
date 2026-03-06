// Interface for logging the packet.
export interface LogEntry {
  timestamp: string;
  message: string;
  layer: string;
  type: 'INFO' | 'SUCCESS' | 'ERROR';
}

export class Logger {
  private logs: LogEntry[] = [];

  public log(layer: string, message: string, type: 'INFO' | 'SUCCESS' | 'ERROR' = 'INFO'): void {
    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      layer,
      message,
      type,
    };
    this.logs.push(entry);
    console.log(`[${entry.timestamp}] [${entry.layer}] [${entry.type}] ${entry.message}`);
  }

  public getLogs(): LogEntry[] {
    return this.logs;
  }

  public clearLogs(): void {
    this.logs = [];
  }
}
