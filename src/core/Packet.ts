// Types and Interfaces
import { Header, LayerData } from '../types';
import {
  PacketMetaData,
  PacketDirection,
  PacketStatus,
  LayerLevel,
} from '../types';
import { LogEntry, LogLevel } from '../types';

export class BasePacket {
  public payload?: string;
  public headers: Header[] = [];
  public metadata: PacketMetaData;
  public logHistory: LogEntry[] = [];

  constructor() {
    this.metadata = {
      currentLayer: LayerLevel.APPLICATION,
      direction: PacketDirection.SENDER_TO_RECEIVER,
      status: PacketStatus.HEALTHY,
    };

    this.addLog(LayerLevel.APPLICATION, 'Packet created', LogLevel.INFO);
  }

  // Centralized, private logging helper
  private addLog(layer: LayerLevel, message: string, type: LogLevel): void {
    const logEntry: LogEntry = {
      layer,
      message,
      timestamp: new Date().toISOString(),
      type,
    };

    this.logHistory.push(logEntry);
  }

  public to16BitChuck(data: string): number[] {
    const encoder = new TextEncoder();
    // Convert string into bytes before bits.
    const databytes = encoder.encode(data);

    // Divide into 16 bit chucks
    const chuncks: number[] = [];
    for (let i = 0; i < databytes.length; i += 2) {
      const high = databytes[i];
      const low = databytes[i + 1] ?? 0;

      const chunck16 = (high << 8) | low;
      chuncks.push(chunck16);
    }
    return chuncks;
  }

  // For setting Payload
  public setPayload(payload: string) {
    this.payload = payload;
  }

  // For getting the payLoadSize Gradually
  public getPayloadSize(): number {
    if (!this.payload) {
      throw new Error('Payload does not exists');
    }
    return this.payload.length + this.headers.length;
  }

  // For cloning the Packet
  public clone(): BasePacket {
    const newPacket = new BasePacket();
    newPacket.payload = this.payload;
    newPacket.headers = [...this.headers];
    newPacket.metadata = { ...this.metadata };
    newPacket.logHistory = [...this.logHistory];
    return newPacket;
  }

  // Generic header attachment API
  public addHeader(layerName: LayerLevel, data: LayerData): void {
    const header: Header = {
      layerName,
      data,
    };

    this.headers.push(header);
    this.metadata.currentLayer = layerName;

    this.addLog(
      layerName,
      `Header attached at layer ${layerName}`,
      LogLevel.INFO,
    );
  }

  //TODO: Method for removing headers for incomming.
}
