/**
 * @file 基于 amis 实现 ECharts 图表可视化编辑
 */

import {createHierarchy} from './EChartsEditor/Common';
import example from './EChartsEditor/Example';

import {lazyData} from './LazyData';
import React from 'react';
import {Spinner} from '../../src';

const LazyComponent = lazyData(
  async () =>
    (
      await Promise.all([
        import('./EChartsEditor/Title'),
        import('./EChartsEditor/Legend'),
        import('./EChartsEditor/Global'),
        import('./EChartsEditor/Axis'),
        import('./EChartsEditor/Polar'),
        import('./EChartsEditor/Tooltip'),
        import('./EChartsEditor/Toolbox'),
        import('./EChartsEditor/Series')
      ])
    ).map(item => item.default),
  ([title, legend, Global, Axis, polar, tooltip, toolbox, series]) => {
    return ({renderFormItems}: any) => {
      return renderFormItems({
        controls: [
          createHierarchy('config', [
            {
              type: 'tabs',
              mountOnEnter: true,
              // unmountOnExit: true, // 加了更慢的样子
              mode: 'vertical',
              className: 'echarts-editor',
              tabs: [
                {
                  title: '图表',
                  controls: [series]
                },
                {
                  title: '标题',
                  controls: [title]
                },
                {
                  title: '图例',
                  controls: [legend]
                },
                {
                  title: 'X 轴',
                  controls: Axis('x')
                },
                {
                  title: 'Y 轴',
                  controls: Axis('y')
                },
                {
                  title: '极标',
                  controls: [polar]
                },
                {
                  title: '提示框',
                  controls: [tooltip]
                },
                {
                  title: '工具栏',
                  controls: [toolbox]
                },
                {
                  title: '全局',
                  controls: [Global]
                }
              ]
            }
          ])
        ]
      });
    };
  }
);

export default {
  type: 'page',
  cssVars: {
    '--Form-input-paddingY': '0.25rem'
  },
  title:
    'ECharts 图表可视化编辑，用于演示如何基于 amis 将任意 json 配置改造成可视化编辑',
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
              columnClassName: 'pl-1 pr-0.5',
              controls: [
                {
                  type: 'chart',
                  source: '${config}',
                  replaceChartOption: true,
                  unMountOnHidden: false
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
            },
            {
              sm: 12,
              md: 7,
              columnClassName: 'pl-0.5 pr-1',
              controls: [
                {
                  children: (props: any) => {
                    return (
                      <React.Suspense
                        fallback={
                          <Spinner
                            overlay
                            spinnerClassName="m-t-lg"
                            size="lg"
                          />
                        }
                      >
                        <LazyComponent {...props} />
                      </React.Suspense>
                    );
                  }
                }
              ]
            }
          ]
        }
      ]
    }
  ]
};
