export default {
  type: 'page',
  body: [
    {
      type: 'alert',
      body: '刷新图表，使图表重新加载',
      level: 'info',
      className: 'mb-1'
    },
    {
      type: 'button',
      label: '刷新',
      level: 'primary',
      className: 'mt-2 mb-2',
      onEvent: {
        click: {
          actions: [
            {
              actionType: 'reload',
              componentId: 'chart_reload'
            }
          ]
        }
      }
    },
    {
      type: 'chart',
      id: 'chart_reload',
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
