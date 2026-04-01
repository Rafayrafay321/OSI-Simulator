// Custom Imports
import { Logger } from '../core/Logger';
import { env } from '../config/env';

// Types
import {
  DataLinkLayerData,
  ILayer,
  LayerLevel,
  DataLinkLayerOptions,
  LogLevel,
} from '../types';
import { BasePacket } from '../core/Packet';

export class DataLinkLayer implements ILayer {
  public name = 'Data Link Layer';
  public level = LayerLevel.DATA_LINK;
  public srcMac: string;
  public etherType: number;
  private arpCache: Map<string, string>;
  private logger: Logger;

  constructor(
    options: DataLinkLayerOptions,
    arpCache: Map<string, string>,
    logger: Logger,
  ) {
    this.srcMac = options.srcMac;
    this.etherType = options.etherType;
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
    const fcs: number[] = packet.to16BitChunck(dataToCheckSum);

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

  public handleOutgoing(packet: BasePacket): BasePacket | null {
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
    return packet;
  }

  public handleIncoming(packet: BasePacket): BasePacket | null {
    const BROADCAST_MAC_ADDRESS = env.BOARDCAST_MAC_ADD;
    this.logger.log(
      LayerLevel.DATA_LINK,
      'Handling incoming packet.',
      LogLevel.INFO,
    );

    const incommingPaylaod = packet.getPayload();
    if (!incommingPaylaod) {
      this.logger.log(
        LayerLevel.DATA_LINK,
        'Incoming Payload can not be empty.',
        LogLevel.ERROR,
      );
      throw new Error('Incoming Payload can not be empty');
    }

    const DataLinkLayerRawHeaders = packet.getHeader();
    const DataLinkLayerHeaders = DataLinkLayerRawHeaders as DataLinkLayerData;
    const incommingCheckSum = DataLinkLayerHeaders.trailer;

    if (incommingCheckSum === undefined || isNaN(incommingCheckSum)) {
      this.logger.log(
        LayerLevel.DATA_LINK,
        'Incoming checkSum can not be empty',
        LogLevel.ERROR,
      );
      throw new Error('Incoming checkSum can not be empty');
    }

    // Verify the MacAddress
    if (
      DataLinkLayerHeaders.destMac !== this.srcMac &&
      DataLinkLayerHeaders.destMac !== BROADCAST_MAC_ADDRESS
    ) {
      this.logger.log(
        LayerLevel.DATA_LINK,
        'Dropping packet for incorrect MAC',
        LogLevel.INFO,
      );
      return null;
    } else if (DataLinkLayerHeaders.destMac === BROADCAST_MAC_ADDRESS) {
      this.logger.log(
        LayerLevel.DATA_LINK,
        'BoardCasting: As it is meant for boardCasting',
        LogLevel.INFO,
      );
    }
    const checkSum = this.calCheckSum(
      {
        srcMac: DataLinkLayerHeaders.srcMac,
        etherType: DataLinkLayerHeaders.etherType,
      },
      DataLinkLayerHeaders.destMac,
      incommingPaylaod,
      packet,
    );

    // Verify CheckSum
    if (checkSum !== incommingCheckSum) {
      this.logger.log(
        LayerLevel.DATA_LINK,
        'CheckSum Failed. Cant proceed Further.',
        LogLevel.ERROR,
      );
      return null;
    }
    // Remove DataLink headers
    packet.removeHeader(LayerLevel.DATA_LINK);
    return packet;
  }
}
