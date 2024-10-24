import React from 'react';
import {registerActionPanel} from '../../actionsPanelManager';
import {renderCmptSelect, renderCmptIdInput} from './helper';

registerActionPanel('validateFormItem', {
  label: '校验表单项',
  tag: '组件',
  description: '校验单个表单项数据',
  descDetail: (info: any) => {
    return (
      <div>
        校验
        <span className="variable-left variable-right">
          {info?.rendererLabel || info.componentId || '-'}
        </span>
        的数据
      </div>
    );
  },
  supportComponents: ['isFormItem'],
  schema: () => [
    ...renderCmptSelect('目标组件', true),
    renderCmptIdInput(),
    {
      name: 'outputVar',
      type: 'input-text',
      label: '校验结果',
      placeholder: '请输入存储校验结果的变量名称',
      description:
        '如需执行多次表单校验，可以修改此变量名用于区分不同的校验结果',
      mode: 'horizontal',
      size: 'lg',
      value: 'validateFormItemResult',
      required: true
    }
  ],
  outputVarDataSchema: [
    {
      type: 'object',
      title: 'validateFormItemResult',
      properties: {
        error: {
          type: 'string',
          title: '错误信息'
        },
        value: {
          type: 'object',
          title: '校验的表单项的值'
        }
      }
    }
  ]
});
