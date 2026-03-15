import { ApplicationLayer } from '../layers/applicationLayer_7';
import { TransportLayer } from '../layers/transportLayer_4';
import { NetworkLayer } from '../layers/networkLayer_3';
import { DataLinkLayer } from '../layers/dataLinkLayer_2';
import { PhysicalLayer } from '../layers/physicalLayer_1';
import { BasePacket } from './Packet';
import { Logger } from './Logger';
import { LayerLevel, LogLevel } from '../types';

export class Orchestrator {
  public host_A: ApplicationLayer;
  public host_B: ApplicationLayer;
  public hostANetworkLayer: NetworkLayer;
  public hostBNetworkLayer: NetworkLayer;
  public router: NetworkLayer;
  private logger: Logger;

  constructor(logger: Logger) {
    this.logger = logger;
    const macAddressRegistry = new Map<string, string>();
    macAddressRegistry.set('192.168.1.10', '02:A1:C3:54:7B:9D'); // Host A
    macAddressRegistry.set('192.168.2.10', '0E:88:2F:C1:B9:44'); // Host B

    // Host A instance
    this.host_A = new ApplicationLayer(
      {
        protocol: 'HTTP/1.1',
        method: 'POST',
        sender: 'abdulRafay',
      },
      new TransportLayer(
        {
          srcPort: 80,
          destPort: 120,
          checkSum: 0,
          segmentIndex: 0,
          totalSegment: 0,
          underlyingProtocol: 'TCP',
        },
        (this.hostANetworkLayer = new NetworkLayer(
          {
            id: '3944jvjjf3',
            srcIp: '192.168.1.10',
            destIp: '192.0.2.45',
            ttl: 64,
            protocol: 6,
            DFflag: 1,
            MFflag: 1,
            fragmentOffSet: 100,
          },
          new DataLinkLayer(
            {
              srcMac: '02:A1:C3:54:7B:9D',
              etherType: 80000,
            },
            new PhysicalLayer(this.logger),
            macAddressRegistry,
            this.logger,
          ),
          this.logger,
        )),
        this.logger,
      ),
      this.logger,
    );

    // Host B instance
    this.host_B = new ApplicationLayer(
      {
        protocol: 'HTTP/1.1',
        method: 'POST',
        sender: 'abdulRafay',
      },
      new TransportLayer(
        {
          srcPort: 80,
          destPort: 120,
          checkSum: 0,
          segmentIndex: 0,
          totalSegment: 0,
          underlyingProtocol: 'TCP',
        },
        (this.hostBNetworkLayer = new NetworkLayer(
          {
            id: '3944jvjjf33',
            srcIp: '192.168.2.10',
            destIp: '192.0.2.45',
            ttl: 64,
            protocol: 6,
            DFflag: 1,
            MFflag: 1,
            fragmentOffSet: 100,
          },
          new DataLinkLayer(
            {
              srcMac: '02:A1:C3:54:7B:9D',
              etherType: 80000,
            },
            new PhysicalLayer(this.logger),
            macAddressRegistry,
            this.logger,
          ),
          this.logger,
        )),
        this.logger,
      ),
      this.logger,
    );
    const routingTable = new Map<string, NetworkLayer>();
    routingTable.set('192.168.1.10', this.hostANetworkLayer);
    routingTable.set('192.168.2.10', this.hostBNetworkLayer);

    // Router Instance
    this.router = new NetworkLayer(
      {
        id: '3944jvjjf3',
        srcIp: '192.168.1.10',
        destIp: '192.0.2.45',
        ttl: 64,
        protocol: 6,
        DFflag: 1,
        MFflag: 1,
        fragmentOffSet: 100,
      },
      new DataLinkLayer(
        {
          srcMac: '02:A1:C3:54:7B:9D',
          etherType: 80000,
        },
        new PhysicalLayer(this.logger),
        macAddressRegistry,
        this.logger,
      ),
      this.logger,
      routingTable,
    );
  }

  public start(payload: string): void {
    this.logger.log(
      LayerLevel.APPLICATION,
      'Starting simulation...',
      LogLevel.INFO,
    );
    const packet = new BasePacket();
    packet.metadata.destinationIp = '192.168.2.10';
    this.host_A.handleOutgoing(packet, payload);
    this.logger.log(
      LayerLevel.APPLICATION,
      'Simulation finished.',
      LogLevel.INFO,
    );
    return;
  }
}
