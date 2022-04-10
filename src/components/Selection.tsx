/**
 * @file Checkboxes
 * @description 多选输入框
 * @author fex
 */

import React from 'react';
import {uncontrollable} from 'uncontrollable';
import Checkbox from './Checkbox';
import chunk from 'lodash/chunk';
import {ClassNamesFn, themeable, ThemeProps} from '../theme';
import {Option, value2array, Options} from './Select';
import find from 'lodash/find';
import {autobind, findTree} from '../utils/helper';
import isEqual from 'lodash/isEqual';
import {LocaleProps, localeable} from '../locale';
// import isPlainObject from 'lodash/isPlainObject';

export interface BaseSelectionProps extends ThemeProps, LocaleProps {
  options: Options;
  className?: string;
  placeholder?: string;
  value?: any | Array<any>;
  multiple?: boolean;
  clearable?: boolean;
  onChange?: (value: Array<any> | any) => void;
  onDeferLoad?: (option: Option) => void;
  onLeftDeferLoad?: (option: Option, leftOptions: Option) => void;
  inline?: boolean;
  labelClassName?: string;
  option2value?: (option: Option) => any;
  itemClassName?: string;
  itemRender: (option: Option, states: ItemRenderStates) => JSX.Element;
  disabled?: boolean;
  onClick?: (e: React.MouseEvent) => void;
}

export interface ItemRenderStates {
  index: number;
  multiple?: boolean;
  checked: boolean;
  onChange: () => void;
  disabled?: boolean;
}

export class BaseSelection<
  T extends BaseSelectionProps = BaseSelectionProps,
  S = any
> extends React.Component<T, S> {
  static itemRender(option: Option, states: ItemRenderStates) {
    return <span>{option.label}</span>;
  }

  static defaultProps = {
    placeholder: 'placeholder.noOption',
    itemRender: BaseSelection.itemRender,
    multiple: true,
    clearable: false
  };

  static value2array(
    value: any,
    options: Options,
    option2value: (option: Option) => any = (option: Option) => option
  ): Options {
    if (value === void 0) {
      return [];
    }

    if (!Array.isArray(value)) {
      value = [value];
    }

    return value.map((value: any) => {
      const option = findTree(options, option =>
        isEqual(option2value(option), value)
      );
      return option || value;
    });
  }

  static resolveSelected(
    value: any,
    options: Options,
    option2value: (option: Option) => any = (option: Option) => option
  ) {
    value = Array.isArray(value) ? value[0] : value;
    return findTree(options, option => isEqual(option2value(option), value));
  }

  // 获取两个数组的交集
  intersectArray(
    arr1: undefined | Array<Option>,
    arr2: undefined | Array<Option>
  ): Array<Option> {
    if (!Array.isArray(arr1) || !Array.isArray(arr2)) {
      return [];
    }
    const len1 = arr1.length;
    const len2 = arr2.length;
    if (len1 < len2) {
      return this.intersectArray(arr2, arr1);
    }
    return Array.from(new Set(arr1.filter(item => arr2.includes(item))));
  }

  toggleOption(option: Option) {
    const {
      value,
      onChange,
      option2value,
      options,
      disabled,
      multiple,
      clearable
    } = this.props;

    if (disabled || option.disabled) {
      return;
    }

    let valueArray = BaseSelection.value2array(value, options, option2value);
    let idx = valueArray.indexOf(option);

    if (~idx && (multiple || clearable)) {
      valueArray.splice(idx, 1);
    } else if (multiple) {
      valueArray.push(option);
    } else {
      valueArray = [option];
    }

    let newValue: string | Array<Option> = option2value
      ? valueArray.map(item => option2value(item))
      : valueArray;

    onChange && onChange(multiple ? newValue : newValue[0]);
  }

  @autobind
  toggleAll() {
    const {value, onChange, option2value, options} = this.props;

    let valueArray: Array<Option> = [];

    const availableOptions = options.filter(option => !option.disabled);
    const intersectOptions = this.intersectArray(value, availableOptions);

    if (!Array.isArray(value)) {
      valueArray = availableOptions;
    } else if (intersectOptions.length < availableOptions.length) {
      valueArray = Array.from(new Set([...value, ...availableOptions]));
    } else {
      valueArray = value.filter(item => !availableOptions.includes(item));
    }

    let newValue: string | Array<Option> = option2value
      ? valueArray.map(item => option2value(item))
      : valueArray;

    onChange && onChange(newValue);
  }

  render() {
    const {
      value,
      options,
      className,
      placeholder,
      inline,
      labelClassName,
      disabled,
      classnames: cx,
      option2value,
      itemClassName,
      itemRender,
      multiple,
      onClick
    } = this.props;

    const __ = this.props.translate;

    let valueArray = BaseSelection.value2array(value, options, option2value);
    let body: Array<React.ReactNode> = [];

    if (Array.isArray(options) && options.length) {
      body = options.map((option, key) => (
        <Checkbox
          type={multiple ? 'checkbox' : 'radio'}
          className={cx(itemClassName, option.className)}
          key={key}
          onChange={() => this.toggleOption(option)}
          checked={!!~valueArray.indexOf(option)}
          disabled={disabled || option.disabled}
          labelClassName={labelClassName}
          description={option.description}
        >
          {itemRender(option, {
            index: key,
            multiple: multiple,
            checked: !!~valueArray.indexOf(option),
            onChange: () => this.toggleOption(option),
            disabled: disabled || option.disabled
          })}
        </Checkbox>
      ));
    }

    return (
      <div
        className={cx(
          'Selection',
          className,
          inline ? 'Selection--inline' : ''
        )}
        onClick={onClick}
      >
        {body && body.length ? body : <div>{__(placeholder)}</div>}
      </div>
    );
  }
}

export class Selection extends BaseSelection {}

export default themeable(
  localeable(
    uncontrollable(Selection, {
      value: 'onChange'
    })
  )
);
