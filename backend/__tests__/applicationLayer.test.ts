// Node imports
import { jest, describe, it, expect, beforeEach } from '@jest/globals';
// Custom imports
import { BasePacket } from '../src/core/Packet';
import { ApplicationLayer } from '../src/layers/applicationLayer_7';
import { TransportLayer } from '../src/layers/transportLayer_4';
import { Logger } from '../src/core/Logger';
import { LayerLevel } from '../src/types';

jest.mock('../src/layers/transportLayer_4.ts');
jest.mock('../src/core/Packet.ts');
jest.mock('../src/core/Logger.ts');

describe('Application Layer tests', () => {
  let applicationLayer: ApplicationLayer;
  // 1. Remove Partial from the declarations
  let mockLogger: jest.Mocked<Logger>;
  let mockNextLayer: jest.Mocked<TransportLayer>;
  let mockOutgoingPacket: jest.Mocked<BasePacket>;
  let mockIncommingPacket: jest.Mocked<BasePacket>;

  beforeEach(() => {
    jest.clearAllMocks();

    // 2. Double-cast the mock objects using "as unknown as..."
    mockNextLayer = {
      handleOutgoing: jest.fn(),
    } as unknown as jest.Mocked<TransportLayer>;

    mockLogger = {
      log: jest.fn(),
    } as unknown as jest.Mocked<Logger>;

    mockOutgoingPacket = {
      setPayload: jest.fn(),
      addHeader: jest.fn(),
    } as unknown as jest.Mocked<BasePacket>;

    mockIncommingPacket = {
      getPayload: jest.fn().mockReturnValue('Payload'),
    } as unknown as jest.Mocked<BasePacket>;

    applicationLayer = new ApplicationLayer(
      {
        protocol: 'HTTP',
        method: 'GET',
        sender: 'test',
      },
      mockNextLayer,
      mockLogger,
    );
  });

  describe('Application Layer HandleOutgoing', () => {
    it('Should set the payload, add a header, and call next layer', () => {
      const payload = 'Hello World';

      applicationLayer.handleOutgoing(mockOutgoingPacket, payload);

      expect(mockOutgoingPacket.setPayload).toHaveBeenCalled();
      expect(mockOutgoingPacket.setPayload).toHaveBeenCalledWith(payload);

      expect(mockOutgoingPacket.addHeader).toHaveBeenCalled();
      expect(mockOutgoingPacket.addHeader).toHaveBeenCalledWith(
        LayerLevel.APPLICATION,
        {
          protocol: 'HTTP',
          method: 'GET',
          sender: 'test',
        },
      );

      expect(mockNextLayer.handleOutgoing).toHaveBeenCalled();
      expect(mockNextLayer.handleOutgoing).toHaveBeenCalledTimes(1);
      expect(mockNextLayer.handleOutgoing).toHaveBeenCalledWith(
        mockOutgoingPacket,
      );

      expect(mockLogger.log).toHaveBeenCalled();
    });
  });

  describe('Application Layer HandleIncomming', () => {
    it('Should extract the payload from incomming packet', () => {
      // const payload: string;
    });
  });
});
