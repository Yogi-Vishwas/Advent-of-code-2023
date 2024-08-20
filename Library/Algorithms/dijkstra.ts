/* Single Source Path Find */
import { MinPriorityQueue } from "../DataStructures";
import {
    type VertexName,
    type WeightedAdjacencyList,
    type Walk
} from "./types";

export function dijsktra(
    adjacencyList: WeightedAdjacencyList,
    sourceVertex: VertexName
) {
    const vertices = Object.keys(adjacencyList);
    const walk = vertices.reduce((acc, vertexName) => {
        acc[vertexName] = {
            name: vertexName,
            key: Infinity,
            parent: null,
        };
        return acc;
    }, {} as Walk);

    walk[sourceVertex].key = 0;

    const queue = new MinPriorityQueue(Object.values(walk));

    const weight = (vertexA: VertexName, vertexB: VertexName) => {
        return adjacencyList[vertexA].find((currVertex) =>
            (currVertex.name === vertexB))?.weight;
    }

    const dijkstraTree = new Set<string>();

    while (queue.length) {
        const root = queue.extractRoot()!;

        if (dijkstraTree.has(root.name)) {
            continue;
        }
        dijkstraTree.add(root.name);

        for (const adjVertex of adjacencyList[root.name]) {
            const currentEdgeWeight = weight(root.name, adjVertex.name)!;
            if (walk[adjVertex.name].key > root.key + currentEdgeWeight) {
                walk[adjVertex.name].parent = root;
                queue.decreaseKey(
                    walk[adjVertex.name],
                    (elem, elemList) => (elemList.findIndex((curr) => elem.name === curr.name)),
                    root.key + currentEdgeWeight
                );
            }
        }
    }

    return walk;
}

const adjList: WeightedAdjacencyList = {
    s: [{ name: 't', weight: 10 }, { name: 'y', weight: 5 }],
    t: [{ name: 'y', weight: 2 }, { name: 'x', weight: 1 }],
    y: [{ name: 't', weight: 3 }, { name: 'x', weight: 9 }, { name: 'z', weight: 2 }],
    x: [{ name: 'z', weight: 4 }],
    z: [{ name: 's', weight: 7 }, { name: 'x', weight: 6 }],
}

const walk = dijsktra(adjList, 's');
console.log(JSON.stringify(walk));
