/**
 * @file 基于 amis 实现 ECharts 图表可视化编辑
 */

import {createHierarchy} from './Echarts/Common';
import example from './Echarts/Example';
import title from './Echarts/Title';
import legend from './Echarts/Legend';

export default {
  title: 'ECharts 编辑器',
  data: {
    config: example
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
                        controls: [title]
                      },
                      {
                        title: '图例',
                        controls: [legend]
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
