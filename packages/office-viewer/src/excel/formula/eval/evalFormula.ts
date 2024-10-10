import {FormulaEnv} from '../FormulaEnv';
import FormulaError from '../FormulaError';
import {Parser} from '../Parser';
import {tokenize} from '../tokenizer';
import {EvalResult} from './EvalResult';
import {FormulaVisitor} from './FormulaVisitor';

export function evalFormula(formula: string, env: FormulaEnv): EvalResult {
  const parser = new Parser(tokenize(formula));
  const ast = parser.parse();
  const formulaVisitor = new FormulaVisitor(env);
  const result = formulaVisitor.visit(ast);
  if (result === Infinity) {
    throw FormulaError.NUM;
  }
  return result;
}
