import { readFileSync, type PathLike } from "node:fs";

// Result is: 33438
function part2(filePath: PathLike) {
  function getRowsAndColumns(pattern: string) {
    let columns: string[] = [];
    const rows = pattern.split("\n");
    for (let i = 0; i < rows[0].length; ++i) {
      let column = "";
      for (let j = 0; j < rows.length; ++j) {
        column += rows[j][i];
      }
      columns.push(column);
    }
    return [rows, columns];
  }

  function isStringsDifferByOneChar(string1: string, string2: string) {
    let differBy = 0;
    for (let index = 0; index < string1.length; ++index) {
      if (differBy > 1) return false;
      if (string1[index] !== string2[index]) ++differBy;
    }
    if (differBy === 1) return true;
    return false;
  }

  function findRowReflection(rows: string[]) {
    for (let index = 0; index < rows.length; ++index) {
      let tolerationLevel = 0;
      let upTracker = index;
      let downTracker = index + 1;
      while (
        rows[upTracker] === rows[downTracker] ||
        (rows[upTracker] &&
          rows[downTracker] &&
          isStringsDifferByOneChar(rows[upTracker], rows[downTracker]) &&
          tolerationLevel < 1)
      ) {
        if (isStringsDifferByOneChar(rows[upTracker], rows[downTracker]))
          ++tolerationLevel;
        if (
          tolerationLevel === 1 &&
          (upTracker - 1 < 0 || downTracker + 1 === rows.length)
        )
          return index + 1;
        --upTracker;
        ++downTracker;
      }
    }
  }

  function findColumnReflection(columns: string[]) {
    for (let index = 0; index < columns.length; ++index) {
      let tolerationLevel = 0;
      let leftTracker = index;
      let rightTracker = index + 1;
      while (
        columns[leftTracker] === columns[rightTracker] ||
        (columns[leftTracker] &&
          columns[rightTracker] &&
          isStringsDifferByOneChar(
            columns[leftTracker],
            columns[rightTracker]
          ) &&
          tolerationLevel < 1)
      ) {
        if (
          isStringsDifferByOneChar(columns[leftTracker], columns[rightTracker])
        )
          ++tolerationLevel;
        if (
          tolerationLevel === 1 &&
          (leftTracker - 1 < 0 || rightTracker + 1 === columns.length)
        ) {
          return index + 1;
        }
        --leftTracker;
        ++rightTracker;
      }
    }
  }

  const patterns = readFileSync(filePath, { encoding: "utf-8" }).split("\n\n");

  let res = 0;
  for (const pattern of patterns) {
    const [rows, columns] = getRowsAndColumns(pattern);
    const rowReflection = findRowReflection(rows);
    const columnReflection = findColumnReflection(columns);

    if (rowReflection) res += 100 * rowReflection;
    else if (columnReflection) res += columnReflection;
  }

  return res;
}

const res = part2("./input.txt");
console.log("Result is:", res);
