/**
 * @file 公共的动作配置项
 */
import React from 'react';
import { defaultValue } from '../component/schemaTpl';
import {ActionConfigItemsMap} from './index';

const MSG_TYPES: {[key: string]: string} = {
  info: '提示',
  warning: '警告',
  success: '成功',
  error: '错误'
};

// 数据容器范围
export const DATA_CONTAINER = [
  'form',
  'dialog',
  'drawer',
  'wizard',
  'service',
  'page',
  'app',
  'chart'
];

// 是否数据容器
export const IS_DATA_CONTAINER = `${JSON.stringify(
  DATA_CONTAINER
)}.includes(__rendererName)`;

export const getComboWrapper = (items: any, multiple: boolean = false) => ({
  type: 'combo',
  name: 'args',
  // label: '动作参数',
  multiple,
  strictMode: false,
  items: Array.isArray(items) ? items : [items]
});

// 表单项组件
export const FORMITEM_CMPTS = [
  'button-group-select',
  'button-toolbar',
  'chained-select',
  'chart-radios',
  'checkbox',
  'checkboxes',
  'combo',
  'input-kv',
  'condition-builder',
  'diff-editor',
  'editor',
  'formula',
  'hidden',
  'icon-picker',
  'input-array',
  'input-city',
  'input-color',
  'input-date',
  'input-date-range',
  'input-datetime-range',
  'input-time-range',
  'input-excel',
  'input-file',
  'input-formula',
  'input-group',
  'input-image',
  'input-month-range',
  'input-number',
  'input-quarter-range',
  'input-range',
  'input-rating',
  'input-repeat',
  'input-rich-text',
  'input-sub-form',
  'input-table',
  'input-tag',
  'input-text',
  'input-password',
  'input-email',
  'input-url',
  'native-date',
  'native-time',
  'native-number',
  'input-tree',
  'input-year-range',
  'list-select',
  'location-picker',
  'matrix-checkboxes',
  'nested-select',
  'cascader-select',
  'picker',
  'radios',
  'select',
  'multi-select',
  'switch',
  'tabs-transfer',
  'tabs-transfer-picker',
  'textarea',
  'transfer',
  'transfer-picker',
  'tree-select',
  'uuid'
];

