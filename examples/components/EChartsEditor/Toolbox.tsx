/**
 * @file Echarts toolbox 的配置
 */

import {buildOptions, viewport} from './Common';

//@ts-ignore
const toolboxOptions = __inline('./option-parts/option.toolbox.json');

// TODO: 目前看来问题还比较多

export default {
  type: 'tabs',
  tabs: [
    {
      title: '基础',
      controls: buildOptions('toolbox.', toolboxOptions)
    },
    {
      title: '位置',
      controls: [viewport('toolbox.', '标题')]
    }
  ]
};
