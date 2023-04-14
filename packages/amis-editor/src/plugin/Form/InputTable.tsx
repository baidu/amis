import React from 'react';
import {Button} from 'amis';
import {
  registerEditorPlugin,
  BaseEventContext,
  BasePlugin,
  InsertEventContext,
  PluginEvent,
  ScaffoldForm,
  RegionConfig,
  RendererPluginEvent,
  defaultValue,
  getSchemaTpl,
  RendererPluginAction,
  tipedLabel,
  getI18nEnabled,
  repeatArray,
  mockValue,
  EditorNodeType
} from 'amis-editor-core';
import {setVariable, someTree} from 'amis-core';
import {ValidatorTag} from '../../validator';
import {
  getEventControlConfig,
  getArgsWrapper
} from '../../renderer/event-control/helper';
import cloneDeep from 'lodash/cloneDeep';
import {resolveArrayDatasource} from '../../util';

export class TableControlPlugin extends BasePlugin {
  // 关联渲染器名字
  rendererName = 'input-table';
  $schema = '/schemas/TableControlSchema.json';

  // 组件名称
  name = '表格编辑框';
  isBaseComponent = true;
  icon = 'fa fa-table';
  pluginIcon = 'table-plugin';
  description =
    '可以用来展现数据的,可以用来展示数组类型的数据，比如 multiple  的子 form';
  docLink = '/amis/zh-CN/components/form/input-table';
  tags = ['表单项'];
  scaffold = {
    type: 'input-table',
    name: 'table',
    label: '表格表单',
    columns: [
      {
        label: '名称',
        name: 'name',
        quickEdit: {
          type: 'input-text',
          name: 'name1'
        }
      },
      {
        label: '分数',
        name: 'score',
        quickEdit: {
          type: 'input-number',
          mode: 'inline',
          name: 'score'
        }
      },
      {
        label: '等级',
        name: 'level',
        quickEdit: {
          type: 'select',
          name: 'level',
          options: [
            {
              label: 'A',
              value: 'A'
            },
            {
              label: 'B',
              value: 'B'
            },
            {
              label: 'C',
              value: 'C'
            }
          ]
        }
      }
    ],
    addable: false,
    footerAddBtn: {
      label: '新增',
      icon: 'fa fa-plus'
    },
    strictMode: true
  };

  regions: Array<RegionConfig> = [
    {
      key: 'columns',
      label: '列集合',
      renderMethod: 'renderTableContent',
      preferTag: '展示',
      dndMode: 'position-h'
    }
  ];

  previewSchema: any = {
    type: 'form',
    className: 'text-left',
    wrapWithPanel: false,
    mode: 'horizontal',
    body: {
      ...this.scaffold,
      value: [{color: 'green', name: '绿色'}]
    }
  };

