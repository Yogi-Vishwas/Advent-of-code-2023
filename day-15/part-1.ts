import { readFileSync, type PathLike } from "node:fs";

function getHash(str: string) {
    let hash = 0;
    for (let i = 0; i < str.length; ++i) {
        const ascii_val = str.charCodeAt(i);
        hash = (hash + ascii_val) * 17;
        hash %= 256;
    }
    return hash;
}

function getResults(filePath: PathLike) {
    const contents = readFileSync(filePath, {
        encoding: "utf-8",
    })
        .trim()
        .split(",");

    let res = 0;
    for (const str of contents) {
        res += getHash(str);
    }
    return res;
}

const res = getResults("./input.txt");
console.log("Result is:", res);
