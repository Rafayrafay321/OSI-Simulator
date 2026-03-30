// Node imports
import { jest, describe, it, expect, beforeEach } from '@jest/globals';

// Custom imports
import { TransportLayer } from '../src/layers/transportLayer_4';
import { BasePacket } from '../src/core/Packet';
import { Logger } from '../src/core/Logger';
import * as env from '../src/config/env';
import { LayerLevel, LogLevel } from '../src/types';

jest.mock('../src/core/Logger');
jest.mock('../src/core/Packet', () => ({
  BasePacket: jest.fn().mockImplementation(() => {
    return {
      payload: null,
      metadata: {},
      headers: [],
      addHeader: jest.fn(),
      setPayload: jest.fn(),
      to16BitChunck: jest.fn().mockReturnValue([]),
      addBaseSegmentHeaders: jest.fn().mockReturnValue([]),
    };
  }),
}));
jest.mock('../src/config/env');
describe('Transport Layer Tests', () => {
  let transportLayer: TransportLayer;
  let mockPacket: jest.Mocked<BasePacket>;
  let mockLogger: jest.Mocked<Logger>;

  beforeEach(() => {
    jest.clearAllMocks();

    mockPacket = new BasePacket() as jest.Mocked<BasePacket>;

    mockLogger = {
      log: jest.fn(),
    } as unknown as jest.Mocked<Logger>;

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
    mockPacket.payload = 'Hello World';

    jest.mocked(env).env.CONFIG_MSS = 10;
    const n = Math.ceil(
      mockPacket.payload.length / (jest.mocked(env).env.CONFIG_MSS as number),
    );

    transportLayer.handleOutgoing(mockPacket);
    expect(mockLogger.log).toHaveBeenCalled();
  });
});
