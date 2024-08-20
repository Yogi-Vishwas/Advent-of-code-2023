import { readFileSync, type PathLike } from "node:fs";

type Label = string;
type FocalLength = number;

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
    const hashMap: Map<string, number>[] = Array(256).fill(null).map(() => new Map());
    const contents = readFileSync(filePath, {
        encoding: "utf-8",
    })
        .trim()
        .split(",");

    for (const str of contents) {
        let label: string;
        if (str.includes("=")) {
            let focalLength;
            [label, focalLength] = str.split("=");
            const box = getHash(label);
            const lenses = hashMap[box];
            lenses.set(label, +focalLength);
        }
        else {
            let focalLength: string;
            [label, focalLength] = str.split("-");
            const box = getHash(label);
            const lenses = hashMap[box];
            if (lenses.get(label)) lenses.delete(label);
        }
    }

    let focusingPower = 0;
    for (let i = 0; i < hashMap.length; ++i) {
        focusingPower += Array.from(hashMap[i].values()).reduce((acc, focalLength, index) => {
            acc += (i + 1) * focalLength * (index + 1);
            return acc;
        }, 0);
    }
    return focusingPower;
}

const res = getResults("./input.txt");
console.log("Result is:", res);
