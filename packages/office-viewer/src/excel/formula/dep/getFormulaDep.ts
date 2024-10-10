import Graph from '../../../util/graph';
import {rangeRefToString} from '../../io/excel/util/Range';
import {RangeRef} from '../../types/RangeRef';
import {FormulaEnv} from '../FormulaEnv';
import FormulaError from '../FormulaError';
import {Parser} from '../Parser';
import {tokenize} from '../tokenizer';

export function buildFormulaDependencyGraph(formula: string, env: FormulaEnv) {
  const visitedFormula = new Set<string>();
  const cell = env.formulaCell();
  const cellId = rangeRefToString(cell);
  const graph = Graph();
}

function getDependentCells(formula: string, env: FormulaEnv) {
  const parser = new Parser(tokenize(formula));
  const ast = parser.parse();
}
