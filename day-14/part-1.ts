import { readFileSync, type PathLike } from "node:fs";

type RockType = "O" | "#";
type RockData = {
  rockType: RockType;
  row: number;
  column: number;
};

// Result is: 113078
function getTotalLoad(filePath: PathLike) {
  function getRockData(platform: string[]) {
    const rockData = {} as Record<string, RockData>;
    for (let row = 0; row < platform.length; ++row) {
      for (let column = 0; column < platform[row].length; ++column) {
        const rock = platform[row][column] as RockType;
        if (rock === "#")
          rockData[`${row},${column}`] = {
            rockType: "#",
            row,
            column,
          };
        else if (rock === "O")
          rockData[`${row},${column}`] = {
            rockType: "O",
            row,
            column,
          };
      }
    }
    return rockData;
  }

  function groupByColumn(rockData: Record<string, RockData>) {
    const groupedData = {} as Record<number, RockData[]>;
    for (const rock of Object.values(rockData)) {
      const rockColumn = rock.column;
      if (groupedData[rockColumn]) groupedData[rockColumn].push(rock);
      else {
        groupedData[rockColumn] = [rock];
      }
    }
    return groupedData;
  }

  function updateRockDataAfterTilt(groupedData: Record<number, RockData[]>) {
    for (const column in groupedData) {
      const columnData = groupedData[column];
      columnData.sort((a, b) => a.row - b.row);
      let blocker = -1;
      for (const rock of columnData) {
        if (rock.rockType === "#") blocker = rock.row;
        else {
          rock.row = blocker + 1;
          blocker = rock.row;
        }
      }
    }
    return groupedData;
  }

  const content = readFileSync(filePath, { encoding: "utf-8" })
    .trim()
    .split("\n");
  const nColumns = content[0].length;
  const rockData = getRockData(content);
  const groupedData = groupByColumn(rockData);
  const updatedRockData = updateRockDataAfterTilt(groupedData);
  let res = 0;
  for (const column in updatedRockData) {
    const data = updatedRockData[column];
    for (const rock of data) {
      if (rock.rockType === "O") res += nColumns - rock.row;
    }
  }
  return res;
}

const res = getTotalLoad("./input.txt");
console.log("Result is:", res);
