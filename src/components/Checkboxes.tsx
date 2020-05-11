/**
 * @file Checkboxes
 * @description 多选输入框
 * @author fex
 */

import React from 'react';
import uncontrollable from 'uncontrollable';
import Checkbox from './Checkbox';
import chunk from 'lodash/chunk';
import {ClassNamesFn, themeable} from '../theme';
import {Option, OptionProps, value2array} from './Select';
// import isPlainObject from 'lodash/isPlainObject';

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
      delimiter,
      valueField,
      options,
      simpleValue
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

    let newValue: string | Array<Option> = simpleValue
      ? valueArray.map(item => item[valueField || 'value'])
      : valueArray;

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
          description={option.description}
        >
          {option.label}
        </Checkbox>
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
