import React from 'react';
import {resolveVariable, Button} from 'amis';
import flatten from 'lodash/flatten';
import {defaultValue, getSchemaTpl} from 'amis-editor-core';
import {registerEditorPlugin} from 'amis-editor-core';
import {
  BaseEventContext,
  BasePlugin,
  BasicSubRenderInfo,
  InsertEventContext,
  PluginEvent,
  RendererEventContext,
  ScaffoldForm,
  SubRendererInfo,
  RegionConfig
} from 'amis-editor-core';
import {setVariable} from 'amis-core';
import {repeatArray} from 'amis-editor-core';
import {mockValue} from 'amis-editor-core';

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
        label: 'color',
        name: 'color',
        quickEdit: {
          type: 'input-color'
        }
      },
      {
        label: '说明文字',
        name: 'name',
        quickEdit: {
          type: 'input-text',
          mode: 'inline'
        }
      }
    ],
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

  scaffoldForm: ScaffoldForm = {
    title: '快速构建表格',
    body: [
      {
        name: 'columns',
        type: 'combo',
        multiple: true,
        label: false,
        addButtonText: '新增一列',
        draggable: true,
        items: [
          {
            type: 'input-text',
            name: 'label',
            placeholder: '标题'
          },
          {
            type: 'input-text',
            name: 'name',
            placeholder: '绑定字段名'
          },
          {
            type: 'select',
            name: 'type',
            placeholder: '类型',
            value: 'text',
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
                value: 'image',
                label: '图片'
              },
              {
                value: 'date',
                label: '日期'
              },
              // {
              //     value: 'datetime',
              //     label: '日期时间'
              // },
              // {
              //     value: 'time',
              //     label: '时间'
              // },
              {
                value: 'progress',
                label: '进度'
              },
              {
                value: 'status',
                label: '状态'
              },
              {
                value: 'mapping',
                label: '映射'
              },
              {
                value: 'operation',
                label: '操作栏'
              }
            ]
          }
        ]
      }
    ],
    canRebuild: true
  };

  panelTitle = '表格编辑';
  panelBodyCreator = (context: BaseEventContext) => {
    const isCRUDBody = context.schema.type === 'crud';

    return getSchemaTpl('tabs', [
      {
        title: '常规',
        body: flatten([
          // {
          //   children: (
          //     <div className="m-b">
          //       <Button
          //         level="success"
          //         size="sm"
          //         block
          //         onClick={() => this.handleEditFormItem()}
          //       >
          //         配置列信息
          //       </Button>
          //     </div>
          //   )
          // },
          getSchemaTpl('formItemName', {
            required: true
          }),
          getSchemaTpl('label'),
          getSchemaTpl('description'),
          getSchemaTpl('switch', {
            label: '是否可新增',
            name: 'addable'
          }),
          {
            type: 'input-text',
            name: 'addBtnLabel',
            label: '增加按钮名称',
            visibleOn: 'data.addable',
            pipeIn: defaultValue('')
          },
          getSchemaTpl('icon', {
            name: 'addBtnIcon',
            label: '增加按钮图标',
            className: 'fix-icon-picker-overflow',
            visibleOn: 'data.addable'
          }),
          getSchemaTpl('api', {
            name: 'addApi',
            label: '新增时提交的 API',
            visibleOn: 'data.addable'
          }),
          getSchemaTpl('switch', {
            label: '是否可删除',
            name: 'removable'
          }),
          {
            type: 'input-text',
            name: 'deleteBtnLabel',
            label: '删除按钮名称',
            visibleOn: 'data.removable',
            pipeIn: defaultValue('')
          },
          getSchemaTpl('icon', {
            name: 'deleteBtnIcon',
            label: '删除按钮图标',
            className: 'fix-icon-picker-overflow',
            visibleOn: 'data.removable'
          }),
          getSchemaTpl('api', {
            name: 'deleteApi',
            label: '删除时提交的 API',
            visibleOn: 'data.removable'
          }),
          getSchemaTpl('switch', {
            label: '是否可编辑',
            name: 'editable'
          }),
          {
            type: 'input-text',
            name: 'editBtnLabel',
            label: '编辑按钮名称',
            visibleOn: 'data.editable',
            pipeIn: defaultValue('')
          },
          getSchemaTpl('icon', {
            name: 'editBtnIcon',
            label: '编辑按钮图标',
            className: 'fix-icon-picker-overflow',
            visibleOn: 'data.editable'
          }),
          getSchemaTpl('switch', {
            label: '是否可复制',
            name: 'copyable'
          }),
          {
            type: 'input-text',
            name: 'copyBtnLabel',
            label: '复制按钮名称',
            visibleOn: 'data.copyable',
            pipeIn: defaultValue('')
          },
          getSchemaTpl('icon', {
            name: 'copyBtnIcon',
            label: '复制按钮图标',
            className: 'fix-icon-picker-overflow',
            visibleOn: 'data.copyable'
          }),
          getSchemaTpl('api', {
            name: 'updateApi',
            label: '修改时提交的 API',
            visibleOn: 'data.editable'
          }),
          {
            type: 'input-text',
            name: 'confirmBtnLabel',
            label: '确认编辑按钮名称',
            visibleOn: 'data.editable',
            pipeIn: defaultValue('')
          },
          getSchemaTpl('icon', {
            name: 'confirmBtnIcon',
            label: '确认编辑按钮图标',
            className: 'fix-icon-picker-overflow',
            visibleOn: 'data.editable'
          }),
          {
            type: 'input-text',
            name: 'cancelBtnLabel',
            label: '取消编辑按钮名称',
            visibleOn: 'data.editable',
            pipeIn: defaultValue('')
          },
          getSchemaTpl('icon', {
            name: 'cancelBtnIcon',
            label: '取消编辑按钮图标',
            className: 'fix-icon-picker-overflow',
            visibleOn: 'data.editable'
          }),
          getSchemaTpl('switch', {
            label: '是否可拖拽排序',
            name: 'draggable'
          }),

          getSchemaTpl('switch', {
            label: '确认模式',
            name: 'needConfirm'
          }),
          getSchemaTpl('switch', {
            label: '严格模式',
            name: 'strictMode', // 同时需要配置strictMode
            value: true
          }),

          getSchemaTpl('switch', {
            label: '获取父级数据',
            labelRemark: {
              trigger: 'click',
              className: 'm-l-xs',
              rootClose: true,
              content:
                '配置"canAccessSuperData": true 同时配置 "strictMode": false 开启此特性，初始会自动映射父级数据域的同名变量。需要注意的是，这里只会初始会映射，一旦修改过就是当前行数据为主了。也就是说，表单项类型的，只会起到初始值的作用',
              placement: 'left'
            },
            onChange: (value: any, oldValue: any, model: any, form: any) => {
              if (value && !oldValue) {
                form.setValues({strictMode: false});
              } else {
                form.setValues({strictMode: true});
              }
            },
            name: 'canAccessSuperData' // 同时需要配置strictMode
          })
        ])
      },
      {
        title: '外观',
        body: [
          getSchemaTpl('formItemMode'),
          getSchemaTpl('horizontalMode'),
          getSchemaTpl('horizontal', {
            label: '',
            visibleOn:
              '(data.$$formMode == "horizontal" || data.mode == "horizontal") && data.label !== false && data.horizontal'
          }),
          getSchemaTpl('className'),
          getSchemaTpl('className', {
            label: 'Label CSS 类名',
            name: 'labelClassName'
          }),
          getSchemaTpl('className', {
            label: 'Input CSS 类名',
            name: 'inputClassName'
          }),
          getSchemaTpl('className', {
            label: '描述 CSS 类名',
            name: 'descriptionClassName',
            visibleOn: 'data.description'
          })
        ]
      },
      {
        title: '显隐',
        body: [getSchemaTpl('disabled'), getSchemaTpl('visible')]
      },
      {
        title: '其他',
        body: [
          getSchemaTpl('required'),
          getSchemaTpl('validateOnChange'),
          getSchemaTpl('submitOnChange')
        ]
      }
    ]);
  };

  filterProps(props: any) {
    const arr = Array.isArray(props.value)
      ? props.value
      : typeof props.source === 'string'
      ? resolveVariable(props.source, props.data)
      : resolveVariable('items', props.data);

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
}

registerEditorPlugin(TableControlPlugin);
