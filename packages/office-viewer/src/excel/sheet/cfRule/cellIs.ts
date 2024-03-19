import {CT_CfRule} from '../../../openxml/ExcelTypes';
import {gt, gte, lt, lte} from '../../../util/number';
import {CellInfo} from '../../types/CellInfo';
import {Sheet} from '../Sheet';

import {applyCfRuleDxf} from './applyCfRuleDxf';

export function equal(text: string, formula: string[]) {
  const firstFormula = formula[0];
  return text === firstFormula;
}

export function notEqual(text: string, formula: string[]) {
  const firstFormula = formula[0];
  return text !== firstFormula;
}

export function greaterThan(text: string, formula: string[]) {
  const firstFormula = formula[0];
  try {
    const textValue = parseFloat(text);
    const formulaValue = parseFloat(firstFormula);
    return gt(textValue, formulaValue);
  } catch (error) {
    console.warn('error', error);
  }

  return false;
}

export function greaterThanOrEqual(text: string, formula: string[]) {
  const firstFormula = formula[0];
  try {
    const textValue = parseFloat(text);
    const formulaValue = parseFloat(firstFormula);
    return gte(textValue, formulaValue);
  } catch (error) {
    console.warn('error', error);
  }
  return false;
}

export function lessThan(text: string, formula: string[]) {
  const firstFormula = formula[0];
  try {
    const textValue = parseFloat(text);
    const formulaValue = parseFloat(firstFormula);
    return lt(textValue, formulaValue);
  } catch (error) {
    console.warn('error', error);
  }
  return false;
}

export function lessThanOrEqual(text: string, formula: string[]) {
  const firstFormula = formula[0];
  try {
    const textValue = parseFloat(text);
    const formulaValue = parseFloat(firstFormula);
    return lte(textValue, formulaValue);
  } catch (error) {
    console.warn('error', error);
  }
  return false;
}

export function between(text: string, formula: string[]) {
  try {
    const textValue = parseFloat(text);
    const firstValue = parseFloat(formula[0]);
    const secondValue = parseFloat(formula[1]);
    return gte(textValue, firstValue) && lte(textValue, secondValue);
  } catch (error) {
    console.warn('error', error);
  }
  return false;
}

export function notBetween(text: string, formula: string[]) {
  try {
    const textValue = parseFloat(text);
    const firstValue = parseFloat(formula[0]);
    const secondValue = parseFloat(formula[1]);
    return lt(textValue, firstValue) || gt(textValue, secondValue);
  } catch (error) {
    console.warn('error', error);
  }
  return false;
}

export function containsText(text: string, formula: string[]) {
  const firstFormula = formula[0];
  return text.includes(firstFormula);
}

export function notContains(text: string, formula: string[]) {
  const firstFormula = formula[0];
  return !text.includes(firstFormula);
}

export function beginsWith(text: string, formula: string[]) {
  const firstFormula = formula[0];
  return text.startsWith(firstFormula);
}

export function endsWith(text: string, formula: string[]) {
  const firstFormula = formula[0];
  return text.endsWith(firstFormula);
}

function evalOperator(operator: string, text: string, formula: string[]) {
  switch (operator) {
    case 'equal':
      return equal(text, formula);

    case 'notEqual':
      return notEqual(text, formula);

    case 'greaterThan':
      return greaterThan(text, formula);

    case 'greaterThanOrEqual':
      return greaterThanOrEqual(text, formula);

    case 'lessThan':
      return lessThan(text, formula);

    case 'lessThanOrEqual':
      return lessThanOrEqual(text, formula);

    case 'between':
      return between(text, formula);

    case 'notBetween':
      return notBetween(text, formula);

    case 'containsText':
      return containsText(text, formula);

    case 'notContains':
      return notContains(text, formula);

    case 'beginsWith':
      return beginsWith(text, formula);

    case 'endsWith':
      return endsWith(text, formula);

    default:
      console.warn('未知的 operator', operator);
  }
  return false;
}

/**
 * 类似
 *  <cfRule type="cellIs" dxfId="0" priority="1" operator="greaterThanOrEqual">
      <formula>50</formula>
    </cfRule>
 */

export function cellIs(
  sheet: Sheet,
  cellInfo: CellInfo,
  cfRule: CT_CfRule
): boolean {
  const formula = cfRule.formula || [];
  if (!formula.length) {
    return false;
  }

  let value = cellInfo.value;

  const operator = cfRule.operator;

  if (value === '' || !operator) {
    return false;
  }

  let match = evalOperator(operator, value, formula);

  if (match) {
    applyCfRuleDxf(cfRule, sheet, cellInfo);
    return true;
  }

  return false;
}
