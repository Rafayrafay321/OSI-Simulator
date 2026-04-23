import { NetworkNode } from './NetworkNode';
import { Logger } from './Logger';
import { BasePacket } from './Packet';

// Types
import { DataLinkLayerData, SwitchConfig } from '../types';

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
