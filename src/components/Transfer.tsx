import React from 'react';
import {ThemeProps, themeable} from '../theme';
import {BaseCheckboxesProps, BaseCheckboxes} from './Checkboxes';
import {Options, Option} from './Select';
import {uncontrollable} from 'uncontrollable';
import ResultList from './ResultList';
import TableCheckboxes from './TableCheckboxes';
import ListCheckboxes from './ListCheckboxes';
import TreeCheckboxes from './TreeCheckboxes';
import {autobind, flattenTree} from '../utils/helper';
import InputBox from './InputBox';
import {Icon} from './icons';
import debounce from 'lodash/debounce';
import ChainedCheckboxes from './ChainedCheckboxes';
import AssociatedCheckboxes from './AssociatedCheckboxes';
import {LocaleProps, localeable} from '../locale';

export interface TransferProps
  extends ThemeProps,
    LocaleProps,
    BaseCheckboxesProps {
  inline?: boolean;
  statistics?: boolean;
  showArrow?: boolean;

  selectTitle?: string;
  selectMode?: 'table' | 'list' | 'tree' | 'chained' | 'associated';
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
  leftMode?: 'tree' | 'list';
  leftDefaultValue?: any;
  rightMode?: 'table' | 'list' | 'tree' | 'chained';

  // search 相关
  searchResultMode?: 'table' | 'list' | 'tree' | 'chained';
  searchResultColumns?: Array<{
    name: string;
    label: string;
    [propName: string]: any;
  }>;
  searchPlaceholder?: string;
  noResultsText?: string;
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
  optionItemRender?: (option: Option) => JSX.Element;
  resultItemRender?: (option: Option) => JSX.Element;
  sortable?: boolean;
}

export interface TransferState {
  inputValue: string;
  searchResult: Options | null;
}

export class Transfer extends React.Component<TransferProps, TransferState> {
  static defaultProps = {
    itemRender: (option: Option) => <span>{option.label}</span>
  };

  state = {
    inputValue: '',
    searchResult: null
  };

  valueArray: Options;
  availableOptions: Options;
  unmounted = false;
  cancelSearch?: () => void;

  componentWillUnmount() {
    this.lazySearch.cancel();
    this.unmounted = true;
  }

  @autobind
  toggleAll() {
    const {options, option2value, onChange, value} = this.props;
    let valueArray = BaseCheckboxes.value2array(value, options, option2value);
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

    onChange && onChange(newValue);
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

  renderSelect() {
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
    } = this.props;

    if (selectRender) {
      return selectRender({
        ...this.props,
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
            {__(selectTitle || 'Select.placeholder')}
            {statistics !== false ? (
              <span>
                （{this.valueArray.length}/{this.availableOptions.length}）
              </span>
            ) : null}
          </span>
          {selectMode !== 'table' ? (
            <a
              onClick={this.toggleAll}
              className={cx(
                'Transfer-checkAll',
                disabled || !options.length ? 'is-disabled' : ''
              )}
            >
              {__('Select.placeholder')}
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
          ? this.renderSearchResult()
          : this.renderOptions()}
      </>
    );
  }

  renderSearchResult() {
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
      cellRender
    } = this.props;
    const options = this.state.searchResult || [];
    const mode = searchResultMode || selectMode;
    const resultColumns = searchResultColumns || columns;

    return mode === 'table' ? (
      <TableCheckboxes
        placeholder={noResultsText}
        className={cx('Transfer-checkboxes')}
        columns={resultColumns!}
        options={options}
        value={value}
        disabled={disabled}
        onChange={onChange}
        option2value={option2value}
        cellRender={cellRender}
        itemRender={optionItemRender}
      />
    ) : mode === 'tree' ? (
      <TreeCheckboxes
        placeholder={noResultsText}
        className={cx('Transfer-checkboxes')}
        options={options}
        value={value}
        disabled={disabled}
        onChange={onChange}
        option2value={option2value}
        itemRender={optionItemRender}
      />
    ) : mode === 'chained' ? (
      <ChainedCheckboxes
        placeholder={noResultsText}
        className={cx('Transfer-checkboxes')}
        options={options}
        value={value}
        disabled={disabled}
        onChange={onChange}
        option2value={option2value}
        itemRender={optionItemRender}
      />
    ) : (
      <ListCheckboxes
        placeholder={noResultsText}
        className={cx('Transfer-checkboxes')}
        options={options}
        value={value}
        disabled={disabled}
        onChange={onChange}
        option2value={option2value}
        itemRender={optionItemRender}
      />
    );
  }

  renderOptions() {
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
      optionItemRender
    } = this.props;

    return selectMode === 'table' ? (
      <TableCheckboxes
        className={cx('Transfer-checkboxes')}
        columns={columns!}
        options={options || []}
        value={value}
        disabled={disabled}
        onChange={onChange}
        option2value={option2value}
        onDeferLoad={onDeferLoad}
        cellRender={cellRender}
        itemRender={optionItemRender}
      />
    ) : selectMode === 'tree' ? (
      <TreeCheckboxes
        className={cx('Transfer-checkboxes')}
        options={options || []}
        value={value}
        disabled={disabled}
        onChange={onChange}
        option2value={option2value}
        onDeferLoad={onDeferLoad}
        itemRender={optionItemRender}
      />
    ) : selectMode === 'chained' ? (
      <ChainedCheckboxes
        className={cx('Transfer-checkboxes')}
        options={options || []}
        value={value}
        disabled={disabled}
        onChange={onChange}
        option2value={option2value}
        onDeferLoad={onDeferLoad}
        itemRender={optionItemRender}
      />
    ) : selectMode === 'associated' ? (
      <AssociatedCheckboxes
        className={cx('Transfer-checkboxes')}
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
      />
    ) : (
      <ListCheckboxes
        className={cx('Transfer-checkboxes')}
        options={options || []}
        value={value}
        disabled={disabled}
        onChange={onChange}
        option2value={option2value}
        onDeferLoad={onDeferLoad}
        itemRender={optionItemRender}
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

    this.valueArray = BaseCheckboxes.value2array(value, options, option2value);
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
        <div className={cx('Transfer-select')}>{this.renderSelect()}</div>
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
            className={cx('Transfer-selections')}
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
    uncontrollable(Transfer, {
      value: 'onChange'
    })
  )
);
