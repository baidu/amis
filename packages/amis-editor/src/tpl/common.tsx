import {
  setSchemaTpl,
  getSchemaTpl,
  defaultValue,
  isObject
} from 'amis-editor-core';
import {remarkTpl, tipedLabel} from '../component/BaseControl';
import {SchemaObject} from 'amis/lib/Schema';
import flatten from 'lodash/flatten';
import {InputComponentName} from '../component/InputComponentName';

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
 * 表单项字段name
 */
setSchemaTpl('formItemName', {
  label: '字段名',
  name: 'name',
  type: 'ae-DataBindingControl'
  // validations: {
  //     matchRegexp: /^[a-z\$][a-z0-0\-_]*$/i
  // },
  // validationErrors: {
  //     "matchRegexp": "请输入合法的变量名"
  // },
  // validateOnChange: false
});

setSchemaTpl('formItemMode', {
  label: '布局',
  name: 'mode',
  type: 'button-group-select',
  option: '继承',
  horizontal: {
    left: 2,
    justify: true
  },
  // className: 'w-full',
  pipeIn: defaultValue(''),
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
    {
      label: '继承',
      value: ''
    }
  ],
  pipeOut: (v: string) => (v ? v : undefined)
});

setSchemaTpl('formItemInline', {
  type: 'switch',
  label: '表单项内联',
  name: 'inline',
  visibleOn: 'data.mode != "inline"',
  pipeIn: defaultValue(false)
  // onChange: (value:any, origin:any, item:any, form:any) => form.getValueByName('size') === "full" && form.setValueByName('')
});

