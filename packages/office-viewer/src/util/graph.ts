/**
 * https://github.com/datavis-tech/graph-data-structure
 */

export type NodeId = string;
export type EdgeWeight = number;
export type EncodedEdge = string;

export interface Serialized {
  nodes: {id: NodeId}[];
  links: {source: NodeId; target: NodeId; weight: EdgeWeight}[];
}

export class CycleError extends Error {
  constructor(message: string) {
    super(message);
    Object.setPrototypeOf(this, CycleError.prototype);
  }
}

export function Graph(serialized?: Serialized) {
  // Returned graph instance
  const graph = {
    addNode,
    removeNode,
    nodes,
    adjacent,
    addEdge,
    removeEdge,
    hasEdge,
    setEdgeWeight,
    getEdgeWeight,
    indegree,
    outdegree,
    depthFirstSearch,
    hasCycle,
    lowestCommonAncestors,
    topologicalSort,
    shortestPath,
    shortestPaths,
    serialize,
    deserialize
  };

  // The adjacency list of the graph.
  // Keys are node ids.
  // Values are adjacent node id arrays.
  const edges: Record<NodeId, NodeId[]> = {};

  // The weights of edges.
  // Keys are string encodings of edges.
  // Values are weights (numbers).
  const edgeWeights: Record<EncodedEdge, EdgeWeight> = {};

  // If a serialized graph was passed into the constructor, deserialize it.
  if (serialized) {
    deserialize(serialized);
  }

  // Adds a node to the graph.
  // If node was already added, this function does nothing.
  // If node was not already added, this function sets up an empty adjacency list.
  function addNode(node: NodeId) {
    edges[node] = adjacent(node);
    return graph;
  }

  // Removes a node from the graph.
  // Also removes incoming and outgoing edges.
  function removeNode(node: NodeId) {
    // Remove incoming edges.
    Object.keys(edges).forEach(function (u) {
      edges[u].forEach(function (v) {
        if (v === node) {
          removeEdge(u, v);
        }
      });
    });

    // Remove outgoing edges (and signal that the node no longer exists).
    delete edges[node];

    return graph;
  }

  // Gets the list of nodes that have been added to the graph.
  function nodes(): NodeId[] {
    // TODO: Better implementation with set data structure
    const nodeSet: Record<NodeId, boolean> = {};

    Object.keys(edges).forEach(function (u) {
      nodeSet[u] = true;
      edges[u].forEach(function (v) {
        nodeSet[v] = true;
      });
    });
    return Object.keys(nodeSet);
  }

  // Gets the adjacent node list for the given node.
  // Returns an empty array for unknown nodes.
  function adjacent(node: NodeId): NodeId[] {
    return edges[node] || [];
  }

  // Computes a string encoding of an edge,
  // for use as a key in an object.
  function encodeEdge(u: NodeId, v: NodeId): EncodedEdge {
    return u + '|' + v;
  }

  // Sets the weight of the given edge.
  function setEdgeWeight(u: NodeId, v: NodeId, weight: EdgeWeight) {
    edgeWeights[encodeEdge(u, v)] = weight;
    return graph;
  }

  // Gets the weight of the given edge.
  // Returns 1 if no weight was previously set.
  function getEdgeWeight(u: NodeId, v: NodeId): EdgeWeight {
    const weight = edgeWeights[encodeEdge(u, v)];
    return weight === undefined ? 1 : weight;
  }

  // Adds an edge from node u to node v.
  // Implicitly adds the nodes if they were not already added.
  function addEdge(u: NodeId, v: NodeId, weight?: EdgeWeight) {
    addNode(u);
    addNode(v);
    adjacent(u).push(v);

    if (weight !== undefined) {
      setEdgeWeight(u, v, weight);
    }

    return graph;
  }

  // Removes the edge from node u to node v.
  // Does not remove the nodes.
  // Does nothing if the edge does not exist.
  function removeEdge(u: NodeId, v: NodeId) {
    if (edges[u]) {
      edges[u] = adjacent(u).filter(function (_v) {
        return _v !== v;
      });
    }
    return graph;
  }

  // Returns true if there is an edge from node u to node v.
  function hasEdge(u: NodeId, v: NodeId) {
    return adjacent(u).includes(v);
  }

  // Computes the indegree for the given node.
  // Not very efficient, costs O(E) where E = number of edges.
  function indegree(node: NodeId) {
    let degree = 0;
    function check(v: NodeId) {
      if (v === node) {
        degree++;
      }
    }
    Object.keys(edges).forEach(function (u) {
      edges[u].forEach(check);
    });
    return degree;
  }

  // Computes the outdegree for the given node.
  function outdegree(node: NodeId) {
    return node in edges ? edges[node].length : 0;
  }

  // Depth First Search algorithm, inspired by
  // Cormen et al. "Introduction to Algorithms" 3rd Ed. p. 604
  // The additional option `includeSourceNodes` specifies whether to
  // include or exclude the source nodes from the result (true by default).
  // If `sourceNodes` is not specified, all nodes in the graph
  // are used as source nodes.
  function depthFirstSearch(
    sourceNodes?: NodeId[],
    includeSourceNodes: boolean = true,
    errorOnCycle: boolean = false
  ) {
    if (!sourceNodes) {
      sourceNodes = nodes();
    }

    if (typeof includeSourceNodes !== 'boolean') {
      includeSourceNodes = true;
    }

    const visited: Record<NodeId, boolean> = {};
    const visiting: Record<NodeId, boolean> = {};
    const nodeList: NodeId[] = [];

    function DFSVisit(node: NodeId) {
      if (visiting[node] && errorOnCycle) {
        throw new CycleError('Cycle found');
      }
      if (!visited[node]) {
        visited[node] = true;
        visiting[node] = true; // temporary flag while visiting
        adjacent(node).forEach(DFSVisit);
        visiting[node] = false;
        nodeList.push(node);
      }
    }

    if (includeSourceNodes) {
      sourceNodes.forEach(DFSVisit);
    } else {
      sourceNodes.forEach(function (node) {
        visited[node] = true;
      });
      sourceNodes.forEach(function (node) {
        adjacent(node).forEach(DFSVisit);
      });
    }

    return nodeList;
  }

  // Returns true if the graph has one or more cycles and false otherwise
  function hasCycle(): boolean {
    try {
      depthFirstSearch(undefined, true, true);
      // No error thrown -> no cycles
      return false;
    } catch (error) {
      if (error instanceof CycleError) {
        return true;
      } else {
        throw error;
      }
    }
  }

  // Least Common Ancestors
  // Inspired by https://github.com/relaxedws/lca/blob/master/src/LowestCommonAncestor.php code
  // but uses depth search instead of breadth. Also uses some optimizations
  function lowestCommonAncestors(node1: NodeId, node2: NodeId) {
    const node1Ancestors: NodeId[] = [];
    const lcas: NodeId[] = [];

    function CA1Visit(visited: Record<NodeId, boolean>, node: NodeId): boolean {
      if (!visited[node]) {
        visited[node] = true;
        node1Ancestors.push(node);
        if (node == node2) {
          lcas.push(node);
          return false; // found - shortcut
        }
        return adjacent(node).every(node => {
          return CA1Visit(visited, node);
        });
      } else {
        return true;
      }
    }

    function CA2Visit(visited: Record<NodeId, boolean>, node: NodeId) {
      if (!visited[node]) {
        visited[node] = true;
        if (node1Ancestors.indexOf(node) >= 0) {
          lcas.push(node);
        } else if (lcas.length == 0) {
          adjacent(node).forEach(node => {
            CA2Visit(visited, node);
          });
        }
      }
    }

    if (CA1Visit({}, node1)) {
      // No shortcut worked
      CA2Visit({}, node2);
    }

    return lcas;
  }

  // The topological sort algorithm yields a list of visited nodes
  // such that for each visited edge (u, v), u comes before v in the list.
  // Amazingly, this comes from just reversing the result from depth first search.
  // Cormen et al. "Introduction to Algorithms" 3rd Ed. p. 613
  function topologicalSort(
    sourceNodes?: NodeId[],
    includeSourceNodes: boolean = true
  ) {
    return depthFirstSearch(sourceNodes, includeSourceNodes, true).reverse();
  }

  // Dijkstra's Shortest Path Algorithm.
  // Cormen et al. "Introduction to Algorithms" 3rd Ed. p. 658
  // Variable and function names correspond to names in the book.
  function shortestPath(source: NodeId, destination: NodeId) {
    // Upper bounds for shortest path weights from source.
    const d: Record<NodeId, EdgeWeight> = {};

    // Predecessors.
    const p: Record<NodeId, NodeId> = {};

    // Poor man's priority queue, keyed on d.
    let q: Record<NodeId, boolean> = {};

    function initializeSingleSource() {
      nodes().forEach(function (node) {
        d[node] = Infinity;
      });
      if (d[source] !== Infinity) {
        throw new Error('Source node is not in the graph');
      }
      if (d[destination] !== Infinity) {
        throw new Error('Destination node is not in the graph');
      }
      d[source] = 0;
    }

    // Adds entries in q for all nodes.
    function initializePriorityQueue() {
      nodes().forEach(function (node) {
        q[node] = true;
      });
    }

    // Returns true if q is empty.
    function priorityQueueEmpty() {
      return Object.keys(q).length === 0;
    }

    // Linear search to extract (find and remove) min from q.
    function extractMin(): NodeId | null {
      let min = Infinity;
      let minNode;
      Object.keys(q).forEach(function (node) {
        if (d[node] < min) {
          min = d[node];
          minNode = node;
        }
      });
      if (minNode === undefined) {
        // If we reach here, there's a disconnected subgraph, and we're done.
        q = {};
        return null;
      }
      delete q[minNode];
      return minNode;
    }

    function relax(u: NodeId, v: NodeId) {
      const w = getEdgeWeight(u, v);
      if (d[v] > d[u] + w) {
        d[v] = d[u] + w;
        p[v] = u;
      }
    }

    function dijkstra() {
      initializeSingleSource();
      initializePriorityQueue();
      while (!priorityQueueEmpty()) {
        const u = extractMin();
        if (u === null) return;
        adjacent(u).forEach(function (v) {
          relax(u as string, v);
        });
      }
    }

    // Assembles the shortest path by traversing the
    // predecessor subgraph from destination to source.
    function path() {
      const nodeList: NodeId[] & {weight?: EdgeWeight} = [];
      let weight = 0;
      let node = destination;
      while (p[node]) {
        nodeList.push(node);
        weight += getEdgeWeight(p[node], node);
        node = p[node];
      }
      if (node !== source) {
        throw new Error('No path found');
      }
      nodeList.push(node);
      nodeList.reverse();
      nodeList.weight = weight;
      return nodeList;
    }

    dijkstra();

    return path();
  }

  function shortestPaths(source: NodeId, destination: NodeId) {
    let path = shortestPath(source, destination);
    const paths = [path],
      removedEdges: {u: NodeId; v: NodeId; weight: EdgeWeight}[] = [],
      weight = path.weight;
    while (weight) {
      const u = path[0];
      const v = path[1];

      if (hasEdge(u, v)) {
        removedEdges.push({u, v, weight: getEdgeWeight(u, v)});
        removeEdge(u, v);
      }

      if (hasEdge(v, u)) {
        removedEdges.push({u: v, v: u, weight: getEdgeWeight(v, u)});
        removeEdge(v, u);
      }

      try {
        path = shortestPath(source, destination);
        if (!path.weight || weight < path.weight) break;
        paths.push(path);
      } catch (e) {
        break;
      }
    }
    for (const {u, v, weight} of removedEdges) addEdge(u, v, weight);
    return paths;
  }

  // Serializes the graph.
  function serialize() {
    const serialized: Serialized = {
      nodes: nodes().map(function (id) {
        return {id: id};
      }),
      links: []
    };

    serialized.nodes.forEach(function (node) {
      const source = node.id;
      adjacent(source).forEach(function (target) {
        serialized.links.push({
          source: source,
          target: target,
          weight: getEdgeWeight(source, target)
        });
      });
    });

    return serialized;
  }

  // Deserializes the given serialized graph.
  function deserialize(serialized: Serialized) {
    serialized.nodes.forEach(function (node) {
      addNode(node.id);
    });
    serialized.links.forEach(function (link) {
      addEdge(link.source, link.target, link.weight);
    });
    return graph;
  }

  // The returned graph instance.
  return graph;
}

// 新增了这个
export type GraphInstance = ReturnType<typeof Graph>;

export default Graph;
