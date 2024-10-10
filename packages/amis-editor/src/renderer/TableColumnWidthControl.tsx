/**
 * @file 表格自定义列可视化编辑控件
 */

import React from 'react';
import cx from 'classnames';
import findIndex from 'lodash/findIndex';
import {FormControlProps, FormItem, TreeSelection} from 'amis';
import {toNumber} from 'amis-core';
import {getSchemaTpl} from 'amis-editor-core';

interface optionType {
  label: string;
  value: string;
}

export interface TableColumnWidthProps extends FormControlProps {
  className?: string;
}

export interface TableColumnWidthState {
  columns?: Array<any>;
  activeOption: optionType;
}

export default class TableColumnWidthControl extends React.Component<
  TableColumnWidthProps,
  TableColumnWidthState
> {
  options: Array<optionType> = [
    {
      label: '自适应',
      value: 'adaptive'
    },
    {
      label: '百分比',
      value: 'percentage'
    },
    {
      label: '固定宽度',
      value: 'fixed'
    }
  ];

  constructor(props: any) {
    super(props);

    this.state = {
      activeOption: this.options[0]
    };
  }

  componentDidMount(): void {
    const {value} = this.props;

    if (value === undefined) return;

    if (typeof value === 'number') {
      this.state.activeOption !== this.options[2] &&
        this.setState({
          activeOption: this.options[2]
        });
    } else if (typeof value === 'string' && value.endsWith('%')) {
      this.state.activeOption !== this.options[1] &&
        this.setState({
          activeOption: this.options[1]
        });
    } else {
      this.state.activeOption !== this.options[0] &&
        this.setState({
          activeOption: this.options[0]
        });
    }
  }

  handleOptionChange(item: optionType) {
    if (item === this.state.activeOption) return;

    this.setState({
      activeOption: item
    });
    this.props?.onChange?.(undefined);
  }

  renderHeader() {
    const {
      render,
      formLabel,
      labelRemark,
      useMobileUI,
      env,
      popOverContainer,
      data
    } = this.props;

    const classPrefix = env?.theme?.classPrefix;

    const {activeOption} = this.state;

    return (
      <div className="ae-columnWidthControl-header">
        <label className={cx(`${classPrefix}Form-label`)}>
          {formLabel || ''}
          {labelRemark
            ? render('label-remark', {
                type: 'remark',
                icon: labelRemark.icon || 'warning-mark',
                tooltip: labelRemark,
                className: cx(`Form-lableRemark`, labelRemark?.className),
                useMobileUI,
                container: popOverContainer
                  ? popOverContainer
                  : env && env.getModalContainer
                  ? env.getModalContainer
                  : undefined
              })
            : null}
        </label>
        {render(
          'columnWidthControl-options',
          {
            type: 'dropdown-button',
            level: 'link',
            size: 'sm',
            label: activeOption.label,
            align: 'right',
            closeOnClick: true,
            closeOnOutside: true,
            buttons: this.options.map(item => ({
              ...item,
              onClick: () => this.handleOptionChange(item)
            }))
          },
          {
            popOverContainer: null
          }
        )}
      </div>
    );
  }

  handleChange(type: 'fixed' | 'percentage', val: number) {
    const onChange = this.props.onChange;

    if (typeof val !== 'number' || isNaN(val)) return;

    if (val <= 0) {
      onChange?.(undefined);
      return;
    }

    onChange?.(type === 'percentage' ? val + '%' : val);
  }

  renderBody() {
    const {onBulkChange, render, onChange, value} = this.props;
    const {activeOption} = this.state;

    if (activeOption.value === 'adaptive') {
      return null;
    }
    if (activeOption.value === 'fixed') {
      return render(
        'columnWidthControl-fixed',
        getSchemaTpl('withUnit', {
          label: '固定列宽',
          name: 'interval',
          control: {
            type: 'input-number',
            min: 0,
            value
            // onChange: (val: number) => this.handleChange('fixed', val)
          },
          unit: 'px',
          className: 'mt-3'
        }),
        {
          onChange: (val: number) => this.handleChange('fixed', val)
        }
      );
    }

    return render('columnWidthControl-fixed', {
      type: 'input-range',
      name: 'range',
      min: 0,
      max: 100,
      step: 1,
      label: '百分比列宽',
      value: toNumber(value),
      onChange: (val: number) =>
        activeOption.value === 'percentage' &&
        this.handleChange('percentage', val)
    });
  }

  render() {
    return (
      <div className={cx('ae-columnWidthControl')}>
        {this.renderHeader()}
        {this.renderBody()}
      </div>
    );
  }
}

@FormItem({
  type: 'ae-columnWidthControl',
  renderLabel: false
})
export class TableColumnWidthControlRender extends TableColumnWidthControl {}
