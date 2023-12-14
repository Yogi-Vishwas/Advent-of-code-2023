import { readFileSync, type PathLike } from "node:fs";
import { join } from "node:path";

/**
* --- Day 3: Gear Ratios ---
* You and the Elf eventually reach a gondola lift station; he says the gondola lift will take you up to the water source, but this is as far as he can bring you. You go inside.
* It doesn't take long to find the gondolas, but there seems to be a problem: they're not moving.
* "Aaah!"
* You turn around to see a slightly-greasy Elf with a wrench and a look of surprise. "Sorry, I wasn't expecting anyone! The gondola lift isn't working right now; it'll still be a while before I can fix it." You offer to help.
* The engineer explains that an engine part seems to be missing from the engine, but nobody can figure out which one. If you can add up all the part numbers in the engine schematic, it should be easy to work out which part is missing.
* The engine schematic (your puzzle input) consists of a visual representation of the engine. There are lots of numbers and symbols you don't really understand, but apparently any number adjacent to a symbol, even diagonally, is a "part number" and should be included in your sum. (Periods (.) do not count as a symbol.)
* Here is an example engine schematic:
    467..114..
    ...*......
    ..35..633.
    ......#...
    617*......
    .....+.58.
    ..592.....
    ......755.
    ...$.*....
    .664.598..
* In this schematic, two numbers are not part numbers because they are not adjacent to a symbol: 114 (top right) and 58 (middle right). Every other number is adjacent to a symbol and so is a part number; their sum is 4361.
* Of course, the actual engine schematic is much larger. What is the sum of all of the part numbers in the engine schematic?
* Result is:  512794
*/
function getSumOfParts(docPath: PathLike) {
  const isNumber = (char: string): boolean => {
    return !!(char <= "9" && char >= "0");
  };

  const isSpecialCharacter = (char: string): boolean => {
    if (isNumber(char) || char === ".") return false;
    return true;
  };

  const lines = readFileSync(docPath, "utf-8").split("\n");

  let result: number = 0;

  const isAdjacentToSpecialChar = (
    charIndex: number,
    currentLineNo: number
  ): boolean => {
    // Check left character
    if (
      charIndex - 1 >= 0 &&
      isSpecialCharacter(lines[currentLineNo][charIndex - 1])
    ) {
      return true;
    }
    // Check right character
    if (
      charIndex + 1 < lines[currentLineNo].length &&
      isSpecialCharacter(lines[currentLineNo][charIndex + 1])
    ) {
      return true;
    }
    // Check above
    if (
      currentLineNo - 1 >= 0 &&
      charIndex < lines[currentLineNo - 1].length &&
      isSpecialCharacter(lines[currentLineNo - 1][charIndex])
    ) {
      return true;
    }
    // Check Down
    if (
      currentLineNo + 1 < lines.length &&
      charIndex < lines[currentLineNo + 1].length &&
      isSpecialCharacter(lines[currentLineNo + 1][charIndex])
    ) {
      return true;
    }
    // Check diagonal left up
    if (
      currentLineNo - 1 >= 0 &&
      charIndex - 1 >= 0 &&
      isSpecialCharacter(lines[currentLineNo - 1][charIndex - 1])
    ) {
      return true;
    }
    // Check diagonal left down
    if (
      currentLineNo + 1 < lines.length &&
      charIndex - 1 >= 0 &&
      isSpecialCharacter(lines[currentLineNo + 1][charIndex - 1])
    ) {
      return true;
    }
    // Check diagonal right up
    if (
      currentLineNo - 1 >= 0 &&
      charIndex + 1 < lines[currentLineNo - 1].length &&
      isSpecialCharacter(lines[currentLineNo - 1][charIndex + 1])
    ) {
      return true;
    }
    //Check diagonal right down
    if (
      currentLineNo + 1 < lines.length &&
      charIndex + 1 < lines[currentLineNo + 1].length &&
      isSpecialCharacter(lines[currentLineNo + 1][charIndex + 1])
    ) {
      return true;
    }
    return false;
  };

  for (let lineIter = 0; lineIter < lines.length; ++lineIter) {
    const line = lines[lineIter] + ".";
    let leftPointer: number | undefined = undefined;
    let rightPointer: number | undefined = undefined;
    for (let index = 0; index < line.length; ++index) {
      const char = line[index];
      if (isNumber(char)) {
        let isMachinePart = false;
        if (!leftPointer) leftPointer = index;
        rightPointer = index;
        while (rightPointer < line.length && isNumber(line[rightPointer])) {
          if (
            !isMachinePart &&
            isAdjacentToSpecialChar(rightPointer, lineIter)
          ) {
            isMachinePart = true;
          }
          ++rightPointer;
        }
        index = rightPointer - 1;
        const num = +line.slice(leftPointer, rightPointer);
        leftPointer = undefined;
        rightPointer = undefined;
        if (isMachinePart) {
          result += num;
        }
      }
    }
  }

  return result;
}

const result = getSumOfParts(join(__dirname, "input.txt"));
console.log("Result is: ", result);
