import { BasePacket } from '../core/Packet';
import { Logger } from '../core/Logger';
import { ILayer, LayerLevel, LogLevel } from '../types';

export class PhysicalLayer implements ILayer {
  public name = 'Physical Layer';
  public level = LayerLevel.PHYSICAL;
  private logger: Logger;
  private dropChance?: number | undefined;

  public onDataTransmit?: (packet: BasePacket) => void;
  public onDataDroped?: () => void;

  constructor(logger: Logger, dropChance?: number | undefined) {
    this.logger = logger;
    this.dropChance = dropChance;
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

    const probabilityOfPacketDrop = Math.random();

    if (this.dropChance) {
      if (this.dropChance > probabilityOfPacketDrop) {
        this.logger.log(
          LayerLevel.PHYSICAL,
          'Simulation halted: Packet was lost in transmission.',
          LogLevel.ERROR,
        );

        if (this.onDataDroped) {
          this.onDataDroped();
        }
        return null;
      }
    }

    if (this.onDataTransmit) {
      this.onDataTransmit(packet);
    }

    return null;
  }

  public handleIncoming(packet: BasePacket): BasePacket | null {
    this.logger.log(
      LayerLevel.PHYSICAL,
      'Handling incoming packet.',
      LogLevel.INFO,
    );
    const incomingPayload = packet.getPayload();
    if (incomingPayload) {
      packet.setPayload(incomingPayload);
      this.logger.log(LayerLevel.PHYSICAL, 'Received raw data.', LogLevel.INFO);
    }
    // In a real simulation, we would deserialize the payload here.
    // Since we are passing the BasePacket object directly, we just pass it on.
    packet.metadata.currentLayer = LayerLevel.PHYSICAL;
    return packet;
  }
}
