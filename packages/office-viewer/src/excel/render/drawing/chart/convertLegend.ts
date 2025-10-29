import {CT_Legend} from '../../../../openxml/ChartTypes';
import type {EChartsOption, LegendComponentOption} from 'echarts';

/**
 * 将 Excel chart 的图例转换为 Echarts 的图例
 */
export function convertLegend(categories: string[], chartLegend?: CT_Legend) {
  let legend = {
    data: categories
  } as LegendComponentOption;

  if (chartLegend) {
    const legendPos = chartLegend.legendPos?.val;
    if (legendPos === 'b') {
      legend.orient = 'horizontal';
      legend.bottom = 0;
    }
    if (legendPos === 'r') {
      legend.orient = 'vertical';
      legend.right = 0;
      legend.top = 'center';
    }
    if (legendPos === 't') {
      legend.orient = 'horizontal';
      legend.top = 0;
    }
    if (legendPos === 'l') {
      legend.orient = 'vertical';
      legend.left = 0;
      legend.top = 'center';
    }
    if (legendPos === 'tr') {
      legend.orient = 'horizontal';
      legend.top = 0;
      legend.right = 0;
    }
  }

  return legend;
}
