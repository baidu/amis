import React from 'react';
import {
  setSchemaTpl,
  getSchemaTpl,
  defaultValue,
  getI18nEnabled,
  tipedLabel,
  JSONPipeOut
} from 'amis-editor-core';
import {findObjectsWithKey} from 'amis-core';
import {Button, Icon} from 'amis-ui';
import type {SchemaObject} from 'amis';
import assign from 'lodash/assign';
import cloneDeep from 'lodash/cloneDeep';
import omit from 'lodash/omit';

import type {RendererProps} from 'amis';
import type {EditorManager} from 'amis-editor-core';

setSchemaTpl('options', () => {
  const i18nEnabled = getI18nEnabled();
  return {
    label: '选项 Options',
    name: 'options',
    type: 'combo',
    multiple: true,
    draggable: true,
    addButtonText: '新增选项',
    scaffold: {
      label: '',
      value: ''
    },
    items: [
      {
        type: i18nEnabled ? 'input-text-i18n' : 'input-text',
        name: 'label',
        placeholder: '名称',
        required: true
      },
      {
        type: 'select',
        name: 'value',
        pipeIn: (value: any) => {
          if (typeof value === 'string') {
            return 'text';
          }
          if (typeof value === 'boolean') {
            return 'boolean';
          }
          if (typeof value === 'number') {
            return 'number';
          }
          return 'text';
        },
        pipeOut: (value: any, oldValue: any) => {
          if (value === 'text') {
            return String(oldValue);
          }
          if (value === 'number') {
            const convertTo = Number(oldValue);
            if (isNaN(convertTo)) {
              return 0;
            }
            return convertTo;
          }
          if (value === 'boolean') {
            return Boolean(oldValue);
          }
          return '';
        },
        options: [
          {label: '文本', value: 'text'},
          {label: '数字', value: 'number'},
          {label: '布尔', value: 'boolean'}
        ]
      },
      {
        type: 'input-number',
        name: 'value',
        placeholder: '值',
        visibleOn: 'typeof this.value === "number"',
        unique: true
      },
      {
        type: 'switch',
        name: 'value',
        placeholder: '值',
        visibleOn: 'typeof this.value === "boolean"',
        unique: true
      },
      {
        type: 'input-text',
        name: 'value',
        placeholder: '值',
        visibleOn:
          'typeof this.value === "undefined" || typeof this.value === "string"',
        unique: true
      }
    ]
  };
});

setSchemaTpl('tree', {
  label: '选项 Options',
  name: 'options',
  type: 'combo',
  multiple: true,
  draggable: true,
  addButtonText: '新增选项',
  description:
    '静态数据暂不支持多级，请切换到代码模式，或者采用 source 接口获取。',
  scaffold: {
    label: '',
    value: ''
  },
  items: [
    getSchemaTpl('optionsLabel'),
    {
      type: 'input-text',
      name: 'value',
      placeholder: '值',
      unique: true
    }
  ]
});

setSchemaTpl('multiple', (schema: any = {}) => {
  return {
    type: 'ae-switch-more',
    mode: 'normal',
    name: 'multiple',
    label: '可多选',
    value: false,
    hiddenOnDefault: true,
    clearChildValuesOnOff: false,
    formType: 'extend',
    ...(schema.patch || {}),
    form: {
      body: schema.replace
        ? schema.body
        : [
            getSchemaTpl('joinValues'),
            getSchemaTpl('delimiter'),
            getSchemaTpl('extractValue'),
            ...(schema?.body || [])
          ]
    }
  };
});

setSchemaTpl('strictMode', {
  type: 'switch',
  label: '严格模式',
  name: 'strictMode',
  value: false,
  mode: 'horizontal',
  horizontal: {
    justify: true,
    left: 8
  },
  inputClassName: 'is-inline ',
  labelRemark: {
    trigger: ['hover', 'focus'],
    setting: true,
    title: '',
    content: '启用严格模式将采用值严格相等比较'
  }
});

