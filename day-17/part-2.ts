import { readFileSync, type PathLike } from "node:fs";
import { MinPriorityQueue } from "../Library/DataStructures";

type Directions = "left" | "right" | "up" | "down";
const directionMap: Record<Directions, [number, number]> = {
    up: [-1, 0],
    down: [1, 0],
    left: [0, -1],
    right: [0, 1],
}

type Vertex = {
    key: number;
    row: number;
    column: number;
    direction: Directions | undefined;
    steps: number;
}
/* In a direction */
const minSteps = 4;
const maxSteps = 10;

function isOppositeDirection(dir1: Directions, dir2: Directions) {
    if (directionMap[dir1][0] === -directionMap[dir2][0]
        && directionMap[dir1][1] === -directionMap[dir2][1]) return true;
    return false;
}

function isIndexWithinBound(row: number, column: number, maxRow: number, maxColumn: number) {
    if (row >= maxRow || row < 0) return false;
    else if (column >= maxColumn || column < 0) return false;
    return true;
}

function calculateLeastHeat(heatMap: number[][], sourceVertex: Vertex) {
    const nRows = heatMap.length;
    const nColumns = heatMap[0].length;
    const queue = new MinPriorityQueue([sourceVertex]);
    const seen = new Set();

    while (queue.length) {
        const currentVertex = queue.extractRoot()!;
        const currentRow = currentVertex.row;
        const currentColumn = currentVertex.column;
        const currentSteps = currentVertex.steps;
        const currentDirection = currentVertex.direction ?? "right";
        const currentKey = currentVertex.key;
        if (currentRow === nRows - 1 && currentColumn === nColumns - 1 && currentSteps >= minSteps) return currentKey;

        if (seen.has(`${currentRow}/${currentColumn}/${currentDirection}/${currentSteps}`)) continue;

        seen.add(`${currentRow}/${currentColumn}/${currentDirection}/${currentSteps}`);

        for (const direction of Object.keys(directionMap) as Directions[]) {
            const nextRow = currentRow + directionMap[direction][0];
            const nextColumn = currentColumn + directionMap[direction][1];

            if (!isIndexWithinBound(nextRow, nextColumn, nRows, nColumns)) continue;

            if (isOppositeDirection(direction, currentDirection)) continue;

            if (currentDirection != direction && currentSteps < minSteps) continue;

            if (currentDirection === direction && currentSteps >= maxSteps) continue;

            if (currentDirection === direction && currentSteps < maxSteps)
                queue.insert({
                    row: nextRow, column: nextColumn,
                    direction, key: currentKey + heatMap[nextRow][nextColumn], steps: currentSteps + 1
                });
            else {
                queue.insert({
                    row: nextRow, column: nextColumn,
                    direction, key: currentKey + heatMap[nextRow][nextColumn], steps: 1
                });
            }
        }
    }
}

function leastHeatLoss(path: PathLike) {
    const contents = readFileSync(path, {
        encoding: "utf-8",
    })
        .trim()
        .split("\n")
        .map(row => row.split("").map((elem) => +elem));

    const sourceVertex: Vertex = {
        row: 0,
        column: 0,
        key: 0,
        direction: undefined,
        steps: 0,
    }

    const res = calculateLeastHeat(contents, sourceVertex);
    console.log("Result is:", res);
}

leastHeatLoss('./input.txt');

