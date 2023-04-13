/**
 * 表达式解析错误
 */

export class FormulaEvalError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'FormulaEvalError';
  }
}
