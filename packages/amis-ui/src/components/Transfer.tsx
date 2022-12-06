import React from 'react';
import {
  intersectionWith,
  differenceWith,
  includes,
  debounce,
  result,
  isEqual,
  unionWith
} from 'lodash';

import {ThemeProps, themeable} from 'amis-core';
import {BaseSelectionProps, BaseSelection, ItemRenderStates} from './Selection';
import {Options, Option} from './Select';
import {uncontrollable} from 'amis-core';
import ResultList from './ResultList';
import TableSelection from './TableSelection';
import {autobind, flattenTree} from 'amis-core';
import InputBox from './InputBox';
import Checkbox from './Checkbox';
import Tree from './Tree';
import {Icon} from './icons';
import AssociatedSelection from './AssociatedSelection';
import {LocaleProps, localeable} from 'amis-core';
import GroupedSelection from './GroupedSelection';
import ChainedSelection from './ChainedSelection';
import {ItemRenderStates as ResultItemRenderStates} from './ResultList';
import ResultTableList from './ResultTableList';
import ResultTreeList from './ResultTreeList';

export type SelectMode =
  | 'table'
  | 'group'
  | 'list'
  | 'tree'
  | 'chained'
  | 'associated';

export interface TransferProps
  extends ThemeProps,
    LocaleProps,
    Omit<BaseSelectionProps, 'itemRender'> {
  inline?: boolean;
  statistics?: boolean;
  showArrow?: boolean;
  multiple?: boolean;

  selectTitle?: string;
  selectMode?: SelectMode;
  columns?: Array<{
    name: string;
    label: string;
    [propName: string]: any;
  }>;
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
  leftOptions?: Array<Option>;
  leftMode?: 'tree' | 'list' | 'group';
  leftDefaultValue?: any;
  rightMode?: 'table' | 'list' | 'group' | 'tree' | 'chained';

  // search 相关
  searchResultMode?: 'table' | 'list' | 'group' | 'tree' | 'chained';
  searchResultColumns?: Array<{
    name: string;
    label: string;
    [propName: string]: any;
  }>;
  searchPlaceholder?: string;
  noResultsText?: string;
  onChange?: (value: Array<Option>, optionModified?: boolean) => void;
  onSearch?: (
    term: string,
    setCancel: (cancel: () => void) => void
  ) => Promise<Options | void>;

  // 自定义选择框相关
  selectRender?: (
    props: Omit<TransferProps, 'onSearch'> & {
      onSearch: (text: string) => void;
      onSearchCancel: () => void;
      searchResult: Options | null;
    }
  ) => JSX.Element;

  resultTitle?: string;
  // 结果提示语
  resultListModeFollowSelect?: boolean;
  resultSearchPlaceholder?: string;
  optionItemRender?: (option: Option, states: ItemRenderStates) => JSX.Element;
  resultItemRender?: (
    option: Option,
    states: ResultItemRenderStates
  ) => JSX.Element;
  resultSearchable?: boolean;
  onResultSearch?: (text: string, item: Option) => boolean;
  sortable?: boolean;
  onRef?: (ref: Transfer) => void;
  onSelectAll?: (options: Options) => void;
  itemHeight?: number; // 每个选项的高度，主要用于虚拟渲染
  virtualThreshold?: number; // 数据量多大的时候开启虚拟渲染`
  virtualListHeight?: number; // 虚拟渲染时，列表高度
}

export interface TransferState {
  inputValue: string;
  searchResult: Options | null;
  isTreeDeferLoad: boolean;
  resultSelectMode: 'list' | 'tree' | 'table';
}

export class Transfer<
  T extends TransferProps = TransferProps
