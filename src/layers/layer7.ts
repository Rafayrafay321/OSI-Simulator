// Custom Import
import { BasePacket } from '../core/Packet';
import { LayerData, LayerLevel } from '../types';
export const processLayer7Outgoing = (
  payload: string,
  senderIdentity: string,
): BasePacket => {
  const packet = new BasePacket(payload);
  const layer7headers: LayerData = {
    protocol: 'HTTP/1.1',
    method: 'POST',
    sender: senderIdentity,
  };
  packet.addHeader(LayerLevel.APPLICATION, layer7headers);

  return packet;
};
export const processLayer7Incoming = (packet: BasePacket) => {};
