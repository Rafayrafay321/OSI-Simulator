import { BasePacket } from '../core/Packet';
import { Logger } from '../core/Logger';
import { LayerLevel } from '../types';

export class PhysicalLayer {
  private logger: Logger;

  constructor(logger: Logger) {
    this.logger = logger;
  }

  public handleOutgoing(packet: BasePacket) {
    this.logger.log('PhysicalLayer', 'Handling outgoing packet.');
    // Simulate sending data over a network
    const rawData = this.serializePacket(packet);
    this.logger.log('PhysicalLayer', `Transmitting ${rawData.length} bytes.`);
    this.handleIncoming(packet); // Loopback for simulation
  }

  public handleIncoming(packet: BasePacket) {
    this.logger.log('PhysicalLayer', 'Handling incoming packet.');
    packet.metadata.currentLayer = LayerLevel.PHYSICAL;
    // In a real scenario, this would deserialize the raw data
    // and pass it up to the DataLinkLayer.
    // For simulation, we just log.
    this.logger.log('PhysicalLayer', 'Received raw data.');
  }

  private serializePacket(packet: BasePacket): string {
    // In a real implementation, this would convert the packet into a stream of bits.
    // For this simulation, we'll just stringify the JSON object.
    return JSON.stringify(packet);
  }
}
