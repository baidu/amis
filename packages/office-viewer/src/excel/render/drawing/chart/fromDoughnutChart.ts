import {CT_DoughnutChart} from '../../../../openxml/ChartTypes';
import {Workbook} from '../../../Workbook';
import {getData} from './getData';
import {buildLabel} from './buildLabel';
import type {SeriesOption} from 'echarts';

export function fromDoughnutChart(
  workbook: Workbook,
  doughnutChart: CT_DoughnutChart
) {
  const categories: string[] = [];
  const series: SeriesOption[] = [];
  const chartSer = doughnutChart.ser || [];

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
      type: 'pie',
      radius: ['40%', '70%'],
      emphasis: {
        label: {
          show: true,
          fontSize: 40,
          fontWeight: 'bold'
        }
      }
    });
  }

  return {
    categories,
    series
  };
}
