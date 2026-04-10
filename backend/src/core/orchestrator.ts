import { Host } from './Host';
import { Router } from './Router';
import { Logger } from './Logger';
import {
  LayerLevel,
  LogLevel,
  HostConfig,
  LogEntry,
  simulationConfig,
} from '../types';

export class Orchestrator {
  public hostA: Host;
  public hostB: Host;
  public router: Router;
  public logger: Logger;
  private arpCache: Map<string, string>;

  constructor(config: simulationConfig) {
    this.logger = new Logger();
    this.arpCache = new Map<string, string>();

    const routerIp = '192.168.1.1';
    const routerMac = '00:00:5E:00:53:AA';

    const hostAConfig: HostConfig = {
      ipAddress: config.srcIp,
      macAddress: 'AA:AA:AA:AA:AA:AA',
      defaultGateway: routerIp,
      srcPort: config.srcPort,
      srcProtocol: config.appProtocol,
      srcMethod: config.appMethod,
      dropChance: config.dropChance,
    };
    this.hostA = new Host('HostA', hostAConfig, this.logger, this.arpCache);

    const hostBConfig: HostConfig = {
      ipAddress: config.destIp,
      macAddress: 'BB:BB:BB:BB:BB:BB',
      defaultGateway: routerIp,
      srcPort: config.destPort,
      srcProtocol: config.appProtocol,
      srcMethod: config.appMethod,
    };
    this.hostB = new Host('HostB', hostBConfig, this.logger, this.arpCache);

    const routerConfig = {
      ipAddress: routerIp,
      macAddress: routerMac,
    };
    this.router = new Router(
      'RouterA',
      routerConfig,
      this.logger,
      this.arpCache,
    );

    this.arpCache.set(routerIp, routerMac);
    this.arpCache.set(config.destIp, hostBConfig.macAddress);
  }

  private connectPhysicalLayers(
    onComplete: (data: {
      finalPayload: string | null;
      logs: LogEntry[];
      packetSize: number | null;
    }) => void,
  ) {
    this.hostA.physicalLayer.onDataTransmit = (packet) => {
      this.logger.log(
        LayerLevel.PHYSICAL,
        `Transmission: HostA -> RouterA`,
        LogLevel.INFO,
      );
      this.router.forwardPacket(packet.clone());
    };

    this.router.physicalLayer.onDataTransmit = (packet) => {
      this.logger.log(
        LayerLevel.PHYSICAL,
        `Transmission: RouterA -> HostB`,
        LogLevel.INFO,
      );
      const finalPacket = this.hostB.onReceipt(packet.clone());

      if (finalPacket) {
        this.logger.log(
          LayerLevel.APPLICATION,
          'Host B received final payload',
          LogLevel.SUCCESS,
        );
        onComplete({
          finalPayload: finalPacket.getPayload(),
          logs: this.logger.getLogs(),
          packetSize: finalPacket.getPacketSize(finalPacket),
        });
      } else {
        // If we don't get a final packet, it might be buffered (fragmentation) or dropped internally.
        // Since fragments are processed synchronously, we can use a setTimeout to resolve if it truly hangs,
        // but for now we'll rely on onDataDroped or the final fragment to resolve.
        // We will NOT call onComplete here for null packets to avoid ending the simulation during fragmentation.
      }
    };

    this.hostA.physicalLayer.onDataDroped = () => {
      onComplete({
        finalPayload: null,
        logs: this.logger.getLogs(),
        packetSize: null,
      });
    };
    this.router.physicalLayer.onDataDroped = () => {
      onComplete({
        finalPayload: null,
        logs: this.logger.getLogs(),
        packetSize: null,
      });
    };
  }

  public async runSimulation(config: simulationConfig): Promise<{
    finalPayload: string | null;
    logs: LogEntry[];
    packetSize: number | null;
  }> {
    this.logger.clearLogs();

    return new Promise((resolve) => {
      this.connectPhysicalLayers(resolve);

      console.log(`[Orchestrator] Starting simulation with Default Gateway...`);
      this.hostA.initiateTransmission(config);
    });
  }
}
