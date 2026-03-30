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
  private logger: Logger;

  constructor(options: TransportLayerData, logger: Logger) {
    this.underlyingProtocol = options.underlyingProtocol;
    this.srcPort = options.srcPort;
    this.destPort = options.destPort;
    this.segmentIndex = options.segmentIndex;
    this.totalSegment = options.totalSegment;
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

  private calCheckSum(
    headerData: Omit<TransportLayerData, 'checkSum'>,
    payload: string,
    packet: BasePacket,
  ) {
    const allChunks: number[] = [
      ...packet.to16BitChunck(payload),
      ...Object.values(headerData).flatMap((header) =>
        packet.to16BitChunck(String(header)),
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

        const headerData: Omit<TransportLayerData, 'checkSum'> = {
          underlyingProtocol: this.underlyingProtocol,
          srcPort: this.srcPort,
          destPort: this.destPort,
          segmentIndex: i,
          totalSegment: noOfSegments,
        };

        const checkSum = this.calCheckSum(
          headerData,
          currentSegmentData,
          newSegmentPacket,
        );

        newSegmentPacket.addHeader(LayerLevel.TRANSPORT, {
          ...headerData,
          checkSum: checkSum,
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
      }
    } else {
      const headerData: Omit<TransportLayerData, 'checkSum'> = {
        underlyingProtocol: this.underlyingProtocol,
        srcPort: this.srcPort,
        destPort: this.destPort,
        segmentIndex: this.segmentIndex,
        totalSegment: this.totalSegment,
      };
      const checkSum = this.calCheckSum(headerData, packet.payload, packet);

      packet.addHeader(LayerLevel.TRANSPORT, {
        ...headerData,
        checkSum: checkSum,
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
