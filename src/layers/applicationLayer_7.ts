// Custom Import
import { BasePacket } from '../core/Packet';
import { ApplicationLayerData, LayerLevel } from '../types';
import { TransportLayer } from './transportLayer_4';

export class ApplicationLayer {
  public protocol: string;
  public method: string;
  public sender: string;
  private nextLayer: TransportLayer;

  constructor(options: ApplicationLayerData, nextLayer: TransportLayer) {
    this.protocol = options.protocol;
    this.method = options.method;
    this.sender = options.sender;
    this.nextLayer = nextLayer;
  }
  handleOutgoing = (packet: BasePacket, payload: string): void => {
    packet.addHeader(LayerLevel.APPLICATION, {
      protocol: this.protocol,
      method: this.method,
      sender: this.sender,
    });

    this.nextLayer.handleOutgoing(packet);
  };
  processLayer7Incoming = (packet: BasePacket) => {};
}
