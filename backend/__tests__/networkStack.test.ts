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
  let mockNetworkLayer: jest.Mocked<ILayer>;
  let mockTransportLayer: jest.Mocked<ILayer>;
  let mockApplicationLayer: jest.Mocked<ILayer>;

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

    mockNetworkLayer = {
      name: 'Network Layer',
      level: LayerLevel.NETWORK,
      handleOutgoing: jest.fn(),
      handleIncoming: jest.fn(),
    } as unknown as jest.Mocked<ILayer>;

    mockTransportLayer = {
      name: 'Transport Layer',
      level: LayerLevel.TRANSPORT,
      handleOutgoing: jest.fn(),
      handleIncoming: jest.fn(),
    } as unknown as jest.Mocked<ILayer>;

    mockApplicationLayer = {
      name: 'Application Layer',
      level: LayerLevel.APPLICATION,
      handleOutgoing: jest.fn(),
      handleIncoming: jest.fn(),
    } as unknown as jest.Mocked<ILayer>;

    networkStack = new NetworkStack(mockLogger);
  });

  it('Should have a registerLayer method', () => {
    const mockLayer: ILayer = {
      name: 'testLayer',
      level: LayerLevel.APPLICATION,
      handleOutgoing: jest.fn((packet: BasePacket) => null),
      handleIncoming: jest.fn((packet: BasePacket) => null),
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

  it('Should route the Incoming packet to the destination', () => {
    networkStack.registerLayer(mockPhysicalLayer);
    networkStack.registerLayer(mockDataLinkLayer);
    mockPacket.metadata.currentLayer = LayerLevel.PHYSICAL;

    networkStack.routeIncoming(mockPacket);

    expect(mockPhysicalLayer.handleIncoming).toHaveBeenCalled();
  });

  it('Should route the outgoing packet to the destination', () => {
    networkStack.registerLayer(mockDataLinkLayer);
    networkStack.registerLayer(mockPhysicalLayer);
    mockPacket.metadata.currentLayer = LayerLevel.DATA_LINK;

    networkStack.routeOutgoing(mockPacket);

    expect(mockDataLinkLayer.handleOutgoing).toHaveBeenCalled();
  });

  it('Should process the data sequentially down the entire stack', () => {
    const layersList = [
      mockApplicationLayer,
      mockTransportLayer,
      mockNetworkLayer,
      mockDataLinkLayer,
      mockPhysicalLayer,
    ];
    layersList.forEach((layer) => {
      networkStack.registerLayer(layer);
      layer.handleOutgoing.mockReturnValue(mockPacket);
    });

    networkStack.sendData(mockPacket);

    layersList.forEach((layer) => {
      expect(layer.handleOutgoing).toHaveBeenCalled();
      expect(layer.handleOutgoing).toHaveBeenCalledWith(mockPacket);
    });
  });

  it('sendData should process packets in correct descending order', () => {
    const callOrder: string[] = [];

    mockApplicationLayer.handleOutgoing.mockImplementation(() => {
      callOrder.push('Application Layer');
      return mockPacket;
    });
    mockTransportLayer.handleOutgoing.mockImplementation(() => {
      callOrder.push('Transport Layer');
      return mockPacket;
    });
    mockNetworkLayer.handleOutgoing.mockImplementation(() => {
      callOrder.push('Network Layer');
      return mockPacket;
    });
    mockDataLinkLayer.handleOutgoing.mockImplementation(() => {
      callOrder.push('Data Link Layer');
      return mockPacket;
    });
    mockPhysicalLayer.handleOutgoing.mockImplementation(() => {
      callOrder.push('Physical Layer');
      return mockPacket;
    });

    const layersList = [
      mockApplicationLayer,
      mockNetworkLayer,
      mockTransportLayer,
      mockDataLinkLayer,
      mockPhysicalLayer,
    ];
    layersList.forEach((layer) => {
      networkStack.registerLayer(layer);
    });

    networkStack.sendData(mockPacket);

    expect(callOrder).toEqual([
      'Application Layer',
      'Transport Layer',
      'Network Layer',
      'Data Link Layer',
      'Physical Layer',
    ]);
  });

  it('Should process packets in correct accsending order', () => {
    const callOrder: string[] = [];

    mockApplicationLayer.handleIncoming.mockImplementation(() => {
      callOrder.push('Application Layer');
      return mockPacket;
    });
    mockTransportLayer.handleIncoming.mockImplementation(() => {
      callOrder.push('Transport Layer');
      return mockPacket;
    });
    mockNetworkLayer.handleIncoming.mockImplementation(() => {
      callOrder.push('Network Layer');
      return mockPacket;
    });
    mockDataLinkLayer.handleIncoming.mockImplementation(() => {
      callOrder.push('Data Link Layer');
      return mockPacket;
    });
    mockPhysicalLayer.handleIncoming.mockImplementation(() => {
      callOrder.push('Physical Layer');
      return mockPacket;
    });

    const layersList = [
      mockApplicationLayer,
      mockNetworkLayer,
      mockTransportLayer,
      mockDataLinkLayer,
      mockPhysicalLayer,
    ];
    layersList.forEach((layer) => {
      networkStack.registerLayer(layer);
    });

    networkStack.receiveData(mockPacket);

    expect(callOrder).toEqual([
      'Physical Layer',
      'Data Link Layer',
      'Network Layer',
      'Transport Layer',
      'Application Layer',
    ]);
  });
});
