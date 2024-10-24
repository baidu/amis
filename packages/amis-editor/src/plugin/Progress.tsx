import {
  registerEditorPlugin,
  RendererPluginAction,
  BaseEventContext,
  BasePlugin,
  defaultValue,
  getSchemaTpl,
  tipedLabel
} from 'amis-editor-core';
import {getActionCommonProps} from '../renderer/event-control/helper';

export class ProgressPlugin extends BasePlugin {
  static id = 'ProgressPlugin';
  static scene = ['layout'];
  // 关联渲染器名字
  rendererName = 'progress';
  $schema = '/schemas/ProgressSchema.json';

  // 组件名称
  name = '进度展示';
  searchKeywords = '进度条、progress';
  isBaseComponent = true;
  description = '用来展示进度。可配置各个进度段用不同的颜色展示。';
  docLink = '/amis/zh-CN/components/progress';
  tags = ['展示'];
  icon = 'fa fa-angle-double-right';
  pluginIcon = 'progress-plugin';
  scaffold = {
    type: 'progress',
    mode: 'line',
    value: 66,
    strokeWidth: 6,
    valueTpl: '${value}%'
  };
  previewSchema = {
    ...this.scaffold
  };

  // 动作定义
  actions: RendererPluginAction[] = [
    {
      actionType: 'reset',
      actionLabel: '重置',
      description: '重置为默认值',
      ...getActionCommonProps('reset')
    },
    {
      actionType: 'setValue',
      actionLabel: '赋值',
      description: '触发组件数据更新',
      ...getActionCommonProps('setValue')
    }
  ];

  panelTitle = '进度';

  panelJustify = true;

  panelBodyCreator = (context: BaseEventContext) => {
    const isFormItem = !!context?.info.renderer.isFormItem;
    return getSchemaTpl('tabs', [
      {
        title: '属性',
        body: getSchemaTpl('collapseGroup', [
          {
            title: '基本',
            body: [
              getSchemaTpl('layout:originPosition', {value: 'left-top'}),
              {
                label: '类型',
                name: 'mode',
                type: 'select',
                option: '继承',
                pipeIn: defaultValue('line'),
                tiled: true,
                options: [
                  {
                    label: '线形',
                    value: 'line'
                  },

                  {
                    label: '圆形',
                    value: 'circle'
                  },

                  {
                    label: '仪表盘',
                    value: 'dashboard'
                  }
                ],
                onChange: (
                  value: any,
                  oldValue: boolean,
                  model: any,
                  form: any
                ) => {
                  if (value === 'circle') {
                    form.setValueByName('gapDegree', 0);
                    form.setValueByName('gapPosition', '');
                  } else if (value === 'dashboard') {
                    form.setValueByName('gapDegree', 75);
                    form.setValueByName('gapPosition', 'bottom');
                  }
                }
              },
              getSchemaTpl('valueFormula', {
                rendererSchema: {
                  ...context?.schema,
                  type: 'input-number'
                },
                needDeleteProps: ['placeholder'],
                valueType: 'number' // 期望数值类型，不过 amis中会尝试字符串 trans 数值类型
              }),

              getSchemaTpl('switch', {
                name: 'showLabel',
                label: '进度值',
                pipeIn: defaultValue(true)
              }),

              getSchemaTpl('placeholder', {
                value: '-',
                placeholder: '无数据空位提示',
                label: tipedLabel('占位提示', '数据字段未定义时的值，不包括0')
              })
            ]
          },
          getSchemaTpl('status', {isFormItem})
        ])
      },
      {
        title: '外观',
        body: getSchemaTpl('collapseGroup', [
          {
            title: '基本',
            body: [
              {
                type: 'select',
                name: 'progressClassName',
                label: '尺寸',
                value: '',
                options: [
                  {
                    label: '极小',
                    value: 'w-xs'
                  },

                  {
                    label: '小',
                    value: 'w-sm'
                  },

                  {
                    label: '中',
                    value: 'w-md'
                  },

                  {
                    label: '大',
                    value: 'w-lg'
                  },

                  {
                    label: '默认',
                    value: ''
                  }
                ]
              },
              {
                type: 'input-number',
                name: 'strokeWidth',
                label: '线条宽度',
                value: 6,
                min: 0,
                max: 100
              },
              {
                type: 'input-number',
                name: 'gapDegree',
                visibleOn: 'this.mode === "dashboard"',
                label: '缺口角度',
                value: 75,
                min: 0,
                max: 295
              },
              {
                label: '缺口位置',
                name: 'gapPosition',
                type: 'button-group-select',
                visibleOn: 'this.mode === "dashboard"',
                value: defaultValue('bottom'),
                tiled: true,
                options: [
                  {
                    label: '上',
                    value: 'top'
                  },

                  {
                    label: '下',
                    value: 'bottom'
                  },

                  {
                    label: '左',
                    value: 'left'
                  },
                  {
                    label: '右',
                    value: 'right'
                  }
                ]
              },
              getSchemaTpl('switch', {
                name: 'animate',
                label: '显示动画',
                visibleOn: 'this.mode === "line"'
              }),
              {
                type: 'button-group-select',
                name: 'styleType',
                label: '样式',
                visibleOn: 'this.mode === "line"',
                options: [
                  {
                    label: '纯色',
                    value: 'purity'
                  },
                  {
                    label: '条纹',
                    value: 'stripe'
                  }
                ],
                pipeIn: (value: any, form: any) => {
                  return form.data?.stripe ? 'stripe' : 'purity';
                },
                onChange(value: any, oldValue: boolean, model: any, form: any) {
                  form.setValueByName('stripe', value === 'stripe');
                }
              },
              getSchemaTpl('combo-container', {
                name: 'map',
                type: 'combo',
                mode: 'normal',
                multiple: true,
                label: tipedLabel(
                  '颜色',
                  '分配不同的值段，用不同的颜色提示用户。若只配置一个颜色不配置value，默认value为100'
                ),
                items: [
                  {
                    placeholder: 'color',
                    type: 'input-color',
                    name: 'color'
                  },
                  {
                    type: 'input-number',
                    name: 'value',
                    placeholder: 'value',
                    columnClassName: 'w-xs',
                    unique: true,
                    requiredOn: 'this.map?.length > 1',
                    min: 0,
                    step: 10,
                    precision: 0
                  }
                ],
                value: [
                  {color: '#dc3545', value: 20},
                  {color: '#fad733', value: 60},
                  {color: '#28a745', value: 100}
                ],
                pipeIn: (mapItem: any) => {
                  // schema传入
                  if (Array.isArray(mapItem) && mapItem.length) {
                    return typeof mapItem[0] === 'string'
                      ? mapItem.map((item: string, index: number) => {
                          const span = 100 / mapItem.length;
                          return {value: (index + 1) * span, color: item};
                        })
                      : mapItem.length === 1 && !mapItem[0].value
                      ? [{color: mapItem[0].color, value: 100}]
                      : mapItem;
                  } else {
                    return mapItem ? [mapItem] : [];
                  }
                },

                pipeOut: (mapItem: any, origin: any, data: any) => {
                  // 传入schema
                  if (mapItem.length === 1 && !mapItem[0].value) {
                    // 只有一个颜色且value未设置时默认为100
                    return [{color: mapItem[0].color, value: 100}];
                  } else {
                    return mapItem;
                  }
                }
              })
            ]
          },
          getSchemaTpl('style:classNames', {
            schema: [],
            isFormItem
          })
        ])
      }
    ]);
  };
}

registerEditorPlugin(ProgressPlugin);