  get scaffoldForm(): ScaffoldForm {
    const i18nEnabled = getI18nEnabled();
    return {
      title: '快速构建表格编辑框',
      body: [
        {
          name: 'columns',
          type: 'input-table',
          label: false,
          needConfirm: false,
          addable: true,
          removable: true,
          columns: [
            {
              type: 'text',
              name: 'label',
              label: '标题',
              quickEdit: {
                type: i18nEnabled ? 'input-text-i18n' : 'input-text',
                mode: 'inline'
              }
            },
            {
              type: 'text',
              name: 'name',
              label: '绑定字段名',
              quickEdit: {
                type: 'input-text',
                mode: 'inline'
              }
            },
            {
              type: 'text',
              name: 'type',
              label: '展示类型',
              width: 140,
              quickEdit: {
                type: 'select',
                options: [
                  {
                    value: 'text',
                    label: '纯文本'
                  },
                  {
                    value: 'tpl',
                    label: '模板'
                  },
                  {
                    value: 'container',
                    label: '容器'
                  },
                  {
                    value: 'image',
                    label: '图片'
                  },
                  {
                    value: 'date',
                    label: '日期'
                  },
                  {
                    value: 'datetime',
                    label: '日期时间'
                  },
                  {
                    value: 'time',
                    label: '时间'
                  },
                  {
                    value: 'status',
                    label: '状态'
                  },
                  {
                    value: 'mapping',
                    label: '映射'
                  }
                ],
                pipeIn: defaultValue('text')
              }
            },
            {
              type: 'text',
              name: 'quickEdit.type',
              label: '编辑类型',
              quickEdit: {
                type: 'select',
                clearable: true,
                placeholder: '为空则不支持编辑',
                options: [
                  {
                    value: 'input-text',
                    label: '文本框'
                  },
                  {
                    value: 'input-number',
                    label: '数字框'
                  },
                  {
                    value: 'select',
                    label: '选择框'
                  },
                  {
                    value: 'input-color',
                    label: '颜色选择框'
                  },
                  {
                    value: 'checkboxes',
                    label: '多选框'
                  },
                  {
                    value: 'radios',
                    label: '单选框'
                  },
                  {
                    value: 'input-date',
                    label: '日期'
                  },
                  {
                    value: 'input-date-range',
                    label: '日期范围'
                  },
                  {
                    value: 'switch',
                    label: '开关'
                  },
                  {
                    value: 'nested-select',
                    label: '级联选择器'
                  },
                  {
                    value: 'input-city',
                    label: '城市选择器'
                  },
                  {
                    value: 'input-tree',
                    label: '树选择框'
                  }
                ]
              },
              width: 210
            }
          ]
        }
      ],
      pipeOut: (schema: any) => {
        const columns = cloneDeep(schema.columns || []);
        const rawColumns: any = [];
        columns.forEach((column: any) => {
          const rawColumn = {
            ...column,
            type: column.type,
            quickEdit: column.quickEdit?.type
              ? {
                  type: column.quickEdit.type,
                  name: column.name
                }
              : false
          };
          rawColumns.push(rawColumn);
        });
        schema.columns = rawColumns;
        return {...schema};
      },
      canRebuild: true
    };
  }

  notRenderFormZone = true;

  panelJustify = true;
  panelTitle = '表格编辑';

