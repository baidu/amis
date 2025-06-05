import {
  setSchemaTpl,
  getSchemaTpl,
  defaultValue,
  isObject,
  tipedLabel,
  getI18nEnabled,
  EditorManager
} from 'amis-editor-core';
import {render, type SchemaObject} from 'amis';
import flatten from 'lodash/flatten';
import {InputComponentName} from '../component/InputComponentName';
import {FormulaDateType} from '../renderer/FormulaControl';
import type {VariableItem} from 'amis-ui/lib/components/formula/CodeEditor';
import reduce from 'lodash/reduce';
import map from 'lodash/map';
import omit from 'lodash/omit';
import keys from 'lodash/keys';
import type {Schema} from 'amis';

import type {DSField} from '../builder';

/**
 * @deprecated 兼容当前组件的switch
 */
setSchemaTpl('switch', {
  type: 'switch',
  mode: 'horizontal',
  horizontal: {
    justify: true,
    left: 8
  },
  inputClassName: 'is-inline '
});

/**
 * 分割线
 */
setSchemaTpl('divider', {
  type: 'divider',
  className: 'mx-0'
});

/**
 * 带单位的控件
 */
setSchemaTpl(
  'withUnit',
  (config: {name: string; label: string; control: any; unit: string}) => {
    return {
      type: 'input-group',
      name: config.name,
      label: config.label,
      body: [
        config.control,
        {
          type: 'tpl',
          addOnclassName: 'border-0 bg-none',
          tpl: config.unit
        }
      ]
    };
  }
);

/**
 * 表单项字段name
 */
setSchemaTpl('formItemName', {
  label: '字段名',
  name: 'name',
  type: 'ae-DataBindingControl',
  onBindingChange(field: DSField, onBulkChange: (value: any) => void) {
    onBulkChange(field.resolveEditSchema?.() || {label: field.label});
  }
  // validations: {
  //     matchRegexp: /^[a-z\$][a-z0-0\-_]*$/i
  // },
  // validationErrors: {
  //     "matchRegexp": "请输入合法的变量名"
  // },
  // validateOnChange: false
});

setSchemaTpl(
  'formItemExtraName',
  getSchemaTpl('formItemName', {
    required: false,
    label: tipedLabel(
      '结尾字段名',
      '配置了结尾字段名，该组件将开始和结尾存成两个字段'
    ),
    name: 'extraName'
  })
);

setSchemaTpl(
  'formItemMode',
  (config: {
    // 是不是独立表单，没有可以集成的内容
    isForm: boolean;
    /** 预设布局 */
    defaultValue?: 'inline' | 'horizontal' | 'normal' | '';
  }) => ({
    label: '布局',
    name: 'mode',
    type: 'select',
    pipeIn: defaultValue(config?.defaultValue ?? ''),
    options: [
      {
        label: '内联',
        value: 'inline'
      },
      {
        label: '水平',
        value: 'horizontal'
      },
      {
        label: '垂直',
        value: 'normal'
      },
      !config?.isForm && {
        label: '继承',
        value: ''
      },
      config?.isForm && {
        label: '网格',
        value: 'flex'
      }
    ].filter(i => i),
    pipeOut: (v: string) => (v ? v : undefined)
  })
);
setSchemaTpl('formulaControl', (schema: object = {}) => {
  return {
    type: 'ae-formulaControl',
    variableMode: 'tree',
    ...schema
  };
});

setSchemaTpl('expressionFormulaControl', (schema: object = {}) => {
  return {
    type: 'ae-expressionFormulaControl',
    variableMode: 'tree',
    ...schema
  };
});

setSchemaTpl('conditionFormulaControl', (schema: object = {}) => {
  return {
    type: 'ae-conditionFormulaControl',
    ...schema
  };
});

setSchemaTpl('textareaFormulaControl', (schema: object = {}) => {
  return {
    type: 'ae-textareaFormulaControl',
    variableMode: 'tree',
    ...schema
  };
});

setSchemaTpl('tplFormulaControl', (schema: object = {}) => {
  return {
    type: 'ae-tplFormulaControl',
    variableMode: 'tree',
    ...schema
  };
});

setSchemaTpl('DataPickerControl', (schema: object = {}) => {
  return {
    type: 'ae-DataPickerControl',
    ...schema
  };
});

setSchemaTpl('formItemInline', {
  type: 'switch',
  label: '表单项内联',
  name: 'inline',
  visibleOn: 'this.mode != "inline"',
  inputClassName: 'is-inline',
  pipeIn: defaultValue(false)
  // onChange: (value:any, origin:any, item:any, form:any) => form.getValueByName('size') === "full" && form.setValueByName('')
});

setSchemaTpl('formItemSize', {
  name: 'size',
  label: '控件宽度',
  type: 'select',
  pipeIn: defaultValue('full'),
  // mode: 'inline',
  // className: 'w-full',
  options: [
    {
      label: '极小',
      value: 'xs'
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
      label: '默认（占满）',
      value: 'full'
    }
  ]
});

setSchemaTpl('minLength', {
  name: 'minLength',
  type: 'input-number',
  label: '限制最小数量'
});

setSchemaTpl('maxLength', {
  name: 'maxLength',
  type: 'input-number',
  label: '限制最大数量'
});

/**
 * 表单项名称label
 */
setSchemaTpl('label', {
  label: '标题',
  name: 'label',
  type: 'input-text',
  pipeIn(v: any) {
    return v === false ? '' : v;
  }
});

/** 文件上传按钮名称 btnLabel */
setSchemaTpl('btnLabel', {
  type: 'input-text',
  name: 'btnLabel',
  label: '按钮名称',
  value: '文件上传'
});

