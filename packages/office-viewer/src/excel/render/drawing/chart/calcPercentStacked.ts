import type {SeriesOption} from 'echarts';

export function calcPercentStacked(series: SeriesOption[]) {
  const totalData: number[] = [];
  for (const ser of series) {
    for (let i = 0; i < (ser.data as number[]).length; i++) {
      const value = (ser.data as number[])[i] || 0;
      totalData[i] = (totalData[i] || 0) + +value;
    }
  }
  // 计算百分比
  for (const ser of series) {
    for (let i = 0; i < (ser.data as number[]).length; i++) {
      const value = (ser.data as number[])[i] || 0;
      // 避免为零
      const totalValue = totalData[i] || 1;
      (ser.data as number[])[i] = (+value / totalValue) * 100;
    }
  }
}
