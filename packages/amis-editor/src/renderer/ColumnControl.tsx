/**
 * @file 表格自定义列可视化编辑控件
 */

import React from 'react';
import cx from 'classnames';
import findIndex from 'lodash/findIndex';
import {FormControlProps, FormItem, TreeSelection} from 'amis';

export interface ColumnControlProps extends FormControlProps {
  className?: string;
}

export interface ColumnsControlState {
  columns: Array<any>;
}

export default class ColumnControl extends React.Component<
  ColumnControlProps,
  ColumnsControlState
> {
  constructor(props: any) {
    super(props);

    this.state = {
      columns: this.transformColumns(props)
    };
  }

  transformColumns(props: any) {
    const {data} = props;
    return data.columns;
  }

  onChange(value: Array<any>) {
    const {onBulkChange} = this.props;
    const columns = this.state.columns.map(c => ({
      ...c,
      toggled: findIndex(value, (v: any) => v.value === c.key) > -1
    }));

    this.setState({columns});
    onBulkChange && onBulkChange({columns});
  }

  render() {
    const {columns} = this.state;
    const options = columns
      ? columns.map(c => ({value: c.key, label: c.title}))
      : [];
    const value = columns
      ? columns
          .filter(c => c.toggled !== false)
          .map(c => ({value: c.key, label: c.title}))
      : [];

    return (
      <div className={cx('ae-ColumnControl')}>
        <TreeSelection
          options={options}
          value={value}
          onChange={(v: Array<any>) => this.onChange(v)}
        ></TreeSelection>
      </div>
    );
  }
}

@FormItem({
  type: 'ae-columnControl',
  renderLabel: false
})
export class ColumnControlRenderer extends ColumnControl {}