setSchemaTpl('checkAllLabel', {
  type: 'input-text',
  name: 'checkAllLabel',
  label: '选项文案',
  value: '全选',
  mode: 'row'
});

setSchemaTpl('checkAll', () => {
  return [
    getSchemaTpl('switch', {
      label: '可全选',
      name: 'checkAll',
      value: false,
      visibleOn: 'this.multiple'
    }),
    {
      type: 'container',
      className: 'ae-ExtendMore mb-2',
      visibleOn: 'this.checkAll && this.multiple',
      body: [
        getSchemaTpl('switch', {
          label: '默认全选',
          name: 'defaultCheckAll',
          value: false
        }),
        getSchemaTpl('checkAllLabel')
      ]
    }
  ];
});

setSchemaTpl('joinValues', (schemaPatches: Record<string, any> = {}) =>
  getSchemaTpl('switch', {
    label: tipedLabel(
      '拼接值',
      '开启后将选中的选项 value 的值用连接符拼接起来，作为当前表单项的值'
    ),
    name: 'joinValues',
    visibleOn: 'this.multiple',
    value: true,
    ...schemaPatches
  })
);

setSchemaTpl('delimiter', {
  type: 'input-text',
  name: 'delimiter',
  label: tipedLabel('拼接符', '将多个值拼接成一个字符串的连接符号'),
  visibleOn: 'this.multiple && this.joinValues',
  pipeIn: defaultValue(',')
});

setSchemaTpl('extractValue', {
  type: 'switch',
  label: tipedLabel(
    '仅提取值',
    '开启后将选中项的 value 封装为数组，关闭后则将整个选项数据封装为数组。'
  ),
  name: 'extractValue',
  inputClassName: 'is-inline',
  visibleOn: 'this.multiple && this.joinValues === false',
  pipeIn: defaultValue(false)
});

setSchemaTpl('creatable', (schema: Partial<SchemaObject> = {}) => {
  return {
    label: tipedLabel('可创建', '配置事件动作可插入或拦截默认交互'),
    type: 'ae-switch-more',
    mode: 'normal',
    name: 'creatable',
    ...schema
  };
});

setSchemaTpl('addApi', () => {
  return getSchemaTpl('apiControl', {
    label: '新增接口',
    name: 'addApi',
    mode: 'row',
    visibleOn: 'this.creatable'
  });
});

setSchemaTpl('createBtnLabel', {
  label: '新增按钮名称',
  name: 'createBtnLabel',
  type: 'input-text',
  placeholder: '新增选项'
});

setSchemaTpl('editable', (schema: Partial<SchemaObject> = {}) => {
  return {
    label: tipedLabel('可编辑', '配置事件动作可插入或拦截默认交互'),
    type: 'ae-switch-more',
    mode: 'normal',
    name: 'editable',
    ...schema
  };
});

setSchemaTpl('editApi', () =>
  getSchemaTpl('apiControl', {
    label: '编辑接口',
    name: 'editApi',
    mode: 'row',
    visibleOn: 'this.editable'
  })
);

setSchemaTpl('editInitApi', () =>
  getSchemaTpl('apiControl', {
    label: '编辑初始化接口',
    name: 'editInitApi',
    mode: 'row',
    visibleOn: 'this.editable'
  })
);

setSchemaTpl('removable', (schema: Partial<SchemaObject> = {}) => {
  return {
    label: tipedLabel('可删除', '配置事件动作可插入或拦截默认交互'),
    type: 'ae-switch-more',
    mode: 'normal',
    name: 'removable',
    ...schema
  };
});

setSchemaTpl('deleteApi', () =>
  getSchemaTpl('apiControl', {
    label: '删除接口',
    name: 'deleteApi',
    mode: 'row',
    visibleOn: 'this.removable'
  })
);

setSchemaTpl('ref', () => {
  // {
  //   type: 'input-text',
  //   name: '$ref',
  //   label: '选择定义',
  //   labelRemark: '输入已经在page中设定好的定义'
  // }
  return null;
});

