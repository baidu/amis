import React from 'react';
import {registerActionPanel} from '../../actionsPanelManager';
import {renderCmptSelect, renderCmptIdInput} from './helper';
import {buildLinkActionDesc} from '../../helper';

registerActionPanel('submit', {
  label: '提交表单',
  tag: '组件',
  description: '触发表单提交',
  descDetail: (info: any, context: any, props: any) => {
    return (
      <div className="action-desc">
        提交
        {buildLinkActionDesc(props.manager, info)}
        的数据
      </div>
    );
  },
  supportComponents: 'form',
  schema: () => [
    ...renderCmptSelect('目标组件', true),
    renderCmptIdInput(),
    {
      name: 'outputVar',
      type: 'input-text',
      label: '提交结果',
      placeholder: '请输入存储提交结果的变量名称',
      description:
        '如需执行多次表单提交，可以修改此变量名用于区分不同的提交结果',
      mode: 'horizontal',
      size: 'lg',
      value: 'submitResult',
      required: true
    }
  ],
  outputVarDataSchema: [
    {
      type: 'object',
      title: 'submitResult',
      properties: {
        error: {
          type: 'string',
          title: '错误信息'
        },
        errors: {
          type: 'object',
          title: '错误详情'
        },
        payload: {
          type: 'object',
          title: '提交的表单数据'
        },
        responseData: {
          type: 'object',
          title: '提交请求的响应数据'
        }
      }
    }
  ]
});
