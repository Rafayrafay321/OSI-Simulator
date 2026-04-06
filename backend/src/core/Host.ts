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

export class Host extends NetworkNode {
  public applicationLayer: ApplicationLayer;
  public transportLayer: TransportLayer;

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

  public onReceipt(packet: BasePacket) {
    const recivedPacket = this.networkStack.receiveData(packet);
    if (!recivedPacket) {
      return;
    }
    return recivedPacket;
  }
}
