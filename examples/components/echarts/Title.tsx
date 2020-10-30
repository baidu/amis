/**
 * @file Echarts title 的配置
 */

import {
  textStyleControls,
  numberOrArray,
  shadowControls,
  color,
  number,
  padding,
  select,
  trueSwitch,
  falseSwitch,
  visibleOn,
  viewport,
  createHierarchy
} from './Common';

export default {
  type: 'tabs',
  tabs: [
    {
      title: '内容',
      controls: [
        createHierarchy('title', [
          trueSwitch('show', '是否显示标题组件'),
          visibleOn('data.show || typeof data.show === "undefined" ', [
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
            // 在这里似乎没啥用
            falseSwitch('triggerEvent', '是否触发事件')
          ])
        ])
      ]
    },
    {
      title: '位置',
      controls: [
        createHierarchy('title', [
          select('textAlign', '整体（包括 text 和 subtext）的水平对齐', [
            'auto',
            'left',
            'right',
            'center'
          ]),
          select(
            'textVerticalAlign',
            '整体（包括 text 和 subtext）的垂直对齐',
            ['auto', 'top', 'bottom', 'middle']
          ),
          ...padding('标题'),
          number('itemGap', '主副标题之间的间距'),
          viewport('标题')
        ])
      ]
    },
    {
      title: '样式',
      controls: [
        createHierarchy('title', [
          color('backgroundColor', '标题背景色，默认透明'),
          color('borderColor', '标题的边框颜色'),
          number('borderWidth', '标题的边框线宽'),
          ...numberOrArray('borderRadius', '圆角半径', '单独设置每个圆角半径'),
          shadowControls()
        ])
      ]
    },
    {
      title: '文字样式',
      controls: [
        createHierarchy('title', [
          textStyleControls('textStyle', '主标题'),
          textStyleControls('subtextStyle', '副标题')
        ])
      ]
    }
  ]
};
