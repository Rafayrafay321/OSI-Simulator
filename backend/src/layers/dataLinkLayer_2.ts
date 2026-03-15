// Custom Imports
import { PhysicalLayer } from './physicalLayer_1';
import { Logger } from '../core/Logger';

// Types
import {
  DataLinkLayerData,
  LayerLevel,
  DataLinkLayerOptions,
  LogLevel,
} from '../types';
import { BasePacket } from '../core/Packet';

export class DataLinkLayer {
  public srcMac: string;
  public etherType: number;
  private nextLayer: PhysicalLayer;
  private arpCache: Map<string, string>;
  private logger: Logger;

  constructor(
    options: DataLinkLayerOptions,
    nextLayer: PhysicalLayer,
    arpCache: Map<string, string>,
    logger: Logger,
  ) {
    this.srcMac = options.srcMac;
    this.etherType = options.etherType;
    this.nextLayer = nextLayer;
    this.arpCache = arpCache;
    this.logger = logger;
  }

  private calCheckSum(
    headers: Partial<DataLinkLayerData>,
    destMac: string,
    payload: string,
    packet: BasePacket,
  ) {
    const headersDataString: string = `${headers.srcMac}${destMac}${headers.etherType}`;
    const dataToCheckSum = headersDataString + payload;
    const fcs: number[] = packet.to16BitChuck(dataToCheckSum);

    const sum = fcs.reduce((acc: number, val: number) => {
      acc += val;

      if (acc > 0xffff) {
        acc = (acc & 0xffff) + 1;
      }
      return acc;
    }, 0);

    const finalCheckSum = ~sum & 0xffff;
    return finalCheckSum;
  }

  public handleOutgoing(packet: BasePacket) {
    if (!packet.payload) {
      this.logger.log(
        LayerLevel.DATA_LINK,
        'Payload can not be empty',
        LogLevel.ERROR,
      );
      throw new Error('Payload can not be empty');
    }

    if (!packet.metadata.destinationIp) {
      this.logger.log(
        LayerLevel.DATA_LINK,
        'Destination IP address can not be empty',
        LogLevel.ERROR,
      );
      throw new Error('Destination IP address can not be empty');
    }

    this.logger.log(
      LayerLevel.DATA_LINK,
      'Handling outgoing packet.',
      LogLevel.INFO,
    );
    const destIp = packet.metadata.destinationIp;
    const destMac = this.arpCache.get(destIp);

    if (!destMac) {
      this.logger.log(
        LayerLevel.DATA_LINK,
        `MAC address for IP ${destIp} not found in ARP cache.`,
        LogLevel.ERROR,
      );
      throw new Error(`Ip: ${destIp} has no Mac Address`);
    }

    this.logger.log(
      LayerLevel.DATA_LINK,
      `Found MAC address ${destMac} for IP ${destIp}.`,
      LogLevel.INFO,
    );

    const checkSum = this.calCheckSum(
      { srcMac: this.srcMac, etherType: this.etherType },
      destMac,
      packet.payload,
      packet,
    );

    packet.addHeader(LayerLevel.DATA_LINK, {
      srcMac: this.srcMac,
      destMac: destMac,
      etherType: this.etherType,
      trailer: checkSum,
    });

    packet.metadata.currentLayer = LayerLevel.DATA_LINK;
    this.logger.log(
      LayerLevel.DATA_LINK,
      'Passing packet to Physical Layer.',
      LogLevel.INFO,
    );
    this.nextLayer.handleOutgoing(packet);
  }

  public handleIncoming(packet: BasePacket) {
    this.logger.log(
      LayerLevel.DATA_LINK,
      'Handling incoming packet.',
      LogLevel.INFO,
    );
    // TODO: Implement incoming logic for DataLinkLayer
  }
}
