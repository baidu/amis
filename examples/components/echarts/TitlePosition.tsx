/**
 * @file title 位置相关的控件
 */

import {viewportControl, padding, number, createHierarchy} from './Common';

export default createHierarchy('title', [
  {
    type: 'select',
    name: 'textAlign',
    label: '整体（包括 text 和 subtext）的水平对齐',
    options: ['auto', 'left', 'right', 'center']
  },
  {
    type: 'select',
    name: 'textVerticalAlign',
    label: '整体（包括 text 和 subtext）的垂直对齐',
    options: ['auto', 'top', 'bottom', 'middle']
  },
  ...padding('标题'),
  number('itemGap', '主副标题之间的间距'),
  {
    type: 'fieldSet',
    title: '离容器边距',
    collapsable: true,
    collapsed: true,
    controls: [
      ...viewportControl('left', '标题离容器左侧的距离', '左侧距离值类型', [
        'auto',
        'left',
        'center',
        'right'
      ]),
      ...viewportControl('top', '标题离容器上侧的距离', '上侧距离值类型', [
        'auto',
        'top',
        'middle',
        'bottom'
      ]),
      ...viewportControl('right', '标题离容器右侧的距离', '右侧距离值类型', [
        'auto'
      ]),
      ...viewportControl('bottom', '标题离容器下侧的距离', '下侧距离值类型', [
        'auto'
      ])
    ]
  }
]);
