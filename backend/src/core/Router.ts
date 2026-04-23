// Custom imports
import { NetworkNode } from './NetworkNode';
import { Logger } from './Logger';
import { BasePacket } from './Packet';
import { NetworkLayer } from '../layers/networkLayer_3';

// Types
import type { RouterConfig } from '../types';
export class Router extends NetworkNode {
  public networkLayer: NetworkLayer;
  private arpCacheTable: Map<string, string> = new Map();

  constructor(name: string, config: RouterConfig, logger: Logger) {
    super(name, config, logger);

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

  /**
   * The core logic of a Router:
   * 1. Receive data "Up" the stack (Physical -> Data Link -> Network).
   * 2. Since only L1-L3 are registered, the stack stops at L3.
   * 3. Send data "Down" the stack (Network -> Data Link -> Physical).
   */
  public receivePacket(
    incomingPacket: BasePacket,
    incommingPortId: string,
  ): void {
    const receivedPacket = this.networkStack.receiveData(incomingPacket);

    if (receivedPacket) {
      this.networkStack.sendData(receivedPacket);
    }
  }
}
