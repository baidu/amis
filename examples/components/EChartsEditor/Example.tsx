/**
 * @file 初始例子
 */

export default {
  title: {
    text: '未来一周气温变化',
    subtext: '纯属虚构'
  },
  tooltip: {
    trigger: 'axis'
  },
  legend: {
    data: ['最高气温', '最低气温']
  },
  toolbox: {
    show: true,
    feature: {
      mark: {
        show: true
      },
      dataView: {
        show: true,
        readOnly: true
      },
      magicType: {
        show: false,
        type: ['line', 'bar']
      },
      restore: {
        show: true
      },
      saveAsImage: {
        show: true
      }
    }
  },
  calculable: true,
  xAxis: [
    {
      type: 'category',
      boundaryGap: false,
      data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
    }
  ],
  yAxis: [
    {
      type: 'value',
      name: '°C'
    }
  ],
  series: [
    {
      name: '最高气温',
      type: 'line',
      data: [11, 11, 15, 13, 12, 13, 10]
    },
    {
      name: '最低气温',
      type: 'line',
      data: [1, -2, 2, 5, 3, 2, 0]
    }
  ]
};
