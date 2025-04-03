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
import {uncontrollable} from 'amis-core';
import Checkbox from './Checkbox';
import Button from './Button';
import {value2array, OptionProps, Option} from './Select';
import chunk from 'lodash/chunk';
import {ClassNamesFn, themeable} from 'amis-core';
import {columnsSplit} from 'amis-core';
import {TestIdBuilder} from 'amis-core';

interface RadioProps extends OptionProps {
  id?: string;
  type: string;
  optionType?: 'default' | 'button';
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
  renderLabel?: (item: Option, props: RadioProps) => JSX.Element;
  testIdBuilder?: TestIdBuilder;
}

const defaultLabelRender = (item: Option, props: RadioProps) => (
  <>{`${item[props.labelField || 'label']}`}</>
);
export class Radios extends React.Component<RadioProps, any> {
  static defaultProps = {
    type: 'radio',
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
    const {
      classnames: cx,
      optionType,
      classPrefix: ns,
      renderLabel = defaultLabelRender
    } = this.props;

    return (
      <div key={index} className={cx('RadiosControl-group', option.className)}>
        <label
          className={cx('RadiosControl-groupLabel', option.labelClassName)}
        >
          {renderLabel(option, this.props)}
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
    if (option.children?.length) {
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
      classPrefix: ns,
      testIdBuilder,
      renderLabel = defaultLabelRender
    } = this.props;
    const itemTestIdBuilder = testIdBuilder?.getChild(option.value || index);

    // if (optionType === 'button') {
    //   const active = !!~valueArray.indexOf(option);
    //   return (
    //     <Button
    //       key={index}
    //       active={active}
    //       onClick={() => this.toggleOption(option)}
    //       className={cx(itemClassName, option.className)}
    //       disabled={disabled || option.disabled}
    //       level={(active ? btnActiveLevel : '') || level}
    //     >
    //       <span>{renderLabel(option, this.props)}</span>
    //     </Button>
    //   );
    // }

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
        testIdBuilder={itemTestIdBuilder}
        optionType={optionType}
      >
        {renderLabel(option, this.props)}
      </Checkbox>
    );
  }

  render() {
    const {
      value,
      options,
      className,
      style,
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
      <div className={className} style={style}>
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
