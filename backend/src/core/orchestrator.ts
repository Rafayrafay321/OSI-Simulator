import { Host } from './Host';
import { Router } from './Router';
import { Switch } from './Switch';
import { Logger } from './Logger';
import { TopologyGraph } from './TopologyGraph';

// Types
import {
  LayerLevel,
  LogLevel,
  HostConfig,
  LogEntry,
  simulationConfig,
} from '../types';

export class Orchestrator {
  public logger: Logger = new Logger();
  private arpCache: Map<string, string> = new Map();
  private activeDevices: Map<string, Host | Router | Switch> = new Map();
  private topologyGraph: TopologyGraph;

  constructor(config: simulationConfig, topologyGraph: TopologyGraph) {
    this.topologyGraph = topologyGraph;

    const switchMac = '00:00:5E:00:53:AB';

    const routerConfig = {
      ipAddress: '192.168.1.1',
      macAddress: '00:00:5E:00:53:AA',
    };

    const hostConfig: HostConfig = {
      ipAddress: config.srcIp,
      macAddress: 'AA:AA:AA:AA:AA:AA',
      defaultGateway: routerConfig.ipAddress,
      srcPort: config.srcPort,
      srcProtocol: config.appProtocol,
      srcMethod: config.appMethod,
      dropChance: config.dropChance,
    };

    // TODO: Configure the switch configs
    const switchConfig = {
      ipAddress: '192.168.1.1',
      macAddress: '00:1A:2B:3C:4D:5E',
      defaultGateway: '192.168.1.254',
      dropChance: 0.01,
      portCount: 24,
      macTable: new Map([
        ['AA:BB:CC:DD:EE:01', 1],
        ['AA:BB:CC:DD:EE:02', 2],
        ['AA:BB:CC:DD:EE:03', 3],
      ]),
    };

    const nodesToBuild = topologyGraph.getAllNodes();

    for (let node of nodesToBuild) {
      switch (node.type) {
        case 'Host':
          this.activeDevices.set(
            node.id,
            new Host(node.id, hostConfig, this.logger, this.arpCache),
          );
          break;

        case 'Router':
          this.activeDevices.set(
            node.id,
            new Router(node.id, routerConfig, this.logger, this.arpCache),
          );
          break;

        case 'Switch':
          this.activeDevices.set(
            node.id,
            new Switch(node.id, switchConfig, this.logger, this.arpCache),
          );
          break;
      }
    }
  }
  private connectPhysicalLayers(
    onComplete: (data: {
      finalPayload: string | null;
      logs: LogEntry[];
      packetSize: number | null;
    }) => void,
  ) {
    this.activeDevices.forEach((device, nodeId) => {
      device.physicalLayer.onDataTransmit = (packet) => {
        const neighborIds = this.topologyGraph.getEdges(nodeId);
        for (let neighborId of neighborIds) {
          const targetDevice = this.activeDevices.get(neighborId);
          if (targetDevice) {
            const receivedPacket = targetDevice.receivePacket(packet.clone());
            if (receivedPacket) {
              onComplete({
                finalPayload: receivedPacket.getPayload(),
                logs: this.logger.getLogs(),
                packetSize: receivedPacket.getPacketSize(receivedPacket),
              });
            }
          }
        }
      };
    });
  }

  public async runSimulation(config: simulationConfig): Promise<{
    finalPayload: string | null;
    logs: LogEntry[];
    packetSize: number | null;
  }> {
    return new Promise((resolve) => {
      this.connectPhysicalLayers(resolve);

      console.log(`[Orchestrator] Starting simulation with Default Gateway...`);
      let senderId: string | null = null;

      for (const node of this.topologyGraph.getAllNodes()) {
        if (node.ip === config.srcIp) {
          senderId = node.id;
          break;
        }
      }
      if (senderId) {
        const senderDevice = this.activeDevices.get(senderId);

        if (senderDevice instanceof Host) {
          senderDevice.initiateTransmission(config);
        }
      } else {
        this.logger.log(
          LayerLevel.APPLICATION,
          'Could not find a Host matching the source IP!',
          LogLevel.ERROR,
        );
      }
    });
  }
}
