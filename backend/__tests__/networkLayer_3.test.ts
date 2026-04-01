// Node Imports
import { jest, it, expect, describe, beforeEach } from '@jest/globals';

// Custom imports
import { NetworkLayer } from '../src/layers/networkLayer_3';
import { BasePacket } from '../src/core/Packet';
import { Logger } from '../src/core/Logger';
import * as env from '../src/config/env';
import {
  LayerData,
  LayerLevel,
  LogLevel,
  PacketDirection,
  PacketStatus,
} from '../src/types';

// Types
import { NetworkLayerData } from '../src/types';

// Mock all dependencies of NetworkLayer
jest.mock('../src/config/env');
jest.mock('../src/core/Logger');
jest.mock('node:crypto');
jest.mock('../src/core/Packet', () => ({
  BasePacket: jest.fn().mockImplementation(() => ({
    payload: null,
    metadata: null,
    headers: [],
    addHeader: jest.fn(),
    getHeader: jest.fn(),
    removeHeader: jest.fn(),
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
    clone: jest.fn(function (this: any) {
      const newPacket = new BasePacket();
      newPacket.headers = [...this.headers];
      return newPacket;
    }),
  })),
}));

const createMockHeader = (
  overides: Partial<NetworkLayerData> = {},
): LayerData => ({
  id: 'default-id',
  srcIp: '192.168.2.10',
  destIp: '192.0.2.45',
  ttl: 64,
  protocol: 6,
  DFflag: 0,
  MFflag: 0,
  fragmentOffSet: 0,
  ...overides,
});

describe('Network Layer Tests', () => {
  let networkLayer: NetworkLayer;
  let mockLogger: jest.Mocked<Logger>;
  let mockPacket: jest.Mocked<BasePacket>;

  beforeEach(() => {
    jest.clearAllMocks();

    mockLogger = new Logger() as jest.Mocked<Logger>;
    mockPacket = new BasePacket() as jest.Mocked<BasePacket>;

    mockPacket.getHeader.mockReturnValue(createMockHeader());

    networkLayer = new NetworkLayer(
      {
        id: '3944jvjjf33',
        srcIp: '192.168.2.10',
        destIp: '192.0.2.45',
        ttl: 64,
        protocol: 6,
        DFflag: 0,
        MFflag: 0,
        fragmentOffSet: 0,
      },
      mockLogger,
    );
  });

  describe('handleOutgoing', () => {
    it('Should throw an error if packet has no payload', () => {
      mockPacket.payload = '';
      expect(() => {
        networkLayer.handleOutgoing(mockPacket);
      }).toThrow('Payload can not be empty');
    });

    it('Should add network headers for non-fragmented packet', () => {
      mockPacket.payload = 'Hello World';
      (mockPacket.getPayloadSize as jest.Mock).mockReturnValue(11);
      jest.mocked(env).env.CONFIG_MTU = 2000;
      jest.mocked(env).env.IP_HEADER_SIZE = 20;

      networkLayer.handleOutgoing(mockPacket);

      expect(mockPacket.addHeader).toHaveBeenCalledWith(
        LayerLevel.NETWORK,
        expect.objectContaining({ MFflag: 0, fragmentOffSet: 0 }),
      );
      expect(mockPacket.metadata).toEqual({
        currentLayer: LayerLevel.NETWORK,
        direction: PacketDirection.SENDER_TO_RECEIVER,
        status: PacketStatus.HEALTHY,
      });
    });
  });
  describe('HandleIncoming', () => {
    it('Should process a single, non-fragment packet imdediatley ', () => {
      const result = networkLayer.handleIncoming(mockPacket);

      expect(mockLogger.log).not.toHaveBeenCalledWith(
        expect.anything(),
        expect.stringContaining('Dropping packet'),
        expect.anything(),
      );
      expect(result).toBe(mockPacket);
      expect(mockPacket.removeHeader).toHaveBeenCalled();
    });

    it('Should buffer the large fragmented packet', () => {
      mockPacket.getHeader.mockReturnValueOnce(createMockHeader({ MFflag: 1 }));
      const result = networkLayer.handleIncoming(mockPacket);
      expect(result).toBeNull();
      expect(mockPacket.removeHeader).not.toHaveBeenCalled();
    });

    it('Should reaasemble all the fragments when last one arrive into one packet', () => {
      const fragment1 = new BasePacket() as jest.Mocked<BasePacket>;
      fragment1.getHeader.mockReturnValue(
        createMockHeader({ id: 'set-1', MFflag: 1, fragmentOffSet: 0 }),
      );
      fragment1.payload = 'Hello';

      const fragment2 = new BasePacket() as jest.Mocked<BasePacket>;
      fragment2.getHeader.mockReturnValue(
        createMockHeader({ id: 'set-1', MFflag: 0, fragmentOffSet: 5 }),
      );
      fragment2.payload = 'World';
      fragment2.setPayload.mockImplementation(function (
        this: { payload: string },
        newPayload: string,
      ) {
        this.payload = newPayload;
      });

      const resultOfF1 = networkLayer.handleIncoming(fragment1);
      const resultOfF2 = networkLayer.handleIncoming(fragment2);

      expect(resultOfF1).toBeNull();
      expect(resultOfF2).not.toBeNull();
      expect(resultOfF2).toBe(fragment2);
      expect(resultOfF2!.payload).toBe('HelloWorld');
    });
  });
});
