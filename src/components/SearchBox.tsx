import React from 'react';
import {ThemeProps, themeable} from '../theme';
import {Icon} from './icons';
import {uncontrollable} from 'uncontrollable';
import {autobind} from '../utils/helper';
import {LocaleProps, localeable} from '../locale';
import debounce from 'lodash/debounce';

export interface SearchBoxProps extends ThemeProps, LocaleProps {
  name?: string;
  disabled?: boolean;
  mini?: boolean;
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

export class SearchBox extends React.Component<SearchBoxProps> {
  inputRef: React.RefObject<HTMLInputElement> = React.createRef();
  static defaultProps = {
    mini: true,
    searchImediately: true
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

  render() {
    const {
      classnames: cx,
      active,
      name,
      className,
      disabled,
      placeholder,
      mini,
      value,
      translate: __
    } = this.props;

    return (
      <div
        className={cx(
          'SearchBox',
          className,
          disabled ? 'is-disabled' : '',
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
          onKeyDown={this.handleKeyDown}
        />

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
