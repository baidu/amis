import React from 'react';
import {registerActionPanel} from '../../actionsPanelManager';
import {getArgsWrapper} from '../../helper';
import {getSchemaTpl} from 'amis-editor-core';

registerActionPanel('copy', {
  label: '复制内容',
  tag: '其他',
  description: '复制文本内容至粘贴板',
  innerArgs: ['content', 'copyFormat'],
  descDetail: (info: any, context: any, props: any) => {
    return (
      <div className="action-desc">
        复制内容：
        <span className="variable-left">{info?.args?.content || '-'}</span>
      </div>
    );
  },
  schema: () =>
    getArgsWrapper({
      type: 'wrapper',
      body: [
        getSchemaTpl('textareaFormulaControl', {
          name: 'content',
          label: '内容模板',
          variables: '${variables}',
          mode: 'horizontal',
          size: 'lg',
          visibleOn: 'this.actionType === "copy"',
          required: true
        }),
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
});
