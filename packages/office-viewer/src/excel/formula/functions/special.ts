/**
 * 一些特殊实现的函数，在 visitFunction 里实现的
 */

import {FormulaEnv, getRange} from '../FormulaEnv';
import FormulaError from '../FormulaError';
import {ASTNode} from '../ast/ASTNode';
import {EvalResult} from '../eval/EvalResult';
import {
  visitReference,
  visitReferenceIgnoreHidden
} from '../eval/visitReference';
import {tokenIsRef} from '../parser/tokenIsRef';
import {functions} from './functions';

export function ISREF(env: FormulaEnv, node: ASTNode): EvalResult {
  if (node.children.length === 1) {
    const arg = node.children[0];
    if (!Array.isArray(arg)) {
      return tokenIsRef(arg.token);
    } else {
      return false;
    }
  } else {
    return false;
  }
}

export function AREAS(env: FormulaEnv, node: ASTNode): EvalResult {
  if (node.children.length === 1) {
    const arg = node.children[0];
    if (!Array.isArray(arg)) {
      if (arg.type === 'Union') {
        return arg.children.length;
      } else {
        return 1;
      }
    } else {
      return arg.length;
    }
  } else {
    throw FormulaError.VALUE;
  }
}

export function SUBTOTAL(env: FormulaEnv, node: ASTNode): EvalResult {
  const args = node.children;
  if (args.length < 2) {
    throw FormulaError.VALUE;
  }
  const funcNum = parseInt((args[0] as ASTNode).token.value);
  const refs = args.slice(1) as ASTNode[];
  let values: EvalResult[] = [];
  if (funcNum > 100) {
    values = refs.map(ref => {
      return visitReferenceIgnoreHidden(env, ref);
    });
  } else {
    values = refs.map(ref => {
      return visitReference(env, ref);
    });
  }

  switch (funcNum) {
    case 1:
    case 101:
      return functions.get('AVERAGE')!(...values);
    case 2:
    case 102:
      return functions.get('COUNT')!(...values);
    case 3:
    case 103:
      return functions.get('COUNTA')!(...values);
    case 4:
    case 104:
      return functions.get('MAX')!(...values);
    case 5:
    case 105:
      return functions.get('MIN')!(...values);
    case 6:
    case 106:
      return functions.get('PRODUCT')!(...values);
    case 7:
    case 107:
      return functions.get('STDEV')!(...values);
    case 8:
    case 108:
      return functions.get('STDEVP')!(...values);
    case 9:
    case 109:
      return functions.get('SUM')!(...values);
    case 10:
    case 110:
      return functions.get('VAR')!(...values);
    case 11:
    case 111:
      return functions.get('VARP')!(...values);

    default:
      throw FormulaError.VALUE;
  }
}

export function ROW(env: FormulaEnv, node: ASTNode) {
  const args = node.children;
  if (args.length === 1) {
    const ref = args[0] as ASTNode;
    if (tokenIsRef(ref.token) && ref.ref) {
      const range = getRange(env, ref.ref);
      return range.startRow + 1;
    }
    throw FormulaError.VALUE;
  } else {
    return env.formulaCell().startRow + 1;
  }
}

export function ROWS(env: FormulaEnv, node: ASTNode) {
  const args = node.children;
  if (args.length === 1) {
    const ref = args[0] as ASTNode;
    if (tokenIsRef(ref.token) && ref.ref) {
      const range = getRange(env, ref.ref);
      return range.endRow - range.startRow + 1;
    } else if (Array.isArray(ref)) {
      return ref.length;
    }
    throw FormulaError.VALUE;
  } else {
    throw FormulaError.VALUE;
  }
}

export function COLUMN(env: FormulaEnv, node: ASTNode) {
  const args = node.children;
  if (args.length === 1) {
    const ref = args[0] as ASTNode;
    if (tokenIsRef(ref.token) && ref.ref) {
      const range = getRange(env, ref.ref);
      return range.startCol + 1;
    }
    throw FormulaError.VALUE;
  } else {
    return env.formulaCell().startCol + 1;
  }
}

export function COLUMNS(env: FormulaEnv, node: ASTNode) {
  const args = node.children;
  if (args.length === 1) {
    const ref = args[0] as ASTNode;
    if (tokenIsRef(ref.token) && ref.ref) {
      const range = getRange(env, ref.ref);
      return range.endCol - range.startCol + 1;
    } else if (Array.isArray(ref)) {
      if (Array.isArray(ref[0])) {
        return ref[0].length;
      }
      return 0;
    }
    throw FormulaError.VALUE;
  } else {
    throw FormulaError.VALUE;
  }
}

export const specialFunctions = new Map<
  string,
  (env: FormulaEnv, node: ASTNode) => EvalResult
>();

specialFunctions.set('ISREF', ISREF);
specialFunctions.set('AREAS', AREAS);
specialFunctions.set('SUBTOTAL', SUBTOTAL);
specialFunctions.set('ROW', ROW);
specialFunctions.set('ROWS', ROWS);
specialFunctions.set('COLUMN', COLUMN);
specialFunctions.set('COLUMNS', COLUMNS);