  events: RendererPluginEvent[] = [
    {
      eventName: 'add',
      eventLabel: '添加行',
      description: '点击左下角添加按钮 或 某一行右侧操作栏添加按钮时触发',
      dataSchema: [
        {
          type: 'object',
          properties: {
            'event.data.value': {
              type: 'array',
              title: '列表记录'
            },
            'event.data.index': {
              type: 'array',
              title: '新增行记录索引'
            }
          }
        }
      ]
    },
    {
      eventName: 'addConfirm',
      eventLabel: '确认添加',
      description:
        '开启”确认模式“，点击添加按钮，填入数据后点击“保存”按钮后触发',
      dataSchema: [
        {
          type: 'object',
          properties: {
            'event.data.value': {
              type: 'array',
              title: '列表记录'
            },
            'event.data.item': {
              type: 'object',
              title: '新增行记录'
            },
            'event.data.index': {
              type: 'number',
              title: '新增行记录索引'
            }
          }
        }
      ]
    },
    {
      eventName: 'addSuccess',
      eventLabel: '添加成功',
      description:
        '开启”确认模式“并且配置”新增接口“，点击“保存”后成功添加时触发',
      dataSchema: [
        {
          type: 'object',
          properties: {
            'event.data.value': {
              type: 'array',
              title: '列表记录'
            },
            'event.data.item': {
              type: 'object',
              title: '新增行记录'
            },
            'event.data.index': {
              type: 'number',
              title: '新增行记录索引'
            }
          }
        }
      ]
    },
    {
      eventName: 'addFail',
      eventLabel: '添加失败',
      description:
        '开启”确认模式“并且配置”新增接口“，点击“保存”后调用接口失败时触发',
      dataSchema: [
        {
          type: 'object',
          properties: {
            'event.data.value': {
              type: 'array',
              title: '列表记录'
            },
            'event.data.item': {
              type: 'object',
              title: '新增行记录'
            },
            'event.data.index': {
              type: 'number',
              title: '新增行记录索引'
            },
            'event.data.error': {
              type: 'object',
              title: '请求失败后接口返回的错误信息'
            }
          }
        }
      ]
    },
    {
      eventName: 'edit',
      eventLabel: '编辑行',
      description: '点击某一行右侧操作栏“编辑”按钮时触发',
      dataSchema: [
        {
          type: 'object',
          properties: {
            'event.data.value': {
              type: 'array',
              title: '列表记录'
            },
            'event.data.item': {
              type: 'object',
              title: '所在行记录'
            },
            'event.data.index': {
              type: 'number',
              title: '所在行记录索引'
            }
          }
        }
      ]
    },
    {
      eventName: 'editConfirm',
      eventLabel: '确认编辑',
      description:
        '开启”确认模式“，点击“编辑”按钮，填入数据后点击“保存”按钮后触发',
      dataSchema: [
        {
          type: 'object',
          properties: {
            'event.data.value': {
              type: 'array',
              title: '列表记录'
            },
            'event.data.item': {
              type: 'object',
              title: '所在行记录'
            },
            'event.data.index': {
              type: 'number',
              title: '所在行记录索引'
            }
          }
        }
      ]
    },
    {
      eventName: 'editSuccess',
      eventLabel: '编辑成功',
      description:
        '开启”确认模式“并且配置”编辑接口“，点击“保存”后成功编辑时触发',
      dataSchema: [
        {
          type: 'object',
          properties: {
            'event.data.value': {
              type: 'array',
              title: '列表记录'
            },
            'event.data.item': {
              type: 'object',
              title: '所在行记录'
            },
            'event.data.index': {
              type: 'number',
              title: '所在行记录索引'
            }
          }
        }
      ]
    },
    {
      eventName: 'editFail',
      eventLabel: '编辑失败',
      description:
        '开启”确认模式“并且配置”编辑接口“，点击“保存”后调用接口失败时触发',
      dataSchema: [
        {
          type: 'object',
          properties: {
            'event.data.value': {
              type: 'array',
              title: '列表记录'
            },
            'event.data.item': {
              type: 'object',
              title: '所在行记录'
            },
            'event.data.index': {
              type: 'number',
              title: '所在行记录索引'
            },
            'event.data.error': {
              type: 'object',
              title: '请求错误后返回的错误信息'
            }
          }
        }
      ]
    },
    {
      eventName: 'delete',
      eventLabel: '删除行',
      description: '点击某一行右侧操作栏“删除”按钮时触发',
      dataSchema: [
        {
          type: 'object',
          properties: {
            'event.data.value': {
              type: 'array',
              title: '列表记录'
            },
            'event.data.item': {
              type: 'object',
              title: '所在行记录'
            },
            'event.data.index': {
              type: 'object',
              title: '所在行记录索引'
            }
          }
        }
      ]
    },
    {
      eventName: 'deleteSuccess',
      eventLabel: '删除成功',
      description: '配置了“删除接口”，调用接口成功时触发',
      dataSchema: [
        {
          type: 'object',
          properties: {
            'event.data.value': {
              type: 'array',
              title: '列表记录'
            },
            'event.data.item': {
              type: 'object',
              title: '所在行记录'
            },
            'event.data.index': {
              type: 'object',
              title: '所在行记录索引'
            }
          }
        }
      ]
    },
    {
      eventName: 'deleteFail',
      eventLabel: '删除失败',
      description: '配置了“删除接口”，调用接口失败时触发',
      dataSchema: [
        {
          type: 'object',
          properties: {
            'event.data.value': {
              type: 'array',
              title: '列表记录'
            },
            'event.data.item': {
              type: 'object',
              title: '所在行记录'
            },
            'event.data.index': {
              type: 'object',
              title: '所在行记录索引'
            },
            'event.data.error': {
              type: 'object',
              title: '请求失败后接口返回的错误信息'
            }
          }
        }
      ]
    },
    {
      eventName: 'change',
      eventLabel: '值变化',
      description: '表格数据发生改变时触发',
      dataSchema: [
        {
          type: 'object',
          properties: {
            'event.data.value': {
              type: 'array',
              title: '列表记录'
            }
          }
        }
      ]
    }
  ];

