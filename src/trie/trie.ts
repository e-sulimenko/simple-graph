import { Graph } from '../graph/graph';
import { IEdge, INode } from './types';

class Trie {
  private readonly _graph = new Graph<INode, IEdge>();

  private readonly _rootId = this._graph.addNode({ char: '#', isKey: false });

  addWord(word: string): void {
    const chars = word.toLowerCase().split('');

    let node = this._graph.getNodeByKey(this._rootId);
    if (node == null) throw new Error('Root not wasn\'t initialized')

    for (let i = 0; i < chars.length; i += 1) {
      const char = chars[i];
      const [record] = this._graph.breadthFirstSearch(node._id, { to: char });
      if (record == null) {
        const id = this._graph.addNode({ char, isKey: false });
        this._graph.addRelation(node._id, id, { to: char });
        node = { _id: id, properties: { char } };
      } else {
        node = record[1];
      }
    }
    this._graph.updateNodeByKey(node._id, { isKey: true });
  }
}
