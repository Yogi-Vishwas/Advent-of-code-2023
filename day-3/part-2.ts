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
* --- Part Two ---
* The engineer finds the missing part and installs it in the engine! As the engine springs to life, you jump in the closest gondola, finally ready to ascend to the water source.
* You don't seem to be going very fast, though. Maybe something is still wrong? Fortunately, the gondola has a phone labeled "help", so you pick it up and the engineer answers.
* Before you can explain the situation, she suggests that you look out the window. There stands the engineer, holding a phone in one hand and waving with the other. You're going so slowly that you haven't even left the station. You exit the gondola.
* The missing part wasn't the only issue - one of the gears in the engine is wrong. A gear is any * symbol that is adjacent to exactly two part numbers. Its gear ratio is the result of multiplying those two numbers together.
* This time, you need to find the gear ratio of every gear and add them all up so that the engineer can figure out which gear needs to be replaced.
* Consider the same engine schematic again:
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
* In this schematic, there are two gears. The first is in the top left; it has part numbers 467 and 35, so its gear ratio is 16345. The second gear is in the lower right; its gear ratio is 451490. (The * adjacent to 617 is not a gear because it is only adjacent to one part number.) Adding up all of the gear ratios produces 467835.
* What is the sum of all of the gear ratios in your engine schematic?
* Result is: 67779080
*/
function getSumOfParts(docPath: PathLike) {
  const isNumber = (char: string): boolean => {
    return !!(char <= "9" && char >= "0");
  };

  const isSpecialCharacter = (char: string): boolean => {
    if (char === "*") return true;
    return false;
  };

  const lines = readFileSync(docPath, "utf-8").split("\n");

  let result: number = 0;
  let key: string | undefined = undefined;
  const gearsMap: Record<string, number[]> = {};

  const isAdjacentToSpecialChar = (
    charIndex: number,
    currentLineNo: number
  ): boolean => {
    // Check left character
    if (
      charIndex - 1 >= 0 &&
      isSpecialCharacter(lines[currentLineNo][charIndex - 1])
    ) {
      key = `${currentLineNo},${charIndex - 1}`;
      return true;
    }
    // Check right character
    if (
      charIndex + 1 < lines[currentLineNo].length &&
      isSpecialCharacter(lines[currentLineNo][charIndex + 1])
    ) {
      key = `${currentLineNo},${charIndex + 1}`;
      return true;
    }
    // Check above
    if (
      currentLineNo - 1 >= 0 &&
      charIndex < lines[currentLineNo - 1].length &&
      isSpecialCharacter(lines[currentLineNo - 1][charIndex])
    ) {
      key = `${currentLineNo - 1},${charIndex}`;
      return true;
    }
    // Check Down
    if (
      currentLineNo + 1 < lines.length &&
      charIndex < lines[currentLineNo + 1].length &&
      isSpecialCharacter(lines[currentLineNo + 1][charIndex])
    ) {
      key = `${currentLineNo + 1},${charIndex}`;
      return true;
    }
    // Check diagonal left up
    if (
      currentLineNo - 1 >= 0 &&
      charIndex - 1 >= 0 &&
      isSpecialCharacter(lines[currentLineNo - 1][charIndex - 1])
    ) {
      key = `${currentLineNo - 1},${charIndex - 1}`;
      return true;
    }
    // Check diagonal left down
    if (
      currentLineNo + 1 < lines.length &&
      charIndex - 1 >= 0 &&
      isSpecialCharacter(lines[currentLineNo + 1][charIndex - 1])
    ) {
      key = `${currentLineNo + 1},${charIndex - 1}`;
      return true;
    }
    // Check diagonal right up
    if (
      currentLineNo - 1 >= 0 &&
      charIndex + 1 < lines[currentLineNo - 1].length &&
      isSpecialCharacter(lines[currentLineNo - 1][charIndex + 1])
    ) {
      key = `${currentLineNo - 1},${charIndex + 1}`;
      return true;
    }
    //Check diagonal right down
    if (
      currentLineNo + 1 < lines.length &&
      charIndex + 1 < lines[currentLineNo + 1].length &&
      isSpecialCharacter(lines[currentLineNo + 1][charIndex + 1])
    ) {
      key = `${currentLineNo + 1},${charIndex + 1}`;
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
        if (isMachinePart && key) {
          if (gearsMap[key]) {
            gearsMap[key].push(num);
          } else {
            gearsMap[key] = [num];
          }
        }
        key = undefined;
        leftPointer = undefined;
        rightPointer = undefined;
      }
    }
  }

  for (const index in gearsMap) {
    if (gearsMap[index].length === 2) {
      result += gearsMap[index][0] * gearsMap[index][1];
    }
  }

  return result;
}

const result = getSumOfParts(join(__dirname, "input.txt"));
console.log("Result is: ", result);
