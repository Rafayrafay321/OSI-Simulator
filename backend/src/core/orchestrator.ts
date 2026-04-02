import { NetworkStack } from './NetworkStack';
import { ApplicationLayer } from '../layers/applicationLayer_7';
import { TransportLayer } from '../layers/transportLayer_4';
import { NetworkLayer } from '../layers/networkLayer_3';
import { DataLinkLayer } from '../layers/dataLinkLayer_2';
import { PhysicalLayer } from '../layers/physicalLayer_1';
import { BasePacket } from './Packet';
import { Logger } from './Logger';
import {
  LayerLevel,
  LogLevel,
  PacketDirection,
  PacketStatus,
  Host,
} from '../types';

export class Orchestrator {
  public host_A: Host;
  public host_B: Host;
  // public router: NetworkLayer;
  private arpCache: Map<string, string> = new Map();
  private logger: Logger;

  constructor() {
    this.arpCache.set('192.168.1.10', '02:A1:C3:54:7B:9D'); // Host A
    this.arpCache.set('192.168.2.10', '0E:88:2F:C1:B9:44'); // Host B

    this.logger = new Logger();

    this.host_A = this.buildHost(
      'HostA',
      '192.168.1.10',
      '02:A1:C3:54:7B:9D',
      8000,
    );

    this.host_B = this.buildHost(
      'HostB',
      '192.168.2.10',
      '0E:88:2F:C1:B9:44',
      8001,
    );

    this.connectPhysicalLayers(this.host_A, this.host_B);
  }

  private buildHost(
    name: string,
    ipAddress: string,
    macAddress: string,
    port: number,
  ): Host {
    const stack = new NetworkStack(this.logger);

    const applicationLayer = new ApplicationLayer(
      { protocol: 'HTTPS', method: 'POST' },
      this.logger,
    );

    const transportLayer = new TransportLayer(
      {
        underlyingProtocol: 'TCP',
        srcPort: port,
        destPort: 0, // Will be set dynamically during send
        segmentIndex: 0,
        totalSegment: 1,
      },
      this.logger,
    );

    const networkLayer = new NetworkLayer(
      {
        id: `net-${name}`,
        srcIp: ipAddress,
        destIp: '0.0.0.0', // Will be set dynamically
        ttl: 64,
        protocol: 6,
        DFflag: 0,
        MFflag: 0,
        fragmentOffSet: 0,
      },
      this.logger,
    );

    const dataLinkLayer = new DataLinkLayer(
      { srcMac: macAddress, etherType: 123 },
      this.arpCache,
      this.logger,
    );

    const physicalLayer = new PhysicalLayer(this.logger);

    stack.registerLayer(applicationLayer);
    stack.registerLayer(transportLayer);
    stack.registerLayer(networkLayer);
    stack.registerLayer(dataLinkLayer);
    stack.registerLayer(physicalLayer);

    return { stack, applicationLayer, networkLayer, physicalLayer };
  }

  private connectPhysicalLayers(hostA: Host, hostB: Host) {
    hostA.physicalLayer.onDataTransmit = (packet) => {
      this.logger.log(
        LayerLevel.PHYSICAL,
        `Transmission: ${hostA.networkLayer.srcIp} -> ${hostB.networkLayer.srcIp}`,
        LogLevel.INFO,
      );
      const finalPacket = hostB.stack.receiveData(packet.clone());
      if (finalPacket) {
        this.logger.log(
          LayerLevel.APPLICATION,
          `Host B received final payload: ${finalPacket.getPayload()}`,
          LogLevel.SUCCESS,
        );
      }
    };

    hostB.physicalLayer.onDataTransmit = (packet) => {
      this.logger.log(
        LayerLevel.PHYSICAL,
        `Transmission: ${hostB.networkLayer.srcIp} -> ${hostA.networkLayer.srcIp}`,
        LogLevel.INFO,
      );
      const finalPacket = hostA.stack.receiveData(packet.clone());
      if (finalPacket) {
        this.logger.log(
          LayerLevel.APPLICATION,
          `Host A received final payload: ${finalPacket.getPayload()}`,
          LogLevel.SUCCESS,
        );
      }
    };
  }

  public getLogs() {
    return this.logger.getLogs();
  }

  public runSimulation(paylaod: string) {
    const packet = new BasePacket();
    packet.setPayload(paylaod);

    packet.metadata = {
      currentLayer: LayerLevel.APPLICATION,
      direction: PacketDirection.SENDER_TO_RECEIVER,
      status: PacketStatus.HEALTHY,
    };

    this.host_A.networkLayer.destIp = '192.168.2.10';

    this.host_A.stack.sendData(packet);
  }
}
