// Node imports
import { jest, describe, it, expect, beforeEach } from '@jest/globals';

// Custom imports
import { TransportLayer } from '../src/layers/transportLayer_4';
import { BasePacket } from '../src/core/Packet';
import { Logger } from '../src/core/Logger';
import * as env from '../src/config/env';
import {
  LayerData,
  LayerLevel,
  LogLevel,
  TransportLayerData,
} from '../src/types';

// Mocks
jest.mock('../src/core/Logger');
jest.mock('../src/config/env');
jest.mock('../src/core/Packet', () => ({
  BasePacket: jest.fn().mockImplementation(() => ({
    payload: null,
    metadata: null,
    headers: [],
    addHeader: jest.fn(),
    getHeader: jest.fn(),
    removeHeader: jest.fn(),
    to16BitChunck: jest.fn(),
    getPayload: jest.fn(function (this: { payload: string }) {
      return this.payload;
    }),
    setPayload: jest.fn(function (
      this: { payload: string },
      newPayload: string,
    ) {
      this.payload = newPayload;
    }),
    getPayloadSize: jest.fn().mockReturnValue(0),
  })),
}));

// Test-side checksum calculation to verify against the implementation
const calculateTestChecksum = (payload: string): number => {
  if (!payload) return 0;
  return payload
    .split('')
    .reduce((sum, char) => sum + char.charCodeAt(0), 0);
};

