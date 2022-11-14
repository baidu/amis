import React from 'react';
import _ from 'lodash';
import isInteger from 'lodash/isInteger';
import debounce from 'lodash/debounce';
import moment from 'moment';
import {ThemeProps, themeable} from 'amis-core';
import {Icon} from './icons';
import {uncontrollable} from 'amis-core';
import {autobind} from 'amis-core';
import {LocaleProps, localeable} from 'amis-core';

export interface HistoryRecord {
  /** 历史记录值 */
  value: string;
  /** 历史记录生成的unix时间戳 */
  timestamp?: number;
}

export interface SearchHistoryOptions {
  /** 是否开启历史记录 */
  enable: boolean;
  /** 本地存储历史记录的key */
  key?: string;
  /** 历史记录数量上限 */
  limit?: number;
  /** 历史记录下拉面板CSS类名 */
  dropdownClassName?: string;
}

export interface SearchBoxProps extends ThemeProps, LocaleProps {
  name?: string;
  disabled?: boolean;
  mini?: boolean;
  enhance?: boolean;
  clearable?: boolean;
  searchImediately?: boolean;
  onChange?: (text: string) => void;
  placeholder?: string;
  defaultValue?: string;
  value?: string;
  active?: boolean;
  defaultActive?: boolean;
  onActiveChange?: (active: boolean) => void;
  onSearch?: (value: string) => void;
  onCancel?: () => void;
  onFocus?: () => void;
  onBlur?: () => void;
  /** 历史记录配置 */
  history?: SearchHistoryOptions;
}

export interface SearchBoxState {
  isFocused: boolean;
  isHistoryOpened: boolean;
  inputValue: string;
  historyRecords: HistoryRecord[];
}

const historyDefaultOptions: Required<SearchHistoryOptions> = {
  enable: false,
  key: 'amis:search_history',
  limit: 5,
  dropdownClassName: ''
};

export class SearchBox extends React.Component<SearchBoxProps, SearchBoxState> {
  inputRef: React.RefObject<HTMLInputElement> = React.createRef();

  static defaultProps = {
    mini: true,
    enhance: false,
    clearable: false,
    searchImediately: true,
    history: historyDefaultOptions
  };

  state = {
    isHistoryOpened: false,
    isFocused: false,
    inputValue: this.props.value ?? '',
    historyRecords: this.getHistoryRecords()
  };

  lazyEmitSearch = debounce(
    () => {
      const onSearch = this.props.onSearch;
      onSearch?.(this.state.inputValue ?? '');
    },
    250,
    {
      leading: false,
      trailing: true
    }
  );

  componentDidUpdate(prevProps: SearchBoxProps) {
    if (prevProps.value !== this.props.value) {
      this.setState({inputValue: this.props.value ?? ''});
    }
  }

  componentWillUnmount() {
    this.lazyEmitSearch.cancel();
  }

  @autobind
  handleActive() {
    const {onActiveChange} = this.props;
    onActiveChange?.(true);
    this.inputRef.current?.focus();
  }

  @autobind
  handleCancel() {
    const {onActiveChange, onCancel, onChange} = this.props;

    onActiveChange?.(false);
    onCancel?.();
    this.setState({inputValue: ''}, () => onChange?.(''));
  }

  @autobind
  handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const {searchImediately, onChange} = this.props;
    const inputValue = e.currentTarget.value;

