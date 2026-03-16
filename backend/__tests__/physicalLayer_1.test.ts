// Node imports
import { jest, describe, it, expect, beforeEach } from '@jest/globals';

// Custom imports
import { PhysicalLayer } from '../src/layers/physicalLayer_1'; // Adjust path as needed
import { BasePacket } from '../src/core/Packet';
import { Logger } from '../src/core/Logger';
import { LayerLevel, LogLevel } from '../src/types';

// Mocking dependencies
jest.mock('../src/core/Packet', () => ({
  BasePacket: jest.fn().mockImplementation(() => {
    const mockInstance = {
      setPayload: jest.fn(),
      metadata: {},
    };
    return mockInstance;
  }),
}));

describe('Physical Layer Tests', () => {
  let physicalLayer: PhysicalLayer;
  let mockLogger: jest.Mocked<Logger>;

  let mockOutgoingPacket: jest.Mocked<BasePacket>;
  let mockIncomingPacket: jest.Mocked<BasePacket>;

  beforeEach(() => {
    jest.clearAllMocks();

    mockLogger = {
      log: jest.fn(),
    } as unknown as jest.Mocked<Logger>;

    mockOutgoingPacket = {
      payload: null,
      metadata: {
        currentLayer: LayerLevel.APPLICATION,
      },
    } as unknown as jest.Mocked<BasePacket>;

    mockIncomingPacket = new BasePacket() as jest.Mocked<BasePacket>;

    physicalLayer = new PhysicalLayer(mockLogger);
  });
  describe('HandleOutgoing tests', () => {
    it('should log an error and throw if the packet has no payload', () => {
      expect(() => {
        physicalLayer.handleOutgoing(mockOutgoingPacket);
      }).toThrow('Payload can not be empty');

      expect(mockLogger.log).toHaveBeenCalledWith(
        LayerLevel.DATA_LINK,
        'Payload can not be empty',
        LogLevel.ERROR,
      );
    });

    it('should serialize the packet, log info, and pass it to handleIncoming', () => {
      mockOutgoingPacket.payload = 'Hello World';

      physicalLayer.handleOutgoing(mockOutgoingPacket);

      expect(mockLogger.log).toHaveBeenCalledWith(
        LayerLevel.PHYSICAL,
        'Handling outgoing packet.',
        LogLevel.INFO,
      );

      expect(mockLogger.log).toHaveBeenCalledWith(
        LayerLevel.APPLICATION,
        expect.stringContaining('Transmitting'),
        LogLevel.INFO,
      );

      expect(mockOutgoingPacket.metadata.currentLayer).toBe(
        LayerLevel.PHYSICAL,
      );
    });
  });

  describe('HandleIncoming Tests', () => {
    it('Should create the packet object', () => {
      const incomingPayload = '0101010101';

      physicalLayer.handleIncoming(mockIncomingPacket, incomingPayload);

      expect(mockIncomingPacket.setPayload).toHaveBeenCalled();
    });
  });
});
