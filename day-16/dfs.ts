export type GridElem = "." | "\\" | "\/" | "|" | "-";
export type Directions = "up" | "down" | "left" | "right";
export type Grid = GridElem[][];
export type Vertex = {
    name: string;
    elem: GridElem;
    visited: boolean;
    distance: number;
    parent: Vertex | undefined;
};
export type Traversal = Record<string, Vertex>;

const directionMap: Record<Directions, number[]> = {
    up: [-1, 0],
    down: [1, 0],
    left: [0, -1],
    right: [0, 1],
}

function isIndexWithinBound(row: number, column: number, maxRow: number
    , maxColumn: number) {
    if (row >= maxRow || row < 0) return false;
    else if (column >= maxColumn || column < 0) return false;
    return true;
}

function getNextDirections(currElem: GridElem, currDir: Directions): Directions[] {
    if (currElem === ".") return [currDir];
    else if (currElem === "/") {
        if (currDir === "right") return ["up"];
        else if (currDir === "left") return ["down"];
        else if (currDir === "up") return ["right"];
        else return ["left"];
    }
    else if (currElem === "\\") {
        if (currDir === "right") return ["down"];
        else if (currDir === "left") return ["up"];
        else if (currDir === "up") return ["left"];
        return ["right"];
    }
    else if (currElem === "|") {
        if (currDir === "right") return ["up", "down"];
        else if (currDir === "left") return ["up", "down"];
        else return [currDir];
    }
    else {
        if (currDir === "up") return ["left", "right"];
        else if (currDir === "down") return ["left", "right"];
        else return [currDir];
    }
}

export function dfs({
    grid,
    sourceRow,
    sourceColumn,
    sourceDirection
}: {
    grid: Grid,
    sourceRow: number,
    sourceColumn: number
    sourceDirection: Directions
}) {
    const traversal = grid.reduce((acc, curr, row) => {
        acc.push(Array.from(curr).reduce((acc1, curr1, column) => {
            acc1.push({
                name: `${row},${column}`,
                elem: curr1,
                visited: false,
                distance: 0,
                parent: undefined,
            })
            return acc1;
        }, [] as Vertex[]))
        return acc;
    }, [] as Vertex[][]);

    const visitedMirrorAndDirection = new Set<string>();

    dfsVisit(traversal, {
        row: sourceRow,
        column: sourceColumn
    }, sourceDirection, visitedMirrorAndDirection);

    return traversal;
}

function dfsVisit(traversal: Vertex[][],
    sourceIndex: { row: number, column: number },
    currDir: Directions,
    visitedMirrorAndDirection: Set<string>) {
    const currDistance =
        traversal[sourceIndex.row][sourceIndex.column].distance;
    const currElem =
        traversal[sourceIndex.row][sourceIndex.column].elem;

    const mirrorKey = `${sourceIndex.row},${sourceIndex.column},${currDir}`;
    if (!visitedMirrorAndDirection.has(mirrorKey)) {
        // Mark the current mirror and direction as visited
        visitedMirrorAndDirection.add(mirrorKey);
    } else {
        // Base condition: If the mirror and direction have been visited before, return
        return;
    }

    traversal[sourceIndex.row][sourceIndex.column] = {
        ...traversal[sourceIndex.row][sourceIndex.column],
        visited: true,
        distance: currDistance + 1,
    }

    const nextDirections = getNextDirections(currElem, currDir);

    for (const dir of nextDirections) {
        const nextRow = directionMap[dir][0] + sourceIndex.row;
        const nextColumn = directionMap[dir][1] + sourceIndex.column;

        if (isIndexWithinBound(
            nextRow,
            nextColumn,
            traversal.length,
            traversal[0].length
        ))
            dfsVisit(traversal, {
                row: nextRow,
                column: nextColumn,
            }, dir, visitedMirrorAndDirection);
    }
}
