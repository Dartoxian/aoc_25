import {readFileSync} from 'fs';
import {getRange} from "./utils";

const input = readFileSync('inputs/06.txt', 'utf-8');
const lines = input.split('\n').filter(line => line.trim().length > 0);
const values = lines
    .slice(0, lines.length - 1)
    .map(line => line.split(/\s+/).filter(l => l.length > 0).map(num => parseInt(num)));
const ops = lines[lines.length - 1].split(/\s+/);

const solutionPart1 = getRange({start: 0, end: values[0].length})
    .map(i => values
        .map(v => v[i])
        .reduce((combine, v) => {
            if (ops[i] === '+') {
                return combine + v;
            } else {
                return combine * v;
            }
        })
    ).reduce((sum, v) => sum + v, 0);

console.log(`Solution part 1: ${solutionPart1}`);

let valuesPart2 = lines
    .slice(0, lines.length - 1)
    .map(line => line.split(/\s+/).filter(l => l.length > 0));

const columnCount = valuesPart2[0].length;
const longestValueInEachColumn = getRange({start: 0, end: columnCount})
    .map(i => Math.max(...valuesPart2.map(v => v[i].length)));

valuesPart2 = getRange({start: 0, end: lines.length - 1}).map(i => []);
lines.slice(0, lines.length - 1).forEach((line, i) => {
    let start = 0;
    let col = 0
    while (col < columnCount) {
        const colLength = longestValueInEachColumn[col];
        valuesPart2[i].push(line.substring(start, start + colLength));
        start += colLength + 1;
        col++;
    }
})

const solutionPart2 = getRange({start: 0, end: columnCount})
    .map(i => {
        const columnRawValues = valuesPart2.map(v => v[i]);
        const parsedValues = getRange({start: 0, end: longestValueInEachColumn[i]})
            .map(j => columnRawValues
                .map(v => v[j])
                .map(d => d === " " || d === undefined ? undefined : parseInt(d))
                .reduce((acc, digit): number | undefined => {
                    if (digit === undefined) {
                        return acc;
                    }
                    if (acc === undefined) {
                        return digit;
                    }
                    return acc * 10 + digit;
                }));

        return parsedValues.reduce((combine, v) => {
            if (ops[i] === '+') {
                return combine + v;
            } else {
                return combine * v;
            }
        })
    }).reduce((sum, v) => sum + v, 0);

console.log(`Solution part 2: ${solutionPart2}`);