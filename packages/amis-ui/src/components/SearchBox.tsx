import React from 'react';
import {ThemeProps, themeable} from 'amis-core';
import {Icon} from './icons';
import {uncontrollable} from 'amis-core';
import {autobind} from 'amis-core';
import {LocaleProps, localeable} from 'amis-core';
import debounce from 'lodash/debounce';

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
}

export interface SearchBoxState {
  isFocused: boolean;
}

export class SearchBox extends React.Component<SearchBoxProps, SearchBoxState> {
  inputRef: React.RefObject<HTMLInputElement> = React.createRef();
  static defaultProps = {
    mini: true,
    enhance: false,
    clearable: false,
    searchImediately: true
  };

  state = {
    isFocused: false
  };

  lazyEmitSearch = debounce(
    () => {
      const onSearch = this.props.onSearch;
      onSearch?.(this.props.value || '');
    },
    250,
    {
      leading: false,
      trailing: true
    }
  );

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
    onChange?.('');
  }

  @autobind
  handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const {searchImediately, onChange} = this.props;
    onChange?.(e.currentTarget.value);
    searchImediately && this.lazyEmitSearch();
  }

  @autobind
  handleSearch() {
    const {onSearch, value} = this.props;
    onSearch?.(value || '');
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
    onChange?.('');
    searchImediately && this.lazyEmitSearch();
  }

  render() {
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
      value,
      translate: __
    } = this.props;

    const isFocused = this.state.isFocused;

    return (
      <div
        className={cx(
          'SearchBox',
          enhance && 'SearchBox--enhance',
          className,
          disabled ? 'is-disabled' : '',
          isFocused ? 'is-focused' : '',
          !mini || active ? 'is-active' : ''
        )}
      >
        <input
          name={name}
          disabled={disabled}
          onChange={this.handleChange}
          value={value || ''}
          placeholder={__(placeholder || 'placeholder.enter')}
          ref={this.inputRef}
          autoComplete="off"
          onFocus={() => this.setState({isFocused: true})}
          onBlur={() => this.setState({isFocused: false})}
          onKeyDown={this.handleKeyDown}
        />

        {!mini && clearable && value && !disabled ? (
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
}

export default themeable(
  localeable(
    uncontrollable(SearchBox, {
      active: 'onActiveChange',
      value: 'onChange'
    })
  )
);
