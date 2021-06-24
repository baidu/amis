const __moduleId = (str: string) => '';

const mapping: {
  [propName: string]: any;
} = {
  'jquery': __moduleId('jquery'),
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
  'mobx-state-tree': __moduleId('mobx-state-tree'),
  'react-transition-group': __moduleId('react-transition-group'),
  'papaparse': __moduleId('papaparse'),
  'echarts': __moduleId('echarts'),
  'zrender': __moduleId('zrender'),
  'sortablejs': __moduleId('sortablejs'),
  'amis': __moduleId('../src'),
  'amis@@version': __moduleId('../src'),
  'amis/embed': __moduleId('./embed.tsx'),
  'amis@@version/embed': __moduleId('./embed.tsx'),
  'prop-types': __moduleId('prop-types'),
  'async/mapLimit': __moduleId('async/mapLimit'),
  'qs': __moduleId('qs'),
  'path-to-regexp': __moduleId('path-to-regexp'),
  'history': __moduleId('history')
};

function amisRequire(...args: Array<any>) {
  let mapping = amisRequire.mapping;
  let id = args.shift();
  id = Array.isArray(id) ? id.map(id => mapping[id] || id) : mapping[id] || id;
  args.unshift(id);
  return amis.require.apply(this, args);
}
amisRequire.mapping = mapping;

// 如果已经有了，只是补充进去，不要覆盖了。
if ((window as any).amisRequire?.mapping) {
  Object.keys(mapping).forEach(
    key => ((window as any).amisRequire.mapping[key] = mapping[key])
  );
} else {
  (window as any).amisRequire = amisRequire;
}
