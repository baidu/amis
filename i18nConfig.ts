export default {
  entry: {
    dir: './packages/amis-editor-core/src'
  },
  file: {
    test: /.*(ts|tsx|js|jsx)$/
  },
  ignore: {
    list: [
      'packages/**/locale/*',
      'packages/amis/*',
      'packages/amis-ui/*',
      'packages/amis-core/*',
      'packages/amis-formula/*',
      'packages/**/examples/*'
    ]
  },
  importInfo: {
    source: 'i18n-runtime',
    imported: 'i18n',
    local: '_i18n'
  },
  i18nModule: 'i18n-runtime',
  languages: [
    {
      name: 'en-US',
      path: [
        './packages/amis-editor-core/src/locale',
        './packages/amis-editor/src/locale'
      ]
    },
    {
      name: 'zh-CN',
      path: [
        './packages/amis-editor-core/src/locale',
        './packages/amis-editor/src/locale'
      ]
    }
  ]
};
