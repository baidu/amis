import React from 'react';
import {intersectionWith, differenceWith, includes, debounce, result} from 'lodash';

import {ThemeProps, themeable} from '../theme';
import {BaseSelectionProps, BaseSelection, ItemRenderStates} from './Selection';
import {Options, Option} from './Select';
import {uncontrollable} from 'uncontrollable';
import ResultList from './ResultList';
import TableSelection from './TableSelection';
import {autobind, flattenTree} from '../utils/helper';
import InputBox from './InputBox';
import Checkbox from './Checkbox';
import Tree from './Tree';
import {Icon} from './icons';
import AssociatedSelection from './AssociatedSelection';
import {LocaleProps, localeable} from '../locale';
import GroupedSelection from './GroupedSelection';
import ChainedSelection from './ChainedSelection';
import {ItemRenderStates as ResultItemRenderStates} from './ResultList';
import ResultTableList from './ResultTableList';
import ResultTreeList from './ResultTreeList';

export type SelectMode =
  'table'
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
}

export interface TransferState {
  inputValue: string;
  searchResult: Options | null;
  isTreeDeferLoad: boolean;
  resultSelectMode: 'list' | 'tree' | 'table'
}

export class Transfer<
  T extends TransferProps = TransferProps
> extends React.Component<T, TransferState> {

  static defaultProps: Pick<
    TransferProps,
    'multiple' | 'resultListModeFollowSelect' | 'selectMode'
  > = {
    multiple: true,
    resultListModeFollowSelect: false,
    selectMode: 'list'
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
    if (props.selectMode === 'tree' && props.resultListModeFollowSelect && !isTreeDeferLoad) {
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
    const availableOptions = flattenTree(options).filter(
      (option, index, list) =>
        !option.disabled &&
        option.value !== void 0 &&
        list.indexOf(option) === index
    );

    if (valueArray.length < availableOptions.length) {
      valueArray = availableOptions;
    } else {
      valueArray = [];
    }

    let newValue: string | Options = option2value
      ? valueArray.map(item => option2value(item))
      : valueArray;

    // > 0 全选。TODO：由于未来可能有逻辑：禁用清空不了，这里判断全选，得完善下
    newValue.length > 0 && onSelectAll?.(newValue);

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
      value.forEach(item => {
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
                （{this.availableOptions.length - this.valueArray.length}/
                {this.availableOptions.length}）
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
      multiple
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
        multiple={true}
        cascade={true}
        onlyChildren={!isTreeDeferLoad}
        itemRender={optionItemRender}
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
      noResultsText
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
        multiple={true}
        cascade={true}
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
      translate: __
    } = this.props;

    const {resultSelectMode, isTreeDeferLoad} = this.state;
    const searchable = !isTreeDeferLoad && resultSearchable;

    const placeholder = resultSearchPlaceholder || __('Transfer.selectFromLeft');

    return resultSelectMode === 'table'
      ? (
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
        onSearch={onResultSearch}
      />)
      : resultSelectMode === 'tree'
      ? (
      <ResultTreeList
        classnames={cx}
        options={options}
        valueField={'value'}
        value={value || []}
        onChange={onChange!}
        itemRender={resultItemRender}
        searchable={searchable}
        placeholder={placeholder}
        onSearch={onResultSearch}
      />
      ): (
      <ResultList
        className={cx('Transfer-value')}
        sortable={sortable}
        disabled={disabled}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        itemRender={resultItemRender}
        columns={columns!}
        options={options || []}
        option2value={option2value}
        cellRender={cellRender}
        searchable={searchable}
        onSearch={onResultSearch}
      />);
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

    this.valueArray = BaseSelection.value2array(value, options, option2value);
    this.availableOptions = flattenTree(options).filter(
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
              tableType ? 'Transfer-table-title' : ''
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
