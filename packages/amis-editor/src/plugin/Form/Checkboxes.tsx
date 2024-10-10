import {
  defaultValue,
  setSchemaTpl,
  getSchemaTpl,
  valuePipeOut,
  EditorNodeType,
  EditorManager,
  undefinedPipeOut
} from 'amis-editor-core';
import {registerEditorPlugin} from 'amis-editor-core';
import {
  BasePlugin,
  BasicSubRenderInfo,
  RendererEventContext,
  SubRendererInfo,
  BaseEventContext
} from 'amis-editor-core';
import {ValidatorTag} from '../../validator';

import type {Schema} from 'amis';
import {RendererPluginAction, RendererPluginEvent} from 'amis-editor-core';
import {getEventControlConfig} from '../../renderer/event-control/helper';
import {
  OPTION_EDIT_EVENTS,
  resolveOptionEventDataSchame,
  resolveOptionType
} from '../../util';

export class CheckboxesControlPlugin extends BasePlugin {
  static id = 'CheckboxesControlPlugin';
  // 关联渲染器名字
  rendererName = 'checkboxes';
  $schema = '/schemas/CheckboxesControlSchema.json';

  // 组件名称
  name = '复选框';
  isBaseComponent = true;
  icon = 'fa fa-check-square';
  pluginIcon = 'checkboxes-plugin';
  description =
    '通过<code>options</code>配置多个勾选框，也可以通过<code>source</code>拉取选项';
  docLink = '/amis/zh-CN/components/form/checkboxes';
  tags = ['表单项'];
  scaffold = {
    type: 'checkboxes',
    label: '复选框',
    name: 'checkboxes',
    multiple: true,
    options: [
      {
        label: '选项A',
        value: 'A'
      },

      {
        label: '选项B',
        value: 'B'
      }
    ]
  };
  previewSchema: any = {
    type: 'form',
    className: 'text-left',
    mode: 'horizontal',
    wrapWithPanel: false,
    body: [
      {
        value: 'A',
        ...this.scaffold
      }
    ]
  };

  notRenderFormZone = true;

  panelTitle = '复选框';

  // 事件定义
  events: RendererPluginEvent[] = [
    {
      eventName: 'change',
      eventLabel: '值变化',
      description: '选中值变化时触发',
      dataSchema: (manager: EditorManager) => {
        const {value} = resolveOptionEventDataSchame(manager, true);

        return [
          {
            type: 'object',
            properties: {
              data: {
                type: 'object',
                title: '数据',
                properties: {
                  value
                }
              }
            }
          }
        ];
      }
    },
    ...OPTION_EDIT_EVENTS
  ];

  // 动作定义
  actions: RendererPluginAction[] = [
    {
      actionType: 'clear',
      actionLabel: '清空',
      description: '清除选中值'
    },
    {
      actionType: 'reset',
      actionLabel: '重置',
      description: '将值重置为初始值'
    },
    {
      actionType: 'reload',
      actionLabel: '重新加载',
      description: '触发组件数据刷新并重新渲染'
    },
    {
      actionType: 'setValue',
      actionLabel: '赋值',
      description: '触发组件数据更新'
    }
  ];
  panelJustify = true;
  panelBodyCreator = (context: BaseEventContext) => {
    const renderer: any = context.info.renderer;

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
              [
                getSchemaTpl('switch', {
                  label: '可全选',
                  name: 'checkAll',
                  value: false,
                  visibleOn: 'this.multiple',
                  onChange: (value: any, origin: any, item: any, form: any) => {
                    if (!value) {
                      // 可全选关闭时，默认全选也需联动关闭
                      form.setValueByName('defaultCheckAll', false);
                      form.setValueByName('checkAllText', undefined);
                    }
                  }
                }),
                {
                  type: 'container',
                  className: 'ae-ExtendMore mb-2',
                  visibleOn: 'this.checkAll',
                  body: [
                    getSchemaTpl('switch', {
                      label: '默认全选',
                      name: 'defaultCheckAll',
                      value: false
                    }),
                    {
                      type: 'input-text',
                      label: '全选文本',
                      name: 'checkAllText'
                    }
                  ]
                }
              ],
              getSchemaTpl('joinValues', {
                visibleOn: true
              }),
              getSchemaTpl('delimiter', {
                visibleOn: 'this.joinValues === true'
              }),
              getSchemaTpl('extractValue'),
              getSchemaTpl('labelRemark'),
              getSchemaTpl('remark'),
              getSchemaTpl('description'),
              getSchemaTpl('autoFillApi', {
                trigger: 'change'
              })
            ]
          },
          {
            title: '选项',
            body: [
              getSchemaTpl('optionControlV2', {
                multiple: true
              }),
              getSchemaTpl('valueFormula', {
                rendererSchema: (schema: Schema) => ({
                  ...schema,
                  type: 'input-text'
                }),
                pipeOut: undefinedPipeOut,
                // 默认值组件设计有些问题，自动发起了请求，接口数据作为了默认值选项，接口形式应该是设置静态值或者FX
                needDeleteProps: ['source'],
                // 当数据源是自定义静态选项时，不额外配置默认值，在选项上直接勾选即可，放开会有个bug：当去掉勾选时，默认值配置组件不清空，只是schema清空了value
                visibleOn: 'this.selectFirst !== true && this.source != null'
              }),
              // 自定义选项模板
              getSchemaTpl('optionsMenuTpl', {
                manager: this.manager
              }),
              /** 新增选项 */
              getSchemaTpl('optionAddControl', {
                manager: this.manager
              }),
              /** 编辑选项 */
              getSchemaTpl('optionEditControl', {
                manager: this.manager
              }),
              /** 删除选项 */
              getSchemaTpl('optionDeleteControl')
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
            getSchemaTpl('style:formItem', {renderer}),
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
    const type = resolveOptionType(node.schema);
    // todo:异步数据case
    let dataSchema: any = {
      type,
      title: node.schema?.label || node.schema?.name,
      originalValue: node.schema?.value // 记录原始值，循环引用检测需要
    };

    if (node.schema?.joinValues === false) {
      dataSchema = {
        ...dataSchema,
        type: 'object',
        title: node.schema?.label || node.schema?.name,
        properties: {
          [node.schema?.labelField || 'label']: {
            type: 'string',
            title: '文本'
          },
          [node.schema?.valueField || 'value']: {
            type,
            title: '值'
          }
        }
      };
    }

    if (node.schema?.multiple) {
      if (node.schema?.extractValue) {
        dataSchema = {
          type: 'array',
          title: node.schema?.label || node.schema?.name
        };
      } else if (node.schema?.joinValues === false) {
        dataSchema = {
          type: 'array',
          title: node.schema?.label || node.schema?.name,
          items: {
            type: 'object',
            title: '成员',
            properties: dataSchema.properties
          },
          originalValue: dataSchema.originalValue
        };
      }
    }

    return dataSchema;
  }
}

registerEditorPlugin(CheckboxesControlPlugin);