setSchemaTpl('labelHide', () =>
  getSchemaTpl('switch', {
    name: 'label',
    label: tipedLabel('隐藏标题', '隐藏后，水平布局时标题宽度为0'),
    pipeIn: (value: any) => value === false,
    pipeOut: (value: any) => (value === true ? false : ''),
    visibleOn:
      'this.__props__ && this.__props__.formMode === "horizontal" || this.mode === "horizontal"'
  })
);

setSchemaTpl('theme:labelHide', () =>
  getSchemaTpl('switch', {
    name: '__label',
    label: '隐藏标题',
    value: '${label === false}',
    onChange: (value: any, origin: any, item: any, form: any) => {
      if (value) {
        form.setValueByName(
          '$$tempLabel',
          form.getValueByName('label') || item.label
        );
        form.setValueByName('label', false);
      } else {
        form.setValueByName(
          'label',
          form.getValueByName('$$tempLabel') || item['$$tempLabel'] || ''
        );
      }
    }
  })
);

setSchemaTpl('placeholder', {
  label: '占位提示',
  name: 'placeholder',
  type: 'input-text',
  placeholder: '空内容提示占位'
});

setSchemaTpl('startPlaceholder', {
  type: 'input-text',
  name: 'startPlaceholder',
  label: '前占位提示',
  pipeIn: defaultValue('开始时间')
});

setSchemaTpl('endPlaceholder', {
  type: 'input-text',
  name: 'endPlaceholder',
  label: '后占位提示',
  pipeIn: defaultValue('结束时间')
});

setSchemaTpl(
  'tabs',
  (
    config: Array<{
      title: string;
      className?: string;
      body: Array<SchemaObject>;
    }>
  ) => {
    return {
      type: 'tabs',
      tabsMode: 'line', // tiled
      className: 'editor-prop-config-tabs',
      linksClassName: 'editor-prop-config-tabs-links aa',
      contentClassName:
        'no-border editor-prop-config-tabs-cont hoverShowScrollBar',
      tabs: config
        .filter(item => item)
        .map(item => {
          const newSchema = {
            ...item,
            body: Array.isArray(item.body) ? flatten(item.body) : [item.body]
          };
          // 新版配置面板空隙在子组件中，兼容一下
          if (newSchema.body[0]?.type === 'collapse-group') {
            newSchema.className = (newSchema.className || '') + ' p-none';
          }
          return newSchema;
        })
    };
  }
);

setSchemaTpl(
  'collapse',
  (
    config: Array<{
      title: string;
      body: Array<any>;
    }>
  ) => {
    return {
      type: 'wrapper',
      className: 'editor-prop-config-collapse',
      body: config
        .filter(item => item)
        .map(item => ({
          type: 'collapse',
          headingClassName: 'editor-prop-config-head',
          bodyClassName: 'editor-prop-config-body',
          ...item,
          body: flatten(item.body)
        }))
    };
  }
);

setSchemaTpl(
  'fieldSet',
  (config: {
    title: string;
    body: Array<any>;
    collapsed?: boolean;
    collapsable?: boolean;
  }) => {
    return {
      collapsable: true,
      collapsed: false,
      ...config,
      type: 'fieldset',
      title: config.title,
      body: flatten(config.body.filter((item: any) => item))
    };
  }
);

setSchemaTpl(
  'collapseGroup',
  (
    config: Array<{
      title: string;
      key: string;
      visibleOn: string;
      body: Array<any>;
      collapsed?: boolean;
    }>
  ) => {
    const collapseGroupBody = config
      .filter(
        item => item && Array.isArray(item?.body) && item?.body.length > 0
      )
      .map(item => ({
        type: 'collapse',
        headingClassName: 'ae-formItemControl-header ae-Collapse-header',
        bodyClassName: 'ae-formItemControl-body',
        ...item,
        collapsed: item.collapsed ?? false,
        key: item.title,
        body: flatten(item.body)
      }));
    return {
      type: 'collapse-group',
      activeKey: collapseGroupBody
        .filter(item => item && !item.collapsed)
        .map(panel => panel.title),
      expandIconPosition: 'right',
      expandIcon: {
        type: 'icon',
        icon: 'chevron-right'
      },
      className: 'ae-formItemControl ae-styleControl',
      body: collapseGroupBody
    };
  }
);

setSchemaTpl('clearable', {
  type: 'switch',
  label: '可清除',
  name: 'clearable',
  inputClassName: 'is-inline'
});

setSchemaTpl('hint', {
  label: '输入框提示',
  type: 'input-text',
  name: 'hint',
  description: '当输入框获得焦点的时候显示，用来提示用户输入内容。'
});

setSchemaTpl('icon', {
  label: '图标',
  type: 'icon-picker',
  name: 'icon',
  placeholder: '点击选择图标',
  clearable: true,
  description: ''
});

