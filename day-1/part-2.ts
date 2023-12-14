import { createReadStream, type PathLike } from "node:fs";

/**
 * The newly-improved calibration document consists of lines of text; 
 * each line originally contained a specific calibration value that the Elves now need to recover.
 * On each line, the calibration value can be found by combining 
 * the first digit and the last digit (in that order) to form a single two-digit number.
    For example:
    1abc2
    pqr3stu8vwx
    a1b2c3d4e5f
    treb7uchet
   In this example, the calibration values of these four lines are 12, 38, 15, and 77. Adding these together produces 142.
   Result is: 54159

   --- Part Two ---
  Your calculation isn't quite right.
  It looks like some of the digits are actually spelled out with letters: one, two, three, four, five, six, seven, eight, and nine also count as valid "digits".
  Equipped with this new information, 
  you now need to find the real first and last digit on each line. For example:
    two1nine
    eightwothree
    abcone2threexyz
    xtwone3four
    4nineeightseven2
    zoneight234
    7pqrstsixteen
  In this example, the calibration values are 29, 83, 13, 24, 42, 14, and 76. Adding these together produces 281.
  What is the sum of all of the calibration values?
  Result is: 53866
*/
function getCalibrationValue(calibrationDocPath: PathLike): Promise<number> {
  const lookupTable: Record<string, string[]> = {
    o: ["one"],
    t: ["two", "three"],
    f: ["four", "five"],
    s: ["six", "seven"],
    e: ["eight"],
    n: ["nine"],
  };

  const reverseLookupTable: Record<string, string> = {
    one: "1",
    two: "2",
    three: "3",
    four: "4",
    five: "5",
    six: "6",
    seven: "7",
    eight: "8",
    nine: "9",
  };

  return new Promise((resolve, reject) => {
    let calibrationValue = 0;
    let left: string | undefined = undefined;
    let right: string | undefined = undefined;
    const readStream = createReadStream(calibrationDocPath);
    let index: number = 0;
    let match: string | undefined = undefined;

    readStream
      .on("readable", () => {
        let chunk: string;
        while ((chunk = readStream.setEncoding("ascii").read()) !== null) {
          const isNumber = (char: string) => {
            if (char <= "9" && char >= "0") {
              match = char;
              return true;
            } else if (lookupTable[char]) {
              const potentialMatches = lookupTable[char];
              for (const item of potentialMatches) {
                let j: number = 0;
                const itemSize = item.length;
                while (j < itemSize && item[j] === chunk[index + j]) {
                  j++;
                }
                if (j === itemSize) {
                  match = reverseLookupTable[item];
                  return true;
                }
              }
            } else {
              return false;
            }
          };
          for (index; index < chunk.length; ++index) {
            const char = chunk[index];
            if (!left && isNumber(char)) {
              left = match;
              right = match;
            } else if (isNumber(char)) {
              right = match;
            }
            if (char === "\n") {
              calibrationValue += left && right ? +(left + right) : 0;
              // Reset for new line
              left = undefined;
              right = undefined;
            }
          }
        }
      })
      .on("end", () => {
        calibrationValue += left && right ? +(left + right) : 0;
        resolve(calibrationValue);
      })
      .on("error", (err) => {
        console.error(
          `Something unexpected happened: ${(err as Error).message}`
        );
        reject(err);
      });
  });
}

getCalibrationValue(
  "/home/vishwas.yogi/Desktop/Algo_lib/Problems/AdventOfCode/2023/1/input.txt"
)
  .then((res) => console.log("result is: ", res))
  .catch((err) => console.error(err.message));
