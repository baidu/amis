import {resolveVariable} from './resolveVariable';

export function makeSorter(
  key: string,
  method?: 'alpha' | 'numerical',
  order?: 'desc' | 'asc'
) {
  return function (a: any, b: any) {
    if (!a || !b) {
      return 0;
    }

    const va = resolveVariable(key, a);
    const vb = resolveVariable(key, b);
    let result = 0;

    if (method === 'numerical') {
      result = (parseFloat(va) || 0) - (parseFloat(vb) || 0);
    } else {
      result = String(va).localeCompare(String(vb));
    }

    return result * (order === 'desc' ? -1 : 1);
  };
}