  actions: RendererPluginAction[] = [
    {
      actionType: 'setValue',
      actionLabel: '赋值',
      description: '触发组件数据更新'
    },
    {
      actionType: 'addItem',
      actionLabel: '添加行',
      description: '添加行数据',
      innerArgs: ['item', 'index'],
      schema: getArgsWrapper({
        type: 'container',
        body: [
          {
            type: 'input-number',
            name: 'index',
            mode: 'horizontal',
            horizontal: {
              leftFixed: 4 // 需要设置下leftFixed，否则这个字段的控件没有与其他字段的控件左对齐
            },
            label: '插入位置',
            size: 'lg',
            placeholder: '请输入行号，为空则在头部插入'
          },
          {
            type: 'combo',
            name: 'value',
            label: '数据设置',
            multiple: true,
            removable: true,
            required: true,
            addable: true,
            strictMode: false,
            canAccessSuperData: true,
            mode: 'horizontal',
            size: 'lg',
            addButtonText: '新增一行',
            items: [
              {
                type: 'combo',
                name: 'item',
                label: false,
                renderLabel: false,
                multiple: true,
                removable: true,
                required: true,
                addable: true,
                strictMode: false,
                canAccessSuperData: true,
                className: 'm-l',
                size: 'lg',
                mode: 'horizontal',
                addButtonText: '新增字段',
                items: [
                  {
                    name: 'key',
                    type: 'input-text',
                    source: '${__setValueDs}',
                    labelField: 'label',
                    valueField: 'value',
                    required: true
                  },
                  getSchemaTpl('formulaControl', {
                    name: 'val',
                    variables: '${variables}'
                  })
                ]
              }
            ]
          }
        ]
      })
    },
    {
      actionType: 'deleteItem',
      actionLabel: '删除行',
      description: '删除某一行数据',
      innerArgs: ['condition', 'index'],
      schema: getArgsWrapper({
        type: 'container',
        body: [
          {
            type: 'radios',
            name: '__deleteType',
            inputClassName: 'event-action-radio',
            mode: 'horizontal',
            label: '删除方式',
            pipeIn: (value: string, store: any) => {
              if (store.data.__deleteType === undefined) {
                const deleteType = store.data.condition
                  ? 'conditionExpression'
                  : 'rowIndex';
                store.updateData({
                  __deleteType: deleteType
                });
                return deleteType;
              }
              return value;
            },
            horizontal: {
              leftFixed: 4 // 需要设置下leftFixed，否则这个字段的控件没有与其他字段的控件左对齐
            },
            options: [
              {
                label: '指定行号',
                value: 'rowIndex'
              },
              {
                label: '条件表达式',
                value: 'conditionExpression'
              }
            ],
            onChange: (value: string, oldVal: any, data: any, form: any) => {
              form.setValueByName('index', undefined);
              form.setValueByName('condition', undefined);
            }
          },
          {
            type: 'input-text',
            name: 'index',
            mode: 'horizontal',
            horizontal: {
              leftFixed: 4 // 需要设置下leftFixed，否则这个字段的控件没有与其他字段的控件左对齐
            },
            required: true,
            label: '删除范围',
            size: 'lg',
            placeholder: '请输入行号，输入多个则用英文逗号分隔',
            hiddenOn: 'data.__deleteType !== "rowIndex"'
          },
          getSchemaTpl('formulaControl', {
            name: 'condition',
            variables: '${variables}',
            label: '删除条件',
            hiddenOn: 'data.__deleteType !== "conditionExpression"',
            mode: 'horizontal',
            required: true,
            horizontal: {
              leftFixed: 4 // 需要设置下leftFixed，否则这个字段的控件没有与其他字段的控件左对齐
            },
            size: 'lg'
          })
        ]
      })
    },
    // {
    //   actionType: 'reset',
    //   actionLabel: '重置',
    //   description: '将值重置为resetValue，若没有配置resetValue，则清空'
    // },
    {
      actionType: 'clear',
      actionLabel: '清空',
      description: '清空组件数据'
    }
  ];

