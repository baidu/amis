import React from 'react';
import {Button} from 'amis';
import omit from 'lodash/omit';
import {
  EditorNodeType,
  getSchemaTpl,
  RendererPluginAction,
  RendererPluginEvent
} from 'amis-editor-core';
import {registerEditorPlugin} from 'amis-editor-core';
import {
  BaseEventContext,
  BasePlugin,
  BasicToolbarItem,
  ContextMenuEventContext,
  ContextMenuItem,
  defaultValue,
  tipedLabel
} from 'amis-editor-core';
import {diff} from 'amis-editor-core';
import {getEventControlConfig} from '../../renderer/event-control/helper';
import {resolveOptionType} from '../../util';
import {ValidatorTag} from '../../validator';

export class PickerControlPlugin extends BasePlugin {
  static id = 'PickerControlPlugin';
  // 关联渲染器名字
  rendererName = 'picker';
  $schema = '/schemas/PickerControlSchema.json';

  // 组件名称
  name = '列表选取';
  isBaseComponent = true;
  icon = 'fa fa-window-restore';
  pluginIcon = 'picker-plugin';
  description =
    '通过 pickerSchema 配置可供选取的数据源进行选择需要的数据，支持多选';
  docLink = '/amis/zh-CN/components/form/picker';
  tags = ['表单项'];
  scaffold = {
    type: 'picker',
    label: '列表选取',
    name: 'picker',
    options: [
      {
        label: '选项A',
        value: 'A'
      },

      {
        label: '选项B',
        value: 'B'
      }
    ],
    modalClassName: 'app-popover'
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
  notRenderFormZone = true;
  // 事件定义
  events: RendererPluginEvent[] = [
    {
      eventName: 'change',
      eventLabel: '值变化',
      description: '选中状态变化时触发',
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
                  title: '选中的值'
                },
                selectedItems: {
                  type: 'string',
                  title: '选中的行记录'
                }
              }
            }
          }
        }
      ]
    },
    {
      eventName: 'itemClick',
      eventLabel: '点击选项',
      description: '选项被点击时触发',
      dataSchema: [
        {
          type: 'object',
          properties: {
            data: {
              type: 'object',
              title: '数据',
              properties: {
                item: {
                  type: 'object',
                  title: '所点击的选项'
                }
              }
            }
          }
        }
      ]
    }
  ];
  panelJustify = true;
  panelTitle = '列表选取';
  panelBodyCreator = (context: BaseEventContext) => {
    const pickStyleStateFunc = (visibleOn: string, state: string) => {
      return [
        getSchemaTpl('theme:border', {
          name: `themeCss.pickControlClassName.border:${state}`,
          editorThemePath: `pick.status.body.${state}-border`,
          visibleOn: visibleOn
        }),
        getSchemaTpl('theme:colorPicker', {
          label: '背景',
          labelMode: 'input',
          needGradient: true,
          needImage: true,
          name: `themeCss.pickControlClassName.background:${state}`,
          editorThemePath: `pick.status.body.${state}-bgColor`,
          visibleOn: visibleOn
        })
      ];
    };
    const pickDisabledSateFunc = (visibleOn: string, state: string) => {
      return [
        getSchemaTpl('theme:border', {
          name: `themeCss.pickControlDisabledClassName.border`,
          editorThemePath: `pick.status.body.${state}-border`,
          visibleOn: visibleOn
        }),
        getSchemaTpl('theme:colorPicker', {
          label: '背景',
          labelMode: 'input',
          needGradient: true,
          needImage: true,
          name: `themeCss.pickControlDisabledClassName.background`,
          editorThemePath: `pick.status.body.${state}-bgColor`,
          visibleOn: visibleOn
        })
      ];
    };
    const pickStyleFunc = (visibleOn: string, state: string) => {
      return [
        getSchemaTpl('theme:border', {
          name: `themeCss.pickControlClassName.border:${state}`,
          editorThemePath: `pick.base.body.border`,
          visibleOn: visibleOn
        }),
        getSchemaTpl('theme:colorPicker', {
          label: '背景',
          labelMode: 'input',
          needGradient: true,
          needImage: true,
          name: `themeCss.pickControlClassName.background:${state}`,
          editorThemePath: `pick.base.body.bgColor`,
          visibleOn: visibleOn
        })
      ];
    };
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
                mode: 'vertical',
                rendererSchema: context?.schema
              }),
              getSchemaTpl('switch', {
                name: 'embed',
                label: tipedLabel('开启内嵌', '是否不以弹框形式展示选择内容')
              }),
              {
                type: 'button-group-select',
                label: tipedLabel('弹框类型', '设置弹框形式，弹框或抽屉'),
                name: 'modalMode',
                options: [
                  {
                    label: '弹框',
                    value: 'dialog'
                  },
                  {
                    label: '抽屉',
                    value: 'drawer'
                  }
                ],
                pipeIn: defaultValue('dialog'),
                visibleOn: '!this.embed'
              },
              getSchemaTpl('multiple'),
              getSchemaTpl('textareaFormulaControl', {
                label: tipedLabel('标签模板', '已选定数据的label展示内容'),
                name: 'labelTpl',
                visibleOn: '!this.embed'
              }),
              getSchemaTpl('labelRemark'),
              getSchemaTpl('remark'),
              getSchemaTpl('description')
            ]
          },
          {
            title: '选项',
            body: [
              getSchemaTpl('optionControlV2'),
              {
                type: 'button',
                label: '配置选框详情',
                block: true,
                level: 'primary',
                onClick: this.editDetail.bind(this, context.id)
              }
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
            getSchemaTpl('style:formItem', {
              renderer: context.info.renderer,
              hiddenList: ['labelHide']
            }),
            {
              title: '基本',
              body: [
                {
                  type: 'select',
                  name: 'editorState',
                  label: '状态',
                  selectFirst: true,
                  options: [
                    {
                      label: '常规',
                      value: 'default'
                    },
                    {
                      label: '悬浮',
                      value: 'hover'
                    },
                    {
                      label: '聚焦',
                      value: 'focus'
                    },
                    {
                      label: '禁用',
                      value: 'disabled'
                    }
                  ]
                },
                ...pickStyleFunc(
                  "${editorState == 'default' || !editorState}",
                  'default'
                ),
                ...pickStyleStateFunc("${editorState == 'hover'}", 'hover'),
                ...pickStyleStateFunc("${editorState == 'focus'}", 'active'),
                ...pickDisabledSateFunc(
                  "${editorState == 'disabled'}",
                  'disabled'
                )
              ]
            },
            {
              title: '选中值',
              body: [
                getSchemaTpl('theme:font', {
                  name: 'themeCss.pickFontClassName.font:default',
                  editorThemePath: 'pick.base.body.value-font'
                }),
                getSchemaTpl('theme:colorPicker', {
                  label: '背景',
                  labelMode: 'input',
                  needGradient: true,
                  needImage: true,
                  name: 'themeCss.pickValueWrapClassName.background',
                  editorThemePath: 'pick.base.body.value-bgColor'
                }),
                getSchemaTpl('theme:border', {
                  name: 'themeCss.pickValueWrapClassName.border:default',
                  editorThemePath: 'pick.base.body.value-border'
                }),
                getSchemaTpl('theme:radius', {
                  name: 'themeCss.pickValueWrapClassName.radius',
                  editorThemePath: 'pick.base.body.value-radius'
                }),
                getSchemaTpl('theme:colorPicker', {
                  label: '图标颜色',
                  labelMode: 'input',
                  needGradient: true,
                  needImage: true,
                  name: 'themeCss.pickValueIconClassName.color',
                  editorThemePath: 'pick.base.body.value-icon-color'
                }),
                getSchemaTpl('theme:colorPicker', {
                  label: '图标hover颜色',
                  labelMode: 'input',
                  needGradient: true,
                  needImage: true,
                  name: 'themeCss.pickValueIconClassName.color:hover',
                  editorThemePath: 'pick.base.body.value-hover-icon-color'
                })
              ]
            },
            {
              title: '图标',
              body: [
                {
                  name: 'themeCss.pickControlClassName.--Pick-base-icon',
                  label: '选择图标',
                  type: 'icon-select',
                  returnSvg: true
                },
                getSchemaTpl('theme:size', {
                  name: 'themeCss.pickControlClassName.--Pick-base-icon-size',
                  label: '图标大小',
                  editorThemePath: `default.body.icon-size`
                }),
                getSchemaTpl('theme:colorPicker', {
                  label: '颜色',
                  labelMode: 'input',
                  needGradient: true,
                  needImage: true,
                  name: 'themeCss.pickIconClassName.color',
                  editorThemePath: 'pick.base.body.icon-color'
                })
              ]
            },
            getSchemaTpl('theme:cssCode', {
              themeClass: [],
              isFormItem: true
            }),
            {...context?.schema, configTitle: 'style'}
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

  buildEditorToolbar(
    {id, info}: BaseEventContext,
    toolbars: Array<BasicToolbarItem>
  ) {
    if (info.renderer.name === this.rendererName) {
      toolbars.push({
        icon: 'fa fa-expand',
        order: 100,
        tooltip: '配置选框详情',
        onClick: this.editDetail.bind(this, id)
      });
    }
  }

  buildEditorContextMenu(
    {id, schema, region, info}: ContextMenuEventContext,
    menus: Array<ContextMenuItem>
  ) {
    if (info.renderer.name === this.rendererName) {
      menus.push('|', {
        label: '配置选框详情',
        onSelect: this.editDetail.bind(this, id)
      });
    }
  }

  editDetail(id: string) {
    const manager = this.manager;
    const store = manager.store;
    const node = store.getNodeById(id)!;
    const value = store.getValueOf(id);

    if (!node || !value) {
      return;
    }

    const component = node.getComponent();

    const schema = {
      type: 'crud',
      mode: 'list',
      ...(value.pickerSchema || {
        listItem: {
          title: '${label}'
        }
      }),
      api: value.source,
      pickerMode: true,
      multiple: value.multiple
    };

    this.manager.openSubEditor({
      title: '配置选框详情',
      value: schema,
      data: {options: component.props.options},
      onChange: newValue => {
        newValue = {
          ...value,
          pickerSchema: {...newValue},
          source: newValue.api
        };

        delete newValue.pickerSchema.api;
        delete newValue.pickerSchema.type;
        delete newValue.pickerSchema.pickerMode;
        delete newValue.pickerSchema.multiple;

        manager.panelChangeValue(newValue, diff(value, newValue));
      }
    });
  }

  buildDataSchemas(node: EditorNodeType, region: EditorNodeType) {
    const type = resolveOptionType(node.schema?.options);
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
          label: {
            type: 'string',
            title: '文本'
          },
          value: {
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

registerEditorPlugin(PickerControlPlugin);
