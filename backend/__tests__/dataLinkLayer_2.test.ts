// Node imports
import { jest, describe, it, expect, beforeEach } from '@jest/globals';

// Custom imports
import { BasePacket } from '../src/core/Packet';
import { DataLinkLayer } from '../src/layers/dataLinkLayer_2';
import { Logger } from '../src/core/Logger';

// Types
import { LayerLevel, LogLevel } from '../src/types';

// Mocking Dependencies
jest.mock('../src/core/Logger');

jest.mock('../src/core/Packet', () => ({
  BasePacket: jest.fn().mockImplementation(() => ({
    payload: 'Default Payload',
    metadata: {},
    headers: [],
    addHeader: jest.fn(),
    getHeader: jest.fn(),
    removeHeader: jest.fn(),
    getPayload: jest.fn().mockReturnThis(),
    setPayload: jest.fn(),
    to16BitChuck: jest.fn().mockReturnValue([1, 2, 3]), // Return some mock data
  })),
}));

describe('DataLinkLayer Tests', () => {
  let dataLinkLayer: DataLinkLayer;
  let mockPacket: jest.Mocked<BasePacket>;
  let mockLogger: jest.Mocked<Logger>;
  let mockArpCache: Map<string, string>;

  const MY_MAC_ADDRESS = 'AA:BB:CC:DD:EE:FF';
  const OTHER_MAC_ADDRESS = '11:22:33:44:55:66';
  const BROADCAST_MAC_ADDRESS = 'FF:FF:FF:FF:FF:FF';

  beforeEach(() => {
    jest.clearAllMocks();

    mockLogger = new Logger() as jest.Mocked<Logger>;
    mockPacket = new BasePacket() as jest.Mocked<BasePacket>;
    mockArpCache = new Map<string, string>();

    dataLinkLayer = new DataLinkLayer(
      {
        srcMac: MY_MAC_ADDRESS,
        etherType: 2048,
      },
      mockArpCache,
      mockLogger,
    );

    jest.spyOn(dataLinkLayer as any, 'calCheckSum').mockReturnValue(12345);
  });

  describe('handleOutgoing', () => {
    it('Should throw an Error if packet has no payload', () => {
      mockPacket.payload = '';
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

    it('should find the MAC address and add the data link header', () => {
      const destIp = '192.168.1.2';
      const destMac = '00:1B:44:11:3A:B7';
      mockPacket.metadata.destinationIp = destIp;
      mockPacket.payload = 'Hello World';
      mockArpCache.set(destIp, destMac);

      dataLinkLayer.handleOutgoing(mockPacket);

      expect(mockPacket.addHeader).toHaveBeenCalledWith(LayerLevel.DATA_LINK, {
        srcMac: MY_MAC_ADDRESS,
        etherType: 2048,
        destMac: destMac,
        trailer: expect.any(Number),
      });
    });
  });

  describe('handleIncoming', () => {
    it('should process packet when destination MAC matches layer MAC', () => {
      const header = { destMac: MY_MAC_ADDRESS, trailer: 12345 };
      (mockPacket.getHeader as jest.Mock).mockReturnValue(header);

      dataLinkLayer.handleIncoming(mockPacket);

      expect(mockLogger.log).not.toHaveBeenCalledWith(
        expect.anything(),
        expect.stringContaining('Dropping packet'),
        expect.anything(),
      );
      expect(mockPacket.removeHeader).toHaveBeenCalledWith(
        LayerLevel.DATA_LINK,
      );
    });

    it('should drop packet when destination MAC does not match layer MAC', () => {
      const header = { destMac: OTHER_MAC_ADDRESS, trailer: 12345 };
      (mockPacket.getHeader as jest.Mock).mockReturnValue(header);

      // Action
      dataLinkLayer.handleIncoming(mockPacket);

      expect(mockLogger.log).toHaveBeenCalledWith(
        LayerLevel.DATA_LINK,
        expect.stringContaining('Dropping packet for incorrect MAC'),
        LogLevel.INFO,
      );
      expect(mockPacket.removeHeader).not.toHaveBeenCalled();
    });

    it('should process packet when destination MAC is the broadcast address', () => {
      const header = { destMac: BROADCAST_MAC_ADDRESS, trailer: 12345 };
      (mockPacket.getHeader as jest.Mock).mockReturnValue(header);

      dataLinkLayer.handleIncoming(mockPacket);

      expect(mockLogger.log).not.toHaveBeenCalledWith(
        expect.anything(),
        expect.stringContaining('Dropping packet'),
        expect.anything(),
      );
      expect(mockPacket.removeHeader).toHaveBeenCalledWith(
        LayerLevel.DATA_LINK,
      );
    });

    it('should drop packet if header is missing', () => {
      (mockPacket.getHeader as jest.Mock).mockReturnValue(undefined);

      dataLinkLayer.handleIncoming(mockPacket);

      expect(mockLogger.log).toHaveBeenCalledWith(
        LayerLevel.DATA_LINK,
        'Packet is missing DataLink header',
        LogLevel.ERROR,
      );
      expect(mockPacket.removeHeader).not.toHaveBeenCalled();
    });

    it('should drop packet if checksum is invalid', () => {
      const header = { destMac: MY_MAC_ADDRESS, trailer: 54321 };
      (mockPacket.getHeader as jest.Mock).mockReturnValue(header);

      // The 'calCheckSum' spy is already mocked to return 12345
      // The incoming trailer is 54321, so they won't match.

      dataLinkLayer.handleIncoming(mockPacket);

      // Assertion: We drop due to bad checksum
      expect(mockLogger.log).toHaveBeenCalledWith(
        LayerLevel.DATA_LINK,
        expect.stringContaining('Invalid checksum. Dropping packet'),
        LogLevel.ERROR,
      );
      expect(mockPacket.removeHeader).not.toHaveBeenCalled();
    });
  });
});
