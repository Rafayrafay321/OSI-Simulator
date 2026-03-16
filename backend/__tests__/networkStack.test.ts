// Node imports
import { jest, describe, it, expect, beforeEach } from '@jest/globals';

// Custom imports
import { BasePacket } from '../src/core/Packet';
import { Logger } from '../src/core/Logger';
import { NetworkStack } from '../src/core/NetworkStack';

// Types
import { LayerLevel, ILayer } from '../src/types';

// Mocking dependencies
jest.mock('../src/core/Logger');
jest.mock('../src/core/Packet', () => ({
  BasePacket: jest.fn().mockImplementation(() => {
    const mockInstance = {
      setPayload: jest.fn(),
      getPayload: jest.fn(),
      metadata: {},
    };
    return mockInstance;
  }),
}));

describe('NetworkStack Tests', () => {
  let networkStack: NetworkStack;

  let mockPhysicalLayer: jest.Mocked<ILayer>;
  let mockDataLinkLayer: jest.Mocked<ILayer>;
  let mockLogger: jest.Mocked<Logger>;
  let mockArpCache: Map<string, string>;
  let mockPacket: jest.Mocked<BasePacket>;

  beforeEach(() => {
    jest.clearAllMocks();

    mockLogger = new Logger() as jest.Mocked<Logger>;
    mockArpCache = new Map<string, string>();
    mockPacket = new BasePacket() as jest.Mocked<BasePacket>;

    mockPhysicalLayer = {
      name: 'Physical Layer',
      level: LayerLevel.PHYSICAL,
      handleOutgoing: jest.fn(),
      handleIncoming: jest.fn(),
    } as unknown as jest.Mocked<ILayer>;

    mockDataLinkLayer = {
      name: 'Data Link Layer',
      level: LayerLevel.DATA_LINK,
      handleOutgoing: jest.fn(),
      handleIncoming: jest.fn(),
    } as unknown as jest.Mocked<ILayer>;

    networkStack = new NetworkStack(mockLogger);
  });

  it('Should have a registerLayer method', () => {
    const mockLayer: ILayer = {
      name: 'testLayer',
      level: LayerLevel.APPLICATION,
      handleOutgoing: jest.fn(),
      handleIncoming: jest.fn(),
    };
    networkStack.registerLayer(mockLayer);

    expect((networkStack as any).layers.get(mockLayer.level)).toBe(mockLayer);
  });

  it('Should throw an Error if Layer not present in layers Map', () => {
    mockPacket.metadata.currentLayer = LayerLevel.PRESENTATION;

    expect(() => {
      networkStack.routeIncoming(mockPacket);
    }).toThrow('Layer not present to process');
  });

  it('Should route the packet to the destination', () => {
    networkStack.registerLayer(mockPhysicalLayer);
    networkStack.registerLayer(mockDataLinkLayer);
    mockPacket.metadata.currentLayer = LayerLevel.PHYSICAL;

    networkStack.routeIncoming(mockPacket);

    expect(mockPhysicalLayer.handleIncoming).toHaveBeenCalled();
  });
});
