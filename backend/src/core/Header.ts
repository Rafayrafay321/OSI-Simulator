// Interface for Headers in Packet
export interface Header {
  layerName: string;
  data: Record<string, any>;
}
