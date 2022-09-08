module.exports = {
  entry: {
    dir: './src'
  },
  file: {
    test: /.*(ts|tsx|js|jsx)$/
  },
  ignore: {
    list: ['src/icons', 'src/locale']
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
      path: './src/locale'
    },
    {
      name: 'zh-CN',
      path: './src/locale'
    }
  ],
  output: {
    fileName: 'editor-i18n',
    fileExtension: 'xlsx',
    path: './'
  },
  translate: {
    appId: '20220810001301703',
    key: 'WW7jKaJJBrtCawTOkCpk',
    host: 'http://api.fanyi.baidu.com'
  }
};
