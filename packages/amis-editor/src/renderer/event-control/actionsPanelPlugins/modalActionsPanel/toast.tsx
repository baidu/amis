import React from 'react';
import {getSchemaTpl} from 'amis-editor-core';
import {registerActionPanel} from '../../actionsPanelManager';
import {getArgsWrapper} from '../../helper';

const MSG_TYPES: {[key: string]: string} = {
  info: '提示',
  warning: '警告',
  success: '成功',
  error: '错误'
};

registerActionPanel('toast', {
  label: '消息提醒',
  tag: '弹窗消息',
  description: '弹出消息提醒',
  innerArgs: [
    'title',
    'msgType',
    'msg',
    'position',
    'timeout',
    'closeButton',
    'showIcon',
    'className'
  ],
  descDetail: (info: any, context: any, props: any) => {
    return (
      <div className="action-desc">
        {MSG_TYPES[info?.args?.msgType] || ''}
        <span className="variable-left">{info?.args?.msg || '-'}</span>
      </div>
    );
  },
  schema: getArgsWrapper({
    type: 'wrapper',
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
      getSchemaTpl('textareaFormulaControl', {
        name: 'msg',
        label: '消息内容',
        mode: 'horizontal',
        variables: '${variables}',
        size: 'lg',
        required: true
      }),
      getSchemaTpl('textareaFormulaControl', {
        name: 'title',
        label: '标题内容',
        variables: '${variables}',
        mode: 'horizontal',
        size: 'lg'
      }),
      getSchemaTpl('formulaControl', {
        name: 'timeout',
        label: '持续时间(ms)',
        rendererSchema: {
          type: 'input-number'
        },
        valueType: 'number',
        variables: '${variables}',
        size: 'lg',
        mode: 'horizontal'
      }),
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
});
