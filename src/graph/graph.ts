import { AutoIncrement } from '../utils/autoincrement';
import { shallowEq } from '../utils/shallow';

import {
  Adjacency,
  EdgeValue,
  GetNodeCb,
  NodeRecord,
  NodeValue,
  SearchResult,
} from './types';

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

  addRelation(start: number, end: number, value: EdgeValue = {}): void {
    if (
      this.#nodes.has(start)
      && this.#nodes.has(end)
    ) {
      const { value: edgeId } = this.#edgeIdGen.next();
      this.#edges.set(edgeId, value);
      let adjacency = this.#adjacency.get(start);
      if (adjacency == null) {
        adjacency = [];
        this.#adjacency.set(start, adjacency);
      }
      const hasEdge = adjacency.some((adj) => adj.end === end);
      if (!hasEdge) adjacency.push({ _id: edgeId, start, end });
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

  breadthFirstSearch(key: number, edgeWhere?: EdgeValue): any[] {
    const checked: Record<number, boolean> = { [key]: true }

    const adjacency = this.#adjacency.get(key) ?? [];

    const result: SearchResult[] = [];

    for (let i = 0; i < adjacency.length; i += 1) {
      let { start, end, _id: edgeId } = adjacency[i];

      if (end in checked) continue;
      checked[end] = true;

      const edge = this.#edges.get(edgeId);
      if (
        edge != null
        && (edgeWhere == null || shallowEq(edge, edgeWhere))
      ) {
        const endNode = this.#nodes.get(end);
        const startNode = this.#nodes.get(start);

        result.push([
          { _id: start, properties: startNode },
          { _id: end, properties: endNode },
          { _id: edgeId, start, end, properties: edge },
        ]);

        const newAdj = this.#adjacency.get(end);
        if (newAdj != null) adjacency.push(...newAdj);
      }
    }

    return result;
  }
}

/* example */
const graph = new Graph();

const a = graph.addNode({ key: 'A' });
const b = graph.addNode({ key: 'B' });
const c = graph.addNode({ key: 'C' });
const d = graph.addNode({ key: 'D' });
const e = graph.addNode({ key: 'E' });
const f = graph.addNode({ key: 'F' });

graph.addRelation(a, b, { weight: 5 });
graph.addRelation(a, c, { weight: 5 });
graph.addRelation(a, d, { weight: 10 });
graph.addRelation(c, d, { weight: 5 });
graph.addRelation(d, f, { weight: 10 });

console.log(JSON.stringify(graph.breadthFirstSearch(a, { weight: 5 }), null, 2));
