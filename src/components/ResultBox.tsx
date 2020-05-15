import {ThemeProps, themeable} from '../theme';
import React from 'react';
import {InputBoxProps} from './InputBox';
import uncontrollable from 'uncontrollable';
import {Icon} from './icons';
import Input from './Input';
import {autobind} from '../utils/helper';

export interface ResultBoxProps
  extends ThemeProps,
    Omit<InputBoxProps, 'value' | 'onChange'> {
  value?: Array<any>;
  itemRender: (value: any) => JSX.Element;
  onChange?: (value: Array<any>) => void;

  allowInput?: boolean;
  inputPlaceholder: string;
  inputValue?: string;
  onInputChange?: (value: string) => void;
}

export class ResultBox extends React.Component<ResultBoxProps> {
  static defaultProps: Pick<
    ResultBoxProps,
    'clearable' | 'placeholder' | 'itemRender' | 'inputPlaceholder'
  > = {
    clearable: false,
    placeholder: '暂无结果',
    inputPlaceholder: '手动输入内容',
    itemRender: (option: any) => <span>{String(option.label)}</span>
  };

  state = {
    isFocused: false
  };

  @autobind
  clearValue() {
    const onChange = this.props.onChange;
    onChange && onChange([]);
  }

  @autobind
  handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const onInputChange = this.props.onInputChange;
    onInputChange && onInputChange(e.currentTarget.value);
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

    const {value, onChange} = this.props;
    const index = parseInt(e.currentTarget.getAttribute('data-index')!, 10);
    const newValue = Array.isArray(value) ? value.concat() : [];
    newValue.splice(index, 1);
    onChange && onChange(newValue);
  }

  render() {
    const {
      className,
      classnames: cx,
      classPrefix,
      clearable,
      disabled,
      hasError,
      value,
      placeholder,
      result,
      children,
      itemRender,
      onInputChange,
      inputValue,
      allowInput,
      inputPlaceholder,
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
          hasError ? 'is-error' : ''
        )}
      >
        {Array.isArray(value) && value.length ? (
          value.map((item, index) => (
            <div className={cx('ResultBox-value')} key={index}>
              <span className={cx('ResultBox-valueLabel')}>
                {itemRender(item)}
              </span>
              <a data-index={index} onClick={this.removeItem}>
                <Icon icon="close" />
              </a>
            </div>
          ))
        ) : allowInput ? null : (
          <span className={cx('ResultBox-placeholder')}>
            {placeholder || '无'}
          </span>
        )}

        {allowInput ? (
          <Input
            {...rest}
            value={inputValue || ''}
            onChange={this.handleInputChange}
            placeholder={
              Array.isArray(value) && value.length
                ? inputPlaceholder
                : placeholder
            }
            onFocus={this.handleFocus}
            onBlur={this.handleBlur}
          />
        ) : (
          <span className={cx('ResultBox-mid')} />
        )}

        {clearable && !disabled && Array.isArray(value) && value.length ? (
          <a onClick={this.clearValue} className={cx('ResultBox-clear')}>
            <Icon icon="close" className="icon" />
          </a>
        ) : null}

        {children}
      </div>
    );
  }
}

export default themeable(
  uncontrollable(ResultBox, {
    value: 'onChange',
    inputValue: 'onInputChange'
  })
);
