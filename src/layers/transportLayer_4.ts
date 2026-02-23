// Custom Imports
import { NetworkLayer } from './networkLayer';

// Types
import {
  PacketStatus,
  TransportLayerData,
  LayerLevel,
  PacketDirection,
  Header,
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

  public handleOutgoing(packet: BasePacket) {
    if (!packet.payload) {
      throw new Error('Payload can not be empty');
    }

    const MSS = 100;
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
        newSegmentPacket.addHeader(LayerLevel.TRANSPORT, {
          underlyingProtocol: this.underlyingProtocol,
          srcPort: this.srcPort,
          destPort: this.destPort,
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
      packet.addHeader(LayerLevel.TRANSPORT, {
        underlyingProtocol: this.underlyingProtocol,
        srcPort: this.srcPort,
        destPort: this.destPort,
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
