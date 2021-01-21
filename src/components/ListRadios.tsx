import {BaseCheckboxes} from './Checkboxes';
import {themeable, ThemeProps} from '../theme';
import React from 'react';
import {uncontrollable} from 'uncontrollable';
import Checkbox from './Checkbox';
import {Option, Options} from './Select';
import {findTree, autobind} from '../utils/helper';
import isEqual from 'lodash/isEqual';
import {LocaleProps, localeable} from '../locale';

export interface BaseRadiosProps extends ThemeProps, LocaleProps {
  options: Options;
  className?: string;
  placeholder: string;
  value?: any;
  onChange?: (value: any) => void;
  onDeferLoad?: (option: Option) => void;
  option2value?: (option: Option) => any;
  itemClassName?: string;
  itemRender: (option: Option) => JSX.Element;
  disabled?: boolean;
  clearable?: boolean;
  showRadio?: boolean;
  onClick?: (e: React.MouseEvent) => void;
}

export class BaseRadios<
  T extends BaseRadiosProps = BaseRadiosProps,
  S = {}
> extends React.Component<T, S> {
  selected: Option | undefined | null;

  static defaultProps = {
    placeholder: 'placeholder.noOption',
    itemRender: (option: Option) => <span>{option.label}</span>
  };
  static resolveSelected(
    value: any,
    options: Options,
    option2value: (option: Option) => any = (option: Option) => option
  ) {
    return findTree(options, option => isEqual(option2value(option), value));
  }

  @autobind
  toggleOption(option: Option) {
    const {onChange, clearable, value, options, option2value} = this.props;

    let newValue: Option | null = option;

    if (clearable) {
      const prevSelected = BaseRadios.resolveSelected(
        value,
        options,
        option2value
      );

      if (prevSelected) {
        newValue = null;
      }
    }

    onChange?.(newValue && option2value ? option2value(newValue) : newValue);
  }

  renderOption(option: Option, index: number) {
    const {
      disabled,
      classnames: cx,
      itemClassName,
      itemRender,
      showRadio
    } = this.props;
    const selected = this.selected;

    if (Array.isArray(option.children)) {
      return (
        <div key={index} className={cx('ListRadios-group', option.className)}>
          <div className={cx('ListRadios-itemLabel')}>{itemRender(option)}</div>

          <div className={cx('ListRadios-items', option.className)}>
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
          'ListRadios-item',
          itemClassName,
          option.className,
          disabled || option.disabled ? 'is-disabled' : '',
          selected === option ? 'is-active' : ''
        )}
        onClick={() => this.toggleOption(option)}
      >
        <div className={cx('ListRadios-itemLabel')}>{itemRender(option)}</div>

        {showRadio !== false ? (
          <Checkbox
            type="radio"
            size="sm"
            checked={selected === option}
            disabled={disabled || option.disabled}
          />
        ) : null}
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
      onClick
    } = this.props;
    const __ = this.props.translate;

    this.selected = BaseRadios.resolveSelected(value, options, option2value);
    let body: Array<React.ReactNode> = [];

    if (Array.isArray(options) && options.length) {
      body = options.map((option, key) => this.renderOption(option, key));
    }

    return (
      <div className={cx('ListRadios', className)} onClick={onClick}>
        {body && body.length ? (
          body
        ) : (
          <div className={cx('ListRadios-placeholder')}>{__(placeholder)}</div>
        )}
      </div>
    );
  }
}

export class ListRadios extends BaseRadios {}

const themedListRadios = themeable(
  localeable(
    uncontrollable(ListRadios, {
      value: 'onChange'
    })
  )
);

themedListRadios.resolveSelected = BaseRadios.resolveSelected;

export default themedListRadios;