setSchemaTpl('selectFirst', {
  type: 'switch',
  label: '默认选择第一项',
  name: 'selectFirst',
  mode: 'horizontal',
  horizontal: {
    justify: true,
    left: 8
  },
  inputClassName: 'is-inline '
});

setSchemaTpl('hideNodePathLabel', {
  type: 'switch',
  label: tipedLabel('隐藏路径', '隐藏选中节点的祖先节点文本信息'),
  name: 'hideNodePathLabel',
  mode: 'horizontal',
  horizontal: {
    justify: true,
    left: 8
  },
  inputClassName: 'is-inline'
});

setSchemaTpl('navControl', {
  label: '数据',
  mode: 'normal',
  name: 'source',
  type: 'ae-navSourceControl',
  closeDefaultCheck: true // 关闭默认值设置
});

setSchemaTpl('optionControl', {
  label: '数据',
  mode: 'normal',
  name: 'options',
  type: 'ae-optionControl'
});

/**
 * 新版选项控件: 不带设置默认值功能
 * 备注: 表单项组件默认值支持公式需要
 */
setSchemaTpl('optionControlV2', {
  label: '数据',
  mode: 'normal',
  name: 'options',
  type: 'ae-optionControl',
  closeDefaultCheck: false // 关闭默认值设置
});

/**
 * mapping组件映射源
 */
setSchemaTpl('mapSourceControl', {
  type: 'ae-mapSourceControl',
  label: '映射表',
  mode: 'normal',
  name: 'source'
});

/**
 * 时间轴组件选项控件
 */
setSchemaTpl('timelineItemControl', {
  label: '数据',
  model: 'normal',
  type: 'ae-timelineItemControl'
});

setSchemaTpl('treeOptionControl', {
  label: '数据',
  mode: 'normal',
  name: 'options',
  type: 'ae-treeOptionControl'
});

setSchemaTpl('dataMap', {
  type: 'container',
  body: [
    getSchemaTpl('switch', {
      label: tipedLabel(
        '数据映射',
        '<div> 当开启数据映射时，弹框中的数据只会包含设置的部分，请绑定数据。如：{"a": "\\${a}", "b": 2}。</div>' +
          '<div>当值为 __undefined时，表示删除对应的字段，可以结合{"&": "\\$$"}来达到黑名单效果。</div>'
      ),
      name: 'dataMapSwitch',
      pipeIn: defaultValue(false),
      onChange: (value: any, oldValue: any, model: any, form: any) => {
        if (value) {
          form.setValues({
            data: {},
            dataMap: {},
            withDefaultData: false
          });
        } else {
          form.deleteValueByName('dataMap');
          form.deleteValueByName('data');
        }
      }
    }),
    getSchemaTpl('combo-container', {
      type: 'container',
      className: 'ae-Combo-items',
      visibleOn: 'this.dataMapSwitch',
      body: [
        getSchemaTpl('switch', {
          label: tipedLabel(
            '原始数据打平',
            '开启后，会将所有原始数据打平设置到 data 中，并在此基础上定制'
          ),
          name: 'withDefaultData',
          className: 'mb-0',
          pipeIn: defaultValue(false),
          onChange: (value: boolean, origin: boolean, item: any, form: any) => {
            const data = form.data?.data || {};
            form.setValues({
              data: value
                ? {
                    ...data,
                    '&': '$$'
                  }
                : data && data['&'] === '$$'
                ? omit(data, '&')
                : data
            });
          }
        }),
        {
          type: 'input-kv',
          syncDefaultValue: false,
          name: 'dataMap',
          className: 'block -mt-5',
          deleteBtn: {
            icon: 'fa fa-trash'
          },
          updatePristineAfterStoreDataReInit: true,
          itemsWrapperClassName: 'ae-Combo-items',
          pipeIn: (e: any, form: any) => {
            const data = cloneDeep(form.data?.data);
            return data && data['&'] === '$$' ? omit(data, '&') : data;
          },
          onChange: (value: any, oldValue: any, model: any, form: any) => {
            const newData = form.data.withDefaultData
              ? assign({'&': '$$'}, value)
              : cloneDeep(value);
            form.setValues({
              data: newData
            });
            return value;
          }
        }
      ]
    })
  ]
});

