module.exports = {
  entry: {
    dir: './src'
  },
  file: {
    test: /.*(ts|tsx|js|jsx)$/
  },
  includes: ['src/renderers'],
  importInfo: {
    source: 'i18n-runtime',
    imported: 'i18n',
    local: '_i18n'
  },
  i18nModule: 'i18n-runtime',
  languages: [
    {
      name: 'en-US',
      path: './src/locale'
    },
    {
      name: 'zh-CN',
      path: './src/locale'
    }
  ],
  output: {
    fileName: 'theme-editor-i18n',
    fileExtension: 'xlsx',
    path: './'
  },
  translate: {
    appId: '',
    key: '',
    host: 'http://api.fanyi.baidu.com'
  }
};
