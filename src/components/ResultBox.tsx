import {ThemeProps, themeable} from '../theme';
import React from 'react';
import {InputBoxProps} from './InputBox';
import {uncontrollable} from 'uncontrollable';
import {Icon} from './icons';
import Input from './Input';
import {autobind} from '../utils/helper';
import {LocaleProps, localeable} from '../locale';

export interface ResultBoxProps
  extends ThemeProps,
    LocaleProps,
    Omit<InputBoxProps, 'result' | 'prefix' | 'onChange' | 'translate'> {
  onChange?: (value: string) => void;
  onResultClick?: (e: React.MouseEvent<HTMLElement>) => void;
  result?: Array<any> | any;
  itemRender: (value: any) => JSX.Element | string;
  onResultChange?: (value: Array<any>) => void;
  allowInput?: boolean;
  inputPlaceholder: string;
}

export class ResultBox extends React.Component<ResultBoxProps> {
  static defaultProps: Pick<
    ResultBoxProps,
    'clearable' | 'placeholder' | 'itemRender' | 'inputPlaceholder'
  > = {
    clearable: false,
    placeholder: 'placeholder.noData',
    inputPlaceholder: 'placeholder.enter',
    itemRender: (option: any) => (
      <span>{`${option.scopeLabel || ''}${option.label}`}</span>
    )
  };

  state = {
    isFocused: false
  };

  inputRef: React.RefObject<any> = React.createRef();

  focus() {
    this.inputRef.current?.focus();
  }

  blur() {
    this.inputRef.current?.blur();
  }

  @autobind
  clearValue(e: React.MouseEvent<any>) {
    e.preventDefault();
    const onResultChange = this.props.onResultChange;
    onResultChange && onResultChange([]);
  }

  @autobind
  handleFocus(e: any) {
    const onFocus = this.props.onFocus;
    onFocus && onFocus(e);
    this.setState({
      isFocused: true
    });
  }

  @autobind
  handleBlur(e: any) {
    const onBlur = this.props.onBlur;
    onBlur && onBlur(e);
    this.setState({
      isFocused: false
    });
  }

  @autobind
  removeItem(e: React.MouseEvent<HTMLElement>) {
    e.stopPropagation();
    e.preventDefault();

    const {result, onResultChange} = this.props;
    const index = parseInt(e.currentTarget.getAttribute('data-index')!, 10);
    const newResult = Array.isArray(result) ? result.concat() : [];
    newResult.splice(index, 1);
    onResultChange && onResultChange(newResult);
  }

  @autobind
  handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const {onChange} = this.props;
    onChange?.(e.currentTarget.value);
  }

  render() {
    const {
      className,
      classnames: cx,
      classPrefix,
      clearable,
      disabled,
      hasError,
      result,
      value,
      placeholder,
      children,
      itemRender,
      allowInput,
      inputPlaceholder,
      onResultChange,
      onChange,
      onResultClick,
      translate: __,
      locale,
      onKeyPress,
      onFocus,
      onBlur,
      ...rest
    } = this.props;
    const isFocused = this.state.isFocused;

    return (
      <div
        className={cx(
          'ResultBox',
          className,
          isFocused ? 'is-focused' : '',
          disabled ? 'is-disabled' : '',
          hasError ? 'is-error' : '',
          onResultClick ? 'is-clickable' : ''
        )}
        onClick={onResultClick}
        tabIndex={!allowInput && !disabled && onFocus ? 0 : -1}
        onKeyPress={allowInput ? undefined : onKeyPress}
        onFocus={allowInput ? undefined : onFocus}
        onBlur={allowInput ? undefined : onBlur}
      >
        {Array.isArray(result) && result.length ? (
          result.map((item, index) => (
            <div className={cx('ResultBox-value')} key={index}>
              <span className={cx('ResultBox-valueLabel')}>
                {itemRender(item)}
              </span>
              {!disabled ? (
                <a data-index={index} onClick={this.removeItem}>
                  <Icon icon="close" className="icon" />
                </a>
              ) : null}
            </div>
          ))
        ) : result && !Array.isArray(result) ? (
          <span className={cx('ResultBox-singleValue')}>{result}</span>
        ) : allowInput && !disabled ? null : (
          <span className={cx('ResultBox-placeholder')}>
            {__(placeholder || 'placeholder.noData')}
          </span>
        )}

        {allowInput && !disabled ? (
          <Input
            {...rest}
            onKeyPress={onKeyPress}
            ref={this.inputRef}
            value={value || ''}
            onChange={this.handleChange}
            placeholder={__(
              Array.isArray(result) && result.length
                ? inputPlaceholder
                : placeholder
            )}
            onFocus={this.handleFocus}
            onBlur={this.handleBlur}
          />
        ) : null}

        {children}

        {clearable &&
        !disabled &&
        (Array.isArray(result) ? result.length : result) ? (
          <a onClick={this.clearValue} className={cx('ResultBox-clear')}>
            <Icon icon="close" className="icon" />
          </a>
        ) : null}
      </div>
    );
  }
}

export default themeable(
  localeable(
    uncontrollable(ResultBox, {
      value: 'onChange',
      result: 'onResultChange'
    })
  )
);
