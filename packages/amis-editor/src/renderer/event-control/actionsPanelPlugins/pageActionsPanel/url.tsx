import React from 'react';
import {registerActionPanel} from '../../actionsPanelManager';
import {getArgsWrapper} from '../../helper';
import {defaultValue, getSchemaTpl} from 'amis-editor-core';

registerActionPanel('url', {
  label: '跳转链接',
  tag: '页面',
  description: '跳转至指定链接的页面',
  innerArgs: ['url', 'params', 'blank'],
  descDetail: (info: any, context: any, props: any) => {
    return (
      <div className="action-desc">
        跳转至
        <span className="variable-left">{info?.args?.url || '-'}</span>
      </div>
    );
  },
  schema: () => {
    const data = getArgsWrapper([
      {
        type: 'wrapper',
        body: [
          getSchemaTpl('textareaFormulaControl', {
            name: 'url',
            label: '页面地址',
            variables: '${variables}',
            mode: 'horizontal',
            // placeholder: 'http://', 长文本暂不支持
            size: 'lg',
            required: true,
            visibleOn: 'this.actionType === "url"'
          }),
          {
            type: 'combo',
            name: 'params',
            label: '页面参数',
            multiple: true,
            mode: 'horizontal',
            size: 'lg',
            formClassName: 'event-action-combo',
            itemClassName: 'event-action-combo-item',
            items: [
              {
                name: 'key',
                placeholder: '参数名',
                type: 'input-text'
              },
              getSchemaTpl('formulaControl', {
                variables: '${variables}',
                name: 'val',
                placeholder: '参数值',
                columnClassName: 'flex-1'
              })
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
    ]);
    return data;
  }
});
