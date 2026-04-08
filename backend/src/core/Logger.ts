// Types
import { LayerLevel, LogEntry, LogLevel } from '../types';

export class Logger {
  private logs: LogEntry[] = [];

  public log(
    layer: LayerLevel,
    message: string,
    type: LogLevel,
    packetSnapshot?: Record<string, any>,
  ): void {
    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      layer,
      message,
      type,
      packetSnapshot,
    };

    this.logs.push(entry);
    console.log(
      `[${entry.timestamp}] [${entry.layer}] [${entry.type}] ${entry.message}`,
    );
  }

  public getLogs(): LogEntry[] {
    return this.logs;
  }

  public clearLogs(): void {
    this.logs = [];
  }
}
