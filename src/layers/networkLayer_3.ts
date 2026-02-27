// Node imports
import crypto from 'node:crypto';
// Custom Imports
import { PhysicalLayer } from './physicalLayer_1';
import { env } from '../config/env';

// Types and interfaces
import {
  LayerLevel,
  NetworkLayerData,
  PacketStatus,
  PacketDirection,
} from '../types';
import { BasePacket } from '../core/Packet';

export class NetworkLayer {
  public id: string;
  public srcIp: string;
  public destIp: string;
  public ttl: number;
  public protocol: number;
  public DFflag: number;
  public MFflag: number;
  public fragmentOffSet: number;
  private nextLayer: PhysicalLayer;

  constructor(options: NetworkLayerData, nextLayer: PhysicalLayer) {
    this.id = options.id;
    this.srcIp = options.srcIp;
    this.destIp = options.destIp;
    this.ttl = options.ttl;
    this.protocol = options.protocol;
    this.DFflag = options.DFflag;
    this.MFflag = options.MFflag;
    this.fragmentOffSet = options.fragmentOffSet;
    this.nextLayer = nextLayer;
  }
  public handleOutgoing(packet: BasePacket) {
    if (!packet.payload) {
      throw new Error('Payload can not be empty');
    }

    const MTU = Number(env.CONFIG_MTU);
    const ipHeaderSize = Number(env.IP_HEADER_SIZE);
    const payloadSize = packet.getPayloadSize();
    const currentPacketSize = ipHeaderSize + payloadSize;

    if (currentPacketSize > MTU) {
      const MaxFragmentData = MTU - ipHeaderSize;
      const noOfFragments = Math.ceil(payloadSize / MTU);
      const newFragmentId = crypto.randomUUID();

      for (let i = 0; i < noOfFragments; i++) {
        const lowerIndex = MaxFragmentData * i;
        const upperIndex = Math.min(lowerIndex + MTU, currentPacketSize);
        const currentFragmentData = packet.payload.substring(
          lowerIndex,
          upperIndex,
        );

        const newFragmentPacket = packet.clone();

        newFragmentPacket.setPayload(currentFragmentData);

        newFragmentPacket.addHeader(LayerLevel.NETWORK, {
          id: newFragmentId,
          srcIp: this.srcIp,
          destIp: this.destIp,
          ttl: this.ttl,
          protocol: this.protocol,
          DFflag: this.DFflag,
          MFflag: i < noOfFragments - 1 ? 1 : 0,
          fragmentOffSet: lowerIndex,
        });

        newFragmentPacket.metadata = {
          currentLayer: LayerLevel.NETWORK,
          direction: PacketDirection.SENDER_TO_RECEIVER,
          status: PacketStatus.HEALTHY,
        };

        console.log(JSON.stringify(newFragmentPacket, null, 2));
        this.nextLayer.handleOutgoing(newFragmentPacket);
      }
    } else {
      packet.addHeader(LayerLevel.NETWORK, {
        id: this.id,
        srcIp: this.srcIp,
        destIp: this.destIp,
        ttl: this.ttl,
        protocol: this.protocol,
        DFflag: this.DFflag,
        MFflag: this.MFflag,
        fragmentOffSet: 0,
      });

      packet.metadata = {
        currentLayer: LayerLevel.NETWORK,
        direction: PacketDirection.SENDER_TO_RECEIVER,
        status: PacketStatus.HEALTHY,
      };
      console.log(JSON.stringify(packet, null, 2));
      this.nextLayer.handleOutgoing(packet);
    }
  }
}
