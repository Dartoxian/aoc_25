import {readFileSync} from 'fs';
import {getRange, memoize} from "./utils";

const input = readFileSync('inputs/07.txt', 'utf-8');
const lines = input.split('\n').filter(line => line.trim().length > 0);
const tachyonTraced = [lines[0].replace('S', '|')];
let i = 1;
let splitCount = 0;
while (i < lines.length) {
    const prevLine = tachyonTraced[i - 1];
    const emitIndices = prevLine
        .split('')
        .map((c, j) => c === '|' ? j : -1)
        .filter(j => j >= 0)
        .flatMap(j => {
            if (lines[i][j] === '^') {
                splitCount++;
                return [j - 1, j + 1]
            }
            return [j];
        }).filter(j => j >= 0 && j < lines[i].length)
        .filter((j, k, a) => a.indexOf(j) === k);

    const emittedLine = lines[i].split('').map((c, j) => emitIndices.includes(j) ? '|' : c);
    tachyonTraced.push(emittedLine.join(''));
    i++;
}
console.log(`tachyonTraced: \n${tachyonTraced.join('\n')}`);
const finalTachyons = tachyonTraced[tachyonTraced.length - 1]
    .split('')
    .filter(c => c === '|')
    .length;
console.log(`Number of final tachyons: ${finalTachyons}`);
console.log(`Number of splits: ${splitCount}`);

const memoizeTimelineCount = memoize(getTimelineCountForTachyon);

function getTimelineCountForTachyon(rowNumber, tachyoneIndex: number) {
    let row = tachyonTraced[rowNumber];

    // If there are no rows above, then there are no other ways to have made this tachyon
    if (rowNumber === 0) {
        return 1;
    }

    let timelineCount = 0;
    if (tachyonTraced[rowNumber][tachyoneIndex -1] === '^') {
        timelineCount += memoizeTimelineCount(rowNumber - 1, tachyoneIndex - 1);
    }
    if (tachyonTraced[rowNumber][tachyoneIndex + 1] === '^') {
        timelineCount += memoizeTimelineCount(rowNumber - 1, tachyoneIndex + 1);
    }
    if (tachyonTraced[rowNumber - 1][tachyoneIndex] === '|') {
        timelineCount += memoizeTimelineCount(rowNumber - 1, tachyoneIndex);
    }
    return timelineCount;
}

const finalCounts = tachyonTraced[tachyonTraced.length - 1]
    .split('')
    .map((c, i) => c === '|' ? memoizeTimelineCount(tachyonTraced.length - 1, i) : 0)
    .reduce((sum, v) => sum + v, 0);
console.log(`Number of final timelines: ${finalCounts}`);