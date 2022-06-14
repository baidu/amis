/**
 * @file amis schema 配置模板，主要很多地方都要全部配置的化，
 * 会有很多份，而且改起来很麻烦，复用率高的放在这管理。
 */
import {isObject} from '../util';
import find = require('lodash/find');
import forEach = require('lodash/forEach');
import reduce = require('lodash/reduce');
import {str2rules, buildApi, Html} from 'amis';
import flatten from 'lodash/flatten';
import kebabCase from 'lodash/kebabCase';
import React = require('react');
import {InputComponentName} from './base/InputComponentName';
import {remarkTpl, tipedLabel, ValidationOptions} from './control/BaseControl';

import type {ValidatorFilter} from './control/ValidationControl';
import {ValidatorTag} from './validator';
import {SchemaCollection, SchemaObject} from 'amis/lib/Schema';

const tpls: {
  [propName: string]: any;
} = {
  /**
   * @deprecated 兼容当前组件的switch
   */
  'switch': {
    type: 'switch',
    mode: 'horizontal',
    horizontal: {
      justify: true,
      left: 8
    },
    inputClassName: 'is-inline '
  },

  /**
   * 表单项字段name
   */
  'formItemName': {
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
  },

  'formItemMode': {
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
  },

  'formItemInline': {
    type: 'switch',
    label: '表单项内联',
    name: 'inline',
    visibleOn: 'data.mode != "inline"',
    pipeIn: defaultValue(false)
    // onChange: (value:any, origin:any, item:any, form:any) => form.getValueByName('size') === "full" && form.setValueByName('')
  },

  'formItemSize': {
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
  },

  'minLength': {
    name: 'minLength',
    type: 'input-number',
    label: '限制最小数量'
  },

  'maxLength': {
    name: 'maxLength',
    type: 'input-number',
    label: '限制最大数量'
  },

  /**
   * 表单项名称label
   */
  'label': {
    label: '标题',
    name: 'label',
    type: 'input-text',
    pipeIn(v: any) {
      return v === false ? '' : v;
    }
  },

  'labelHide': () =>
    getSchemaTpl('switch', {
      name: 'label',
      label: tipedLabel('隐藏标题', '隐藏后，水平布局时标题宽度为0'),
      pipeIn: (value: any) => value === false,
      pipeOut: (value: any) => (value === true ? false : ''),
      visibleOn:
        '__props__.formMode === "horizontal" || data.mode === "horizontal" || data.label === false'
    }),

  'placeholder': {
    label: '占位提示',
    name: 'placeholder',
    type: 'input-text',
    placeholder: '空内容提示占位'
  },

  'tabs': (
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
  },

  'collapse': (
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
  },

  'fieldSet': (config: {
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
  },

  'collapseGroup': (
    config: Array<{
      title: string;
      key: string;
      visibleOn: string;
      body: Array<any>;
    }>,
    rendererSchema?: any
  ) => {
    let currentKey = rendererSchema ? `${rendererSchema.$$id}_${rendererSchema.type}_${rendererSchema.configTitle}_collapse` : `config_collapse`;
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
  },

  'clearable': {
    type: 'switch',
    label: '可清除',
    name: 'clearable',
    inputClassName: 'is-inline'
  },

  'hint': {
    label: '输入框提示',
    type: 'input-text',
    name: 'hint',
    description: '当输入框获得焦点的时候显示，用来提示用户输入内容。'
  },

  'remark': remarkTpl({
    name: 'remark',
    label: '控件提示',
    labelRemark:
      '在输入控件旁展示提示，注意控件宽度需设置，否则提示触发图标将自动换行'
  }),

  'labelRemark': remarkTpl({
    name: 'labelRemark',
    label: '标题提示',
    labelRemark: '在标题旁展示提示'
  }),

  /**
   * 表单项录入项支持表达式、且支持指定渲染器编辑默认值
   */
  'valueFormula': (
    config?: {
      mode?: string; // 自定义展示默认值，上下展示: vertical, 左右展示: horizontal
      label?: string; // 表单项 label
      name?: string; // 表单项 name
      rendererSchema?: any;
      rendererWrapper?: boolean; // 自定义渲染器 是否需要浅色边框包裹
      needDeleteProps?: Array<string>; // 是否需要剔除属性
      useSelectMode?: boolean; // 是否使用Select选择设置模式，需要确保 rendererSchema.options 不为 undefined
      valueType?: string; // 用于设置期望数值类型
      visibleOn?: string; // 用于控制显示的表达式
    }
  ) => {

    let curRendererSchema = config?.rendererSchema;
    if (config?.useSelectMode && curRendererSchema && curRendererSchema.options) {
      curRendererSchema = {
        ...curRendererSchema,
        type: 'select'
      }
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
            needDeleteProps: config?.needDeleteProps,
            valueType: config?.valueType,
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
        needDeleteProps: config?.needDeleteProps,
        valueType: config?.valueType,
        visibleOn: config?.visibleOn,
      };
    }
  },

  'inputType': {
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
  },

  'selectDateType': {
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
  },

  'selectDateRangeType': {
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
  },

  'menuTpl': {
    type: 'ae-formulaControl',
    label: tipedLabel('模板', '选项渲染模板，支持JSX，变量使用\\${xx}'),
    name: 'menuTpl'
  },

  'expression': {
    type: 'input-text',
    description: '支持 JS 表达式，如：`this.xxx == 1`'
  },

  'icon': {
    label: '图标',
    type: 'icon-picker',
    name: 'icon',
    className: 'fix-icon-picker-overflow',
    placeholder: '点击选择图标',
    clearable: true,
    description: ''
  },

  'size': {
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
  },

  'horizontal-align': {
    type: 'button-group-select',
    label: '位置',
    options: [
      {
        label: '左边',
        value: 'left',
        icon: 'fa fa-align-left'
      },
      {
        label: '右边',
        value: 'right',
        icon: 'fa fa-align-right'
      }
    ]
  },

  'name': {
    label: '名字',
    name: 'name',
    type: 'input-text',
    description: '需要联动时才需要，其他组件可以通过这个名字跟当前组件联动',
    placeholder: '请输入字母或者数字'
  },

  'reload': {
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
  },

  'className': (schema: any) => ({
    type: 'ae-classname',
    name: 'className',
    ...(schema || {}),
    label: tipedLabel(
      schema?.label || 'CSS 类名',
      '有哪些辅助类 CSS 类名？请前往 <a href="https://baidu.github.io/amis/docs/concepts/style" target="_blank">样式说明</a>，除此之外你可以添加自定义类名，然后在系统配置中添加自定义样式。'
    )
  }),

  'api': (patch: any = {}) => {
    const {name, label, value, description, sampleBuilder, ...rest} = patch;

    return {
      type: 'container',
      body: [
        {
          type: 'checkbox',
          label: label || 'API',
          labelRemark: sampleBuilder
            ? {
                icon: '',
                label: '示例',
                title: '接口返回示例',
                tooltipClassName: 'ae-ApiSample-tooltip',
                render: (data: any) => (
                  <Html
                    className="ae-ApiSample"
                    inline={false}
                    html={`
                    <pre><code>${sampleBuilder(data)}</code></pre>
                    `}
                  />
                ),
                trigger: 'click',
                className: 'm-l-xs',
                rootClose: true,
                placement: 'left'
              }
            : undefined,
          option: `高级配置`,
          name: name || 'api',
          mode: 'inline',
          className: 'w-full m-b-sm',
          inputClassName: 'pull-right text-sm m-t-sm p-t-none',
          onChange: () => {},
          pipeIn: (value: any) => value && typeof value !== 'string',
          pipeOut: (value: any, originValue: any) => {
            const api = buildApi(originValue);

            return value
              ? {
                  method: api.method,
                  url: api.url
                }
              : api.url
              ? `${api.method ? `${api.method}:` : ''}${api.url}`
              : '';
          }
        },

        {
          name: name || 'api',
          type: 'input-text',
          value,
          placeholder: 'http://',
          description: description,
          visibleOn: `!this.${name || 'api'} || typeof this.${
            name || 'api'
          } === 'string'`,
          className: 'm-b-none',
          labelRemark: {}
          // disabledOn: `data.${name || 'api'} && data.${name || 'api'}.data && Object.keys(data.${name || 'api'}.data).length || data.${name || 'api'} && data.${name || 'api'}.sendOn`,
        },

        {
          type: 'combo',
          name: name || 'api',
          description: description,
          syncDefaultValue: false,
          multiLine: true,
          visibleOn: `this.${name || 'api'} && typeof this.${
            name || 'api'
          } !== 'string'`,
          className: 'm-b-none',
          messages: {
            validateFailed: '接口配置中存在错误，请仔细检查'
          },
          pipeIn: (value: any) => {
            if (typeof value === 'string') {
              let url = value;
              let method = 'get';

              const m = /^(raw:|external:)?(get|post|put|patch|delete):(.*)$/.exec(
                url
              );
              if (m) {
                url = m[1] + m[3];
                method = m[2];
              }

              return {
                method,
                url
              };
            }

            return value;
          },
          items: [
            {
              label: '发送方式',
              name: 'method',
              value: 'get',
              type: 'select',
              mode: 'horizontal',
              horizontal: {
                leftFixed: 'sm'
              },
              options: [
                {
                  value: 'get',
                  label: 'GET'
                },
                {
                  value: 'post',
                  label: 'POST'
                },
                {
                  value: 'put',
                  label: 'PUT'
                },
                {
                  value: 'patch',
                  label: 'PATCH'
                },
                {
                  value: 'delete',
                  label: 'DELETE'
                }
              ]
            },

            {
              label: '接口地址',
              type: 'input-text',
              name: 'url',
              placeholder: 'http://',
              required: true
            },

            {
              type: 'switch',
              label: '数据映射',
              name: 'data',
              className: 'w-full m-b-xs',
              pipeIn: (value: any) => !!value,
              pipeOut: (value: any) => (value ? {'&': '$$'} : null)
            },

            {
              type: 'tpl',
              visibleOn: '!this.data',
              inline: false,
              className: 'text-sm text-muted m-b',
              tpl:
                '当没开启数据映射时，发送 API 的时候会发送尽可能多的数据，如果你想自己控制发送的数据，或者需要额外的数据处理，请开启此选项'
            },

            {
              type: 'ae-DataMappingControl',
              syncDefaultValue: false,
              name: 'data',
              mode: 'normal',
              renderLabel: false,
              visibleOn: 'this.data',
              descriptionClassName: 'help-block text-xs m-b-none',
              description:
                '<p>当没开启数据映射时，发送数据自动切成白名单模式，配置啥发送啥，请绑定数据。如：<code>{"a": "\\${a}", "b": 2}</code></p><p>如果希望在默认的基础上定制，请先添加一个 Key 为 `&` Value 为 `\\$$` 作为第一行。</p><div>当值为 <code>__undefined</code>时，表示删除对应的字段，可以结合<code>{"&": "\\$$"}</code>来达到黑名单效果。</div>'
            },

            // {
            //   type: 'input-kv',
            //   syncDefaultValue: false,
            //   name: 'data',
            //   visibleOn: 'this.data',
            //   descriptionClassName: 'help-block text-xs m-b-none',
            //   description:
            //     '<p>当没开启数据映射时，发送数据自动切成白名单模式，配置啥发送啥，请绑定数据。如：<code>{"a": "\\${a}", "b": 2}</code></p><p>如果希望在默认的基础上定制，请先添加一个 Key 为 `&` Value 为 `\\$$` 作为第一行。</p><div>当值为 <code>__undefined</code>时，表示删除对应的字段，可以结合<code>{"&": "\\$$"}</code>来达到黑名单效果。</div>'
            // },

            {
              label: '发送条件',
              type: 'input-text',
              name: 'sendOn',
              placeholder: '如：this.type == "123"',
              description: '用表达式来设置该请求的发送条件'
            },

            {
              type: 'switch',
              label: '是否设置缓存',
              name: 'cache',
              className: 'w-full m-b-xs',
              description: '设置该请求缓存的有效时间',
              pipeIn: (value: any) => !!value,
              pipeOut: (value: any) => (value ? 3000 : undefined)
            },

            {
              type: 'input-number',
              name: 'cache',
              mode: 'inline',
              min: 0,
              step: 500,
              visibleOn: 'this.cache',
              pipeIn: (value: any) => (typeof value === 'number' ? value : 0)
            },

            {
              type: 'switch',
              label: '文件下载',
              name: 'responseType',
              pipeIn: (value: any) => value === 'blob',
              pipeOut: (value: any) => (value ? 'blob' : undefined),
              description:
                '当接口为二进制文件下载时请勾选，并设置 Content-Disposition'
            },

            {
              label: '数据格式',
              type: 'button-group-select',
              name: 'dataType',
              description:
                '发送体格式为：<%= data.dataType === "json" ? "application/json" : data.dataType === "form-data" ? "multipart/form-data" : data.dataType === "form" ? "application/x-www-form-urlencoded" : "" %>，当发送内容中存在文件时会自动使用 form-data 格式。',
              size: 'sm',
              className: 'block',
              mode: 'inline',
              options: [
                {
                  label: 'JSON',
                  value: 'json'
                },
                {
                  label: 'FormData',
                  value: 'form-data'
                },
                {
                  label: 'Form',
                  value: 'form'
                }
              ]
            },

            {
              type: 'switch',
              label: '数据替换',
              name: 'replaceData',
              description: '默认数据都是追加方式，开启这个后是完全替换'
            },

            {
              type: 'switch',
              label: '返回结果映射',
              name: 'responseData',
              className: 'w-full m-b-xs',
              pipeIn: (value: any) => !!value,
              pipeOut: (value: any) => (value ? {'&': '$$'} : null)
            },

            {
              type: 'tpl',
              visibleOn: '!this.responseData',
              inline: false,
              className: 'text-sm text-muted m-b',
              tpl: '如果需要对返回结果做额外的数据处理，请开启此选项'
            },

            {
              type: 'input-kv',
              syncDefaultValue: false,
              name: 'responseData',
              visibleOn: 'this.responseData',
              descriptionClassName: 'help-block text-xs m-b-none'
            },

            {
              title: '自定义适配器',
              type: 'fieldSet',
              className: 'm-b-none',
              size: 'sm',
              collapsable: false, // 避免和最外层的属性配置面板的tabs样式重叠
              collapsedOn: '!this.requestAdaptor && !this.adaptor',
              body: [
                {
                  name: 'requestAdaptor',
                  type: 'js-editor',
                  allowFullscreen: true,
                  label: '发送适配器',
                  description:
                    '函数签名：(api) => api， 数据在 api.data 中，修改后返回 api 对象。'
                },

                {
                  name: 'adaptor',
                  type: 'js-editor',
                  allowFullscreen: true,
                  label: '接收适配器',
                  description: '函数签名: (payload, response, api) => payload'
                }
              ]
            }
          ]
        }
      ],
      ...rest
    };
  },
  /**
   * combo 组件样式包装调整
   */
  'combo-container': (config: SchemaObject) => {
    if (isObject(config)) {
      const itemsWrapperClassName =
        (config as any).type === 'combo' &&
        'ae-Combo-items ' + ((config as any).itemsWrapperClassName ?? '');
      return {
        ...(config as any),
        ...(itemsWrapperClassName ? {itemsWrapperClassName} : {})
      };
    }
    return config;
  },

  // 所有组件的状态
  'status': (config: {
    isFormItem?: boolean;
    readonly?: boolean;
    disabled?: boolean;
  }) => {
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
  },

  'source': (patch: any = {}) => {
    return getSchemaTpl('api', {
      name: 'source',
      label: '获取选项接口',
      description: '可以通过接口获取动态选项，一次拉取全部。',
      sampleBuilder: (schema: any) =>
        JSON.stringify(
          {
            status: 0,
            msg: '',
            data: {
              options: [
                {
                  label: '选项A',
                  value: 'a'
                },

                {
                  label: '选项B',
                  value: 'b'
                }
              ]
            }
          },
          null,
          2
        ),
      ...patch
    });
  },

  'autoFill': {
    type: 'input-kv',
    name: 'autoFill',
    label: tipedLabel(
      '自动填充',
      '将当前已选中的选项的某个字段的值，自动填充到表单中某个表单项中，支持数据映射'
    )
  },

  'apiString': {
    name: 'api',
    type: 'input-text',
    placeholder: 'http://'
  },

  'required': {
    type: 'switch',
    name: 'required',
    label: '是否必填',
    mode: 'horizontal',
    horizontal: {
      justify: true,
      left: 8
    },
    inputClassName: 'is-inline '
  },

  /**
   * 表单项描述description
   */
  'description': {
    name: 'description',
    type: 'textarea',
    label: tipedLabel('描述', '表单项控件下方浅色文字描述'),
    maxRows: 2,
    pipeIn: (value: any, data: any) => value || data.desc || ''
  },

  'options': {
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
  },

  'tree': {
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
  },

  'leftFixed': {
    name: 'horizontal.leftFixed',
    type: 'button-group-select',
    visibleOn: 'data.horizontal && data.horizontal.leftFixed',
    label: '宽度',
    options: [
      {
        label: '小',
        value: 'sm'
      },

      {
        label: '中',
        value: 'normal'
      },

      {
        label: '大',
        value: 'lg'
      }
    ]
  },

  'leftRate': {
    name: 'horizontal',
    type: 'input-range',
    visibleOn: 'data.horizontal && !data.horizontal.leftFixed',
    min: 1,
    max: 11,
    step: 1,
    label: tipedLabel('比例', '12 等份，标题宽度占比 n/12'),
    pipeIn(v: any) {
      return v.left || 3;
    },
    pipeOut(v: any) {
      return {left: v, right: 12 - v};
    }
  },

  'horizontal': () => [
    {
      type: 'button-group-select',
      label: '标题宽度',
      name: 'horizontal',
      options: [
        {label: '继承', value: 'formHorizontal'},
        {label: '固宽', value: 'leftFixed'},
        {label: '比例', value: 'leftRate'}
      ],
      pipeIn(v: any) {
        if (!v) {
          return 'formHorizontal';
        }
        if (v.leftFixed) {
          return 'leftFixed';
        }
        return 'leftRate';
      },
      pipeOut(v: any) {
        const defaultData = {
          formHorizontal: undefined,
          leftFixed: {leftFixed: 'normal'},
          leftRate: {left: 3, right: 9}
        };

        // @ts-ignore
        return defaultData[v];
      },
      visibleOn: 'this.mode == "horizontal" && this.label !== false'
    },
    {
      type: 'container',
      className: 'ae-ExtendMore mb-3',
      visibleOn:
        'this.mode == "horizontal" && this.horizontal && this.label !== false',
      body: [getSchemaTpl('leftFixed'), getSchemaTpl('leftRate')]
    }
  ],

  'subFormItemMode': {
    label: '子表单展示模式',
    name: 'subFormMode',
    type: 'button-group-select',
    size: 'sm',
    option: '继承',
    // mode: 'inline',
    // className: 'w-full',
    pipeIn: defaultValue(''),
    options: [
      {
        label: '继承',
        value: ''
      },

      {
        label: '正常',
        value: 'normal'
      },

      {
        label: '内联',
        value: 'inline'
      },

      {
        label: '水平',
        value: 'horizontal'
      }
    ]
  },

  'subFormHorizontalMode': {
    type: 'switch',
    label: '子表单水平占比设置',
    name: 'subFormHorizontal',
    onText: '继承',
    offText: '自定义',
    inputClassName: 'text-sm',
    visibleOn: 'this.subFormMode == "horizontal"',
    pipeIn: (value: any) => !value,
    pipeOut: (value: any, originValue: any, data: any) =>
      value
        ? null
        : data.formHorizontal || {
            leftFixed: 'normal'
          }
  },

  'subFormHorizontal': {
    type: 'combo',
    syncDefaultValue: false,
    visibleOn: 'data.subFormMode == "horizontal" && data.subFormHorizontal',
    name: 'subFormHorizontal',
    multiLine: true,
    pipeIn: (value: any) => {
      return {
        leftRate:
          value && typeof value.left === 'number'
            ? value.left
            : value && /\bcol\-(?:xs|sm|md|lg)\-(\d+)\b/.test(value.left)
            ? parseInt(RegExp.$1, 10)
            : 2,
        leftFixed: (value && value.leftFixed) || ''
      };
    },
    pipeOut: (value: any) => {
      let left = Math.min(11, Math.max(1, value.leftRate || 2));

      return {
        leftFixed: value.leftFixed || '',
        left: left,
        right: 12 - left
      };
    },
    inputClassName: 'no-padder',
    items: [
      {
        name: 'leftFixed',
        type: 'button-group-select',
        label: '左侧宽度',
        size: 'xs',
        options: [
          {
            label: '比率',
            value: ''
          },

          {
            label: '小宽度',
            value: 'sm',
            visibleOn: 'this.leftFixed'
          },

          {
            label: '固定宽度',
            value: 'normal'
          },

          {
            label: '大宽度',
            value: 'lg',
            visibleOn: 'this.leftFixed'
          }
        ]
      },
      {
        name: 'leftRate',
        type: 'input-range',
        visibleOn: '!this.leftFixed',
        min: 1,
        max: 11,
        step: 1,
        label: '左右分布调整(n/12)',
        labelRemark: {
          trigger: 'click',
          className: 'm-l-xs',
          rootClose: true,
          content: '一共 12 等份，这里可以设置左侧宽度占比 n/12。',
          placement: 'left'
        }
      }
    ]
  },

  'validations': (function () {
    const options = [
      // {
      //     label: '必填',
      //     value: 'isRequired'
      // },
      {
        label: '邮箱格式',
        value: 'isEmail'
      },
      {
        label: 'Url格式',
        value: 'isUrl'
      },
      {
        label: '数字',
        value: 'isNumeric'
      },
      {
        label: '字母',
        value: 'isAlpha'
      },
      {
        label: '字母和数字',
        value: 'isAlphanumeric'
      },
      {
        label: '整型数字',
        value: 'isInt'
      },
      {
        label: '浮点型数字',
        value: 'isFloat'
      },
      {
        label: '固定长度',
        value: 'isLength'
      },
      {
        label: '最大长度',
        value: 'maxLength'
      },
      {
        label: '最小长度',
        value: 'minLength'
      },
      {
        label: '最大值',
        value: 'maximum'
      },
      {
        label: '最小值',
        value: 'minimum'
      },
      {
        label: '手机号码',
        value: 'isPhoneNumber'
      },
      {
        label: '电话号码',
        value: 'isTelNumber'
      },
      {
        label: '邮编号码',
        value: 'isZipcode'
      },
      {
        label: '身份证号码',
        value: 'isId'
      },
      {
        label: 'JSON格式',
        value: 'isJson'
      },
      {
        label: '与指定值相同',
        value: 'equals'
      },
      {
        label: '与指定字段值相同',
        value: 'equalsField'
      },
      {
        label: '自定义正则',
        value: 'matchRegexp'
      },
      {
        label: '自定义正则2',
        value: 'matchRegexp1'
      },
      {
        label: '自定义正则3',
        value: 'matchRegexp2'
      },
      {
        label: '自定义正则4',
        value: 'matchRegexp3'
      },
      {
        label: '自定义正则5',
        value: 'matchRegexp4'
      }
    ];

    const trueProps = [
      'isEmail',
      'isUrl',
      'isNumeric',
      'isAlpha',
      'isAlphanumeric',
      'isInt',
      'isFloat',
      'isJson',
      'isPhoneNumber',
      'isTelNumber',
      'isZipcode',
      'isId'
    ];

    function firstValue(arr: Array<any>, iterator: (item: any) => any) {
      let theone = find(arr, iterator);
      return theone ? theone.value : '';
    }

    return {
      type: 'combo',
      syncDefaultValue: false,
      name: 'validations',
      label: '验证规则',
      addButtonText: '新增规则',
      multiple: true,
      pipeIn: (value: any) => {
        if (typeof value === 'string' && value) {
          value = str2rules(value);
        }
        if (!isObject(value)) {
          return value;
        }

        let arr: Array<any> = [];

        Object.keys(value).forEach(key => {
          if (/^\$\$/.test(key)) {
            return;
          }

          arr.push({
            type: key,
            [key]: Array.isArray(value[key]) ? value[key][0] : value[key]
          });
        });

        return arr;
      },
      pipeOut: (value: any) => {
        if (!Array.isArray(value)) {
          return value;
        }
        let obj: any = {};

        value.forEach((item: any) => {
          let key: string =
            item.type ||
            firstValue(options, (item: any) => !obj[item.value]) ||
            options[0].value;
          obj[key] = item[key] || (~trueProps.indexOf(key) ? true : '');
        });

        return obj;
      },
      items: [
        {
          type: 'select',
          unique: true,
          name: 'type',
          options: options,
          columnClassName: 'w-sm'
        },
        {
          type: 'input-number',
          name: 'isLength',
          visibleOn: 'data.type == "isLength"',
          placeholder: '设置长度',
          value: '1'
        },
        {
          type: 'input-number',
          name: 'maximum',
          visibleOn: 'data.type == "maximum"',
          placeholder: '设置最大值'
        },
        {
          type: 'input-number',
          name: 'minimum',
          visibleOn: 'data.type == "minimum"',
          placeholder: '设置最小值'
        },
        {
          type: 'input-number',
          name: 'maxLength',
          visibleOn: 'data.type == "maxLength"',
          placeholder: '设置最大长度值'
        },
        {
          type: 'input-number',
          name: 'minLength',
          visibleOn: 'data.type == "minLength"',
          placeholder: '设置最小长度值'
        },
        {
          type: 'input-text',
          name: 'equals',
          visibleOn: 'data.type == "equals"',
          placeholder: '设置值',
          value: ''
        },
        {
          type: 'input-text',
          name: 'equalsField',
          visibleOn: 'data.type == "equalsField"',
          placeholder: '设置字段名',
          value: ''
        },
        {
          type: 'input-text',
          name: 'matchRegexp',
          visibleOn: 'data.type == "matchRegexp"',
          placeholder: '设置正则规则'
        },
        {
          type: 'input-text',
          name: 'matchRegexp1',
          visibleOn: 'data.type == "matchRegexp1"',
          placeholder: '设置正则规则'
        },
        {
          type: 'input-text',
          name: 'matchRegexp2',
          visibleOn: 'data.type == "matchRegexp2"',
          placeholder: '设置正则规则'
        },
        {
          type: 'input-text',
          name: 'matchRegexp3',
          visibleOn: 'data.type == "matchRegexp3"',
          placeholder: '设置正则规则'
        },
        {
          type: 'input-text',
          name: 'matchRegexp4',
          visibleOn: 'data.type == "matchRegexp4"',
          placeholder: '设置正则规则'
        }
      ]
    };
  })(),

  'validationErrors': (function () {
    const options = [
      // {
      //     label: '必填',
      //     value: 'isRequired'
      // },
      {
        label: '邮箱格式',
        value: 'isEmail'
      },
      {
        label: 'Url格式',
        value: 'isUrl'
      },
      {
        label: '数字',
        value: 'isNumeric'
      },
      {
        label: '字母',
        value: 'isAlpha'
      },
      {
        label: '字母和数字',
        value: 'isAlphanumeric'
      },
      {
        label: '整型数字',
        value: 'isInt'
      },
      {
        label: '浮点型数字',
        value: 'isFloat'
      },
      {
        label: '固定长度',
        value: 'isLength'
      },
      {
        label: '最大长度',
        value: 'maxLength'
      },
      {
        label: '最小长度',
        value: 'minLength'
      },
      {
        label: '最大值',
        value: 'maximum'
      },
      {
        label: '最小值',
        value: 'minimum'
      },
      {
        label: 'JSON格式',
        value: 'isJson'
      },
      {
        label: '手机号码',
        value: 'isPhoneNumber'
      },
      {
        label: '电话号码',
        value: 'isTelNumber'
      },
      {
        label: '邮编号码',
        value: 'isZipcode'
      },
      {
        label: '身份证号码',
        value: 'isId'
      },
      {
        label: '与指定值相同',
        value: 'equals'
      },
      {
        label: '与指定字段值相同',
        value: 'equalsField'
      },
      {
        label: '自定义正则',
        value: 'matchRegexp'
      },
      {
        label: '自定义正则2',
        value: 'matchRegexp1'
      },
      {
        label: '自定义正则3',
        value: 'matchRegexp2'
      },
      {
        label: '自定义正则4',
        value: 'matchRegexp3'
      },
      {
        label: '自定义正则5',
        value: 'matchRegexp4'
      }
    ];

    const defaultMessages = {
      isEmail: 'Email 格式不正确',
      isRequired: '这是必填项',
      isUrl: 'Url 格式不正确',
      isInt: '请输入整形数字',
      isAlpha: '请输入字母',
      isNumeric: '请输入数字',
      isAlphanumeric: '请输入字母或者数字',
      isFloat: '请输入浮点型数值',
      isWords: '请输入字母',
      isUrlPath: '只能输入字母、数字、`-` 和 `_`.',
      matchRegexp: '格式不正确, 请输入符合规则为 `$1` 的内容。',
      minLength: '请输入更多的内容，至少输入 $1 个字符。',
      maxLength: '请控制内容长度, 请不要输入 $1 个字符以上',
      maximum: '当前输入值超出最大值 $1，请检查',
      minimum: '当前输入值低于最小值 $1，请检查',
      isJson: '请检查 Json 格式。',
      isPhoneNumber: '请输入合法的手机号码',
      isTelNumber: '请输入合法的电话号码',
      isZipcode: '请输入合法的邮编地址',
      isId: '请输入合法的身份证号',
      isLength: '请输入长度为 $1 的内容',
      notEmptyString: '请不要全输入空白字符',
      equalsField: '输入的数据与 $1 值不一致',
      equals: '输入的数据与 $1 不一致'
    };

    function firstValue(arr: Array<any>, iterator: (item: any) => any) {
      let theone = find(arr, iterator);
      return theone ? theone.value : '';
    }

    return {
      type: 'combo',
      syncDefaultValue: false,
      name: 'validationErrors',
      label: '自定义验证提示',
      description: '自带提示不满足时，可以自定义。',
      addButtonText: '新增提示',
      multiple: true,
      pipeIn: (value: any) => {
        if (!isObject(value)) {
          return value;
        }

        let arr: Array<any> = [];

        Object.keys(value).forEach(key => {
          if (/^\$\$/.test(key)) {
            return;
          }

          arr.push({
            type: key,
            msg: value[key]
          });
        });

        return arr;
      },
      pipeOut: (value: any) => {
        if (!Array.isArray(value)) {
          return value;
        }
        let obj: any = {};

        value.forEach((item: any) => {
          let key: string =
            item.type ||
            firstValue(options, (item: any) => !obj[item.value]) ||
            options[0].value;
          obj[key] = item.msg || (defaultMessages as any)[key] || '';
        });

        return obj;
      },
      items: [
        {
          type: 'select',
          unique: true,
          name: 'type',
          options: options,
          columnClassName: 'w-sm'
        },

        {
          type: 'input-text',
          name: 'msg',
          placeholder: '提示信息'
        },

        {
          type: 'formula',
          name: 'msg',
          initSet: false,
          formula: `({
                        isEmail: 'Email 格式不正确',
                        isRequired: '这是必填项',
                        isUrl: 'Url 格式不正确',
                        isInt: '请输入整形数字',
                        isAlpha: '请输入字母',
                        isNumeric: '请输入数字',
                        isAlphanumeric: '请输入字母或者数字',
                        isFloat: '请输入浮点型数值',
                        isWords: '请输入字母',
                        isUrlPath: '只能输入字母、数字、\`-\` 和 \`_\`.',
                        matchRegexp: '格式不正确, 请输入符合规则为 \`$1\` 的内容。',
                        minLength: '请输入更多的内容，至少输入 $1 个字符。',
                        maxLength: '请控制内容长度, 请不要输入 $1 个字符以上',
                        maximum: '当前输入值超出最大值 $1，请检查',
                        minimum: '当前输入值低于最小值 $1，请检查',
                        isJson: '请检查 Json 格式。',
                        isLength: '请输入长度为 $1 的内容',
                        notEmptyString: '请不要全输入空白字符',
                        equalsField: '输入的数据与 $1 值不一致',
                        equals: '输入的数据与 $1 不一致',
                        isPhoneNumber: '请输入合法的手机号码',
                        isTelNumber: '请输入合法的电话号码',
                        isZipcode: '请输入合法的邮编地址',
                        isId: '请输入合法的身份证号',
                    })[data.type] || ''`
        }
      ]
    };
  })(),

  'submitOnChange': {
    type: 'switch',
    label: '修改即提交',
    name: 'submitOnChange',
    labelRemark: {
      trigger: 'click',
      className: 'm-l-xs',
      rootClose: true,
      content: '设置后，表单中每次有修改都会触发提交',
      placement: 'left'
    }
  },

  'validateOnChange': {
    type: 'select',
    name: 'validateOnChange',
    label: '校验触发',
    options: [
      {
        label: '提交后每次修改即触发',
        value: ''
      },

      {
        label: '修改即触发',
        value: true
      },

      {
        label: '提交触发',
        value: false
      }
    ],
    pipeIn: defaultValue(''),
    pipeOut: (value: any) => (value === '' ? undefined : !!value)
  },

  'initFetch': {
    type: 'group',
    label: '是否初始加载',
    visibleOn: 'this.initApi',
    direction: 'vertical',
    className: 'm-b-none',
    labelRemark: {
      trigger: 'click',
      rootClose: true,
      className: 'm-l-xs',
      content:
        '当配置初始化接口后，组件初始就会拉取接口数据，可以通过以下配置修改。',
      placement: 'left'
    },
    body: [
      {
        name: 'initFetch',
        type: 'radios',
        inline: true,
        onChange: () => {},
        // pipeIn: (value:any) => typeof value === 'boolean' ? value : '1'
        options: [
          {
            label: '是',
            value: true
          },

          {
            label: '否',
            value: false
          },

          {
            label: '表达式',
            value: ''
          }
        ]
      },

      {
        name: 'initFetchOn',
        autoComplete: false,
        visibleOn: 'typeof this.initFetch !== "boolean"',
        type: 'input-text',
        placeholder: '如：this.id 表示有 id 值时初始加载',
        className: 'm-t-n-sm'
      }
    ]
  },

  'disabled': {
    type: 'ae-StatusControl',
    label: '禁用',
    mode: 'normal',
    name: 'disabled',
    expressioName: 'disabledOn'
  },

  'readonly': {
    type: 'ae-StatusControl',
    label: '只读',
    mode: 'normal',
    name: 'readOnly',
    expressioName: 'readOnlyOn'
  },

  'visible': {
    type: 'ae-StatusControl',
    label: '可见',
    mode: 'normal',
    name: 'visible',
    expressioName: 'visibleOn'
  },

  'hidden': {
    type: 'ae-StatusControl',
    label: '隐藏',
    mode: 'normal',
    name: 'hidden',
    expressioName: 'hiddenOn'
  },

  'maximum': {
    type: 'input-number',
    label: '最大值'
  },

  'minimum': {
    type: 'input-number',
    label: '最小值'
  },

  'switchDefaultValue': {
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
  },
  'numberSwitchDefaultValue': {
    type: 'switch',
    label: tipedLabel('默认值设置', '不设置时根据 name 获取'),
    name: 'value',
    pipeIn: (value: any) => typeof value !== 'undefined',
    pipeOut: (value: any, origin: any, data: any) => (value ? '' : undefined)
  },
  'numberSwitchKeyboard': {
    type: 'switch',
    label: tipedLabel('键盘事件', '键盘上下方向键可控制'),
    name: 'keyboard',
    inputClassName: 'is-inline',
    pipeIn: defaultValue(true)
  },
  'kilobitSeparator': {
    type: 'switch',
    label: '千分符',
    name: 'kilobitSeparator',
    inputClassName: 'is-inline'
  },
  'multiple': (schema: any = {}) => ({
    type: 'ae-Switch-More',
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
  }),

  'checkAll': () => [
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
  ],

  'joinValues': () =>
    getSchemaTpl('switch', {
      label: tipedLabel(
        '拼接值',
        '开启后将选中的选项 value 的值用连接符拼接起来，作为当前表单项的值'
      ),
      name: 'joinValues',
      visibleOn: 'data.multiple',
      value: true
    }),

  'delimiter': {
    type: 'input-text',
    name: 'delimiter',
    label: tipedLabel('拼接符', '将多个值拼接成一个字符串的连接符号'),
    visibleOn: 'data.multiple && data.joinValues',
    pipeIn: defaultValue(',')
  },

  'extractValue': {
    type: 'switch',
    label: tipedLabel(
      '仅提取值',
      '开启后将选中项的 value 封装为数组，关闭后则将整个选项数据封装为数组。'
    ),
    name: 'extractValue',
    inputClassName: 'is-inline',
    visibleOn: 'data.multiple && data.joinValues === false',
    pipeIn: defaultValue(false)
  },

  'creatable': (schema: Partial<SchemaObject> = {}) => {
    return {
      label: tipedLabel('可创建', '配置事件动作可插入或拦截默认交互'),
      type: 'ae-switch-more',
      mode: 'normal',
      name: 'creatable',
      ...schema
    };
  },

  'addApi': () =>
    getSchemaTpl('apiControl', {
      label: '新增接口',
      name: 'addApi',
      visibleOn: 'data.creatable'
    }),

  'createBtnLabel': {
    label: '按钮名称',
    name: 'createBtnLabel',
    type: 'input-text',
    placeholder: '新建'
  },

  'editable': (schema: Partial<SchemaObject> = {}) => {
    return {
      label: tipedLabel('可编辑', '配置事件动作可插入或拦截默认交互'),
      type: 'ae-switch-more',
      mode: 'normal',
      name: 'editable',
      ...schema
    };
  },

  'editApi': () =>
    getSchemaTpl('apiControl', {
      label: '编辑接口',
      name: 'editApi',
      visibleOn: 'data.editable'
    }),

  'removable': (schema: Partial<SchemaObject> = {}) => {
    return {
      label: tipedLabel('可删除', '配置事件动作可插入或拦截默认交互'),
      type: 'ae-switch-more',
      mode: 'normal',
      name: 'removable',
      ...schema
    };
  },

  'deleteApi': () =>
    getSchemaTpl('apiControl', {
      label: '删除接口',
      name: 'deleteApi',
      visibleOn: 'data.removable'
    }),

  'ref': () => {
    // {
    //   type: 'input-text',
    //   name: '$ref',
    //   label: '选择定义',
    //   labelRemark: '输入已经在page中设定好的定义'
    // }
    return null;
  },

  'imageUrl': {
    type: 'input-text',
    label: '图片'
  },

  'backgroundImageUrl': {
    type: 'input-text',
    label: '图片路径'
  },

  'fileUrl': {
    type: 'input-text',
    label: '文件'
  },

  'markdownBody': {
    name: 'value',
    type: 'editor',
    language: 'markdown',
    size: 'xxl',
    label: 'Markdown 内容',
    options: {
      lineNumbers: 'off'
    }
  },

  'richText': {
    label: '富文本',
    type: 'input-rich-text',
    buttons: [
      'paragraphFormat',
      'quote',
      'color',
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
  },

  'showCounter': {
    type: 'switch',
    label: '计数器',
    name: 'showCounter',
    inputClassName: 'is-inline'
  },

  'borderMode': {
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
  },

  'searchable': () =>
    getSchemaTpl('switch', {
      label: '可检索',
      name: 'searchable'
    }),

  'sortable': {
    type: 'switch',
    label: '可排序',
    name: 'sortable'
  },

  'selectFirst': {
    type: 'switch',
    label: '是否默认选择第一个',
    name: 'selectFirst'
  },

  'hideNodePathLabel': {
    type: 'switch',
    label: tipedLabel('隐藏路径', '隐藏选中节点的祖先节点文本信息'),
    name: 'hideNodePathLabel',
    inputClassName: 'is-inline'
  },

  'onlyLeaf': {
    type: 'switch',
    label: tipedLabel('必须选到末级', '必须选择到末级，不能选择中间层级'),
    horizontal: {
      left: 5,
      justify: true
    },
    name: 'onlyLeaf',
    value: false,
    inputClassName: 'is-inline'
  },

  'clearValueOnHidden': () =>
    getSchemaTpl('switch', {
      type: 'switch',
      horizontal: {left: 8, justify: true},
      label: tipedLabel(
        '隐藏时删除字段',
        '当前表单项隐藏时，表单提交数据中会删除该表单项的值'
      ),
      name: 'clearValueOnHidden'
    }),

  'utc': {
    type: 'switch',
    label: tipedLabel(
      'UTC转换',
      '开启后，提交数据和展示数据将进行UTC转换；存在跨地域用户的应用建议开启'
    ),
    name: 'utc',
    inputClassName: 'is-inline'
  },

  'embed': {
    type: 'switch',
    label: '内嵌模式',
    name: 'embed'
  },

  'buttonLevel': {
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
  },

  'uploadType': {
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
  },

  'bos': {
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
  },

  'proxy': {
    type: 'switch',
    label: '后端代理',
    name: 'proxy',
    mode: 'horizontal',
    horizontal: {
      justify: true,
      left: 8
    },
    inputClassName: 'is-inline'
  },

  /**
   * 选项控件: 带默认值设置功能
   */
  'optionControl': {
    label: '数据',
    mode: 'normal',
    name: 'options',
    type: 'ae-optionControl'
  },

  /**
   * 新版选项控件: 不带设置默认值功能
   * 备注: 表单项组件默认值支持公式需要
   */
   'optionControlV2': {
    label: '数据',
    mode: 'normal',
    name: 'options',
    type: 'ae-optionControl',
    closeDefaultCheck: true // 关闭默认值设置
  },

  'badge': {
    label: '角标',
    name: 'badge',
    type: 'ae-badge'
  },

  /**
   * 接口控件
   */
  'apiControl': (patch: any = {}) => {
    const {name, label, value, description, sampleBuilder, ...rest} = patch;

    return {
      type: 'ae-apiControl',
      label,
      name,
      description,
      mode: 'normal',
      labelRemark: sampleBuilder
        ? {
            icon: '',
            label: '示例',
            title: '接口返回示例',
            tooltipClassName: 'ae-ApiSample-tooltip',
            render: (data: any) => (
              <Html
                className="ae-ApiSample"
                inline={false}
                html={`
                    <pre><code>${sampleBuilder(data)}</code></pre>
                    `}
              />
            ),
            trigger: 'click',
            className: 'm-l-xs',
            rootClose: true,
            placement: 'left'
          }
        : undefined,
      ...rest
    };
  },

  'validation': (config: {
    tag: ValidatorTag | ((ctx: any) => ValidatorTag);
  }) => {
    let a = {
      title: '校验',
      body: [
        {
          type: 'ae-validationControl',
          mode: 'normal',
          ...config
          // pipeIn: (value: any, data: any) => {
          //   // return reduce(value, (arr: any, item) => {
          //   //   if (typeof item === 'string') {
          //   //     arr.push(item);
          //   //   }
          //   //   else {
          //   //     let isAdd = false;
          //   //     // 优先判断是否具备可展示条件
          //   //     forEach(item?.isShow, (val, key) => {
          //   //       if ([...val].includes(data?.data[key])) {
          //   //         isAdd = true;
          //   //         return false;
          //   //       }
          //   //     })
          //   //     !isAdd  && forEach(item?.isHidden, (val, key) => {
          //   //       const hasExist = [...val].includes(data?.data[key]);
          //   //         isAdd = hasExist ? false : true;
          //   //         if (hasExist) {
          //   //           return false;
          //   //         }
          //   //     })
          //   //     isAdd && arr.push(item.option);
          //   //   }
          //   //   return arr;
          //   // }, []);
          // },
        },
        getSchemaTpl('validateOnChange')
      ]
    };
    return a;
  },
  /**
   * 表单项校验控件
   */
  'validationControl': (value: Array<ValidationOptions> = []) => ({
    type: 'ae-validationControl',
    label: '校验规则',
    mode: 'normal',
    pipeIn: (value: any, data: any) => {
      return reduce(
        value,
        (arr: any, item) => {
          if (typeof item === 'string') {
            arr.push(item);
          } else {
            let isAdd = false;
            // 优先判断是否具备可展示条件
            forEach(item?.isShow, (val, key) => {
              if ([...val].includes(data?.data[key])) {
                isAdd = true;
                return false;
              }
              return true;
            });
            !isAdd &&
              forEach(item?.isHidden, (val, key) => {
                const hasExist = [...val].includes(data?.data[key]);
                isAdd = hasExist ? false : true;
                if (hasExist) {
                  return false;
                }
                return true;
              });
            isAdd && arr.push(item.option);
          }
          return arr;
        },
        []
      );
    },
    value
  }),

  /**
   * 表达式编辑器控件
   */
  'formulaControl': (schema: object = {}) => {
    return {
      type: 'ae-formulaControl',
      ...schema
    };
  },

  /**
   * 日期范围快捷键组件
   */
  'dateShortCutControl': (schema: object = {}) => {
    return {
      type: 'ae-DateShortCutControl',
      ...schema
    };
  },

  'eventControl': (schema: any = {}) => {
    return {
      type: 'ae-eventControl',
      mode: 'normal',
      ...schema
    };
  },

  'style:formItem': ({renderer, schema}: any) => {
    return {
      title: '表单项',
      key: 'formItem',
      body: [
        getSchemaTpl('formItemMode'),
        getSchemaTpl('labelHide'),
        getSchemaTpl('horizontal'),
        renderer?.sizeMutable !== false ? getSchemaTpl('formItemSize') : null
        // getSchemaTpl('formItemInline')
      ].concat(schema)
    };
  },

  'style:classNames': (config: {
    schema: SchemaCollection;
    isFormItem: boolean;
  }) => {
    const {isFormItem = true, schema = []} = config || {};

    return {
      title: 'CSS 类名',
      body: (isFormItem
        ? [
            getSchemaTpl('className', {
              label: '表单项'
            }),
            getSchemaTpl('className', {
              label: '标签',
              name: 'labelClassName'
            }),
            getSchemaTpl('className', {
              label: '控件',
              name: 'inputClassName'
            })
          ]
        : [
            getSchemaTpl('className', {
              label: '外层'
            })
          ]
      ).concat(schema)
    };
  },

  'style:others': (schemas: any[] = []) => ({
    title: '其他项',
    body: [...schemas]
  }),

  'data': {
    type: 'input-kv',
    name: 'data',
    label: '初始静态数据'
  },

  'app-page': {
    type: 'nested-select',
    label: '选择页面',
    name: 'link',
    mode: 'horizontal',
    size: 'lg',
    required: true,
    options: []
  },

  'app-page-args': {
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
  }
};

/**
 * 样式相关的属性面板，因为预计会比较多所以拆出来
 */
export const styleTpl = {
  name: 'style',
  type: 'combo',
  label: '',
  noBorder: true,
  multiLine: true,
  items: [
    {
      type: 'fieldSet',
      title: '文字',
      body: [
        {
          type: 'group',
          body: [
            {
              label: '文字大小',
              type: 'input-text',
              name: 'fontSize'
            },
            {
              label: '文字粗细',
              name: 'fontWeight',
              type: 'select',
              options: ['normal', 'bold', 'lighter', 'bolder']
            }
          ]
        },
        {
          type: 'group',
          body: [
            {
              label: '文字颜色',
              type: 'input-color',
              name: 'color'
            },
            {
              label: '对齐方式',
              name: 'textAlign',
              type: 'select',
              options: [
                'left',
                'right',
                'center',
                'justify',
                'justify-all',
                'start',
                'end',
                'match-parent'
              ]
            }
          ]
        }
      ]
    },
    {
      type: 'fieldSet',
      title: '背景',
      body: [
        {
          label: '颜色',
          name: 'backgroundColor',
          type: 'input-color'
        },
        getSchemaTpl('imageUrl', {
          name: 'backgroundImage'
        })
      ]
    },
    {
      type: 'fieldSet',
      title: '边距',
      body: [
        {
          type: 'group',
          label: '外边距',
          body: [
            {
              label: '上',
              name: 'marginTop',
              type: 'input-text'
            },
            {
              label: '右',
              name: 'marginRight',
              type: 'input-text'
            },
            {
              label: '下',
              name: 'marginBottom',
              type: 'input-text'
            },
            {
              label: '左',
              name: 'marginLeft',
              type: 'input-text'
            }
          ]
        },
        {
          type: 'group',
          label: '内边距',
          body: [
            {
              label: '上',
              name: 'paddingTop',
              type: 'input-text'
            },
            {
              label: '右',
              name: 'paddingRight',
              type: 'input-text'
            },
            {
              label: '下',
              name: 'paddingBottom',
              type: 'input-text'
            },
            {
              label: '左',
              name: 'paddingLeft',
              type: 'input-text'
            }
          ]
        }
      ]
    },
    {
      type: 'fieldSet',
      title: '边框',
      body: [
        {
          type: 'group',
          body: [
            {
              label: '样式',
              name: 'borderStyle',
              type: 'select',
              options: ['none', 'solid', 'dotted', 'dashed']
            },
            {
              label: '颜色',
              name: 'borderColor',
              type: 'input-color'
            }
          ]
        },
        {
          type: 'group',
          body: [
            {
              label: '宽度',
              name: 'borderWidth',
              type: 'input-text'
            },
            {
              label: '圆角宽度',
              name: 'borderRadius',
              type: 'input-text'
            }
          ]
        }
      ]
    },
    {
      type: 'fieldSet',
      title: '特效',
      body: [
        {
          label: '透明度',
          name: 'opacity',
          min: 0,
          max: 1,
          step: 0.05,
          type: 'input-range',
          pipeIn: defaultValue(1)
        },
        {
          label: '阴影',
          name: 'boxShadow',
          type: 'input-text'
        }
      ]
    }
  ]
};

/**
 * 通用CSS Style控件
 * @param {string | Array<string>} exclude 需要隐藏的配置key
 * @param {string | Array<string>} include 包含的配置key，存在时，优先级高于exclude
 */
tpls['style:common'] = (
  exclude: string[] | string,
  include: string[] | string,
) => {
  // key统一转换成Kebab case，eg: boxShadow => bos-shadow
  exclude = (exclude
    ? Array.isArray(exclude)
      ? exclude
      : [exclude]
    : []
  ).map((key: string) => kebabCase(key));

  include = (include
    ? Array.isArray(include)
      ? include
      : [include]
    : []
  ).map((key: string) => kebabCase(key));

  return [
    {
      header: '布局',
      key: 'layout',
      body: [
        {
          type: 'style-display',
          label: false,
          name: 'style'
        }
      ].filter(comp => !~exclude.indexOf(comp.type.replace(/^style-/i, '')))
    },
    {
      header: '文字',
      key: 'font',
      body: [
        {
          type: 'style-font',
          label: false,
          name: 'style'
        }
      ]
    },
    {
      header: '内外边距',
      key: 'box-model',
      body: [
        {
          type: 'style-box-model',
          label: false,
          name: 'style'
        }
      ]
    },
    {
      header: '背景',
      key: 'background',
      body: [
        {
          type: 'style-background',
          label: false,
          name: 'style'
        }
      ]
    },
    {
      header: '边框',
      key: 'border',
      body: [
        {
          type: 'style-border',
          label: false,
          name: 'style'
        }
      ]
    },
    {
      header: '阴影',
      key: 'box-shadow',
      body: [
        {
          type: 'style-box-shadow',
          label: false,
          name: 'style.boxShadow'
        }
      ]
    },
    {
      header: '其他',
      key: 'other',
      body: [
        {
          label: '透明度',
          name: 'style.opacity',
          min: 0,
          max: 1,
          step: 0.05,
          type: 'input-range',
          pipeIn: defaultValue(1),
          marks: {
            '0%': '0',
            '50%': '0.5',
            '100%': '1'
          }
        },
        {
          label: '光标类型',
          name: 'style.cursor',
          type: 'select',
          mode: 'row',
          menuTpl: {
            type: 'html',
            html:
              "<span style='cursor:${value};'>${label}</span><code class='ae-Code'>${value}</code>",
            className: 'ae-selection-code'
          },
          pipIn: defaultValue('default'),
          options: [
            {label: '默认', value: 'default'},
            {label: '自动', value: 'auto'},
            {label: '无指针', value: 'none'},
            {label: '悬浮', value: 'pointer'},
            {label: '帮助', value: 'help'},
            {label: '文本', value: 'text'},
            {label: '单元格', value: 'cell'},
            {label: '交叉指针', value: 'crosshair'},
            {label: '可移动', value: 'move'},
            {label: '禁用', value: 'not-allowed'},
            {label: '可抓取', value: 'grab'},
            {label: '放大', value: 'zoom-in'},
            {label: '缩小', value: 'zoom-out'}
          ]
        }
      ]
    }
  ].filter(item =>
    include.length
      ? ~include.indexOf(item.key)
      : !~exclude.indexOf(item.key)
  );
};

export function getCollapseCate(config: {
  name: string;
  body: SchemaCollection;
  visibleOn?: string;
  tools: SchemaCollection;
}) {
  return;
}

export function getSchemaTpl(name: string, patch?: object, rendererSchema?: any): any {
  const tpl = tpls[name] || {};
  let schema = null;

  if (typeof tpl === 'function') {
    schema = tpl(patch, rendererSchema);
  } else {
    schema = tpl
      ? patch
        ? {
            ...tpl,
            ...patch
          }
        : tpl
      : null;
  }

  return schema;
}

export function setSchemaTpl(name: string, value: any) {
  tpls[name] = value;
}

export function valuePipeOut(value: any) {
  try {
    if (value === 'undefined') {
      return undefined;
    }

    return JSON.parse(value);
  } catch (e) {
    return value;
  }
}

export function undefinedPipeOut(value: any) {
  if (Array.isArray(value)) {
    return value.length ? value : undefined;
  }

  if (typeof value === 'string') {
    return value ? value : undefined;
  }

  if (typeof value === 'object') {
    return Object.keys(value).length ? value : undefined;
  }
  return value;
}

export function defaultValue(defaultValue: any, strictMode: boolean = true) {
  return strictMode
    ? (value: any) => (typeof value === 'undefined' ? defaultValue : value)
    : (value: any) => value || defaultValue;
}
