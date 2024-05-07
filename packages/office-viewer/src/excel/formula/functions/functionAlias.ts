import {FunctionName} from '../builtinFunctions';
import {functions, regFunc} from './functions';

const functionAlias: Map<FunctionName, FunctionName> = new Map([
  ['BETADIST', 'BETA.DIST'],
  ['BETAINV', 'BETA.INV'],
  ['BINOMDIST', 'BINOM.DIST'],
  ['CHIDIST', 'CHISQ.DIST'],
  ['CHIINV', 'CHISQ.INV'],
  ['CHITEST', 'CHISQ.TEST'],
  ['COVAR', 'COVARIANCE.P'],
  ['CRITBINOM', 'BINOM.INV'],
  ['EXPONDIST', 'EXPON.DIST'],
  ['FDIST', 'F.DIST'],
  ['FINV', 'F.INV'],
  ['FTEST', 'F.TEST'],
  ['GAMMADIST', 'GAMMA.DIST'],
  ['GAMMAINV', 'GAMMA.INV'],
  ['HYPGEOMDIST', 'HYPGEOM.DIST'],
  ['LOGINV', 'LOGNORM.INV'],
  ['LOGNORMDIST', 'LOGNORM.DIST'],
  ['NEGBINOMDIST', 'NEGBINOM.DIST'],
  ['NORMDIST', 'NORM.DIST'],
  ['NORMINV', 'NORM.INV'],
  ['NORMSDIST', 'NORM.S.DIST'],
  ['NORMSINV', 'NORM.S.INV'],
  ['MODE', 'MODE.SNGL'],
  ['STDEVP', 'STDEV.P'],
  ['TDIST', 'T.DIST'],
  ['TINV', 'T.INV'],
  // ['TTEST', 'T.TEST'],
  ['VARP', 'VAR.P'],
  ['ZTEST', 'Z.TEST']
]);

for (const [alias, name] of functionAlias) {
  const func = functions.get(name);
  if (!func) {
    throw new Error(`Function ${name} not found`);
  } else {
    functions.set(alias, func);
  }
}
