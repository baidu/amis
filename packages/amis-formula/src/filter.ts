import {Evaluator} from './evalutor';
import {FilterMap} from './types';

const entityMap: any = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;',
  '/': '&#x2F;'
};
const escapeHtml = (str: string) =>
  String(str).replace(/[&<>"'\/]/g, function (s) {
    return entityMap[s];
  });

/**
 * filter 是历史包袱，不建议使用。因为这是之前的语法，所以在公式解析里面做了兼容。
 * 建议用 ${ LEFT(xxx) } 这种函数调用语法。
 */
export const filters: FilterMap = {
  raw: input => input,
  html: (input: string) => {
    if (input == null) {
      return input;
    }
    return escapeHtml(input);
  }
};

export function registerFilter(
  name: string,
  fn: (input: any, ...args: any[]) => any
): void {
  filters[name] = fn;
  Evaluator.setDefaultFilters(filters);
}

export function extendsFilters(value: FilterMap) {
  Object.assign(filters, value);
  Evaluator.setDefaultFilters(filters);
}

export function getFilters() {
  return filters;
}
