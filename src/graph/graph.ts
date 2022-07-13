import { AutoIncrement } from '../utils/autoincrement';
import { shallowEq } from '../utils/shallow';

import {
  Adjacency,
  IEdge,
  GetNodeCb,
  NodeRecord,
  INode,
  SearchResult,
  WhereOptions,
} from './types';

export class Graph<
  NodeValue extends INode,
  EdgeValue extends IEdge,
  Node = Record<keyof NodeValue, NodeValue[keyof NodeValue]>,
  Edge = Record<keyof EdgeValue, EdgeValue[keyof EdgeValue]>,
  > {
  private readonly _nodes = new Map<number, Node>();
  private readonly _edges = new Map<number, Edge>();
  private readonly _adjacency = new Map<number, Adjacency[]>();

  private readonly _nodeIdGen = AutoIncrement();
  private readonly _edgeIdGen = AutoIncrement();

  addNode(value: Node): NodeRecord<Node> {
    if (value == null) throw new Error('Node value is required');
    const { value: nodeId } = this._nodeIdGen.next();
    this._nodes.set(nodeId, value);
    return { _id: nodeId, properties: value };
  }

  addRelation(start: number, end: number, value: Edge = {} as Edge): void {
    if (
      this._nodes.has(start)
      && this._nodes.has(end)
    ) {
      const { value: edgeId } = this._edgeIdGen.next();
      this._edges.set(edgeId, value);
      let adjacency = this._adjacency.get(start);
      if (adjacency == null) {
        adjacency = [];
        this._adjacency.set(start, adjacency);
      }
      const hasEdge = adjacency.some((adj) => adj.end === end);
      if (!hasEdge) adjacency.push({ _id: edgeId, start, end });
    }
  }

  get nodes() {
    return Object.fromEntries(this._nodes.entries());
  }

  get adjacency() {
    return Object.fromEntries(this._adjacency.entries());
  }

  get edges() {
    return Object.fromEntries(this._edges.entries());
  }

  getNode(fn: GetNodeCb<Node>): NodeRecord<Node> | null {
    for (const [key, properties] of this._nodes) {
      const item = { _id: key, properties };
      if (fn(item)) return item;
    }
    return null;
  }

  getNodeByKey(key: number): NodeRecord<Node> | null {
    const node = this._nodes.get(key);
    if (node == null) return null;
    return { _id: key, properties: node };
  }

  updateNodeByKey(key: number, values: Partial<Node>): void {
    const node = this._nodes.get(key);
    if (node != null) Object.assign(node, values);
  }

  getCloseNodes(key: number, where?: Node): NodeRecord<Node>[] | null {
    const adj = this._adjacency.get(key);
    if (adj == null) return null;
    return adj.reduce((acc, item) => {
      const node = this._nodes.get(item.end);
      if (
        node != null
        && (where == null || shallowEq(node, where))
      ) {
        acc.push({_id: item.end, properties: node});
      }
      return acc;
    }, [] as NodeRecord<Node>[]);
  }

  breadthFirstSearch(key: number, where: WhereOptions<Node, Edge> = {}): SearchResult<Node, Edge>[] {
    const checked: Record<number, boolean> = { [key]: true }

    const adjacency = [...(this._adjacency.get(key) ?? [])];

    const result: SearchResult<Node, Edge>[] = [];

    for (let i = 0; i < adjacency.length; i += 1) {
      let { start, end, _id: edgeId } = adjacency[i];

      if (end in checked) continue;
      checked[end] = true;

      const edge = this._edges.get(edgeId);
      if (
        edge != null
        && (where.edge == null || shallowEq(edge, where.edge))
      ) {
        const endNode = this._nodes.get(end);
        const startNode = this._nodes.get(start);

        if (
          endNode != null
          && startNode != null
          && (where.node == null || shallowEq(endNode, where.node))
        ) {
          result.push([
            { _id: start, properties: startNode },
            { _id: end, properties: endNode },
            { _id: edgeId, start, end, properties: edge },
          ]);

          const newAdj = this._adjacency.get(end);
          if (newAdj != null) adjacency.push(...newAdj);
        }
      }
    }

    return result;
  }
}

/* example */
const graph = new Graph<{ key: string }, { weight: number }>();

const a = graph.addNode({ key: 'A' });
const b = graph.addNode({ key: 'B' });
const c = graph.addNode({ key: 'C' });
const d = graph.addNode({ key: 'D' });
const e = graph.addNode({ key: 'E' });
const f = graph.addNode({ key: 'F' });

graph.addRelation(a._id, b._id, { weight: 5 });
graph.addRelation(a._id, c._id, { weight: 5 });
graph.addRelation(a._id, d._id, { weight: 10 });
graph.addRelation(c._id, d._id, { weight: 5 });
graph.addRelation(d._id, f._id, { weight: 10 });
graph.getNode((item) => item.properties.key == null)
// console.log(JSON.stringify(graph.breadthFirstSearch(a._id, { edge: { weight: 5 }, node: { key: 'B' } }), null, 2));
