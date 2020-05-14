import React from 'react';
import {ThemeProps, themeable} from '../theme';
import {CheckboxesProps, Checkboxes} from './Checkboxes';
import {Options, Option} from './Select';
import uncontrollable from 'uncontrollable';
import Selections from './Selections';
import TableCheckboxes from './TableCheckboxes';
import ListCheckboxes from './ListCheckboxes';
import TreeCheckboxes from './TreeCheckboxes';
import {autobind, flattenTree} from '../utils/helper';
import InputBox from './InputBox';
import {Icon} from './icons';
import debounce from 'lodash/debounce';

export interface TransferPorps extends ThemeProps, CheckboxesProps {
  inline?: boolean;

  selectTitle: string;
  selectMode?: 'table' | 'list' | 'tree';
  columns?: Array<{
    name: string;
    label: string;
    [propName: string]: any;
  }>;

  // search 相关
  searchResultMode?: 'table' | 'list' | 'tree';
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
  selectRender?: (props: TransferPorps) => JSX.Element;

  resultTitle: string;
  sortable?: boolean;
}

export interface TransferState {
  inputValue: string;
  searchResult: Options | null;
}

export class Transfer extends React.Component<TransferPorps, TransferState> {
  static defaultProps = {
    selectTitle: '请选择',
    resultTitle: '当前选择',
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
    let valueArray = Checkboxes.value2array(value, options, option2value);
    const availableOptions = flattenTree(options).filter(
      option => !option.disabled && option.value !== void 0
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
  handleSearch(text: string) {
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
  }

  @autobind
  handleSeachCancel() {
    this.setState({
      inputValue: '',
      searchResult: null
    });
  }

  lazySearch = debounce(
    async (text: string) => {
      const onSearch = this.props.onSearch!;
      let result = await onSearch(
        text,
        (cancel: () => void) => (this.cancelSearch = cancel)
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
      options
    } = this.props;

    if (selectRender) {
      return selectRender(this.props);
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
            {selectTitle}（{this.valueArray.length}/
            {this.availableOptions.length}）
          </span>
          {selectMode !== 'table' ? (
            <a
              onClick={this.toggleAll}
              className={cx(
                'Transfer-checkAll',
                disabled || !options.length ? 'is-disabled' : ''
              )}
            >
              全选
            </a>
          ) : null}
        </div>

        {onSearch ? (
          <div className={cx('Transfer-search')}>
            <InputBox
              value={this.state.inputValue}
              onChange={this.handleSearch}
              placeholder="请输入关键字"
              clearable={false}
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
      classnames: cx,
      value,
      onChange,
      option2value
    } = this.props;
    const options = this.state.searchResult || [];
    const mode = searchResultMode || selectMode;

    return mode === 'table' ? (
      <TableCheckboxes
        placeholder={noResultsText}
        className={cx('Transfer-checkboxes')}
        columns={searchResultColumns!}
        options={options}
        value={value}
        onChange={onChange}
        option2value={option2value}
      />
    ) : mode === 'tree' ? (
      <TreeCheckboxes
        placeholder={noResultsText}
        className={cx('Transfer-checkboxes')}
        options={options}
        value={value}
        onChange={onChange}
        option2value={option2value}
      />
    ) : (
      <ListCheckboxes
        placeholder={noResultsText}
        className={cx('Transfer-checkboxes')}
        options={options}
        value={value}
        onChange={onChange}
        option2value={option2value}
      />
    );
  }

  renderOptions() {
    const {
      selectMode,
      columns,
      options,
      value,
      onChange,
      option2value,
      classnames: cx
    } = this.props;

    return selectMode === 'table' ? (
      <TableCheckboxes
        className={cx('Transfer-checkboxes')}
        columns={columns!}
        options={options}
        value={value}
        onChange={onChange}
        option2value={option2value}
      />
    ) : selectMode === 'tree' ? (
      <TreeCheckboxes
        className={cx('Transfer-checkboxes')}
        options={options}
        value={value}
        onChange={onChange}
        option2value={option2value}
      />
    ) : (
      <ListCheckboxes
        className={cx('Transfer-checkboxes')}
        options={options}
        value={value}
        onChange={onChange}
        option2value={option2value}
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
      disabled
    } = this.props;

    this.valueArray = Checkboxes.value2array(value, options, option2value);
    this.availableOptions = flattenTree(options).filter(
      option => !option.disabled && option.value !== void 0
    );

    return (
      <div
        className={cx('Transfer', className, inline ? 'Transfer--inline' : '')}
      >
        <div className={cx('Transfer-select')}>{this.renderSelect()}</div>
        <div className={cx('Transfer-arrow')}></div>
        <div className={cx('Transfer-result')}>
          <div className={cx('Transfer-title')}>
            <span>
              {resultTitle}（{this.valueArray.length}/
              {this.availableOptions.length}）
            </span>
            <a
              onClick={this.clearAll}
              className={cx(
                'Transfer-clearAll',
                disabled || !this.valueArray.length ? 'is-disabled' : ''
              )}
            >
              清空
            </a>
          </div>
          <Selections
            className={cx('Transfer-selections')}
            sortable={sortable}
            value={value}
            onChange={onChange}
            placeholder="请先选择左侧数据"
          />
        </div>
      </div>
    );
  }
}

export default themeable(
  uncontrollable(Transfer, {
    value: 'onChange'
  })
);
