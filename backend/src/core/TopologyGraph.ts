import { TopologyNode } from '../types';

export class TopologyGraph {
  private adjaencyList: Map<string, Set<string>> = new Map();
  private nodeRegistry: Map<string, TopologyNode> = new Map();

  public addNode(node: TopologyNode) {
    this.nodeRegistry.set(node.id, node);
    if (!this.adjaencyList.has(node.id)) {
      this.adjaencyList.set(node.id, new Set());
    }
  }

  public addEdge(nodeA: TopologyNode, nodeB: TopologyNode) {
    this.addNode(nodeA);
    this.addNode(nodeB);

    const nodeAList = this.adjaencyList.get(nodeA.id)!;
    const nodeBList = this.adjaencyList.get(nodeB.id)!;

    nodeAList.add(nodeB.id);
    nodeBList.add(nodeA.id);
  }

  public getNode(nodeId: string) {
    return this.nodeRegistry.get(nodeId);
  }

  public getEdges(nodeId: string): Set<string> {
    return this.adjaencyList.get(nodeId) || new Set();
  }

  public getAllEdges() {
    return this.adjaencyList.values();
  }

  public getAllNodes() {
    return this.nodeRegistry.values();
  }
}
