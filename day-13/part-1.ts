import { readFileSync, type PathLike } from "node:fs";

// Result is: 29130
function part1(filePath: PathLike) {
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

  function findRowReflection(rows: string[]) {
    for (let index = 0; index < rows.length; ++index) {
      let upTracker = index;
      let downTracker = index + 1;
      while (rows[upTracker] === rows[downTracker]) {
        if (upTracker - 1 < 0 || downTracker + 1 === rows.length)
          return index + 1;
        --upTracker;
        ++downTracker;
      }
    }
  }

  function findColumnReflection(columns: string[]) {
    for (let index = 0; index < columns.length; ++index) {
      let leftTracker = index;
      let rightTracker = index + 1;
      while (columns[leftTracker] === columns[rightTracker]) {
        if (leftTracker - 1 < 0 || rightTracker + 1 === columns.length)
          return index + 1;
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
    if (columnReflection) res += columnReflection;
  }

  return res;
}

const res = part1("./input.txt");
console.log("Result is:", res);
