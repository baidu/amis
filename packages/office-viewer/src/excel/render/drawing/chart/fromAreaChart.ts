import {CT_AreaChart} from '../../../../openxml/ChartTypes';
import {Workbook} from '../../../Workbook';
import {calcPercentStacked} from './calcPercentStacked';
import {getStack} from './getStack';
import {getData} from './getData';
import {buildLabel} from './buildLabel';
import type {SeriesOption} from 'echarts';

export function fromAreaChart(workbook: Workbook, areaChart: CT_AreaChart) {
  const categories: string[] = [];
  const series: SeriesOption[] = [];
  const ser = areaChart.ser || [];
  let isPercentStacked = false;
  for (const areaSeries of ser) {
    const seriesData = getData(workbook, areaSeries.val);
    let name = areaSeries.tx?.strRef?.strCache?.pt?.[0]?.v || '';
    if (name) {
      categories.push(name);
    }
    const label = buildLabel(areaSeries.dLbls);
    let stack = getStack(areaChart.grouping);
    isPercentStacked = stack.isPercentStacked;
    series.push({
      name,
      type: 'line',
      stack: stack.stack,
      data: seriesData,
      label,
      areaStyle: {}
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
