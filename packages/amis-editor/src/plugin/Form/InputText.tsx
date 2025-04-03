import {
  EditorManager,
  EditorNodeType,
  RAW_TYPE_MAP,
  registerEditorPlugin,
  BasePlugin,
  BaseEventContext,
  defaultValue,
  getSchemaTpl,
  tipedLabel
} from 'amis-editor-core';
import type {SchemaType} from 'amis';
import {ValidatorTag} from '../../validator';
import {
  getEventControlConfig,
  getActionCommonProps
} from '../../renderer/event-control/helper';
import {inputStateTpl} from '../../renderer/style-control/helper';
import {resolveOptionEventDataSchame, resolveOptionType} from '../../util';

const isText = 'this.type === "input-text"';
const isPassword = 'this.type === "input-password"';
const isEmail = 'this.type === "input-email"';
const isUrl = 'this.type === "input-url"';
function isTextShow(value: string, name: boolean): boolean {
  return ['input-text'].includes(value) ? !!name : false;
}

export class TextControlPlugin extends BasePlugin {
  static id = 'TextControlPlugin';
  static scene = ['layout'];
  // 关联渲染器名字
  rendererName = 'input-text';

  $schema = '/schemas/TextControlSchema.json';

  order = -600;
  // 添加源对应组件中文名称 & type字段
  searchKeywords =
    '文本框、邮箱框、input-email、URL框、input-url、密码框、input-password、密码输入框';
  // 组件名称
  name = '文本框';

  isBaseComponent = true;
  icon = 'fa fa-terminal';
  pluginIcon = 'input-text-plugin';

  description = '文本输入框，支持普通文本、密码、URL、邮箱等多种内容输入';

  docLink = '/amis/zh-CN/components/form/input-text';

  tags = ['表单项'];

