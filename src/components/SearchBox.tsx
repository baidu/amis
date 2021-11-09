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
  onChange?: (text: string, name?: string) => void;
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
  value: string;
}

export class SearchBox extends React.Component<SearchBoxProps, SearchBoxState> {
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

  constructor(props: SearchBoxProps) {
    super(props);
    this.state = {
      value: props.value || ''
    };
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
    const {onActiveChange, onCancel} = this.props;
    onActiveChange?.(false);
    onCancel?.();
    this.setState({value: ''});
  }

  @autobind
  handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const {searchImediately} = this.props;
    this.setState({value: e.currentTarget.value});
    searchImediately && this.lazyEmitSearch();
  }

  @autobind
  handleSearch() {
    const {onSearch} = this.props;
    onSearch?.(this.state.value || '');
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
          value={this.state.value}
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
