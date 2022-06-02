import React from 'react';
import {uncontrollable} from 'amis-core';

import {BaseSelection, BaseSelectionProps} from './Selection';
import {themeable} from 'amis-core';
import Checkbox from './Checkbox';
import {Option} from './Select';
import {localeable} from 'amis-core';

export class GroupedSelection extends BaseSelection<BaseSelectionProps> {
  valueArray: Array<Option>;

  renderOption(option: Option, index: number) {
    const {
      labelClassName,
      disabled,
      classnames: cx,
      itemClassName,
      itemRender,
      multiple
    } = this.props;

    const valueArray = this.valueArray;

    if (Array.isArray(option.children)) {
      return (
        <div
          key={index}
          className={cx('GroupedSelection-group', option.className)}
        >
          <div className={cx('GroupedSelection-itemLabel')}>
            {itemRender(option, {
              index: index,
              multiple: multiple,
              checked: false,
              onChange: () => undefined,
              disabled: disabled || option.disabled
            })}
          </div>

          <div className={cx('GroupedSelection-items', option.className)}>
            {option.children.map((child, index) =>
              this.renderOption(child, index)
            )}
          </div>
        </div>
      );
    }

    return (
      <div
        key={index}
        className={cx(
          'GroupedSelection-item',
          itemClassName,
          option.className,
          disabled || option.disabled ? 'is-disabled' : '',
          !!~valueArray.indexOf(option) ? 'is-active' : ''
        )}
        onClick={() => this.toggleOption(option)}
      >
        {multiple ? (
          <Checkbox
            size="sm"
            checked={!!~valueArray.indexOf(option)}
            disabled={disabled || option.disabled}
            labelClassName={labelClassName}
            description={option.description}
          />
        ) : null}
        <div className={cx('GroupedSelection-itemLabel')}>
          {itemRender(option, {
            index: index,
            multiple: multiple,
            checked: !!~valueArray.indexOf(option),
            onChange: () => this.toggleOption(option),
            disabled: disabled || option.disabled
          })}
        </div>
      </div>
    );
  }

  render() {
    const {
      value,
      options,
      className,
      placeholder,
      classnames: cx,
      option2value,
      onClick,
      placeholderRender
    } = this.props;
    const __ = this.props.translate;

    this.valueArray = BaseSelection.value2array(value, options, option2value);
    let body: Array<React.ReactNode> = [];

    if (Array.isArray(options) && options.length) {
      body = options.map((option, key) => this.renderOption(option, key));
    }

    return (
      <div className={cx('GroupedSelection', className)} onClick={onClick}>
        {body && body.length ? (
          body
        ) : (
          <div className={cx('GroupedSelection-placeholder')}>
            {placeholderRender?.(this.props) ?? __(placeholder)}
          </div>
        )}
      </div>
    );
  }
}

export default themeable(
  localeable(
    uncontrollable(GroupedSelection, {
      value: 'onChange'
    })
  )
);
