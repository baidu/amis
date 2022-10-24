import React from 'react';
import {uncontrollable, flattenTree} from 'amis-core';

import {BaseSelection, BaseSelectionProps} from './Selection';
import {themeable} from 'amis-core';
import Checkbox from './Checkbox';
import {Option} from './Select';
import {localeable} from 'amis-core';
import VirtualList, {AutoSizer} from './virtual-list';

export class GroupedSelection extends BaseSelection<BaseSelectionProps> {
  valueArray: Array<Option>;

  renderOption(
    option: Option,
    index: number,
    key: string = `${index}`,
    styles: object = {}
  ): JSX.Element {
    const {
      disabled,
      classnames: cx,
      itemRender,
      multiple,
      labelField
    } = this.props;

    if (Array.isArray(option.children)) {
      if (!option.label) {
        return (
          <>
            {option.children.map((child: Option, index: number) =>
              this.renderOption(child, index)
            )}
          </>
        );
      }

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
              disabled: disabled || option.disabled,
              labelField
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

    return this.renderPureOption(option, index, key, styles);
  }

  renderOptionOrLabel(
    option: Option,
    index: number,
    hasParent: boolean = false,
    styles: object = {}
  ): JSX.Element {
    const {
      disabled,
      classnames: cx,
      itemRender,
      multiple,
      labelField
    } = this.props;

    if (option.children) {
      return (
        <div
          key={index}
          style={styles}
          className={cx('GroupedSelection-group', option.className)}
        >
          <div className={cx('GroupedSelection-itemLabel')}>
            {itemRender(option, {
              index: index,
              multiple: multiple,
              checked: false,
              onChange: () => undefined,
              disabled: disabled || option.disabled,
              labelField
            })}
          </div>
        </div>
      );
    }

    return hasParent ? (
      <div
        key={'group' + index}
        style={styles}
        className={cx('GroupedSelection-group', option.className)}
      >
        <div className={cx('GroupedSelection-items', option.className)}>
          {this.renderPureOption(option, index)}
        </div>
      </div>
    ) : (
      this.renderPureOption(option, index, undefined, styles)
    );
  }

  renderPureOption(
    option: Option,
    index: number,
    key: string = `${index}`,
    styles: object = {}
  ): JSX.Element {
    const {
      labelClassName,
      disabled,
      classnames: cx,
      itemClassName,
      itemRender,
      multiple,
      labelField
    } = this.props;

    const valueArray = this.valueArray;

    return (
      <div
        key={index}
        style={styles}
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
            disabled: disabled || option.disabled,
            labelField
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
      placeholderRender,
      virtualThreshold = 1000,
      itemHeight = 32,
      virtualListHeight
    } = this.props;
    const __ = this.props.translate;

    this.valueArray = BaseSelection.value2array(value, options, option2value);
    let body: Array<React.ReactNode> | React.ReactNode | null = null;

    if (Array.isArray(options) && options.length) {
      const flattendOptions: Option[] = flattenTree(
        options,
        (item, index, level) => {
          return {
            option: item,
            hasParent: level > 1
          };
        }
      );

      body =
        flattendOptions.length > virtualThreshold ? (
          <AutoSizer minHeight={virtualListHeight}>
            {({height}: {height: number}) => (
              <VirtualList
                height={height}
                itemCount={flattendOptions.length}
                itemSize={itemHeight}
                renderItem={({
                  index,
                  style
                }: {
                  index: number;
                  style?: object;
                }) => {
                  const {option, hasParent} = flattendOptions[index];
                  if (!option) {
                    return null;
                  }

                  return this.renderOptionOrLabel(option, index, hasParent, {
                    ...style,
                    width: '100%'
                  });
                }}
              />
            )}
          </AutoSizer>
        ) : (
          options.map((option, key) => this.renderOption(option, key))
        );
    }

    return (
      <div className={cx('GroupedSelection', className)} onClick={onClick}>
        {body ? (
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