setSchemaTpl(
  'valueFormula',
  (config?: {
    mode?: string; // 自定义展示默认值，上下展示: vertical, 左右展示: horizontal
    label?: string; // 表单项 label
    name?: string; // 表单项 name
    header?: string; // 表达式弹窗标题
    placeholder?: string; // 表达式自定义渲染 占位符
    rendererSchema?: any;
    rendererWrapper?: boolean; // 自定义渲染器 是否需要浅色边框包裹
    needDeleteProps?: string[]; // 需要剔除的其他属性，默认 deleteProps 中包含一些通用属性
    useSelectMode?: boolean; // 是否使用Select选择设置模式，需要确保 rendererSchema.options 不为 undefined
    valueType?: string; // 用于设置期望数值类型
    visibleOn?: string; // 用于控制显示的表达式
    DateTimeType?: FormulaDateType; // 日期类组件要支持 表达式 & 相对值
    variables?: Array<VariableItem> | Function; // 自定义变量集合
    requiredDataPropsVariables?: boolean; // 是否再从amis数据域中取变量结合， 默认 false
    variableMode?: 'tabs' | 'tree'; // 变量展现模式
    className?: string; // 外层类名
    [key: string]: any; // 其他属性，例如包括表单项pipeIn\Out 等等
  }) => {
    const {
      rendererSchema,
      useSelectMode,
      mode,
      visibleOn,
      label,
      name,
      rendererWrapper,
      needDeleteProps,
      valueType,
      header,
      placeholder,
      DateTimeType,
      variables,
      requiredDataPropsVariables,
      variableMode,
      ...rest
    } = config || {};
    let curRendererSchema = rendererSchema;

    if (useSelectMode && curRendererSchema) {
      if (typeof curRendererSchema === 'function') {
        curRendererSchema = (schema: Schema) => ({
          ...rendererSchema(schema),
          type: 'select'
        });
      } else if (curRendererSchema.options) {
        curRendererSchema = {
          ...curRendererSchema,
          type: 'select'
        };
      }
    }

    return {
      type: 'group',
      // 默认左右展示
      // 上下展示，可避免 自定义渲染器 出现挤压
      mode: mode === 'vertical' ? 'vertical' : 'horizontal',
      visibleOn,
      className: config?.className,
      body: [
        getSchemaTpl('formulaControl', {
          label: label ?? '默认值',
          name: name || 'value',
          rendererWrapper,
          needDeleteProps,
          valueType,
          header,
          placeholder,
          rendererSchema: curRendererSchema,
          variables,
          requiredDataPropsVariables,
          variableMode,
          DateTimeType: DateTimeType ?? FormulaDateType.NotDate,
          ...rest
        })
      ]
    };
  }
);

setSchemaTpl('inputType', {
  label: '输入类型',
  name: 'type',
  type: 'select',
  creatable: false,
  options: [
    {
      label: '文本',
      value: 'input-text'
    },
    {
      label: '密码',
      value: 'input-password'
    },
    {
      label: '邮箱',
      value: 'input-email'
    },
    {
      label: 'URL',
      value: 'input-url'
    }
  ]
});

setSchemaTpl('selectDateType', {
  label: '日期类型',
  name: 'type',
  type: 'select',
  creatable: false,
  options: [
    {
      label: '日期',
      value: 'input-date'
    },
    {
      label: '日期时间',
      value: 'input-datetime'
    },
    {
      label: '时间',
      value: 'input-time'
    },
    {
      label: '月份',
      value: 'input-month'
    },
    {
      label: '季度',
      value: 'input-quarter'
    },
    {
      label: '年份',
      value: 'input-year'
    }
  ]
});

setSchemaTpl('selectDateRangeType', {
  label: '日期类型',
  name: 'type',
  type: 'select',
  creatable: false,
  options: [
    {
      label: '日期',
      value: 'input-date-range'
    },
    {
      label: '日期时间',
      value: 'input-datetime-range'
    },
    {
      label: '时间',
      value: 'input-time-range'
    },
    {
      label: '月份',
      value: 'input-month-range'
    },
    {
      label: '季度',
      value: 'input-quarter-range'
    },
    {
      label: '年份',
      value: 'input-year-range'
    }
  ]
});

setSchemaTpl(
  'optionsMenuTpl',
  (config: {manager: EditorManager; [key: string]: any}) => {
    const {manager, ...rest} = config;
    // 设置 options 中变量集合
    function getOptionVars(that: any) {
      let schema = manager.store.valueWithoutHiddenProps;
      let children = [];
      if (schema.labelField) {
        children.push({
          label: '显示字段',
          value: schema.labelField,
          tag: typeof schema.labelField
        });
      }
      if (schema.valueField) {
        children.push({
          label: '值字段',
          value: schema.valueField,
          tag: typeof schema.valueField
        });
      }
      if (schema.options) {
        let optionItem = reduce(
          schema.options,
          function (result, item) {
            return {...result, ...item};
          },
          {}
        );
        delete optionItem?.$$id;

        optionItem = omit(
          optionItem,
          map(children, item => item?.label)
        );

        let otherItem = map(keys(optionItem), item => ({
          label:
            item === 'label' ? '选项文本' : item === 'value' ? '选项值' : item,
          value: item,
          tag: typeof optionItem[item]
        }));

        children.push(...otherItem);
      }
      let variablesArr = [
        {
          label: '选项字段',
          children
        }
      ];
      return variablesArr;
    }

    return getSchemaTpl('textareaFormulaControl', {
      mode: 'normal',
      label: tipedLabel(
        '选项模板',
        '自定义选项渲染模板，支持JSX、数据域变量使用'
      ),
      name: 'menuTpl',
      variables: getOptionVars,
      requiredDataPropsVariables: true,
      ...rest
    });
  }
);

/**
 * 数据源绑定
 */
setSchemaTpl('sourceBindControl', (schema: object = {}) => ({
  type: 'ae-formulaControl',
  name: 'source',
  label: '数据',
  variableMode: 'tree',
  inputMode: 'input-group',
  placeholder: '请输入表达式',
  requiredDataPropsVariables: true,
  ...schema
}));

