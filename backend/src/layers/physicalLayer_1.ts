import { BasePacket } from '../core/Packet';
import { Logger } from '../core/Logger';
import { LayerLevel, LogLevel } from '../types';

export class PhysicalLayer {
  private logger: Logger;

  constructor(logger: Logger) {
    this.logger = logger;
  }
  private serializePacket(packet: BasePacket): string {
    // In a real implementation, this would convert the packet into a stream of bits.
    return JSON.stringify(packet);
  }

  public handleOutgoing(packet: BasePacket) {
    let payload = packet.payload as string;
    if (payload) {
      this.logger.log(
        LayerLevel.DATA_LINK,
        'Payload can not be empty',
        LogLevel.ERROR,
      );
      throw new Error('Payload can not be empty');
    }

    this.logger.log(
      LayerLevel.PHYSICAL,
      'Handling outgoing packet.',
      LogLevel.INFO,
    );
    // Simulate sending data over a network
    const rawData = this.serializePacket(packet);
    this.logger.log(
      LayerLevel.APPLICATION,
      `Transmitting ${rawData.length} bytes.`,
      LogLevel.INFO,
    );

    this.handleIncoming(packet, payload); // Loopback for simulation
  }

  public handleIncoming(packet: BasePacket, incomingPayload: string) {
    this.logger.log(
      LayerLevel.PHYSICAL,
      'Handling incoming packet.',
      LogLevel.INFO,
    );

    packet.setPayload(incomingPayload);
    packet.metadata.currentLayer = LayerLevel.DATA_LINK;
    // In a real scenario, this would deserialize the raw data
    this.logger.log(LayerLevel.PHYSICAL, 'Received raw data.', LogLevel.INFO);
  }
}
