// Node imports
import { jest, describe, it, expect, beforeEach } from '@jest/globals';

// Custom imports
import { BasePacket } from '../src/core/Packet';
import { DataLinkLayer } from '../src/layers/dataLinkLayer_2';
import { Logger } from '../src/core/Logger';

// Types
import { LayerLevel } from '../src/types';

// Mocking Dependencies
jest.mock('../src/core/Logger');
jest.mock('../src/core/Packet', () => ({
  BasePacket: jest.fn().mockImplementation(() => {
    const mockInstance = {
      payload: null,
      metadata: {},
      addHeader: jest.fn(),
      to16BitChuck: jest.fn().mockReturnValue([]),
    };
    return mockInstance;
  }),
}));

describe('dataLinkLayer Tests', () => {
  let dataLinkLayer: DataLinkLayer;

  let mockPacket: jest.Mocked<BasePacket>;
  let mockLogger: jest.Mocked<Logger>;
  let mockArpCache: Map<string, string>;

  beforeEach(() => {
    jest.clearAllMocks();

    mockLogger = {
      log: jest.fn(),
    } as unknown as jest.Mocked<Logger>;

    mockPacket = new BasePacket() as jest.Mocked<BasePacket>;

    mockArpCache = new Map<string, string>();

    dataLinkLayer = new DataLinkLayer(
      {
        srcMac: '02:A1:C3:54:7B:9D',
        etherType: 80000,
      },
      mockArpCache,
      mockLogger,
    );
  });

  it('Should throw an Error if packet has no payload', () => {
    expect(() => {
      dataLinkLayer.handleOutgoing(mockPacket);
    }).toThrow('Payload can not be empty');
  });

  it('Should throw an Error if packet.metadata has no IpAddress', () => {
    mockPacket.payload = 'Hello World';
    expect(() => {
      dataLinkLayer.handleOutgoing(mockPacket);
    }).toThrow('Destination IP address can not be empty');
  });

  it('should throw an error if the MAC address is not in the ARP cache', () => {
    mockPacket.payload = 'Hello World';
    mockPacket.metadata.destinationIp = '192.168.1.2';

    expect(() => {
      dataLinkLayer.handleOutgoing(mockPacket);
    }).toThrow('Ip: 192.168.1.2 has no Mac Address');
  });

  it('should find the MAC address and pass the packet to the next layer', () => {
    const destIp = '192.168.1.2';
    const destMac = '00:1B:44:11:3A:B7';
    mockPacket.metadata.destinationIp = destIp;
    mockPacket.payload = 'Hello World';

    mockArpCache.set(destIp, destMac);

    dataLinkLayer.handleOutgoing(mockPacket);

    expect(mockPacket.addHeader).toHaveBeenCalled();
    expect(mockPacket.addHeader).toHaveBeenCalledWith(LayerLevel.DATA_LINK, {
      srcMac: '02:A1:C3:54:7B:9D',
      etherType: 80000,
      destMac: destMac,
      trailer: expect.any(Number),
    });
  });
});