setSchemaTpl('menuTpl', () => {
  return getSchemaTpl('textareaFormulaControl', {
    mode: 'normal',
    label: tipedLabel('模板', '自定义选项渲染模板，支持JSX、数据域变量使用'),
    name: 'menuTpl'
  });
});

setSchemaTpl('expression', {
  type: 'input-text',
  description: '支持 JS 表达式，如：`this.xxx == 1`'
});

setSchemaTpl('size', {
  label: '控件尺寸',
  type: 'button-group-select',
  name: 'size',
  clearable: true,
  options: [
    {
      label: '极小',
      value: 'xs'
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
    }
  ]
});

setSchemaTpl('name', {
  label: tipedLabel(
    '名字',
    '需要联动时才需要，其他组件可以通过这个名字跟当前组件联动'
  ),
  name: 'name',
  type: 'input-text',
  placeholder: '请输入字母或者数字'
});

setSchemaTpl('reload', {
  name: 'reload',
  asFormItem: true,
  // type: 'input-text',
  component: InputComponentName,
  label: tipedLabel(
    '刷新目标组件',
    '可以指定操作完成后刷新目标组件，请填写目标组件的 <code>name</code> 属性，多个组件请用<code>,</code>隔开，如果目标组件为表单项，请先填写表单的名字，再用<code>.</code>连接表单项的名字如：<code>xxForm.xxControl</code>。另外如果刷新目标对象设置为 <code>window</code>，则会刷新整个页面。'
  ),
  placeholder: '请输入组件name',
  mode: 'horizontal',
  horizontal: {
    left: 4,
    justify: true
  }
});

setSchemaTpl('className', (schema: any) => {
  return {
    type: 'ae-classname',
    name: 'className',
    ...(schema || {}),
    label: tipedLabel(
      schema?.label || 'CSS 类名',
      '有哪些辅助类 CSS 类名？请前往 <a href="https://baidu.github.io/amis/docs/concepts/style" target="_blank">样式说明</a>，除此之外你可以添加自定义类名，然后在系统配置中添加自定义样式。'
    )
  };
});

setSchemaTpl('onlyClassNameTab', (label = '外层') => {
  return {
    title: '外观',
    body: getSchemaTpl('collapseGroup', [
      {
        title: 'CSS类名',
        body: [getSchemaTpl('className', {label})]
      }
    ])
  };
});

/**
 * combo 组件样式包装调整
 */
setSchemaTpl('combo-container', (config: SchemaObject) => {
  if (isObject(config)) {
    let itemsWrapperClassName;
    let itemClassName;
    if (['input-kv', 'combo'].includes((config as any).type)) {
      itemsWrapperClassName =
        'ae-Combo-items ' + ((config as any).itemsWrapperClassName ?? '');
      itemClassName = 'ae-Combo-item ' + ((config as any).itemClassName ?? '');
    }
    return {
      ...(config as any),
      ...(itemsWrapperClassName ? {itemsWrapperClassName} : {}),
      ...(itemClassName ? {itemClassName} : {})
    };
  }
  return config;
});

/**
 * Page组件静态数据
 */
setSchemaTpl(
  'pageData',
  getSchemaTpl('combo-container', {
    type: 'input-kv',
    mode: 'normal',
    name: 'data',
    label: '组件静态数据'
  })
);

/**
 * 所有组件的状态
 */
setSchemaTpl(
  'status',
  (config: {
    isFormItem?: boolean;
    readonly?: boolean;
    disabled?: boolean;
    unsupportStatic?: boolean;
  }) => {
    return {
      title: '状态',
      body: [
        getSchemaTpl('visible'),
        getSchemaTpl('hidden'),
        config?.isFormItem ? getSchemaTpl('clearValueOnHidden') : null,
        !config?.unsupportStatic && config?.isFormItem
          ? getSchemaTpl('static')
          : null,
        config?.readonly ? getSchemaTpl('readonly') : null,
        config?.disabled || config?.isFormItem ? getSchemaTpl('disabled') : null
      ].filter(Boolean)
    };
  }
);

setSchemaTpl('autoFill', {
  type: 'input-kv',
  name: 'autoFill',
  label: tipedLabel(
    '自动填充',
    '将当前已选中的选项的某个字段的值，自动填充到表单中某个表单项中，支持数据映射'
  )
});

setSchemaTpl('autoFillApi', {
  type: 'input-kv',
  name: 'autoFill',
  label: tipedLabel('数据录入', '自动填充或参照录入')
});

setSchemaTpl('required', {
  type: 'switch',
  name: 'required',
  label: '是否必填',
  mode: 'horizontal',
  horizontal: {
    justify: true,
    left: 8
  },
  inputClassName: 'is-inline '
});

/**
 * 表单项描述description
 */
setSchemaTpl('description', {
  name: 'description',
  type: 'textarea',
  label: tipedLabel('描述', '表单项控件下方浅色文字描述'),
  maxRows: 2,
  pipeIn: (value: any, data: any) => value || data.desc || ''
});

setSchemaTpl('disabled', {
  type: 'ae-StatusControl',
  label: '禁用',
  mode: 'normal',
  name: 'disabled',
  expressionName: 'disabledOn'
});

setSchemaTpl('readonly', {
  type: 'ae-StatusControl',
  label: '只读',
  mode: 'normal',
  name: 'readOnly',
  expressionName: 'readOnlyOn'
});

setSchemaTpl('visible', {
  type: 'ae-StatusControl',
  defaultTrue: true,
  label: '可见',
  mode: 'normal',
  name: 'visible',
  expressionName: 'visibleOn'
});

setSchemaTpl('static', {
  type: 'ae-StatusControl',
  label: '静态展示',
  mode: 'normal',
  name: 'static',
  expressionName: 'staticOn'
});

