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
              api: '/api/mock2/chart/chart?name=$name&starttime=${starttime}&endtime=${endtime}'
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
    },
    {
      type: 'chart',
      mapURL: '/api/map/HK',
      mapName: 'HK',
      height: 600,
      config: {
        title: {
          text: 'Population Density of Hong Kong （2011）',
          subtext: 'Data from Wikipedia'
        },
        tooltip: {
          trigger: 'item',
          formatter: '{b}<br/>{c} (p / km2)'
        },
        toolbox: {
          show: true,
          orient: 'vertical',
          left: 'right',
          top: 'center',
          feature: {
            dataView: {readOnly: false},
            restore: {},
            saveAsImage: {}
          }
        },
        visualMap: {
          min: 800,
          max: 50000,
          text: ['High', 'Low'],
          realtime: false,
          calculable: true,
          inRange: {
            color: ['lightskyblue', 'yellow', 'orangered']
          }
        },
        series: [
          {
            name: '香港18区人口密度',
            type: 'map',
            map: 'HK',
            label: {
              show: true
            },
            data: [
              {name: '中西区', value: 20057.34},
              {name: '湾仔', value: 15477.48},
              {name: '东区', value: 31686.1},
              {name: '南区', value: 6992.6},
              {name: '油尖旺', value: 44045.49},
              {name: '深水埗', value: 40689.64},
              {name: '九龙城', value: 37659.78},
              {name: '黄大仙', value: 45180.97},
              {name: '观塘', value: 55204.26},
              {name: '葵青', value: 21900.9},
              {name: '荃湾', value: 4918.26},
              {name: '屯门', value: 5881.84},
              {name: '元朗', value: 4178.01},
              {name: '北区', value: 2227.92},
              {name: '大埔', value: 2180.98},
              {name: '沙田', value: 9172.94},
              {name: '西贡', value: 3368},
              {name: '离岛', value: 806.98}
            ],
            // 自定义名称映射
            nameMap: {
              'Central and Western': '中西区',
              'Eastern': '东区',
              'Islands': '离岛',
              'Kowloon City': '九龙城',
              'Kwai Tsing': '葵青',
              'Kwun Tong': '观塘',
              'North': '北区',
              'Sai Kung': '西贡',
              'Sha Tin': '沙田',
              'Sham Shui Po': '深水埗',
              'Southern': '南区',
              'Tai Po': '大埔',
              'Tsuen Wan': '荃湾',
              'Tuen Mun': '屯门',
              'Wan Chai': '湾仔',
              'Wong Tai Sin': '黄大仙',
              'Yau Tsim Mong': '油尖旺',
              'Yuen Long': '元朗'
            }
          }
        ]
      }
    },
    {
      type: 'chart',
      loadBaiduMap: true,
      ak: 'LiZT5dVbGTsPI91tFGcOlSpe5FDehpf7',
      config: {
        bmap: {
          center: [116.414, 39.915],
          zoom: 14,
          roam: true
        }
      }
    }
  ]
};
