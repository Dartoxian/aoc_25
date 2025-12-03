interface RangeParams {
    start: number;
    end: number;
    step?: number;
}

export function getRange({start, end, step = 1}: RangeParams): number[] {
    if (step === 0) {
        throw new Error('Step cannot be zero');
    }

    if ((end - start) * step < 0) {
        throw new Error(`Invalid range parameters: step direction must match range direction, got start=${start}, end=${end}, step=${step}`);
    }

    const length = Math.ceil(Math.abs((end - start) / step));
    return Array.from({length}, (_, i) => start + i * step);
}