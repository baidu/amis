import {parse, evaluate} from '../src';
import moment from 'moment';

// 来自 https://vanillajstoolkit.com/polyfills/arrayfind/
if (!Array.prototype.find) {
  Array.prototype.find = function (callback: any) {
    // 1. Let O be ? ToObject(this value).
    if (this == null) {
      throw new TypeError('"this" is null or not defined');
    }

    var o = Object(this);

    // 2. Let len be ? ToLength(? Get(O, "length")).
    var len = o.length >>> 0;

    // 3. If IsCallable(callback) is false, throw a TypeError exception.
    if (typeof callback !== 'function') {
      throw new TypeError('callback must be a function');
    }

    // 4. If thisArg was supplied, let T be thisArg; else let T be undefined.
    var thisArg = arguments[1];

    // 5. Let k be 0.
    var k = 0;

    // 6. Repeat, while k < len
    while (k < len) {
      // a. Let Pk be ! ToString(k).
      // b. Let kValue be ? Get(O, Pk).
      // c. Let testResult be ToBoolean(? Call(callback, T, « kValue, k, O »)).
      // d. If testResult is true, return kValue.
      var kValue = o[k];
      if (callback.call(thisArg, kValue, k, o)) {
        return kValue;
      }
      // e. Increase k by 1.
      k++;
    }

    // 7. Return undefined.
    return undefined;
  };
}

export function momentFormat(
  input: any,
  inputFormat: string,
  outputFormat: string
) {
  return moment(input, inputFormat).format(outputFormat);
}

export {parse, evaluate, moment};
