export default {
  type: 'page',
  data: {
    lineData: {
      line: [65, 63, 10, 73, 42, 21]
    }
  },
  body: [
    {
      type: 'alert',
      body: '直接更新图表的数据等于更新图表所依赖数据域中的变量，例如下面的例子，`setValue`等于更新绑定的变量`${line}`。',
      level: 'info',
      className: 'mb-1'
    },
    {
      type: 'button',
      label: '更新',
      level: 'primary',
      className: 'mb-2',
      onEvent: {
        click: {
          actions: [
            {
              actionType: 'setValue',
              componentId: 'chart_setvalue',
              args: {
                value: '${lineData}'
              }
            }
          ]
        }
      }
    },
    {
      type: 'chart',
      id: 'chart_setvalue',
      api: 'https://3xsw4ap8wah59.cfc-execute.bj.baidubce.com/api/amis-mock/mock2/chart/chartData',
      config: {
        xAxis: {
          type: 'category',
          data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
        },
        yAxis: {
          type: 'value'
        },
        series: [
          {
            data: '${line}',
            type: 'line'
          }
        ]
      }
    }
  ]
};