setSchemaTpl('hidden', {
  type: 'ae-StatusControl',
  label: '隐藏',
  mode: 'normal',
  name: 'hidden',
  expressionName: 'hiddenOn'
});

setSchemaTpl('maximum', {
  type: 'input-number',
  label: '最大值'
});

setSchemaTpl('minimum', {
  type: 'input-number',
  label: '最小值'
});

setSchemaTpl('switchDefaultValue', {
  type: 'switch',
  label: '默认值设置',
  name: 'value',
  pipeIn: (value: any) => typeof value !== 'undefined',
  pipeOut: (value: any, origin: any, data: any) => (value ? '' : undefined),
  labelRemark: {
    trigger: ['hover', 'focus'],
    setting: true,
    title: '',
    content: '不设置时根据 name 获取'
  }
});

setSchemaTpl('numberSwitchDefaultValue', {
  type: 'switch',
  label: tipedLabel('默认值设置', '不设置时根据 name 获取'),
  name: 'value',
  pipeIn: (value: any) => typeof value !== 'undefined',
  pipeOut: (value: any, origin: any, data: any) => (value ? '' : undefined)
});

setSchemaTpl('kilobitSeparator', {
  type: 'switch',
  label: '千分符',
  name: 'kilobitSeparator',
  inputClassName: 'is-inline'
});

setSchemaTpl('imageUrl', {
  type: 'input-text',
  label: '图片'
});

setSchemaTpl('backgroundImageUrl', {
  type: 'input-text',
  label: '图片路径'
});

setSchemaTpl('audioUrl', {
  type: 'input-text',
  label: '音频地址',
  name: 'src',
  description: '支持获取变量如：<code>\\${audioSrc}</code>'
});

setSchemaTpl('fileUrl', {
  type: 'input-text',
  label: '文件'
});

setSchemaTpl('markdownBody', {
  name: 'value',
  type: 'editor',
  language: 'markdown',
  size: 'xxl',
  label: 'Markdown 内容',
  options: {
    lineNumbers: 'off'
  }
});

setSchemaTpl('richText', {
  label: '富文本',
  type: 'input-rich-text',
  buttons: [
    'paragraphFormat',
    'quote',
    'textColor',
    'backgroundColor',
    '|',
    'bold',
    'italic',
    'underline',
    'strikeThrough',
    '|',
    'formatOL',
    'formatUL',
    'align',
    '|',
    'insertLink',
    'insertImage',
    'insertTable',
    '|',
    'undo',
    'redo',
    'fullscreen'
  ],
  name: 'html',
  description:
    '支持使用 <code>\\${xxx}</code> 来获取变量，或者用 lodash.template 语法来写模板逻辑。<a target="_blank" href="/amis/zh-CN/docs/concepts/template">详情</a>',
  size: 'lg'
});

setSchemaTpl('showCounter', {
  type: 'switch',
  label: '计数器',
  name: 'showCounter',
  inputClassName: 'is-inline'
});

setSchemaTpl('borderMode', {
  name: 'borderMode',
  label: '边框',
  type: 'button-group-select',
  inputClassName: 'is-inline',
  horizontal: {
    left: 2,
    justify: true
  },
  options: [
    {label: '全边框', value: 'full'},
    {label: '半边框', value: 'half'},
    {label: '无边框', value: 'none'}
  ],
  pipeIn: defaultValue('full')
});

setSchemaTpl('searchable', (schema: object = {}) =>
  getSchemaTpl('switch', {
    label: '可检索',
    name: 'searchable',
    ...schema
  })
);

setSchemaTpl('sortable', (schema: object = {}) =>
  getSchemaTpl('switch', {
    label: '可排序',
    name: 'sortable',
    ...schema
  })
);

setSchemaTpl('onlyLeaf', {
  type: 'switch',
  label: tipedLabel('必须选到末级', '必须选择到末级，不能选择中间层级'),
  horizontal: {
    left: 5,
    justify: true
  },
  name: 'onlyLeaf',
  value: false,
  inputClassName: 'is-inline'
});

setSchemaTpl('clearValueOnHidden', () =>
  getSchemaTpl('switch', {
    type: 'switch',
    horizontal: {left: 8, justify: true},
    label: tipedLabel(
      '隐藏时删除字段',
      '当前表单项隐藏时，表单提交数据中会删除该表单项的值'
    ),
    name: 'clearValueOnHidden'
  })
);

setSchemaTpl('utc', {
  type: 'switch',
  label: tipedLabel(
    'UTC转换',
    '开启后，提交数据和展示数据将进行UTC转换；存在跨地域用户的应用建议开启'
  ),
  name: 'utc',
  inputClassName: 'is-inline'
});

setSchemaTpl('embed', {
  type: 'switch',
  label: '内嵌模式',
  name: 'embed'
});

setSchemaTpl('buttonLevel', {
  label: '按钮样式',
  type: 'select',
  name: 'level',
  menuTpl: {
    type: 'container',
    bodyClassName: 'ae-ButtonLevel-MenuTpl',
    body: {
      type: 'button',
      label: '${label}',

      size: 'sm',
      level: '${value}'
    }
  },
  options: [
    {
      label: '默认',
      value: 'default',
      level: 'default'
    },
    {
      label: '链接',
      value: 'link',
      level: 'link'
    },
    {
      label: '主色',
      value: 'primary',
      level: 'primary'
    },

    {
      label: '淡色',
      value: 'light',
      level: 'light'
    },
    {
      label: '深色',
      value: 'dark',
      level: 'dark'
    },

    {
      label: '提示',
      value: 'info',
      level: 'info'
    },
    {
      label: '成功',
      value: 'success',
      level: 'success'
    },
    {
      label: '警告',
      value: 'warning',
      level: 'warning'
    },
    {
      label: '严重',
      value: 'danger',
      level: 'danger'
    },
    {
      label: '次要',
      value: 'secondary',
      level: 'secondary'
    },
    {
      label: '加强',
      value: 'enhance',
      level: 'enhance'
    }
  ],
  pipeIn: defaultValue('default')
});

