import {readFileSync} from 'fs';

const input = readFileSync('inputs/05.txt', 'utf-8');
const [freshLines, availableLines] = input.split('\n\n');
const freshRanges = freshLines
    .split('\n')
    .map(line => line.split('-').map(num => parseInt(num)) as [number, number]);
const availableIngredients = availableLines.split('\n').map(line => parseInt(line));

const freshAvailableIngredients = availableIngredients
    .filter(i => freshRanges.some(([start, end]) => i >= start && i <= end));
console.log(`Number of fresh ingredients: ${freshAvailableIngredients.length}`);

const canonicalFreshRanges = freshRanges.reduce((acc, [start, end]) => {
    // acc will be a sorted array of non overlapping ranges
    const result: [number, number][] = [];
    let i = 0;
    while (i < acc.length && acc[i][1] < start) {
        // current range ends before start
        result.push(acc[i]);
        i++;
    }
    if (i === acc.length) {
        // no overlapping ranges
        result.push([start, end]);
        return result;
    }
    if (acc[i][0] > end) {
        // current range starts after end
        result.push([start, end]);
    } else {
        // current range overlaps with incoming range
        const newStart = Math.min(acc[i][0], start);
        let newEnd = Math.max(acc[i][1], end);
        while (i + 1 < acc.length && acc[i + 1][0] <= newEnd) {
            newEnd = Math.max(newEnd, acc[i + 1][1]);
            i++;
        }
        result.push([newStart, newEnd]);
        i++
    }
    while (i < acc.length) {
        result.push(acc[i]);
        i++;
    }
    return result;
}, []);

const totalSizeOfCanonicalFreshRanges = canonicalFreshRanges.reduce((sum, [start, end]) => sum + (end - start + 1), 0);
console.log(`Total size of canonical fresh ranges: ${totalSizeOfCanonicalFreshRanges}`);