/**
 * 关联多选框，仅支持两层关联选择。
 * 左边先点选，然后右边再次点选。
 * 可以满足，先从 tree 中选中一个元素，然后查出来一个列表再次勾选。
 */

import React from 'react';
import {CheckboxesProps, Checkboxes} from './Checkboxes';
import {Options, Option} from './Select';
import ListMenu from './ListMenu';
import {autobind} from '../utils/helper';
import ListRadios from './ListRadios';
import {themeable} from '../theme';
import uncontrollable from 'uncontrollable';
import ListCheckboxes from './ListCheckboxes';
import TableCheckboxes from './TableCheckboxes';
import TreeCheckboxes from './TreeCheckboxes';
import ChainedCheckboxes from './ChainedCheckboxes';
import Spinner from './Spinner';
import TreeRadios from './TreeRadios';
import {Icon} from './icons';

export interface AssociatedCheckboxesProps extends CheckboxesProps {
  leftOptions: Options;
  leftDefaultValue?: any;
  leftMode?: 'tree' | 'list';
  rightMode?: 'table' | 'list' | 'tree' | 'chained';
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

export interface AssociatedCheckboxesState {
  leftValue?: Option;
}

export class AssociatedCheckboxes extends Checkboxes<
  AssociatedCheckboxesProps,
  AssociatedCheckboxesState
> {
  state: AssociatedCheckboxesState = {
    leftValue: this.props.leftDefaultValue
  };

  componentDidMount() {
    const leftValue = this.state.leftValue;
    const {options, onDeferLoad} = this.props;

    if (leftValue) {
      const selectdOption = ListRadios.resolveSelected(
        leftValue,
        options,
        option => option.ref
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

    const selectdOption = ListRadios.resolveSelected(
      value,
      options,
      option => option.ref
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
      leftMode,
      cellRender
    } = this.props;

    const selectdOption = ListRadios.resolveSelected(
      this.state.leftValue,
      options,
      option => option.ref
    );

    return (
      <div className={cx('AssociatedCheckboxes', className)}>
        <div className={cx('AssociatedCheckboxes-left')}>
          {leftMode === 'tree' ? (
            <TreeRadios
              option2value={this.leftOption2Value}
              options={leftOptions}
              value={this.state.leftValue}
              onChange={this.handleLeftSelect}
              showRadio={false}
            />
          ) : (
            <ListRadios
              option2value={this.leftOption2Value}
              options={leftOptions}
              value={this.state.leftValue}
              onChange={this.handleLeftSelect}
              showRadio={false}
            />
          )}
        </div>
        <div className={cx('AssociatedCheckboxes-right')}>
          {this.state.leftValue ? (
            selectdOption ? (
              selectdOption.defer && !selectdOption.loaded ? (
                <div className={cx('AssociatedCheckboxes-box')}>
                  <div
                    className={cx(
                      'AssociatedCheckboxes-reload',
                      selectdOption.loading ? 'is-spin' : 'is-clickable'
                    )}
                    onClick={
                      selectdOption.loading
                        ? undefined
                        : this.handleRetry.bind(this, selectdOption)
                    }
                  >
                    <Icon icon="reload" />
                  </div>

                  {selectdOption.loading ? (
                    <p>加载中</p>
                  ) : (
                    <p>点击刷新重新加载</p>
                  )}
                </div>
              ) : rightMode === 'table' ? (
                <TableCheckboxes
                  columns={columns!}
                  value={value}
                  options={selectdOption.children || []}
                  onChange={onChange}
                  option2value={option2value}
                  cellRender={cellRender}
                />
              ) : rightMode === 'tree' ? (
                <TreeCheckboxes
                  value={value}
                  options={selectdOption.children || []}
                  onChange={onChange}
                  option2value={option2value}
                />
              ) : rightMode === 'chained' ? (
                <ChainedCheckboxes
                  value={value}
                  options={selectdOption.children || []}
                  onChange={onChange}
                  option2value={option2value}
                />
              ) : (
                <ListCheckboxes
                  value={value}
                  options={selectdOption.children || []}
                  onChange={onChange}
                  option2value={option2value}
                />
              )
            ) : (
              <div className={cx('AssociatedCheckboxes-box')}>
                配置错误，选项无法与左侧选项对应
              </div>
            )
          ) : (
            <div className={cx('AssociatedCheckboxes-box')}>
              请先选择左侧数据
            </div>
          )}
        </div>
      </div>
    );
  }
}

export default themeable(
  uncontrollable(AssociatedCheckboxes, {
    value: 'onChange'
  })
);
