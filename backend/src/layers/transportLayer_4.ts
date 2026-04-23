// Custom Imports
import { env } from '../config/env';
import { Logger } from '../core/Logger';

// Types
import {
  PacketStatus,
  TransportLayerData,
  ILayer,
  LayerLevel,
  PacketDirection,
  Header,
  LogLevel,
} from '../types';
import { BasePacket } from '../core/Packet';

export const calculateChecksum = (payload: string): number => {
  if (!payload) return 0;
  return payload.split('').reduce((sum, char) => sum + char.charCodeAt(0), 0);
};

export class TransportLayer implements ILayer {
  public name = 'Transport Layer';
  public level = LayerLevel.TRANSPORT;
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

  public handleOutgoing(packet: BasePacket): BasePacket | BasePacket[] | null {
    if (!packet.payload) {
      this.logger.log(
        LayerLevel.TRANSPORT,
        'Payload can not be empty',
        LogLevel.ERROR,
      );
      throw new Error('Payload can not be empty');
    }

    const MSS = env.CONFIG_MSS as number;
    const payloadLength = packet.payload.length;
    const masterCheckSum = calculateChecksum(packet.payload);

    if (payloadLength > MSS) {
      const packetId = crypto.randomUUID();
      const noOfSegments = Math.ceil(payloadLength / MSS);
      const segmentsList: BasePacket[] = [];
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

        newSegmentPacket.addHeader(LayerLevel.TRANSPORT, {
          ...headerData,
          checkSum: masterCheckSum,
        });

        newSegmentPacket.metadata = {
          currentLayer: LayerLevel.TRANSPORT,
          direction: PacketDirection.SENDER_TO_RECEIVER,
          status: PacketStatus.HEALTHY,
        };

        const newSegmentPacketClone = newSegmentPacket.clone();

        this.logger.log(
          LayerLevel.TRANSPORT,
          `Transport layer header attached (Segment ${i + 1}/${noOfSegments}). Passing to Network Layer.`,
          LogLevel.INFO,
          {
            payload: newSegmentPacketClone.payload,
            headers: newSegmentPacketClone.headers,
            metadata: newSegmentPacketClone.metadata,
          },
        );


        segmentsList.push(newSegmentPacket);
      }
      return segmentsList;
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

      const packetClone = packet.clone();

      this.logger.log(
        LayerLevel.TRANSPORT,
        'Transport layer header attached. Passing to Network Layer.',
        LogLevel.INFO,
        {
          payload: packetClone.payload,
          headers: packetClone.headers,
          metadata: packetClone.metadata,
        },
      );


      return packet;
    }
  }

  public handleIncoming(packet: BasePacket): BasePacket | null {
    packet.metadata.currentLayer = LayerLevel.TRANSPORT;


    const header = packet.getHeader() as TransportLayerData;

    if (header.totalSegment === 1) {
      const packetClone = packet.clone();

      this.logger.log(
        LayerLevel.TRANSPORT,
        'Transport layer processing incoming packet. Passing up to Application Layer.',
        LogLevel.INFO,
        {
          payload: packetClone.payload,
          headers: packetClone.headers,
          metadata: packetClone.metadata,
        },
      );


      packet.removeHeader();
      return packet;
    }

    const packetId = header.packetId as string;

    if (!this.segmentBuffer.has(packetId)) {
      this.segmentBuffer.set(packetId, []);
    }
    const buffer = this.segmentBuffer.get(packetId) as BasePacket[];

    const packetClone = packet.clone();
    this.logger.log(
      LayerLevel.TRANSPORT,
      `Transport layer processing incoming segment ${header.segmentIndex + 1}/${header.totalSegment}. Buffering segment.`,
      LogLevel.INFO,
      {
        payload: packetClone.payload,
        headers: packetClone.headers,
        metadata: packetClone.metadata,
      },
    );

    buffer.push(packet);


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
      const expectedChecksum = calculateChecksum(finalPayload);
      if (header.checkSum !== expectedChecksum) {
        const errorMsg = `Invalid checksum. Expected ${expectedChecksum}, but got ${header.checkSum}. Packet is corrupted.`;
        this.logger.log(LayerLevel.TRANSPORT, errorMsg, LogLevel.ERROR);
        throw new Error('Checksum validation failed. Packet is corrupted.');
      }

      const firstSegment = buffer[0];
      const reassembledPacket = new BasePacket();
      reassembledPacket.headers = [...firstSegment.headers];
      reassembledPacket.metadata = { ...firstSegment.metadata };

      reassembledPacket.setPayload(finalPayload);

      const reassambledPacketClone = reassembledPacket.clone();
      this.logger.log(
        LayerLevel.TRANSPORT,
        'All segments received and reassembled successfully. Passing up to Application Layer.',
        LogLevel.SUCCESS,
        {
          payload: reassambledPacketClone.payload,
          headers: reassambledPacketClone.headers,
          metadata: reassambledPacketClone.metadata,
        },
      );

      reassembledPacket.removeHeader();

      this.segmentBuffer.delete(packetId);



      return reassembledPacket;
    }
    return null;
  }
}
