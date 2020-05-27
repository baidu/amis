import {Checkboxes, CheckboxesProps} from './Checkboxes';
import {themeable} from '../theme';
import React from 'react';
import uncontrollable from 'uncontrollable';
import Checkbox from './Checkbox';
import {Option} from './Select';
import {getTreeDepth} from '../utils/helper';
import times from 'lodash/times';

export interface NestedCheckboxesState {
  selected: Array<Option>;
}

export class NestedCheckboxes extends Checkboxes<
  CheckboxesProps,
  NestedCheckboxesState
> {
  valueArray: Array<Option>;
  state: NestedCheckboxesState = {
    selected: []
  };

  selectOption(option: Option, depth: number) {
    const selected = this.state.selected.concat();
    selected.splice(depth, selected.length - depth);
    selected.push(option);

    this.setState({
      selected
    });
  }

  renderOption(option: Option, index: number, depth: number) {
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
          className={cx(
            'NestedCheckboxes-item',
            itemClassName,
            option.className,
            disabled || option.disabled ? 'is-disabled' : '',
            ~this.state.selected.indexOf(option) ? 'is-active' : ''
          )}
          onClick={() => this.selectOption(option, depth)}
        >
          <div className={cx('NestedCheckboxes-itemLabel')}>
            {itemRender(option)}
          </div>
        </div>
      );
    }

    return (
      <div
        key={index}
        className={cx(
          'NestedCheckboxes-item',
          itemClassName,
          option.className,
          disabled || option.disabled ? 'is-disabled' : ''
        )}
        onClick={() => this.toggleOption(option)}
      >
        <div className={cx('NestedCheckboxes-itemLabel')}>
          {itemRender(option)}
        </div>

        <Checkbox
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
      option2value,
      itemRender
    } = this.props;

    this.valueArray = Checkboxes.value2array(value, options, option2value);
    let body: Array<React.ReactNode> = [];

    if (Array.isArray(options) && options.length) {
      const selected: Array<Option | null> = this.state.selected.concat();
      const depth = getTreeDepth(options);
      times(depth - selected.length, () => selected.push(null));

      selected.reduce(
        (
          {
            body,
            options,
            subTitle
          }: {
            body: Array<React.ReactNode>;
            options: Array<Option> | null;
            subTitle?: string;
          },
          selected,
          depth
        ) => {
          let nextOptions: Array<Option> = [];
          let nextSubTitle: string = '';

          body.push(
            <div key={depth} className={cx('NestedCheckboxes-col')}>
              {subTitle ? (
                <div className={cx('NestedCheckboxes-subTitle')}>
                  {subTitle}
                </div>
              ) : null}
              {Array.isArray(options) && options.length
                ? options.map((option, index) => {
                    if (option === selected) {
                      nextSubTitle = option.subTitle;
                      nextOptions = option.children!;
                    }

                    return this.renderOption(option, index, depth);
                  })
                : null}
            </div>
          );

          return {
            options: nextOptions,
            subTitle: nextSubTitle,
            body: body
          };
        },
        {
          options,
          body
        }
      );
    }

    return (
      <div className={cx('NestedCheckboxes', className)}>
        {body && body.length ? (
          body
        ) : (
          <div className={cx('NestedCheckboxes-placeholder')}>
            {placeholder}
          </div>
        )}
      </div>
    );
  }
}

export default themeable(
  uncontrollable(NestedCheckboxes, {
    value: 'onChange'
  })
);
