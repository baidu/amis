/**
 * @file InputRangeValue
 * @description 滑块组件默认值控件
 */

import React, {useCallback} from 'react';
import {FormItem} from 'amis';

import type {FormControlProps} from 'amis-core';

export interface InputRangeValueProps extends FormControlProps {
  value?: any;
  minField?: string;
  maxField?: string;
  onChange: (value: any) => void;
}

const InputRangeValue: React.FC<InputRangeValueProps> = props => {
  const {
    classnames: cx,
    minField = 'min',
    maxField = 'max',
    data: ctx,
    name,
    onChange,
    value,
    render,
    precision
  } = props;
  const key = 'InputRangeValue';
  const joinValues = ctx?.joinValues ?? true;
  /** delimiter变化需要重新计算默认值 */
  const delimiter = ctx?.delimiter || ',';
  const extraName = ctx?.extraName;

  /** 转化成对象格式 */
  const pipeInValue = useCallback(
    (value: any) => {
      if (!value) {
        return {[minField]: undefined, [maxField]: undefined};
      }

      if (typeof value === 'string') {
        const [lhs, rhs] = value.split(delimiter);

        return {[minField]: lhs, [maxField]: rhs};
      } else if (Array.isArray(value)) {
        return {[minField]: value[0], [maxField]: value[1]};
      } else {
        return value;
      }
    },
    [minField, maxField, delimiter, value, joinValues, extraName]
  );

  const handleSubmit = useCallback(
    (value: Record<string, any>, action: any) => {
      let updatedValue: any = value;

      if (value[minField] == null || value[maxField] == null) {
        return;
      }

      if (extraName) {
        updatedValue = [value[minField], value[maxField]];
      } else {
        if (joinValues) {
          updatedValue = [value[minField], value[maxField]].join(
            delimiter || ','
          );
        } else {
          updatedValue = {
            [minField]: value[minField],
            [maxField]: value[maxField]
          };
        }
      }

      onChange?.(updatedValue);
    },
    [key, minField, maxField, delimiter, joinValues, extraName, value]
  );

  return (
    <>
      {render(
        'input-range-value-control',
        {
          type: 'form',
          wrapWithPanel: false,
          panelClassName: 'border-none shadow-none mb-0',
          bodyClassName: 'p-none',
          actionsClassName: 'border-none mt-2.5',
          wrapperComponent: 'div',
          formLazyChange: true,
          preventEnterSubmit: true,
          submitOnChange: true,
          body: [
            {
              label: false,
              type: 'input-group',
              name: key,
              className: cx('ae-InputRangeValue-input-group'),
              body: [
                {
                  type: 'input-number',
                  validations: 'isNumeric',
                  name: minField,
                  precision,
                  value: 0
                },
                {
                  type: 'html',
                  html: '-',
                  className: cx('ae-InputRangeValue-input-group-delimiter')
                },
                {
                  type: 'input-number',
                  validations: 'isNumeric',
                  name: maxField,
                  precision,
                  value: 100
                }
              ]
            }
          ]
        },
        {
          data: name ? pipeInValue(ctx[name]) : {},
          onSubmit: handleSubmit
        }
      )}
    </>
  );
};

InputRangeValue.defaultProps = {
  minField: 'min',
  maxField: 'max'
};

@FormItem({type: 'ae-input-range-value'})
export default class InputRangeValueRenderer extends React.Component<FormControlProps> {
  render() {
    return <InputRangeValue {...this.props} />;
  }
}