  panelBodyCreator = (context: BaseEventContext) => {
    const isCRUDBody = context.schema.type === 'crud';
    const i18nEnabled = getI18nEnabled();
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
                type: 'ae-switch-more',
                name: 'needConfirm',
                label: tipedLabel(
                  '确认模式',
                  '开启时，新增、编辑需要点击表格右侧的“保存”按钮才能变更组件数据。未开启时，新增、编辑、删除操作直接改变组件数据。'
                ),
                mode: 'normal',
                formType: 'extend',
                hiddenOnDefault: true,
                form: {
                  body: [
                    {
                      type: i18nEnabled ? 'input-text-i18n' : 'input-text',
                      name: 'confirmBtnLabel',
                      label: '确认按钮名称',
                      placeholder: '确认按钮名称'
                    },
                    getSchemaTpl('icon', {
                      name: 'confirmBtnIcon',
                      label: '确认按钮图标',
                      pipeIn: defaultValue('check')
                    }),
                    {
                      type: i18nEnabled ? 'input-text-i18n' : 'input-text',
                      name: 'cancelBtnLabel',
                      label: '取消按钮名称',
                      placeholder: '取消按钮名称'
                    },
                    getSchemaTpl('icon', {
                      name: 'cancelBtnIcon',
                      label: '取消按钮图标',
                      pipeIn: defaultValue('close')
                    })
                  ]
                },
                pipeIn: defaultValue(true)
              },
              {
                type: 'ae-switch-more',
                name: 'addable',
                label: '可新增',
                mode: 'normal',
                formType: 'extend',
                hiddenOnDefault: true,
                form: {
                  body: [
                    getSchemaTpl('apiControl', {
                      label: '新增接口',
                      name: 'addApi',
                      mode: 'row'
                    }),
                    getSchemaTpl('switch', {
                      name: 'showTableAddBtn',
                      label: '操作栏新增按钮',
                      value: true
                    }),
                    {
                      label: '按钮名称',
                      name: 'addBtnLabel',
                      visibleOn: 'this.showTableAddBtn',
                      type: i18nEnabled ? 'input-text-i18n' : 'input-text'
                    },
                    getSchemaTpl('icon', {
                      name: 'addBtnIcon',
                      label: '按钮图标',
                      visibleOn: 'this.showTableAddBtn',
                      pipeIn: defaultValue('plus')
                    })
                  ]
                }
              },
              {
                type: 'ae-switch-more',
                name: 'copyable',
                label: '可复制',
                mode: 'normal',
                formType: 'extend',
                hiddenOnDefault: true,
                form: {
                  body: [
                    {
                      label: '按钮名称',
                      name: 'copyBtnLabel',
                      type: i18nEnabled ? 'input-text-i18n' : 'input-text'
                    },
                    getSchemaTpl('icon', {
                      name: 'copyBtnIcon',
                      label: '按钮图标',
                      pipeIn: defaultValue('copy')
                    })
                  ]
                }
              },
              {
                type: 'ae-switch-more',
                name: 'editable',
                label: '可编辑',
                mode: 'normal',
                formType: 'extend',
                hiddenOnDefault: true,
                form: {
                  body: [
                    getSchemaTpl('apiControl', {
                      label: '编辑接口',
                      name: 'updateApi',
                      mode: 'row'
                    }),
                    {
                      label: '按钮名称',
                      name: 'editBtnLabel',
                      type: i18nEnabled ? 'input-text-i18n' : 'input-text'
                    },
                    getSchemaTpl('icon', {
                      name: 'editBtnIcon',
                      label: '按钮图标',
                      pipeIn: defaultValue('pencil')
                    })
                  ]
                }
              },
              {
                type: 'ae-switch-more',
                name: 'removable',
                label: '可删除',
                mode: 'normal',
                formType: 'extend',
                hiddenOnDefault: true,
                form: {
                  body: [
                    getSchemaTpl('deleteApi'),
                    {
                      label: '按钮名称',
                      name: 'deleteBtnLabel',
                      type: i18nEnabled ? 'input-text-i18n' : 'input-text'
                    },
                    getSchemaTpl('icon', {
                      name: 'deleteBtnIcon',
                      label: '按钮图标',
                      pipeIn: defaultValue('minus')
                    })
                  ]
                }
              },
              getSchemaTpl('switch', {
                name: 'showIndex',
                label: '显示序号',
                pipeIn: defaultValue(false)
              }),
              {
                type: 'input-number',
                name: 'perPage',
                label: '每页展示条数',
                placeholder: '如果为空则不进行分页'
              },
              {
                type: 'input-number',
                name: 'minLength',
                label: '最小行数',
                pipeIn: defaultValue(0)
              },
              {
                type: 'input-number',
                name: 'maxLength',
                label: '最大行数'
              },
              getSchemaTpl('description'),
              getSchemaTpl('placeholder'),
              getSchemaTpl('labelRemark')
            ]
          },
          {
            title: '高级',
            body: [
              getSchemaTpl('switch', {
                name: 'strictMode',
                label: tipedLabel(
                  '严格模式',
                  '为了性能，默认其他表单项项值变化不会让当前表格更新，有时候为了同步获取其他表单项字段，需要开启这个。'
                ),
                pipeIn: defaultValue(false)
              }),
              getSchemaTpl('switch', {
                name: 'canAccessSuperData',
                label: tipedLabel(
                  '获取父级数据',
                  '是否可以访问父级数据，也就是表单中的同级数据，通常需要跟 “严格模式”属性搭配使用。'
                ),
                pipeIn: defaultValue(false)
              })
            ]
          },
          getSchemaTpl('status', {isFormItem: true}),
          getSchemaTpl('validation', {
            tag: ValidatorTag.MultiSelect
          })
        ])
      },
      {
        title: '外观',
        body: getSchemaTpl('collapseGroup', [
          getSchemaTpl('style:formItem', {renderer: context.info.renderer}),
          getSchemaTpl('style:classNames', {
            schema: [
              getSchemaTpl('className', {
                name: 'rowClassName',
                label: '行样式'
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

  filterProps(props: any) {
    const arr = resolveArrayDatasource(props);

    if (!Array.isArray(arr) || !arr.length) {
      const mockedData: any = {};

      if (Array.isArray(props.columns)) {
        props.columns.forEach((column: any) => {
          if (column.name) {
            setVariable(mockedData, column.name, mockValue(column));
          }
        });
      }

      props.value = repeatArray(mockedData, 1).map((item, index) => ({
        ...item,
        id: index + 1
      }));
    } else {
      // 只取10条预览，否则太多卡顿
      props.value = arr.slice(0, 10);
    }

    return props;
  }

  // 自动插入 label
  beforeInsert(event: PluginEvent<InsertEventContext>) {
    const context = event.context;
    if (
      (context.info.plugin === this ||
        context.node.sameIdChild?.info.plugin === this) &&
      context.region === 'columns'
    ) {
      context.data = {
        ...context.data,
        label: context.data.label ?? context.subRenderer?.name ?? '列名称'
      };
    }
  }

  async buildDataSchemas(node: EditorNodeType, region?: EditorNodeType) {
    const itemsSchema: any = {
      $id: 'inputTableRow',
      type: 'object',
      properties: {}
    };

    const columns: EditorNodeType = node.children.find(
      item => item.isRegion && item.region === 'columns'
    );
    for (let current of columns?.children) {
      const schema = current.schema;
      if (schema.name) {
        itemsSchema.properties[schema.name] = current.info?.plugin
          ?.buildDataSchemas
          ? await current.info.plugin.buildDataSchemas(current, region)
          : {
              type: 'string',
              title: schema.label || schema.name
            };
      }
    }

    if (region?.region === 'columns') {
      return itemsSchema;
    }

    return {
      $id: 'inputTable',
      type: 'array',
      title: '表格表单数据',
      items: itemsSchema
    };
  }
}

registerEditorPlugin(TableControlPlugin);
