import { NetworkNode } from './NetworkNode';
import { Logger } from './Logger';
import { BasePacket } from './Packet';
import { NetworkLayer } from '../layers/networkLayer_3';

// Types
import { DataLinkLayerData, SwitchConfig } from '../types';

export class Switch extends NetworkNode {
  public networkLayer: NetworkLayer;
  private switchConfig: SwitchConfig;

  constructor(
    name: string,
    config: SwitchConfig,
    logger: Logger,
    arpCache: Map<string, string>,
  ) {
    super(name, config, logger, arpCache);
    this.switchConfig = config;

    this.networkLayer = new NetworkLayer(
      {
        id: `net-${name}`,
        srcIp: config.ipAddress,
        destIp: '0.0.0.0',
        ttl: 64,
        protocol: 6,
        DFflag: 0,
        MFflag: 0,
        fragmentOffSet: 0,
      },
      logger,
      undefined,
    );

    this.networkStack.registerLayer(this.networkLayer);
  }

  public receivePacket(
    incomingPacket: BasePacket,
    incomingPortId: string,
  ): void {
    incomingPacket.metadata.incomingPacketId = incomingPortId;
    const receivedPacket = this.networkStack.receiveData(incomingPacket);

    if (receivedPacket) {
      const dataLinkLayerHeaders =
        incomingPacket.getHeader() as DataLinkLayerData;
      const srcMac = dataLinkLayerHeaders.srcMac;
      if (srcMac) {
        this.switchConfig.macTable.set(srcMac, incomingPortId);
      }
      const destMac = dataLinkLayerHeaders.destMac;
      if (destMac) {
        const targetedNeighborId = this.switchConfig.macTable.get(destMac);
        if (!targetedNeighborId) {
          this.networkStack.sendData(receivedPacket);
          return;
        }
        this.networkStack.sendData(receivedPacket, targetedNeighborId);
      }
    }
  }
}
