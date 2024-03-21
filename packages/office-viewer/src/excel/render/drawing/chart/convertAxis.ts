/**
 * 构建坐标轴
 */

import {CT_CatAx, CT_ValAx} from '../../../../openxml/ChartTypes';

/**
 * 将 Excel chart 的坐标轴转换为 Echarts 的坐标轴
 */
export function convertAxis(
  categories: string[],
  catAx?: CT_CatAx,
  valAx?: CT_ValAx
) {
  let xAxis = {};

  let yAxis = {};

  if (catAx) {
    let axis = {
      type: 'category'
    } as echarts.EChartOption.XAxis | echarts.EChartOption.YAxis;

    if (catAx.axPos?.val === 'b') {
      xAxis = axis;
    }

    if (catAx.axPos?.val === 't') {
      xAxis = axis;
      axis.position = 'top';
    }

    if (catAx.axPos?.val === 'l') {
      yAxis = axis;
    }

    if (catAx.axPos?.val === 'r') {
      yAxis = axis;
      axis.position = 'right';
    }
  }

  if (valAx) {
    let axis = {
      type: 'value'
    } as {
      type: 'value';
      // 因为可能是两种坐标，没法指定
      position?: any;
    };

    if (valAx.axPos?.val === 'b') {
      xAxis = axis;
    }

    if (valAx.axPos?.val === 't') {
      xAxis = axis;
      axis.position = 'top';
    }

    if (valAx.axPos?.val === 'l') {
      yAxis = axis;
    }

    if (valAx.axPos?.val === 'r') {
      yAxis = axis;
      axis.position = 'right';
    }
  }

  return {
    xAxis,
    yAxis
  };
}
