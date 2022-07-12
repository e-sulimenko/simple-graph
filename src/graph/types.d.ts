export type NodeValue = Record<string, any>;

export type EdgeValue = Record<string, any>;

export interface Adjacency {
  _id: number;
  start: number;
  end: number;
}

export interface NodeRecord {
  _id: number;
  properties: any;
}

export interface EdgeRecord {
  _id: number;
  start: number;
  end: number;
  properties: any;
}


export interface GetNodeCb {
  (item: NodeRecord): boolean;
}

export type SearchResult = [
  NodeRecord,
  NodeRecord,
  EdgeRecord,
]
