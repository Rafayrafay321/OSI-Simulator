// Custom imports
import { NetworkNode } from './NetworkNode';
import { Logger } from './Logger';
import { BasePacket } from './Packet';

// Types
import type { RouterConfig } from '../types';
export class Router extends NetworkNode {
  //   private routingTable: Map<string, string>;
  constructor(
    name: string,
    config: RouterConfig,
    logger: Logger,
    arpCache: Map<string, string>,
  ) {
    super(name, config, logger, arpCache);
  }

  /**
   * The core logic of a Router:
   * 1. Receive data "Up" the stack (Physical -> Data Link -> Network).
   * 2. Since only L1-L3 are registered, the stack stops at L3.
   * 3. Send data "Down" the stack (Network -> Data Link -> Physical).
   */
  public forwardPacket(incomingPacket: BasePacket): void {
    const receivedPacket = this.networkStack.receiveData(incomingPacket);

    if (receivedPacket) {
      this.networkStack.sendData(receivedPacket);
    }
  }
}