setSchemaTpl('uploadType', {
  label: '上传方式',
  name: 'uploadType',
  type: 'select',
  value: 'fileReceptor',
  options: [
    {
      label: '文件接收器',
      value: 'fileReceptor'
    },

    {
      label: '对象存储',
      value: 'bos'
    }
  ]
});

setSchemaTpl('bos', {
  label: '存储仓库',
  type: 'select',
  name: 'bos',
  value: 'default',
  options: [
    {
      label: '平台默认',
      value: 'default'
    }
  ]
});

setSchemaTpl('badge', {
  label: '角标',
  name: 'badge',
  type: 'ae-badge'
});

setSchemaTpl('nav-badge', {
  label: '角标',
  name: 'badge',
  type: 'ae-nav-badge'
});

setSchemaTpl('nav-default-active', {
  type: 'ae-nav-default-active'
});

/**
 * 日期范围快捷键组件
 */
setSchemaTpl('dateShortCutControl', (schema: object = {}) => {
  return {
    type: 'ae-DateShortCutControl',
    name: 'shortcuts',
    ...schema
  };
});
setSchemaTpl('eventControl', (schema: object = {}) => {
  return {
    type: 'ae-eventControl',
    mode: 'normal',
    ...schema
  };
});

setSchemaTpl('data', {
  type: 'input-kv',
  name: 'data',
  label: '组件静态数据'
});

setSchemaTpl('app-page', {
  type: 'nested-select',
  label: '选择页面',
  name: 'link',
  mode: 'horizontal',
  size: 'lg',
  required: true,
  options: []
});

setSchemaTpl('app-page-args', {
  type: 'combo',
  name: 'params',
  label: '页面参数',
  multiple: true,
  removable: true,
  addable: true,
  strictMode: false,
  canAccessSuperData: true,
  size: 'lg',
  mode: 'horizontal',
  items: [
    {
      name: 'key',
      type: 'input-text',
      placeholder: '参数名',
      source: '${__pageInputSchema}',
      labelField: 'label',
      valueField: 'value',
      required: true
    },
    getSchemaTpl('formulaControl', {
      name: 'val',
      variables: '${variables}',
      placeholder: '参数值'
    })
  ]
});

setSchemaTpl(
  'iconLink',
  (schema: {
    name: 'icon' | 'rightIcon';
    visibleOn: boolean;
    label?: string;
  }) => {
    const {name, visibleOn, label} = schema;
    return getSchemaTpl('icon', {
      name: name,
      visibleOn,
      label: label ?? '图标',
      placeholder: '点击选择图标',
      clearable: true,
      description: ''
    });
  }
);

setSchemaTpl('virtualThreshold', {
  name: 'virtualThreshold',
  type: 'input-number',
  min: 1,
  step: 1,
  precision: 0,
  label: tipedLabel(
    '虚拟列表阈值',
    '当选项数量超过阈值后，会开启虚拟列表以优化性能'
  ),
  pipeOut: (value: any) => value || undefined
});

setSchemaTpl('virtualItemHeight', {
  name: 'itemHeight',
  type: 'input-number',
  min: 1,
  step: 1,
  precision: 0,
  label: tipedLabel('选项高度', '开启虚拟列表时每个选项的高度'),
  pipeOut: (value: any) => value || undefined
});

setSchemaTpl('pageTitle', {
  label: '页面标题',
  name: 'title',
  type: 'input-text'
});

setSchemaTpl('pageSubTitle', {
  label: '副标题',
  name: 'subTitle',
  type: 'textarea'
});

setSchemaTpl('textareaDefaultValue', (options: any) => {
  return getSchemaTpl('textareaFormulaControl', {
    label: '默认值',
    name: 'value',
    mode: 'normal',
    ...options
  });
});

setSchemaTpl('prefix', {
  type: 'input-text',
  name: 'prefix',
  label: tipedLabel('前缀', '输入内容前展示，不包含在数据值中')
});

setSchemaTpl('suffix', {
  type: 'input-text',
  name: 'suffix',
  label: tipedLabel('后缀', '输入内容后展示，不包含在数据值中')
});

setSchemaTpl('unit', {
  type: 'input-text',
  name: 'unit',
  label: '单位',
  value: ''
});

setSchemaTpl('optionsTip', {
  type: 'input-text',
  name: 'optionsTip',
  label: '选项提示',
  value: '最近您使用的标签'
});

setSchemaTpl('tableCellRemark', {
  name: 'remark',
  label: '提示',
  type: 'input-text',
  description: '显示一个提示图标，鼠标放上去会提示该内容。'
});

setSchemaTpl('tableCellPlaceholder', {
  name: 'placeholder',
  type: 'input-text',
  label: '占位符',
  value: '-',
  description: '当没有值时用这个来替代展示'
});

setSchemaTpl('title', {
  type: 'input-text',
  name: 'title',
  label: '标题'
});

setSchemaTpl('caption', {
  type: 'input-text',
  name: 'caption',
  label: '标题'
});