    this.setState({inputValue}, () => {
      onChange?.(inputValue);
      searchImediately && this.lazyEmitSearch();
    });
  }

  @autobind
  handleSearch() {
    const {onSearch} = this.props;
    const {inputValue} = this.state;
    const {enable} = this.getHistoryOptions();

    if (enable) {
      this.insertHistoryRecord(inputValue);
      this.setState({isFocused: false, isHistoryOpened: false});
    }

    onSearch?.(inputValue || '');
  }

  @autobind
  handleKeyDown(e: React.KeyboardEvent<any>) {
    if (e.key === 'Enter') {
      this.handleSearch();
      e.preventDefault();
    }
  }

  @autobind
  handleClear() {
    const {searchImediately, onChange} = this.props;

    this.setState({inputValue: ''}, () => {
      onChange?.('');
      searchImediately && this.lazyEmitSearch();
    });
  }

  @autobind
  handleFocus() {
    const {enable} = this.getHistoryOptions();
    this.setState({isFocused: true, isHistoryOpened: enable});
    this.props.onFocus?.();
  }

  @autobind
  handleBlur(e: React.FocusEvent<HTMLInputElement>) {
    this.setState({isFocused: false, isHistoryOpened: false});
    this.props.onBlur?.();
  }

  handleHistoryRecordSelect(record: HistoryRecord) {
    this.setState(
      {inputValue: record.value, isHistoryOpened: false, isFocused: false},
      () => this.handleSearch()
    );
  }

  /** 获取历史搜索配置 */
  getHistoryOptions(): Required<SearchHistoryOptions> {
    const {history} = this.props;
    const options = {
      enable: !!history?.enable,
      key: history?.key ?? historyDefaultOptions.key,
      limit:
        history?.limit && isInteger(history?.limit) && history?.limit > 0
          ? history?.limit
          : historyDefaultOptions.limit,
      dropdownClassName: history?.dropdownClassName ?? ''
    };

    return options;
  }

  /** 获取历史记录 */
  getHistoryRecords() {
    const {key, limit} = this.getHistoryOptions();

    try {
      const storageValues = localStorage.getItem(key);

      return _.chain(storageValues ? JSON.parse(storageValues) : [])
        .uniqBy('value')
        .orderBy(['timestamp'], ['desc'])
        .slice(0, limit)
        .value();
    } catch {}

    return [];
  }

  /** 清空历史记录 */
  clearHistoryRecords(): HistoryRecord[] {
    const {key} = this.getHistoryOptions();
    localStorage.removeItem(key);
    this.setState({historyRecords: []});

    return [];
  }

  /** 删除一条历史记录 */
  removeHistoryRecord(record: HistoryRecord): HistoryRecord[] {
    const {key} = this.getHistoryOptions();
    const datasource = this.getHistoryRecords();
    const recordIndex = datasource.findIndex(
      item => item.value === record.value
    );

    if (~recordIndex) {
      datasource.splice(recordIndex, 1);
      localStorage.setItem(key, JSON.stringify(datasource));
      this.setState({historyRecords: datasource});
    }

    return datasource;
  }

  /** 新增一条历史记录 */
  insertHistoryRecord(value: string): HistoryRecord[] {
    const datasource = this.getHistoryRecords();

    if (!value || datasource.find(item => item.value === value)) {
      return datasource;
    }

    try {
      const {key, limit} = this.getHistoryOptions();
      const newDatasource = _.chain([
        ...datasource,
        {value, timestamp: moment().unix()}
      ])
        .orderBy(['timestamp'], ['desc'])
        .slice(0, limit)
        .value();

      localStorage.setItem(key, JSON.stringify(newDatasource));
      this.setState({historyRecords: newDatasource});
      return newDatasource;
    } catch {}

    return datasource;
  }

  renderInput(isHistoryMode?: boolean) {
    const {
      classnames: cx,
      active,
      name,
      className,
      disabled,
      placeholder,
      mini,
      enhance,
      clearable,
      translate: __
    } = this.props;
    const {isFocused, inputValue} = this.state;
    const {enable} = this.getHistoryOptions();

    return (
      <div
        className={cx(
          'SearchBox',
          enhance && 'SearchBox--enhance',
          !!isHistoryMode ? '' : className,
          disabled ? 'is-disabled' : '',
          isFocused ? 'is-focused' : '',
          !mini || active ? 'is-active' : '',
          {'is-history': enable}
        )}
      >
        <input
          name={name}
          ref={this.inputRef}
          onFocus={this.handleFocus}
          onBlur={this.handleBlur}
          onChange={this.handleChange}
          onKeyDown={this.handleKeyDown}
          value={inputValue ?? ''}
          disabled={disabled}
          placeholder={__(placeholder || 'placeholder.enter')}
          autoComplete="off"
        />

        {!mini && clearable && inputValue && !disabled ? (
          <div className={cx('SearchBox-clearable')} onClick={this.handleClear}>
            <Icon icon="input-clear" className="icon" />
          </div>
        ) : null}

        {!mini ? (
          <a className={cx('SearchBox-searchBtn')} onClick={this.handleSearch}>
            <Icon icon="search" className="icon" />
          </a>
        ) : active ? (
          <a className={cx('SearchBox-cancelBtn')} onClick={this.handleCancel}>
            <Icon icon="close" className="icon" />
          </a>
        ) : (
          <a className={cx('SearchBox-activeBtn')} onClick={this.handleActive}>
            <Icon icon="search" className="icon" />
          </a>
        )}
      </div>
    );
  }

  renderTag(item: HistoryRecord, index: number) {
    const {classnames: cx} = this.props;

    return (
      <span className={cx('Tag', 'SearchBox-history-tag')} key={index}>
        <span
          className={cx('SearchBox-history-tag-text')}
          onMouseDown={(e: React.MouseEvent<any>) => {
            e.preventDefault();
            this.handleHistoryRecordSelect(item);
          }}
        >
          {item.value}
        </span>
        <span
          className={cx(`SearchBox-history-tag-close`)}
          onMouseDown={(e: React.MouseEvent<any>) => {
            e.preventDefault();
            this.removeHistoryRecord(item);
          }}
        >
          <Icon icon="close" className="icon" />
        </span>
      </span>
    );
  }

  renderHitoryMode() {
    const {classnames: cx, translate: __, className} = this.props;
    const {isHistoryOpened, inputValue, historyRecords} = this.state;
    const {dropdownClassName} = this.getHistoryOptions();
    const showDropdown =
      isHistoryOpened && !inputValue && historyRecords.length > 0;

    return (
      <div
        id="searchbox-history"
        className={cx('SearchBox-history', className)}
      >
        {this.renderInput(true)}

        <div
          className={cx('SearchBox-history-dropdown', dropdownClassName, {
            'is-active': showDropdown
          })}
        >
          <header>
            <h4>{__('searchHistory')}</h4>
            <a
              onMouseDown={(e: React.MouseEvent<any>) => {
                e.preventDefault();
                this.clearHistoryRecords();
              }}
            >
              {__('clear')}
            </a>
          </header>

          <div className={cx('SearchBox-history-content')}>
            {historyRecords.map((item, index) => this.renderTag(item, index))}
          </div>
        </div>
      </div>
    );
  }

  render() {
    const {enable} = this.getHistoryOptions();

    return enable ? this.renderHitoryMode() : this.renderInput();
  }
}

export default themeable(
  localeable(
    uncontrollable(SearchBox, {
      active: 'onActiveChange',
      value: 'onChange'
    })
  )
);
