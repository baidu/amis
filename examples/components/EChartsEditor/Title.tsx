/**
 * @file Echarts title 的配置
 */

import {
  textStyleControls,
  buildOptions,
  commonStyle,
  viewport,
  createHierarchy
} from './Common';

//@ts-ignore
const titleOptions = __inline('./option-parts/option.title.json');

export default {
  type: 'tabs',
  tabs: [
    {
      title: '内容',
      className: 'echarts-tab',
      controls: [createHierarchy('title', buildOptions('', titleOptions))]
    },
    {
      title: '位置',
      controls: [createHierarchy('legend', [viewport('', '标题')])]
    },
    {
      title: '样式',
      controls: [createHierarchy('title', commonStyle('', '标题'))]
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
