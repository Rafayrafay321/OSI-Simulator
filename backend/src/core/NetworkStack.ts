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

  public sendData(packet: BasePacket) {
    const layerWeights: Partial<Record<LayerLevel, number>> = {
      [LayerLevel.APPLICATION]: 7,
      [LayerLevel.TRANSPORT]: 4,
      [LayerLevel.NETWORK]: 3,
      [LayerLevel.DATA_LINK]: 2,
      [LayerLevel.PHYSICAL]: 1,
    };

    const allLayers = Array.from(this.layers.values());
    allLayers.sort(
      (a, b) => (layerWeights[b.level] || 0) - (layerWeights[a.level] || 0),
    );

    for (const layer of allLayers) {
      this.logger.log(
        layer.level,
        `Sending data down through ${layer.name}`,
        LogLevel.INFO,
      );
      layer.handleOutgoing(packet);
    }
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

    for (const layer of allLayers) {
      this.logger.log(
        layer.level,
        `Sending data Up through ${layer.name}`,
        LogLevel.INFO,
      );
      layer.handleIncoming(packet);
    }
  }
}
