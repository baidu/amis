import {Enginer} from './tpl';
import {parse, getFilters, registerFilter, Evaluator} from 'amis-formula';
import {prettyBytes} from './prettyBytes';
import {escapeHtml} from './escapeHtml';
import {formatDuration} from './formatDuration';
import {filterDate, parseDuration, relativeValueRe} from './date';
import {pickValues} from './object';
import {isPureVariable} from './isPureVariable';
import {stripNumber} from './stripNumber';
import {tokenize} from './tokenize';
import {resolveVariable} from './resolveVariable';
import {resolveVariableAndFilter} from './resolveVariableAndFilter';
import {dataMapping, resolveMapping, resolveMappingObject} from './dataMapping';
import './filter'; // 扩充 formula 里面的 filter

export {
  prettyBytes,
  escapeHtml,
  formatDuration,
  filterDate,
  relativeValueRe,
  parseDuration,
  getFilters,
  registerFilter,
  pickValues,
  isPureVariable,
  stripNumber,
  tokenize,
  resolveVariable,
  resolveVariableAndFilter,
  resolveMapping,
  resolveMappingObject,
  dataMapping
};

function matchSynatax(str: string) {
  let from = 0;
  while (true) {
    const idx = str.indexOf('$', from);
    if (~idx) {
      const nextToken = str[idx + 1];

      // 如果没有下一个字符，或者下一个字符是引号或者空格
      // 这个一般不是取值用法
      if (!nextToken || ~['"', "'", ' '].indexOf(nextToken)) {
        from = idx + 1;
        continue;
      }

      // 如果上个字符是转义也不是取值用法
      const prevToken = str[idx - 1];
      if (prevToken && prevToken === '\\') {
        from = idx + 1;
        continue;
      }

      return true;
    } else {
      break;
    }
  }
  return false;
}

export function register(): Enginer & {name: string} {
  return {
    name: 'builtin',
    test: (str: string) => typeof str === 'string' && matchSynatax(str),
    removeEscapeToken: (str: string) =>
      typeof str === 'string' ? str.replace(/\\\$/g, '$') : str,
    compile: (str: string, data: object, defaultFilter = '| html') => {
      try {
        return tokenize(str, data, defaultFilter);
      } catch (e) {
        return `error: ${e.message}`;
      }
    }
  };
}
