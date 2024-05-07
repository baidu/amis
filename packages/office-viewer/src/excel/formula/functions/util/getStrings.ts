import {EvalResult} from '../../eval/EvalResult';
import {flattenArgs} from './flattenArgs';
import {getString} from './getString';

export function getStrings(args: EvalResult[]) {
  const strings: string[] = [];
  for (const arg of flattenArgs(args)) {
    const str = getString(arg);
    if (str !== undefined) {
      strings.push(str);
    }
  }
  return strings;
}
