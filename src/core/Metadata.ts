// Enum for PacketDirection
export enum PacketDirection {
  SENDER_TO_RECEIVER = 'SENDER_TO_RECEIVER',
  RECEIVER_TO_SENDER = 'RECEIVER_TO_SENDER',
}

// Enum for PacketStatus
export enum PacketStatus {
  HEALTHY = 'HEALTHY',
  CORRUPTED = 'CORRUPTED',
  DROPPED = 'DROPPED',
}

// Interface for MetaData of packet
export interface PacketMetaData {
  currentLayer: string;
  direction?: PacketDirection;
  status?: PacketStatus;
}
