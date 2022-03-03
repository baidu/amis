import {
  OptionsControlProps,
  OptionsControl,
  FormOptionsControl
} from './Options';
import React from 'react';
import Transfer, {Transfer as BaseTransfer} from '../../components/Transfer';
import type {Option} from './Options';
import {
  autobind,
  filterTree,
  string2regExp,
  createObject,
  findTree,
  findTreeIndex,
  getTree,
  spliceTree
} from '../../utils/helper';
import {Api} from '../../types';
import Spinner from '../../components/Spinner';
import find from 'lodash/find';
import {optionValueCompare} from '../../components/Select';
import {resolveVariable} from '../../utils/tpl-builtin';
import {SchemaApi, SchemaObject} from '../../Schema';
import {BaseSelection, ItemRenderStates} from '../../components/Selection';
import {
  ItemRenderStates as ResultItemRenderStates,
  ResultList
} from '../../components/ResultList';
import {Action} from '../../types';

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
   * 复选框位置
   */
  checkboxPosition: 'left' | 'right';

  /**
   * 勾选展示模式
   */
  selectMode?: 'table' | 'list' | 'tree' | 'chained' | 'associated';

  /**
   * 结果面板是否追踪显示
   */
  isFollowMode: boolean;

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
   * 结果（右则）列表的检索功能，当设置为true时，可以通过输入检索模糊匹配检索内容
   */
  resultSearchable?: boolean;

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

  /**
   * 用来丰富选项展示
   */
  menuTpl?: SchemaObject;

  /**
   * 用来丰富值的展示
   */
  valueTpl?: SchemaObject;

  /**
   * 左侧列表搜索框提示
   */
  searchPlaceholder?: string;

  /**
   * 右侧列表搜索框提示
   */
  resultPlaceholder?: string;

  /**
   * 结果搜索函数
   */
  resultSearchFilter?: string
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
  resultItemRender?: (option: Option) => JSX.Element;
}

export class BaseTransferRenderer<
  T extends OptionsControlProps = BaseTransferProps
> extends React.Component<T> {

  tranferRef?: BaseTransfer;

  static defaultProps = {
    isFollowMode: false,
    checkboxPosition: 'right',
    resultSearchable: false
  }

  @autobind
  async handleChange(value: Array<Option> | Option, optionModified?: boolean) {
    const {
      onChange,
      joinValues,
      delimiter,
      valueField,
      extractValue,
      options,
      dispatchEvent,
      setOptions
    } = this.props;
    let newValue: any = value;
    let newOptions = options.concat();

    if (Array.isArray(value)) {
      newValue = value.map(item => {
        const indexes = findTreeIndex(
          options,
          optionValueCompare(
            item[(valueField as string) || 'value'],
            (valueField as string) || 'value'
          )
        );

        if (!indexes) {
          newOptions.push(item);
        } else if (optionModified) {
          const origin = getTree(newOptions, indexes);
          newOptions = spliceTree(newOptions, indexes, 1, {
            ...origin,
            ...item
          });
        }

        return joinValues || extractValue
          ? item[(valueField as string) || 'value']
          : item;
      });

      if (joinValues) {
        newValue = newValue.join(delimiter || ',');
      }
    } else if (value) {
      newValue =
        joinValues || extractValue
          ? value[(valueField as string) || 'value']
          : value;
    }

    (newOptions.length > options.length || optionModified) &&
      setOptions(newOptions, true);

    // 触发渲染器事件
    const rendererEvent = await dispatchEvent('change', {
      value: newValue,
      options
    });
    if (rendererEvent?.prevented) {
      return;
    }

    onChange(newValue);
  }

  @autobind
  option2value(option: Option) {
    return option;
  }

  @autobind
  async handleSearch(term: string, cancelExecutor: Function) {
    const {
      searchApi,
      options,
      labelField,
      valueField,
      env,
      data,
      translate: __
    } = this.props;

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
          throw new Error(__(payload.msg || 'networkError'));
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
            (option[(valueField as string) || 'value'] &&
              (regexp.test(option[(labelField as string) || 'label']) ||
                regexp.test(option[(valueField as string) || 'value'])))
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
  handleResultSearch(term: string, item: Option) {
    const {valueField} = this.props;
    const regexp = string2regExp(term);
    return regexp.test(item[(valueField as string) || 'value']);
  }

  @autobind
  optionItemRender(option: Option, states: ItemRenderStates) {
    const {menuTpl, render, data} = this.props;

    if (menuTpl) {
      return render(`item/${states.index}`, menuTpl, {
        data: createObject(createObject(data, states), option)
      });
    }

    return BaseSelection.itemRender(option, states);
  }

  @autobind
  resultItemRender(option: Option, states: ResultItemRenderStates) {
    const {valueTpl, render, data} = this.props;

    if (valueTpl) {
      return render(`value/${states.index}`, valueTpl, {
        onChange: states.onChange,
        data: createObject(createObject(data, states), option)
      });
    }

    return ResultList.itemRender(option);
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

  @autobind
  getRef(ref: BaseTransfer) {
    this.tranferRef = ref;
  }

  @autobind
  onSelectAll(options: Option[]) {
    const {dispatchEvent} = this.props;
    dispatchEvent('selectAll', options);
  }

  // 动作
  doAction(action: Action, data: object, throwErrors: boolean) {
    const {resetValue, onChange} = this.props;
    switch (action.actionType) {
      case 'clear':
        onChange?.('');
        break;
      case 'reset':
        onChange?.(resetValue ?? '');
        break;
      case 'selectAll':
        this.tranferRef?.selectAll();
        break;
    }
  }

  render() {
    let {
      className,
      classnames: cx,
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
      leftMode,
      rightMode,
      disabled,
      selectTitle,
      resultTitle,
      menuTpl,
      resultSearchFilter,
      searchPlaceholder,
      isFollowMode,
      checkboxPosition,
      resultPlaceholder,
      resultSearchable,
    } = this.props;

    // 目前 LeftOptions 没有接口可以动态加载
    // 为了方便可以快速实现动态化，让选项的第一个成员携带
    // LeftOptions 信息
    let {options, leftOptions, leftDefaultValue} = this.props;

    if (
      selectMode === 'associated' &&
      options &&
      options.length &&
      options[0].leftOptions &&
      Array.isArray(options[0].children)
    ) {
      leftOptions = options[0].leftOptions;
      leftDefaultValue = options[0].leftDefaultValue ?? leftDefaultValue;
      options = options[0].children;
    }

    let resultSearchFunc = this.handleResultSearch;

    if (typeof resultSearchFilter === 'string') {
      try {
        resultSearchFunc = new Function('text', 'item', resultSearchFilter) as (text: string, item: Option) => boolean;
      } catch (e) {
        console.warn(resultSearchFilter, e);
      }
    }

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
          isFollowMode={isFollowMode}
          onResultSearch={resultSearchFunc}
          checkboxPosition={checkboxPosition}
          searchPlaceholder={searchPlaceholder}
          resultSearchable={resultSearchable}
          resultPlaceholder={resultPlaceholder}
          optionItemRender={this.optionItemRender}
          resultItemRender={this.resultItemRender}
          onSelectAll={this.onSelectAll}
          onRef={this.getRef}
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
