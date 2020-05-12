import {Checkboxes} from './Checkboxes';
import {themeable} from '../theme';
import React from 'react';
import uncontrollable from 'uncontrollable';
import Checkbox from './Checkbox';

export class ListCheckboxes extends Checkboxes {
  render() {
    const {
      value,
      options,
      className,
      placeholder,
      labelClassName,
      disabled,
      classnames: cx,
      option2value,
      itemClassName,
      itemRender
    } = this.props;

    let valueArray = Checkboxes.value2array(value, options, option2value);
    let body: Array<React.ReactNode> = [];

    if (Array.isArray(options) && options.length) {
      body = options.map((option, key) => (
        <div
          key={key}
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
            checked={!!~valueArray.indexOf(option)}
            disabled={disabled || option.disabled}
            labelClassName={labelClassName}
            description={option.description}
          />
        </div>
      ));
    }

    return (
      <div className={cx('ListCheckboxes', className)}>
        {body && body.length ? body : <div>{placeholder}</div>}
      </div>
    );
  }
}

export default themeable(
  uncontrollable(ListCheckboxes, {
    value: 'onChange'
  })
);
