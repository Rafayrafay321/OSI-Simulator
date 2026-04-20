import { NetworkNode } from './NetworkNode';
import { Logger } from './Logger';
import { BasePacket } from './Packet';

// Types
import { SwitchConfig } from '../types';

export class Switch extends NetworkNode {
  constructor(
    name: string,
    config: SwitchConfig,
    logger: Logger,
    arpCache: Map<string, string>,
  ) {
    super(name, config, logger, arpCache);
  }

  public receivePacket(incomingPacket: BasePacket): void {
    const receivedPacket = this.networkStack.receiveData(incomingPacket);

    if (receivedPacket) {
      this.networkStack.sendData(receivedPacket);
    }
  }
}
