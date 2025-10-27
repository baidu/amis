import {CT_BarChart} from '../../../../openxml/ChartTypes';
import {Workbook} from '../../../Workbook';
import {getStack} from './getStack';
import {calcPercentStacked} from './calcPercentStacked';
import {getData} from './getData';
import type {SeriesOption} from 'echarts';

export function fromBarChart(workbook: Workbook, barChart: CT_BarChart) {
  const categories: string[] = [];
  const series: SeriesOption[] = [];
  const barSer = barChart.ser || [];
  let isPercentStacked = false;
  for (const barSeries of barSer) {
    const seriesData = getData(workbook, barSeries.val);
    let name = barSeries.tx?.strRef?.strCache?.pt?.[0]?.v || '';
    if (name) {
      categories.push(name);
    }
    let stack = getStack(barChart.grouping);
    isPercentStacked = stack.isPercentStacked;
    series.push({
      name,
      type: 'bar',
      stack: stack.stack,
      data: seriesData as number[]
    });
  }

  if (isPercentStacked) {
    calcPercentStacked(series);
  }

  return {categories, series};
}