export interface OptionControlParams {
  manager: EditorManager;
  /** switch-more 控制器的配置 */
  controlSchema?: Record<string, any>;
  /** 子表单中的配置集合 */
  collections?: Record<string, any>[];
  /** 是否替换除了addControls以外的其他属性 */
  replace?: boolean;
}

/**
 * 选项类组件新增单选项控件
 */
setSchemaTpl('optionAddControl', (params: OptionControlParams) => {
  const {manager, controlSchema = {}, collections = [], replace} = params || {};
  const customFormItems = Array.isArray(collections)
    ? collections
    : [collections];

  return getSchemaTpl('creatable', {
    formType: 'extend',
    autoFocus: false,
    ...controlSchema,
    form: {
      body: [
        ...(replace
          ? customFormItems
          : [...customFormItems, getSchemaTpl('createBtnLabel')]),
        getSchemaTpl('addApi'),
        /** 用于关闭开关后清空相关配置 */
        {
          type: 'hidden',
          name: 'addDialog'
        },
        {
          name: 'addControls',
          asFormItem: true,
          label: false,
          children: (props: RendererProps) => {
            const {value, data: ctx, onBulkChange} = props || {};
            const {addApi, createBtnLabel, addDialog, optionLabel} = ctx || {};
            /** 新增表单弹窗 */
            const scaffold = {
              type: 'dialog',
              title: createBtnLabel || `新增${optionLabel || '选项'}`,
              ...addDialog,
              body: {
                /** 标识符，用于 SubEditor 确认后找到对应的 Schema */
                'amis-select-addControls': true,
                'type': 'form',
                'api': addApi,
                /** 这里是为了兼容旧版，比如type: text类型的组件会被渲染为input-text */
                'controls': [
                  ...(value
                    ? Array.isArray(value)
                      ? value
                      : [value]
                    : [
                        /** FIXME: 这里是没做任何配置时的默认 scaffold */
                        {
                          type: 'input-text',
                          name: 'label',
                          label: false,
                          required: true,
                          placeholder: '请输入名称'
                        }
                      ])
                ]
              }
            };

            return (
              <div className="flex">
                <Button
                  className="w-full flex flex-col items-center"
                  level="enhance"
                  size="sm"
                  onClick={() => {
                    manager.openSubEditor({
                      title: '配置新增表单',
                      value: scaffold,
                      onChange: (value, diff: any) => {
                        const pureSchema = JSONPipeOut(
                          value,
                          (key, propValue) =>
                            key.substring(0, 2) === '__' || key === 'id'
                        );
                        const addDialog = omit(pureSchema, [
                          'type',
                          'body',
                          'id'
                        ]);
                        const targetForm = findObjectsWithKey(
                          pureSchema,
                          'amis-select-addControls'
                        );
                        const addApi = targetForm?.[0]?.api;
                        const addControls =
                          targetForm?.[0]?.controls ?? targetForm?.[0]?.body;

                        onBulkChange({addApi, addDialog, addControls});
                      }
                    });
                  }}
                >
                  {value ? '已配置新增表单' : '配置新增表单'}
                </Button>
                {value && (
                  <Button
                    iconOnly
                    className="ml-3"
                    size="sm"
                    onClick={() => onBulkChange({addControls: undefined})}
                  >
                    <Icon icon="remove" className="icon" />
                  </Button>
                )}
              </div>
            );
          }
        }
        // {
        //   label: '按钮位置',
        //   name: 'valueType',
        //   type: 'button-group-select',
        //   size: 'sm',
        //   tiled: true,
        //   value: 'asUpload',
        //   mode: 'row',
        //   options: [
        //     {
        //       label: '顶部',
        //       value: ''
        //     },
        //     {
        //       label: '底部',
        //       value: ''
        //     },
        //   ],
        // }
      ]
    }
  });
});

