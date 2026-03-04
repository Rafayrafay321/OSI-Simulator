// Custom Imports
import { PhysicalLayer } from './physicalLayer_1';

// Types
import { DataLinkLayerData, LayerLevel, DataLinkLayerOptions } from '../types';
import { BasePacket } from '../core/Packet';

export class DataLinkLayer {
  public srcMac: string;
  public etherType: number;
  private nextLayer: PhysicalLayer;
  private arpCache: Map<string, string>;

  constructor(
    options: DataLinkLayerOptions,
    nextLayer: PhysicalLayer,
    arpCache: Map<string, string>,
  ) {
    this.srcMac = options.srcMac;
    this.etherType = options.etherType;
    this.nextLayer = nextLayer;
    this.arpCache = arpCache;
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
      throw new Error('Payload can not be empty');
    }

    if (!packet.metadata.destinationIp) {
      throw new Error('Destination IP address can not be empty');
    }

    const destIp = packet.metadata.destinationIp;
    const destMac = this.arpCache.get(destIp);

    if (!destMac) {
      throw new Error(`Ip: ${destIp} has na Mac Address`);
    }

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
    this.nextLayer.handleOutgoing(packet);
  }
}
