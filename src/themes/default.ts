import {theme, ClassNamesFn, makeClassnames} from '../theme';
export const classPrefix: string = 'a-';
export const classnames: ClassNamesFn = makeClassnames(classPrefix);

theme('default', {
  classPrefix,
  classnames
});
