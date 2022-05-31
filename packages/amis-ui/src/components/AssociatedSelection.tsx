/**
 * 关联多选框，仅支持两层关联选择。
 * 左边先点选，然后右边再次点选。
 * 可以满足，先从 tree 中选中一个元素，然后查出来一个列表再次勾选。
 */

import React from 'react';
import {BaseSelectionProps, BaseSelection} from './Selection';
import {Options, Option} from './Select';
import {autobind} from 'amis-core';
import {themeable} from 'amis-core';
import {uncontrollable} from 'uncontrollable';
import GroupedSelection from './GroupedSelection';
import TableSelection from './TableSelection';
import GroupedSelecton from './GroupedSelection';
import ChainedSelection from './ChainedSelection';
import {Icon} from './icons';
import {localeable} from 'amis-core';
import Tree from './Tree';

export interface AssociatedSelectionProps extends BaseSelectionProps {
  leftOptions: Options;
  leftDefaultValue?: any;
  leftMode?: 'tree' | 'list' | 'group';
  rightMode?: 'table' | 'list' | 'group' | 'tree' | 'chained';
  columns?: Array<any>;
  cellRender?: (
    column: {
      name: string;
      label: string;
      [propName: string]: any;
    },
    option: Option,
    colIndex: number,
    rowIndex: number
  ) => JSX.Element;
}

export interface AssociatedSelectionState {
  leftValue?: Option;
}

export class AssociatedSelection extends BaseSelection<
  AssociatedSelectionProps,
  AssociatedSelectionState
> {
  state: AssociatedSelectionState = {
    leftValue: this.props.leftDefaultValue
  };

  componentDidMount() {
    const leftValue = this.state.leftValue;
    const {options, onDeferLoad} = this.props;

    if (leftValue) {
      const selectdOption = BaseSelection.resolveSelected(
        leftValue,
        options,
        (option: Option) => option.ref
      );

      if (selectdOption && onDeferLoad && selectdOption.defer) {
        onDeferLoad(selectdOption);
      }
    }
  }

  @autobind
  leftOption2Value(option: Option) {
    return option.value;
  }

  @autobind
  handleLeftSelect(value: Option) {
    const {options, onDeferLoad} = this.props;
    this.setState({leftValue: value});

    const selectdOption = BaseSelection.resolveSelected(
      value,
      options,
      (option: Option) => option.ref
    );

    if (selectdOption && onDeferLoad && selectdOption.defer) {
      onDeferLoad(selectdOption);
    }
  }

  @autobind
  handleLeftDeferLoad(option: Option) {
    const {leftOptions, onLeftDeferLoad, onDeferLoad} = this.props;

    if (typeof onLeftDeferLoad === 'function') {
      // TabsTransfer
      return onLeftDeferLoad?.(option, leftOptions);
    } else if (typeof onDeferLoad === 'function') {
      // Select
      return onDeferLoad?.(option);
    }
  }

  handleRetry(option: Option) {
    const {onDeferLoad} = this.props;
    onDeferLoad?.(option);
  }

  render() {
    const {
      classnames: cx,
      className,
      leftOptions,
      options,
      option2value,
      rightMode,
      onChange,
      columns,
      value,
      disabled,
      leftMode,
      cellRender,
      multiple,
      itemRender
    } = this.props;

    const selectdOption = BaseSelection.resolveSelected(
      this.state.leftValue,
      options,
      (option: Option) => option.ref
    );
    const __ = this.props.translate;

    return (
      <div className={cx('AssociatedSelection', className)}>
        <div className={cx('AssociatedSelection-left')}>
          {leftMode === 'tree' ? (
            <Tree
              multiple={false}
              disabled={disabled}
              value={this.state.leftValue}
              options={leftOptions}
              onChange={this.handleLeftSelect}
              onDeferLoad={this.handleLeftDeferLoad}
            />
          ) : (
            <GroupedSelecton
              option2value={this.leftOption2Value}
              options={leftOptions}
              value={this.state.leftValue}
              disabled={disabled}
              onChange={this.handleLeftSelect}
              multiple={false}
              clearable={false}
            />
          )}
        </div>
        <div className={cx('AssociatedSelection-right')}>
          {this.state.leftValue ? (
            selectdOption ? (
              selectdOption.defer && !selectdOption.loaded ? (
                <div className={cx('AssociatedSelection-box')}>
                  <div
                    className={cx(
                      'AssociatedSelection-reload',
                      selectdOption.loading ? 'is-spin' : 'is-clickable'
                    )}
                    onClick={
                      selectdOption.loading
                        ? undefined
                        : this.handleRetry.bind(this, selectdOption)
                    }
                  >
                    <Icon icon="reload" className="icon" />
                  </div>

                  {selectdOption.loading ? (
                    <p>{__('loading')}</p>
                  ) : (
                    <p>{__('Transfer.refreshIcon')}</p>
                  )}
                </div>
              ) : rightMode === 'table' ? (
                <TableSelection
                  columns={columns!}
                  value={value}
                  disabled={disabled}
                  options={selectdOption.children || []}
                  onChange={onChange}
                  option2value={option2value}
                  cellRender={cellRender}
                  multiple={multiple}
                />
              ) : rightMode === 'tree' ? (
                <Tree
                  value={value}
                  disabled={disabled}
                  options={selectdOption.children || []}
                  onChange={onChange!}
                  multiple={multiple}
                />
              ) : rightMode === 'chained' ? (
                <ChainedSelection
                  value={value}
                  disabled={disabled}
                  options={selectdOption.children || []}
                  onChange={onChange}
                  option2value={option2value}
                  multiple={multiple}
                  itemRender={itemRender}
                />
              ) : (
                <GroupedSelection
                  value={value}
                  disabled={disabled}
                  options={selectdOption.children || []}
                  onChange={onChange}
                  option2value={option2value}
                  multiple={multiple}
                  itemRender={itemRender}
                />
              )
            ) : (
              <div className={cx('AssociatedSelection-box')}>
                {__('Transfer.configError')}
              </div>
            )
          ) : (
            <div className={cx('AssociatedSelection-box')}>
              {__('Transfer.selectFromLeft')}
            </div>
          )}
        </div>
      </div>
    );
  }
}

export default themeable(
  localeable(
    uncontrollable(AssociatedSelection, {
      value: 'onChange'
    })
  )
);
