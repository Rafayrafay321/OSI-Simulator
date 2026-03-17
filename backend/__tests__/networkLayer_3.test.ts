// Node Imports
import { jest, it, expect, describe, beforeEach } from '@jest/globals';
import crypto from 'node:crypto';

// Custom imports
import { NetworkLayer } from '../src/layers/networkLayer_3';
import { DataLinkLayer } from '../src/layers/dataLinkLayer_2';
import { BasePacket } from '../src/core/Packet';
import { Logger } from '../src/core/Logger';
import * as env from '../src/config/env';
import {
  LayerLevel,
  LogLevel,
  PacketDirection,
  PacketStatus,
} from '../src/types';

// Mock all dependencies of NetworkLayer
jest.mock('../src/config/env');
jest.mock('../src/core/Logger');
jest.mock('node:crypto');
jest.mock('../src/core/Packet', () => ({
  BasePacket: jest.fn().mockImplementation(() => {
    const mockInstance = {
      payload: null,
      metadata: null,
      headers: [],
      addHeader: jest.fn(),
      setPayload: jest.fn(),
      getPayloadSize: jest.fn().mockReturnValue(0),
      clone: jest.fn(),
    };
    mockInstance.clone.mockImplementation(() => new BasePacket());
    return mockInstance;
  }),
}));

describe('Network Layer Tests', () => {
  let networkLayer: NetworkLayer;
  let mockPacket: jest.Mocked<BasePacket>;
  let mockLogger: jest.Mocked<Logger>;
  let mockNextLayer: jest.Mocked<DataLinkLayer>;

  beforeEach(() => {
    jest.clearAllMocks();

    mockLogger = { log: jest.fn() } as unknown as jest.Mocked<Logger>;

    // This is now simple, as our mock factory does all the hard work.
    mockPacket = new BasePacket() as jest.Mocked<BasePacket>;

    networkLayer = new NetworkLayer(
      {
        id: '3944jvjjf33',
        srcIp: '192.168.2.10',
        destIp: '192.0.2.45',
        ttl: 64,
        protocol: 6,
        DFflag: 1,
        MFflag: 1,
        fragmentOffSet: 100,
      },
      mockLogger,
    );
  });

  it('Should throw an error if packet has no payload', () => {
    expect(() => {
      networkLayer.handleOutgoing(mockPacket);
    }).toThrow('Payload can not be empty');

    expect(mockLogger.log).toHaveBeenCalledWith(
      LayerLevel.NETWORK,
      'Payload can not be empty',
      LogLevel.ERROR,
    );
  });

  it('Should add network headers and pass a single packet to the datalink layer when payload is in MTU', () => {
    // Arrange
    mockPacket.payload = 'Hello World';
    // We must tell the mock how to respond when getPayloadSize() is called
    (mockPacket.getPayloadSize as jest.Mock).mockReturnValue(11);
    jest.mocked(env).env.CONFIG_MTU = 2000;
    jest.mocked(env).env.IP_HEADER_SIZE = 20;

    // Act
    networkLayer.handleOutgoing(mockPacket);

    // Assert
    expect(mockPacket.addHeader).toHaveBeenCalledWith(LayerLevel.NETWORK, {
      id: '3944jvjjf33',
      srcIp: '192.168.2.10',
      destIp: '192.0.2.45',
      ttl: 64,
      protocol: 6,
      DFflag: 1,
      MFflag: 1,
      fragmentOffSet: 0,
    });
    // Assert that the metadata property was set correctly
    expect(mockPacket.metadata).toEqual({
      currentLayer: LayerLevel.NETWORK,
      direction: PacketDirection.SENDER_TO_RECEIVER,
      status: PacketStatus.HEALTHY,
    });
  });

  it('Should fragment a large payload and pass multiple packets to datalink layer when payload exceeds MTU', () => {
    // Arrange
    const payload =
      'This is a long payload that will definitely need to be fragmented';
    mockPacket.payload = payload;
    (mockPacket.getPayloadSize as jest.Mock).mockReturnValue(payload.length);
    jest.mocked(env).env.CONFIG_MTU = 40;
    jest.mocked(env).env.IP_HEADER_SIZE = 20;
    (crypto.randomUUID as jest.Mock).mockReturnValue('mock-fragment-id');

    // Act
    networkLayer.handleOutgoing(mockPacket);

    // Assert
    expect(crypto.randomUUID).toHaveBeenCalledTimes(1);
    expect(mockLogger.log).toHaveBeenCalled();
  });
});
