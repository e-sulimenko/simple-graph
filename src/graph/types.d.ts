export type INode = Record<string, any>;

export type IEdge = Record<string, any>;

export interface Adjacency {
  _id: number;
  start: number;
  end: number;
}

export interface NodeRecord<Node = unknown> {
  _id: number;
  properties: Node;
}

export interface EdgeRecord<Edge = unknown> {
  _id: number;
  start: number;
  end: number;
  properties: Edge;
}


export interface GetNodeCb<Node = unknown> {
  (item: NodeRecord<Node>): boolean;
}

export type SearchResult<Node = unknown, Edge = unknown> = [
  NodeRecord<Node>,
  NodeRecord<Node>,
  EdgeRecord<Edge>,
]
