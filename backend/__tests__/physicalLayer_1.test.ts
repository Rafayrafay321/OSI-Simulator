// Node imports
import { jest, describe, it, expect, beforeEach } from '@jest/globals';

// Custom imports
import { PhysicalLayer } from '../src/layers/physicalLayer_1'; // Adjust path as needed
import { BasePacket } from '../src/core/Packet';
import { Logger } from '../src/core/Logger';
import { LayerLevel, LogLevel } from '../src/types';

describe('Physical Layer Tests', () => {
  let physicalLayer: PhysicalLayer;
  let mockLogger: jest.Mocked<Logger>;
  let mockPacket: jest.Mocked<BasePacket>;

  beforeEach(() => {
    jest.clearAllMocks();

    mockLogger = {
      log: jest.fn(),
    } as unknown as jest.Mocked<Logger>;

    mockPacket = {
      payload: null,
      metadata: {
        currentLayer: LayerLevel.APPLICATION,
      },
    } as unknown as jest.Mocked<BasePacket>;

    physicalLayer = new PhysicalLayer(mockLogger);
  });

  it('should log an error and throw if the packet has no payload', () => {
    expect(() => {
      physicalLayer.handleOutgoing(mockPacket);
    }).toThrow('Payload can not be empty');

    expect(mockLogger.log).toHaveBeenCalledWith(
      LayerLevel.DATA_LINK,
      'Payload can not be empty',
      LogLevel.ERROR,
    );
  });

  it('should serialize the packet, log info, and pass it to handleIncoming', () => {
    mockPacket.payload = 'Hello World';

    physicalLayer.handleOutgoing(mockPacket);

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

    expect(mockPacket.metadata.currentLayer).toBe(LayerLevel.PHYSICAL);
  });
});
