import type echarts from 'echarts';
import {Workbook} from '../../Workbook';
import {IChartSpace} from '../../types/IChartSpace';
import {fromBarChart} from './chart/fromBarChart';
import {fromAreaChart} from './chart/fromAreaChart';
import {convertAxis} from './chart/convertAxis';
import {convertLegend} from './chart/convertLegend';
import {convertTitle} from './chart/convertTitle';
import {fromDoughnutChart} from './chart/fromDoughnutChart';
import {fromLineChart} from './chart/fromLineChart';
import {fromPieChart} from './chart/fromPieChart';

/**
 * 将 chartSpace 配置转成 EChartOptions
 * P3365
 */
import type {EChartsOption, SeriesOption} from 'echarts';

export function convertToEChartOptions(
  workbook: Workbook,
  chartSpace: IChartSpace
): EChartsOption | null {
  const chart = chartSpace.chart;
  console.log('chart', chart);
  if (!chart) {
    return null;
  }

  const title = convertTitle(chart.title);

  const grid = {
    backgroundColor: 'white',
    show: true
  };

  const echartsOptions = {
    title,
    grid
  };

  const plotArea = chart.plotArea;

  if (!plotArea) {
    return null;
  }

  let categories: string[] = [];
  let series: SeriesOption[] = [];

  if (plotArea.lineChart) {
    const result = fromLineChart(workbook, plotArea.lineChart);
    categories = result.categories;
    series = series.concat(result.series);
  }

  if (plotArea.barChart) {
    const result = fromBarChart(workbook, plotArea.barChart);
    categories = result.categories;
    series = series.concat(result.series);
  }

  if (plotArea.areaChart) {
    const result = fromAreaChart(workbook, plotArea.areaChart);
    categories = result.categories;
    series = series.concat(result.series);
  }

  if (plotArea.pieChart) {
    const result = fromPieChart(workbook, plotArea.pieChart);
    categories = result.categories;
    series = series.concat(result.series);
  }

  if (plotArea.doughnutChart) {
    const result = fromDoughnutChart(workbook, plotArea.doughnutChart);
    categories = result.categories;
    series = series.concat(result.series);
  }

  const {xAxis, yAxis} = convertAxis(
    categories,
    plotArea.catAx,
    plotArea.valAx
  );

  const legend = convertLegend(categories, chart.legend);

  return {
    ...echartsOptions,
    legend,
    xAxis,
    yAxis,
    series
  };
}
