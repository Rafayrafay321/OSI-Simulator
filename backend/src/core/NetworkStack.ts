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
}
