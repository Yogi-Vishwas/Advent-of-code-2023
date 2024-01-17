import { readFileSync, type PathLike } from "node:fs";

/**
 * Result is:
 */
function getMinLocation(filePath: PathLike) {
  let inRange: boolean = true;
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

  function getLocation(
    seedId: number,
    config: {
      inRange: boolean;
      rangeStart: number;
    }
  ) {
    let num: number = seedId;
    for (let index = 1; index < content.length; ++index) {
      const ranges = maps[index];
      for (let rangeNo = 0; rangeNo < ranges.length; ++rangeNo) {
        const range = ranges[rangeNo];
        const sourceNumber = range[1];
        const destinationNumber = range[0];
        const rangeLength = range[2];

        if (num >= sourceNumber && num < sourceNumber + rangeLength) {
          num += destinationNumber - sourceNumber;
          break;
        } else if (index === content.length - 1) {
          config.inRange = false;
          config.rangeStart = 1;
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
        const locationId = getLocation(seedId, {
          inRange: true,
          rangeStart: seedId,
        });
        minLocationNum = Math.min(minLocationNum, locationId);
        if (!inRange) {
          seedId = 1;
        }
      }
    }
  }
  return minLocationNum;
}

const res = getMinLocation("./sample-input.txt");
console.log("Result is: ", res);
