export class TopologyGraph {
  private adjajencyList: Map<string, Set<string>> = new Map();

  public addNode(nodeId: string) {
    if (!this.adjajencyList.has(nodeId)) {
      this.adjajencyList.set(nodeId, new Set());
    }
  }

  public addEdge(nodeAId: string, nodeBId: string) {
    this.addNode(nodeAId);
    this.addNode(nodeBId);

    const nodeAList = this.adjajencyList.get(nodeAId)!;
    const nodeBList = this.adjajencyList.get(nodeBId)!;

    nodeAList.add(nodeBId);
    nodeBList.add(nodeAId);
  }
}
