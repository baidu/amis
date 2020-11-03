/**
 * @file 基于 amis 实现 ECharts 图表可视化编辑
 */

import {createHierarchy} from './EChartsEditor/Common';
import example from './EChartsEditor/Example';
// import title from './EChartsEditor/Title';
// import legend from './EChartsEditor/Legend';
// import Global from './EChartsEditor/Global';
// import Axis from './EChartsEditor/Axis';
// import polar from './EChartsEditor/Polar';
// import tooltip from './EChartsEditor/Tooltip';
// import toolbox from './EChartsEditor/Toolbox';
// import series from './EChartsEditor/Series';

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
              sm: 12,
              md: 5,
              controls: [
                {
                  type: 'chart',
                  source: '${config}',
                  unMountOnHidden: false
                }
              ]
            },
            {
              sm: 12,
              md: 7,
              controls: [
                createHierarchy('config', [
                  {
                    type: 'tabs',
                    mountOnEnter: true,
                    // unmountOnExit: true, // 加了更慢的样子
                    mode: 'vertical',
                    className: 'echarts-editor',
                    tabs: [
                      // {
                      //   title: '图表',
                      //   controls: [series]
                      // },
                      // {
                      //   title: '标题',
                      //   controls: [title]
                      // },
                      // {
                      //   title: '图例',
                      //   controls: [legend]
                      // },
                      // {
                      //   title: 'X 轴',
                      //   controls: Axis('x')
                      // },
                      // {
                      //   title: 'Y 轴',
                      //   controls: Axis('y')
                      // },
                      // {
                      //   title: '极标',
                      //   controls: [polar]
                      // },
                      // {
                      //   title: '提示框',
                      //   controls: [tooltip]
                      // },
                      // {
                      //   title: '工具栏',
                      //   controls: [toolbox]
                      // },
                      // {
                      //   title: '全局',
                      //   controls: [Global]
                      // }
                      // TODO: grid, radar, dataZoom, visualMap, axisPointer, brush, geo, parallel, parallelAxis, singleAxis, timeline, graphic, calendar, dataset, aria,
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
