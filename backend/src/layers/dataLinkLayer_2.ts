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
import { NetworkStack } from '../core/NetworkStack';

export class DataLinkLayer implements ILayer {
  public name = 'Data Link Layer';
  public level = LayerLevel.DATA_LINK;
  public srcMac: string;
  public srcIp: string;
  public etherType: number;
  private arpTable: Map<string, string> = new Map();
  private packetBuffer: Map<string, BasePacket[]> = new Map();
  private logger: Logger;
  private defaultGateway?: string;
  public networkStack: NetworkStack;

  constructor(
    options: DataLinkLayerOptions,
    logger: Logger,
    networkStack: NetworkStack,
    defaultGateway?: string,
  ) {
    this.srcMac = options.srcMac;
    this.srcIp = options.srcIp;
    this.etherType = options.etherType;
    this.logger = logger;
    this.defaultGateway = defaultGateway;
    this.networkStack = networkStack;
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

    const nextHopIp = this.defaultGateway || packet.metadata.destinationIp;
    const destMac = this.arpTable.get(nextHopIp);

    if (!destMac) {
      this.logger.log(
        LayerLevel.DATA_LINK,
        `MAC for IP ${nextHopIp} not found. Buffering packet and broadcasting ARP Request.`,
        LogLevel.INFO,
      );
      const existingPackets = this.packetBuffer.get(nextHopIp) || [];
      existingPackets.push(packet);
      this.packetBuffer.set(nextHopIp, existingPackets);

      const arpRequest = new BasePacket();
      arpRequest.setPayload(`Any one has this ip: ${nextHopIp}`);

      const checkSum = this.calCheckSum(
        { srcMac: this.srcMac, etherType: this.etherType },
        env.BOARDCAST_MAC_ADD as string,
        arpRequest.payload!,
        arpRequest,
      );

      arpRequest.addHeader(LayerLevel.DATA_LINK, {
        srcMac: this.srcMac,
        destMac: env.BOARDCAST_MAC_ADD as string,
        etherType: this.etherType,
        trailer: checkSum,
      });

      return arpRequest;
    }

    this.logger.log(
      LayerLevel.DATA_LINK,
      `Data Link layer header attached. Found MAC address ${destMac} for IP ${nextHopIp}. Passing to Physical Layer.`,
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

    const packetClone = packet.clone();


    return packet;
  }

  public handleIncoming(packet: BasePacket): BasePacket | null {
    packet.metadata.currentLayer = LayerLevel.DATA_LINK;
    const BROADCAST_MAC_ADDRESS = env.BOARDCAST_MAC_ADD;

    const incommingPaylaod = packet.getPayload();
    if (!incommingPaylaod) {
      this.logger.log(
        LayerLevel.DATA_LINK,
        'Incoming Payload can not be empty.',
        LogLevel.ERROR,
      );
      throw new Error('Incoming Payload can not be empty');
    }
    const DataLinkLayerHeaders = packet.getHeader() as DataLinkLayerData;
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
    } else if (incommingPaylaod.startsWith('Any one has this ip:')) {
      const ipToCheck = incommingPaylaod.split(':')[1].trim();

      if (ipToCheck === this.srcIp) {
        this.logger.log(
          LayerLevel.DATA_LINK,
          `ARP Request matched my IP (${this.srcIp}). Generating ARP Reply.`,
          LogLevel.INFO,
        );
        const arpReply = new BasePacket();
        arpReply.setPayload(
          `I have this IP: ${ipToCheck}, My MAC is: ${this.srcMac}`,
        );

        const checkSum = this.calCheckSum(
          { srcMac: this.srcMac, etherType: this.etherType },
          DataLinkLayerHeaders.srcMac,
          arpReply.payload!,
          arpReply,
        );

        arpReply.addHeader(LayerLevel.DATA_LINK, {
          srcMac: this.srcMac,
          destMac: DataLinkLayerHeaders.srcMac,
          etherType: this.etherType,
          trailer: checkSum,
        });
        
        arpReply.metadata.currentLayer = LayerLevel.PHYSICAL;
        this.networkStack.routeOutgoing(arpReply);
        return null;
      }

      this.logger.log(
        LayerLevel.DATA_LINK,
        'Ignoring broadcast ARP request (Not for me).',
        LogLevel.INFO,
      );
    } else if (incommingPaylaod.startsWith('I have this IP:')) {
      const pattern = /IP: (.+?), My MAC is: (.+)/;
      const match = incommingPaylaod.match(pattern);
      if (match) {
        const [, incomingIp, incomingMac] = match;
        this.arpTable.set(incomingIp, incomingMac);
        
        this.logger.log(
          LayerLevel.DATA_LINK,
          `ARP Reply received! Learned MAC ${incomingMac} for IP ${incomingIp}.`,
          LogLevel.SUCCESS,
        );

        if (this.packetBuffer.has(incomingIp)) {
          const waitingPacketList = this.packetBuffer.get(incomingIp);

          if (waitingPacketList === undefined) {
            return null;
          }
          
          this.logger.log(
            LayerLevel.DATA_LINK,
            `Flushing ${waitingPacketList.length} buffered packet(s) to IP ${incomingIp}...`,
            LogLevel.INFO,
          );

          for (const packet of waitingPacketList) {
            const checkSum = this.calCheckSum(
              {
                srcMac: this.srcMac,
                etherType: this.etherType,
              },
              incomingMac,
              packet.payload!,
              packet,
            );

            packet.addHeader(LayerLevel.DATA_LINK, {
              srcMac: this.srcMac,
              destMac: incomingMac,
              etherType: this.etherType,
              trailer: checkSum,
            });

            packet.metadata.currentLayer = LayerLevel.PHYSICAL;
            this.networkStack.routeOutgoing(packet);
          }
          this.packetBuffer.delete(incomingIp);
        }
        return null;
      }
    } else {
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
      packet.removeHeader();
      return packet;
    }

    // Fallback: if we entered an ARP block but didn't match the inner conditions, drop it
    return null;
  }
}