// 动作配置项schema map
export const COMMON_ACTION_SCHEMA_MAP: ActionConfigItemsMap = {
  url: {
    config: ['url', 'params', 'blank'],
    desc: (info: any) => {
      return (
        <div>
          跳转至
          <span className="variable-left">
            {info?.args?.url}
          </span>
        </div>
      );
    },
    schema: getComboWrapper([
      {
        type: 'wrapper',
        className: 'p-none',
        body: [
          {
            label: '页面地址',
            type: 'input-formula',
            variables: '${variables}',
            evalMode: false,
            variableMode: 'tabs',
            inputMode: 'input-group',
            name: 'url',
            placeholder: 'http://',
            mode: 'horizontal',
            size: 'lg',
            required: true
          },
          {
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
                variables: '${variables}',
                evalMode: false,
                variableMode: 'tabs',
                inputMode: 'input-group',
                size: 'xs'
              }
            ]
          },
          {
            type: 'switch',
            name: 'blank',
            label: '新窗口打开',
            onText: '是',
            offText: '否',
            mode: 'horizontal',
            pipeIn: defaultValue(true)
          }
        ]
      }
    ])
  },
  custom: {
    schema: {
      type: 'js-editor',
      allowFullscreen: true,
      required: true,
      name: 'script',
      label: '自定义JS',
      mode: 'horizontal',
      className: 'ae-event-control-action-js-editor',
      value: `/* 自定义JS使用说明： 
 * 1.动作执行函数doAction，可以执行所有类型的动作
 * 2.通过上下文对象context可以获取当前组件实例，例如context.props可以获取该组件相关属性
 * 3.事件对象event，在doAction之后执行event.stopPropagation = true;可以阻止后续动作执行
*/
const myMsg = '我是自定义JS';
doAction({
  actionType: 'toast',
  args: {
    msg: myMsg
  }
});
`
    }
  },
  toast: {
    config: [
      'title',
      'msgType',
      'msg',
      'position',
      'timeout',
      'closeButton',
      'showIcon'
    ],
    desc: (info: any) => {
      return (
        <div>
          <span className="variable-right">
            {MSG_TYPES[info?.args?.msgType] || ''}
          </span>
          消息提醒：
          <span className="variable-left">{info?.args?.msg}</span>
        </div>
      );
    },
    schema: getComboWrapper({
      type: 'wrapper',
      className: 'p-none',
      body: [
        {
          type: 'button-group-select',
          name: 'msgType',
          label: '消息类型',
          value: 'info',
          required: true,
          mode: 'horizontal',
          options: Object.keys(MSG_TYPES).map(key => ({
            label: MSG_TYPES[key],
            value: key,
            level: 'default'
          }))
        },
        {
          name: 'msg',
          label: '消息内容',
          mode: 'horizontal',
          type: 'input-formula',
          variables: '${variables}',
          evalMode: false,
          variableMode: 'tabs',
          inputMode: 'input-group',
          size: 'lg',
          required: true
        },
        {
          name: 'title',
          type: 'input-formula',
          variables: '${variables}',
          evalMode: false,
          variableMode: 'tabs',
          inputMode: 'input-group',
          label: '标题内容',
          size: 'lg',
          mode: 'horizontal'
        },
        {
          name: 'timeout',
          type: 'input-formula',
          variables: '${variables}',
          evalMode: false,
          variableMode: 'tabs',
          inputMode: 'input-group',
          label: '持续时间(ms)',
          size: 'lg',
          mode: 'horizontal'
        },
        {
          type: 'button-group-select',
          name: 'position',
          value: 'top-right',
          mode: 'horizontal',
          label: '显示位置',
          options: [
            {
              label: '左上',
              value: 'top-left'
            },

            {
              label: '中上',
              value: 'top-center'
            },

            {
              label: '右上',
              value: 'top-right'
            },

            {
              label: '左下',
              value: 'bottom-left'
            },
            {
              label: '中下',
              value: 'bottom-center'
            },

            {
              label: '右下',
              value: 'bottom-right'
            }
          ]
        },
        {
          type: 'switch',
          name: 'closeButton',
          value: true,
          label: '展示关闭按钮',
          mode: 'horizontal'
        },
        {
          type: 'switch',
          name: 'showIcon',
          value: true,
          label: '展示图标',
          mode: 'horizontal'
        }
      ]
    })
  },
  setValue: {
    config: ['value', 'valueInput'],
    withComponentId: true,
    desc: (info: any) => {
      return (
        <div>
          设置
          <span className="variable-left variable-right">
            {info?.__rendererLabel}
          </span>
          的数据
          {/* <span className="variable-left variable-right">
            {info?.args?.value
              ? JSON.stringify(info?.args?.value)
              : info?.args?.valueInput}
          </span> */}
        </div>
      );
    },
    schema: getComboWrapper({
      type: 'wrapper',
      className: 'p-none',
      body: [
        {
          type: 'combo',
          name: 'value',
          label: '字段赋值',
          multiple: true,
          removable: true,
          required: true,
          addable: true,
          strictMode: false,
          canAccessSuperData: true,
          mode: 'horizontal',
          items: [
            {
              name: 'key',
              type: 'input-text',
              placeholder: '字段名',
              required: true
            },
            {
              name: 'val',
              type: 'input-formula',
              placeholder: '字段值',
              variables: '${variables}',
              evalMode: false,
              variableMode: 'tabs',
              inputMode: 'input-group'
            }
          ],
          visibleOn: `data.__rendererName && ${IS_DATA_CONTAINER}`
        },
        {
          type: 'combo',
          name: 'value',
          label: '字段赋值',
          multiple: true,
          removable: true,
          required: true,
          addable: true,
          strictMode: false,
          canAccessSuperData: true,
          mode: 'horizontal',
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
              mode: 'horizontal',
              items: [
                {
                  name: 'key',
                  type: 'input-text',
                  required: true
                },
                {
                  name: 'val',
                  type: 'input-formula',
                  variables: '${variables}',
                  evalMode: false,
                  variableMode: 'tabs',
                  inputMode: 'input-group'
                }
              ]
            }
          ],
          visibleOn: `data.__rendererName && __rendererName === 'combo'`
        },
        {
          name: 'valueInput',
          type: 'input-formula',
          variables: '${variables}',
          evalMode: false,
          variableMode: 'tabs',
          inputMode: 'input-group',
          label: '数据值',
          size: 'lg',
          mode: 'horizontal',
          visibleOn: `data.__rendererName && !${IS_DATA_CONTAINER} && __rendererName !== 'combo'`,
          required: true
        }
      ]
    })
  },
  broadcast: {
    schema: {
      type: 'wrapper',
      className: 'p-none',
      body: [
        {
          type: 'input-text',
          name: 'eventName',
          label: '广播标识',
          mode: 'horizontal',
          required: true,
          description: '广播事件标识派发出去后，其他组件可以进行监听并作出响应'
        },
        {
          type: 'input-text',
          label: '广播名称',
          name: 'eventLabel',
          mode: 'horizontal',
          required: true
        },
        {
          type: 'textarea',
          label: '描述',
          name: 'description',
          mode: 'horizontal',
          required: true
        }
      ]
    }
  },
  copy: {
    config: ['content', 'copyFormat'],
    desc: (info: any) => {
      return (
        <div>
          复制内容：
          <span className="variable-left">{info?.args?.content}</span>
        </div>
      );
    },
    schema: getComboWrapper({
      type: 'wrapper',
      className: 'p-none',
      body: [
        {
          name: 'content',
          type: 'input-formula',
          variables: '${variables}',
          evalMode: false,
          variableMode: 'tabs',
          inputMode: 'input-group',
          label: '内容模板',
          mode: 'horizontal',
          size: 'lg',
          required: true
        },
        {
          type: 'select',
          name: 'copyFormat',
          mode: 'horizontal',
          value: 'text/plain',
          size: 'lg',
          options: [
            {
              label: '纯文本',
              value: 'text/plain'
            },
            {
              label: '富文本',
              value: 'text/html'
            }
          ],
          label: '复制格式'
        }
      ]
    })
  },
  refresh: {
    desc: (info: any) => <div>刷新页面</div>
  },
  goBack: {
    desc: (info: any) => <div>返回上一页</div>
  },
  alert: {
    desc: (info: any) => <div>打开提示对话框</div>
  },
  confirm: {
    desc: (info: any) => <div>打开确认对话框</div>
  },
  reload: {
    withComponentId: true,
    desc: (info: any) => {
      return (
        <div>
          刷新
          <span className="variable-left variable-right">
            {info?.__rendererLabel}
          </span>
          组件
        </div>
      );
    }
  },
  show: {
    withComponentId: true,
    desc: (info: any) => {
      return (
        <div>
          显示
          <span className="variable-left variable-right">
            {info?.__rendererLabel}
          </span>
          组件
        </div>
      );
    }
  },
  hidden: {
    withComponentId: true,
    desc: (info: any) => {
      return (
        <div>
          隐藏
          <span className="variable-left variable-right">
            {info?.__rendererLabel}
          </span>
          组件
        </div>
      );
    }
  },
  enabled: {
    withComponentId: true,
    desc: (info: any) => {
      return (
        <div>
          启用
          <span className="variable-left variable-right">
            {info?.__rendererLabel}
          </span>
          组件
        </div>
      );
    }
  },
  disabled: {
    withComponentId: true,
    desc: (info: any) => {
      return (
        <div>
          禁用
          <span className="variable-left variable-right">
            {info?.__rendererLabel}
          </span>
          组件
        </div>
      );
    }
  },
  clear: {
    withComponentId: true,
    desc: (info: any) => {
      return (
        <div>
          <span className="variable-right">{info?.__rendererLabel}</span>
          清空
        </div>
      );
    }
  },
  reset: {
    withComponentId: true,
    desc: (info: any) => {
      return (
        <div>
          <span className="variable-right">{info?.__rendererLabel}</span>
          重置
        </div>
      );
    }
  },
  focus: {
    desc: (info: any) => {
      return (
        <div>
          <span className="variable-right">{info?.__rendererLabel}</span>
          获取焦点
        </div>
      );
    }
  },
  prev: {
    desc: (info: any) => {
      return (
        <div>
          <span className="variable-right">{info?.__rendererLabel}</span>
          {info?.__rendererName === 'carousel' ? '滚动至上一张' : null}
          {info?.__rendererName === 'wizard' ? '返回前一步' : null}
        </div>
      );
    }
  },
  next: {
    desc: (info: any) => {
      return (
        <div>
          <span className="variable-right">{info?.__rendererLabel}</span>
          {info?.__rendererName === 'carousel' ? '滚动至下一张' : null}
          {info?.__rendererName === 'wizard' ? '提交当前步骤数据' : null}
        </div>
      );
    }
  },
  submit: {
    withComponentId: true,
    desc: (info: any) => {
      return (
        <div>
          <span className="variable-right">{info?.__rendererLabel}</span>
          {info?.__rendererName === 'form' ? '提交' : null}
          {info?.__rendererName === 'wizard' ? '提交全部数据' : null}
        </div>
      );
    }
  },
  validate: {
    withComponentId: true,
    desc: (info: any) => {
      return (
        <div>
          <span className="variable-right">{info?.__rendererLabel}</span>
          校验
        </div>
      );
    }
  },
  collapse: {
    desc: (info: any) => {
      return (
        <div>
          <span className="variable-right">{info?.__rendererLabel}</span>
          收起
        </div>
      );
    }
  },
  selectAll: {
    desc: (info: any) => {
      return (
        <div>
          <span className="variable-right">{info?.__rendererLabel}</span>
          选中所有选项
        </div>
      );
    }
  }
};
