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
      const [record] = this._graph.breadthFirstSearch(node._id, { edge: { to: char } });
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
      const [record] = this._graph.breadthFirstSearch(node._id, { edge: { to: char } });
      if (record == null) break;
      node = record[1];
    }

    // check if prefix is a key
    if (node.properties.isKey) {
      keys.push(prefix);
    }

    this.recursiveSearch(prefix, node._id, keys);
    return keys;
  };

  private recursiveSearch(str: string, nodeId: number, keys: string[]): void {
    const closeNodes = this._graph.getCloseNodes(nodeId);
    closeNodes?.forEach((node) => {
      const newStr = `${str}${node.properties.char}`;
      if (node.properties.isKey) keys.push(newStr);
      this.recursiveSearch(newStr, node._id, keys);
    });
  }
}

const trie = new Trie();

trie.addKey('a');
trie.addKey('apple');
trie.addKey('banana');
trie.addKey('barbarian');

// console.log(trie.getKeysByPrefix('a'));
