import React from 'react';
import get from 'lodash/get';
import {getVariable} from 'amis-core';
import {Button} from 'amis';
import {
  defaultValue,
  getSchemaTpl,
  setSchemaTpl,
  tipedLabel,
  RendererPluginEvent,
  diff
} from 'amis-editor-core';
import {registerEditorPlugin} from 'amis-editor-core';
import {BaseEventContext, BasePlugin} from 'amis-editor-core';
import {EditorNodeType} from 'amis-editor-core';
import {mockValue} from 'amis-editor-core';

// 可复制
setSchemaTpl('copyable', {
  type: 'ae-switch-more',
  mode: 'normal',
  name: 'copyable',
  label: '可复制',
  hiddenOnDefault: true,
  trueValue: true,
  bulk: false,
  formType: 'extend',
  pipeIn: (value: any) => !!value,
  form: {
    body: [
      {
        label: '内容模板',
        name: 'content',
        type: 'textarea',
        mode: 'row',
        maxRow: 2,
        description: '默认为当前字段值，可定制。'
      }
    ]
  }
});

export class StaticControlPlugin extends BasePlugin {
  static id = 'StaticControlPlugin';
  static scene = ['layout'];
  // 关联渲染器名字
  rendererName = 'static';
  $schema = '/schemas/StaticControlSchema.json';

