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
    }) => void,
  ) {
    this.hostA.physicalLayer.onDataTransmit = (packet) => {
      this.logger.log(
        LayerLevel.PHYSICAL,
        `Transmission: Host A -> Router`,
        LogLevel.INFO,
      );
      this.router.forwardPacket(packet.clone());
    };

    this.router.physicalLayer.onDataTransmit = (packet) => {
      this.logger.log(
        LayerLevel.PHYSICAL,
        `Transmission: Router -> Host B`,
        LogLevel.INFO,
      );
      const finalPacket = this.hostB.onReceipt(packet.clone());

      onComplete({
        finalPayload: finalPacket!.getPayload(),
        logs: this.logger.getLogs(),
      });
    };

    this.hostA.physicalLayer.onDataDroped = () => {
      onComplete({
        finalPayload: null,
        logs: this.logger.getLogs(),
      });
    };
    this.router.physicalLayer.onDataDroped = () => {
      onComplete({
        finalPayload: null,
        logs: this.logger.getLogs(),
      });
    };
  }

  public async runSimulation(
    config: simulationConfig,
  ): Promise<{ finalPayload: string | null; logs: LogEntry[] }> {
    this.logger.clearLogs();

    return new Promise((resolve) => {
      this.connectPhysicalLayers(resolve);

      console.log(`[Orchestrator] Starting simulation with Default Gateway...`);
      this.hostA.initiateTransmission(config);
    });
  }
}
