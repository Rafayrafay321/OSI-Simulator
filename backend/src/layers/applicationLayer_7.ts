// Custom Import
import { BasePacket } from '../core/Packet';
import {
  ApplicationLayerData,
  ILayer,
  LayerLevel,
  LogLevel,
} from '../types';
import { Logger } from '../core/Logger';

export class ApplicationLayer implements ILayer {
  public name = 'Application Layer';
  public level = LayerLevel.APPLICATION;
  public protocol: string;
  public method: string;
  private logger: Logger;

  constructor(
    options: Omit<ApplicationLayerData, 'contentType'>,
    logger: Logger,
  ) {
    this.protocol = options.protocol;
    this.method = options.method;
    this.logger = logger;
  }

  handleOutgoing = (packet: BasePacket): BasePacket | BasePacket[] | null => {
    if (!packet.getPayload()) {
      this.logger.log(
        LayerLevel.APPLICATION,
        'Packet has no payload to be sent',
        LogLevel.ERROR,
      );
      return null;
    }
    this.logger.log(
      LayerLevel.APPLICATION,
      `Encoding outgoing payload to JSON...`,
      LogLevel.INFO,
    );

    packet.addHeader(LayerLevel.APPLICATION, {
      protocol: this.protocol,
      method: this.method,
      contentType: 'application/json',
    });
    return packet;
  };

  handleIncoming = (packet: BasePacket): BasePacket | null => {
    const payload = packet.getPayload();
    if (!payload) {
      return null;
    }

    this.logger.log(
      LayerLevel.APPLICATION,
      `Parsing incoming JSON payload...`,
      LogLevel.INFO,
    );

    try {
      JSON.parse(payload);
      packet.removeHeader(LayerLevel.APPLICATION);
      return packet;
    } catch (error) {
      this.logger.log(
        LayerLevel.APPLICATION,
        `Error parsing incoming JSON payload: ${error}`,
        LogLevel.ERROR,
      );
      throw new Error('Failed to parse incoming JSON payload.');
    }
  };
}
