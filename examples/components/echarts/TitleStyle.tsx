/**
 * @file Echarts title 样式的配置
 */

import {keywordOrNumber} from './Common';

export default {
  name: 'title',
  type: 'combo',
  label: '',
  noBorder: true,
  multiLine: true,
  controls: [
    {
      type: 'select',
      name: 'textAlign',
      value: 'auto',
      label: '整体（包括 text 和 subtext）的水平对齐',
      options: ['auto', 'left', 'right', 'center']
    },
    {
      type: 'select',
      name: 'textVerticalAlign',
      value: 'auto',
      label: '整体（包括 text 和 subtext）的垂直对齐',
      options: ['auto', 'top', 'bottom', 'middle']
    },
    {
      type: 'number',
      name: 'padding',
      hiddenOn: 'Array.isArray(data.padding)',
      value: 5,
      label: '标题内边距，单位px'
    },
    {
      type: 'switch',
      name: 'padding',
      label: '单独设置每个内边距',
      pipeIn: (value, data) => {
        return Array.isArray(value);
      },
      pipeOut: (value, oldValue) => {
        if (typeof oldValue !== 'undefined') {
          return Array.isArray(oldValue) ? 5 : [0, 0, 0, 0, 0];
        }
        return value ? [0, 0, 0, 0] : 5;
      }
    },
    {
      type: 'array',
      name: 'padding',
      label: '设置标题内边距',
      remark:
        '设置两个值将分别是上下的内边距、坐右的内边距；设置四个值则分别是上、右、下、左',
      visibleOn: 'Array.isArray(data.padding)',
      minLength: 2,
      maxLength: 4,
      items: {
        type: 'number'
      }
    },
    {
      type: 'number',
      value: 5,
      name: 'itemGap',
      label: '主副标题之间的间距'
    },

    ...keywordOrNumber('left', '标题离容器左侧的距离', '左侧距离值类型', [
      'auto',
      'left',
      'center',
      'right'
    ])
  ]
};
