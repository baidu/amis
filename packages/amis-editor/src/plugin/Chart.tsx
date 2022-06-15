import {Button} from 'amis';
import React from 'react';
import {registerEditorPlugin} from 'amis-editor-core';
import {
  BaseEventContext,
  BasePlugin,
  RegionConfig,
  RendererInfo
} from 'amis-editor-core';
import {defaultValue, getSchemaTpl} from 'amis-editor-core';
import {diff} from 'amis-editor-core';
import AMisCodeEditor from 'amis-editor-core';
import {RendererAction} from 'amis-editor-comp/dist/renderers/event-action';

const ChartConfigEditor = ({value, onChange}: any) => {
  return (
    <div className="ae-JsonEditor">
      <AMisCodeEditor value={value} onChange={onChange} />
    </div>
  );
};

export class ChartPlugin extends BasePlugin {
  // 关联渲染器名字
  rendererName = 'chart';
  $schema = '/schemas/ChartSchema.json';

  // 组件名称
  name = '图表';
  isBaseComponent = true;
  description =
    '用来渲染图表，基于 echarts 图表库，理论上 echarts 所有图表类型都支持。';
  docLink = '/amis/zh-CN/components/chart';
  tags = ['展示'];
  icon = 'fa fa-pie-chart';
  scaffold = {
    type: 'chart',
    config: {
      xAxis: {
        type: 'category',
        data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
      },
      yAxis: {
        type: 'value'
      },
      series: [
        {
          data: [820, 932, 901, 934, 1290, 1330, 1320],
          type: 'line'
        }
      ]
    },
    replaceChartOption: true
  };
  previewSchema = {
    ...this.scaffold
  };

  // 动作定义
  actions: RendererAction[] = [
    {
      actionType: 'reload',
      actionLabel: '重新加载',
      description: '触发组件数据刷新并重新渲染'
    },
    {
      actionType: 'setValue',
      actionLabel: '更新数据',
      description: '触发组件数据更新'
    }
  ];

  panelTitle = '图表';
  panelBodyCreator = (context: BaseEventContext) => {
    return [
      getSchemaTpl('tabs', [
        {
          title: '常规',
          body: [
            getSchemaTpl('api', {
              label: '接口拉取',
              description:
                '接口可以返回配置，或者数据，建议返回数据可映射到 Echarts 配置中'
            }),

            getSchemaTpl('switch', {
              label: '初始是否拉取',
              name: 'initFetch',
              visibleOn: 'data.api',
              pipeIn: defaultValue(true)
            }),

            {
              name: 'interval',
              label: '定时刷新间隔',
              type: 'input-number',
              step: 500,
              visibleOn: 'data.api',
              description: '设置后将自动定时刷新，最小3000, 单位 ms'
            },
            {
              name: 'config',
              asFormItem: true,
              component: ChartConfigEditor,
              // type: 'json-editor',
              label: 'Echarts 配置',
              description: '支持数据映射，可将接口返回的数据填充进来'
              // size: 'lg'
              // pipeOut: (value: any) => {
              //   try {
              //     return value ? JSON.parse(value) : null;
              //   } catch (e) {}
              //   return null;
              // }
            },
            {
              name: 'clickAction',
              asFormItem: true,
              children: ({onChange, value}: any) => (
                <div className="m-b">
                  <Button
                    size="sm"
                    level={value ? 'danger' : 'info'}
                    onClick={this.editDrillDown.bind(this, context.id)}
                  >
                    配置 DrillDown
                  </Button>

                  {value ? (
                    <Button
                      size="sm"
                      level="link"
                      className="m-l"
                      onClick={() => onChange('')}
                    >
                      删除 DrillDown
                    </Button>
                  ) : null}
                </div>
              )
            },
            {
              name: 'dataFilter',
              type: 'js-editor',
              allowFullscreen: true,
              label: '数据加工',
              size: 'lg',
              description: `
              如果后端没有直接返回 Echart 配置，可以自己写一段函数来包装。
              <p>签名：(config, echarts, data) => config</p>
              <p>参数说明</p>
              <ul>
              <li><code>config</code> 原始数据</li>
              <li><code>echarts</code> echarts 对象</li>
              <li><code>data</code> 如果配置了数据接口，接口返回的数据通过此变量传入</li>
              </ul>
              <p>示例</p>
              <pre>debugger; // 可以浏览器中断点调试\n\n// 查看原始数据\nconsole.log(config)\n\n// 返回新的结果 \nreturn {}</pre>
              `
            },

            getSchemaTpl('switch', {
              label: 'Chart 配置完全替换',
              name: 'replaceChartOption',
              labelRemark: {
                trigger: 'click',
                className: 'm-l-xs',
                rootClose: true,
                content:
                  '默认为追加模式，新的配置会跟旧的配置合并，如果勾选将直接完全覆盖。',
                placement: 'left'
              }
            })
          ]
        },
        {
          title: '外观',
          body: [getSchemaTpl('className')]
        },
        {
          title: '显隐',
          body: [getSchemaTpl('visible')]
        },
        {
          title: '其他',
          body: [getSchemaTpl('name')]
        }
      ])
    ];
  };

  editDrillDown(id: string) {
    const manager = this.manager;
    const store = manager.store;
    const node = store.getNodeById(id);
    const value = store.getValueOf(id);

    const dialog = (value.clickAction && value.clickAction.dialog) || {
      title: '标题',
      body: ['<p>内容 <code>${value|json}</code></p>']
    };

    node &&
      value &&
      this.manager.openSubEditor({
        title: '配置 DrillDown 详情',
        value: {
          type: 'container',
          ...dialog
        },
        slot: {
          type: 'container',
          body: '$$'
        },
        typeMutable: false,
        onChange: newValue => {
          newValue = {
            ...value,
            clickAction: {
              actionType: 'dialog',
              dialog: newValue
            }
          };
          manager.panelChangeValue(newValue, diff(value, newValue));
        }
      });
  }
}

registerEditorPlugin(ChartPlugin);
