module.exports = {
  entry: {
    dir: './src'
  },
  file: {
    test: /.*(ts|tsx|js|jsx)$/
  },
  ignore: {
    list: ['src/local']
  },
  importInfo: {
    source: 'i18n-runtime',
    imported: 'i18n',
    local: '_i18n'
  },
  i18nModule: 'amis-core',
  languages: [
    {
      name: 'en-US',
      path: './src/local'
    },
    {
      name: 'zh-CN',
      path: './src/local'
    }
  ],
  init: {
    fileName: 'eidtor-core-i18n',
    fileExtension: 'xlsx',
    path: './'
  },
  translate: {
    appId: '20220810001301703',
    key: 'WW7jKaJJBrtCawTOkCpk',
    host: 'http://api.fanyi.baidu.com'
  }
};
