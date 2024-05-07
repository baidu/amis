/**
 * Formula Error.
 */
export class FormulaError extends Error {
  private _error: string;
  private details?: object;

  /**
   * @param {string} error - error code, i.e. #NUM!
   * @param {string} [msg] - detailed error message
   * @param {object|Error} [details]
   * @returns {FormulaError}
   */
  constructor(error: string, msg?: string, details?: object) {
    super(msg);
    if (msg == null && details == null && FormulaError.errorMap.has(error))
      return FormulaError.errorMap.get(error);
    else if (msg == null && details == null) {
      this._error = error;
      FormulaError.errorMap.set(error, this);
    } else {
      this._error = error;
    }
    this.details = details;
  }

  /**
   * Get the error name.
   * @returns {string} formula error
   */
  get error() {
    return this._error;
  }
  get name() {
    return this._error;
  }

  /**
   * Return true if two errors are same.
   * @param {FormulaError} err
   * @returns {boolean} if two errors are same.
   */
  equals(err: FormulaError) {
    return err instanceof FormulaError && err._error === this._error;
  }

  /**
   * Return the formula error in string representation.
   * @returns {string} the formula error in string representation.
   */
  toString() {
    return this._error;
  }

  static errorMap: Map<any, any> = new Map();

  static DIV0: FormulaError = new FormulaError('#DIV/0!');
  static NA: FormulaError = new FormulaError('#N/A');
  static NAME: FormulaError = new FormulaError('#NAME?');
  static NULL: FormulaError = new FormulaError('#NULL!');
  static NUM: FormulaError = new FormulaError('#NUM!');
  static REF: FormulaError = new FormulaError('#REF!');
  static VALUE: FormulaError = new FormulaError('#VALUE!');
  static NOT_IMPLEMENTED = (functionName: string) => {
    return new FormulaError(
      '#NAME?',
      `Function ${functionName} is not implemented.`
    );
  };
  static TOO_MANY_ARGS = (functionName: string) => {
    return new FormulaError(
      '#N/A',
      `Function ${functionName} has too many arguments.`
    );
  };

  static ARG_MISSING = () => {
    return new FormulaError('#N/A', `Argument type  is missing.`);
  };
  static ERROR = (msg: string, details?: object) => {
    return new FormulaError('#ERROR!', msg, details);
  };
}

export default FormulaError;
