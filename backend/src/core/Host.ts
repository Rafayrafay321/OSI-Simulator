// Custom imports
import { NetworkNode } from './NetworkNode';
import { Logger } from './Logger';
import { BasePacket } from './Packet';

// Types
import {
  LayerLevel,
  PacketDirection,
  PacketStatus,
  type HostConfig,
  type simulationConfig,
} from '../types';
import { ApplicationLayer } from '../layers/applicationLayer_7';
import { TransportLayer } from '../layers/transportLayer_4';
import { NetworkLayer } from '../layers/networkLayer_3';

export class Host extends NetworkNode {
  public applicationLayer: ApplicationLayer;
  public transportLayer: TransportLayer;
  public networkLayer: NetworkLayer;

  constructor(
    name: string,
    config: HostConfig,
    logger: Logger,
    arpCache: Map<string, string>,
  ) {
    super(name, config, logger, arpCache);

    this.transportLayer = new TransportLayer(
      {
        underlyingProtocol: 'TCP',
        srcPort: config.srcPort,
        destPort: 0,
        segmentIndex: 0,
        totalSegment: 1,
      },
      logger,
    );

    // 3. Build Application Layer
    this.applicationLayer = new ApplicationLayer(
      {
        protocol: config.srcProtocol,
        method: config.srcMethod,
      },
      logger,
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

    this.networkStack.registerLayer(this.networkLayer);
    this.networkStack.registerLayer(this.transportLayer);
    this.networkStack.registerLayer(this.applicationLayer);
  }
  public initiateTransmission(destConfig: simulationConfig) {
    const packet = new BasePacket();
    this.networkLayer.prepareForTransmission(destConfig.destIp);

    packet.setPayload(destConfig.payload);

    packet.metadata = {
      currentLayer: LayerLevel.APPLICATION,
      direction: PacketDirection.SENDER_TO_RECEIVER,
      status: PacketStatus.HEALTHY,
    };

    this.networkStack.sendData(packet);
  }

  public receivePacket(incomingPacket: BasePacket, incommingPortId: string) {
    const recivedPacket = this.networkStack.receiveData(incomingPacket);
    if (!recivedPacket) {
      return;
    }
    return recivedPacket;
  }
}
