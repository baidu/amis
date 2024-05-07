import FormulaError from '../FormulaError';
import {ASTNode} from '../ast/ASTNode';
import {EvalResult} from './EvalResult';
import {FormulaVisitor} from './FormulaVisitor';
import {toNum} from './toNum';
import {toString} from './toStr';

/**
 * 两个值的二元运算
 */
export function visitBinaryExpr(
  visitor: FormulaVisitor,
  node: ASTNode
): EvalResult {
  const op = node.token.value;

  const left = visitor.visit(node.children[0]);
  const right = visitor.visit(node.children[1]);

  switch (op) {
    case '+':
      return plus(left, right);

    case '-':
      return minus(left, right);

    case '*':
      return mul(left, right);

    case '/':
      return div(left, right);

    case '^':
      return pow(left, right);

    case '&':
      return toString(left) + toString(right);

    case '=':
      return JSON.stringify(left) === JSON.stringify(right);

    case '<':
      return toNum(left) < toNum(right);

    case '>':
      return toNum(left) > toNum(right);

    case '<=':
      return toNum(left) <= toNum(right);

    case '>=':
      return toNum(left) >= toNum(right);

    case '<>':
      return JSON.stringify(left) !== JSON.stringify(right);

    default:
      throw new Error('Not implemented ' + op);
  }
}

/**
 * 支持数组的加法
 */
function plus(a: EvalResult, b: EvalResult) {
  if (!Array.isArray(a) && !Array.isArray(b)) {
    const aNumber = toNum(a);
    const bNumber = toNum(b);
    return aNumber + bNumber;
  } else if (Array.isArray(a) && !Array.isArray(b)) {
    return arrayConstOp(a, b, plus);
  } else if (!Array.isArray(a) && Array.isArray(b)) {
    return arrayConstOp(b, a, plus);
  } else {
    return arrayArrayOp(a as EvalResult[], b as EvalResult[], plus);
  }
}

function minus(a: EvalResult, b: EvalResult) {
  if (!Array.isArray(a) && !Array.isArray(b)) {
    return toNum(a) - toNum(b);
  } else if (Array.isArray(a) && !Array.isArray(b)) {
    return arrayConstOp(a, b, minus);
  } else if (!Array.isArray(a) && Array.isArray(b)) {
    return arrayConstOp(b, a, minus);
  } else {
    return arrayArrayOp(a as EvalResult[], b as EvalResult[], minus);
  }
}

function mul(a: EvalResult, b: EvalResult) {
  if (!Array.isArray(a) && !Array.isArray(b)) {
    return toNum(a) * toNum(b);
  } else if (Array.isArray(a) && !Array.isArray(b)) {
    return arrayConstOp(a, b, mul);
  } else if (!Array.isArray(a) && Array.isArray(b)) {
    return arrayConstOp(b, a, mul);
  } else {
    return arrayArrayOp(a as EvalResult[], b as EvalResult[], mul);
  }
}

function div(a: EvalResult, b: EvalResult): EvalResult {
  if (!Array.isArray(a) && !Array.isArray(b)) {
    const rightValue = toNum(b);
    if (rightValue === 0) {
      return {
        type: 'Error',
        value: FormulaError.DIV0.name
      };
    }
    return toNum(a) / rightValue;
  } else if (Array.isArray(a) && !Array.isArray(b)) {
    return arrayConstOp(a, b, div);
  } else if (!Array.isArray(a) && Array.isArray(b)) {
    return arrayConstOp(b, a, div);
  } else {
    return arrayArrayOp(a as EvalResult[], b as EvalResult[], div);
  }
}

function pow(a: EvalResult, b: EvalResult) {
  if (!Array.isArray(a) && !Array.isArray(b)) {
    return Math.pow(toNum(a), toNum(b));
  } else if (Array.isArray(a) && !Array.isArray(b)) {
    return arrayConstOp(a, b, pow);
  } else if (!Array.isArray(a) && Array.isArray(b)) {
    return arrayConstOp(b, a, pow);
  } else {
    return arrayArrayOp(a as EvalResult[], b as EvalResult[], pow);
  }
}

function arrayConstOp(
  a: EvalResult[],
  b: EvalResult,
  op: (a: EvalResult, b: EvalResult) => EvalResult
): EvalResult[] {
  return a.map(item => {
    if (Array.isArray(item)) {
      return item.map(subItem => op(subItem, b));
    }
    return op(item, b);
  });
}

function arrayArrayOp(
  a: EvalResult[],
  b: EvalResult[],
  op: (a: EvalResult, b: EvalResult) => EvalResult
): EvalResult[] {
  return a.map((item, index) => {
    if (Array.isArray(item) && Array.isArray(b[index])) {
      return arrayArrayOp(item, b[index] as EvalResult[], op);
    }
    return op(item, b[index]);
  });
}
