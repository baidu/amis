/**
 * 关联多选框，仅支持两层关联选择。
 * 左边先点选，然后右边再次点选。
 * 可以满足，先从 tree 中选中一个元素，然后查出来一个列表再次勾选。
 */

import React from 'react';
import {BaseSelectionProps, BaseSelection} from './Selection';
import {Options, Option} from './Select';
import {autobind} from '../utils/helper';
import {themeable} from '../theme';
import {uncontrollable} from 'uncontrollable';
import GroupedSelection from './GroupedSelection';
import TableSelection from './TableSelection';
import TreeSelection from './TreeSelection';
import GroupedSelecton from './GroupedSelection';
import ChainedSelection from './ChainedSelection';
import {Icon} from './icons';
import {localeable} from '../locale';

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
      onDeferLoad
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
            <TreeSelection
              option2value={this.leftOption2Value}
              options={leftOptions}
              value={this.state.leftValue}
              disabled={disabled}
              onChange={this.handleLeftSelect}
              multiple={false}
              clearable={false}
              onDeferLoad={onDeferLoad}
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
                <TreeSelection
                  value={value}
                  disabled={disabled}
                  options={selectdOption.children || []}
                  onChange={onChange}
                  option2value={option2value}
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
                />
              ) : (
                <GroupedSelection
                  value={value}
                  disabled={disabled}
                  options={selectdOption.children || []}
                  onChange={onChange}
                  option2value={option2value}
                  multiple={multiple}
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
