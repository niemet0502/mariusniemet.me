---
title: How to implement a Graph (Adjacency List and Matrix) in JavaScript
date: "2023-01-04"
description: "Graph-based questions are one of the most popular asked questions in software interviews. we are going to learn how to implement all those graph representations in JavaScript, since the implementation can change according to the language. "
published: true
author: "marius niemet"
slug: how-to-implement-graph
categorie: dsa
---

Graph-based questions are one of the most popular asked questions in software interviews. Last year I published an [introduction to graphs](https://dev.to/niemet0502/graph-data-structure-explained-4gj5), explaining the different graph types and how they can be represented. You can read that [article](https://dev.to/niemet0502/graph-data-structure-explained-4gj5) as a reminder, it will help you to understand the implementation.

In this one, we are going to learn how to implement all those graph representations in JavaScript, since the implementation can change according to the language.

Let's start writing code

## Adjacency List

It’s a way to represent a graph by using a linked list, each node will be linked to every node adjacent to him.

![Adjacency List representation](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/u9qt9wedqu7p4zqyp4s1.jpg)

In JavaScript we don’t need to create a pure linked list, we will use the built-in data structures [Set](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set) and [Map](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map) and wrap all methods inside a JS class named Graph.

### Unweight and Undirected Graph

```javascript
class Graph {
  adjacencyList;

  constructor() {
    this.adjacencyList = new Map();
  }
}
```

So First we have created a class named Graph and that class has only one property named adjacencyList. Our constructor initiates the property with an empty Map. So that means our entire adjacency list graph will be represented using the Map.

Now we can add some methods inside the class.

```javascript
class Graph {
  adjacencyList;

  constructor() {
    this.adjacencyList = new Map();
  }

  addNode(node) {
    this.adjacencyList.set(node, new Set());
  }

  addEdge(node1, node2) {
    this.adjacencyList.get(node1).add(node2);
    this.adjacencyList.get(node2).add(node1);
  }

  getNeighboors(node) {
    return this.adjacencyList.get(node);
  }

  hasEdge(node1, node2) {
    return this.adjacencyList.get(node1).has(node2);
  }
}
```

- **addNode**: this method adds a new node inside the Graph. The method receives the node we want to add and we use the built-in function set that receives two parameters, the first is the key that will be used to retrieve the value and the second is the value we want to add. Here the value is a new Set since in the introduction we have mentioned that in an adjacency list, a node should be linked to all the nodes adjacent to it so that the Set will contain all nodes adjacent to the node used as key.

- **addEdge**: an edge is a path between two nodes, since we are creating an undirected graph, it means that if there is a path from node1 to node 2, there is a path from node2 to node1 as well. It’s what the function to here it retrieves the list of adjacent nodes for node1 and node2 and then adds the inverse node inside each list.

- **getNeighboors**: this method returns all the adjacent nodes to a given node, only getting the value inside the graph by using the given node as the key.

- **hasEdge**: this function check if there is a path from node1 to node2, to do that it retrieves all nodes adjacent to node1 and then checks if node2 exists in that list.

### Unweight and directed Graph

The difference between a directed and undirected graph is that inside a directed graph, if there is a path from node1 to node2 doesn’t mean there is a path from node2 to node1 as well, if you want you need to explicitly create that second path.

If we want to create a directed graph from the previous code implemented, we have just to edit the `addEdge` method by removing the second path creation.

```javascript
 addEdge(node1, node2){
    this.adjacencyList.get(node1).add(node2);
  }
```

### Weighted Graph

A weighted graph is a graph in which there is a numerical number attached to the path between two adjacent nodes. That numerical number represents the distance between the nodes, it’s commonly used when we want to calculate the shortest path between two given nodes.

If we want to create a weighted graph, by using the class implemented previously we have to make some adjustments.

```javascript
class Graph {
  adjacencyList;

  constructor() {
    this.adjacencyList = new Map();
  }

  addNode(node) {
    this.adjacencyList.set(node, new Map());
  }

  addEdge(node1, node2, weight) {
    this.adjacencyList.get(node1).set(node2, weight);
    this.adjacencyList.get(node2).set(node1, weight);
  }

  getNeighboors(node) {
    return this.adjacencyList.get(node);
  }

  hasEdge(node1, node2) {
    return this.adjacencyList.get(node1).has(node2);
  }
}
```

First, we have changed the data structure used when creating a new node, now we use a Map instead of a Set because the Map will help us to store a key and value while we only store value with Set.

Then when we create a new path between two nodes, we need to receive those two nodes and the path’s weight as well.

Finally, the node will be the key and the weight will be the value stored.

## Adjacency Matrix

It’s a way to represent a Graph by using a 2D array. The indices represent the nodes, if the value at the cell `(i,j)` is equal to 1 which means there is a path between the node i and j otherwise it will be equal to 0.

![Image description](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/6mu1or1uu4q78dw9hpok.jpg)

### Unweight and Undirected Graph

We will keep the overall Graph class as a wrapper.

```javascript
class Graph {
  numberNodes;
  adjacencyMatrix;

  constructor(numberNodes) {
    this.numberNodes = numberNodes;

    this.adjacencyMatrix = [];

    for (let i = 0; i < this.numberNodes; i++) {
      this.adjacencyMatrix[i] = new Array(this.numberNodes).fill(0);
    }
  }

  addEdge(node1, node2) {
    this.adjacencyMatrix[node1][node2] = 1;
    this.adjacencyMatrix[node2][node1] = 1;
  }

  getNeighboors(node) {
    return this.adjacencyMatrix[node];
  }

  hasEdge(node1, node2) {
    if (
      node1 >= 0 &&
      node1 < this.numberNodes &&
      node2 >= 0 &&
      node2 < this.numberNodes
    ) {
      return (
        this.adjacenMatrix[node1][node2] === 1 &&
        this.adjacenMatrix[node2][node1] === 1
      );
    }

    return false;
  }

  removeEdge(node1, node2) {
    if (
      node1 >= 0 &&
      node1 < this.numberNodes &&
      node2 >= 0 &&
      node2 < this.numberNodes
    ) {
      this.adjacencyMatrix[node1][node2] = 0;
      this.adjacencyMatrix[node2][node1] = 0;
    }
  }
}
```

Since we will create a 2D array we have to know in advance the number of nodes we want to store, that's the role of the `numberNodes` property and then we have the second which represents the array itself.

Every time a new instance of the Graph is created we have to pass the number of nodes, and then we create a new empty array assigned to the `adjacencyMatrix` property.

Last we traverse that array by assigning to each cell a new array of size `numberNodes` filled with zero.

PS: here we don’t need a method to add a node inside the Graph.

- **addEdge**: the method receives the two nodes and then we have to set the value at the cell adjacencyMatrix[node1][node2] to 1 and since it’s an undirected graph we have to do the same for the reverse direction adjacencyMatrix[node2][node1].

- **hasEdge**: to check if there is a path or edge between two given nodes, first the method checks if the values received exist in the Graph and then we check if the value at adjacencyMatrix[node1][node2] is equal to 1 and since it’s an undirected graph we have to check for the reverse direction as well if so we return true.

- **getNeighboors**: to retrieve all adjacent nodes to a given node we return the cell to the position node .

- **removeEdge**: to remove we first check if the given values are valid, if so we set the value at the cell (node1, node2) to 0 and we have to do that for both directions since it’s an undirected Graph.

### Unweight and directed Graph

For a directed Graph, we have to update the class above by removing every section of code where we were doing the same operation for the reverse direction.
Check the code below:

```javascript
class Graph {
  numberNodes;
  adjacencyMatrix;

  constructor(numberNodes) {
    this.numberNodes = numberNodes;

    this.adjacencyMatrix = [];

    for (let i = 0; i < this.numberNodes; i++) {
      this.adjacencyMatrix[i] = new Array(this.numberNodes).fill(0);
    }
  }

  addEdge(node1, node2) {
    this.adjacencyMatrix[node1][node2] = 1;
  }

  getNeighboors(node) {
    return this.adjacencyMatrix[node];
  }

  hasEdge(node1, node2) {
    if (
      node1 >= 0 &&
      node1 < this.numberNodes &&
      node2 >= 0 &&
      node2 < this.numberNodes
    ) {
      return this.adjacenMatrix[node1][node2] === 1;
    }

    return false;
  }

  removeEdge(node1, node2) {
    if (
      node1 >= 0 &&
      node1 < this.numberNodes &&
      node2 >= 0 &&
      node2 < this.numberNodes
    ) {
      this.adjacencyMatrix[node1][node2] = 0;
    }
  }
}
```

### Weighted Graph

For a weighted Graph, since we have to store the numerical number that represents the distance between two nodes, we will update the class written before, and instead of storing `1` when there is an edge or path between two nodes, we will store the distance.

Check the code below:

```javascript
class Graph {
  numberNodes;
  adjacencyMatrix;

  constructor(numberNodes) {
    this.numberNodes = numberNodes;

    this.adjacencyMatrix = [];

    for (let i = 0; i < this.numberNodes; i++) {
      this.adjacencyMatrix[i] = new Array(this.numberNodes).fill(0);
    }
  }

  addEdge(node1, node2, weight) {
    this.adjacencyMatrix[node1][node2] = weight;
    this.adjacencyMatrix[node2][node1] = weight;
  }

  getNeighboors(node) {
    return this.adjacencyMatrix[node];
  }

  hasEdge(node1, node2) {
    if (
      node1 >= 0 &&
      node1 < this.numberNodes &&
      node2 >= 0 &&
      node2 < this.numberNodes
    ) {
      return (
        this.adjacenMatrix[node1][node2] !== 0 &&
        this.adjacenMatrix[node2][node1] !== 0
      );
    }

    return false;
  }

  removeEdge(node1, node2) {
    if (
      node1 >= 0 &&
      node1 < this.numberNodes &&
      node2 >= 0 &&
      node2 < this.numberNodes
    ) {
      this.adjacencyMatrix[node1][node2] = 0;
      this.adjacencyMatrix[node2][node1] = 0;
    }
  }
}
```

You may have noticed that in the code above since we now store the distance rather than `1` while checking if a path exists, we will check if the value at `(node1,node2)` is different to `0` .

## Conclusion

In summary, this article has covered the implementation of graph data structures in JavaScript, specifically focusing on adjacency lists and adjacency matrix representations. We explored unweighted and undirected graphs, as well as variations such as directed and weighted graphs. By understanding these implementations, we gain the ability to solve graph-related problems and utilize graph algorithms effectively in real-world scenarios.
