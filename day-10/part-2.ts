import { readFileSync, type PathLike } from "node:fs";
import { bfs, type AdjacencyList } from "./bfs";

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
  let sReplacement: Pipe = "|";

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
  function getAdjacencyList(
    paths: string[],
    replaceSWith: Pipe
  ): [{ row: number; column: number }, AdjacencyList] {
    const adjacencyList = {} as AdjacencyList;
    const sVertex = {} as { row: number; column: number };

    const nRows = paths.length;
    for (let row = 0; row < nRows; ++row) {
      const nColumns = paths[row].length;
      for (let column = 0; column < nColumns; ++column) {
        let pipe = paths[row][column] as Pipe;
        if ((pipe as string) === "S") {
          pipe = replaceSWith;
          sVertex.column = column;
          sVertex.row = row;
        }
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
    return [sVertex, adjacencyList];
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

  const [sVertex, adjList] = getAdjacencyList(paths, sReplacement);
  const sVertexKey = `${sVertex.row},${sVertex.column}`;
  const traversal = bfs(adjList, sVertexKey);
  let isInsideLoop = false;
  let res = 0;
  /**
   * Need to count only "|", "F", "7" or "|", "L", "J"
   * if count === odd => inside loop; else outside loop
   * To cross from outside to inside or vice versa,
   * you have to cross the loop.That means going across a "|", or a "L----7" or a "F-----J".
   */
  const nRows = paths.length;
  for (let row = 0; row < nRows; ++row) {
    const nColumns = paths[row].length;
    let str = "";
    for (let column = 0; column < nColumns; ++column) {
      let addStr: string;
      let pipe = paths[row][column];
      if (pipe === "S") pipe = sReplacement;
      addStr = pipe;
      if (isInsideLoop && traversal[`${row},${column}`].color === "white") {
        res++;
        addStr = "0";
      }
      if (
        ["|", "7", "F"].find((item) => item === pipe) &&
        traversal[`${row},${column}`].color === "black"
      )
        isInsideLoop = !isInsideLoop;
      str += addStr;
    }
    console.log(str);
  }

  return res;
}

const res = getFarthestPosition("./input.txt");
console.log("Result is: ", res);
