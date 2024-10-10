type Series = {
  data: number[];
};

export function calcPercentStacked(series: Series[]) {
  const totalData: number[] = [];
  for (const ser of series) {
    for (let i = 0; i < ser.data.length; i++) {
      const value = ser.data[i] || 0;
      totalData[i] = (totalData[i] || 0) + +value;
    }
  }
  // 计算百分比
  for (const ser of series) {
    for (let i = 0; i < ser.data.length; i++) {
      const value = ser.data[i] || 0;
      // 避免为零
      const totalValue = totalData[i] || 1;
      ser.data[i] = (+value / totalValue) * 100;
    }
  }
}