  // 组件名称
  name = '静态展示框';
  isBaseComponent = true;
  icon = 'fa fa-info';
  pluginIcon = 'static-plugin';
  description = '纯用来展示数据，可用来展示 json、date、image、progress 等数据';
  docLink = '/amis/zh-CN/components/form/static';
  tags = ['表单项'];
  scaffold = {
    type: 'static',
    label: '描述'
  };
  previewSchema: any = {
    type: 'form',
    className: 'text-left',
    mode: 'horizontal',
    wrapWithPanel: false,
    body: [
      {
        ...this.scaffold,
        value: '静态值'
      }
    ]
  };
  multifactor = true;
  notRenderFormZone = true;
  panelTitle = '静态展示';
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
              getSchemaTpl('formItemName', {
                required: false
              }),
              getSchemaTpl('label'),
              // getSchemaTpl('value'),
              getSchemaTpl('valueFormula', {
                name: 'tpl',
                onChange: (value: any, oldValue: any, item: any, form: any) => {
                  value === '' &&
                    form.setValues({
                      value: undefined
                    });
                }
                // rendererSchema: {
                //   ...context?.schema,
                //   type: 'textarea', // 改用多行文本编辑
                //   value: context?.schema.tpl // 避免默认值丢失
                // }
              }),
              {
                type: 'ae-switch-more',
                mode: 'normal',
                name: 'quickEdit',
                label: '可快速编辑',
                hiddenOnDefault: true,
                formType: 'extend',
                defaultData: {
                  mode: 'popOver'
                },
                bulk: false,
                form: {
                  body: [
                    {
                      label: '编辑模式',
                      name: 'mode',
                      type: 'button-group-select',
                      inputClassName: 'items-center',
                      pipeIn: defaultValue('popOver'),
                      options: [
                        {
                          label: '下拉',
                          value: 'popOver'
                        },
                        {
                          label: '内嵌',
                          value: 'inline'
                        }
                      ]
                    },
                    getSchemaTpl('icon', {
                      name: 'icon'
                    }),
                    getSchemaTpl('switch', {
                      name: 'saveImmediately',
                      label: tipedLabel(
                        '立即保存',
                        '开启后修改即提交，而不是标记修改批量提交。'
                      ),
                      visibleOn: 'this.quickEdit',
                      pipeIn: (value: any) => !!value
                    }),
                    getSchemaTpl('apiControl', {
                      name: 'saveImmediately.api',
                      label: '保存接口',
                      mode: 'row',
                      description:
                        '单独给立即保存配置接口，如果不配置，则默认使用quickSaveItemApi。',
                      visibleOn: 'this.saveImmediately'
                    }),
                    {
                      type: 'button',
                      block: true,
                      onClick: this.editDetail.bind(
                        this,
                        context.id,
                        'quickEdit',
                        (nodeSchema: any) => ({
                          type: 'container',
                          body: [
                            {
                              type: 'input-text',
                              name: nodeSchema.name
                            }
                          ]
                        })
                      ),
                      label: '配置编辑模板'
                    }
                  ]
                }
              },
              {
                type: 'ae-switch-more',
                mode: 'normal',
                name: 'popOver',
                label: '查看更多展示',
                hiddenOnDefault: true,
                defaultData: {
                  mode: 'popOver'
                },
                formType: 'extend',
                bulk: false,
                pipeIn: (value: any) => !!value,
                form: {
                  body: [
                    {
                      label: '弹出模式',
                      name: 'mode',
                      type: 'button-group-select',
                      pipeIn: defaultValue('popOver'),
                      options: [
                        {
                          label: '浮层',
                          value: 'popOver'
                        },

                        {
                          label: '弹框',
                          value: 'dialog'
                        },

                        {
                          label: '抽屉',
                          value: 'drawer'
                        }
                      ]
                    },
                    {
                      name: 'position',
                      label: '浮层位置',
                      type: 'select',
                      visibleOn: 'this.mode === "popOver" || !this.mode',
                      pipeIn: defaultValue('center'),
                      options: [
                        {
                          label: '目标左上角',
                          value: 'left-top'
                        },
                        {
                          label: '目标右上角',
                          value: 'right-top'
                        },
                        {
                          label: '目标中部',
                          value: 'center'
                        },
                        {
                          label: '目标左下角',
                          value: 'left-bottom'
                        },
                        {
                          label: '目标右下角',
                          value: 'right-bottom'
                        },
                        {
                          label: '页面左上角',
                          value: 'fixed-left-top'
                        },
                        {
                          label: '页面右上角',
                          value: 'fixed-right-top'
                        },
                        {
                          label: '页面左下角',
                          value: 'fixed-left-bottom'
                        },
                        {
                          label: '页面右下角',
                          value: 'fixed-right-bottom'
                        }
                      ]
                    },
                    {
                      type: 'button',
                      block: true,
                      onClick: this.editDetail.bind(
                        this,
                        context.id,
                        'popOver',
                        (schema: any) => ({
                          type: 'panel',
                          title: '查看详情',
                          body: [
                            {
                              type: 'tpl',
                              tpl: '${' + schema.name + '}',
                              wrapperComponent: '',
                              inline: true,
                              editorSetting: {
                                mock: {
                                  tpl: '内容详情'
                                }
                              }
                            }
                          ]
                        })
                      ),
                      label: '查看更多内容配置'
                    }
                  ]
                }
              },
              getSchemaTpl('copyable'),
              getSchemaTpl('labelRemark'),
              getSchemaTpl('remark'),
              getSchemaTpl('placeholder'),
              getSchemaTpl('description')
              /*{
                  children: (
                    <Button
                      size="sm"
                      level="info"
                      className="m-b"
                      block
                      onClick={this.exchangeRenderer.bind(this, context.id)}
                    >
                      更改渲染器类型
                    </Button>
                  )
              },*/
            ]
          },
          getSchemaTpl('status', {
            isFormItem: true,
            unsupportStatic: true
          })
        ])
      },
      {
        title: '外观',
        body: getSchemaTpl('collapseGroup', [
          getSchemaTpl('style:formItem', {renderer}),
          {
            title: '控件',
            body: [getSchemaTpl('borderMode')]
          },
          {
            title: 'CSS类名',
            body: [
              getSchemaTpl('className', {
                label: '整体'
              }),
              getSchemaTpl('className', {
                label: '标签',
                name: 'labelClassName'
              }),
              getSchemaTpl('className', {
                label: '控件',
                name: 'inputClassName'
              }),
              getSchemaTpl('className', {
                label: '描述',
                name: 'descriptionClassName',
                visibleOn: 'this.description'
              })
            ]
          }
        ])
      }
    ]);
  };

  filterProps(props: any, node: EditorNodeType) {
    props.$$id = node.id;

    if (typeof props.value === 'undefined' && !node.state.value) {
      node.updateState({
        value: mockValue(props)
      });
    }
    return props;
  }

  editDetail(id: string, field: string, defaultSchema: (schema: any) => any) {
    const manager = this.manager;
    const store = manager.store;
    const node = store.getNodeById(id);
    const value = store.getValueOf(id);
    const data = value[field];

    let originValue = data.type
      ? ['container', 'wrapper'].includes(data.type)
        ? data
        : {
            // schema中存在容器，用自己的就行
            type: 'container',
            body: [data]
          }
      : defaultSchema(value);

    node &&
      value &&
      this.manager.openSubEditor({
        title: '配置显示模板',
        value: originValue,
        // slot: {
        //   type: 'container',
        //   body: '$$'
        // },
        onChange: (newValue: any) => {
          newValue = {...originValue, [field]: newValue};
          manager.panelChangeValue(newValue, diff(originValue, newValue));
        },
        data: {
          [value.labelField || 'label']: '选项名',
          [value.valueField || 'value']: '选项值',
          item: '假数据'
        }
      });
  }

  // 事件定义
  events: RendererPluginEvent[] = [
    {
      eventName: 'click',
      eventLabel: '点击',
      description: '点击时触发',
      dataSchema: [
        {
          type: 'object',
          properties: {
            context: {
              type: 'object',
              title: '上下文',
              properties: {
                nativeEvent: {
                  type: 'object',
                  title: '鼠标事件对象'
                }
              }
            }
          }
        }
      ]
    },
    {
      eventName: 'mouseenter',
      eventLabel: '鼠标移入',
      description: '鼠标移入时触发',
      dataSchema: [
        {
          type: 'object',
          properties: {
            context: {
              type: 'object',
              title: '上下文',
              properties: {
                nativeEvent: {
                  type: 'object',
                  title: '鼠标事件对象'
                }
              }
            }
          }
        }
      ]
    },
    {
      eventName: 'mouseleave',
      eventLabel: '鼠标移出',
      description: '鼠标移出时触发',
      dataSchema: [
        {
          type: 'object',
          properties: {
            context: {
              type: 'object',
              title: '上下文',
              properties: {
                nativeEvent: {
                  type: 'object',
                  title: '鼠标事件对象'
                }
              }
            }
          }
        }
      ]
    }
  ];

  /*exchangeRenderer(id: string) {
    this.manager.showReplacePanel(id, '展示');
  }*/
}

registerEditorPlugin(StaticControlPlugin);
