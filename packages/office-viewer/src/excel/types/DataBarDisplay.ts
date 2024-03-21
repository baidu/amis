/**
 * data bar 的展现定义，用于渲染时的绘制
 */

import {X14DataBar} from './X14CF/X14DataBar';

export type DataBarDisplay = {
  /**
   * 是否显示数值
   */
  showValue: boolean;

  /**
   * 百分比，可能是负数
   */
  percent: number;

  /**
   * 展现的颜色
   */
  color: string;

  /**
   * 是否有边框
   */
  border: boolean;

  /**
   * 是否渐变
   */
  gradient: boolean;

  /**
   * 渐变颜色
   */
  colorGradient: string;

  /**
   * 边框颜色
   */
  borderColor: string;

  /**
   * 负数的填充颜色
   */
  negativeFillColor: string;

  /**
   * 负数的填充渐变颜色
   */
  negativeFillColorGradient: string;

  /**
   * 负数的边框颜色
   */
  negativeBorderColor: string;

  /**
   * 坐标轴颜色
   */
  axisColor: string;

  /**
   * 方向
   */
  direction: X14DataBar['direction'];

  /**
   * 是否双向显示，左边是负数，右边是正数
   */
  biDirectional: boolean;
};
