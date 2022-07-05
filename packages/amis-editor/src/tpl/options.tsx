import {setSchemaTpl, getSchemaTpl, defaultValue} from 'amis-editor-core';
import {tipedLabel} from 'amis-editor-core';
import {SchemaObject} from 'amis/lib/Schema';

setSchemaTpl('options', {
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
      type: 'input-text',
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
      visibleOn: 'typeof data.value === "number"',
      unique: true
    },
    {
      type: 'switch',
      name: 'value',
      placeholder: '值',
      visibleOn: 'typeof data.value === "boolean"',
      unique: true
    },
    {
      type: 'input-text',
      name: 'value',
      placeholder: '值',
      visibleOn:
        'typeof data.value === "undefined" || typeof data.value === "string"',
      unique: true
    }
  ]
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
});

setSchemaTpl('multiple', (schema: any = {}) => {
  return {
    type: 'ae-switch-more',
    mode: 'normal',
    name: 'multiple',
    label: '可多选',
    value: false,
    hiddenOnDefault: true,
    formType: 'extend',
    form: {
      body: schema.replace
        ? schema.body
        : [
            getSchemaTpl('joinValues'),
            getSchemaTpl('delimiter'),
            getSchemaTpl('extractValue'),
            ...[schema.body || []]
          ]
    }
  };
});

setSchemaTpl('checkAll', () => {
  return [
    getSchemaTpl('switch', {
      label: '可全选',
      name: 'checkAll',
      value: false,
      visibleOn: 'data.multiple'
    }),
    {
      type: 'container',
      className: 'ae-ExtendMore mb-2',
      visibleOn: 'data.checkAll && data.multiple',
      body: [
        getSchemaTpl('switch', {
          label: '默认全选',
          name: 'defaultCheckAll',
          value: false
        }),
        {
          type: 'input-text',
          name: 'checkAllLabel',
          label: '选项文案',
          value: '全选',
          mode: 'row'
        }
      ]
    }
  ];
});

setSchemaTpl('joinValues', () =>
  getSchemaTpl('switch', {
    label: tipedLabel(
      '拼接值',
      '开启后将选中的选项 value 的值用连接符拼接起来，作为当前表单项的值'
    ),
    name: 'joinValues',
    visibleOn: 'data.multiple',
    value: true
  })
);

setSchemaTpl('delimiter', {
  type: 'input-text',
  name: 'delimiter',
  label: tipedLabel('拼接符', '将多个值拼接成一个字符串的连接符号'),
  visibleOn: 'data.multiple && data.joinValues',
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
  visibleOn: 'data.multiple && data.joinValues === false',
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
    visibleOn: 'data.creatable'
  });
});

setSchemaTpl('createBtnLabel', {
  label: '按钮名称',
  name: 'createBtnLabel',
  type: 'input-text',
  placeholder: '新建'
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
    visibleOn: 'data.editable'
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
    visibleOn: 'data.removable'
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
  label: '是否默认选择第一个',
  name: 'selectFirst'
});

setSchemaTpl('hideNodePathLabel', {
  type: 'switch',
  label: tipedLabel('隐藏路径', '隐藏选中节点的祖先节点文本信息'),
  name: 'hideNodePathLabel',
  inputClassName: 'is-inline'
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
  closeDefaultCheck: true // 关闭默认值设置
});
