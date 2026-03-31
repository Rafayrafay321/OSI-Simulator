// Custom Imports
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

// This checksum function now matches the simplified version used in the tests.
export const calculateChecksum = (payload: string): number => {
  if (!payload) return 0;
  return payload.split('').reduce((sum, char) => sum + char.charCodeAt(0), 0);
};

export class TransportLayer {
  public underlyingProtocol: string;
  public srcPort: number;
  public destPort: number;
  private segmentBuffer: Map<string, BasePacket[]> = new Map();
  private logger: Logger;

  constructor(options: Omit<TransportLayerData, 'checkSum'>, logger: Logger) {
    this.underlyingProtocol = options.underlyingProtocol;
    this.srcPort = options.srcPort;
    this.destPort = options.destPort;
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
      const packetId = crypto.randomUUID();
      const noOfSegments = Math.ceil(payloadLength / MSS);
      this.logger.log(
        LayerLevel.TRANSPORT,
        `Payload > MSS. Segmenting into ${noOfSegments} segments.`,
        LogLevel.INFO,
      );
      for (let i = 0; i < noOfSegments; i++) {
        const startingIndex = i * MSS;
        const endingIndex = Math.min(startingIndex + MSS, payloadLength);
        const currentSegmentPayload = packet.payload.substring(
          startingIndex,
          endingIndex,
        );
        const newSegmentPacket = new BasePacket();
        newSegmentPacket.setPayload(currentSegmentPayload);
        this.addBaseSegmentHeaders(packet, newSegmentPacket);

        const headerData: Omit<TransportLayerData, 'checkSum'> = {
          underlyingProtocol: this.underlyingProtocol,
          packetId: packetId,
          srcPort: this.srcPort,
          destPort: this.destPort,
          segmentIndex: i,
          totalSegment: noOfSegments,
        };

        const checkSum = calculateChecksum(currentSegmentPayload);

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
        segmentIndex: 0,
        totalSegment: 1,
      };
      const checkSum = calculateChecksum(packet.payload);

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

  public handleIncoming(packet: BasePacket): BasePacket | null {
    this.logger.log(
      LayerLevel.TRANSPORT,
      'Handling incoming packet.',
      LogLevel.INFO,
    );
    const header = packet.getHeader() as TransportLayerData;
    const payload = packet.payload as string;

    const expectedChecksum = calculateChecksum(payload);
    if (header.checkSum !== expectedChecksum) {
      const errorMsg = `Invalid checksum. Expected ${expectedChecksum}, but got ${header.checkSum}. Packet is corrupted.`;
      this.logger.log(LayerLevel.TRANSPORT, errorMsg, LogLevel.ERROR);
      throw new Error('Checksum validation failed. Packet is corrupted.');
    }

    if (header.totalSegment === 1) {
      this.logger.log(
        LayerLevel.TRANSPORT,
        'Passing single packet up to Application Layer.',
        LogLevel.INFO,
      );
      packet.removeHeader(LayerLevel.TRANSPORT);
      return packet;
    }

    const packetId = header.packetId as string;

    if (!this.segmentBuffer.has(packetId)) {
      this.segmentBuffer.set(packetId, []);
    }
    const buffer = this.segmentBuffer.get(packetId) as BasePacket[];
    buffer.push(packet);
    this.logger.log(
      LayerLevel.TRANSPORT,
      `Buffering segment ${header.segmentIndex} of ${header.totalSegment}.`,
      LogLevel.INFO,
    );

    if (buffer.length === header.totalSegment) {
      this.logger.log(
        LayerLevel.TRANSPORT,
        'All segments received. Reassembling packet.',
        LogLevel.INFO,
      );

      buffer.sort((a, b) => {
        const headerA = a.getHeader() as TransportLayerData;
        const headerB = b.getHeader() as TransportLayerData;
        return headerA.segmentIndex - headerB.segmentIndex;
      });

      const finalPayload = buffer.map((p) => p.payload).join('');

      const firstSegment = buffer[0];
      const reassembledPacket = new BasePacket();
      reassembledPacket.headers = [...firstSegment.headers];

      reassembledPacket.setPayload(finalPayload);
      reassembledPacket.removeHeader(LayerLevel.TRANSPORT);

      this.segmentBuffer.delete(packetId);

      this.logger.log(
        LayerLevel.TRANSPORT,
        'Passing reassembled packet up to Application Layer.',
        LogLevel.INFO,
      );

      return reassembledPacket;
    }
    return null;
  }
}
