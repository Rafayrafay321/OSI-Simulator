import { ApplicationLayer } from '../layers/applicationLayer_7';
import { NetworkLayer } from '../layers/networkLayer_3';
import { TransportLayer } from '../layers/transportLayer_4';
import { PhysicalLayer } from '../layers/physicalLayer_1';
import { BasePacket } from './Packet';

export class Orchestrator {
  public host_A: ApplicationLayer;
  public host_B: ApplicationLayer;
  public hostANetworkLayer: NetworkLayer;
  public hostBNetworkLayer: NetworkLayer;
  public router: NetworkLayer;
  constructor() {
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
          new PhysicalLayer(),
        )),
      ),
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
          new PhysicalLayer(),
        )),
      ),
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
      new PhysicalLayer(),
      routingTable,
    );
  }

  public start(payload: string): void {
    const packet = new BasePacket();
    packet.metadata.destinationIp = '192.168.2.10';
    this.host_A.handleOutgoing(packet, payload);
    return;
  }
}