setSchemaTpl('formItemSize', {
  name: 'size',
  label: '控件宽度',
  type: 'select',
  pipeIn: defaultValue(''),
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
      label: '占满',
      value: 'full'
    },
    {
      label: '默认',
      value: ''
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

setSchemaTpl('labelHide', () =>
  getSchemaTpl('switch', {
    name: 'label',
    label: tipedLabel('隐藏标题', '隐藏后，水平布局时标题宽度为0'),
    pipeIn: (value: any) => value === false,
    pipeOut: (value: any) => (value === true ? false : ''),
    visibleOn:
      '__props__.formMode === "horizontal" || data.mode === "horizontal" || data.label === false'
  })
);

setSchemaTpl('placeholder', {
  label: '占位提示',
  name: 'placeholder',
  type: 'input-text',
  placeholder: '空内容提示占位'
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
      linksClassName: 'editor-prop-config-tabs-links',
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
    }>,
    rendererSchema?: any
  ) => {
    let currentKey = rendererSchema
      ? `${rendererSchema.$$id}_${rendererSchema.type}_${rendererSchema.configTitle}_collapse`
      : `config_collapse`;
    currentKey = currentKey.replace(/-/g, '__');

    const collapseGroupBody = config
      .filter(
        item => item && Array.isArray(item?.body) && item?.body.length > 0
      )
      .map((item, index) => ({
        type: 'collapse',
        headingClassName: 'ae-formItemControl-header',
        bodyClassName: 'ae-formItemControl-body',
        ...item,
        key: `${currentKey}_${item.key || index.toString()}`,
        body: flatten(item.body)
      }));

    return {
      type: 'collapse-group',
      key: currentKey,
      expandIconPosition: 'right',
      expandIcon: {
        type: 'icon',
        icon: 'chevron-right'
      },
      className: 'ae-formItemControl ae-styleControl',
      activeKey: collapseGroupBody.map((group, index) => group.key),
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

setSchemaTpl(
  'remark',
  remarkTpl({
    name: 'remark',
    label: '控件提示',
    labelRemark:
      '在输入控件旁展示提示，注意控件宽度需设置，否则提示触发图标将自动换行'
  })
);

setSchemaTpl(
  'labelRemark',
  remarkTpl({
    name: 'labelRemark',
    label: '标题提示',
    labelRemark: '在标题旁展示提示'
  })
);

setSchemaTpl(
  'valueFormula',
  (config?: {
    mode?: string; // 自定义展示默认值，上下展示: vertical, 左右展示: horizontal
    label?: string; // 表单项 label
    name?: string; // 表单项 name
    rendererSchema?: any;
    rendererWrapper?: boolean; // 自定义渲染器 是否需要浅色边框包裹
    needDeleteValue?: boolean; // 是否需要剔除默认值
    useSelectMode?: boolean; // 是否使用Select选择设置模式，需要确保 rendererSchema.options 不为 undefined
    valueType?: string; // 用于设置期望数值类型
    visibleOn?: string; // 用于控制显示的表达式
    evalMode?: boolean; // 为false时，则会用 ${这里面才是表达式} 包裹变量
  }) => {
    let curRendererSchema = config?.rendererSchema;
    if (
      config?.useSelectMode &&
      curRendererSchema &&
      curRendererSchema.options
    ) {
      curRendererSchema = {
        ...curRendererSchema,
        type: 'select'
      };
    }

    if (config?.mode === 'vertical') {
      // 上下展示，可避免 自定义渲染器 出现挤压
      return {
        type: 'group',
        mode: 'vertical',
        visibleOn: config?.visibleOn,
        body: [
          {
            type: 'ae-formulaControl',
            label: config?.label || '默认值',
            name: config?.name || 'value',
            rendererSchema: curRendererSchema,
            rendererWrapper: config?.rendererWrapper,
            needDeleteValue: config?.needDeleteValue,
            valueType: config?.valueType,
            evalMode: config?.evalMode ?? false // 默认需要${}包裹变量
          }
        ]
      };
    } else {
      // 默认左右展示
      return {
        type: 'ae-formulaControl',
        label: config?.label || '默认值',
        name: config?.name || 'value',
        rendererSchema: curRendererSchema,
        rendererWrapper: config?.rendererWrapper,
        needDeleteValue: config?.needDeleteValue,
        valueType: config?.valueType,
        visibleOn: config?.visibleOn,
        evalMode: config?.evalMode ?? false // 默认需要${}包裹变量
      };
    }
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

setSchemaTpl('menuTpl', {
  type: 'ae-formulaControl',
  label: tipedLabel('模板', '选项渲染模板，支持JSX，变量使用\\${xx}'),
  name: 'menuTpl'
});

setSchemaTpl('expression', {
  type: 'input-text',
  description: '支持 JS 表达式，如：`this.xxx == 1`'
});

setSchemaTpl('icon', {
  label: '图标',
  type: 'icon-picker',
  name: 'icon',
  className: 'fix-icon-picker-overflow',
  placeholder: '点击选择图标',
  clearable: true,
  description: ''
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
  label: '名字',
  name: 'name',
  type: 'input-text',
  description: '需要联动时才需要，其他组件可以通过这个名字跟当前组件联动',
  placeholder: '请输入字母或者数字'
});

setSchemaTpl('reload', {
  label: '刷新目标组件',
  name: 'reload',
  asFormItem: true,
  // type: 'input-text',
  component: InputComponentName,
  description:
    '可以指定操作完成后刷新目标组件，请填写目标组件的 <code>name</code> 属性，多个组件请用<code>,</code>隔开，如果目标组件为表单项，请先填写表单的名字，再用<code>.</code>连接表单项的名字如：<code>xxForm.xxControl</code>。另外如果刷新目标对象设置为 <code>window</code>，则会刷新整个页面。',
  labelRemark: {
    trigger: 'click',
    className: 'm-l-xs',
    rootClose: true,
    content:
      '设置名字后，当前组件操作完成会触发目标组件（根据设置的名字）的刷新。',
    placement: 'left'
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

/**
 * combo 组件样式包装调整
 */
setSchemaTpl('combo-container', (config: SchemaObject) => {
  if (isObject(config)) {
    const itemsWrapperClassName =
      ['input-kv', 'combo'].includes((config as any).type) &&
      'ae-Combo-items ' + ((config as any).itemsWrapperClassName ?? '');
    return {
      ...(config as any),
      ...(itemsWrapperClassName ? {itemsWrapperClassName} : {})
    };
  }
  return config;
});

/**
 * 所有组件的状态
 */
setSchemaTpl(
  'status',
  (config: {isFormItem?: boolean; readonly?: boolean; disabled?: boolean}) => {
    return {
      title: '状态',
      body: [
        getSchemaTpl('hidden'),
        config?.readonly ? getSchemaTpl('readonly') : null,
        config?.disabled || config?.isFormItem
          ? getSchemaTpl('disabled')
          : null,
        config?.isFormItem ? getSchemaTpl('clearValueOnHidden') : null
      ]
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
  expressioName: 'disabledOn'
});

setSchemaTpl('readonly', {
  type: 'ae-StatusControl',
  label: '只读',
  mode: 'normal',
  name: 'readOnly',
  expressioName: 'readOnlyOn'
});

setSchemaTpl('visible', {
  type: 'ae-StatusControl',
  label: '可见',
  mode: 'normal',
  name: 'visible',
  expressioName: 'visibleOn'
});

setSchemaTpl('hidden', {
  type: 'ae-StatusControl',
  label: '隐藏',
  mode: 'normal',
  name: 'hidden',
  expressioName: 'hiddenOn'
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

setSchemaTpl('numberSwitchKeyboard', {
  type: 'switch',
  label: tipedLabel('键盘事件', '默认是不启用'),
  name: 'keyboard',
  inputClassName: 'is-inline'
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

setSchemaTpl('searchable', () =>
  getSchemaTpl('switch', {
    label: '可检索',
    name: 'searchable'
  })
);

setSchemaTpl('sortable', {
  type: 'switch',
  label: '可排序',
  name: 'sortable'
});

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

setSchemaTpl('formulaControl', (schema: object = {}) => {
  return {
    type: 'ae-formulaControl',
    ...schema
  };
});

/**
 * 日期范围快捷键组件
 */
setSchemaTpl('dateShortCutControl', (schema: object = {}) => {
  return {
    type: 'ae-DateShortCutControl',
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
  label: '初始静态数据'
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
  mode: 'horizontal',
  items: [
    {
      name: 'key',
      placeholder: '参数名',
      type: 'input-text',
      mode: 'inline',
      size: 'xs'
    },
    {
      name: 'val',
      placeholder: '参数值',
      type: 'input-formula',
      variableMode: 'tabs',
      size: 'xs',
      variables: '${variables}'
    }
  ]
});

setSchemaTpl(
  'iconLink',
  (schema: {name: 'icon' | 'rightIcon'; visibleOn: boolean}) => {
    const {name, visibleOn} = schema;
    return {
      name: name,
      visibleOn,
      label: '图标',
      type: 'icon-picker',
      placeholder: '点击选择图标',
      clearable: true,
      description: ''
    };
  }
);
