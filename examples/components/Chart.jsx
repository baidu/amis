export default {
  title: '图表示例',
  body: [
    {
      type: 'grid',
      columns: [
        {
          type: 'panel',
          title: '本地配置示例 支持交互',
          name: 'chart-local',
          body: [
            {
              type: 'chart',
              config: {
                title: {
                  text: '极坐标双数值轴'
                },
                legend: {
                  data: ['line']
                },
                polar: {
                  center: ['50%', '54%']
                },
                tooltip: {
                  trigger: 'axis',
                  axisPointer: {
                    type: 'cross'
                  }
                },
                angleAxis: {
                  type: 'value',
                  startAngle: 0
                },
                radiusAxis: {
                  min: 0
                },
                series: [
                  {
                    coordinateSystem: 'polar',
                    name: 'line',
                    type: 'line',
                    showSymbol: false,
                    data: [
                      [0, 0],
                      [0.03487823687206265, 1],
                      [0.06958655048003272, 2],
                      [0.10395584540887964, 3],
                      [0.13781867790849958, 4],
                      [0.17101007166283433, 5],
                      [0.2033683215379001, 6],
                      [0.2347357813929454, 7],
                      [0.26495963211660245, 8],
                      [0.2938926261462365, 9],
                      [0.3213938048432697, 10]
                    ]
                  }
                ],
                animationDuration: 2000
              },
              clickAction: {
                actionType: 'dialog',
                dialog: {
                  title: '详情',
                  body: [
                    {
                      type: 'tpl',
                      tpl: '<span>当前选中值 ${value|json}<span>'
                    },

                    {
                      type: 'chart',
                      api: '/api/mock2/chart/chart1'
                    }
                  ]
                }
              }
            }
          ]
        },
        {
          type: 'panel',
          title: '远程图表示例(返回值带function)',
          name: 'chart-remote',
          body: [
            {
              type: 'chart',
              api: '/api/mock2/chart/chart1'
            }
          ]
        }
      ]
    },
    {
      type: 'panel',
      title: 'Form+chart组合',
      body: [
        {
          type: 'form',
          title: '过滤条件',
          target: 'chart1,chart2',
          submitOnInit: true,
          className: 'm-b',
          wrapWithPanel: false,
          mode: 'inline',
          body: [
            {
              type: 'input-date',
              label: '开始日期',
              name: 'starttime',
              value: '-8days',
              maxDate: '${endtime}'
            },

            {
              type: 'input-date',
              label: '结束日期',
              name: 'endtime',
              value: '-1days',
              minDate: '${starttime}'
            },
            {
              type: 'input-text',
              label: '条件',
              name: 'name',
              addOn: {
                type: 'submit',
                label: '搜索',
                level: 'primary'
              }
            }
          ],
          actions: []
        },
        {
          type: 'divider'
        },
        {
          type: 'grid',
          className: 'm-t-lg',
          columns: [
            {
              type: 'chart',
              name: 'chart1',
              initFetch: false,
              api:
                '/api/mock2/chart/chart?name=$name&starttime=${starttime}&endtime=${endtime}'
            },
            {
              type: 'chart',
              name: 'chart2',
              initFetch: false,
              api: '/api/mock2/chart/chart2?name=$name'
            }
          ]
        }
      ]
    }
  ]
};
