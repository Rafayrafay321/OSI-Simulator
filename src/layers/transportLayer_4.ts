// Custom Imports
import { NetworkLayer } from './networkLayer_3';
import { env } from '../config/env';

// Types
import {
  PacketStatus,
  TransportLayerData,
  LayerLevel,
  PacketDirection,
  Header,
  LayerData,
} from '../types';
import { BasePacket } from '../core/Packet';

export class TransportLayer {
  public underlyingProtocol: string;
  public srcPort: number;
  public destPort: number;
  public segmentIndex: number;
  public totalSegment: number;
  private nextLayer: NetworkLayer;

  constructor(options: TransportLayerData, nextLayer: NetworkLayer) {
    this.underlyingProtocol = options.underlyingProtocol;
    this.srcPort = options.srcPort;
    this.destPort = options.destPort;
    this.segmentIndex = options.segmentIndex;
    this.totalSegment = options.totalSegment;
    this.nextLayer = nextLayer;
  }
  // Helper method for copying Headers
  private addBaseSegmentHeaders(
    baseSegmentPacket: BasePacket,
    newSegmentPacket: BasePacket,
  ) {
    const addBaseSegmentPacketHeaders: Header[] = baseSegmentPacket.headers;
    newSegmentPacket.headers = [...addBaseSegmentPacketHeaders];
  }

  private extractTransportLayerHeaders(packet: BasePacket): TransportLayerData {
    const transportHeader = packet.headers.find(
      (header) => header.layerName === LayerLevel.TRANSPORT,
    );

    if (!transportHeader) {
      throw new Error('Transport layer header not found in packet.');
    }

    const data = transportHeader.data as TransportLayerData;

    const transportLayerHeaders = {
      underlyingProtocol: data.underlyingProtocol,
      srcPort: data.srcPort,
      destPort: data.destPort,
      segmentIndex: data.segmentIndex,
      totalSegment: data.totalSegment,
    };
    return transportLayerHeaders;
  }

  private to16BitChuck(data: string): number[] {
    const encoder = new TextEncoder();
    // Convert string into bytes before bits.
    const databytes = encoder.encode(data);

    // Divide into 16 bit chucks
    const chuncks: number[] = [];
    for (let i = 0; i < databytes.length; i += 2) {
      const high = databytes[i];
      const low = databytes[i + 1] ?? 0;

      const chunck16 = (high << 8) | low;
      chuncks.push(chunck16);
    }
    return chuncks;
  }
  private calCheckSum(packet: BasePacket, paylaod: string) {
    const transportHeaders = this.extractTransportLayerHeaders(packet);
    const allChunks: number[] = [
      ...this.to16BitChuck(paylaod),
      ...Object.values(transportHeaders).flatMap((header) =>
        this.to16BitChuck(header),
      ),
    ];

    const sum = allChunks.reduce((acc, val) => {
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

    const MSS = env.CONFIG_MSS as number;
    const payloadLength = packet.payload.length;
    if (payloadLength > MSS) {
      const noOfSegments = Math.ceil(payloadLength / MSS);
      for (let i = 0; i < noOfSegments; i++) {
        const startingIndex = i * MSS;
        const endingIndex = Math.min(startingIndex + MSS, payloadLength);
        let currentSegmentData = packet.payload.substring(
          startingIndex,
          endingIndex,
        );
        let newSegmentPacket = new BasePacket();
        newSegmentPacket.setPayload(currentSegmentData);
        this.addBaseSegmentHeaders(packet, newSegmentPacket);
        const checkSum = this.calCheckSum(newSegmentPacket, currentSegmentData);

        newSegmentPacket.addHeader(LayerLevel.TRANSPORT, {
          underlyingProtocol: this.underlyingProtocol,
          srcPort: this.srcPort,
          destPort: this.destPort,
          checkSum: checkSum,
          segmentIndex: i,
          totalSegment: noOfSegments,
        });

        newSegmentPacket.metadata = {
          currentLayer: LayerLevel.TRANSPORT,
          direction: PacketDirection.SENDER_TO_RECEIVER,
          status: PacketStatus.HEALTHY,
        };

        console.log(JSON.stringify(newSegmentPacket, null, 2));
        this.nextLayer.handleOutgoing(newSegmentPacket);
      }
    } else {
      const checkSum = this.calCheckSum(packet, packet.payload);

      packet.addHeader(LayerLevel.TRANSPORT, {
        underlyingProtocol: this.underlyingProtocol,
        srcPort: this.srcPort,
        destPort: this.destPort,
        checkSum: checkSum,
        segmentIndex: this.segmentIndex,
        totalSegment: this.totalSegment,
      });

      packet.metadata = {
        currentLayer: LayerLevel.TRANSPORT,
        direction: PacketDirection.SENDER_TO_RECEIVER,
        status: PacketStatus.HEALTHY,
      };
      console.log(JSON.stringify(packet, null, 2));
      this.nextLayer.handleOutgoing(packet);
    }
  }
}
