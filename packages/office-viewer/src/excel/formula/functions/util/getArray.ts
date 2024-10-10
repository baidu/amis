import {EvalResult} from '../../eval/EvalResult';
import {flattenArgs} from './flattenArgs';

export function getArray(arg: EvalResult): EvalResult[] {
  if (Array.isArray(arg)) {
    return flattenArgs(arg);
  } else {
    return [arg];
  }
}
