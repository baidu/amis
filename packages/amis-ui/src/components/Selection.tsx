/**
 * @file Checkboxes
 * @description 多选输入框
 * @author fex
 */

import React from 'react';
import isEqual from 'lodash/isEqual';
import cx from 'classnames';
import {
  uncontrollable,
  LocaleProps,
  localeable,
  themeable,
  ThemeProps,
  autobind,
  findTree,
  flattenTree,
  getOptionValue,
  getOptionValueBindField,
  ClassNamesFn
} from 'amis-core';
import Checkbox from './Checkbox';
import {Option, Options} from './Select';

export interface BaseSelectionProps extends ThemeProps, LocaleProps {
  options: Options;
  className?: string;
  placeholder?: string;
  value?: any | Array<any>;
  multiple?: boolean;
  clearable?: boolean;
  labelField?: string;
  valueField?: string;
  onChange?: (value: Array<any> | any) => void;
  onDeferLoad?: (option: Option) => void;
  onLeftDeferLoad?: (option: Option, leftOptions: Option) => void;
  inline?: boolean;
  labelClassName?: string;
  option2value?: (option: Option) => any;
  itemClassName?: string;
  itemHeight?: number; // 每个选项的高度，主要用于虚拟渲染
  virtualThreshold?: number; // 数据量多大的时候开启虚拟渲染
  virtualListHeight?: number; // 虚拟渲染时，列表高度
  itemRender: (option: Option, states: ItemRenderStates) => JSX.Element;
  disabled?: boolean;
  onClick?: (e: React.MouseEvent) => void;
  placeholderRender?: (props: any) => JSX.Element | null;
  checkAll?: boolean;
  checkAllLabel?: string;
}

export interface ItemRenderStates {
  index: number;
  labelField?: string;
  multiple?: boolean;
  checked: boolean;
  onChange: () => void;
  disabled?: boolean;
  classnames: ClassNamesFn;
}

export class BaseSelection<
  T extends BaseSelectionProps = BaseSelectionProps,
  S = any
> extends React.Component<T, S> {
  static itemRender(option: Option, states: ItemRenderStates) {
    const label = option[states?.labelField || 'label'];
    const tip = option.tip || '';
    const classnames = states.classnames;

    const canlabelTitle =
      typeof label === 'string' || typeof label === 'number';
    const canTipTitle = typeof tip === 'string' || typeof label === 'number';
    const title = canlabelTitle && canTipTitle ? `${label} ${tip}` : '';

    return (
      <span
        title={title}
        className={`${cx({'is-invalid': option?.__unmatched})} ${classnames(
          'Selection-ellipsis-line'
        )}`}
      >
        {label}
        {tip}
      </span>
    );
  }

  static defaultProps = {
    placeholder: 'placeholder.noOption',
    itemRender: this.itemRender,
    multiple: true,
    clearable: false,
    virtualThreshold: 1000,
    itemHeight: 32
  };

  static value2array(
    value: any,
    options: Options,
    option2value: (option: Option) => any = (option: Option) => option,
    valueField?: string
  ): Options {
    if (value === void 0) {
      return [];
    }

    if (!Array.isArray(value)) {
      value = [value];
    }

    return value.map((value: any) => {
      const option = findTree(
        options,
        option => isEqual(option2value(option), value),
        valueField
          ? {
              value: getOptionValue(value, valueField),
              resolve: getOptionValueBindField(valueField)
            }
          : undefined
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
      clearable,
      valueField
    } = this.props;

    if (disabled || option.disabled) {
      return;
    }

    let valueArray = BaseSelection.value2array(
      value,
      options,
      option2value,
      valueField
    );
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

  getAvailableOptions() {
    const {options} = this.props;
    const flattendOptions = flattenTree(options, item =>
      item.children ? null : item
    ).filter(a => a && !a.disabled);

    return flattendOptions as Option[];
  }

  @autobind
  toggleAll() {
    const {value, onChange, option2value, options} = this.props;

    let valueArray: Array<Option> = [];

    const availableOptions = this.getAvailableOptions();
    const intersectOptions = this.intersectArray(value, availableOptions);

    if (!Array.isArray(value)) {
      valueArray = availableOptions;
    } else if (intersectOptions.length < availableOptions.length) {
      valueArray = Array.from(new Set([...value, ...availableOptions]));
    } else {
      valueArray = value.filter(
        (item: Option) => !availableOptions.includes(item)
      );
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
      labelField,
      valueField,
      onClick
    } = this.props;

    const __ = this.props.translate;

    let valueArray = BaseSelection.value2array(
      value,
      options,
      option2value,
      valueField
    );
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
            labelField,
            classnames: cx,
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
