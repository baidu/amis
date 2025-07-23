import {
  BasePlugin,
  BaseEventContext,
  RendererPluginAction,
  RendererPluginEvent,
  registerEditorPlugin,
  EditorManager,
  EditorNodeType,
  defaultValue,
  getSchemaTpl
} from 'amis-editor-core';
import cloneDeep from 'lodash/cloneDeep';
import type {Schema} from 'amis';
import {ValidatorTag} from '../../validator';
import {
  getEventControlConfig,
  getActionCommonProps
} from '../../renderer/event-control/helper';

export class CityControlPlugin extends BasePlugin {
  static id = 'CityControlPlugin';
  static scene = ['layout'];
  // 关联渲染器名字
  rendererName = 'input-city';
  $schema = '/schemas/CityControlSchema.json';

  // 组件名称
  name = '城市选择';
  isBaseComponent = true;
  icon = 'fa fa-building-o';
  pluginIcon = 'input-city-plugin';
  description = '可配置是否选择区域或者城市';
  searchKeywords = '城市选择器';
  docLink = '/amis/zh-CN/components/form/input-city';
  tags = ['表单项'];
  scaffold = {
    type: 'input-city',
    label: '城市选择',
    name: 'city',
    allowCity: true,
    allowDistrict: true,
    extractValue: true
  };
  previewSchema: any = {
    type: 'form',
    className: 'text-left',
    wrapWithPanel: false,
    mode: 'horizontal',
    body: [
      {
        ...this.scaffold
      }
    ]
  };

  notRenderFormZone = true;

  panelTitle = '城市选择';

  // 事件定义
  events: RendererPluginEvent[] = [
    {
      eventName: 'change',
      eventLabel: '值变化',
      description: '选中值变化',
      dataSchema: (manager: EditorManager) => {
        const node = manager.store.getNodeById(manager.store.activeId);
        const schemas = manager.dataSchema.current.schemas;
        const dataSchema = schemas.find(
          item => item.properties?.[node!.schema.name]
        );

        return [
          {
            type: 'object',
            properties: {
              data: {
                type: 'object',
                title: '数据',
                properties: {
                  value: {
                    type: 'string',
                    ...((dataSchema?.properties?.[node!.schema.name] as any) ??
                      {}),
                    title: '当前城市'
                  }
                }
              }
            }
          }
        ];
      }
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

  panelJustify = true;
  panelBodyCreator = (context: BaseEventContext) => {
    return getSchemaTpl('tabs', [
      {
        title: '属性',
        body: getSchemaTpl('collapseGroup', [
          {
            title: '基本',
            body: [
              getSchemaTpl('layout:originPosition', {value: 'left-top'}),
              getSchemaTpl('formItemName', {
                required: true
              }),
              getSchemaTpl('label'),
              getSchemaTpl('valueFormula', {
                rendererSchema: (schema: Schema) => schema,
                rendererWrapper: true,
                mode: 'vertical' // 改成上下展示模式
              }),
              {
                name: 'extractValue',
                label: '值格式',
                type: 'button-group-select',
                size: 'sm',
                options: [
                  {label: '行政编码', value: true},
                  {label: '对象结构', value: false}
                ]
              },

              getSchemaTpl('switch', {
                name: 'allowCity',
                label: '可选城市',
                pipeIn: defaultValue(true),
                onChange: (
                  value: string,
                  oldValue: string,
                  item: any,
                  form: any
                ) => {
                  if (!value) {
                    const schema = cloneDeep(form.data);
                    form.setValueByName('allowDistrict', undefined);
                    form.setValueByName('value', schema.extractValue ? '' : {});
                  }
                }
              }),

              getSchemaTpl('switch', {
                name: 'allowDistrict',
                label: '可选区域',
                visibleOn: 'this.allowCity',
                pipeIn: defaultValue(true),
                onChange: (
                  value: string,
                  oldValue: string,
                  item: any,
                  form: any
                ) => {
                  if (!value) {
                    const schema = cloneDeep(form.data);
                    form.setValueByName('value', schema.extractValue ? '' : {});
                  }
                }
              }),

              getSchemaTpl('switch', {
                name: 'searchable',
                label: '可搜索',
                pipeIn: defaultValue(false)
              }),

              getSchemaTpl('labelRemark'),
              getSchemaTpl('remark'),
              getSchemaTpl('description')
            ]
          },
          getSchemaTpl('status', {isFormItem: true}),
          getSchemaTpl('validation', {tag: ValidatorTag.MultiSelect})
        ])
      },
      {
        title: '外观',
        body: [
          getSchemaTpl('collapseGroup', [
            getSchemaTpl('theme:formItem'),
            getSchemaTpl('style:classNames')
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
    let dataSchema: any = {
      type: 'string',
      title: node.schema?.label || node.schema?.name,
      originalValue: node.schema?.value // 记录原始值，循环引用检测需要
    };

    if (node.schema?.extractValue === false) {
      dataSchema = {
        ...dataSchema,
        type: 'object',
        title: node.schema?.label || node.schema?.name,
        properties: {
          code: {
            type: 'number',
            title: '编码'
          },
          provinceCode: {
            type: 'number',
            title: '省份编码'
          },
          province: {
            type: 'string',
            title: '省份'
          },
          cityCode: {
            type: 'number',
            title: '城市编码'
          },
          city: {
            type: 'string',
            title: '城市'
          },
          districtCode: {
            type: 'number',
            title: '区域编码'
          },
          district: {
            type: 'string',
            title: '区域'
          },
          street: {
            type: 'string',
            title: '街道'
          }
        }
      };
    }

    return dataSchema;
  }
}

registerEditorPlugin(CityControlPlugin);
