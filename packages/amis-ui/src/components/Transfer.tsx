import React from 'react';
import intersectionWith from 'lodash/intersectionWith';
import includes from 'lodash/includes';
import debounce from 'lodash/debounce';
import isEqual from 'lodash/isEqual';
import unionWith from 'lodash/unionWith';
import {ThemeProps, themeable, findTree, differenceFromAll} from 'amis-core';
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
import {SpinnerExtraProps} from './Spinner';
import Pagination from './Pagination';

import type {TestIdBuilder} from 'amis-core';

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
    SpinnerExtraProps,
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
  maxTagCount?: number;
  overflowTagPopover?: any;

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
    setCancel: (cancel: () => void) => void,
    targetPage?: {page: number; perPage?: number}
  ) => Promise<{
    items: Options;
    page?: number;
    perPage?: number;
    total?: number;
  } | void>;

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
  showInvalidMatch?: boolean;
  checkAll?: boolean;
  checkAllLabel?: string;
  /** 树形模式下，给 tree 的属性 */
  onlyChildren?: boolean;
  /** 分页模式下累积的选项值，用于右侧回显 */
  accumulatedOptions?: Option[];
  /** 分页配置 */
  pagination?: {
    /** 是否开启分页 */
    enable: boolean;
    /** 分页组件CSS类名 */
    className?: string;
    /**
     * 通过控制layout属性的顺序，调整分页结构 total,perPage,pager,go
     * @default 'pager'
     */
    layout?: string | Array<string>;

    /**
     * 指定每页可以显示多少条
     * @default [10, 20, 50, 100]
     */
    perPageAvailable?: Array<number>;

    /**
     * 最多显示多少个分页按钮。
     *
     * @default 5
     */
    maxButtons?: number;
    page?: number;
    perPage?: number;
    total?: number;
    popOverContainer?: any;
    popOverContainerSelector?: string;
  };
  /** 切换分页事件 */
  onPageChange?: (
    page: number,
    perPage?: number,
    direction?: 'forward' | 'backward'
  ) => void;
  /**
   * 是否默认都展开
   */
  initiallyOpen?: boolean;
  /**
   * ui级联关系，true代表级联选中，false代表不级联，默认为true
   */
  autoCheckChildren?: boolean;
  testIdBuilder?: TestIdBuilder;
}

export interface TransferState {
  tempValue?: Array<Option> | Option;
  inputValue: string;
  searchResult: Options | null;
  searchResultPage?: {page?: number; perPage?: number; total?: number} | null;
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
    | 'checkAllLabel'
    | 'itemHeight'
    | 'valueField'
  > = {
    multiple: true,
    resultListModeFollowSelect: false,
    selectMode: 'list',
    statistics: true,
    virtualThreshold: 100,
    itemHeight: 38,
    checkAllLabel: 'Select.checkAll',
    valueField: 'value'
  };

  state: TransferState = {
    inputValue: '',
    searchResult: null,
    searchResultPage: null,
    isTreeDeferLoad: false,
    resultSelectMode: 'list'
  };

  valueArray: Options;
  availableOptions: Options;
  unmounted = false;
  cancelSearch?: () => void;
  treeRef: any;
  resultRef: any;

  componentDidMount() {
    this.props?.onRef?.(this);
  }

  static getDerivedStateFromProps(props: TransferProps) {
    // 计算是否是懒加载模式
    const isTreeDeferLoad =
      props.selectMode === 'tree' &&
      !!findTree(
        props.options,
        (option: Option) =>
          option.deferApi || option[(props.deferField as string) || 'defer']
      );

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
    while (ref && ref.getWrappedInstance) {
      ref = ref.getWrappedInstance();
    }
    this.treeRef = ref;
  }

  @autobind
  domResultRef(ref: any) {
    while (ref && ref.getWrappedInstance) {
      ref = ref.getWrappedInstance();
    }
    this.resultRef = ref;
  }

