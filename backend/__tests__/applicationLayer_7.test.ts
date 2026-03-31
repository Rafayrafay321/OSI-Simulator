// Node imports
import { jest, describe, it, expect, beforeEach } from '@jest/globals';
// Custom imports
import { BasePacket } from '../src/core/Packet';
import { ApplicationLayer } from '../src/layers/applicationLayer_7';
import { Logger } from '../src/core/Logger';
import { ApplicationLayerData, LayerLevel, LogLevel } from '../src/types';

jest.mock('../src/core/Packet.ts');
jest.mock('../src/core/Logger.ts');

describe('Application Layer Tests', () => {
  let applicationLayer: ApplicationLayer;
  let mockLogger: jest.Mocked<Logger>;

  beforeEach(() => {
    jest.clearAllMocks();
    mockLogger = { log: jest.fn() } as unknown as jest.Mocked<Logger>;
    applicationLayer = new ApplicationLayer(
      { protocol: 'HTTP', method: 'POST' },
      mockLogger,
    );
  });

  describe('handleOutgoing', () => {
    it('should stringify an object payload and add the correct headers', () => {
      const mockPacket = {
        setPayload: jest.fn(),
        addHeader: jest.fn(),
      } as unknown as jest.Mocked<BasePacket>;

      const payloadObject = { message: 'Hello, World!', status: 'ok' };
      applicationLayer.handleOutgoing(mockPacket, payloadObject);

      expect(mockPacket.setPayload).toHaveBeenCalledWith(
        JSON.stringify(payloadObject),
      );

      const expectedHeader: ApplicationLayerData = {
        protocol: 'HTTP',
        method: 'POST',
        contentType: 'application/json',
      };
      expect(mockPacket.addHeader).toHaveBeenCalledWith(
        LayerLevel.APPLICATION,
        expectedHeader,
      );
    });
  });

  describe('handleIncoming', () => {
    it('should parse a valid JSON string payload into an object', () => {
      const payloadObject = { message: 'Hello, World!', status: 'ok' };

      const mockPacket = {
        getPayload: jest.fn().mockReturnValue(JSON.stringify(payloadObject)),
        removeHeader: jest.fn(),
      } as unknown as jest.Mocked<BasePacket>;

      const result = applicationLayer.handleIncoming(mockPacket);

      expect(result).toEqual(payloadObject);
      expect(mockPacket.removeHeader).toHaveBeenCalledWith(
        LayerLevel.APPLICATION,
      );
    });

    it('should throw an error when parsing an invalid JSON string payload', () => {
      const invalidJsonString = '{"message": "Incomplete,';
      const mockPacket = {
        getPayload: jest.fn().mockReturnValue(invalidJsonString),
        removeHeader: jest.fn(),
      } as unknown as jest.Mocked<BasePacket>;

      expect(() => {
        applicationLayer.handleIncoming(mockPacket);
      }).toThrow('Failed to parse incoming JSON payload.');

      expect(mockLogger.log).toHaveBeenCalledWith(
        LayerLevel.APPLICATION,
        expect.stringContaining('Error parsing incoming JSON'),
        LogLevel.ERROR,
      );
    });
  });
});
