import { BasePacket } from './Packet';
import { Logger } from './Logger';

// Types
import { ILayer, LayerLevel, LogLevel } from '../types';

export class NetworkStack {
  private layers: Map<LayerLevel, ILayer> = new Map();
  private logger: Logger;

  constructor(logger: Logger) {
    this.logger = logger;
  }

  public registerLayer(layer: ILayer) {
    this.layers.set(layer.level, layer);
    this.logger.log(
      layer.level,
      `Layer registered: ${layer.name} at level ${layer.level}`,
      LogLevel.INFO,
    );
  }

  public routeIncoming(packet: BasePacket) {
    const payload = packet.getPayload();
    const currentLayer = packet.metadata.currentLayer;
    const layerToProcess = this.layers.get(currentLayer);
    if (!layerToProcess) {
      this.logger.log(currentLayer, 'Layer not present', LogLevel.ERROR);
      throw new Error('Layer not present to process');
    }
    layerToProcess.handleIncoming(packet, payload);
  }

  public routeOutgoing(packet: BasePacket) {
    const currentLayer = packet.metadata.currentLayer;
    const layerToProcess = this.layers.get(currentLayer);
    if (!layerToProcess) {
      this.logger.log(currentLayer, 'Layer not present', LogLevel.ERROR);
      throw new Error('Layer not present to process');
    }
    layerToProcess.handleOutgoing(packet);
  }

  private recursiveSend(
    packet: BasePacket,
    layerIndex: number,
    layer: ILayer[],
  ): void {
    if (layerIndex >= layer.length) {
      return;
    }
    let currentLayer = layer[layerIndex];
    this.logger.log(
      currentLayer.level,
      `Sending data down through ${currentLayer.name}`,
      LogLevel.INFO,
    );
    const result = currentLayer.handleOutgoing(packet);

    if (!result) return;

    if (Array.isArray(result)) {
      for (const segment of result) {
        this.recursiveSend(segment, layerIndex + 1, layer);
      }
    } else {
      return this.recursiveSend(result, layerIndex + 1, layer);
    }
  }

  public sendData(packet: BasePacket) {
    const layerWeights: Partial<Record<LayerLevel, number>> = {
      [LayerLevel.APPLICATION]: 7,
      [LayerLevel.TRANSPORT]: 4,
      [LayerLevel.NETWORK]: 3,
      [LayerLevel.DATA_LINK]: 2,
      [LayerLevel.PHYSICAL]: 1,
    };

    const allSortedLayers = Array.from(this.layers.values()).sort(
      (a, b) => (layerWeights[b.level] || 0) - (layerWeights[a.level] || 0),
    );
    this.recursiveSend(packet, 0, allSortedLayers);
  }

  public receiveData(packet: BasePacket) {
    const layerWeights: Partial<Record<LayerLevel, number>> = {
      [LayerLevel.APPLICATION]: 7,
      [LayerLevel.TRANSPORT]: 4,
      [LayerLevel.NETWORK]: 3,
      [LayerLevel.DATA_LINK]: 2,
      [LayerLevel.PHYSICAL]: 1,
    };

    const allLayers = Array.from(this.layers.values());
    allLayers.sort(
      (a, b) => (layerWeights[a.level] || 0) - (layerWeights[b.level] || 0),
    );

    let currentPacket: BasePacket | null = packet;

    for (const layer of allLayers) {
      if (!currentPacket) break;

      this.logger.log(
        layer.level,
        `Sending data Up through ${layer.name}`,
        LogLevel.INFO,
      );
      currentPacket = layer.handleIncoming(currentPacket);
    }
  }
}
