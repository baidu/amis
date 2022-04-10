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
const polarOptions = __inline('./option-parts/option.polar.json');
//@ts-ignore
const radiusAxisOptions = __inline('./option-parts/option.radiusAxis.json');
//@ts-ignore
const angleAxisOptions = __inline('./option-parts/option.angleAxis.json');

export default {
  type: 'tabs',
  tabs: [
    {
      title: '坐标系',
      body: buildOptions('polar.', polarOptions)
    },
    {
      title: '径向轴',
      body: buildOptions('radiusAxis.', radiusAxisOptions)
    },
    {
      title: '角度轴',
      body: buildOptions('angleAxis.', angleAxisOptions)
    }
  ]
};
