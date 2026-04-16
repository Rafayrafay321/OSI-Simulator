import EventEmitter from 'node:events';
// Types
import { LayerLevel, LogEntry, LogLevel } from '../types';

export class Logger extends EventEmitter {
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
    this.emit('Packet Dispatched', entry);
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