setSchemaTpl('imageCaption', {
  type: 'input-text',
  name: 'imageCaption',
  label: '图片描述'
});

setSchemaTpl('inputBody', {
  type: 'input-text',
  name: 'body',
  label: tipedLabel('内容', '不填写时，自动使用目标地址值')
});

setSchemaTpl('stepSubTitle', {
  type: 'input-text',
  name: 'subTitle',
  label: false,
  placeholder: '副标题'
});

setSchemaTpl('stepDescription', {
  type: 'input-text',
  name: 'description',
  label: false,
  placeholder: '描述'
});

setSchemaTpl('taskNameLabel', {
  type: 'input-text',
  name: 'taskNameLabel',
  pipeIn: defaultValue('任务名称'),
  label: '任务名称栏标题'
});

setSchemaTpl('operationLabel', {
  type: 'input-text',
  name: 'operationLabel',
  pipeIn: defaultValue('操作'),
  label: '操作栏标题'
});

setSchemaTpl('statusLabel', {
  type: 'input-text',
  name: 'statusLabel',
  pipeIn: defaultValue('状态'),
  label: '状态栏标题'
});

setSchemaTpl('remarkLabel', {
  type: 'input-text',
  name: 'remarkLabel',
  pipeIn: defaultValue('备注说明'),
  label: '备注栏标题'
});

setSchemaTpl('inputArrayItem', {
  type: 'input-text',
  placeholder: '名称'
});

setSchemaTpl('actionPrevLabel', {
  type: 'input-text',
  name: 'actionPrevLabel',
  label: '上一步按钮名称',
  pipeIn: defaultValue('上一步')
});

setSchemaTpl('actionNextLabel', {
  type: 'input-text',
  name: 'actionNextLabel',
  label: '下一步按钮名称',
  pipeIn: defaultValue('下一步')
});

setSchemaTpl('actionNextSaveLabel', {
  type: 'input-text',
  name: 'actionNextSaveLabel',
  label: '保存并下一步按钮名称',
  pipeIn: defaultValue('保存并下一步')
});

setSchemaTpl('actionFinishLabel', {
  type: 'input-text',
  name: 'actionFinishLabel',
  label: '完成按钮名称',
  pipeIn: defaultValue('完成')
});

setSchemaTpl('imgCaption', {
  type: 'textarea',
  name: 'caption',
  label: '图片描述'
});

setSchemaTpl('taskRemark', {
  type: 'textarea',
  name: 'remark',
  label: '任务说明'
});

setSchemaTpl('tooltip', {
  type: 'textarea',
  name: 'tooltip',
  label: '提示内容'
});

setSchemaTpl('anchorTitle', {
  type: 'input-text',
  name: 'title',
  required: true,
  placeholder: '请输入锚点标题'
});

setSchemaTpl('avatarText', {
  label: '文字',
  name: 'text',
  type: 'input-text',
  pipeOut: (value: any) => (value === '' ? undefined : value),
  visibleOn: 'this.showtype === "text"'
});

setSchemaTpl('cardTitle', {
  name: 'header.title',
  type: 'input-text',
  label: '标题',
  description: '支持模板语法如： <code>\\${xxx}</code>'
});

setSchemaTpl('cardSubTitle', {
  name: 'header.subTitle',
  type: 'input-text',
  label: '副标题',
  description: '支持模板语法如： <code>\\${xxx}</code>'
});

setSchemaTpl('cardsPlaceholder', {
  name: 'placeholder',
  value: '暂无数据',
  type: 'input-text',
  label: '无数据提示'
});

setSchemaTpl('cardDesc', {
  name: 'header.desc',
  type: 'textarea',
  label: '描述',
  description: '支持模板语法如： <code>\\${xxx}</code>'
});

setSchemaTpl('imageTitle', {
  type: 'input-text',
  label: '图片标题',
  name: 'title',
  visibleOn: 'this.type == "image"'
});

setSchemaTpl('imageDesc', {
  type: 'textarea',
  label: '图片描述',
  name: 'description',
  visibleOn: 'this.type == "image"'
});

setSchemaTpl('fetchSuccess', {
  label: '获取成功提示',
  type: 'input-text',
  name: 'fetchSuccess'
});

setSchemaTpl('fetchFailed', {
  label: '获取失败提示',
  type: 'input-text',
  name: 'fetchFailed'
});

setSchemaTpl('saveOrderSuccess', {
  label: '保存顺序成功提示',
  type: 'input-text',
  name: 'saveOrderSuccess'
});

setSchemaTpl('saveOrderFailed', {
  label: '保存顺序失败提示',
  type: 'input-text',
  name: 'saveOrderFailed'
});

setSchemaTpl('quickSaveSuccess', {
  label: '快速保存成功提示',
  type: 'input-text',
  name: 'quickSaveSuccess'
});

setSchemaTpl('quickSaveFailed', {
  label: '快速保存失败提示',
  type: 'input-text',
  name: 'quickSaveFailed'
});

setSchemaTpl('saveSuccess', {
  label: '保存成功提示',
  name: 'saveSuccess',
  type: 'input-text'
});

setSchemaTpl('saveFailed', {
  label: '保存失败提示',
  name: 'saveFailed',
  type: 'input-text'
});

setSchemaTpl('validateFailed', {
  label: '验证失败提示',
  name: 'validateFailed',
  type: 'input-text'
});

setSchemaTpl('tablePlaceholder', {
  name: 'placeholder',
  pipeIn: defaultValue('暂无数据'),
  type: 'input-text',
  label: '无数据提示'
});