  scaffold = {
    type: 'input-text',
    label: '文本',
    name: 'text'
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

  panelTitle = '文本框';

  events = [
    // {
    //   eventName: 'click',
    //   eventLabel: '点击',
    //   description: '点击事件'
    // },
    {
      eventName: 'change',
      eventLabel: '值变化',
      description: '输入框内容变化',
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
                    title: '当前文本内容'
                  }
                }
              }
            }
          }
        ];
      }
    },
    {
      eventName: 'focus',
      eventLabel: '获取焦点',
      description: '输入框获取焦点',
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
                    title: '当前文本内容'
                  }
                }
              }
            }
          }
        ];
      }
    },
    {
      eventName: 'blur',
      eventLabel: '失去焦点',
      description: '输入框失去焦点',
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
                    title: '当前文本内容'
                  }
                }
              }
            }
          }
        ];
      }
    },
    {
      eventName: 'review',
      eventLabel: '查看密码',
      description: '点击查看密码图标时',
      dataSchema: (manager: EditorManager) => {
        const {value} = resolveOptionEventDataSchame(manager);

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
    {
      eventName: 'encrypt',
      eventLabel: '隐藏密码',
      description: '点击隐藏密码图标时',
      dataSchema: (manager: EditorManager) => {
        const {value} = resolveOptionEventDataSchame(manager);

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
    }
    // 貌似无效，先下掉
    // {
    //   eventName: 'enter',
    //   eventLabel: '回车',
    //   description: '按键回车'
    // }
  ];

  actions = [
    {
      actionType: 'clear',
      actionLabel: '清空',
      description: '清空输入框内容',
      ...getActionCommonProps('clear')
    },
    {
      actionType: 'reset',
      actionLabel: '重置',
      description: '将值重置为初始值',
      ...getActionCommonProps('reset')
    },
    {
      actionType: 'reload',
      actionLabel: '重新加载',
      description: '触发组件数据刷新并重新渲染',
      ...getActionCommonProps('reload')
    },
    {
      actionType: 'setValue',
      actionLabel: '赋值',
      description: '触发组件数据更新',
      ...getActionCommonProps('setValue')
    },
    {
      actionType: 'review',
      actionLabel: '查看密码',
      description: '密码类型时触发查看真实密码'
    },
    {
      actionType: 'encrypt',
      actionLabel: '隐藏密码',
      description: '密码类型时触发隐藏真实密码'
    }
  ];

  panelJustify = true;

  panelBodyCreator = (context: BaseEventContext) => {
    const renderer: any = context.info.renderer;

    return getSchemaTpl('tabs', [
      {
        title: '属性',
        body: getSchemaTpl(
          'collapseGroup',
          [
            {
              title: '基本',
              body: [
                getSchemaTpl('layout:originPosition', {value: 'left-top'}),
                getSchemaTpl('formItemName', {
                  required: true
                }),
                getSchemaTpl('label'),
                getSchemaTpl('inputType', {
                  value: this.scaffold.type,
                  onChange: (
                    value: string,
                    oldValue: string,
                    model: any,
                    form: any
                  ) => {
                    const {
                      showCounter,
                      validations,
                      validationErrors = {},
                      autoComplete
                    } = form.data;

                    const is_old_email = oldValue === 'input-email';
                    const is_old_url = oldValue === 'input-url';

                    const removeField = (fieldName: string) => {
                      const {[fieldName]: removed, ...newValidations} =
                        validations;
                      const {
                        [fieldName]: removedError,
                        ...newValidationErrors
                      } = validationErrors;

                      form.changeValue('validations', newValidations);
                      form.changeValue('validationErrors', newValidationErrors);
                    };

                    if (is_old_email) {
                      removeField('isEmail');
                    }

                    if (is_old_url) {
                      removeField('isUrl');
                    }

                    form.setValues({
                      type: value,
                      showCounter: ['input-url', 'input-email'].includes(value)
                        ? undefined
                        : !!showCounter,
                      autoComplete: ['input-text'].includes(value)
                        ? autoComplete
                        : undefined
                    });
                  }
                }),
                getSchemaTpl('tplFormulaControl', {
                  name: 'value',
                  label: '默认值'
                }),
                getSchemaTpl('clearable'),
                getSchemaTpl('showCounter', {
                  visibleOn: `${isText} || ${isPassword}`
                }),
                {
                  name: 'maxLength',
                  label: tipedLabel('最大字数', '限制输入最多文字数量'),
                  type: 'input-number',
                  min: 0,
                  step: 1
                },
                {
                  name: 'addOn',
                  label: tipedLabel('AddOn', '输入框左侧或右侧的附加挂件'),
                  type: 'ae-switch-more',
                  mode: 'normal',
                  formType: 'extend',
                  title: 'AddOn',
                  bulk: false,
                  defaultData: {
                    label: '按钮',
                    type: 'button'
                  },
                  form: {
                    body: [
                      {
                        name: 'type',
                        label: '类型',
                        type: 'button-group-select',
                        inputClassName: 'items-center',
                        pipeIn: defaultValue('button'),
                        options: [
                          {
                            label: '文本',
                            value: 'text'
                          },

                          {
                            label: '按钮',
                            value: 'button'
                          },

                          {
                            label: '提交',
                            value: 'submit'
                          }
                        ]
                      },
                      getSchemaTpl('horizontal-align', {
                        name: 'position',
                        pipeIn: defaultValue('right')
                      }),
                      getSchemaTpl('addOnLabel'),
                      getSchemaTpl('icon')
                    ]
                  }
                },
                getSchemaTpl('labelRemark'),
                getSchemaTpl('remark'),
                getSchemaTpl('placeholder'),
                getSchemaTpl('description'),
                getSchemaTpl('autoFillApi')
              ]
            },
            {
              title: '选项',
              visibleOn: `${isText} && (this.options  || this.autoComplete || this.source)`,
              body: [
                getSchemaTpl('optionControlV2'),
                getSchemaTpl('multiple', {
                  visibleOn: `${isText} || ${isUrl}`
                }),
                {
                  type: 'ae-Switch-More',
                  mode: 'normal',
                  label: tipedLabel(
                    '自动补全',
                    '根据输入内容，调用接口提供选项。当前输入值可用${term}变量'
                  ),
                  visibleOn: isText,
                  formType: 'extend',
                  defaultData: {
                    autoComplete: {
                      method: 'get',
                      url: ''
                    }
                  },
                  form: {
                    body: [
                      getSchemaTpl('apiControl', {
                        name: 'autoComplete',
                        label: '接口',
                        description: '',
                        visibleOn: 'this.autoComplete !== false'
                      }),
                      {
                        label: tipedLabel(
                          '显示字段',
                          '选项文本对应的数据字段，多字段合并请通过模板配置'
                        ),
                        type: 'input-text',
                        name: 'labelField',
                        placeholder: '选项文本对应的字段'
                      },
                      {
                        label: '值字段',
                        type: 'input-text',
                        name: 'valueField',
                        placeholder: '值对应的字段'
                      }
                    ]
                  }
                }
              ]
            },
            getSchemaTpl('status', {
              isFormItem: true,
              readonly: true
            }),
            getSchemaTpl('validation', {
              tag: (data: any) => {
                switch (data.type) {
                  case 'input-password':
                    return ValidatorTag.Password;
                  case 'input-email':
                    return ValidatorTag.Email;
                  case 'input-url':
                    return ValidatorTag.URL;
                  default:
                    return ValidatorTag.Text;
                }
              }
            })
            // {
            //   title: '高级',
            //   body: [
            //     getSchemaTpl('autoFill')
            //   ]
            // }
          ],
          {...context?.schema, configTitle: 'props'}
        )
      },
      {
        title: '外观',
        body: getSchemaTpl(
          'collapseGroup',
          [
            getSchemaTpl('theme:formItem'),
            getSchemaTpl('theme:form-label'),
            getSchemaTpl('theme:form-description'),
            {
              title: '输入框样式',
              body: [
                ...inputStateTpl(
                  'themeCss.inputControlClassName',
                  '--input-default'
                )
              ]
            },
            {
              title: 'AddOn样式',
              visibleOn: 'this.addOn && this.addOn.type === "text"',
              body: [
                getSchemaTpl('theme:font', {
                  label: '文字',
                  name: 'themeCss.addOnClassName.font:default'
                }),
                getSchemaTpl('theme:paddingAndMargin', {
                  name: 'themeCss.addOnClassName.padding-and-margin:default'
                })
              ]
            },
            getSchemaTpl('theme:singleCssCode', {
              selectors: [
                {
                  label: '表单项基本样式',
                  isRoot: true,
                  selector: '.cxd-from-item'
                },
                {
                  label: '标题样式',
                  selector: '.cxd-Form-label'
                },
                {
                  label: '文本框基本样式',
                  selector: '.cxd-TextControl'
                },
                {
                  label: '输入框外层样式',
                  selector: '.cxd-TextControl-input'
                },
                {
                  label: '输入框样式',
                  selector: '.cxd-TextControl-input input'
                }
              ]
            })
          ],
          {...context?.schema, configTitle: 'style'}
        )
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
      rawType: RAW_TYPE_MAP[node.schema.type as SchemaType] || 'string',
      originalValue: node.schema?.value // 记录原始值，循环引用检测需要
    };

    // 选择器模式
    if (node.schema?.options) {
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
    }

    return dataSchema;
  }
}

registerEditorPlugin(TextControlPlugin);
