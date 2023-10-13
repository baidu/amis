import React from 'react';
import find from 'lodash/find';

import {
  OptionsControlProps,
  OptionsControl,
  FormOptionsControl,
  resolveEventData,
  str2function,
  getOptionValueBindField
} from 'amis-core';
import {SpinnerExtraProps, Transfer} from 'amis-ui';
import type {Option} from 'amis-core';
import {
  autobind,
  filterTree,
  string2regExp,
  createObject,
  findTree,
  findTreeIndex,
  getTree,
  spliceTree,
  mapTree
} from 'amis-core';
import {Spinner} from 'amis-ui';
import {optionValueCompare} from 'amis-core';
import {resolveVariable} from 'amis-core';
import {FormOptionsSchema, SchemaApi, SchemaObject} from '../../Schema';
import {Selection as BaseSelection} from 'amis-ui';
import {ResultList} from 'amis-ui';
import {ActionObject, toNumber} from 'amis-core';
import type {ItemRenderStates} from 'amis-ui/lib/components/Selection';
import {supportStatic} from './StaticHoc';
import {matchSorter} from 'match-sorter';

/**
 * Transfer
 * 文档：https://aisuda.bce.baidu.com/amis/zh-CN/components/form/transfer
 */
export interface TransferControlSchema
  extends FormOptionsSchema,
    SpinnerExtraProps {
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
   * 结果面板是否追踪显示
   */
  resultListModeFollowSelect?: boolean;

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
  resultSearchPlaceholder?: string;

  /**
   * 统计数字
   */
  statistics?: boolean;

  /**
   * 单个选项的高度，主要用于虚拟渲染
   */
  itemHeight?: number;

  /**
   * 在选项数量达到多少时开启虚拟渲染
   */
  virtualThreshold?: number;

  /**
   * 当在value值未匹配到当前options中的选项时，是否value值对应文本飘红显示
   */
  showInvalidMatch?: boolean;

  /**
   * 树形模式下，仅选中子节点
   */
  onlyChildren?: boolean;
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
    >,
    SpinnerExtraProps {
  resultItemRender?: (option: Option) => JSX.Element;
  virtualThreshold?: number;
  itemHeight?: number;
  /**
   * 检索函数
   */
  filterOption?: 'string';
}

type OptionsControlWithSpinnerProps = OptionsControlProps & SpinnerExtraProps;

export const getCustomFilterOption = (filterOption?: string) => {
  switch (typeof filterOption) {
    case 'string':
      return str2function(filterOption, 'options', 'inputValue', 'option');
    case 'function':
      return filterOption;
    default:
      return null;
  }
};
export class BaseTransferRenderer<
  T extends OptionsControlWithSpinnerProps = BaseTransferProps
> extends React.Component<T> {
  static defaultProps = {
    multiple: true
  };

  tranferRef?: any;

  reload() {
    const {reloadOptions} = this.props;

    reloadOptions?.();
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
      setOptions,
      selectMode,
      deferApi
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
          ),
          {
            resolve: getOptionValueBindField(valueField),
            value: item[valueField as string] || 'value'
          }
        );

        if (!indexes) {
          newOptions.push({
            ...item,
            visible: false
          });
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
      const indexes = findTreeIndex(
        options,
        optionValueCompare(
          value[(valueField as string) || 'value'],
          (valueField as string) || 'value'
        )
      );

      if (!indexes) {
        newOptions.push({
          ...value,
          visible: false
        });
      } else if (optionModified) {
        const origin = getTree(newOptions, indexes);
        newOptions = spliceTree(newOptions, indexes, 1, {
          ...origin,
          ...value
        });
      }
    }

    // 是否是有懒加载的树，这时不能将 value 添加到 options。因为有可能 value 在懒加载结果中
    const isTreeDefer =
      selectMode === 'tree' &&
      (!!deferApi ||
        !!findTree(
          options,
          (option: Option) => option.deferApi || option.defer
        ));

    if (
      isTreeDefer === true ||
      newOptions.length > options.length ||
      optionModified
    ) {
      setOptions(newOptions, true);
    }

    // 触发渲染器事件
    const rendererEvent = await dispatchEvent(
      'change',
      resolveEventData(this.props, {
        value: newValue,
        options,
        items: options // 为了保持名字统一
      })
    );
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
      translate: __,
      filterOption
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
          throw new Error(__('CRUD.invalidArray'));
        }

        return mapTree(result, item => {
          let resolved: any = null;
          const value = item[valueField || 'value'];

          // 只有 value 值有意义的时候，再去找；否则直接返回
          if (Array.isArray(options) && value !== null && value !== undefined) {
            resolved = find(options, optionValueCompare(value, valueField));
            if (item?.children) {
              resolved = {
                ...resolved,
                children: item.children
              };
            }
          }

          return resolved || item;
        });
      } catch (e) {
        if (!env.isCancel(e) && !searchApi.silent) {
          env.notify('error', e.message);
        }

        return [];
      }
    } else if (term) {
      const labelKey = (labelField as string) || 'label';
      const valueKey = (valueField as string) || 'value';
      const option = {keys: [labelKey, valueKey]};

      if (filterOption) {
        const customFilterOption = getCustomFilterOption(filterOption);
        if (customFilterOption) {
          return customFilterOption(options, term, option);
        } else {
          env.notify('error', '自定义检索函数不符合要求');
          return [];
        }
      }

      return filterTree(
        options,
        (option: Option, key: number, level: number, paths: Array<Option>) => {
          return !!(
            (Array.isArray(option.children) && option.children.length) ||
            !!matchSorter([option].concat(paths), term, {
              keys: [labelField || 'label', valueField || 'value'],
              threshold: matchSorter.rankings.CONTAINS
            }).length
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
    const {valueField, labelField} = this.props;
    const regexp = string2regExp(term);
    const labelTest = item[(labelField as string) || 'label'];
    const valueTest = item[(valueField as string) || 'value'];
    return regexp.test(labelTest) || regexp.test(valueTest);
  }

  @autobind
  optionItemRender(option: Option, states: ItemRenderStates) {
    const {menuTpl, render, data} = this.props;

    return render(`item/${states.index}`, menuTpl, {
      data: createObject(createObject(data, states), option)
    });
  }

  @autobind
  resultItemRender(option: Option, states: ItemRenderStates) {
    const {valueTpl, render, data} = this.props;

    return render(`value/${states.index}`, valueTpl, {
      onChange: states.onChange,
      data: createObject(createObject(data, states), option)
    });
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
    const {render, data, classnames: cx, showInvalidMatch} = this.props;
    return render(
      `cell/${colIndex}/${rowIndex}`,
      {
        type: 'text',
        className: cx({
          'is-invalid': showInvalidMatch ? option?.__unmatched : false
        }),
        ...column
      },
      {
        value: resolveVariable(column.name, option),
        data: createObject(data, option)
      }
    );
  }

  @autobind
  getRef(ref: any) {
    while (ref && ref.getWrappedInstance) {
      ref = ref.getWrappedInstance();
    }
    this.tranferRef = ref;
  }

  @autobind
  onSelectAll(options: Option[]) {
    const {dispatchEvent, data} = this.props;
    dispatchEvent('selectAll', createObject(data, {items: options}));
  }

  // 动作
  doAction(action: ActionObject, data: object, throwErrors: boolean) {
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
      case 'clearSearch': {
        this.tranferRef?.clearSearch(data);
        break;
      }
    }
  }

  @supportStatic()
  render() {
    let {
      className,
      style,
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
      valueTpl,
      searchPlaceholder,
      resultListModeFollowSelect = false,
      resultSearchPlaceholder,
      resultSearchable = false,
      statistics,
      labelField,
      valueField,
      virtualThreshold,
      itemHeight,
      loadingConfig,
      showInvalidMatch,
      onlyChildren,
      mobileUI,
      noResultsText
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

    return (
      <div className={cx('TransferControl', className)}>
        <Transfer
          onlyChildren={onlyChildren}
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
          resultListModeFollowSelect={resultListModeFollowSelect}
          onResultSearch={this.handleResultSearch}
          searchPlaceholder={searchPlaceholder}
          resultSearchable={resultSearchable}
          resultSearchPlaceholder={resultSearchPlaceholder}
          statistics={statistics}
          labelField={labelField}
          valueField={valueField}
          optionItemRender={menuTpl ? this.optionItemRender : undefined}
          resultItemRender={valueTpl ? this.resultItemRender : undefined}
          onSelectAll={this.onSelectAll}
          onRef={this.getRef}
          virtualThreshold={virtualThreshold}
          itemHeight={
            toNumber(itemHeight) > 0 ? toNumber(itemHeight) : undefined
          }
          loadingConfig={loadingConfig}
          showInvalidMatch={showInvalidMatch}
          mobileUI={mobileUI}
          noResultsText={noResultsText}
        />

        <Spinner
          overlay
          key="info"
          loadingConfig={loadingConfig}
          show={loading}
        />
      </div>
    );
  }
}

// ts 3.9 里面非得这样才不报错，鬼知道为何。
export class TransferRender extends BaseTransferRenderer {}

export default OptionsControl({
  type: 'transfer'
})(TransferRender);
