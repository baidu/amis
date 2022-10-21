module.exports = {
  entry: {
    dir: './src'
  },
  file: {
    test: /.*(ts|tsx|js|jsx)$/
  },
  ignore: {
    list: ['src/locale']
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
    fileName: 'eidtor-core-i18n',
    fileExtension: 'xlsx',
    path: './'
  },
  translate: {
    appId: '20220902001329332',
    key: 'pVS96QbIzVROBSOarU4R',
    host: 'http://api.fanyi.baidu.com'
  }
};
