// Node imports
import crypto from 'node:crypto';
// Custom Imports
import { env } from '../config/env';
import { Logger } from '../core/Logger';

// Types and interfaces
import {
  LayerLevel,
  NetworkLayerData,
  PacketStatus,
  PacketDirection,
  LogLevel,
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
  public routingTable?: Map<string, NetworkLayer>;
  private fragmentBuffer: Map<string, BasePacket[]> = new Map();
  private logger: Logger;

  constructor(
    options: NetworkLayerData,
    logger: Logger,
    routingTable?: Map<string, NetworkLayer>,
  ) {
    this.id = options.id;
    this.srcIp = options.srcIp;
    this.destIp = options.destIp;
    this.ttl = options.ttl;
    this.protocol = options.protocol;
    this.DFflag = options.DFflag;
    this.MFflag = options.MFflag;
    this.fragmentOffSet = options.fragmentOffSet;
    this.routingTable = routingTable;
    this.logger = logger;
  }
  public handleOutgoing(packet: BasePacket): BasePacket | BasePacket[] {
    if (!packet.payload) {
      this.logger.log(
        LayerLevel.NETWORK,
        'Payload can not be empty',
        LogLevel.ERROR,
      );
      throw new Error('Payload can not be empty');
    }
    this.logger.log(
      LayerLevel.NETWORK,
      'Handling outgoing packet.',
      LogLevel.INFO,
    );
    const MTU = Number(env.CONFIG_MTU);
    const ipHeaderSize = Number(env.IP_HEADER_SIZE);
    const payloadSize = packet.getPayloadSize();
    const currentPacketSize = ipHeaderSize + payloadSize;

    if (currentPacketSize > MTU) {
      const MaxFragmentData = MTU - ipHeaderSize;
      const fragmentsList: BasePacket[] = [];
      const noOfFragments = Math.ceil(payloadSize / MaxFragmentData);
      const newFragmentId = crypto.randomUUID();
      this.logger.log(
        LayerLevel.NETWORK,
        `Packet > MTU. Fragmenting into ${noOfFragments} fragments.`,
        LogLevel.INFO,
      );

      for (let i = 0; i < noOfFragments; i++) {
        const lowerIndex = MaxFragmentData * i;
        const upperIndex = Math.min(lowerIndex + MTU, packet.payload.length);
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
        this.logger.log(
          LayerLevel.NETWORK,
          `Passing fragment ${i + 1} to Data Link Layer.`,
          LogLevel.INFO,
        );

        fragmentsList.push(newFragmentPacket);
      }
      return fragmentsList;
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
      this.logger.log(
        LayerLevel.NETWORK,
        'Passing packet to Data Link Layer.',
        LogLevel.INFO,
      );

      return packet;
    }
  }

  public handleIncoming(packet: BasePacket): BasePacket | null {
    this.logger.log(
      LayerLevel.NETWORK,
      'Handling incoming packet.',
      LogLevel.INFO,
    );

    const headers = packet.getHeader() as NetworkLayerData;
    const fragmentId = headers.id;
    const moreFragmentFlag = headers.MFflag;

    if (moreFragmentFlag === 1) {
      if (!this.fragmentBuffer.has(fragmentId)) {
        this.fragmentBuffer.set(fragmentId, [packet]);
      } else {
        (this.fragmentBuffer.get(fragmentId) as BasePacket[]).push(packet);
      }
      return null;
    }
    if (this.fragmentBuffer.has(fragmentId)) {
      let allFragmentPaylaods: string[] = [];
      const existingArray = this.fragmentBuffer.get(fragmentId) as BasePacket[];
      existingArray.push(packet);
      existingArray.sort((packetA, packetB) => {
        const headerA = packetA.getHeader() as NetworkLayerData;
        const headerB = packetB.getHeader() as NetworkLayerData;

        return headerA.fragmentOffSet - headerB.fragmentOffSet;
      });
      for (let packet of existingArray) {
        if (!packet.payload) {
          continue;
        }
        allFragmentPaylaods.push(packet.payload as string);
      }
      const finalPaylaod = allFragmentPaylaods.join('');
      this.fragmentBuffer.delete(fragmentId);
      packet.setPayload(finalPaylaod);
    }

    packet.removeHeader(LayerLevel.NETWORK);
    return packet;
  }
}
