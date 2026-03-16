// Types
import { ILayer, LayerLevel } from '../types';

export class NetworkStack {
  private layers: Map<LayerLevel, ILayer> = new Map();

  constructor() {}

  public registerLayer(layer: ILayer) {
    this.layers.set(layer.level, layer);
    console.log(`Layer registered: ${layer.name} at level ${layer.level}`);
  }
}
