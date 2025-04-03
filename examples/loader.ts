// 这个文件编译不会包裹，所以手动包裹一下。
(function () {
  const __moduleId = (str: string) => '';

  const mapping: {
    [propName: string]: any;
  } = {
    'react': __moduleId('react'),
    'react-dom': __moduleId('react-dom'),
    'immutability-helper': __moduleId('immutability-helper'),
    'react-cropper': __moduleId('react-cropper'),
    'react-dropzone': __moduleId('react-dropzone'),
    'classnames': __moduleId('classnames'),
    'axios': __moduleId('axios'),
    'exceljs': __moduleId('exceljs'),
    'moment': __moduleId('moment'),
    'mobx': __moduleId('mobx'),
    'mobx-react': __moduleId('mobx-react'),
    'mobx-state-tree': __moduleId('mobx-state-tree'),
    'react-transition-group': __moduleId('react-transition-group'),
    'papaparse': __moduleId('papaparse'),
    'echarts': __moduleId('echarts'),
    'zrender': __moduleId('zrender'),
    'sortablejs': __moduleId('sortablejs'),
    'amis': __moduleId('amis/lib/minimal'),
    'amis/full': __moduleId('amis'),
    'amis@@version': __moduleId('amis/lib/minimal'),
    'amis@@version/full': __moduleId('amis'),
    'amis/embed': __moduleId('./embed.tsx'),
    'amis@@version/embed': __moduleId('./embed.tsx'),
    'prop-types': __moduleId('prop-types'),
    'qs': __moduleId('qs'),
    'path-to-regexp': __moduleId('path-to-regexp'),
    'history': __moduleId('history'),
    'tslib': __moduleId('tslib'),
    '@fex/amis': __moduleId('amis/lib/minimal'),
    '@fex/amis-ui': __moduleId('amis-ui'),
    '@fex/amis-core': __moduleId('amis-core'),
    '@fex/amis-formula': __moduleId('amis-formula'),
    'amis-ui': __moduleId('amis-ui'),
    'amis-core': __moduleId('amis-core'),
    'amis-formula': __moduleId('amis-formula'),
    'copy-to-clipboard': __moduleId('copy-to-clipboard')
  };

  Object.keys(mapping).forEach(key => {
    (window as any).amis.require.aliasMapping[key] = mapping[key];
  });

  (window as any).amisRequire = (window as any).amis.require;
})();
