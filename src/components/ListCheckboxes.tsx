import {BaseCheckboxes} from './Checkboxes';
import {themeable} from '../theme';
import React from 'react';
import {uncontrollable} from 'uncontrollable';
import Checkbox from './Checkbox';
import {Option} from './Select';
import {localeable} from '../locale';

export class ListCheckboxes extends BaseCheckboxes {
  valueArray: Array<Option>;

  renderOption(option: Option, index: number) {
    const {
      labelClassName,
      disabled,
      classnames: cx,
      itemClassName,
      itemRender
    } = this.props;
    const valueArray = this.valueArray;

    if (Array.isArray(option.children)) {
      return (
        <div
          key={index}
          className={cx('ListCheckboxes-group', option.className)}
        >
          <div className={cx('ListCheckboxes-itemLabel')}>
            {itemRender(option)}
          </div>

          <div className={cx('ListCheckboxes-items', option.className)}>
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
          'ListCheckboxes-item',
          itemClassName,
          option.className,
          disabled || option.disabled ? 'is-disabled' : ''
        )}
        onClick={() => this.toggleOption(option)}
      >
        <div className={cx('ListCheckboxes-itemLabel')}>
          {itemRender(option)}
        </div>

        <Checkbox
          size="sm"
          checked={!!~valueArray.indexOf(option)}
          disabled={disabled || option.disabled}
          labelClassName={labelClassName}
          description={option.description}
        />
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
      option2value
    } = this.props;
    const __ = this.props.translate;

    this.valueArray = BaseCheckboxes.value2array(value, options, option2value);
    let body: Array<React.ReactNode> = [];

    if (Array.isArray(options) && options.length) {
      body = options.map((option, key) => this.renderOption(option, key));
    }

    return (
      <div className={cx('ListCheckboxes', className)}>
        {body && body.length ? (
          body
        ) : (
          <div className={cx('ListCheckboxes-placeholder')}>
            {__(placeholder)}
          </div>
        )}
      </div>
    );
  }
}

export default themeable(
  localeable(
    uncontrollable(ListCheckboxes, {
      value: 'onChange'
    })
  )
);
