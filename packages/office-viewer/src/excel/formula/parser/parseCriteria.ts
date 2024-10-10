/**
 * 来自 fast-formula-parser 里的实现
 */
import FormulaError from '../FormulaError';
import {WildCard} from '../functions/util/wildCard';

export type Criteria = {
  op: '<>' | '<' | '<=' | '>' | '>=' | '=' | 'wc';
  value: string | number | boolean | RegExp;
  isArray?: boolean;
  match?: boolean;
};

/**
 * Parse criteria, support comparison and wild card match.
 * @param {string|number} criteria
 * @return {{op: string, value: string|number|boolean|RegExp, match: boolean|undefined}} - The parsed criteria.
 */
export function parseCriteria(criteria: string | number): Criteria {
  const type = typeof criteria;
  if (typeof criteria === 'string') {
    // criteria = 'TRUE' or 'FALSE'
    const upper = criteria.toUpperCase();
    if (upper === 'TRUE' || upper === 'FALSE') {
      // excel boolean
      return {op: '=', value: upper === 'TRUE'};
    }

    const res = criteria.match(/(<>|>=|<=|>|<|=)(.*)/);

    // is comparison
    if (res) {
      // [">10", ">", "10", index: 0, input: ">10", groups: undefined]
      let op = res[1] as '<>' | '<' | '<=' | '>' | '>=' | '=',
        value;

      // string or boolean or error
      if (isNaN(parseFloat(res[2]))) {
        const upper = res[2].toUpperCase();
        if (upper === 'TRUE' || upper === 'FALSE') {
          // excel boolean
          value = upper === 'TRUE';
        } else if (
          /#NULL!|#DIV\/0!|#VALUE!|#NAME\?|#NUM!|#N\/A|#REF!/.test(res[2])
        ) {
          // formula error
          throw new FormulaError(res[2]);
        } else {
          // string, can be wildcard
          value = res[2];
          if (WildCard.isWildCard(value)) {
            return {
              op: 'wc',
              value: WildCard.toRegex(value),
              match: op === '='
            };
          }
        }
      } else {
        // number
        value = Number(res[2]);
      }
      return {op, value};
    } else if (WildCard.isWildCard(criteria)) {
      return {op: 'wc', value: WildCard.toRegex(criteria), match: true};
    } else {
      return {op: '=', value: criteria};
    }
  } else if (type === 'boolean' || type === 'number') {
    return {op: '=', value: criteria};
  } else if (Array.isArray(criteria)) {
    return {op: '=', isArray: true, value: criteria};
  } else {
    throw Error(`Criteria.parse: type ${typeof criteria} not support`);
  }
}
