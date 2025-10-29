import {CT_PieChart} from '../../../../openxml/ChartTypes';
import {Workbook} from '../../../Workbook';
import {getData} from './getData';
import {buildLabel} from './buildLabel';
import type {SeriesOption} from 'echarts';

export function fromPieChart(workbook: Workbook, pieChart: CT_PieChart) {
  const categories: string[] = [];
  const series: SeriesOption[] = [];
  const chartSer = pieChart.ser || [];

  for (const ser of chartSer) {
    const seriesData = getData(workbook, ser.val);
    let name = ser.tx?.strRef?.strCache?.pt?.[0]?.v || '';
    if (name) {
      categories.push(name);
    }
    const label = buildLabel(ser.dLbls);
    series.push({
      name,
      data: seriesData as number[],
      type: 'pie'
    });
  }

  return {
    categories,
    series
  };
}
