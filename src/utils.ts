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

type MemoizedFunction<T extends (...args: any[]) => any> = T & {
    cache: Map<string, ReturnType<T>>;
    clearCache: () => void;
};

interface MemoizeOptions {
    maxCacheSize?: number;
}

export function memoize<T extends (...args: any[]) => any>(
    fn: T,
    options: MemoizeOptions = {}
): MemoizedFunction<T> {
    const cache = new Map<string, ReturnType<T>>();

    const memoized = ((...args: Parameters<T>): ReturnType<T> => {
        const key = JSON.stringify(args);

        if (cache.has(key)) {
            return cache.get(key)!;
        }

        const result = fn(...args);

        if (options.maxCacheSize && cache.size >= options.maxCacheSize) {
            const firstKey = cache.keys().next().value;
            cache.delete(firstKey);
        }

        cache.set(key, result);
        return result;
    }) as MemoizedFunction<T>;

    memoized.cache = cache;
    memoized.clearCache = () => cache.clear();

    return memoized;
}

