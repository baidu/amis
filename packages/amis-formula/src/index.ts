import {Evaluator} from './evalutor';
import {AsyncEvaluator} from './evalutorForAsync';
import {parse} from './parser';
import {lexer} from './lexer';
import {registerFilter, filters, getFilters, extendsFilters} from './filter';
import {registerFunction, registerFunctionDoc, functionDocs} from './function';
import type {
  FilterContext,
  ASTNode,
  ParserOptions,
  EvaluatorOptions
} from './types';
export {
  parse,
  lexer,
  Evaluator,
  AsyncEvaluator,
  FilterContext,
  filters,
  getFilters,
  registerFilter,
  registerFunction,
  registerFunctionDoc,
  functionDocs,
  extendsFilters
};

export function evaluate(
  astOrString: string | ASTNode,
  data: any,
  options?: ParserOptions & EvaluatorOptions
) {
  let ast: ASTNode = astOrString as ASTNode;
  if (typeof astOrString === 'string') {
    ast = parse(astOrString, options);
  }

  return new Evaluator(data, options).evalute(ast);
}

export async function evaluateForAsync(
  astOrString: string | ASTNode,
  data: any,
  options?: ParserOptions & EvaluatorOptions
) {
  let ast: ASTNode = astOrString as ASTNode;
  if (typeof astOrString === 'string') {
    ast = parse(astOrString, options);
  }

  return new AsyncEvaluator(data, options).evalute(ast);
}

Evaluator.setDefaultFilters(getFilters());
AsyncEvaluator.setDefaultFilters(getFilters());
