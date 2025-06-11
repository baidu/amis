import {
  EditorNodeType,
  getSchemaTpl,
  tipedLabel,
  registerEditorPlugin,
  BasePlugin,
  BaseEventContext,
  RendererPluginAction,
  RendererPluginEvent
} from 'amis-editor-core';
import {
  getEventControlConfig,
  getActionCommonProps
} from '../../renderer/event-control/helper';
import {inputStateTpl} from '../../renderer/style-control/helper';
import {ValidatorTag} from '../../validator';

export class LocationControlPlugin extends BasePlugin {
  static id = 'LocationControlPlugin';
  // 关联渲染器名字
  rendererName = 'location-picker';
  $schema = '/schemas/LocationControlSchema.json';

  // 组件名称
  name = '地理位置选择';
  isBaseComponent = true;
  notRenderFormZone = true;
  icon = 'fa fa-location-arrow';
  pluginIcon = 'location-picker-plugin';
  description = '地理位置选择';
  docLink = '/amis/zh-CN/components/form/location-picker';
  tags = ['表单项'];
  scaffold = {
    type: 'location-picker',
    name: 'location',
    label: '位置选择'
  };

  previewSchema: any = {
    type: 'form',
    className: 'text-left',
    mode: 'horizontal',
    wrapWithPanel: false,
    body: [
      {
        ...this.scaffold
      }
    ]
  };

  panelTitle = '地理位置选择';

  // 事件定义
  events: RendererPluginEvent[] = [
    {
      eventName: 'change',
      eventLabel: '值变化',
      description: '选中值变化时触发',
      dataSchema: [
        {
          type: 'object',
          properties: {
            data: {
              type: 'object',
              title: '数据',
              properties: {
                value: {
                  type: 'object',
                  title: '选中的值',
                  properties: {
                    address: {
                      type: 'string',
                      title: '地址'
                    },
                    lng: {
                      type: 'number',
                      title: '经度'
                    },
                    lat: {
                      type: 'number',
                      title: '纬度'
                    },
                    vendor: {
                      type: 'string',
                      title: '厂商'
                    }
                  }
                }
              }
            }
          }
        }
      ]
    }
  ];

  // 动作定义
  actions: RendererPluginAction[] = [
    {
      actionType: 'clear',
      actionLabel: '清空',
      description: '清除选中值',
      ...getActionCommonProps('clear')
    },
    {
      actionType: 'reset',
      actionLabel: '重置',
      description: '将值重置为初始值',
      ...getActionCommonProps('reset')
    },
    {
      actionType: 'setValue',
      actionLabel: '赋值',
      description: '触发组件数据更新',
      ...getActionCommonProps('setValue')
    }
  ];

  panelJustify = true;

  panelBodyCreator = (context: BaseEventContext) => {
    const renderer: any = context.info.renderer;
    return getSchemaTpl('tabs', [
      {
        title: '属性',
        body: [
          getSchemaTpl('collapseGroup', [
            {
              title: '基本',
              body: [
                getSchemaTpl('layout:originPosition', {value: 'left-top'}),
                getSchemaTpl('formItemName', {
                  required: true
                }),
                getSchemaTpl('label'),
                /* 备注: 暂时不开放
                getSchemaTpl('valueFormula', {
                  rendererSchema: context?.schema,
                }),
                */
                getSchemaTpl('formulaControl', {
                  name: 'ak',
                  label: '百度地图的 AK',
                  required: true,
                  validationErrors: {
                    isRequired:
                      'AK不能为空，请访问http://lbsyun.baidu.com/获取密钥(AK)'
                  },
                  description:
                    '请从<a href="http://lbsyun.baidu.com/" target="_blank" class="text-sm">百度地图开放平台</a>获取'
                }),
                {
                  type: 'select',
                  name: 'coordinatesType',
                  label: '坐标格式',
                  value: 'bd09',
                  options: [
                    {label: '百度坐标', value: 'bd09'},
                    {label: '国测局坐标', value: 'gcj02'}
                  ]
                },
                getSchemaTpl('formulaControl', {
                  name: 'value',
                  label: tipedLabel(
                    '默认值',
                    `传入参数格式应满足如下要求：<br/>
                    <pre>${JSON.stringify(
                      {
                        address: 'string',
                        lat: 'number',
                        lng: 'number',
                        vendor: 'baidu|gaode'
                      },
                      null,
                      2
                    )}</pre>`
                  ),
                  size: 'lg',
                  mode: 'horizontal',
                  // required: true, // 默认值不建议必填
                  placeholder: '请输入变量值'
                }),
                getSchemaTpl('switch', {
                  name: 'autoSelectCurrentLoc',
                  label: tipedLabel(
                    '自动选择',
                    '开启后，自动选中用户当前的地理位置'
                  )
                }),
                getSchemaTpl('switch', {
                  name: 'onlySelectCurrentLoc',
                  label: tipedLabel(
                    '限制模式',
                    '开启后，限制只能使用当前地理位置，不可选择其他地理位置'
                  )
                }),
                getSchemaTpl('clearable'),
                getSchemaTpl('labelRemark'),
                getSchemaTpl('remark'),
                getSchemaTpl('placeholder', {
                  visibleOn: '${!onlySelectCurrentLoc}'
                }),
                getSchemaTpl('placeholder', {
                  name: 'getLocationPlaceholder',
                  visibleOn: '${onlySelectCurrentLoc}'
                }),
                getSchemaTpl('description')
              ]
            },
            getSchemaTpl('status', {
              isFormItem: true,
              readonly: false
            }),
            getSchemaTpl('validation', {tag: ValidatorTag.File})
          ])
        ]
      },
      {
        title: '外观',
        body: [
          getSchemaTpl('collapseGroup', [
            getSchemaTpl('theme:formItem'),
            getSchemaTpl('theme:form-label'),
            getSchemaTpl('theme:classNames', {
              schema: [
                {
                  type: 'theme-classname',
                  label: '控件',
                  name: 'inputClassName'
                },
                {
                  type: 'theme-classname',
                  label: '表单项',
                  name: 'className'
                },
                {
                  type: 'theme-classname',
                  label: '静态表单项',
                  name: 'staticClassName'
                }
              ]
            }),
            getSchemaTpl('theme:cssCode', {
              themeClass: [
                {
                  name: '输入框',
                  value: '',
                  className: 'inputControlClassName',
                  state: ['default', 'hover', 'active']
                },
                {
                  name: 'addOn',
                  value: 'addOn',
                  className: 'addOnClassName'
                }
              ],
              isFormItem: true
            })
          ])
        ]
      },
      {
        title: '事件',
        className: 'p-none',
        body: [
          getSchemaTpl('eventControl', {
            name: 'onEvent',
            ...getEventControlConfig(this.manager, context)
          })
        ]
      }
    ]);
  };

  buildDataSchemas(node: EditorNodeType, region: EditorNodeType) {
    return {
      type: 'object',
      title: node.schema?.label || node.schema?.name,
      properties: {
        address: {
          type: 'string',
          title: '地址'
        },
        lng: {
          type: 'number',
          title: '经度'
        },
        lat: {
          type: 'number',
          title: '纬度'
        },
        vendor: {
          type: 'string',
          title: '地图厂商'
        }
      },
      originalValue: node.schema?.value // 记录原始值，循环引用检测需要
    };
  }
}

registerEditorPlugin(LocationControlPlugin);
