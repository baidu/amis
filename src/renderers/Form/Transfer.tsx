import {
  OptionsControlProps,
  OptionsControl,
  FormOptionsControl
} from './Options';
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
import {SchemaApi} from '../../Schema';

/**
 * Transfer
 * 文档：https://baidu.gitee.io/amis/docs/components/form/transfer
 */
export interface TransferControlSchema extends FormOptionsControl {
  type: 'transfer';

  /**
   * 是否显示剪头
   */
  showArrow?: boolean;

  /**
   * 可排序？
   */
  sortable?: boolean;

  /**
   * 勾选展示模式
   */
  selectMode?: 'table' | 'list' | 'tree' | 'chained' | 'associated';

  /**
   * 当 selectMode 为 associated 时用来定义左侧的选项
   */
  leftOptions?: Array<Option>;

  /**
   * 当 selectMode 为 associated 时用来定义左侧的选择模式
   */
  leftMode?: 'tree' | 'list';

  /**
   * 当 selectMode 为 associated 时用来定义右侧的选择模式
   */
  rightMode?: 'table' | 'list' | 'tree' | 'chained';

  /**
   * 搜索结果展示模式
   */
  searchResultMode?: 'table' | 'list' | 'tree' | 'chained';

  /**
   * 当 selectMode 为 table 时定义表格列信息。
   */
  columns?: Array<any>;

  /**
   * 当 searchResultMode 为 table 时定义表格列信息。
   */
  searchResultColumns?: Array<any>;

  /**
   * 可搜索？
   */
  searchable?: boolean;

  /**
   * 搜索 API
   */
  searchApi?: SchemaApi;

  /**
   * 左侧的标题文字
   */
  selectTitle?: string;

  /**
   * 右侧结果的标题文字
   */
  resultTitle?: string;
}

export interface BaseTransferProps
  extends OptionsControlProps,
    Omit<
      TransferControlSchema,
      | 'type'
      | 'options'
      | 'className'
      | 'descriptionClassName'
      | 'inputClassName'
    > {
  optionItemRender?: (option: Option) => JSX.Element;
  resultItemRender?: (option: Option) => JSX.Element;
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
          throw new Error('CRUD.invalidArray');
        }

        return result.map(item => {
          let resolved: any = null;
          const value = item[valueField || 'value'];

          // 只有 value 值有意义的时候，再去找；否则直接返回
          if (Array.isArray(options) && value !== null && value !== undefined) {
            resolved = find(options, optionValueCompare(value, valueField));
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
      searchResultColumns,
      deferLoad,
      leftOptions,
      leftMode,
      rightMode,
      disabled,
      selectTitle,
      resultTitle,
      optionItemRender,
      resultItemRender
    } = this.props;

    return (
      <div className={cx('TransferControl', className)}>
        <Transfer
          value={selectedOptions}
          options={options}
          disabled={disabled}
          onChange={this.handleChange}
          option2value={this.option2value}
          sortable={sortable}
          showArrow={showArrow}
          selectMode={selectMode}
          searchResultMode={searchResultMode}
          searchResultColumns={searchResultColumns}
          columns={columns}
          onSearch={searchable ? this.handleSearch : undefined}
          onDeferLoad={deferLoad}
          leftOptions={leftOptions}
          leftMode={leftMode}
          rightMode={rightMode}
          cellRender={this.renderCell}
          selectTitle={selectTitle}
          resultTitle={resultTitle}
          optionItemRender={optionItemRender}
          resultItemRender={resultItemRender}
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
