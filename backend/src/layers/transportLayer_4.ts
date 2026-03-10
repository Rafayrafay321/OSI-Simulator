// Custom Imports
import { NetworkLayer } from './networkLayer_3';
import { env } from '../config/env';
import { Logger } from '../core/Logger';

// Types
import {
  PacketStatus,
  TransportLayerData,
  LayerLevel,
  PacketDirection,
  Header,
  LogLevel,
} from '../types';
import { BasePacket } from '../core/Packet';

export class TransportLayer {
  public underlyingProtocol: string;
  public srcPort: number;
  public destPort: number;
  public segmentIndex: number;
  public totalSegment: number;
  private nextLayer: NetworkLayer;
  private logger: Logger;

  constructor(
    options: TransportLayerData,
    nextLayer: NetworkLayer,
    logger: Logger,
  ) {
    this.underlyingProtocol = options.underlyingProtocol;
    this.srcPort = options.srcPort;
    this.destPort = options.destPort;
    this.segmentIndex = options.segmentIndex;
    this.totalSegment = options.totalSegment;
    this.nextLayer = nextLayer;
    this.logger = logger;
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

  private calCheckSum(packet: BasePacket, paylaod: string) {
    const transportHeaders = this.extractTransportLayerHeaders(packet);
    const allChunks: number[] = [
      ...packet.to16BitChuck(paylaod),
      ...Object.values(transportHeaders).flatMap((header) =>
        packet.to16BitChuck(header),
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
      this.logger.log(
      LayerLevel.TRANSPORT,
      'Payload can not be empty',
      LogLevel.ERROR,
    );
      throw new Error('Payload can not be empty');
    }

    this.logger.log(
      LayerLevel.TRANSPORT,
      'Handling outgoing packet.',
      LogLevel.INFO,
    );

    const MSS = env.CONFIG_MSS as number;
    const payloadLength = packet.payload.length;
    if (payloadLength > MSS) {
      const noOfSegments = Math.ceil(payloadLength / MSS);
      this.logger.log(
        LayerLevel.TRANSPORT,
        `Payload > MSS. Segmenting into ${noOfSegments} segments.`,
        LogLevel.INFO,
      );
      for (let i = 0; i < noOfSegments; i++) {
        const startingIndex = i * MSS;
        const endingIndex = Math.min(startingIndex + MSS, payloadLength);
        const currentSegmentData = packet.payload.substring(
          startingIndex,
          endingIndex,
        );
        const newSegmentPacket = new BasePacket();
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
        this.logger.log(
          LayerLevel.TRANSPORT,
          `Passing segment ${i + 1} to Network Layer.`,
          LogLevel.INFO,
        );
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
      this.logger.log(
        LayerLevel.TRANSPORT,
        'Passing packet to Network Layer.',
        LogLevel.INFO,
      );
      this.nextLayer.handleOutgoing(packet);
    }
  }

  public handleIncoming(packet: BasePacket) {
    this.logger.log(
      LayerLevel.TRANSPORT,
      'Handling incoming packet.',
      LogLevel.INFO,
    );
    // TODO: Implement incoming logic for Transport Layer
  }
}
