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
const tooltipOptions = __inline('./option-parts/option.tooltip.json');

// 给其他组件里的 tooltip 使用的
export const buildTooltip = (scope: string) => {
  return buildOptions(scope, tooltipOptions);
};

export default {
  type: 'tabs',
  tabs: [
    {
      title: '基础',
      body: buildOptions('tooltip.', tooltipOptions)
    }
  ]
};
