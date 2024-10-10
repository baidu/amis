import React from 'react';
import get from 'lodash/get';
import {getVariable} from 'amis-core';
import {Button} from 'amis';
import {
  defaultValue,
  getSchemaTpl,
  setSchemaTpl,
  tipedLabel,
  RendererPluginEvent
} from 'amis-editor-core';
import {registerEditorPlugin} from 'amis-editor-core';
import {BaseEventContext, BasePlugin} from 'amis-editor-core';
import {EditorNodeType} from 'amis-editor-core';
import {mockValue} from 'amis-editor-core';

// 快速编辑
setSchemaTpl('quickEdit', (patch: any, manager: any) => ({
  type: 'ae-switch-more',
  mode: 'normal',
  name: 'quickEdit',
  label: '可快速编辑',
  value: false,
  hiddenOnDefault: true,
  formType: 'extend',
  pipeIn: (value: any) => !!value,
  trueValue: {
    mode: 'popOver'
  },
  isChecked: (e: any) => {
    const {data, name} = e;
    return !!get(data, name);
  },
  form: {
    body: [
      {
        label: '编辑模式',
        name: 'quickEdit.mode',
        type: 'button-group-select',
        inputClassName: 'items-center',
        visibleOn: 'this.quickEdit',
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
        name: 'quickEdit.icon'
      }),
      getSchemaTpl('switch', {
        name: 'quickEdit.saveImmediately',
        label: tipedLabel(
          '立即保存',
          '开启后修改即提交，而不是标记修改批量提交。'
        ),
        visibleOn: 'this.quickEdit',
        pipeIn: (value: any) => !!value
      }),
      getSchemaTpl('apiControl', {
        name: 'quickEdit.saveImmediately.api',
        label: '保存接口',
        mode: 'row',
        description:
          '单独给立即保存配置接口，如果不配置，则默认使用quickSaveItemApi。',
        visibleOn: 'this.quickEdit && this.quickEdit.saveImmediately'
      }),
      {
        name: 'quickEdit',
        asFormItem: true,
        visibleOn: 'this.quickEdit',
        mode: 'row',
        children: ({value, onChange, data}: any) => {
          if (value === true) {
            value = {};
          } else if (typeof value === 'undefined') {
            value = getVariable(data, 'quickEdit');
          }
          value = {...value};
          const originMode = value.mode || 'popOver';
          if (value.mode) {
            delete value.mode;
          }
          const originSaveImmediately = value.saveImmediately;
          if (value.saveImmediately) {
            delete value.saveImmediately;
          }
          value =
            value.body && ['container', 'wrapper'].includes(value.type)
              ? {
                  // schema中存在容器，用自己的就行
                  type: 'wrapper',
                  body: [],
                  ...value
                }
              : {
                  // schema中不存在容器，打开子编辑器时需要包裹一层
                  type: 'wrapper',
                  body: [
                    {
                      type: 'input-text',
                      name: data.name,
                      ...value
                    }
                  ]
                };
          // todo 多个快速编辑表单模式看来只能代码模式编辑了。
          return (
            <Button
              block
              level="primary"
              onClick={() => {
                manager.openSubEditor({
                  title: '配置快速编辑类型',
                  value: value,
                  onChange: (value: any) =>
                    onChange(
                      {
                        ...value,
                        mode: originMode,
                        saveImmediately: originSaveImmediately
                      },
                      'quickEdit'
                    )
                });
              }}
            >
              配置快速编辑
            </Button>
          );
        }
      }
    ]
  }
}));

// 查看更多
setSchemaTpl('morePopOver', (patch: any, manager: any) => ({
  type: 'ae-switch-more',
  mode: 'normal',
  name: 'popOver',
  label: '查看更多展示',
  value: false,
  hiddenOnDefault: true,
  formType: 'extend',
  pipeIn: (value: any) => !!value,
  form: {
    body: [
      {
        label: '弹出模式',
        name: 'popOver.mode',
        type: 'button-group-select',
        visibleOn: 'this.popOver',
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
        name: 'popOver.position',
        label: '浮层位置',
        type: 'select',
        visibleOn:
          'this.popOver && (this.popOver.mode === "popOver" || !this.popOver.mode)',
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
        visibleOn: 'this.popOver',
        name: 'popOver',
        mode: 'row',
        asFormItem: true,
        children: ({value, onChange}: any) => {
          value = {
            type: 'panel',
            title: '查看详情',
            body: '内容详情',
            ...value
          };

          return (
            <Button
              block
              level="primary"
              onClick={() => {
                manager.openSubEditor({
                  title: '配置查看更多展示内容',
                  value: value,
                  onChange: (value: any) => onChange(value, 'quickEdit')
                });
              }}
            >
              查看更多内容配置
            </Button>
          );
        }
      }
    ]
  }
}));

// 可复制
setSchemaTpl('copyable', {
  type: 'ae-switch-more',
  mode: 'normal',
  name: 'copyable',
  label: '可复制',
  value: false,
  hiddenOnDefault: true,
  formType: 'extend',
  pipeIn: (value: any) => !!value,
  form: {
    body: [
      {
        label: '复制内容模板',
        name: 'copyable.content',
        type: 'textarea',
        mode: 'row',
        maxRow: 2,
        visibleOn: 'this.copyable',
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
              getSchemaTpl('quickEdit', {}, this.manager),
              getSchemaTpl('morePopOver', {}, this.manager),
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
