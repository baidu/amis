import {Evaluator} from './evalutor';
import {AsyncEvaluator} from './async/evalutor';
import {parse} from './parser';
import {lexer} from './lexer';
import {registerFilter, filters, getFilters, extendsFilters} from './filter';
import {registerFunction} from './function';
import {
  registerFilterForAsync,
  filtersForAsync,
  getFiltersForAsync,
  extendsFiltersForAsync
} from './async/filter';
import {registerFunctionForAsync} from './async/function';
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
  filtersForAsync,
  getFilters,
  getFiltersForAsync,
  registerFilter,
  registerFilterForAsync,
  registerFunction,
  registerFunctionForAsync,
  extendsFilters,
  extendsFiltersForAsync
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
AsyncEvaluator.setDefaultFilters(getFiltersForAsync());
