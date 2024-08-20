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

function getEnergizedTiles(inputFile: PathLike) {
    const grid = readFileSync(inputFile, {
        encoding: "utf-8",
    })
        .trim()
        .split("\n")
        .map(row => row.split("")) as GridElem[][];

    const traversal = dfs({
        grid,
        sourceRow: 0,
        sourceColumn: 0,
        sourceDirection: "right",
    });

    // show(traversal);

    let res = 0;
    for (const row of traversal) {
        for (const elem of row) {
            if (elem.visited) ++res;
        }
    }

    return res;
}

const res = getEnergizedTiles('./input.txt');
console.log("Result is:", res);
