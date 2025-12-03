import {readFileSync} from 'fs';

let dialPosition = 50;
let numberOfZeroes = 0;
let numberOfZeroesPartTwo = 0;

const input = readFileSync('inputs/01.txt', 'utf-8');
const lines = input.split('\n').filter(line => line.length > 0);
const linePattern = /(\w)(\d+)/


lines.forEach(line => {
    const match = linePattern.exec(line);
    const direction = match[1];
    const distance = parseInt(match[2]);
    if (distance === 0) {
        throw new Error('Distance cannot be zero');
    }
    const startingPosition = dialPosition;
    dialPosition += (distance) * (direction === 'R' ? 1 : -1);

    if (dialPosition < 0) {
        numberOfZeroesPartTwo += Math.floor(Math.abs(dialPosition / 100)) + (startingPosition === 0 ? 0 : 1);
    }
    if (dialPosition >= 100) {
        numberOfZeroesPartTwo += Math.floor(dialPosition / 100);
    }
    if (dialPosition === 0) {
        numberOfZeroesPartTwo++;
    }

    while (dialPosition < 0) {
        dialPosition += 100;
    }
    while (dialPosition >= 100) {
        dialPosition -= 100;
    }
    if (dialPosition === 0) {
        numberOfZeroes++;
    }
    console.log(`${line} -> ${dialPosition}`);
})

console.log(`At zero ${numberOfZeroes} during part one`);
console.log(`At zero ${numberOfZeroesPartTwo} during part two`);