import { readFileSync, type PathLike } from "node:fs";

// Result is: 925
function getExtrapolatedValuesSum(filePath: PathLike) {
  function getPreviousValue(sequence: number[]) {
    const allSequences: number[][] = [sequence];
    while (sequence.filter((item) => item).length) {
      const currSequence: number[] = [];
      for (let index = 1; index < sequence.length; ++index) {
        currSequence.push(sequence[index] - sequence[index - 1]);
      }
      allSequences.push(currSequence);
      sequence = currSequence;
    }
    let prevElem = 0;
    for (let index = allSequences.length - 2; index >= 0; --index) {
      const currSequence = allSequences[index];
      prevElem = currSequence[0] - prevElem;
    }
    return prevElem;
  }

  const contents = readFileSync(filePath, { encoding: "utf-8" })
    .split("\n")
    .filter((item) => item.length)
    .map((item) =>
      item
        .split(" ")
        .filter((item) => item.length)
        .map(Number)
    );

  let res = 0;
  for (const sequence of contents) {
    res += getPreviousValue(sequence);
  }
  return res;
}

const res = getExtrapolatedValuesSum("./input.txt");
console.log("Result is: ", res);
