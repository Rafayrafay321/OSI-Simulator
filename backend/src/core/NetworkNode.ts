import { DataLinkLayer } from '../layers/dataLinkLayer_2';
import { NetworkLayer } from '../layers/networkLayer_3';
import { PhysicalLayer } from '../layers/physicalLayer_1';
import { NodeConfig } from '../types';
import { Logger } from './Logger';
import { NetworkStack } from './NetworkStack';

export abstract class NetworkNode {
  public networkStack: NetworkStack;
  public physicalLayer: PhysicalLayer;
  public dataLinkLayer: DataLinkLayer;
  // private arpCache: Map<string, string> = new Map();

  constructor(name: string, config: NodeConfig, logger: Logger) {
    this.networkStack = new NetworkStack(logger);

    this.physicalLayer = new PhysicalLayer(logger);

    this.dataLinkLayer = new DataLinkLayer(
      { srcMac: config.macAddress!, srcIp: config.ipAddress!, etherType: 123 },
      logger,
      this.networkStack,
      config.defaultGateway,
    );

    this.networkStack.registerLayer(this.physicalLayer);
    this.networkStack.registerLayer(this.dataLinkLayer);
  }
}
