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
      controls: buildOptions('title.', titleOptions)
    },
    {
      title: '位置',
      controls: [viewport('title.', '标题')]
    },
    {
      title: '样式',
      controls: commonStyle('title.', '标题')
    },
    {
      title: '文字样式',
      controls: [
        textStyleControls('title.textStyle', '主标题'),
        textStyleControls('title.subtextStyle', '副标题')
      ]
    }
  ]
};
