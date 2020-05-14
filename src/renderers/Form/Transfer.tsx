import {OptionsControlProps, OptionsControl} from './Options';
import React from 'react';
import Transfer from '../../components/Transfer';
import {Option} from './Options';
import {
  autobind,
  filterTree,
  string2regExp,
  createObject
} from '../../utils/helper';
import {Api} from '../../types';
import Spinner from '../../components/Spinner';
import find from 'lodash/find';
import {optionValueCompare} from '../../components/Select';

export interface TransferProps extends OptionsControlProps {
  sortable?: boolean;
  selectMode?: 'table' | 'list' | 'tree';
  columns?: Array<any>;
  searchable?: boolean;
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
      extractValue,
      options,
      setOptions
    } = this.props;
    let newValue: any = value;
    let newOptions = options.concat();

    if (Array.isArray(value)) {
      if (joinValues || extractValue) {
        newValue = value.map(item => {
          const resolved = find(
            options,
            optionValueCompare(
              item[valueField || 'value'],
              valueField || 'value'
            )
          );

          if (!resolved) {
            newOptions.push(item);
          }

          return item[valueField || 'value'];
        });
      }

      if (joinValues) {
        newValue = newValue.join(delimiter || ',');
      }
    }

    newOptions.length > options.length && setOptions(newOptions);
    onChange(newValue);
  }

  @autobind
  option2value(option: Option) {
    return option;
  }

  @autobind
  async handleSearch(term: string) {
    const {searchApi, options, labelField, valueField, env, data} = this.props;

    if (searchApi) {
      const payload = await env.fetcher(searchApi, createObject(data, {term}));

      if (!payload.ok) {
        env.notify('error', payload.msg || '搜索请求异常');
        return [];
      }

      const result = payload.data.options || payload.data.items || payload.data;
      if (!Array.isArray(result)) {
        env.notify('error', '期望接口返回数组信息');
        return [];
      }

      return result.map(item => {
        let resolved: any = null;

        if (Array.isArray(options)) {
          resolved = find(
            options,
            optionValueCompare(item[valueField || 'value'], valueField)
          );
        }

        return resolved || item;
      });
    } else if (term) {
      const regexp = string2regExp(term);

      return filterTree(
        options,
        (option: Option) => {
          return !!(
            (Array.isArray(option.children) && option.children.length) ||
            regexp.test(option[labelField || 'label']) ||
            regexp.test(option[valueField || 'value'])
          );
        },
        0,
        true
      );
    } else {
      return options;
    }
  }

  render() {
    const {
      classnames: cx,
      options,
      selectedOptions,
      sortable,
      selectMode,
      columns,
      loading,
      searchable,
      searchApi
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
          onSearch={searchable ? this.handleSearch : undefined}
        />

        <Spinner overlay key="info" show={loading} />
      </div>
    );
  }
}
