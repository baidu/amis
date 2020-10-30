/**
 * @file Echarts title 样式的配置
 */

import {
  numberOrArray,
  shadowControls,
  color,
  number,
  createHierarchy
} from './Common';

export default createHierarchy('title', [
  color('backgroundColor', '标题背景色，默认透明'),
  color('borderColor', '标题的边框颜色'),
  number('borderWidth', '标题的边框线宽'),
  ...numberOrArray('borderRadius', '圆角半径', '单独设置每个圆角半径'),
  shadowControls()
]);
