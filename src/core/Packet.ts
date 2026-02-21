// Types and Interfaces
import { Header } from './Header';
import { PacketMetaData } from './Metadata';
import { LogEntry } from './Logger';
import { PacketDirection, PacketStatus } from './Metadata';

export class BasePacket {
  public payload: string;
  public headers: Header[] = [];
  public metadata: PacketMetaData;
  public logHistory: LogEntry[] = [];

  constructor(payload: string) {
    this.payload = payload;
    this.metadata = {
      currentLayer: '',
      direction: PacketDirection.SENDER_TO_RECEIVER,
      status: PacketStatus.HEALTHY,
    };
  }

  // TODO Each layer should define its own data interface addHeader should stay generic
  // TODO layer validation

  public addHeader(layerName: string, data: Record<string, any>): void {
    const headerObject: Header = {
      layerName,
      data,
    };

    const loggerObject: LogEntry = {
      layer: layerName,
      message: `[Layer: ${layerName}] ENCAPSULATION_SUCCESS: Added headers.`,
      timestamp: new Date().toISOString(),
      type: 'INFO',
    };
    this.headers.push(headerObject);

    this.metadata.currentLayer = layerName;

    this.logHistory.push(loggerObject);
  }
}
