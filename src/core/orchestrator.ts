import { ApplicationLayer } from '../layers/applicationLayer_7';
import { NetworkLayer } from '../layers/networkLayer';
import { TransportLayer } from '../layers/transportLayer_4';
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
          segmentIndex: 0,
          totalSegment: 0,
          underlyingProtocol: 'TCP',
        },
        new NetworkLayer(),
      ),
    );
  }

  public start(payload: string): void {
    const packet = new BasePacket();

    this.applicationLayer.handleOutgoing(packet, payload);
    return;
  }
}
