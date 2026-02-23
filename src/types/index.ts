//Enum for PacketDirection in Metadata
export enum PacketDirection {
  SENDER_TO_RECEIVER = 'SENDER_TO_RECEIVER',
  RECEIVER_TO_SENDER = 'RECEIVER_TO_SENDER',
}

// Enum for PacketStatus in metadata
export enum PacketStatus {
  HEALTHY = 'HEALTHY',
  CORRUPTED = 'CORRUPTED',
  DROPPED = 'DROPPED',
}

// Enum for LayerLevel in metadata
export enum LayerLevel {
  APPLICATION = 'APPLICATION_7',
  PRESENTATION = 'PRESENTATION_6',
  SESSION = 'SESSION_5',
  TRANSPORT = 'TRANSPORT_4',
  NETWORK = 'NETWORK_3',
  DATA_LINK = 'DATA_LINK_2',
  PHYSICAL = 'PHYSICAL_1',
}

// Interface for MetaData of packet
export interface PacketMetaData {
  currentLayer: LayerLevel;
  direction: PacketDirection;
  status: PacketStatus;
}

// Interface for Headers in Packet
export interface Header {
  layerName: LayerLevel;
  data: LayerData;
}

// Enum for logLevels in LogEntry
export enum LogLevel {
  INFO = 'INFO',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR',
}

// Interface for logging the packet.
export interface LogEntry {
  timestamp: string;
  message: string;
  layer: LayerLevel;
  type: LogLevel;
}

//TODO Specific headers for layer.

export interface ApplicationLayerData {
  protocol: string;
  method: string;
  sender: string;
}

export interface TransportLayerData {
  underlyingProtocol: string;
  srcPort: number;
  destPort: number;
  segmentIndex: number;
  totalSegment: number;
}

export type LayerData = ApplicationLayerData | TransportLayerData;
