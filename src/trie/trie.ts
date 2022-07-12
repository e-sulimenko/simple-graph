import { Graph } from '../graph/graph';
import { IEdge, INode } from './types';

class Trie {
  private readonly _graph = new Graph<INode, IEdge>();

  private readonly _rootId = this._graph.addNode({ char: '#', isKey: false })._id;

  addKey(word: string): void {
    const chars = word.toLowerCase().split('');

    let node = this._graph.getNodeByKey(this._rootId);
    if (node == null) throw new Error('Root not wasn\'t initialized');

    for (let i = 0; i < chars.length; i += 1) {
      const char = chars[i];
      const [record] = this._graph.breadthFirstSearch(node._id, { to: char });
      if (record == null) {
        const nextNode = this._graph.addNode({ char, isKey: false });
        this._graph.addRelation(node._id, nextNode._id, { to: char });
        node = nextNode;
      } else {
        node = record[1];
      }
    }
    this._graph.updateNodeByKey(node._id, { isKey: true });
  }

  getKeysByPrefix(prefix: string) {
    const chars = prefix.toLowerCase().split('');

    let node = this._graph.getNodeByKey(this._rootId);
    if (node == null) throw new Error('Root not wasn\'t initialized');

    const keys = [];

    // check if prefix exists
    for (let i = 0; i < chars.length; i += 1) {
      const char = chars[i];
      const [record] = this._graph.breadthFirstSearch(node._id, { to: char });
      if (record == null) break;
      node = record[1];
    }

    // check if prefix is a key
    if (node.properties.isKey) {
      keys.push(prefix);
    }

    // TODO need graph depth first search
    console.log(node);
  };
}

const trie = new Trie();

trie.addKey('apple');
trie.addKey('banana');
trie.addKey('barbarian');

trie.getKeysByPrefix('app');
