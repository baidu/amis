import {theme, ClassNamesFn, makeClassnames} from '../theme';
export const classPrefix: string = 'dark-';
export const classnames: ClassNamesFn = makeClassnames(classPrefix);

theme('dark', {
  classPrefix,
  classnames,
  renderers: {
    'json': {
      jsonTheme: 'eighties'
    },
    'editor-control': {
      editorTheme: 'vs-dark'
    }
  }
});
