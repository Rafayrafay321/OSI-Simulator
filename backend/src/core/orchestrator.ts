import { Host } from './Host';
import { Router } from './Router';
import { Switch } from './Switch';
import { Logger } from './Logger';
import { TopologyGraph } from './TopologyGraph';

// Types
import { LayerLevel, LogLevel, LogEntry, simulationConfig } from '../types';

export class Orchestrator {
  public logger: Logger = new Logger();
  private arpCache: Map<string, string> = new Map();
  private activeDevices: Map<string, Host | Router | Switch> = new Map();
  private topologyGraph: TopologyGraph;

  constructor(config: simulationConfig, topologyGraph: TopologyGraph) {
    this.topologyGraph = topologyGraph;

    const nodesToBuild = topologyGraph.getAllNodes();

    for (let node of nodesToBuild) {
      switch (node.type) {
        case 'Host':
          this.activeDevices.set(
            node.id,
            new Host(
              node.id,
              {
                ipAddress: node.ip,
                macAddress: node.mac,
                srcPort: config.srcPort,
                srcProtocol: config.appProtocol,
                srcMethod: config.appMethod,
                dropChance: config.dropChance,
              },
              this.logger,
              this.arpCache,
            ),
          );
          break;

        case 'Router':
          this.activeDevices.set(
            node.id,
            new Router(
              node.id,
              {
                ipAddress: node.ip,
                macAddress: node.mac,
                dropChance: config.dropChance,
              },
              this.logger,
              this.arpCache,
            ),
          );
          break;

        case 'Switch':
          this.activeDevices.set(
            node.id,
            new Switch(
              node.id,
              {
                macAddress: node.mac,
                macTable: new Map<string, string>(),
                portCount: 32,
              },
              this.logger,
              this.arpCache,
            ),
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
      device.physicalLayer.onDataTransmit = (packet, targetNodeId) => {
        if (targetNodeId) {
          const targetedNeighbor = this.activeDevices.get(targetNodeId);
          if (targetedNeighbor) {
            const receivedPacket = targetedNeighbor.receivePacket(
              packet.clone(),
              nodeId,
            );
            if (receivedPacket) {
              onComplete({
                finalPayload: receivedPacket.getPayload(),
                logs: this.logger.getLogs(),
                packetSize: receivedPacket.getPacketSize(receivedPacket),
              });
            }
          }
        } else {
          const neighborIds = this.topologyGraph.getEdges(nodeId);
          for (let neighborId of neighborIds) {
            if (neighborId === packet.metadata.incomingPacketId) {
              continue;
            }
            const targetDevice = this.activeDevices.get(neighborId);
            if (targetDevice) {
              const receivedPacket = targetDevice.receivePacket(
                packet.clone(),
                nodeId,
              );
              if (receivedPacket) {
                onComplete({
                  finalPayload: receivedPacket.getPayload(),
                  logs: this.logger.getLogs(),
                  packetSize: receivedPacket.getPacketSize(receivedPacket),
                });
              }
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
