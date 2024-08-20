import { readFileSync, type PathLike } from "node:fs";
import { dfs, type GridElem, type Vertex } from "./dfs";

function show(traversal: Vertex[][]) {
    for (const row of traversal) {
        let str = "";
        for (const elem of row) {
            if (elem.visited) str += "#";
            else str += ".";
        }
        console.log(str);
    }
}

function countEnergisedTiles(traversal: Vertex[][]) {
    let count = 0;
    for (const row of traversal) {
        for (const elem of row) {
            if (elem.visited) ++count;
        }
    }
    return count;
}

function getEnergizedTiles(inputFile: PathLike) {
    const grid = readFileSync(inputFile, {
        encoding: "utf-8",
    })
        .trim()
        .split("\n")
        .map(row => row.split("")) as GridElem[][];

    let result = 0;
    // Top row
    for (let column = 0; column < grid[0].length; ++column) {
        const traversal = dfs({
            grid,
            sourceRow: 0,
            sourceColumn: column,
            sourceDirection: "down",
        });
        result = Math.max(result, countEnergisedTiles(traversal));
    }

    // Bottom row
    for (let column = 0; column < grid[0].length; ++column) {
        const traversal = dfs({
            grid,
            sourceRow: grid.length - 1,
            sourceColumn: column,
            sourceDirection: "up",
        });
        result = Math.max(result, countEnergisedTiles(traversal));
    }

    // Left column
    for (let row = 0; row < grid.length; ++row) {
        const traversal = dfs({
            grid,
            sourceRow: row,
            sourceColumn: 0,
            sourceDirection: "right",
        });
        result = Math.max(result, countEnergisedTiles(traversal));
    }

    // Right column
    for (let row = 0; row < grid.length; ++row) {
        const traversal = dfs({
            grid,
            sourceRow: row,
            sourceColumn: grid[0].length - 1,
            sourceDirection: "left",
        });
        result = Math.max(result, countEnergisedTiles(traversal));
    }
    // show(traversal);

    return result;
}

const res = getEnergizedTiles('./input.txt');
console.log("Result is:", res);
