export default {
  type: 'page',
  title: 'chart组件事件',
  body: [
    {
      type: 'button',
      label: '显示提示框',
      onEvent: {
        click: {
          actions: [
            {
              componentId: 'chart01',
              actionType: 'showTip',
              args: {
                type: 'showTip',
                seriesIndex: 0,
                name: '',
                dataIndex: 8
              }
            }
          ]
        }
      }
    },
    {
      type: 'chart',
      id: 'chart01',
      onEvent: {
        click: {
          actions: [
            {
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
          ]
        }
      },
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
      }
    }
  ]
};
