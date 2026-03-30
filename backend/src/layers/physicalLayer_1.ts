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
    if (typeof packet.payload !== 'string') {
      const errorMsg = 'Payload must be a string.';
      this.logger.log(LayerLevel.PHYSICAL, errorMsg, LogLevel.ERROR);
      throw new Error(errorMsg);
    }

    this.logger.log(
      LayerLevel.PHYSICAL,
      'Handling outgoing packet.',
      LogLevel.INFO,
    );

    const rawData = this.serializePacket(packet);
    this.logger.log(
      LayerLevel.PHYSICAL,
      `Transmitting ${rawData.length} bytes.`,
      LogLevel.INFO,
    );
    packet.metadata.currentLayer = LayerLevel.PHYSICAL;

    // Loopback for simulation. In a real scenario, this would be an external interface.
    this.handleIncoming(packet, packet.payload);
  }

  public handleIncoming(packet: BasePacket, incomingPayload: string) {
    this.logger.log(
      LayerLevel.PHYSICAL,
      'Handling incoming packet.',
      LogLevel.INFO,
    );
    packet.setPayload(incomingPayload);
    packet.metadata.currentLayer = LayerLevel.PHYSICAL;

    this.logger.log(LayerLevel.PHYSICAL, 'Received raw data.', LogLevel.INFO);
  }
}
