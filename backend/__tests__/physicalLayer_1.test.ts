import { jest, describe, it, expect, beforeEach } from '@jest/globals';
import { PhysicalLayer } from '../src/layers/physicalLayer_1';
import { BasePacket } from '../src/core/Packet';
import { Logger } from '../src/core/Logger';
import { LayerLevel, LogLevel } from '../src/types';

// Mocking dependencies
jest.mock('../src/core/Packet', () => ({
  BasePacket: jest.fn().mockImplementation(() => {
    const mockInstance = {
      payload: null,
      setPayload: jest.fn(),
      metadata: {},
    };
    return mockInstance;
  }),
}));

describe('PhysicalLayer', () => {
  let physicalLayer: PhysicalLayer;
  let mockLogger: jest.Mocked<Logger>;

  beforeEach(() => {
    jest.clearAllMocks();
    mockLogger = {
      log: jest.fn(),
    } as unknown as jest.Mocked<Logger>;
    physicalLayer = new PhysicalLayer(mockLogger);

    // Mock the handleIncoming to prevent loopback in tests
    jest.spyOn(physicalLayer, 'handleIncoming').mockImplementation(() => {});
  });

  describe('handleOutgoing', () => {
    let mockPacket: jest.Mocked<BasePacket>;

    beforeEach(() => {
      mockPacket = {
        payload: 'test payload',
        metadata: {
          currentLayer: LayerLevel.NETWORK,
        },
      } as unknown as jest.Mocked<BasePacket>;
    });

    it('should throw an error if payload is not a string', () => {
      (mockPacket as any).payload = 12345;
      expect(() => physicalLayer.handleOutgoing(mockPacket)).toThrow(
        'Payload must be a string.',
      );
      expect(mockLogger.log).toHaveBeenCalledWith(
        LayerLevel.PHYSICAL,
        'Payload must be a string.',
        LogLevel.ERROR,
      );
    });

    it('should process a valid string payload', () => {
      physicalLayer.handleOutgoing(mockPacket);
      expect(mockLogger.log).toHaveBeenCalledWith(
        LayerLevel.PHYSICAL,
        'Handling outgoing packet.',
        LogLevel.INFO,
      );
      expect(mockLogger.log).toHaveBeenCalledWith(
        LayerLevel.PHYSICAL,
        expect.stringContaining('Transmitting'),
        LogLevel.INFO,
      );
      expect(mockPacket.metadata.currentLayer).toBe(LayerLevel.PHYSICAL);
    });
  });

  describe('handleIncoming', () => {
    let mockPacket: jest.Mocked<BasePacket>;

    beforeEach(() => {
      (physicalLayer.handleIncoming as jest.Mock).mockRestore();

      mockPacket = {
        payload: null,
        setPayload: jest.fn(),
        metadata: {},
      } as unknown as jest.Mocked<BasePacket>;
    });

    it('should correctly handle a valid incoming payload', () => {
      const incomingPayload = '0101010101';
      physicalLayer.handleIncoming(mockPacket, incomingPayload);
      expect(mockPacket.setPayload).toHaveBeenCalledWith(incomingPayload);
      expect(mockPacket.metadata.currentLayer).toBe(LayerLevel.PHYSICAL);
      expect(mockLogger.log).toHaveBeenCalledWith(
        LayerLevel.PHYSICAL,
        'Handling incoming packet.',
        LogLevel.INFO,
      );
      expect(mockLogger.log).toHaveBeenCalledWith(
        LayerLevel.PHYSICAL,
        'Received raw data.',
        LogLevel.INFO,
      );
    });
  });
});
