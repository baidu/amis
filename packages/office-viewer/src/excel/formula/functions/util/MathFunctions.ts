import FormulaError from '../../FormulaError';
import {EvalResult} from '../../eval/EvalResult';
import {Factorials, factorial} from './Factorials';
import {getNumberOrThrow} from './getNumber';

export const MathFunctions = {
  COMBIN: (number: EvalResult, numberChosen: EvalResult) => {
    number = getNumberOrThrow(number);
    numberChosen = getNumberOrThrow(numberChosen);
    if (number < 0 || numberChosen < 0 || number < numberChosen)
      throw FormulaError.NUM;
    const nFactorial = MathFunctions.FACT(number),
      kFactorial = MathFunctions.FACT(numberChosen);
    return nFactorial / kFactorial / MathFunctions.FACT(number - numberChosen);
  },

  FACT: (number: EvalResult) => {
    number = getNumberOrThrow(number);
    number = Math.trunc(number);
    // max number = 170
    if (number > 170 || number < 0) throw FormulaError.NUM;
    if (number <= 100) return Factorials[number];
    return factorial(number);
  }
};
