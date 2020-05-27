import {OptionsControlProps, OptionsControl} from './Options';
import React from 'react';
import Transfer from '../../components/Transfer';
import {Option} from './Options';
import {
  autobind,
  filterTree,
  string2regExp,
  createObject,
  findTree
} from '../../utils/helper';
import {Api} from '../../types';
import Spinner from '../../components/Spinner';
import find from 'lodash/find';
import {optionValueCompare} from '../../components/Select';

export interface TransferProps extends OptionsControlProps {
  showArrow?: boolean;
  sortable?: boolean;
  selectMode?: 'table' | 'list' | 'tree';
  searchResultMode?: 'table' | 'list' | 'tree';
  columns?: Array<any>;
  searchable?: boolean;
  searchApi?: Api;
}

export class TransferRenderer<
  T extends OptionsControlProps = TransferProps
> extends React.Component<T> {
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
          const resolved = findTree(
            options,
            optionValueCompare(
              item[(valueField as string) || 'value'],
              (valueField as string) || 'value'
            )
          );

          if (!resolved) {
            newOptions.push(item);
          }

          return item[(valueField as string) || 'value'];
        });
      }

      if (joinValues) {
        newValue = newValue.join(delimiter || ',');
      }
    }

    newOptions.length > options.length && setOptions(newOptions, true);
    onChange(newValue);
  }

  @autobind
  option2value(option: Option) {
    return option;
  }

  @autobind
  async handleSearch(term: string, cancelExecutor: Function) {
    const {searchApi, options, labelField, valueField, env, data} = this.props;

    if (searchApi) {
      try {
        const payload = await env.fetcher(
          searchApi,
          createObject(data, {term}),
          {
            cancelExecutor
          }
        );

        if (!payload.ok) {
          throw new Error(payload.msg || '搜索请求异常');
        }

        const result =
          payload.data.options || payload.data.items || payload.data;
        if (!Array.isArray(result)) {
          throw new Error('期望接口返回数组信息');
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
      } catch (e) {
        if (!env.isCancel(e)) {
          env.notify('error', e.message);
        }

        return [];
      }
    } else if (term) {
      const regexp = string2regExp(term);

      return filterTree(
        options,
        (option: Option) => {
          return !!(
            (Array.isArray(option.children) && option.children.length) ||
            regexp.test(option[(labelField as string) || 'label']) ||
            regexp.test(option[(valueField as string) || 'value'])
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
      className,
      classnames: cx,
      options,
      selectedOptions,
      showArrow,
      sortable,
      selectMode,
      columns,
      loading,
      searchable,
      searchResultMode
    } = this.props;

    return (
      <div className={cx('TransferControl', className)}>
        <Transfer
          value={selectedOptions}
          options={options}
          onChange={this.handleChange}
          option2value={this.option2value}
          sortable={sortable}
          showArrow={showArrow}
          selectMode={selectMode}
          searchResultMode={searchResultMode}
          columns={columns}
          onSearch={searchable ? this.handleSearch : undefined}
        />

        <Spinner overlay key="info" show={loading} />
      </div>
    );
  }
}

export default OptionsControl({
  type: 'transfer'
})(TransferRenderer);
