import { NetworkStack } from '../core/NetworkStack';
import { BasePacket } from '../core/Packet';
import { ApplicationLayer } from '../layers/applicationLayer_7';
import { DataLinkLayer } from '../layers/dataLinkLayer_2';
import { NetworkLayer } from '../layers/networkLayer_3';
import { PhysicalLayer } from '../layers/physicalLayer_1';
import { TransportLayer } from '../layers/transportLayer_4';

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
  sourceIp?: string;
  destinationIp?: string;
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
  packetSnapshot?: Record<string, any>;
}

export type payloadObject = {
  message: string;
};

export interface ILayer {
  name: string;
  level: LayerLevel;
  handleOutgoing: (packet: BasePacket) => BasePacket | BasePacket[] | null;
  handleIncoming: (
    packet: BasePacket,
    incomingPayload?: string,
  ) => BasePacket | null;
}

//TODO Specific headers for layer.

export interface ApplicationLayerData {
  protocol: string;
  method: string;
  contentType?: string;
}

export interface TransportLayerData {
  underlyingProtocol: string;
  srcPort: number;
  packetId?: string;
  destPort: number;
  checkSum?: number;
  segmentIndex: number;
  totalSegment: number;
}

export interface NetworkLayerData {
  id: string;
  srcIp: string;
  destIp: string;
  ttl: number;
  protocol: number;
  DFflag: number;
  MFflag: number;
  fragmentOffSet: number;
}

export interface DataLinkLayerOptions {
  srcMac: string;
  etherType: number;
}

export interface DataLinkLayerData {
  srcMac: string;
  destMac: string;
  etherType: number;
  trailer: number;
}

export interface Host {
  stack: NetworkStack;
  applicationLayer: ApplicationLayer;
  networkLayer: NetworkLayer;
  physicalLayer: PhysicalLayer;
}

export interface Router {
  transportLayer: TransportLayer;
  dataLinkLayer: DataLinkLayer;
  physicalLayer: PhysicalLayer;
}

export interface Switch {
  dataLinkLayer: DataLinkLayer;
  physicalLayer: PhysicalLayer;
}

export type LayerData =
  | ApplicationLayerData
  | TransportLayerData
  | NetworkLayerData
  | DataLinkLayerData;

export interface simulationConfig {
  payload: string;
  srcIp: string;
  destIp: string;
  srcPort: number;
  destPort: number;
  appProtocol: string;
  appMethod: string;
  dropChance: number;
}

export interface NodeConfig {
  ipAddress: string;
  macAddress: string;
  defaultGateway?: string;
  dropChance?: number;
}

export interface HostConfig extends NodeConfig {
  srcPort: number;
  srcProtocol: string;
  srcMethod: string;
  defaultGateway: string;
}

export interface RouterConfig extends NodeConfig {}

export interface SwitchConfig extends NodeConfig {
  portCount: number;
  macTable: Map<string, number>;
}

export type Devices = Host | Router | Switch;

export interface TopologyNode {
  id: string;
  type: 'Host' | 'Router' | 'Switch';
  ip?: string;
  mac?: string;
}
