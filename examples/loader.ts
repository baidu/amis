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
    'fflate': __moduleId('fflate'),
    'moment': __moduleId('moment'),
    'mobx': __moduleId('mobx'),
    'mobx-state-tree': __moduleId('mobx-state-tree'),
    'react-transition-group': __moduleId('react-transition-group'),
    'papaparse': __moduleId('papaparse'),
    'echarts': __moduleId('echarts'),
    'zrender': __moduleId('zrender'),
    'sortablejs': __moduleId('sortablejs'),
    'amis': __moduleId('amis'),
    'amis@@version': __moduleId('amis'),
    'amis/embed': __moduleId('./embed.tsx'),
    'amis@@version/embed': __moduleId('./embed.tsx'),
    'prop-types': __moduleId('prop-types'),
    'qs': __moduleId('qs'),
    'path-to-regexp': __moduleId('path-to-regexp'),
    'history': __moduleId('history')
  };

  Object.keys(mapping).forEach(key => {
    (window as any).amis.require.aliasMapping[key] = mapping[key];
  });

  (window as any).amisRequire = (window as any).amis.require;
})();
