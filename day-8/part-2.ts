import { readFileSync, type PathLike } from "node:fs";

type Path = {
  left: string;
  right: string;
};

// Result is: 17099847107071
function getSteps(filePath: PathLike) {
  function gcd(a: number, b: number): number {
    if (b === 0) return a;
    return gcd(b, a % b);
  }

  function lcm(a: number, b: number): number {
    return (a / gcd(a, b)) * b;
  }

  const contents = readFileSync(filePath, { encoding: "utf-8" })
    .split("\n\n")
    .filter((item) => item.length);
  const instructions = contents[0];
  const nodes: Record<string, Path> = contents[1]
    .split("\n")
    .filter((item) => item.length)
    .reduce((acc, item) => {
      const connectedNodes = item.split("=").filter((item) => item.length);
      const source = connectedNodes[0].trim();
      const destinations = connectedNodes[1]
        .split(",")
        .filter((item) => item.length);
      const path = {} as Path;
      path.left = destinations[0].trim().slice(1);
      path.right = destinations[1].trim().slice(0, -1);
      acc[source] = path;

      return acc;
    }, {} as Record<string, Path>);

  const nodesEndingWithA = Object.keys(nodes).filter((node) =>
    node.endsWith("A")
  );

  function getStepsToReachZNodes(initNode: string) {
    let steps = 0;
    let index = 0;
    let nodeName = initNode;
    while (!nodeName.endsWith("Z")) {
      const direction = instructions[index];

      if (direction === "R") {
        nodeName = nodes[nodeName].right;
      } else {
        nodeName = nodes[nodeName].left;
      }
      ++steps;
      index = (index + 1) % instructions.length;
    }
    return steps;
  }

  let steps = 1;
  for (const node of nodesEndingWithA) {
    steps = lcm(steps, getStepsToReachZNodes(node));
  }

  return steps;
}

const res = getSteps("./input.txt");
console.log("Result is: ", res);
