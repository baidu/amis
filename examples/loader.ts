
const __moduleId = (str: string) => '';

const mapping: {
    [propName: string]: any;
} = {
    'jquery': __moduleId('jquery'),
    'react': __moduleId('react'),
    'react-dom': __moduleId('react-dom'),
    'react-addons-update': __moduleId('react-addons-update'),
    'immutability-helper': __moduleId('react-addons-update'),
    'react-router': __moduleId('react-router'),
    'react-select': __moduleId('react-select'),
    'react-cropper': __moduleId('react-cropper'),
    'react-dropzone': __moduleId('react-dropzone'),
    'react-bootstrap': __moduleId('react-bootstrap'),
    'classnames': __moduleId('classnames'),
    'axios': __moduleId('axios'),
    'moment': __moduleId('moment'),
    'mobx': __moduleId('mobx'),
    'mobx-state-tree': __moduleId('mobx-state-tree'),
    'react-transition-group': __moduleId('react-transition-group'),
    'echarts': __moduleId('echarts'),
    'zrender': __moduleId('zrender'),
    'sortablejs': __moduleId('sortablejs'),
    'history': __moduleId('history'),
    'amis': __moduleId('../src'),
    'amis/embed': __moduleId('./embed.tsx'),
    'prop-types': __moduleId('prop-types'),
    'async': __moduleId('async'),
    'qs': __moduleId('qs'),
    'lodash/find': __moduleId('lodash/find'),
    'lodash/findLast': __moduleId('lodash/findLast'),
    'lodash/chunk': __moduleId('lodash/chunk'),
    'lodash/flatMap': __moduleId('lodash/flatMap'),
    'lodash/isEqual': __moduleId('lodash/isEqual'),
    'lodash/transform': __moduleId('lodash/transform'),
    'lodash/debounce': __moduleId('lodash/debounce'),
    'lodash/difference': __moduleId('lodash/difference'),
    'lodash/partition': __moduleId('lodash/partition'),
    'lodash/forEach': __moduleId('lodash/forEach'),
    'lodash/omit': __moduleId('lodash/omit'),
    'lodash/pick': __moduleId('lodash/pick'),
    'lodash/isPlainObject': __moduleId('lodash/isPlainObject'),
    'lodash/isObject': __moduleId('lodash/isObject'),
};

function amisRequire(...args: Array<any>) {
    let id = args.shift();
    id = Array.isArray(id) ? id.map(id => mapping[id] || id) : mapping[id] || id;
    args.unshift(id);
    return require.apply(this, args);
};

(window as any).amisRequire = amisRequire;