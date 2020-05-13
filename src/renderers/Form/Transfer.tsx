import {OptionsControlProps, OptionsControl} from './Options';
import React from 'react';
import Transfer from '../../components/Transfer';
import {Option} from './Options';
import {autobind} from '../../utils/helper';
import {Api} from '../../types';

export interface TransferProps extends OptionsControlProps {
  sortable?: boolean;
  selectMode?: 'table' | 'list' | 'tree';
  columns?: Array<any>;
  searchApi?: Api; // todo 通过传递进去 onSearch 实现。
}

@OptionsControl({
  type: 'transfer'
})
export class TransferRenderer extends React.Component<TransferProps> {
  @autobind
  handleChange(value: Array<Option>) {
    const {
      onChange,
      joinValues,
      delimiter,
      valueField,
      extractValue
    } = this.props;
    let newValue: any = value;

    if (Array.isArray(value)) {
      if (joinValues) {
        newValue = value
          .map(item => item[valueField || 'value'])
          .join(delimiter || ',');
      } else if (extractValue) {
        newValue = value.map(item => item[valueField || 'value']);
      }
    }

    onChange(newValue);
  }

  @autobind
  option2value(option: Option) {
    return option;
  }

  render() {
    const {
      classnames: cx,
      options,
      selectedOptions,
      sortable,
      selectMode,
      columns
    } = this.props;

    return (
      <div className={cx('TransferControl')}>
        <Transfer
          value={selectedOptions}
          options={options}
          onChange={this.handleChange}
          option2value={this.option2value}
          sortable={sortable}
          selectMode={selectMode}
          columns={columns}
        />
      </div>
    );
  }
}
