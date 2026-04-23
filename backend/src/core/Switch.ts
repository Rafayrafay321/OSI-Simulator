import { NetworkNode } from './NetworkNode';
import { Logger } from './Logger';
import { BasePacket } from './Packet';

// Types
import { DataLinkLayerData, SwitchConfig, LayerLevel } from '../types';

export class Switch extends NetworkNode {
  private switchConfig: SwitchConfig;
  private macAddressTable: Map<string, string> = new Map();

  constructor(name: string, config: SwitchConfig, logger: Logger) {
    super(name, config, logger);
    this.switchConfig = config;
  }

  public receivePacket(
    incomingPacket: BasePacket,
    incomingPortId: string,
  ): void {
    incomingPacket.metadata.incomingPacketId = incomingPortId;

    const dataLinkLayerHeaders = incomingPacket.headers.find(
      (h) => h.layerName === LayerLevel.DATA_LINK,
    )?.data as DataLinkLayerData;

    if (!dataLinkLayerHeaders) {
      return;
    }
    const srcMac = dataLinkLayerHeaders.srcMac;
    if (srcMac && !this.switchConfig.macTable.has(srcMac)) {
      this.switchConfig.macTable.set(srcMac, incomingPortId);
      this.logger.log(
        LayerLevel.DATA_LINK,
        `Switch learned MAC ${srcMac} on port ${incomingPortId}`,
        LogLevel.INFO,
      );
    }
    const destMac = dataLinkLayerHeaders.destMac;
    if (destMac) {
      const targetedNeighborId = this.switchConfig.macTable.get(destMac);
      if (!targetedNeighborId) {
        this.logger.log(
          LayerLevel.DATA_LINK,
          `Switch broadcasting packet to all ports (MAC ${destMac} unknown).`,
          LogLevel.INFO,
        );
        incomingPacket.metadata.currentLayer = LayerLevel.PHYSICAL;
        this.networkStack.routeOutgoing(incomingPacket);
        return;
      }
      this.logger.log(
        LayerLevel.DATA_LINK,
        `Switch forwarding packet directly to port ${targetedNeighborId}.`,
        LogLevel.INFO,
      );
      incomingPacket.metadata.currentLayer = LayerLevel.PHYSICAL;
      this.networkStack.routeOutgoing(incomingPacket, targetedNeighborId);
    }
  }
}
