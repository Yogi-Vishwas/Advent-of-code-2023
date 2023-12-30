import { readFileSync, type PathLike } from "node:fs";

type GalaxyData = {
  name: number;
  row: number;
  column: number;
};

// Result is: 10231178
function getSumOfMinLengths(filePath: PathLike) {
  function getMinStepsBetweenGalaxies(
    galaxy1: GalaxyData,
    galaxy2: GalaxyData
  ) {
    return (
      Math.abs(galaxy1.column - galaxy2.column) +
      Math.abs(galaxy1.row - galaxy2.row)
    );
  }

  const contents = readFileSync(filePath, { encoding: "utf-8" })
    .split("\n")
    .filter((item) => item.length);

  const isColumnEmpty: boolean[] = new Array(contents[0].length).fill(true);
  const isRowEmpty: boolean[] = new Array(contents.length).fill(true);

  let galaxyNo = 0;
  const galaxiesData = [] as GalaxyData[];
  for (let row = 0; row < contents.length; ++row) {
    for (let column = 0; column < contents[row].length; ++column) {
      const char = contents[row][column];
      if (char === "#") {
        isColumnEmpty[column] = false;
        isRowEmpty[row] = false;
        galaxiesData.push({
          name: ++galaxyNo,
          row,
          column,
        });
      }
    }
  }

  const emptyColumns = isColumnEmpty.reduce((acc, item, index) => {
    if (item) acc.push(index);
    return acc;
  }, [] as number[]);
  const emptyRows = isRowEmpty.reduce((acc, item, index) => {
    if (item) acc.push(index);
    return acc;
  }, [] as number[]);

  // Update galaxy location after expansion
  for (const data of galaxiesData) {
    const newRowsToAdd = emptyRows.filter((row) => row < data.row).length;
    const newColumnsToAdd = emptyColumns.filter(
      (column) => column < data.column
    ).length;
    data.row += newRowsToAdd;
    data.column += newColumnsToAdd;
  }

  let res = 0;
  for (let i = 0; i < galaxiesData.length; ++i) {
    for (let j = i + 1; j < galaxiesData.length; ++j) {
      const galaxy1 = galaxiesData[i];
      const galaxy2 = galaxiesData[j];
      res += getMinStepsBetweenGalaxies(galaxy1, galaxy2);
    }
  }

  return res;
}

const res = getSumOfMinLengths("./input.txt");
console.log("Result is:", res);
