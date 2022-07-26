/**
 * 级联多选框，支持无限极。从左侧到右侧一层层点选。
 */
import {BaseSelection, BaseSelectionProps} from './Selection';
import {themeable} from 'amis-core';
import React from 'react';
import {uncontrollable} from 'amis-core';
import Checkbox from './Checkbox';
import {Option} from './Select';
import {getTreeDepth} from 'amis-core';
import times from 'lodash/times';
import Spinner from './Spinner';
import {localeable} from 'amis-core';

export interface ChainedSelectionProps extends BaseSelectionProps {
  defaultSelectedIndex?: string;
}

export interface ChainedSelectionState {
  selected: Array<string>;
}

export class ChainedSelection extends BaseSelection<
  ChainedSelectionProps,
  ChainedSelectionState
> {
  valueArray: Array<Option>;
  state: ChainedSelectionState = {
    selected: []
  };

  componentDidMount() {
    const defaultSelectedIndex = this.props.defaultSelectedIndex;

    if (defaultSelectedIndex !== undefined) {
      this.setState({
        selected: [`${defaultSelectedIndex}`]
      });
    }
  }

  selectOption(option: Option, depth: number, id: string) {
    const {onDeferLoad} = this.props;

    const selected = this.state.selected.concat();
    selected.splice(depth, selected.length - depth);
    selected.push(id);

    this.setState(
      {
        selected
      },
      option.defer && onDeferLoad ? () => onDeferLoad(option) : undefined
    );
  }

  renderItem(option: Option, index: number, depth: number, id: string) {
    const {
      labelClassName,
      disabled,
      classnames: cx,
      itemClassName,
      itemRender,
      multiple
    } = this.props;
    const valueArray = this.valueArray;

    return (
      <div
        key={index}
        className={cx(
          'ChainedSelection-item',
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

        <div className={cx('ChainedSelection-itemLabel')}>
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

  renderOption(option: Option, index: number, depth: number, id: string) {
    const {
      labelClassName,
      disabled,
      classnames: cx,
      itemClassName,
      itemRender,
      multiple
    } = this.props;
    const valueArray = this.valueArray;

    if (Array.isArray(option.children) || option.defer) {
      return (
        <div
          key={index}
          className={cx(
            'ChainedSelection-item',
            itemClassName,
            option.className,
            disabled || option.disabled ? 'is-disabled' : '',
            ~this.state.selected.indexOf(id) ? 'is-active' : ''
          )}
          onClick={() => this.selectOption(option, depth, id)}
        >
          <div className={cx('ChainedSelection-itemLabel')}>
            {itemRender(option, {
              index: index,
              multiple: multiple,
              checked: !!~this.state.selected.indexOf(id),
              onChange: () => this.selectOption(option, depth, id),
              disabled: disabled || option.disabled
            })}
          </div>

          {option.defer && option.loading ? <Spinner size="sm" show /> : null}
        </div>
      );
    }

    return this.renderItem(option, index, depth, id);
  }

  render() {
    const {
      value,
      options,
      className,
      placeholder,
      classnames: cx,
      option2value,
      itemRender,
      translate: __
    } = this.props;

    this.valueArray = BaseSelection.value2array(value, options, option2value);
    let body: Array<React.ReactNode> = [];

    if (Array.isArray(options) && options.length) {
      const selected: Array<string | null> = this.state.selected.concat();
      const depth = Math.min(getTreeDepth(options), 3);
      times(Math.max(depth - selected.length, 1), () => selected.push(null));

      selected.reduce(
        (
          {
            body,
            options,
            subTitle,
            indexes,
            placeholder
          }: {
            body: Array<React.ReactNode>;
            options: Array<Option> | null;
            subTitle?: string;
            indexes: Array<number>;
            placeholder?: string;
          },
          selected,
          depth
        ) => {
          let nextOptions: Array<Option> = [];
          let nextSubTitle: string = '';
          let nextPlaceholder: string = '';
          let nextIndexes = indexes;

          body.push(
            <div key={depth} className={cx('ChainedSelection-col')}>
              {subTitle ? (
                <div className={cx('ChainedSelection-subTitle')}>
                  {subTitle}
                </div>
              ) : null}
              {Array.isArray(options) && options.length ? (
                options.map((option, index) => {
                  const id = indexes.concat(index).join('-');

                  if (id === selected) {
                    nextSubTitle = option.subTitle;
                    nextOptions = option.children!;
                    nextIndexes = indexes.concat(index);
                    nextPlaceholder = option.placeholder;
                  }

                  return this.renderOption(option, index, depth, id);
                })
              ) : (
                <div className={cx('ChainedSelection-placeholder')}>
                  {__(placeholder)}
                </div>
              )}
            </div>
          );

          return {
            options: nextOptions,
            subTitle: nextSubTitle,
            placeholder: nextPlaceholder,
            indexes: nextIndexes,
            body: body
          };
        },
        {
          options,
          body,
          indexes: [],
          placeholder
        }
      );
    }

    return (
      <div className={cx('ChainedSelection', className)}>
        {body && body.length ? (
          body
        ) : (
          <div className={cx('ChainedSelection-placeholder')}>
            {__(placeholder)}
          </div>
        )}
      </div>
    );
  }
}

export default themeable(
  localeable(
    uncontrollable(ChainedSelection, {
      value: 'onChange'
    })
  )
);
