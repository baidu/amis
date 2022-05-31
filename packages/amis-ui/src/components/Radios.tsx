/**
 * @file Radios
 * @description
 * @author fex
 *
 * @param 参数说明：
 * options: [
 *   {
 *      label: '显示的名字',
 *      value: '值',
 *      disabled: false
 *   }
 * ]
 *
 */

import React from 'react';
import {uncontrollable} from 'uncontrollable';
import Checkbox from './Checkbox';
import Button from './Button';
import {value2array, OptionProps, Option} from './Select';
import chunk from 'lodash/chunk';
import {ClassNamesFn, themeable} from 'amis-core';
import {columnsSplit} from 'amis-core';

interface RadioProps extends OptionProps {
  id?: string;
  type: string;
  optionType?: string;
  value?: string;
  className?: string;
  style?: React.CSSProperties;
  inline?: boolean;
  level?: string; // 'link' | 'primary' | 'secondary' | 'info' | 'success' | 'warning' | 'danger' | 'light' | 'dark' | 'default';
  btnActiveLevel?: string;
  disabled?: boolean;
  onChange?: Function;
  columnsCount: number | number[];
  itemClassName?: string;
  labelField?: string;
  labelClassName?: string;
  classPrefix: string;
  classnames: ClassNamesFn;
}

export class Radios extends React.Component<RadioProps, any> {
  static defaultProps = {
    type: 'radio',
    optionType: 'default',
    btnActiveLevel: 'primary',
    resetValue: '',
    inline: true,
    joinValues: true,
    clearable: false,
    columnsCount: 1 // 一行显示一个
  };

  toggleOption(option: Option) {
    const {value, onChange, valueField, clearable, delimiter, options} =
      this.props;

    let valueArray = value2array(value, {
      multiple: false,
      delimiter,
      valueField,
      options
    });
    const idx = valueArray.indexOf(option);

    if (~idx) {
      clearable && valueArray.splice(idx, 1);
    } else {
      valueArray = [option];
    }

    let newValue = valueArray[0];

    onChange && onChange(newValue);
  }

  renderGroup(option: Option, index: number, valueArray: Array<Option>) {
    const {classnames: cx, optionType, classPrefix: ns} = this.props;

    return (
      <div key={index} className={cx('RadiosControl-group', option.className)}>
        <label
          className={cx('RadiosControl-groupLabel', option.labelClassName)}
        >
          {option.label}
        </label>

        {option.children && option.children.length
          ? option.children.map((option, index) =>
              this.renderItem(option, index, valueArray)
            )
          : null}
      </div>
    );
  }

  renderItem(option: Option, index: number, valueArray: Array<Option>) {
    if (option.children) {
      return this.renderGroup(option, index, valueArray);
    }

    const {
      disabled,
      inline,
      itemClassName,
      classnames: cx,
      labelClassName,
      labelField,
      optionType,
      level,
      btnActiveLevel,
      classPrefix: ns
    } = this.props;

    if (optionType === 'button') {
      const active = !!~valueArray.indexOf(option);
      return (
        <Button
          key={index}
          active={active}
          onClick={() => this.toggleOption(option)}
          className={cx(itemClassName, option.className)}
          disabled={disabled || option.disabled}
          level={(active ? btnActiveLevel : '') || level}
        >
          <span>{`${option[labelField || 'label']}`}</span>
        </Button>
      );
    }

    return (
      <Checkbox
        type="radio"
        key={index}
        onChange={() => this.toggleOption(option)}
        checked={!!~valueArray.indexOf(option)}
        className={cx(itemClassName, option.className)}
        disabled={disabled || option.disabled}
        description={option.description}
        inline={inline}
        labelClassName={labelClassName}
      >
        {`${option[labelField || 'label']}`}
      </Checkbox>
    );
  }

  render() {
    const {
      value,
      options,
      className,
      classnames: cx,
      placeholder,
      columnsCount,
      joinValues,
      extractValue,
      disabled,
      inline,
      delimiter,
      valueField
    } = this.props;

    let valueArray = value2array(value, {
      multiple: false,
      delimiter,
      valueField,
      options
    });
    let body: Array<React.ReactNode> = [];

    if (options) {
      body = options.map((option, key) =>
        this.renderItem(option, key, valueArray)
      );
    }

    if (!inline) {
      body = columnsSplit(body, cx, columnsCount);
    }

    return (
      <div className={className}>
        {body && body.length ? body : placeholder}
      </div>
    );
  }
}

export default themeable(
  uncontrollable(Radios, {
    value: 'onChange'
  })
);