  @autobind
  toggleAll() {
    const {
      options,
      option2value,
      onChange,
      value,
      onSelectAll,
      valueField = 'value',
      selectMode
    } = this.props;
    let valueArray = BaseSelection.value2array(
      value,
      options,
      option2value,
      valueField
    );
    const availableOptions = this.availableOptions;

    if (selectMode === 'tree') {
      this.treeRef?.handleToggle();
      return;
    }

    // availableOptions 中选项是否都被选中了
    // to do intersectionWith 需要优化，大数据会卡死
    const isAvailableOptionsAllSelected =
      intersectionWith(availableOptions, valueArray, isEqual).length ===
      availableOptions.length;
    // 全不选
    if (isAvailableOptionsAllSelected) {
      valueArray = differenceFromAll(
        availableOptions,
        valueArray,
        item => item[valueField]
      );
    }
    // 全选
    else {
      // to do 需要优化
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
    const {
      options,
      option2value,
      onChange,
      valueField = 'value',
      selectMode
    } = this.props;
    if (selectMode === 'tree') {
      this.treeRef?.handleToggle(true);
      return;
    }
    const availableOptions = flattenTree(options).filter(
      (option, index, list) =>
        !option.disabled &&
        option[valueField] !== void 0 &&
        list.indexOf(option) === index
    );
    let newValue: string | Options = option2value
      ? availableOptions.map(item => option2value(item))
      : availableOptions;
    onChange?.(newValue);
  }

  // 清空搜索
  clearSearch(target?: {left?: boolean; right?: boolean}) {
    if (!target) {
      this.handleSeachCancel();
      this.resultRef?.clearInput();
    }
    if (target?.left) {
      this.handleSeachCancel();
    }
    if (target?.right) {
      this.resultRef?.clearInput();
    }
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
      searchResult: null,
      searchResultPage: null
    });
  }

  lazySearch = debounce(this.searchRequest, 250, {
    trailing: true,
    leading: false
  });

  @autobind
  async searchRequest(page?: number, perPage?: number) {
    const {pagination} = this.props;
    const {inputValue} = this.state;
    if (!inputValue) {
      return;
    }

    const onSearch = this.props.onSearch!;
    let result = await onSearch(
      inputValue,
      (cancelExecutor: () => void) => (this.cancelSearch = cancelExecutor),
      this.props.pagination?.enable
        ? {page: page || 1, perPage: perPage || pagination?.perPage || 10}
        : undefined
    );

    if (this.unmounted) {
      return;
    }

    if (result) {
      const {items, ...currentPage} = result;

      if (!Array.isArray(items)) {
        throw new Error('onSearch 需要返回数组');
      }

      this.setState({
        searchResult: items,
        searchResultPage: {...currentPage}
      });
    }
  }

  getFlattenArr(options: Array<Option>) {
    const {valueField = 'value'} = this.props;
    return flattenTree(options).filter(
      (option, index, list) =>
        !option.disabled &&
        option[valueField] !== void 0 &&
        list.indexOf(option) === index
    );
  }

  // 树搜索处理
  @autobind
  handleSearchTreeChange(
    values: Array<Option>,
    searchOptions: Array<Option>,
    props: TransferProps
  ) {
    /** TransferDropDown的renderSearchResult&renderOptions中对一些属性覆写了  */
    const {value, valueField = 'value', multiple, onChange} = props;
    const searchAvailableOptions = this.getFlattenArr(searchOptions);
    values = Array.isArray(values) ? values : values ? [values] : [];

    const useArr = intersectionWith(
      searchAvailableOptions,
      values,
      (a, b) => a[valueField] === b[valueField]
    );
    const unuseArr = differenceFromAll(
      values,
      searchAvailableOptions,
      item => item[valueField]
    );

    const newArr: Array<Option> = [];
    if (multiple) {
      Array.isArray(value) &&
        value.forEach((item: Option) => {
          if (!unuseArr.find(v => v[valueField] === item[valueField])) {
            newArr.push(item);
          }
        });
    }
    useArr.forEach(item => {
      if (!newArr.find(v => v[valueField] === item[valueField])) {
        newArr.push(item);
      }
    });

    onChange && onChange(newArr);
  }

  @autobind
  optionItemRender(option: Option, states: ItemRenderStates) {
    const {optionItemRender, labelField = 'label', classnames} = this.props;
    return optionItemRender
      ? optionItemRender(option, states)
      : BaseSelection.itemRender(option, {labelField, ...states, classnames});
  }

  @autobind
  resultItemRender(option: Option, states: ItemRenderStates) {
    const {resultItemRender, classnames} = this.props;
    return resultItemRender
      ? resultItemRender(option, states)
      : ResultList.itemRender(option, {
          ...states,
          classnames
        });
  }

  @autobind
  onPageChangeHandle(
    page: number,
    perPage?: number,
    direction?: 'forward' | 'backward'
  ) {
    const {onPageChange, onSearch} = this.props;
    const {searchResult, inputValue} = this.state;

    if (searchResult) {
      this.searchRequest(page, perPage);
    } else if (onPageChange) {
      onPageChange(page, perPage, direction);
    }
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
      searchPlaceholder = __('Transfer.searchKeyword'),
      mobileUI,
      valueField = 'value',
      testIdBuilder
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

    const valueArraySet = new Set(this.valueArray);
    checkedAll = this.availableOptions.every(option =>
      valueArraySet.has(option)
    );
    checkedPartial = this.availableOptions.some(option =>
      valueArraySet.has(option)
    );

    // 不在当前 availableOptions 中的已选项 数量
    const selectedNotInAvailableOptions = differenceFromAll(
      this.availableOptions,
      this.valueArray,
      item => item[valueField]
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
                testIdBuilder={testIdBuilder?.getChild('toggle-all')}
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
              {...testIdBuilder?.getChild('toggle-all').getTestId()}
            >
              {__('Select.checkAll')}
            </a>
          ) : null}
        </div>

        {onSearch ? (
          <div className={cx('Transfer-search', {'is-mobile': mobileUI})}>
            <InputBox
              value={this.state.inputValue}
              onChange={this.handleSearch}
              clearable={false}
              onKeyDown={this.handleSearchKeyDown}
              placeholder={searchPlaceholder}
              mobileUI={mobileUI}
              testIdBuilder={testIdBuilder?.getChild('search-input')}
            >
              {this.state.searchResult !== null ? (
                <a
                  onClick={this.handleSeachCancel}
                  {...testIdBuilder?.getChild('search-cancel').getTestId()}
                >
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

        {this.renderFooter()}
      </>
    );
  }

  renderFooter() {
    const {classnames: cx, pagination} = this.props;
    const {searchResult, searchResultPage} = this.state;

    if (!pagination || !pagination?.enable) {
      return null;
    }

    const currentPage =
      searchResult && searchResultPage
        ? {
            page: searchResultPage.page,
            perPage: searchResultPage.perPage,
            total: searchResultPage.total
          }
        : {
            page: pagination.page,
            perPage: pagination.perPage,
            total: pagination.total
          };

    return (
      <div className={cx('Transfer-footer')}>
        <Pagination
          className={cx('Transfer-footer-pagination', pagination.className)}
          activePage={currentPage.page}
          perPage={currentPage.perPage}
          total={currentPage.total}
          layout={pagination.layout}
          maxButtons={pagination.maxButtons}
          perPageAvailable={pagination.perPageAvailable}
          popOverContainer={pagination.popOverContainer}
          popOverContainerSelector={pagination.popOverContainerSelector}
          onPageChange={this.onPageChangeHandle}
        />
      </div>
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
      valueField = 'value',
      virtualThreshold,
      itemHeight,
      virtualListHeight,
      checkAll,
      checkAllLabel,
      onlyChildren,
      autoCheckChildren,
      testIdBuilder
    } = props;
    const {isTreeDeferLoad, searchResult, inputValue} = this.state;
    const options = searchResult ?? [];
    const mode = searchResultMode || selectMode;
    const resultColumns = searchResultColumns || columns;

    const treeItemRender =
      !searchResult || optionItemRender ? this.optionItemRender : undefined;
    const highlightTxt = searchResult ? inputValue : undefined;

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
        itemRender={this.optionItemRender}
        valueField={valueField}
        multiple={multiple}
        virtualThreshold={virtualThreshold}
        itemHeight={itemHeight}
        virtualListHeight={virtualListHeight}
        testIdBuilder={testIdBuilder?.getChild('search-result')}
      />
    ) : mode === 'tree' ? (
      <Tree
        ref={this.domRef}
        placeholder={noResultsText}
        className={cx('Transfer-selection')}
        options={options}
        value={value}
        disabled={disabled}
        onChange={(value: Array<any>) =>
          this.handleSearchTreeChange(value, options, props)
        }
        joinValues={false}
        showIcon={false}
        multiple={multiple}
        cascade={true}
        onlyChildren={onlyChildren ?? !isTreeDeferLoad}
        highlightTxt={highlightTxt}
        itemRender={treeItemRender}
        labelField={labelField}
        valueField={valueField}
        virtualThreshold={virtualThreshold}
        // itemHeight={itemHeight}
        checkAllLabel={checkAllLabel}
        checkAll={checkAll}
        autoCheckChildren={autoCheckChildren}
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
        itemRender={this.optionItemRender}
        multiple={multiple}
        labelField={labelField}
        valueField={valueField}
        virtualThreshold={virtualThreshold}
        itemHeight={itemHeight}
        virtualListHeight={virtualListHeight}
        checkAllLabel={checkAllLabel}
        checkAll={checkAll}
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
        itemRender={this.optionItemRender}
        multiple={multiple}
        labelField={labelField}
        valueField={valueField}
        virtualThreshold={virtualThreshold}
        itemHeight={itemHeight}
        virtualListHeight={virtualListHeight}
        checkAllLabel={checkAllLabel}
        checkAll={checkAll}
        testIdBuilder={testIdBuilder?.getChild('search-result')}
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
      multiple,
      noResultsText,
      labelField,
      valueField = 'value',
      deferField = 'defer',
      virtualThreshold,
      itemHeight,
      virtualListHeight,
      loadingConfig,
      checkAll,
      checkAllLabel,
      onlyChildren,
      autoCheckChildren = true,
      initiallyOpen = true,
      testIdBuilder
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
        checkAllLabel={checkAllLabel}
        checkAll={checkAll}
        testIdBuilder={testIdBuilder?.getChild('selection')}
      />
    ) : selectMode === 'tree' ? (
      <Tree
        ref={this.domRef}
        placeholder={noResultsText}
        className={cx('Transfer-selection')}
        options={options}
        value={value}
        onChange={onChange!}
        onlyChildren={onlyChildren ?? !this.state.isTreeDeferLoad}
        itemRender={this.optionItemRender}
        onDeferLoad={onDeferLoad}
        joinValues={false}
        showIcon={false}
        multiple={multiple}
        cascade={true}
        labelField={labelField}
        valueField={valueField}
        virtualThreshold={virtualThreshold}
        // itemHeight={itemHeight}
        loadingConfig={loadingConfig}
        checkAllLabel={checkAllLabel}
        checkAll={checkAll}
        initiallyOpen={initiallyOpen}
        autoCheckChildren={autoCheckChildren}
        testIdBuilder={testIdBuilder?.getChild('selection')}
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
        itemRender={this.optionItemRender}
        multiple={multiple}
        labelField={labelField}
        valueField={valueField}
        virtualThreshold={virtualThreshold}
        itemHeight={itemHeight}
        virtualListHeight={virtualListHeight}
        loadingConfig={loadingConfig}
        checkAllLabel={checkAllLabel}
        checkAll={checkAll}
        testIdBuilder={testIdBuilder?.getChild('selection')}
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
        itemRender={this.optionItemRender}
        multiple={multiple}
        labelField={labelField}
        valueField={valueField}
        deferField={deferField}
        virtualThreshold={virtualThreshold}
        itemHeight={itemHeight}
        virtualListHeight={virtualListHeight}
        loadingConfig={loadingConfig}
        checkAllLabel={checkAllLabel}
        checkAll={checkAll}
        testIdBuilder={testIdBuilder?.getChild('selection')}
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
        itemRender={this.optionItemRender}
        multiple={multiple}
        labelField={labelField}
        valueField={valueField}
        virtualThreshold={virtualThreshold}
        itemHeight={itemHeight}
        virtualListHeight={virtualListHeight}
        checkAllLabel={checkAllLabel}
        checkAll={checkAll}
        testIdBuilder={testIdBuilder?.getChild('selection')}
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
      resultSearchable,
      resultSearchPlaceholder,
      onResultSearch,
      sortable,
      labelField,
      translate: __,
      placeholder = __('Transfer.selectFromLeft'),
      virtualThreshold,
      itemHeight,
      loadingConfig,
      showInvalidMatch,
      pagination,
      accumulatedOptions,
      testIdBuilder
    } = this.props;
    const {resultSelectMode, isTreeDeferLoad} = this.state;
    const searchable = !isTreeDeferLoad && resultSearchable;

    switch (resultSelectMode) {
      case 'table':
        return (
          <ResultTableList
            ref={this.domResultRef}
            classnames={cx}
            columns={columns!}
            options={(pagination?.enable ? accumulatedOptions : options) || []}
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
            testIdBuilder={testIdBuilder?.getChild('result')}
          />
        );
      case 'tree':
        return (
          <ResultTreeList
            ref={this.domResultRef}
            loadingConfig={loadingConfig}
            classnames={cx}
            className={cx('Transfer-value')}
            options={(pagination?.enable ? accumulatedOptions : options) || []}
            valueField={'value'}
            value={value || []}
            onChange={onChange!}
            itemRender={this.resultItemRender}
            searchable={searchable}
            placeholder={placeholder}
            searchPlaceholder={resultSearchPlaceholder}
            onSearch={onResultSearch}
            labelField={labelField}
            virtualThreshold={virtualThreshold}
            itemHeight={itemHeight}
            testIdBuilder={testIdBuilder?.getChild('result')}
          />
        );
      default:
        return (
          <ResultList
            ref={this.domResultRef}
            className={cx('Transfer-value')}
            sortable={sortable}
            disabled={disabled}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            searchPlaceholder={resultSearchPlaceholder}
            itemRender={this.resultItemRender}
            searchable={searchable}
            onSearch={onResultSearch}
            labelField={labelField}
            virtualThreshold={virtualThreshold}
            itemHeight={itemHeight}
            showInvalidMatch={showInvalidMatch}
            testIdBuilder={testIdBuilder?.getChild('result')}
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
      translate: __,
      valueField = 'value',
      mobileUI,
      pagination,
      testIdBuilder
    } = this.props as any;
    const {searchResult} = this.state;

    this.valueArray = BaseSelection.value2array(
      value,
      options,
      option2value,
      valueField
    );

    this.availableOptions = flattenTree(searchResult ?? options).filter(
      (option, index, list) =>
        !option.disabled &&
        option[valueField] !== void 0 &&
        list.indexOf(option) === index
    );

    const tableType = resultListModeFollowSelect && selectMode === 'table';

    return (
      <div
        className={cx('Transfer', className, inline ? 'Transfer--inline' : '')}
      >
        <div
          className={cx('Transfer-select', {
            'Transfer-select--pagination': !!pagination?.enable
          })}
        >
          {this.renderSelect(this.props)}
        </div>
        <div className={cx('Transfer-mid', {'is-mobile': mobileUI})}>
          {showArrow /*todo 需要改成确认模式，即：点了按钮才到右边 */ ? (
            <div className={cx('Transfer-arrow')}>
              <Icon icon="right-arrow" className="icon" />
            </div>
          ) : null}
        </div>
        <div
          className={cx('Transfer-result', {
            'is-mobile': mobileUI,
            'Transfer-select--pagination': !!pagination?.enable
          })}
        >
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
              {...testIdBuilder?.getChild('clear-all').getTestId()}
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
