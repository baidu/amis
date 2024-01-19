/**
 * 值格式录入控件
 * - 布尔
 * - 数字
 * - 文本
 */

import React from 'react';
import {FormItem} from 'amis';
import type {FormControlProps} from 'amis';

export interface valueFormatControlProps extends FormControlProps {
  supportNumberType: boolean; // 是否支持数字类型，默认支持
  supportBoolType: boolean; // 是否支持布尔类型，默认支持

  placeholder?: string; // 占位符
}

export type valueType = 'text' | 'boolean' | 'number';

/**
 * 获取当前选项值的类型
 */
const getOptionValueType = (
  value: any,
  supportTypes: valueFormatControlProps
): valueType => {
  if (typeof value === 'boolean' && supportTypes.supportBoolType !== false) {
    return 'boolean';
  }
  if (typeof value === 'number' && supportTypes.supportNumberType !== false) {
    return 'number';
  }
  return 'text';
};

/**
 * 将当前选项值转换为选择的类型
 */
const normalizeOptionValue = (value: any, valueType: valueType): any => {
  if (valueType === 'number') {
    const convertTo = Number(value);
    if (isNaN(convertTo)) {
      return 0;
    }
    return convertTo;
  }
  if (valueType === 'boolean') {
    return !value || value === 'false' ? false : true;
  }
  return String(value);
};

const ValueFormatControl: React.FC<valueFormatControlProps> = props => {
  const {render, value, onChange, placeholder} = props;

  return render('body', {
    type: 'form',
    wrapWithPanel: false,
    data: {vType: getOptionValueType(value, props), vValue: value},
    onChange: (data: {vType: valueType; vValue: string}) =>
      onChange(normalizeOptionValue(data.vValue, data.vType)),
    body: [
      {
        type: 'input-group',
        name: 'input-group',
        label: false,
        mode: 'horizontal',
        body: [
          {
            type: 'select',
            name: 'vType',
            options: [
              {
                label: '文本',
                value: 'text'
              },
              {
                label: '数字',
                value: 'number',
                hidden: props.supportNumberType === false
              },
              {
                label: '布尔',
                value: 'boolean',
                hidden: props.supportBoolType === false
              }
            ].filter(item => item.hidden !== true),
            checkAll: false,
            // pipeIn: (v: valueType) => (v ? v : getOptionValueType(v, props)),
            onChange: (value: any, oldValue: any, model: any, form: any) => {
              const {vValue} = form?.data || {};
              form.setValues({vValue: normalizeOptionValue(vValue, value)});
            }
          },
          {
            type: 'input-text',
            placeholder,
            name: 'vValue',
            value,
            visibleOn: "this.vType !== 'boolean'"
          },
          {
            type: 'input-text',
            placeholder,
            name: 'vValue',
            value,
            visibleOn: "this.vType === 'boolean'",
            options: [
              {label: 'true', value: true},
              {label: 'false', value: false}
            ]
          }
        ]
      }
    ]
  });
};

export default FormItem({
  type: 'ae-valueFormat'
})(ValueFormatControl);
