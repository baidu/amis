import React from 'react';
import {ThemeProps, themeable} from '../theme';
import {Icon} from './icons';
import {uncontrollable} from 'uncontrollable';
import {autobind} from '../utils/helper';
import {LocaleProps, localeable} from '../locale';

export interface SearchBoxProps extends ThemeProps, LocaleProps {
  name?: string;
  onChange?: (text: string) => void;
  placeholder?: string;
  value?: string;
  active?: boolean;
  onActiveChange?: (active: boolean) => void;
  onSearch?: (value: string) => void;
  onCancel?: () => void;
}

export class SearchBox extends React.Component<SearchBoxProps> {
  inputRef: React.RefObject<HTMLInputElement> = React.createRef();

  @autobind
  handleActive() {
    const {onActiveChange} = this.props;
    onActiveChange?.(true);
    this.inputRef.current?.focus();
  }

  @autobind
  handleCancel() {
    const {onActiveChange, onChange, onCancel} = this.props;
    onActiveChange?.(false);
    onCancel?.();
    onChange?.('');
  }

  @autobind
  handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const {onChange, onSearch} = this.props;
    onChange?.(e.currentTarget.value);
    onSearch?.(e.currentTarget.value);
  }

  render() {
    const {
      classnames: cx,
      value,
      active,
      name,
      onChange,
      placeholder,
      translate: __
    } = this.props;

    return (
      <div className={cx('SearchBox', active ? 'is-active' : '')}>
        <input
          name={name}
          onChange={this.handleChange}
          value={value || ''}
          placeholder={__(placeholder || '输入关键字')}
          ref={this.inputRef}
        />

        {active ? (
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
