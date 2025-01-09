import {
  setSchemaTpl,
  getSchemaTpl,
  tipedLabel,
  BaseEventContext
} from 'amis-editor-core';
import React from 'react';
import {buildApi, Html} from 'amis';
import get from 'lodash/get';

setSchemaTpl('source', (patch: any = {}) => {
  return getSchemaTpl('apiControl', {
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
