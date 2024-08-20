export type VertexName = string;
export type Vertex = {
    name: VertexName;
    key: number;
    parent: Vertex | null;
}
export type Walk = Record<VertexName, Vertex>
export type WeightedAdjacencyListElem = {
    name: VertexName;
    weight: number;
}
export type WeightedAdjacencyList = Record<VertexName,
    WeightedAdjacencyListElem[]>

