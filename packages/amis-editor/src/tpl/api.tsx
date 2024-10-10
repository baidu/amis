import {
  setSchemaTpl,
  getSchemaTpl,
  tipedLabel,
  BaseEventContext
} from 'amis-editor-core';
import React from 'react';
import {buildApi, Html} from 'amis';
import get from 'lodash/get';

setSchemaTpl('api', (patch: any = {}) => {
  const {name, label, value, description, sampleBuilder, apiDesc, ...rest} =
    patch;

  return {
    type: 'container',
    body: [
      {
        type: 'checkbox',
        label: label || 'API',
        labelRemark: sampleBuilder
          ? {
              label: false,
              title: '接口返回示例',
              icon: 'fas fa-code',
              className: 'm-l-xs ae-ApiSample-icon',
              tooltipClassName: 'ae-ApiSample-tooltip',
              children: (data: any) => (
                <Html
                  className="ae-ApiSample"
                  inline={false}
                  html={`
                  <pre><code>${sampleBuilder(data)}</code></pre>
                  `}
                />
              ),
              trigger: 'click',
              rootClose: true,
              placement: 'left'
            }
          : undefined,
        option: '高级配置',
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

            const m =
              /^(raw:|external:)?(get|post|put|patch|delete):(.*)$/.exec(url);
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
            tpl: '当没开启数据映射时，发送 API 的时候会发送尽可能多的数据，如果你想自己控制发送的数据，或者需要额外的数据处理，请开启此选项'
          },

          {
            type: 'ae-DataMappingControl',
            syncDefaultValue: false,
            name: 'data',
            mode: 'normal',
            renderLabel: false,
            visibleOn: 'this.data',
            valueType: 'ae-DataPickerControl',
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
            label: '静默请求',
            name: 'silent',
            mode: 'inline',
            description: '是否静默发送请求，屏蔽报错提示'
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
            description: `${'发送体格式为'}：<%= data.dataType === "json" ? "application/json" : (data.dataType === "form-data" ? "multipart/form-data" : (data.dataType === "form" ? "application/x-www-form-urlencoded" : "")) %>，${'当发送内容中存在文件时会自动使用 form-data 格式。'}`,
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
});

setSchemaTpl('source', (patch: any = {}) => {
  return getSchemaTpl('api', {
    name: 'source',
    label: '获取选项接口',
    description: '可以通过接口获取动态选项，一次拉取全部。',
    sampleBuilder: () =>
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
});

setSchemaTpl('apiString', {
  name: 'api',
  type: 'input-text',
  placeholder: 'http://'
});

setSchemaTpl(
  'initFetch',
  (overrides: {visibleOn?: string; name?: string} = {}) => {
    const visibleOn = get(overrides, 'visibleOn', 'this.initApi');
    const fieldName = get(overrides, 'name', 'initFetch');
    const label = get(overrides, 'label', '是否初始加载');

    return {
      type: 'group',
      label: tipedLabel(
        label,
        '当配置初始化接口后，组件初始就会拉取接口数据，可以通过以下配置修改。'
      ),
      visibleOn,
      direction: 'vertical',
      body: [
        {
          name: fieldName,
          type: 'radios',
          inline: true,
          value: false,
          // pipeIn: (value:any) => typeof value === 'boolean' ? value : '1'
          options: [
            {label: '是', value: true},
            {label: '否', value: false},
            {label: '表达式', value: ''}
          ]
        },

        getSchemaTpl('valueFormula', {
          label: '',
          name: `${fieldName}On`,
          autoComplete: false,
          visibleOn: `typeof this.${fieldName} !== "boolean"`,
          placeholder: '如：this.id 表示有 id 值时初始加载',
          className: 'm-t-n-sm'
        })
        // {
        //   name: `${fieldName}On`,
        //   autoComplete: false,
        //   visibleOn: `typeof this.${fieldName} !== "boolean"`,
        //   type: 'input-text',
        //   placeholder: '如：this.id 表示有 id 值时初始加载',
        //   className: 'm-t-n-sm'
        // }
      ]
    };
  }
);

setSchemaTpl('proxy', {
  type: 'switch',
  label: '后端代理',
  name: 'proxy',
  mode: 'horizontal',
  horizontal: {
    justify: true,
    left: 8
  },
  inputClassName: 'is-inline'
});

setSchemaTpl('apiControl', (patch: any = {}) => {
  const {name, label, value, description, sampleBuilder, apiDesc, ...rest} =
    patch;

  return {
    type: 'ae-apiControl',
    label,
    name: name || 'api',
    description,
    labelRemark: sampleBuilder
      ? {
          label: false,
          title: '接口返回示例',
          icon: 'fas fa-code',
          className: 'm-l-xs ae-ApiSample-icon',
          tooltipClassName: 'ae-ApiSample-tooltip',
          children: (data: any) => (
            <Html
              className="ae-ApiSample"
              inline={false}
              html={`
                  <pre><code>${sampleBuilder(data)}</code></pre>
                  `}
            />
          ),
          trigger: 'click',
          rootClose: true,
          placement: 'left'
        }
      : undefined,
    ...rest
  };
});

setSchemaTpl(
  'interval',
  (config?: {
    switchMoreConfig?: any;
    formItems?: any[];
    intervalConfig?: any;
  }) => ({
    type: 'ae-switch-more',
    label: '定时刷新',
    name: 'interval',
    formType: 'extend',
    bulk: true,
    mode: 'normal',
    form: {
      body: [
        getSchemaTpl('withUnit', {
          label: '刷新间隔',
          name: 'interval',
          control: {
            type: 'input-number',
            name: 'interval',
            value: 1000
          },
          unit: '毫秒',
          ...((config && config.intervalConfig) || {})
        }),
        ...((config && config.formItems) || [])
      ]
    },
    ...((config && config.switchMoreConfig) || {})
  })
);

setSchemaTpl('silentPolling', () =>
  getSchemaTpl('switch', {
    label: tipedLabel('静默刷新', '设置自动定时刷新时是否显示loading'),
    name: 'silentPolling',
    visibleOn: '!!this.interval'
  })
);

setSchemaTpl('stopAutoRefreshWhen', (extra: any = {}) =>
  getSchemaTpl('valueFormula', {
    name: 'stopAutoRefreshWhen',
    label: tipedLabel(
      '定时刷新停止',
      '定时刷新一旦设置会一直刷新，除非给出表达式，条件满足后则停止刷新'
    ),
    visibleOn: '!!this.interval',
    ...extra
  })
);

/**
 * 接口控件
 */
setSchemaTpl('actionApiControl', (patch: any = {}) => {
  const {name, label, value, description, sampleBuilder, ...rest} = patch;

  return {
    type: 'ae-actionApiControl',
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
          children: (data: any) => (
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
});

const enum LoadingOption {
  HIDDEN,
  MERGE,
  GLOBAL
}

setSchemaTpl(
  'loadingConfig',
  (patch: any, {context}: {context: BaseEventContext}) => {
    let globalSelector = '';
    let parent = context.node.parent;

    while (parent && !globalSelector) {
      const parentNodeType = parent.type;

      if (parentNodeType === 'dialog' || parentNodeType === 'drawer') {
        globalSelector = '[role=dialog-body]';
      } else if (parentNodeType === 'page') {
        globalSelector = '[role=page-body]';
      }

      parent = parent.parent;
    }

    return {
      name: 'loadingConfig',
      type: 'select',
      label: '加载设置',
      options: [
        {
          label: '合并到上层loading',
          value: LoadingOption.MERGE
        },
        {
          label: '不展示loading',
          value: LoadingOption.HIDDEN
        },
        {
          label: '使用页面全局loading',
          value: LoadingOption.GLOBAL
        }
      ],
      ...patch,
      pipeOut: (value: LoadingOption) => {
        switch (value) {
          case LoadingOption.HIDDEN:
            return {
              show: false
            };
          case LoadingOption.GLOBAL:
            return {
              show: true,
              root: globalSelector
            };
          case LoadingOption.MERGE:
            return {
              show: true
            };
          default:
            return {};
        }
      },
      pipeIn: (value: any = {}) => {
        if (value.root) {
          return LoadingOption.GLOBAL;
        }
        if (value.show === false) {
          return LoadingOption.HIDDEN;
        }
        return LoadingOption.MERGE;
      }
    };
  }
);
