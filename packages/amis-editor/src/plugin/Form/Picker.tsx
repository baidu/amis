import React from 'react';
import {Button} from 'amis';
import omit from 'lodash/omit';
import uniq from 'lodash/uniq';
import get from 'lodash/get';
import cloneDeep from 'lodash/cloneDeep';
import {
  EditorManager,
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
import {isPureVariable} from 'amis-core';
import type {Schema} from 'amis';
import {getEventControlConfig} from '../../renderer/event-control/helper';
import {resolveOptionEventDataSchame, resolveOptionType} from '../../util';
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
  searchKeywords = '列表选择器';
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
    overflowConfig: {
      maxTagCount: -1
    },
    modalClassName: 'app-popover :AMISCSSWrapper'
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
      dataSchema: (manager: EditorManager) => {
        const {value, selectedItems} = resolveOptionEventDataSchame(manager);

        return [
          {
            type: 'object',
            properties: {
              data: {
                type: 'object',
                title: '数据',
                properties: {
                  value,
                  selectedItems
                }
              }
            }
          }
        ];
      }
    },
    {
      eventName: 'itemClick',
      eventLabel: '点击选项',
      description: '选项被点击时触发',
      dataSchema: (manager: EditorManager) => {
        const {itemSchema} = resolveOptionEventDataSchame(manager);

        return [
          {
            type: 'object',
            properties: {
              data: {
                type: 'object',
                title: '数据',
                properties: {
                  item: {
                    type: 'object',
                    title: '所点击的选项',
                    properties: itemSchema
                  }
                }
              }
            }
          }
        ];
      }
    },
    {
      eventName: 'staticItemClick',
      eventLabel: '静态展示节点点击',
      description: '静态展示时节点点击时触发',
      dataSchema: (manager: EditorManager) => {
        const {itemSchema} = resolveOptionEventDataSchame(manager);

        return [
          {
            type: 'object',
            properties: {
              data: {
                type: 'object',
                title: '数据',
                properties: {
                  item: {
                    type: 'object',
                    title: '所点击的选项',
                    properties: itemSchema
                  },
                  index: {
                    type: 'number',
                    title: '所点击的选项索引'
                  }
                }
              }
            }
          }
        ];
      }
    }
  ];
  panelJustify = true;
  panelTitle = '列表选取';
  panelBodyCreator = (context: BaseEventContext) => {
    const pickStyleStateFunc = (visibleOn: string, state: string) => {
      const cssToken =
        state === 'default'
          ? 'base'
          : `status-${state === 'focused' ? 'focus' : state}`;
      return [
        getSchemaTpl('theme:border', {
          name: `themeCss.pickControlClassName.border:${state}`,
          editorValueToken: `--Pick-${cssToken}`,
          visibleOn: visibleOn
        }),
        getSchemaTpl('theme:colorPicker', {
          label: '背景',
          labelMode: 'input',
          needGradient: true,
          needImage: true,
          name: `themeCss.pickControlClassName.background:${state}`,
          editorValueToken: `--Pick-${cssToken}-bgColor`,
          visibleOn: visibleOn
        })
      ];
    };
    const getOverflowTagPopoverTpl = (schema: any = {}) => {
      const {namePre, title, key} = schema;
      delete schema.namePre;
      return {
        type: 'container',
        body: [
          {
            type: 'switch',
            label: title,
            name: `${namePre}.${key}`,
            inputClassName: 'is-inline',
            onChange: (value: any, origin: any, item: any, form: any) => {
              const overflowConfig = cloneDeep(form.data.overflowConfig) || {};
              const displayPosition = overflowConfig.displayPosition || [];
              if (value) {
                overflowConfig.displayPosition = uniq([
                  ...displayPosition,
                  key
                ]);
              } else {
                overflowConfig.displayPosition = displayPosition.filter(
                  (_: string) => _ !== key
                );
                const configKey =
                  key === 'select'
                    ? 'overflowTagPopover'
                    : 'overflowTagPopoverInCRUD';
                delete overflowConfig[configKey];
              }
              form.setValues({
                overflowConfig
              });
            }
          },
          {
            name: namePre ? `${namePre}.trigger` : 'trigger',
            type: 'select',
            label: tipedLabel('触发方式', '默认方式为”鼠标悬停“'),
            multiple: true,
            value: ['hover'],
            pipeIn: (value: any) =>
              Array.isArray(value) ? value.join(',') : [],
            pipeOut: (value: any) =>
              value && value.length ? value.split(',') : undefined,
            options: [
              {
                label: '鼠标悬停',
                value: 'hover'
              },

              {
                label: '点击',
                value: 'click'
              }
            ],
            visibleOn: `${namePre}.${key}`
          },
          {
            type: 'button-group-select',
            name: namePre ? `${namePre}.placement` : 'placement',
            label: '提示位置',
            size: 'sm',
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
            ],
            pipeIn: defaultValue('top'),
            visibleOn: `${namePre}.${key}`
          },
          {
            type: 'switch',
            label: tipedLabel('展示浮层箭头', '关闭后提示浮层不展示指向箭头'),
            name: namePre ? `${namePre}.showArrow` : 'showArrow',
            inputClassName: 'is-inline',
            visibleOn: `${namePre}.${key}`
          },
          {
            type: 'input-group',
            label: tipedLabel(
              '浮层偏移量',
              '提示浮层位置相对”水平“、”垂直“的偏移量'
            ),
            body: [
              {
                type: 'input-number',
                name: namePre ? `${namePre}.offset` : 'offset',
                prefix: 'X：',
                pipeIn: (value: any) =>
                  Array.isArray(value) ? value[0] || 0 : 0,
                pipeOut: (value: any, oldValue: any, data: any) => {
                  const offset =
                    get(data, namePre ? `${namePre}.offset` : 'offset') || [];
                  return [value, offset[1] || 0];
                }
              },
              {
                type: 'input-number',
                name: namePre ? `${namePre}.offset` : 'offset',
                prefix: 'Y：',
                pipeIn: (value: any) =>
                  Array.isArray(value) ? value[1] || 0 : 0,
                pipeOut: (value: any, oldValue: any, data: any) => {
                  const offset =
                    get(data, namePre ? `${namePre}.offset` : 'offset') || [];
                  return [offset[0] || 0, value];
                }
              }
            ],
            visibleOn: `${namePre}.${key}`
          }
        ],
        ...schema
      };
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
              {
                type: 'select',
                label: tipedLabel(
                  '选框类型',
                  '内嵌：以平铺方式展示在页面，其它两种以弹框或抽屉形式弹出展示'
                ),
                name: 'modalMode',
                options: [
                  {
                    label: '内嵌',
                    value: 'inner'
                  },
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
                onChange: (value: any, origin: any, item: any, form: any) => {
                  form.setValues({
                    embed: value === 'inner'
                  });
                  if (value !== 'inner') {
                    form.setValues({
                      modalMode: value
                    });
                  } else {
                    const overflowConfig = cloneDeep(form.data.overflowConfig);
                    delete overflowConfig.overflowTagPopoverInCRUD;
                    overflowConfig.displayPosition = ['select'];
                    form.setValues({
                      overflowConfig
                    });
                  }
                }
              },
              {
                label: '弹框尺寸',
                type: 'select',
                name: 'modalSize',
                pipeIn: defaultValue(''),
                visibleOn: '${modalMode !== "inner"}',
                options: [
                  {
                    label: '默认',
                    value: ''
                  },
                  {
                    label: '小',
                    value: 'sm'
                  },
                  {
                    label: '中',
                    value: 'md'
                  },
                  {
                    label: '大',
                    value: 'lg'
                  },
                  {
                    label: '特大',
                    value: 'xl'
                  }
                ]
              },
              getSchemaTpl('multiple'),
              {
                type: 'ae-switch-more',
                mode: 'normal',
                formType: 'extend',
                name: 'overflowConfig',
                bulk: false,
                isChecked: (v: any) => !!v,
                label: tipedLabel(
                  '标签收纳',
                  '当值数量超出一定数量时，可进行收纳显示'
                ),
                extendData: ['embed'],
                form: {
                  body: [
                    {
                      type: 'input-number',
                      name: 'maxTagCount',
                      label: '最大标签数',
                      defaultValue: -1
                    },
                    getOverflowTagPopoverTpl({
                      namePre: 'overflowTagPopover',
                      title: '选择器收纳器',
                      key: 'select',
                      className: 'm-b-sm'
                    }),
                    getOverflowTagPopoverTpl({
                      namePre: 'overflowTagPopoverInCRUD',
                      title: 'CRUD收纳器',
                      key: 'crud',
                      className: 'm-b-sm',
                      hiddenOn: '!!embed'
                    })
                  ]
                },
                visibleOn: 'this.multiple'
              },
              {
                type: 'switch',
                name: 'itemClearable',
                label: '选中项可删除',
                pipeIn: defaultValue(true),
                inputClassName: 'is-inline '
              },
              getSchemaTpl('labelRemark'),
              getSchemaTpl('remark'),
              getSchemaTpl('placeholder'),
              getSchemaTpl('description')
            ]
          },
          {
            title: '选项',
            body: [
              getSchemaTpl('optionControlV2'),
              getSchemaTpl('valueFormula', {
                mode: 'vertical',
                rendererSchema: (schema: Schema) => schema,
                useSelectMode: true,
                label: tipedLabel(
                  '默认值',
                  `当在fx中配置多选值时，需要适配值格式，示例：
                  选项值为
                  <pre>${JSON.stringify(
                    [
                      {label: '选项A', value: 'A'},
                      {label: '选项B', value: 'B'}
                    ],
                    null,
                    2
                  )}
                  </pre>选中选项A和选项B：
                  <ul>
                    <li>开启拼接值且拼接符为 ‘,’ ：值示例 'A,B'</li>
                    <li>关闭拼接值，开启仅提取值，值示例：['A', 'B']</li>
                    <li>关闭拼接值，关闭仅提取值，值示例：[
                      {label: '选项A', value: 'A'},
                      {label: '选项B', value: 'B'}
                    ]</li>
                  </ul>`
                )
              }),
              getSchemaTpl('textareaFormulaControl', {
                label: tipedLabel('标签模板', '已选定数据的label展示内容'),
                name: 'labelTpl',
                mode: 'normal',
                visibleOn: '!this.embed'
              }),
              {
                type: 'button',
                label: '配置选框详情',
                block: true,
                level: 'primary',
                visibleOn: '!this.pickerSchema',
                onClick: this.editDetail.bind(this, context.id)
              },
              {
                type: 'button',
                label: '已配置选框详情',
                block: true,
                level: 'primary',
                visibleOn: 'this.pickerSchema',
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
          getSchemaTpl(
            'collapseGroup',
            [
              getSchemaTpl('theme:formItem'),
              {
                title: '基本',
                body: [
                  {
                    type: 'select',
                    name: '__editorState',
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
                        value: 'focused'
                      },
                      {
                        label: '禁用',
                        value: 'disabled'
                      }
                    ]
                  },
                  ...pickStyleStateFunc(
                    "${__editorState == 'default' || !__editorState}",
                    'default'
                  ),
                  ...pickStyleStateFunc("${__editorState == 'hover'}", 'hover'),
                  ...pickStyleStateFunc(
                    "${__editorState == 'focused'}",
                    'focused'
                  ),
                  ...pickStyleStateFunc(
                    "${__editorState == 'disabled'}",
                    'disabled'
                  )
                ]
              },
              {
                title: '选中值',
                body: [
                  getSchemaTpl('theme:font', {
                    name: 'themeCss.pickFontClassName.font:default',
                    editorValueToken: '--Pick-base-value'
                  }),
                  getSchemaTpl('theme:colorPicker', {
                    label: '背景',
                    labelMode: 'input',
                    needGradient: true,
                    needImage: true,
                    name: 'themeCss.pickValueWrapClassName.background',
                    editorValueToken: '--Pick-base-value-bgColor'
                  }),
                  getSchemaTpl('theme:border', {
                    name: 'themeCss.pickValueWrapClassName.border:default',
                    editorValueToken: '--Pick-base-value'
                  }),
                  getSchemaTpl('theme:radius', {
                    name: 'themeCss.pickValueWrapClassName.radius',
                    editorValueToken: '--Pick-base'
                  }),
                  getSchemaTpl('theme:colorPicker', {
                    label: '图标颜色',
                    labelMode: 'input',
                    needGradient: true,
                    needImage: true,
                    name: 'themeCss.pickValueIconClassName.color',
                    editorValueToken: '--Pick-base-value-icon-color'
                  }),
                  getSchemaTpl('theme:colorPicker', {
                    label: '图标hover颜色',
                    labelMode: 'input',
                    needGradient: true,
                    needImage: true,
                    name: 'themeCss.pickValueIconClassName.color:hover',
                    editorValueToken: '--Pick-base-value-hover-icon-color'
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
                  // 新版大小设置不兼容，先不加
                  // getSchemaTpl('theme:size', {
                  //   name: 'themeCss.pickControlClassName.--Pick-base-icon-size',
                  //   label: '图标大小',
                  //   editorValueToken: `default.body.icon-size`
                  // }),
                  getSchemaTpl('theme:colorPicker', {
                    label: '颜色',
                    labelMode: 'input',
                    needGradient: true,
                    needImage: true,
                    name: 'themeCss.pickIconClassName.color',
                    editorValueToken: '--Pick-base-icon-color'
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
                    label: '列表选取基本样式',
                    selector: '.cxd-Picker'
                  },
                  {
                    label: '输入框样式',
                    selector: '.cxd-Picker-input'
                  }
                ]
              })
            ],
            {...context?.schema, configTitle: 'style'}
          )
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
          title: value.labelField ? '${' + value.labelField + '}' : '${label}'
        }
      }),
      pickerMode: true,
      multiple: value.multiple,
      labelField: value.labelField || 'label',
      valueField: value.valueField || 'value'
    };
    // 不支持上下文变量构建crud
    if (!isPureVariable(value.source)) {
      schema.api = value.source;
    }

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

registerEditorPlugin(PickerControlPlugin);
