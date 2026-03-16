// Custom Import
import { BasePacket } from '../core/Packet';
import { ApplicationLayerData, LayerLevel, LogLevel } from '../types';
import { TransportLayer } from './transportLayer_4';
import { Logger } from '../core/Logger';

export class ApplicationLayer {
  public protocol: string;
  public method: string;
  public sender: string;
  private nextLayer: TransportLayer;
  private logger: Logger;

  constructor(
    options: ApplicationLayerData,
    nextLayer: TransportLayer,
    logger: Logger,
  ) {
    this.protocol = options.protocol;
    this.method = options.method;
    this.sender = options.sender;
    this.nextLayer = nextLayer;
    this.logger = logger;
  }
  // TODO Add validation for outgoingPaylaod.
  handleOutgoing = (packet: BasePacket, outgoingPayload: string): void => {
    this.logger.log(
      LayerLevel.APPLICATION,
      `Sending outgoingPayload: ${outgoingPayload.substring(0, 30)}...`,
      LogLevel.INFO,
    );
    packet.setPayload(outgoingPayload);
    packet.addHeader(LayerLevel.APPLICATION, {
      protocol: this.protocol,
      method: this.method,
      sender: this.sender,
    });

    this.nextLayer.handleOutgoing(packet);
  };
  handleIncomming = (packet: BasePacket) => {
    // const header = packet.getHeader(LayerLevel.APPLICATION);
    // if (header) {
    //   this.logger.log(
    //     LayerLevel.APPLICATION,
    //     `Received outgoingPayload: ${packet.getoutgoingPayload().substring(0, 30)}...`,
    //     LogLevel.INFO,
    //   );
    // }
  };
}
