import { readFileSync, type PathLike } from "node:fs";

type Path = {
  left: string;
  right: string;
};

// Result is: 19099
function getSteps(filePath: PathLike) {
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

  let steps = 0;
  let index = 0;
  let nodeName: string = "AAA";
  while (nodeName !== "ZZZ") {
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

const res = getSteps("./input.txt");
console.log("Result is: ", res);
