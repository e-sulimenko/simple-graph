import { AutoIncrement } from './utils/autoincrement';

export type NodeValue = Record<string, any>;

export type EdgeValue = Record<string, any>;

export interface Adjacency {
  to: number;
  edgeId: number;
}

export interface NodeRecord {
  _id: number;
  properties: any;
}

export interface GetNodeCb {
  (item: NodeRecord): boolean;
}

export class Graph {
  #nodes = new Map<number, NodeValue>();
  #edges = new Map<number, EdgeValue>();
  #adjacency = new Map<number, Adjacency[]>();

  #nodeIdGen = AutoIncrement();
  #edgeIdGen = AutoIncrement();

  addNode(value: NodeValue): number {
    if (value == null) throw new Error('Node value is required');
    const { value: nodeId } = this.#nodeIdGen.next();
    this.#nodes.set(nodeId, value);
    return nodeId;
  }

  addRelation(from: number, to: number, value: EdgeValue = {}) {
    if (
      this.#nodes.has(from)
      && this.#nodes.has(to)
    ) {
      const { value: edgeId } = this.#edgeIdGen.next();
      this.#edges.set(edgeId, value);
      let adjacency = this.#adjacency.get(from);
      if (adjacency == null) {
        adjacency = [];
        this.#adjacency.set(from, adjacency);
      }
      const hasEdge = adjacency.some((adj) => adj.to === to);
      if (!hasEdge) adjacency.push({ to, edgeId });
    }
  }

  get nodes() {
    return Object.fromEntries(this.#nodes.entries());
  }

  get adjacency() {
    return Object.fromEntries(this.#adjacency.entries());
  }

  get edges() {
    return Object.fromEntries(this.#edges.entries());
  }

  getNode(fn: GetNodeCb): NodeRecord | void {
    for (const [key, properties] of this.#nodes) {
      const item = { _id: key, properties };
      if (fn(item)) return item;
    }
  }
}
//
// const graph = new Graph();
//
// const addWord = (word: string) => {
//   const chars = word.split('');
//   const nodeIds: number[] = [];
//   for (let i = 0; i < chars.length; i += 1) {
//     const key = chars[i];
//     const id = graph.addNode({ value: key });
//     const prevId = nodeIds[i - 1];
//     if (prevId) {
//       graph.addRelation(prevId, id);
//     }
//     nodeIds.push(id);
//   }
// }
//
// addWord('apple');
// addWord('and');
//
// const node = graph.getNode((item) => item.properties.value === 'a')
// console.log(node);
