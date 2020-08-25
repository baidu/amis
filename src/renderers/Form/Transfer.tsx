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
import {resolveVariable} from '../../utils/tpl-builtin';

export interface BaseTransferProps extends OptionsControlProps {
  showArrow?: boolean;
  sortable?: boolean;
  selectMode?: 'table' | 'list' | 'tree' | 'chained' | 'associated';
  leftOptions?: Array<Option>;
  leftMode?: 'tree' | 'list';
  rightMode?: 'table' | 'list' | 'tree' | 'chained';

  searchResultMode?: 'table' | 'list' | 'tree' | 'chained';
  columns?: Array<any>;
  searchable?: boolean;
  searchApi?: Api;
}

export class BaseTransferRenderer<
  T extends OptionsControlProps = BaseTransferProps
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

  @autobind
  renderCell(
    column: {
      name: string;
      label: string;
      [propName: string]: any;
    },
    option: Option,
    colIndex: number,
    rowIndex: number
  ) {
    const {render, data} = this.props;
    return render(
      `cell/${colIndex}/${rowIndex}`,
      {
        type: 'text',
        ...column
      },
      {
        value: resolveVariable(column.name, option),
        data: createObject(data, option)
      }
    );
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
      searchResultMode,
      deferLoad,
      leftOptions,
      leftMode,
      rightMode
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
          onDeferLoad={deferLoad}
          leftOptions={leftOptions}
          leftMode={leftMode}
          rightMode={rightMode}
          cellRender={this.renderCell}
        />

        <Spinner overlay key="info" show={loading} />
      </div>
    );
  }
}

// ts 3.9 里面非得这样才不报错，鬼知道为何。
export class TransferRender extends BaseTransferRenderer {}

export default OptionsControl({
  type: 'transfer'
})(TransferRender);