/**
 * 选项类组件编辑单选项控件
 */
setSchemaTpl('optionEditControl', (params: OptionControlParams) => {
  const {manager, controlSchema = {}, collections = [], replace} = params || {};
  const customFormItems = Array.isArray(collections)
    ? collections
    : [collections];

  return getSchemaTpl('editable', {
    formType: 'extend',
    autoFocus: false,
    hiddenOnDefault: false,
    ...controlSchema,
    form: {
      body: [
        ...(replace ? customFormItems : [...customFormItems]),
        getSchemaTpl('editInitApi'),
        getSchemaTpl('editApi'),
        /** 用于关闭开关后清空相关配置 */
        {
          type: 'hidden',
          name: 'editDialog'
        },
        {
          name: 'editControls',
          asFormItem: true,
          label: false,
          children: (props: RendererProps) => {
            const {value, data: ctx, onBulkChange} = props || {};
            const {editApi, editInitApi, editDialog, optionLabel} = ctx || {};
            /** 新增表单弹窗 */
            const scaffold = {
              type: 'dialog',
              title: '编辑选项',
              ...editDialog,
              body: {
                /** 标识符，用于 SubEditor 确认后找到对应的 Schema */
                'amis-select-editControls': true,
                'type': 'form',
                'api': editApi,
                'initApi': editInitApi,
                /** 这里是为了兼容旧版，比如type: text类型的组件会被渲染为input-text */
                'controls': [
                  ...(value
                    ? Array.isArray(value)
                      ? value
                      : [value]
                    : [
                        /** FIXME: 这里是没做任何配置时的默认 scaffold */
                        {
                          type: 'input-text',
                          name: 'label',
                          label: false,
                          required: true,
                          placeholder: '请输入名称'
                        }
                      ])
                ]
              }
            };

            return (
              <div className="flex">
                <Button
                  className="w-full flex flex-col items-center"
                  level="enhance"
                  size="sm"
                  onClick={() => {
                    manager.openSubEditor({
                      title: '配置编辑表单',
                      value: scaffold,
                      onChange: (value, diff: any) => {
                        const pureSchema = JSONPipeOut(
                          value,
                          (key, propValue) =>
                            key.substring(0, 2) === '__' || key === 'id'
                        );
                        const editDialog = omit(pureSchema, [
                          'type',
                          'body',
                          'id'
                        ]);
                        const targetForm = findObjectsWithKey(
                          pureSchema,
                          'amis-select-editControls'
                        );
                        const editApi = targetForm?.[0]?.api;
                        const editInitApi = targetForm?.[0]?.initApi;
                        const editControls =
                          targetForm?.[0]?.controls ?? targetForm?.[0]?.body;

                        onBulkChange({
                          editApi,
                          editInitApi,
                          editDialog,
                          editControls
                        });
                      }
                    });
                  }}
                >
                  {value ? '已配置编辑表单' : '配置编辑表单'}
                </Button>
                {value && (
                  <Button
                    iconOnly
                    className="ml-3"
                    size="sm"
                    onClick={() => onBulkChange({editControls: undefined})}
                  >
                    <Icon icon="remove" className="icon" />
                  </Button>
                )}
              </div>
            );
          }
        }
      ]
    }
  });
});

/**
 * 选项类组件删除单选项控件
 */
setSchemaTpl('optionDeleteControl', (params: OptionControlParams) => {
  const {manager, controlSchema = {}, collections = [], replace} = params || {};
  const customFormItems = Array.isArray(collections)
    ? collections
    : [collections];

  return getSchemaTpl('removable', {
    formType: 'extend',
    autoFocus: false,
    hiddenOnDefault: false,
    ...controlSchema,
    form: {
      body: [
        ...(replace ? customFormItems : [...customFormItems]),
        getSchemaTpl('deleteApi')
      ]
    }
  });
});
