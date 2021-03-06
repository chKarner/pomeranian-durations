/**
 * Helpers to compare 2 iso durations with each other. Only time parts can be compared
 * as otherwise the comparison might be wrong. When any of the functions is partially
 * applied the arguments are automatically swapped so one can write the following:
 * ````javascript
 * const isStillBigger = pipe(
 *   add('PT10S'),
 *   gte('PT1M'),
 * )
 * isStillBigger('PT50S') // => true
 * isStillBigger('PT49S') // => false
 * ````
 * @name default
 */

import { asMicroseconds } from './conversions';
import { isInvalid } from './validate';


const buildCompareFn = (compareFn) => {
  return function resolver(...args) {
    const first = args[0];
    const second = args[1];
    if (args.length !== 2) { return (_second) => resolver(_second, first); }

    if (isInvalid(first) || isInvalid(second)) { return false;}
    const firstAsSeconds = asMicroseconds(first);
    const secondAsSeconds = asMicroseconds(second);
    return compareFn(firstAsSeconds, secondAsSeconds);
  };
};

/**
 * Returns true when first value is bigger or equal than second value. When partially applied the
 * arguments are flipped.
 * @param firstIsoDuration {string} - ISO8601 duration
 * @param secondIsoDuration {string} - ISO8601 duration
 * @example
 * gte('PT2S', 'PT2S') // => true
 * @example
 * gte('PT3S', 'PT2S') // => true
 * @example
 * gte('PT3S')('PT2S') // => false
 */
export const gte = buildCompareFn((first, second) => first >= second);

/**
 * Returns true when first value is bigger than second value. When partially applied the
 * arguments are flipped.
 * @param firstIsoDuration {string} - ISO8601 duration
 * @param secondIsoDuration {string} - ISO8601 duration
 * @example
 * gt('PT2S', 'PT2S') // => false
 * @example
 * gt('PT3S', 'PT2S') // => true
 * @example
 * gt('PT3S')('PT2S') // => false
 */
export const gt = buildCompareFn((first, second) => first > second);

/**
 * Returns true when first value is smaller than second value. When partially applied the
 * arguments are flipped to allow easy piping.
 * @param firstIsoDuration {string} - ISO8601 duration
 * @param secondIsoDuration {string} - ISO8601 duration
 * @example
 * lt('PT2S', 'PT2S') // => false
 * @example
 * lt('PT3S', 'PT2S') // => false
 * @example
 * lt('PT3S')('PT2S') // => true
 */
export const lt = buildCompareFn((first, second) => first < second);

/**
 * Returns true when first value is smaller or equal than second value. When partially applied the
 * arguments are flipped to allow easy piping.
 * @param firstIsoDuration {string} - ISO8601 duration
 * @param secondIsoDuration {string} - ISO8601 duration
 * @example
 * lte('PT2S', 'PT2S') // => true
 * @example
 * lte('PT3S', 'PT2S') // => false
 * @example
 * lte('PT3S')('PT2S') // => true
 */
export const lte = buildCompareFn((first, second) => first <= second);

/**
 * Returns true when both values are the same.
 * @param firstIsoDuration {string} - ISO8601 duration
 * @param secondIsoDuration {string} - ISO8601 duration
 * @example
 * eq('PT2S', 'PT2S') // => true
 */
export const eq = buildCompareFn((first, second) => first === second);
