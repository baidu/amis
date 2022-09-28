module.exports = {
  entry: {
    dir: [
      './packages/amis/src',
      './packages/amis-core/src',
      './packages/amis-formula/src',
      './packages/amis-ui/src'
    ]
  },
  file: {
    test: /.*(ts|tsx|js|jsx)$/
  },
  ignore: {
    sameGit: true,
    list: ['locale']
  },
  importInfo: {
    source: 'amis-core',
    imported: 'i18n',
    local: '_i18n'
  },
  i18nModule: 'amis-core',
  languages: [
    {
      name: 'en-US',
      path: './packages/amis-ui/src/locale'
    },
    {
      name: 'zh-CN',
      path: './packages/amis-ui/src/locale'
    }
  ],
  output: {
    fileName: 'amis-i18n',
    fileExtension: 'xlsx',
    path: './'
  }
};
