import { readFileSync, type PathLike } from "node:fs";

/**
 * Result is:
 */
function getMinLocation(filePath: PathLike) {
  const content = readFileSync(filePath, {
    encoding: "utf-8",
  }).split("\n\n");

  const seeds = content[0]
    .split(":")[1]
    .split(" ")
    .filter((item) => item !== "")
    .map(Number);

  const maps: number[][][] = [];
  for (let index = 1; index < content.length; ++index) {
    maps[index] = content[index]
      .split(":")[1]
      .split("/n")
      .flatMap((item) => item.split("\n"))
      .filter((item) => !!item)
      .map((item) => item.split(" ").map(Number));
  }

  function getLocation(seedId: number) {
    let num: number = seedId;
    for (let index = 1; index < content.length; ++index) {
      const ranges = maps[index];
      for (const range of ranges) {
        const sourceNumber = range[1];
        const destinationNumber = range[0];
        const rangeLength = range[2];

        if (num >= sourceNumber && num < sourceNumber + rangeLength) {
          num += destinationNumber - sourceNumber;
          break;
        }
      }
    }
    return num;
  }

  let minLocationNum: number = Infinity;
  for (let index = 0; index < seeds.length; ++index) {
    if (index % 2 === 0) {
      const seedRange = seeds[index] + seeds[index + 1];
      for (let seedId = seeds[index]; seedId < seedRange; ++seedId) {
        const locationId = getLocation(seedId);
        minLocationNum = Math.min(minLocationNum, locationId);
        console.log(seedId, minLocationNum);
      }
    }
  }
  return minLocationNum;
}

const res = getMinLocation("./input.txt");
console.log("Result is: ", res);
