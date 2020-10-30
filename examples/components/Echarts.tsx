/**
 * @file 基于 amis 实现 ECharts 图表可视化编辑
 */

import title from './echarts/Title';
import {createHierarchy} from './echarts/Common';
import titleStyle from './echarts/TitleStyle';
import titleTextStyle from './echarts/TitleTextStyle';
import titlePosition from './echarts/TitlePosition';

const titleControl = {
  type: 'tabs',
  tabs: [
    {
      title: '内容',
      controls: [title]
    },
    {
      title: '位置',
      controls: [titlePosition]
    },
    {
      title: '样式',
      controls: [titleStyle]
    },
    {
      title: '文字样式',
      controls: [titleTextStyle]
    }
  ]
};

export default {
  title: 'ECharts 编辑器',
  data: {
    config: {
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
    }
  },
  body: [
    {
      type: 'form',
      title: '',
      controls: [
        {
          type: 'grid',
          columns: [
            {
              md: 7,
              controls: [
                {
                  type: 'chart',
                  source: '${config}'
                }
              ]
            },
            {
              md: 5,
              controls: [
                createHierarchy('config', [
                  {
                    type: 'tabs',
                    mode: 'vertical',
                    className: 'echarts-editor',
                    tabs: [
                      // {
                      //   title: '基础',
                      //   tab: 'Content 2'
                      // },
                      {
                        title: '标题',
                        controls: [titleControl]
                      },
                      {
                        title: '视区',
                        controls: [
                          {
                            name: 'config.text',
                            type: 'text',
                            label: 'text'
                          }
                        ]
                      },
                      {
                        title: 'X 轴',
                        tab: 'Content 2'
                      },
                      {
                        title: 'Y 轴',
                        tab: 'Content 2'
                      },
                      {
                        title: '图例',
                        tab: 'Content 2'
                      },
                      {
                        title: '提示',
                        tab: 'Content 2'
                      },
                      {
                        title: '工具',
                        tab: 'Content 2'
                      },
                      {
                        title: '标题',
                        tab: 'Content 2'
                      }
                    ]
                  }
                ])
              ]
            }
          ]
        },
        {
          type: 'editor',
          name: 'config',
          language: 'json',
          disabled: true,
          options: {
            lineNumbers: 'off'
          },
          source: '${config}'
        }
      ]
    }
  ]
};
