import { ApplicationLayer } from '../layers/applicationLayer_7';
import { NetworkLayer } from '../layers/networkLayer_3';
import { TransportLayer } from '../layers/transportLayer_4';
import { PhysicalLayer } from '../layers/physicalLayer_1';
import { BasePacket } from './Packet';

export class Orchestrator {
  public applicationLayer: ApplicationLayer;
  constructor() {
    this.applicationLayer = new ApplicationLayer(
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
        new NetworkLayer(
          {
            srcIp: '192.0.2.45',
            destIp: '192.0.2.45',
            ttl: 64,
            protocol: 6,
          },
          new PhysicalLayer(),
        ),
      ),
    );
  }

  public start(payload: string): void {
    const packet = new BasePacket();

    this.applicationLayer.handleOutgoing(packet, payload);
    return;
  }
}
