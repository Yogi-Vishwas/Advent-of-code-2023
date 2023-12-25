import { readFileSync, type PathLike } from "node:fs";
const { pow, sqrt, floor, ceil } = Math;

// Result is:  37286485
function part2(filePath: PathLike) {
  const contents = readFileSync(filePath, {
    encoding: "utf-8",
  }).split("\n");

  const time = +contents[0].split(":")[1].replace(/\s/g, "");

  const distance = +contents[1].split(":")[1].replace(/\s/g, "");

  function getNumberOfWins(time: number, distance: number) {
    const sqrt_discriminant = sqrt(pow(time, 2) - 4 * distance);
    if (sqrt_discriminant) {
      const root1 = (time + sqrt_discriminant) / 2;
      const root2 = (time - sqrt_discriminant) / 2;

      let startingTime: number, endingTime: number;
      startingTime = ceil(root2);
      endingTime = floor(root1);
      if (ceil(root2) === root2) {
        startingTime = root2 + 1;
      }
      if (floor(root1) === root1) {
        endingTime = root1 - 1;
      }
      if (startingTime < 0) {
        startingTime = 1;
      }
      if (endingTime < 0) {
        return 0;
      }

      return endingTime - startingTime + 1;
    }
    return 0;
  }

  const result = getNumberOfWins(time, distance);

  return result;
}

const result = part2("./input.txt");
console.log("Result is: ", result);
