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
  public networkLayer: NetworkLayer;

  constructor(
    name: string,
    config: NodeConfig,
    logger: Logger,
    arpCache: Map<string, string>,
  ) {
    this.networkStack = new NetworkStack(logger);

    this.physicalLayer = new PhysicalLayer(logger);

    this.dataLinkLayer = new DataLinkLayer(
      { srcMac: config.macAddress, etherType: 123 },
      arpCache,
      logger,
      config.defaultGateway,
    );

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

    this.networkStack.registerLayer(this.physicalLayer);
    this.networkStack.registerLayer(this.dataLinkLayer);
    this.networkStack.registerLayer(this.networkLayer);
  }
}
