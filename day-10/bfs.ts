export type AdjacencyList = Record<string, string[]>;
export type Vertex = {
  name: string;
  color: "white" | "grey" | "black";
  distance: number | undefined;
  parent: Vertex | undefined;
};
export type Traversal = Record<string, Vertex>;

export function bfs(
  adjacencyList: AdjacencyList,
  sourceVertex: string
): Traversal {
  const vertices: Traversal = Object.keys(adjacencyList).reduce(
    (acc, vertexName) => {
      acc[vertexName] = {
        name: vertexName,
        color: "white",
        distance: undefined,
        parent: undefined,
      };
      return acc;
    },
    {} as Record<string, Vertex>
  );
  vertices[sourceVertex].distance = 0;
  vertices[sourceVertex].color = "grey";

  const queue = [] as Vertex[];
  queue.push(vertices[sourceVertex]);

  while (queue.length) {
    const currentVertex = queue.shift() as Vertex;
    for (const adjacentVertexName of adjacencyList[currentVertex.name]) {
      const adjacentVertex = vertices[adjacentVertexName];
      if (adjacentVertex.color === "white") {
        adjacentVertex.color = "grey";
        adjacentVertex.distance = currentVertex.distance! + 1;
        adjacentVertex.parent = currentVertex;
        queue.push(adjacentVertex);
      }
    }
    currentVertex.color = "black";
  }
  return vertices;
}
