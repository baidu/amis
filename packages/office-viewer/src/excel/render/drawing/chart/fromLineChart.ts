import {CT_AreaChart, CT_LineChart} from '../../../../openxml/ChartTypes';
import {Workbook} from '../../../Workbook';
import {calcPercentStacked} from './calcPercentStacked';
import {getStack} from './getStack';
import {getData} from './getData';
import {buildLabel} from './buildLabel';
import type {SeriesOption} from 'echarts';

export function fromLineChart(workbook: Workbook, lineChart: CT_LineChart) {
  const categories: string[] = [];
  const series: SeriesOption[] = [];
  const ser = lineChart.ser || [];
  let isPercentStacked = false;
  for (const lineSeries of ser) {
    const seriesData = getData(workbook, lineSeries.val);
    let name = lineSeries.tx?.strRef?.strCache?.pt?.[0]?.v || '';
    if (name) {
      categories.push(name);
    }
    const label = buildLabel(lineSeries.dLbls);
    let stack = getStack(lineChart.grouping);
    isPercentStacked = stack.isPercentStacked;
    series.push({
      name,
      type: 'line',
      stack: stack.stack,
      data: seriesData,
      label
    });
  }

  if (isPercentStacked) {
    calcPercentStacked(series);
  }

  return {
    categories,
    series
  };
}
