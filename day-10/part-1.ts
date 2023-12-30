import { readFileSync, type PathLike } from "node:fs";
import { bfs, type AdjacencyList, type Vertex } from "./bfs";

type Pipe = "|" | "-" | "L" | "J" | "7" | "F";
type Direction = "north" | "south" | "east" | "west";

const dir: Record<Direction, number[]> = {
  north: [0, -1],
  south: [0, 1],
  east: [1, 0],
  west: [-1, 0],
};

// Result is:  6640
function getFarthestPosition(filePath: PathLike) {
  function isWithinBounds(
    x: number,
    y: number,
    xLimit: number,
    yLimit: number
  ) {
    if (x < 0 || x >= xLimit || y < 0 || y >= yLimit) return false;
    return true;
  }

  /**
   * Go through every vertex if it is in connectsToMap
   * add the nodes that are in direction dir[connectsToMap[elem][0]], dir[connectsToMap[elem][1]]
   * to the adjacency list
   */
  function getAdjacencyList(paths: string[]): AdjacencyList {
    const adjacencyList = {} as AdjacencyList;

    const nRows = paths.length;
    for (let row = 0; row < nRows; ++row) {
      const nColumns = paths[row].length;
      for (let column = 0; column < nColumns; ++column) {
        const pipe = paths[row][column] as Pipe;
        adjacencyList[`${row},${column}`] = [];
        const directionList = connectsToMap[pipe];
        if (directionList) {
          for (const direction of directionList) {
            const connectedVertexX = column + dir[direction][0];
            const connectedVertexY = row + dir[direction][1];
            if (
              isWithinBounds(
                connectedVertexX,
                connectedVertexY,
                nColumns,
                nRows
              )
            )
              adjacencyList[`${row},${column}`].push(
                `${connectedVertexY},${connectedVertexX}`
              );
          }
        }
      }
    }
    return adjacencyList;
  }

  const paths = readFileSync(filePath, { encoding: "utf-8" })
    .split("\n")
    .filter((item) => item);

  const connectsToMap: Record<Pipe, Direction[]> = {
    "-": ["east", "west"],
    "|": ["north", "south"],
    L: ["north", "east"],
    J: ["north", "west"],
    7: ["south", "west"],
    F: ["south", "east"],
  };

  const adjList = getAdjacencyList(paths);
  adjList["128,88"] = ["129,88", "127,88"]; // Hardcoded for now
  const traversal: Record<string, Vertex> = bfs(adjList, "128,88"); // Hardcoded for now
  let res = 0;
  for (const values of Object.values(traversal)) {
    res = Math.max(res, values.distance ?? 0);
  }

  return res;
}

const res = getFarthestPosition("./input.txt");
console.log("Result is: ", res);
