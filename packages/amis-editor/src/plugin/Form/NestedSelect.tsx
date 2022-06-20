import {relativeValueRe} from 'amis';
import {
  RendererPluginAction,
  RendererPluginEvent
} from 'amis-editor-core';
import {availableLanguages} from 'amis/lib/renderers/Form/Editor';
import {defaultValue, getSchemaTpl, valuePipeOut} from 'amis-editor-core';
import {registerEditorPlugin} from 'amis-editor-core';
import {
  BasePlugin,
  BasicSubRenderInfo,
  RendererEventContext,
  SubRendererInfo,
  BaseEventContext
} from 'amis-editor-core';
import {tipedLabel} from '../../component/BaseControl';
import {ValidatorTag} from '../../validator';
import {getEventControlConfig} from '../../util';

export class NestedSelectControlPlugin extends BasePlugin {
  // 关联渲染器名字
  rendererName = 'nested-select';
  $schema = '/schemas/NestedSelectControlSchema.json';

  // 组件名称
  name = '级联选择框';
  isBaseComponent = true;
  icon = 'fa fa-indent';
  description = `适用于选项中含有子项，可通过<code>source</code>拉取选项，支持多选`;
  docLink = '/amis/zh-CN/components/form/nestedselect';
  tags = ['表单项'];
  scaffold = {
    type: 'nested-select',
    label: '级联选择',
    name: 'nestedSelect',
    onlyChildren: true,
    options: [
      {
        label: '选项A',
        value: 'A'
      },

      {
        label: '选项B',
        value: 'B',
        children: [
          {
            label: '选项C',
            value: 'C'
          },
          {
            label: '选项D',
            value: 'D'
          }
        ]
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
        ...this.scaffold
      }
    ]
  };

  panelTitle = '级联选择框';
  notRenderFormZone = true;
  panelDefinitions = {
    options: {
      label: '选项 Options',
      name: 'options',
      type: 'combo',
      multiple: true,
      multiLine: true,
      draggable: true,
      addButtonText: '新增选项',
      scaffold: {
        label: '',
        value: ''
      },
      items: [
        {
          type: 'group',
          body: [
            {
              type: 'input-text',
              name: 'label',
              placeholder: '名称',
              required: true
            },

            {
              type: 'input-text',
              name: 'value',
              placeholder: '值',
              unique: true
            }
          ]
        },
        {
          $ref: 'options',
          label: '子选项',
          name: 'children',
          addButtonText: '新增子选项'
        }
      ]
    }
  };
  panelJustify = true;
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
            'event.data.value': {
              type: 'string',
              title: '选中值'
            }
          }
        }
      ]
    },
    {
      eventName: 'focus',
      eventLabel: '获取焦点',
      description: '输入框获取焦点时触发',
      dataSchema: [
        {
          type: 'object',
          properties: {
            'event.data.value': {
              type: 'string',
              title: '选中值'
            }
          }
        }
      ]
    },
    {
      eventName: 'blur',
      eventLabel: '失去焦点',
      description: '输入框失去焦点时触发',
      dataSchema: [
        {
          type: 'object',
          properties: {
            'event.data.value': {
              type: 'string',
              title: '选中值'
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
      description: '清除选中值'
    },
    {
      actionType: 'reset',
      actionLabel: '重置',
      description: '将值重置为resetValue，若没有配置resetValue，则清空'
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
  panelBodyCreator = (context: BaseEventContext) => {
    const renderer: any = context.info.renderer;
    return getSchemaTpl('tabs', [
      {
        title: '属性',
        body: getSchemaTpl('collapseGroup', [
          {
            title: '基本',
            body: [
              getSchemaTpl('formItemName', {
                required: true
              }),
              getSchemaTpl('label'),
              getSchemaTpl('clearable'),
              {
                type: 'ae-Switch-More',
                name: 'searchable',
                label: '可检索',
                mode: 'normal',
                value: false,
                hiddenOnDefault: true,
                formType: 'extend',
                form: {
                  body: [
                    {
                      type: 'input-text',
                      name: 'noResultsText',
                      label: tipedLabel('空提示', '检索无结果时的文本')
                    }
                  ]
                }
              },
              getSchemaTpl('onlyLeaf'),
              [
                {
                  type: 'switch',
                  label: '可多选',
                  name: 'multiple',
                  value: false,
                  inputClassName: 'is-inline'
                },
                {
                  type: 'container',
                  className: 'ae-ExtendMore',
                  visibleOn: 'this.multiple',
                  body: [
                    {
                      type: 'switch',
                      label: tipedLabel(
                        '父级作为返回值',
                        '开启后选中父级，不会全选子级选项，并且父级作为值返回'
                      ),
                      horizontal: {
                        left: 6,
                        justify: true
                      },
                      name: 'onlyChildren',
                      inputClassName: 'is-inline',
                      visibleOn: '!this.onlyLeaf',
                      pipeIn: (value: any) => !value,
                      pipeOut: (value: any) => !value,
                      onChange: (
                        value: any,
                        origin: any,
                        item: any,
                        form: any
                      ) => {
                        if (!value) {
                          // 父级作为返回值
                          form.setValues({
                            cascade: true,
                            withChildren: false,
                            onlyChildren: true
                          });
                        } else {
                          form.setValues({
                            withChildren: false,
                            cascade: false,
                            onlyChildren: false
                          });
                        }
                      }
                    },
                    getSchemaTpl('joinValues'),
                    getSchemaTpl('delimiter', {
                      visibleOn: 'this.joinValues'
                    }),
                    getSchemaTpl('extractValue', {
                      visibleOn: '!this.joinValues'
                    })
                  ]
                }
              ],
              getSchemaTpl('hideNodePathLabel'),
              getSchemaTpl('labelRemark'),
              getSchemaTpl('remark'),
              getSchemaTpl('placeholder'),
              getSchemaTpl('description')
            ]
          },
          {
            title: '选项',
            body: [
              // getSchemaTpl('optionControl'), // 备注：级联选择框 不适合用这种方式添加选项
              getSchemaTpl('valueFormula', {
                rendererSchema: context?.schema,
                mode: 'vertical' // 改成上下展示模式
              })
            ]
          },
          getSchemaTpl('status', {isFormItem: true}),
          getSchemaTpl('validation', {
            tag: (data: any) => {
              return ValidatorTag.MultiSelect;
            }
          })
        ])
      },
      {
        title: '外观',
        body: getSchemaTpl('collapseGroup', [
          getSchemaTpl('style:formItem', {renderer}),
          {
            title: '边框',
            key: 'borderMode',
            body: [getSchemaTpl('borderMode')]
          },
          getSchemaTpl('style:classNames', {
            schema: [
              getSchemaTpl('className', {
                label: '描述',
                name: 'descriptionClassName',
                visibleOn: 'this.description'
              })
            ]
          })
        ])
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
}

registerEditorPlugin(NestedSelectControlPlugin);