setSchemaTpl('collapseOpenHeader', {
  name: 'collapseHeader',
  label: tipedLabel('展开标题', '折叠器处于展开状态时的标题'),
  type: 'input-text'
});

setSchemaTpl('matrixColumnLabel', {
  type: 'input-text',
  name: 'label',
  placeholder: '列说明'
});

setSchemaTpl('matrixRowLabel', {
  type: 'input-text',
  name: 'label',
  placeholder: '行说明'
});

setSchemaTpl('matrixRowTitle', {
  name: 'rowLabel',
  label: '行标题文字',
  type: 'input-text'
});

setSchemaTpl('submitText', {
  name: 'submitText',
  label: '提交按钮名称',
  type: 'input-text'
});

setSchemaTpl('tpl:btnLabel', {
  type: 'tpl',
  tpl: '<span class="label label-success">${label}</span>',
  columnClassName: 'p-t-xs'
});

setSchemaTpl('switchOption', {
  type: 'input-text',
  name: 'option',
  label: '说明'
});

setSchemaTpl('addOnLabel', {
  name: 'label',
  label: '文字',
  type: 'input-text'
});

setSchemaTpl('onText', {
  name: 'onText',
  type: 'input-text',
  label: '开启时'
});

setSchemaTpl('offText', {
  name: 'offText',
  type: 'input-text',
  label: '关闭时'
});

setSchemaTpl('propertyTitle', {
  label: '标题',
  type: 'input-text',
  name: 'title'
});

setSchemaTpl('propertyLabel', {
  type: 'input-text',
  mode: 'inline',
  size: 'sm',
  label: '属性名',
  name: 'label'
});

setSchemaTpl('propertyContent', {
  type: 'input-text',
  mode: 'inline',
  size: 'sm',
  label: '属性值',
  name: 'content'
});

setSchemaTpl('draggableTip', {
  type: 'input-text',
  name: 'draggableTip',
  label: tipedLabel('提示文字', '拖拽排序的提示文字')
});

setSchemaTpl('deleteConfirmText', {
  label: tipedLabel('确认文案', '删除确认文案，当配置删除接口生效'),
  name: 'deleteConfirmText',
  type: 'input-text',
  pipeIn: defaultValue('确认要删除吗？')
});

setSchemaTpl('optionsLabel', {
  type: 'input-text',
  name: 'label',
  placeholder: '名称',
  required: true
});

setSchemaTpl('anchorNavTitle', {
  name: 'title',
  label: '标题',
  type: 'input-text',
  required: true
});

/** 给 CRUD2 使用 */
setSchemaTpl('primaryField', {
  type: 'input-text',
  name: 'primaryField',
  label: tipedLabel(
    '主键',
    '每行记录的唯一标识符，通常用于行选择、批量操作等场景。'
  ),
  pipeIn: (value: any, formStore: any) => {
    const rowSelection = formStore?.data?.rowSelection;

    if (value == null || typeof value !== 'string') {
      return rowSelection &&
        rowSelection?.keyField &&
        typeof rowSelection.keyField === 'string'
        ? rowSelection?.keyField
        : 'id';
    }

    return value;
  }
});

/**
 * 是否为懒加载节点字段
 */
setSchemaTpl('deferField', {
  label: tipedLabel(
    '懒加载字段',
    '是否为懒加载节点的字段名称，默认为defer，可以用该配置项自定义字段名称'
  ),
  name: 'deferField',
  type: 'input-text',
  placeholder: '自定义开启懒加载的字段'
});

setSchemaTpl(
  'signBtn',
  (options: {label: string; name: string; icon: string}) => {
    const i18nEnabled = getI18nEnabled();
    return {
      type: 'flex',
      justify: 'space-between',
      alignItems: 'center',
      items: [
        {
          style: {
            color: '#5c5f66'
          },
          type: 'tpl',
          tpl: options.label
        },
        {
          type: 'action',
          label: '设置',
          level: 'link',
          actionType: 'dialog',
          dialog: {
            title: '设置',
            body: {
              type: 'form',
              body: [
                {
                  name: options.name,
                  label: '按钮文案',
                  type: i18nEnabled ? 'input-text-i18n' : 'input-text'
                },
                getSchemaTpl('icon', {
                  name: options.icon,
                  label: '图标'
                })
              ]
            },
            actions: [
              {
                type: 'submit',
                label: '确认',
                mergeData: true,
                level: 'primary'
              }
            ]
          }
        }
      ]
    };
  }
);

setSchemaTpl('closable', {
  type: 'ae-StatusControl',
  label: tipedLabel('可关闭选项卡', '选项卡内优先级更高'),
  mode: 'normal',
  name: 'closable',
  expressionName: 'closableOn'
});

setSchemaTpl('inputForbid', {
  type: 'switch',
  label: '禁止输入',
  name: 'inputForbid',
  inputClassName: 'is-inline'
});

setSchemaTpl('button-manager', () => {
  return getSchemaTpl('combo-container', {
    type: 'combo',
    label: '按钮管理',
    name: 'actions',
    mode: 'normal',
    multiple: true,
    addable: true,
    draggable: true,
    editable: false,
    items: [
      {
        component: (props: any) => {
          return render({
            ...props.data,
            onEvent: {},
            actionType: '',
            onClick: (e: any, props: any) => {
              const editorStore = (window as any).editorStore;
              const subEditorStore = editorStore.getSubEditorRef()?.store;
              (subEditorStore || editorStore).setActiveIdByComponentId(
                props.id
              );
            }
          });
        }
      }
    ],
    addButtonText: '新增按钮',
    scaffold: {
      type: 'button',
      label: '按钮'
    }
  });
});
