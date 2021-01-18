import {theme, ClassNamesFn, makeClassnames} from '../theme';
export const classPrefix: string = 'antd-';
export const classnames: ClassNamesFn = makeClassnames(classPrefix);

theme('antd', {
  classPrefix,
  classnames
});
