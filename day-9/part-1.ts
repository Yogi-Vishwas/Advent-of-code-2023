import { readFileSync, type PathLike } from "node:fs";

// Result is: 1702218515
function getExtrapolatedValuesSum(filePath: PathLike) {
  function getNextValue(sequence: number[]) {
    const allSequences: number[][] = [sequence];
    while (sequence.filter((item) => item).length) {
      const currSequence: number[] = [];
      for (let index = 1; index < sequence.length; ++index) {
        currSequence.push(sequence[index] - sequence[index - 1]);
      }
      allSequences.push(currSequence);
      sequence = currSequence;
    }
    let lastElem = 0;
    for (let index = allSequences.length - 2; index >= 0; --index) {
      const currSequence = allSequences[index];
      lastElem = lastElem + currSequence[currSequence.length - 1];
    }
    return lastElem;
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
    res += getNextValue(sequence);
  }
  return res;
}

const res = getExtrapolatedValuesSum("./input.txt");
console.log("Result is: ", res);
