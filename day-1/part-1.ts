import { createReadStream, type PathLike } from "node:fs";
import { join } from "node:path";

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
*/
function getCalibrationValue(calibrationDocPath: PathLike): Promise<number> {
  return new Promise((resolve, reject) => {
    let calibrationValue = 0;
    let left: string | undefined = undefined;
    let right: string | undefined = undefined;
    const readStream = createReadStream(calibrationDocPath);

    readStream
      .on("readable", () => {
        let chunk: string;
        while ((chunk = readStream.setEncoding("ascii").read()) !== null) {
          const isNumber = (char: string) => {
            return !!(char <= "9" && char >= "0");
          };
          for (let char of chunk) {
            if (!left && isNumber(char)) {
              left = char;
              right = char;
            } else if (isNumber(char)) {
              right = char;
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

getCalibrationValue(join(__dirname, "input.txt"))
  .then((res) => console.log("result is: ", res))
  .catch((err) => console.error(err.message));
