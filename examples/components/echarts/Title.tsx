/**
 * @file Echarts title 的配置
 */

import {createHierarchy} from './Common';

export default createHierarchy('title', [
  {
    type: 'switch',
    name: 'show',
    value: true,
    label: '是否显示标题组件'
  },
  {
    type: 'container',
    visibleOn: 'data.show',
    controls: [
      {
        type: 'text',
        name: 'text',
        label: '主标题文本'
      },
      {
        type: 'text',
        name: 'link',
        visibleOn: 'data.text',
        label: '主标题文本超链接',
        validations: {
          isUrl: true
        }
      },
      {
        type: 'switch',
        name: 'target',
        visibleOn: 'data.link',
        label: '指定窗口打开主标题超链接',
        options: [
          {label: '但前窗口打开', value: 'self'},
          {label: '新窗口打开', value: 'blank'}
        ]
      },
      {
        type: 'text',
        name: 'subtext',
        label: '副标题文本'
      },
      {
        type: 'text',
        name: 'sublink',
        visibleOn: 'data.subtext',
        label: '副标题文本超链接',
        validations: {
          isUrl: true
        }
      },
      {
        type: 'switch',
        name: 'subtarget',
        visibleOn: 'data.sublink',
        label: '指定窗口打开副标题超链接',
        options: [
          {label: '但前窗口打开', value: 'self'},
          {label: '新窗口打开', value: 'blank'}
        ]
      },
      {
        type: 'switch',
        name: 'triggerEvent',
        label: '是否触发事件'
      }
    ]
  }
]);
