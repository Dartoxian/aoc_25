import {readFileSync} from 'fs';
import {memoize} from "./utils";

const input = readFileSync('inputs/03.txt', 'utf-8');
const lines = input.split('\n').filter(line => line.length > 0);
const banks = lines.map(line => line.split('').map(num => parseInt(num)));

function findJoltageTotal(bank: number[], maxBatteries: number = 2) {
    function findBankJoltageRec(bank: number[], maxBatteries: number): number[] {
        if (maxBatteries > bank.length) {
            throw new Error(`Cannot find joltage total for bank ${bank} with max batteries ${maxBatteries}`);
        }
        if (maxBatteries === 0) {
            return [];
        }
        if (bank.length === maxBatteries) {
            return bank;
        }
        const digit = bank[0];
        const remainingBank = bank.slice(1);
        const remainingJoltageUsingDigit = memoizedFindBankJoltageRec(remainingBank, maxBatteries - 1);
        const remainingJoltageNotUsingDigit = memoizedFindBankJoltageRec(remainingBank, maxBatteries);
        const withDigitTotal = remainingJoltageUsingDigit.reduce((sum, v) => (10 * sum) + v, digit);
        const withoutDigitTotal = remainingJoltageNotUsingDigit.reduce((sum, v) => (10 * sum) + v, 0);
        if (withDigitTotal > withoutDigitTotal) {
            return [digit, ...remainingJoltageUsingDigit];
        } else {
            return remainingJoltageNotUsingDigit;
        }
    }
    const memoizedFindBankJoltageRec = memoize(findBankJoltageRec);

    const batteriesOn = memoizedFindBankJoltageRec(bank, maxBatteries);
    const joltage = batteriesOn.reduce((sum, v) => (10 * sum) + v, 0);
    console.log(`Joltage total for bank ${bank} is ${joltage}`);
    return joltage
}

const joltageTotals = banks.map(b => findJoltageTotal(b, 2));

console.log(`Joltage total for all banks is ${joltageTotals.reduce((sum, joltage) => sum + joltage, 0)}`);

const p2JoltageTotals = banks.map(b => findJoltageTotal(b, 12));

console.log(`Joltage total for all banks is ${p2JoltageTotals.reduce((sum, joltage) => sum + joltage, 0)}`);
