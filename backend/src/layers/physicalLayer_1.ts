import { BasePacket } from '../core/Packet';
import { Logger } from '../core/Logger';
import { ILayer, LayerLevel, LogLevel } from '../types';

export class PhysicalLayer implements ILayer {
  public name = 'Physical Layer';
  public level = LayerLevel.PHYSICAL;
  private logger: Logger;

  public onDataTransmit?: (packet: BasePacket) => void;

  constructor(logger: Logger) {
    this.logger = logger;
  }

  private serializePacket(packet: BasePacket): string {
    // In a real implementation, this would convert the packet into a stream of bits.
    return JSON.stringify(packet);
  }

  public handleOutgoing(packet: BasePacket): BasePacket | null {
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

    if (this.onDataTransmit) {
      this.onDataTransmit(packet);
    }

    return null;
  }

  public handleIncoming(
    packet: BasePacket,
    incomingPayload?: string,
  ): BasePacket | null {
    this.logger.log(
      LayerLevel.PHYSICAL,
      'Handling incoming packet.',
      LogLevel.INFO,
    );

    if (incomingPayload) {
      packet.setPayload(incomingPayload);
      this.logger.log(
        LayerLevel.PHYSICAL,
        'Received raw data.',
        LogLevel.INFO,
      );
    }
    // In a real simulation, we would deserialize the payload here.
    // Since we are passing the BasePacket object directly, we just pass it on.
    packet.metadata.currentLayer = LayerLevel.PHYSICAL;
    return packet;
  }
}
