import React from 'react';
import {ThemeProps, themeable} from '../theme';
import {BaseSelectionProps, BaseSelection, ItemRenderStates} from './Selection';
import {Options, Option} from './Select';
import {uncontrollable} from 'uncontrollable';
import ResultList from './ResultList';
import TableSelection from './TableSelection';
import TreeSelection from './TreeSelection';
import {autobind, flattenTree} from '../utils/helper';
import InputBox from './InputBox';
import {Icon} from './icons';
import debounce from 'lodash/debounce';
import AssociatedSelection from './AssociatedSelection';
import {LocaleProps, localeable} from '../locale';
import GroupedSelection from './GroupedSelection';
import ChainedSelection from './ChainedSelection';
import {ItemRenderStates as ResultItemRenderStates} from './ResultList';

export interface TransferProps
  extends ThemeProps,
    LocaleProps,
    Omit<BaseSelectionProps, 'itemRender'> {
  inline?: boolean;
  statistics?: boolean;
  showArrow?: boolean;
  multiple?: boolean;

  selectTitle?: string;
  selectMode?: 'table' | 'group' | 'list' | 'tree' | 'chained' | 'associated';
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
  optionItemRender?: (option: Option, states: ItemRenderStates) => JSX.Element;
  resultItemRender?: (
    option: Option,
    states: ResultItemRenderStates
  ) => JSX.Element;
  sortable?: boolean;
  onRef?: (ref: Transfer) => void;
  onSelectAll?: (options: Options) => void;
}

export interface TransferState {
  inputValue: string;
  searchResult: Options | null;
}

export class Transfer<
  T extends TransferProps = TransferProps
> extends React.Component<T, TransferState> {
  static defaultProps: Pick<TransferProps, 'multiple'> = {
    multiple: true
  };

  state = {
    inputValue: '',
    searchResult: null
  };

  valueArray: Options;
  availableOptions: Options;
  unmounted = false;
  cancelSearch?: () => void;

  componentDidMount() {
    this.props?.onRef?.(this);
  }

  componentWillUnmount() {
    this.lazySearch.cancel();
    this.unmounted = true;
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
    const {options, option2value, onChange} = this.props;;
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
  handleSearch(text: string) {
    // text 有值的时候，走搜索否则直接走 handleSeachCancel ，等同于右侧的 clear 按钮
    if (text) {
      this.setState(
        {
          inputValue: text
        },
        () => {
          // 如果有取消搜索，先取消掉。
          this.cancelSearch && this.cancelSearch();
          this.lazySearch(text);
        }
      );
    } else {
      this.handleSeachCancel();
    }
  }

  @autobind
  handleSeachCancel() {
    this.setState({
      inputValue: '',
      searchResult: null
    });
  }

  lazySearch = debounce(
    (text: string) => {
      (async (text: string) => {
        const onSearch = this.props.onSearch!;
        let result = await onSearch(
          text,
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
      })(text).catch(e => console.error(e));
    },
    250,
    {
      trailing: true,
      leading: false
    }
  );

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
      translate: __
    } = props;

    if (selectRender) {
      return selectRender({
        ...props,
        onSearch: this.handleSearch,
        onSearchCancel: this.handleSeachCancel,
        searchResult: this.state.searchResult
      });
    }

    return (
      <>
        <div
          className={cx(
            'Transfer-title',
            selectMode === 'table' ? 'Transfer-title--light' : ''
          )}
        >
          <span>
            {__(selectTitle || 'Transfer.available')}
            {statistics !== false ? (
              <span>
                （{this.valueArray.length}/{this.availableOptions.length}）
              </span>
            ) : null}
          </span>
          {selectMode !== 'table' ? (
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
              placeholder={__('Transfer.searchKeyword')}
              clearable={false}
              onKeyDown={this.handleSearchKeyDown}
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
    const options = this.state.searchResult || [];
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
      <TreeSelection
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
      multiple
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
      <TreeSelection
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

  render() {
    const {
      inline,
      classnames: cx,
      className,
      value,
      onChange,
      resultTitle,
      sortable,
      options,
      option2value,
      disabled,
      statistics,
      showArrow,
      resultItemRender,
      translate: __
    } = this.props;

    this.valueArray = BaseSelection.value2array(value, options, option2value);
    this.availableOptions = flattenTree(options).filter(
      (option, index, list) =>
        !option.disabled &&
        option.value !== void 0 &&
        list.indexOf(option) === index
    );

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
          <div className={cx('Transfer-title')}>
            <span>
              {__(resultTitle || 'Transfer.selectd')}
              {statistics !== false ? (
                <span>
                  （{this.valueArray.length}/{this.availableOptions.length}）
                </span>
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
          <ResultList
            className={cx('Transfer-value')}
            sortable={sortable}
            disabled={disabled}
            value={value}
            onChange={onChange}
            placeholder={__('Transfer.selectFromLeft')}
            itemRender={resultItemRender}
          />
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
