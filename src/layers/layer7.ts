// Custom Import
import { BasePacket } from '../core/Packet';

// Types and Interfaces

import { Header } from '../core/Header';

export interface Layer7 {
  layer: number;
  protocol: string;
  contentType: string;
  type: string;
  sender: string;
  timestamp: number;
}
const packet = new BasePacket(payload);

export const processLayer7Outgoing = (packet: BasePacket) => {
  const layer7headers: Header = {
    layer: 7,
    layerName: 'Application Layer',
    data: {
      protocol: 'HTTP/1.1',
      method: 'POST',
      contentType: 'plain/Text',
    },
  };
  const sender = 'abdulRfay';

  packet.headers.push(layer7headers);
};
export const processLayer7Incoming = (packet: BasePacket) => {};
