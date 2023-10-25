import {EditorNodeType, registerEditorPlugin} from 'amis-editor-core';
import {
  BasePlugin,
  BasicSubRenderInfo,
  RendererEventContext,
  SubRendererInfo,
  BaseEventContext
} from 'amis-editor-core';
import {defaultValue, getSchemaTpl, tipedLabel} from 'amis-editor-core';
import {ValidatorTag} from '../../validator';
import {getEventControlConfig} from '../../renderer/event-control/helper';
import {inputStateTpl} from '../../renderer/style-control/helper';
import {resolveOptionType} from '../../util';

const isText = 'data.type === "input-text"';
const isPassword = 'data.type === "input-password"';
const isEmail = 'data.type === "input-email"';
const isUrl = 'data.type === "input-url"';
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

  docLink = '/amis/zh-CN/components/form/text';

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
      dataSchema: [
        {
          type: 'object',
          properties: {
            data: {
              type: 'object',
              title: '数据',
              properties: {
                value: {
                  type: 'string',
                  title: '当前文本内容'
                }
              }
            }
          }
        }
      ]
    },
    {
      eventName: 'focus',
      eventLabel: '获取焦点',
      description: '输入框获取焦点',
      dataSchema: [
        {
          type: 'object',
          properties: {
            data: {
              type: 'object',
              title: '数据',
              properties: {
                value: {
                  type: 'string',
                  title: '当前文本内容'
                }
              }
            }
          }
        }
      ]
    },
    {
      eventName: 'blur',
      eventLabel: '失去焦点',
      description: '输入框失去焦点',
      dataSchema: [
        {
          type: 'object',
          properties: {
            data: {
              type: 'object',
              title: '数据',
              properties: {
                value: {
                  type: 'string',
                  title: '当前文本内容'
                }
              }
            }
          }
        }
      ]
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
      description: '清空输入框内容'
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

                    if (is_old_email) {
                      validations && delete validations.isEmail;
                      validationErrors && delete validationErrors.isEmail;
                    }

                    if (is_old_url) {
                      validations && delete validations.isUrl;
                      validationErrors && delete validationErrors.isUrl;
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
                    form.changeValue('validations', {...validations});
                    form.changeValue('validationErrors', {...validationErrors});
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
              visibleOn: `${isText} && (data.options  || data.autoComplete || data.source)`,
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
                        visibleOn: 'data.autoComplete !== false'
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
            getSchemaTpl('style:formItem', {renderer}),
            getSchemaTpl('theme:form-label'),
            getSchemaTpl('theme:form-description'),
            {
              title: '输入框样式',
              body: [
                ...inputStateTpl(
                  'themeCss.inputControlClassName',
                  'input.base.default'
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
    const type = resolveOptionType(node.schema?.options);
    // todo:异步数据case
    let dataSchema: any = {
      type,
      title: node.schema?.label || node.schema?.name,
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
