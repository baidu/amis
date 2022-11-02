import {Evaluator} from './evalutor';
import {parse} from './parser';
import {lexer} from './lexer';
import {registerFilter, filters, getFilters, extendsFilters} from './filter';
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
  FilterContext,
  filters,
  getFilters,
  registerFilter,
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

Evaluator.setDefaultFilters(getFilters());
