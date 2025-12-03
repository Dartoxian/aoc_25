import {readFileSync} from 'fs';
import {getRange} from "./utils";

const input = readFileSync('inputs/02.txt', 'utf-8');
const ranges = input.trim().split(',')
    .map(line => line.split('-').map(num => parseInt(num)));
console.log(`Read ranges ${ranges}`)

function getInvalidIdsOfLength(length: number) {
    if (length % 2 !== 0) {
        return [];
    }
    const numbers = getRange({start: Math.pow(10, (length / 2) - 1), end: Math.pow(10, (length / 2))});
    return numbers.map(n => (n * Math.pow(10, length / 2)) + n);
}

function sumInvalidIdsInRange(start: number, end: number) {
    const invalidIds = getRange({
        start: start.toFixed(0).length - 1,
        end: end.toFixed(0).length + 1,
    }).flatMap(getInvalidIdsOfLength)
        .filter(id => id >= start && id <= end);
    console.log(`Invalid ids in range ${start}-${end}: ${invalidIds}`);
    return invalidIds.reduce((sum, id) => sum + id, 0);
}

let numberOfInvalidIds = 0;
ranges.forEach(([start, end]) => numberOfInvalidIds += sumInvalidIdsInRange(start, end));
console.log(`Sum of invalid ids: ${numberOfInvalidIds}`);

function getInvalidIdsOfLengthPart2(length: number, repeats: number) {
    if (length % repeats !== 0) {
        return [];
    }
    console.log(`Generating ids of length ${length} with repeats ${repeats}`);
    const numbers = getRange({start: Math.pow(10, (length / repeats) - 1), end: Math.pow(10, (length / repeats))});
    const series = numbers.map(n => getRange({
            start: 1,
            end: repeats
        }).reduce((sum, x) => (sum * Math.pow(10, length / repeats)) + n, n)
    )
    return series
}

function sumInvalidIdsInRangePart2(start: number, end: number) {
    console.log(`Generating ids for range ${start}-${end}`);
    const invalidIds = getRange({
        start: start.toFixed(0).length - 1,
        end: end.toFixed(0).length + 1,
    }).flatMap(length => length <= 1 ? [] : getRange({
        start: 2,
        end: length + 1
    }).flatMap(repeats => getInvalidIdsOfLengthPart2(length, repeats)))
        .filter(id => id >= start && id <= end)
        .filter((v, i, a) => a.indexOf(v) === i);
    console.log(`Invalid ids in range ${start}-${end}: ${invalidIds}`);
    return invalidIds.reduce((sum, id) => sum + id, 0);
}

numberOfInvalidIds = 0;
ranges.forEach(([start, end]) => numberOfInvalidIds += sumInvalidIdsInRangePart2(start, end));
console.log(`Sum of invalid ids: ${numberOfInvalidIds} part 2`);