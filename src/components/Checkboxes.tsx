/**
 * @file Checkboxes
 * @description 多选输入框
 * @author fex
 */

import React from 'react';
import uncontrollable = require('uncontrollable');
import Checkbox from './Checkbox';
import find = require('lodash/find');
import chunk = require('lodash/chunk');
import {flattenTree, isObject} from '../utils/helper';
import {Option} from './Checkboxes';
import {ClassNamesFn, themeable} from '../theme';
// import isPlainObject = require('lodash/isPlainObject');

export interface Option {
  label?: string;
  value?: any;
  disabled?: boolean;
  children?: Options;
  description?: string;
  [propName: string]: any;
}
export interface Options extends Array<Option> {}

export interface OptionProps {
  multi?: boolean;
  multiple?: boolean;
  valueField?: string;
  options?: Options;
  joinValues: boolean;
  extractValue: boolean;
  delimiter: string;
  clearable: boolean;
  placeholder?: string;
}

export type OptionValue = string | number | null | undefined | Option;

export function value2array(
  value: OptionValue | Array<OptionValue>,
  props: Partial<OptionProps>
): Array<Option> {
  if (props.multi || props.multiple) {
    if (typeof value === 'string') {
      value = value.split(props.delimiter || ',');
    }

    if (!Array.isArray(value)) {
      if (value === null || value === undefined) {
        return [];
      }

      value = [value];
    }

    return (value as Array<OptionValue>)
      .map((value: OptionValue) =>
        expandValue(
          !props.joinValues &&
            value &&
            value.hasOwnProperty(props.valueField || 'value')
            ? (value as any)[props.valueField || 'value']
            : value,
          props
        )
      )
      .filter((item: Option) => item) as Array<Option>;
  }

  let expandedValue = expandValue(value as OptionValue, props);
  return expandedValue ? [expandedValue] : [];
}

export function expandValue(
  value: OptionValue,
  props: Partial<OptionProps>
): Option | null {
  const valueType = typeof value;

  if (
    valueType !== 'string' &&
    valueType !== 'number' &&
    valueType !== 'boolean' &&
    valueType !== 'object'
  ) {
    return null;
  }

  let {options, valueField} = props;

  if (!options) {
    return null;
  }

  if (
    valueType === 'object' &&
    value &&
    value.hasOwnProperty(props.valueField || 'value')
  ) {
    value = (value as Option)[valueField || 'value'] || '';
  }

  return find(flattenTree(options), item =>
    isObject(value)
      ? item[valueField || 'value'] === value
      : String(item[valueField || 'value']) === String(value)
  ) as Option;
}

/**
 * 参数说明：
 *
 * options: [
 *   {
 *      label: '显示的名字',
 *      value: '值',
 *      disabled: false
 *   }
 * ]
 */
interface CheckboxesProps extends OptionProps {
  id?: string;
  key?: string;
  className?: string;
  type: string;
  placeholder?: string;
  disabled?: boolean;
  value?: string;
  onChange?: Function;
  inline?: boolean;
  columnsCount?: number;
  checked?: boolean;
  labelClassName?: string;
  classPrefix: string;
  classnames: ClassNamesFn;
}

export class Checkboxes extends React.PureComponent<CheckboxesProps, any> {
  static defaultProps = {
    joinValues: true,
    extractValue: false,
    inline: false,
    delimiter: ',',
    columnsCount: 1 // 一行显示一个
  };

  toggleOption(option: Option) {
    const {
      value,
      onChange,
      joinValues,
      extractValue,
      delimiter,
      valueField,
      options
    } = this.props;

    let valueArray = value2array(value, {
      multiple: true,
      valueField,
      delimiter,
      options
    });
    let idx = valueArray.indexOf(option);

    if (!~idx) {
      option =
        value2array(option[valueField || 'value'], {
          multiple: true,
          valueField,
          delimiter,
          options
        })[0] || option;
      idx = valueArray.indexOf(option);
    }

    if (~idx) {
      valueArray.splice(idx, 1);
    } else {
      valueArray.push(option);
    }

    let newValue: string | Array<Option> = valueArray;

    if (joinValues) {
      newValue = newValue
        .map(item => item[valueField || 'value'])
        .join(delimiter);
    } else if (extractValue) {
      newValue = newValue.map(item => item[valueField || 'value']);
    }

    onChange && onChange(newValue);
  }

  render() {
    const {
      value,
      valueField,
      delimiter,
      options,
      className,
      placeholder,
      columnsCount,
      disabled,
      inline,
      labelClassName
    } = this.props;

    let valueArray = value2array(value, {
      multiple: true,
      valueField,
      delimiter,
      options
    });
    let body: Array<React.ReactNode> = [];

    if (options) {
      body = options.map((option, key) => (
        <Checkbox
          key={key}
          onChange={() => this.toggleOption(option)}
          checked={!!~valueArray.indexOf(option)}
          disabled={disabled || option.disabled}
          inline={inline}
          labelClassName={labelClassName}
        >
          {option.label}
        </Checkbox>
      ));
    }

    if (!inline && (columnsCount as number) > 1) {
      let cellClassName = `col-sm-${(12 / (columnsCount as number))
        .toFixed(1)
        .replace(/\.0$/, '')
        .replace(/\./, '-')}`;
      body = chunk(body, columnsCount).map((group, groupIndex) => (
        <div className="row" key={groupIndex}>
          {group.map((item, index) => (
            <div key={index} className={cellClassName}>
              {item}
            </div>
          ))}
        </div>
      ));
    }

    return (
      <div className={className}>
        {body && body.length ? body : placeholder}
      </div>
    );
  }
}

export default themeable(
  uncontrollable(Checkboxes, {
    value: 'onChange'
  })
);
