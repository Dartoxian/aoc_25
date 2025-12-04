import {readFileSync} from 'fs';
import {getRange} from "./utils";


const input = readFileSync('inputs/04.txt', 'utf-8');
let lines = input.split('\n').filter(line => line.length > 0);

function getValueAt(x: number, y: number) {
    return lines[y][x]
}

function getAdjacentValues(x: number, y: number) {
    return getRange({start: -1, end: 2})
        .flatMap(dx => getRange({start: -1, end: 2}).map(dy => [x + dx, y + dy]))
        .filter(([x2, y2]) => !(x === x2 && y === y2))
        .filter(([x, y]) => x >= 0 && y >= 0 && x < lines[0].length && y < lines.length)
        .map(([x, y]) => getValueAt(x, y));
}

function isMovableAt(x: number, y: number) {
    return getValueAt(x, y) === '@' && getAdjacentValues(x, y).filter(v => v === '@').length < 4
}

console.log(getAdjacentValues(8, 9))

const numberOfMovableRolls = getRange({start: 0, end: lines[0].length }).flatMap(x => getRange({
    start: 0,
    end: lines.length
}).map(y => [x, y]))
    .filter(([x, y]) => isMovableAt(x, y))
    .length;

console.log(`Number of movable rolls: ${numberOfMovableRolls}`);

let updated = false;
do {
    updated =   false;
    lines = lines.map((line, y) => line.split('')
        .map((_, x) => {
            if (isMovableAt(x, y)) {
                updated = true;
                return '.'
            }
            return getValueAt(x, y);
        })
        .join(''));
} while (updated);

const originalRolls = input.split('').filter(c => c === '@').length;
const finalRolls = lines.flatMap(l => l.split('')).filter(c => c === '@').length;
console.log(`Number of final rolls: ${finalRolls}`);
console.log(`Difference between original and final rolls: ${originalRolls - finalRolls}`);