> extends React.Component<T, TransferState> {
  static defaultProps: Pick<
    TransferProps,
    | 'multiple'
    | 'resultListModeFollowSelect'
    | 'selectMode'
    | 'statistics'
    | 'virtualThreshold'
  > = {
    multiple: true,
    resultListModeFollowSelect: false,
    selectMode: 'list',
    statistics: true,
    virtualThreshold: 100
  };

  state: TransferState = {
    inputValue: '',
    searchResult: null,
    isTreeDeferLoad: false,
    resultSelectMode: 'list'
  };

  valueArray: Options;
  availableOptions: Options;
  unmounted = false;
  cancelSearch?: () => void;
  treeRef: any;

  componentDidMount() {
    this.props?.onRef?.(this);
  }

  static getDerivedStateFromProps(props: TransferProps) {
    // 计算是否是懒加载模式
    let isTreeDeferLoad: boolean = false;
    props.selectMode === 'tree' &&
      props.options.forEach(item => {
        if (item.defer) {
          isTreeDeferLoad = true;
        }
      });

    // 计算结果的selectMode
    let resultSelectMode = 'list';
    if (
      props.selectMode === 'tree' &&
      props.resultListModeFollowSelect &&
      !isTreeDeferLoad
    ) {
      resultSelectMode = 'tree';
    }

    if (props.selectMode === 'table' && props.resultListModeFollowSelect) {
      resultSelectMode = 'table';
    }

    return {
      isTreeDeferLoad,
      resultSelectMode
    };
  }

  componentWillUnmount() {
    this.lazySearch.cancel();
    this.unmounted = true;
  }

  @autobind
  domRef(ref: any) {
    this.treeRef = ref;
  }

  @autobind
  toggleAll() {
    const {options, option2value, onChange, value, onSelectAll} = this.props;
    let valueArray = BaseSelection.value2array(value, options, option2value);
    const availableOptions = this.availableOptions;

    // availableOptions 中选项是否都被选中了
    const isAvailableOptionsAllSelected =
      intersectionWith(availableOptions, valueArray, isEqual).length ===
      availableOptions.length;
    // 全不选
    if (isAvailableOptionsAllSelected) {
      valueArray = differenceWith(valueArray, availableOptions, isEqual);
    }
    // 全选
    else {
      valueArray = unionWith(valueArray, availableOptions, isEqual);
    }

    let newValue: string | Options = option2value
      ? valueArray.map(item => option2value(item))
      : valueArray;

    isAvailableOptionsAllSelected || onSelectAll?.(newValue);

    onChange?.(newValue);
  }

  // 全选，给予动作全选使用
  selectAll() {
    const {options, option2value, onChange} = this.props;
    const availableOptions = flattenTree(options).filter(
      (option, index, list) =>
        !option.disabled &&
        option.value !== void 0 &&
        list.indexOf(option) === index
    );
    let newValue: string | Options = option2value
      ? availableOptions.map(item => option2value(item))
      : availableOptions;
    onChange?.(newValue);
  }

  @autobind
  clearAll() {
    const {onChange} = this.props;
    onChange && onChange([]);
  }

  @autobind
  handleSearchKeyDown(e: React.KeyboardEvent<any>) {
    if (e.key === 'Enter') {
      e.preventDefault();
    }
  }

  @autobind
  handleSearch(inputValue: string) {
    // text 有值的时候，走搜索否则直接走 handleSeachCancel ，等同于右侧的 clear 按钮
    this.setState({inputValue}, () => {
      if (inputValue) {
        // 如果有取消搜索，先取消掉。
        this.cancelSearch && this.cancelSearch();
        this.lazySearch();
      } else {
        this.handleSeachCancel();
      }
    });
  }

  @autobind
  handleSeachCancel() {
    this.setState({
      inputValue: '',
      searchResult: null
    });
  }

  lazySearch = debounce(
    async () => {
      const {inputValue} = this.state;
      if (!inputValue) {
        return;
      }
      const onSearch = this.props.onSearch!;
      let result = await onSearch(
        inputValue,
        (cancelExecutor: () => void) => (this.cancelSearch = cancelExecutor)
      );

      if (this.unmounted) {
        return;
      }

      if (!Array.isArray(result)) {
        throw new Error('onSearch 需要返回数组');
      }

      this.setState({
        searchResult: result
      });
    },
    250,
    {trailing: true, leading: false}
  );

  getFlattenArr(options: Array<Option>) {
    return flattenTree(options).filter(
      (option, index, list) =>
        !option.disabled &&
        option.value !== void 0 &&
        list.indexOf(option) === index
    );
  }

  // 树搜索处理
  @autobind
  handleSearchTreeChange(values: Array<Option>, searchOptions: Array<Option>) {
    const {onChange, value} = this.props;
    const searchAvailableOptions = this.getFlattenArr(searchOptions);

    const useArr = intersectionWith(
      searchAvailableOptions,
      values,
      (a, b) => a.value === b.value
    );
    const unuseArr = differenceWith(
      searchAvailableOptions,
      values,
      (a, b) => a.value === b.value
    );

    const newArr: Array<Option> = [];
    Array.isArray(value) &&
      value.forEach((item: Option) => {
        if (!unuseArr.find(v => v.value === item.value)) {
          newArr.push(item);
        }
      });
    useArr.forEach(item => {
      if (!newArr.find(v => v.value === item.value)) {
        newArr.push(item);
      }
    });

    onChange && onChange(newArr);
  }

  renderSelect(
    props: TransferProps & {
      onToggleAll?: () => void;
    }
  ) {
    const {
      selectRender,
      selectMode,
      classnames: cx,
      selectTitle,
      onSearch,
      disabled,
      options,
      statistics,
      translate: __,
      searchPlaceholder = __('Transfer.searchKeyword')
    } = props;

    if (selectRender) {
      return selectRender({
        ...props,
        onSearch: this.handleSearch,
        onSearchCancel: this.handleSeachCancel,
        searchResult: this.state.searchResult
      });
    }

    let checkedPartial = false;
    let checkedAll = false;

    checkedAll = this.availableOptions.every(
      option => this.valueArray.indexOf(option) > -1
    );
    checkedPartial = this.availableOptions.some(
      option => this.valueArray.indexOf(option) > -1
    );

    // 不在当前 availableOptions 中的已选项 数量
    const selectedNotInAvailableOptions = differenceWith(
      this.valueArray,
      this.availableOptions,
      isEqual
    ).length;

    return (
      <>
        <div
          className={cx(
            'Transfer-title',
            selectMode === 'table' ? 'Transfer-title--light' : ''
          )}
        >
          <span>
            {includes(['list', 'tree'], selectMode) ? (
              <Checkbox
                checked={checkedPartial}
                partial={checkedPartial && !checkedAll}
                onChange={props.onToggleAll || this.toggleAll}
                size="sm"
              />
            ) : null}
            {__(selectTitle || 'Transfer.available')}
            {statistics !== false ? (
              <span>
                （
                {this.availableOptions.length -
                  this.valueArray.length +
                  selectedNotInAvailableOptions}
                /{this.availableOptions.length}）
              </span>
            ) : null}
          </span>
          {includes(['chained', 'associated'], selectMode) ? (
            <a
              onClick={props.onToggleAll || this.toggleAll}
              className={cx(
                'Transfer-checkAll',
                disabled || !options.length ? 'is-disabled' : ''
              )}
            >
              {__('Select.checkAll')}
            </a>
          ) : null}
        </div>

        {onSearch ? (
          <div className={cx('Transfer-search')}>
            <InputBox
              value={this.state.inputValue}
              onChange={this.handleSearch}
              clearable={false}
              onKeyDown={this.handleSearchKeyDown}
              placeholder={searchPlaceholder}
            >
              {this.state.searchResult !== null ? (
                <a onClick={this.handleSeachCancel}>
                  <Icon icon="close" className="icon" />
                </a>
              ) : (
                <Icon icon="search" className="icon" />
              )}
            </InputBox>
          </div>
        ) : null}

        {this.state.searchResult !== null
          ? this.renderSearchResult(props)
          : this.renderOptions(props)}
      </>
    );
  }

  renderSearchResult(props: TransferProps) {
    const {
      searchResultMode,
      selectMode,
      noResultsText,
      searchResultColumns,
      columns,
      classnames: cx,
      value,
      disabled,
      onChange,
      option2value,
      optionItemRender,
      cellRender,
      multiple,
      labelField,
      virtualThreshold,
      itemHeight,
      virtualListHeight
    } = props;
    const {isTreeDeferLoad, searchResult} = this.state;
    const options = searchResult ?? [];
    const mode = searchResultMode || selectMode;
    const resultColumns = searchResultColumns || columns;

    return mode === 'table' ? (
      <TableSelection
        placeholder={noResultsText}
        className={cx('Transfer-selection')}
        columns={resultColumns!}
        options={options}
        value={value}
        disabled={disabled}
        onChange={onChange}
        option2value={option2value}
        cellRender={cellRender}
        itemRender={optionItemRender}
        multiple={multiple}
        virtualThreshold={virtualThreshold}
        itemHeight={itemHeight}
        virtualListHeight={virtualListHeight}
      />
    ) : mode === 'tree' ? (
      <Tree
        onRef={this.domRef}
        placeholder={noResultsText}
        className={cx('Transfer-selection')}
        options={options}
        value={value}
        disabled={disabled}
        onChange={(value: Array<any>) =>
          this.handleSearchTreeChange(value, options)
        }
        joinValues={false}
        showIcon={false}
        multiple={multiple}
        cascade={true}
        onlyChildren={!isTreeDeferLoad}
        itemRender={optionItemRender}
        labelField={labelField}
        virtualThreshold={virtualThreshold}
        itemHeight={itemHeight}
      />
    ) : mode === 'chained' ? (
      <ChainedSelection
        placeholder={noResultsText}
        className={cx('Transfer-selection')}
        options={options}
        value={value}
        disabled={disabled}
        onChange={onChange}
        option2value={option2value}
        itemRender={optionItemRender}
        multiple={multiple}
        labelField={labelField}
        virtualThreshold={virtualThreshold}
        itemHeight={itemHeight}
        virtualListHeight={virtualListHeight}
      />
    ) : (
      <GroupedSelection
        placeholder={noResultsText}
        className={cx('Transfer-selection')}
        options={options}
        value={value}
        disabled={disabled}
        onChange={onChange}
        option2value={option2value}
        itemRender={optionItemRender}
        multiple={multiple}
        labelField={labelField}
        virtualThreshold={virtualThreshold}
        itemHeight={itemHeight}
        virtualListHeight={virtualListHeight}
      />
    );
  }

  renderOptions(props: TransferProps) {
    const {
      selectMode,
      columns,
      options,
      value,
      disabled,
      onChange,
      option2value,
      classnames: cx,
      onDeferLoad,
      leftOptions,
      leftMode,
      rightMode,
      cellRender,
      leftDefaultValue,
      optionItemRender,
      multiple,
      noResultsText,
      labelField,
      virtualThreshold,
      itemHeight,
      virtualListHeight
    } = props;

    return selectMode === 'table' ? (
      <TableSelection
        className={cx('Transfer-selection')}
        columns={columns!}
        options={options || []}
        value={value}
        disabled={disabled}
        onChange={onChange}
        option2value={option2value}
        onDeferLoad={onDeferLoad}
        cellRender={cellRender}
        multiple={multiple}
        virtualThreshold={virtualThreshold}
        itemHeight={itemHeight}
        virtualListHeight={virtualListHeight}
      />
    ) : selectMode === 'tree' ? (
      <Tree
        onRef={this.domRef}
        placeholder={noResultsText}
        className={cx('Transfer-selection')}
        options={options}
        value={value}
        onChange={onChange!}
        onlyChildren={!this.state.isTreeDeferLoad}
        itemRender={optionItemRender}
        onDeferLoad={onDeferLoad}
        joinValues={false}
        showIcon={false}
        multiple={multiple}
        cascade={true}
        labelField={labelField}
        virtualThreshold={virtualThreshold}
        itemHeight={itemHeight}
      />
    ) : selectMode === 'chained' ? (
      <ChainedSelection
        className={cx('Transfer-selection')}
        options={options || []}
        value={value}
        disabled={disabled}
        onChange={onChange}
        option2value={option2value}
        onDeferLoad={onDeferLoad}
        itemRender={optionItemRender}
        multiple={multiple}
        labelField={labelField}
        virtualThreshold={virtualThreshold}
        itemHeight={itemHeight}
        virtualListHeight={virtualListHeight}
      />
    ) : selectMode === 'associated' ? (
      <AssociatedSelection
        className={cx('Transfer-selection')}
        options={options || []}
        value={value}
        disabled={disabled}
        onChange={onChange}
        option2value={option2value}
        onDeferLoad={onDeferLoad}
        columns={columns}
        leftOptions={leftOptions || []}
        leftMode={leftMode}
        rightMode={rightMode}
        leftDefaultValue={leftDefaultValue}
        itemRender={optionItemRender}
        multiple={multiple}
        labelField={labelField}
        virtualThreshold={virtualThreshold}
        itemHeight={itemHeight}
        virtualListHeight={virtualListHeight}
      />
    ) : (
      <GroupedSelection
        className={cx('Transfer-selection')}
        options={options || []}
        value={value}
        disabled={disabled}
        onChange={onChange}
        option2value={option2value}
        onDeferLoad={onDeferLoad}
        itemRender={optionItemRender}
        multiple={multiple}
        labelField={labelField}
        virtualThreshold={virtualThreshold}
        itemHeight={itemHeight}
        virtualListHeight={virtualListHeight}
      />
    );
  }

  renderResult() {
    const {
      columns,
      options,
      disabled,
      option2value,
      classnames: cx,
      cellRender,
      onChange,
      value,
      resultItemRender,
      resultSearchable,
      resultSearchPlaceholder,
      onResultSearch,
      sortable,
      labelField,
      translate: __,
      placeholder = __('Transfer.selectFromLeft'),
      virtualThreshold,
      itemHeight
    } = this.props;

    const {resultSelectMode, isTreeDeferLoad} = this.state;
    const searchable = !isTreeDeferLoad && resultSearchable;

    switch (resultSelectMode) {
      case 'table':
        return (
          <ResultTableList
            classnames={cx}
            columns={columns!}
            options={options || []}
            value={value}
            disabled={disabled}
            option2value={option2value}
            cellRender={cellRender}
            onChange={onChange}
            multiple={false}
            searchable={searchable}
            placeholder={placeholder}
            searchPlaceholder={resultSearchPlaceholder}
            onSearch={onResultSearch}
            virtualThreshold={virtualThreshold}
            itemHeight={itemHeight}
          />
        );
      case 'tree':
        return (
          <ResultTreeList
            classnames={cx}
            className={cx('Transfer-value')}
            options={options}
            valueField={'value'}
            value={value || []}
            onChange={onChange!}
            itemRender={resultItemRender}
            searchable={searchable}
            placeholder={placeholder}
            searchPlaceholder={resultSearchPlaceholder}
            onSearch={onResultSearch}
            labelField={labelField}
            virtualThreshold={virtualThreshold}
            itemHeight={itemHeight}
          />
        );
      default:
        return (
          <ResultList
            className={cx('Transfer-value')}
            sortable={sortable}
            disabled={disabled}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            searchPlaceholder={resultSearchPlaceholder}
            itemRender={resultItemRender}
            searchable={searchable}
            onSearch={onResultSearch}
            labelField={labelField}
            virtualThreshold={virtualThreshold}
            itemHeight={itemHeight}
          />
        );
    }
  }

  render() {
    const {
      inline,
      classnames: cx,
      className,
      value,
      resultTitle,
      options,
      option2value,
      disabled,
      statistics,
      showArrow,
      resultListModeFollowSelect,
      selectMode = 'list',
      translate: __
    } = this.props;
    const {searchResult} = this.state;

    this.valueArray = BaseSelection.value2array(value, options, option2value);

    this.availableOptions = flattenTree(searchResult ?? options).filter(
      (option, index, list) =>
        !option.disabled &&
        option.value !== void 0 &&
        list.indexOf(option) === index
    );

    const tableType = resultListModeFollowSelect && selectMode === 'table';

    return (
      <div
        className={cx('Transfer', className, inline ? 'Transfer--inline' : '')}
      >
        <div className={cx('Transfer-select')}>
          {this.renderSelect(this.props)}
        </div>
        <div className={cx('Transfer-mid')}>
          {showArrow /*todo 需要改成确认模式，即：点了按钮才到右边 */ ? (
            <div className={cx('Transfer-arrow')}>
              <Icon icon="right-arrow" className="icon" />
            </div>
          ) : null}
        </div>
        <div className={cx('Transfer-result')}>
          <div
            className={cx(
              'Transfer-title',
              tableType ? 'Transfer-table-title' : '',
              selectMode === 'table' ? 'Transfer-title--light' : ''
            )}
          >
            <span>
              {__(resultTitle || 'Transfer.selectd')}
              {statistics !== false ? (
                <span>（{this.valueArray.length}）</span>
              ) : null}
            </span>
            <a
              onClick={this.clearAll}
              className={cx(
                'Transfer-clearAll',
                disabled || !this.valueArray.length ? 'is-disabled' : ''
              )}
            >
              {__('clear')}
            </a>
          </div>
          {this.renderResult()}
        </div>
      </div>
    );
  }
}

export default themeable(
  localeable(
    uncontrollable(class extends Transfer {}, {
      value: 'onChange'
    })
  )
);
