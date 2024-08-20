import { MinPriorityQueue } from "../DataStructures";
import {
    type VertexName,
    type Walk,
    type WeightedAdjacencyList,
} from "./types";

export function MstPrim(
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

    const mstVertices: VertexName[] = [];
    const isMstVertex =
        (vertexName: VertexName) => mstVertices.includes(vertexName);

    while (queue.length) {
        const root = queue.extractRoot()!;
        mstVertices.push(root.name);

        for (const adjVertex of adjacencyList[root.name]) {
            const currentEdgeWeight = weight(root.name, adjVertex.name)!;
            if (!isMstVertex(adjVertex.name) && walk[adjVertex.name].key > currentEdgeWeight) {
                walk[adjVertex.name].parent = root;
                queue.decreaseKey(
                    walk[adjVertex.name],
                    (elem, elemList) => (elemList.findIndex((curr) => elem.name === curr.name)),
                    currentEdgeWeight
                );
            }
        }
    }

    return walk;
}

const adjList: WeightedAdjacencyList = {
    a: [{ name: 'b', weight: 4 }, { name: 'h', weight: 8 }],
    b: [{ name: 'a', weight: 4 }, { name: 'c', weight: 8 }, { name: 'h', weight: 11 }],
    c: [{ name: 'b', weight: 8 }, { name: 'd', weight: 7 }, { name: 'i', weight: 2 }, { name: 'f', weight: 4 }],
    d: [{ name: 'c', weight: 7 }, { name: 'f', weight: 14 }, { name: 'e', weight: 9 }],
    e: [{ name: 'd', weight: 9 }, { name: 'f', weight: 10 }],
    f: [{ name: 'c', weight: 4 }, { name: 'd', weight: 14 }, { name: 'e', weight: 10 }, { name: 'g', weight: 2 }],
    g: [{ name: 'f', weight: 2 }, { name: 'h', weight: 1 }, { name: 'i', weight: 6 }],
    h: [{ name: 'a', weight: 8 }, { name: 'b', weight: 11 }, { name: 'g', weight: 1 }, { name: 'i', weight: 7 }],
    i: [{ name: 'c', weight: 2 }, { name: 'g', weight: 6 }, { name: 'h', weight: 7 }],
};

const res = MstPrim(adjList, 'a');
console.log(JSON.stringify(res));
