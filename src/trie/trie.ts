import { Graph } from '../graph/graph';

class Trie {
  #graph = new Graph();

  addWord(word: string): void {
    const chars = word.toLowerCase().split('');
    let node = this.#graph.getNode((item) => item.properties.char === chars[0]);
    if (node == null) {
      this.#graph.addNode({ char: chars[0] });
    }
    for (let i = 1; i < chars.length; i += 1) {

    }
  }
}