describe('Transport Layer', () => {
  let transportLayer: TransportLayer;
  let mockLogger: jest.Mocked<Logger>;

  beforeEach(() => {
    jest.clearAllMocks();
    mockLogger = { log: jest.fn() } as unknown as jest.Mocked<Logger>;
    transportLayer = new TransportLayer(
      {
        srcPort: 80,
        destPort: 120,
        segmentIndex: 0,
        totalSegment: 1,
        underlyingProtocol: 'TCP',
      },
      mockLogger,
    );
  });

  describe('HandleOutgoing Tests', () => {
    let mockPacket: jest.Mocked<BasePacket>;

    beforeEach(() => {
        mockPacket = new BasePacket() as jest.Mocked<BasePacket>;
    });

    it('should throw an error if the packet has no payload', () => {
      expect(() => {
        transportLayer.handleOutgoing(mockPacket);
      }).toThrow('Payload can not be empty');

      expect(mockLogger.log).toHaveBeenCalledWith(
        LayerLevel.TRANSPORT,
        'Payload can not be empty',
        LogLevel.ERROR,
      );
    });

    it('should add transport header and pass a single packet to the network layer when payload is within MSS', () => {
      mockPacket.payload = 'Hello World';
      jest.mocked(env).env.CONFIG_MSS = 2000;

      transportLayer.handleOutgoing(mockPacket);

      expect(mockPacket.addHeader).toHaveBeenCalledWith(LayerLevel.TRANSPORT, {
        underlyingProtocol: 'TCP',
        srcPort: 80,
        destPort: 120,
        checkSum: expect.any(Number),
        segmentIndex: 0,
        totalSegment: 1,
      });

      expect(mockPacket.metadata).toEqual({
        currentLayer: LayerLevel.TRANSPORT,
        direction: 'SENDER_TO_RECEIVER',
        status: 'HEALTHY',
      });
    });

    it('should segment a large payload and pass multiple packets to the network layer when payload exceeds MSS', () => {
      mockPacket.payload = 'This is a very long payload that definitely exceeds the Maximum Segment Size';
      jest.mocked(env).env.CONFIG_MSS = 10;
      
      transportLayer.handleOutgoing(mockPacket);
      
      const payloadLength = mockPacket.payload.length;
      const segmentCount = Math.ceil(payloadLength / 10);

      expect(mockLogger.log).toHaveBeenCalledWith(
        LayerLevel.TRANSPORT,
        `Payload > MSS. Segmenting into ${segmentCount} segments.`,
        LogLevel.INFO,
      );
    });
  });

  describe('Handle Incoming Tests', () => {
    function createMockPacket(
      payload: string,
      overrides: Partial<TransportLayerData> = {},
      id: string = 'packet1',
    ): jest.Mocked<BasePacket> {
      const header: LayerData = {
        underlyingProtocol: 'TCP',
        srcPort: 443,
        destPort: 5000,
        segmentIndex: 0,
        totalSegment: 1,
        ...overrides,
        checkSum:
          (overrides as TransportLayerData).checkSum ??
          calculateTestChecksum(payload),
      };

      const mockPacket = {
        id,
        payload,
        headers: [header],
        metadata: null,
        addHeader: jest.fn(),
        getHeader: jest.fn().mockReturnValue(header),
        removeHeader: jest.fn(),
        setPayload: jest.fn(),
      } as unknown as jest.Mocked<BasePacket>;

      return mockPacket;
    }

    it('should reject a packet with an invalid checksum', () => {
      const payload = 'TestPayload';
      const correctChecksum = calculateTestChecksum(payload);
      const invalidChecksum = correctChecksum + 1;

      const packet = createMockPacket(payload, { checkSum: invalidChecksum });

      expect(() => transportLayer.handleIncoming(packet)).toThrow(
        'Checksum validation failed. Packet is corrupted.',
      );
      expect(mockLogger.log).toHaveBeenCalledWith(
        LayerLevel.TRANSPORT,
        expect.stringContaining('Invalid checksum'),
        LogLevel.ERROR,
      );
    });

    it('should process a single, non-segmented packet immediately', () => {
      const packet = createMockPacket('SinglePacket');
      const result = transportLayer.handleIncoming(packet);

      expect(result).toBe(packet);
      expect(packet.removeHeader).toHaveBeenCalledWith(LayerLevel.TRANSPORT);
      expect(mockLogger.log).toHaveBeenCalledWith(
        LayerLevel.TRANSPORT,
        'Passing single packet up to Application Layer.',
        LogLevel.INFO,
      );
    });

    it('should buffer the first segment of a multi-segment message', () => {
      const packet = createMockPacket('Segment1', {
        segmentIndex: 0,
        totalSegment: 2,
      });
      const result = transportLayer.handleIncoming(packet);

      expect(result).toBeNull(); // Should not return a packet yet
      expect(mockLogger.log).toHaveBeenCalledWith(
        LayerLevel.TRANSPORT,
        'Buffering segment 0 of 2.',
        LogLevel.INFO,
      );
    });

    it('should reassemble and return the full packet when the last segment arrives in order', () => {
      const firstPacket = createMockPacket('Hello, ', {
        segmentIndex: 0,
        totalSegment: 2,
      });
      transportLayer.handleIncoming(firstPacket);

      const secondPacket = createMockPacket('World!', {
        segmentIndex: 1,
        totalSegment: 2,
      });
      const result = transportLayer.handleIncoming(secondPacket);

      expect(result).not.toBeNull();
      expect(result?.payload).toBe('Hello, World!');
      expect(mockLogger.log).toHaveBeenCalledWith(
        LayerLevel.TRANSPORT,
        'All segments received. Reassembling packet.',
        LogLevel.INFO,
      );
      expect(mockLogger.log).toHaveBeenCalledWith(
        LayerLevel.TRANSPORT,
        'Passing reassembled packet up to Application Layer.',
        LogLevel.INFO,
      );
    });

    it('should handle and reassemble segments that arrive out of order', () => {
      const secondPacket = createMockPacket('World!', {
        segmentIndex: 1,
        totalSegment: 2,
      });
      let result = transportLayer.handleIncoming(secondPacket);
      expect(result).toBeNull();
      expect(mockLogger.log).toHaveBeenCalledWith(
        LayerLevel.TRANSPORT,
        'Buffering segment 1 of 2.',
        LogLevel.INFO,
      );

      const firstPacket = createMockPacket('Hello, ', {
        segmentIndex: 0,
        totalSegment: 2,
      });
      result = transportLayer.handleIncoming(firstPacket);

      expect(result).not.toBeNull();
      expect(result?.payload).toBe('Hello, World!');
      expect(mockLogger.log).toHaveBeenCalledWith(
        LayerLevel.TRANSPORT,
        'All segments received. Reassembling packet.',
        LogLevel.INFO,
      );
    });
  });
});
