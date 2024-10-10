import {TestIdBuilder, ThemeProps, themeable} from 'amis-core';
import React from 'react';
import omit from 'lodash/omit';
import isInteger from 'lodash/isInteger';
import {InputBoxProps} from './InputBox';
import {uncontrollable} from 'amis-core';
import {Icon} from './icons';
import Input from './Input';
import {autobind, ucFirst} from 'amis-core';
import {LocaleProps, localeable} from 'amis-core';
import isPlainObject from 'lodash/isPlainObject';
import TooltipWrapper, {TooltipObject} from './TooltipWrapper';

export interface ResultBoxProps
  extends ThemeProps,
    LocaleProps,
    Omit<InputBoxProps, 'result' | 'prefix' | 'onChange' | 'translate'> {
  onChange?: (value: string) => void;
  onResultClick?: (e: React.MouseEvent<HTMLElement>) => void;
  result?: Array<any> | any;
  itemRender: (value: any) => JSX.Element | string;
  onResultChange?: (value: Array<any>) => void;
  onClear?: (e: React.MouseEvent<HTMLElement>) => void;
  allowInput?: boolean;
  inputPlaceholder: string;
  hasDropDownArrow?: boolean;
  maxTagCount?: number;
  overflowTagPopover?: TooltipObject;
  actions?: JSX.Element | JSX.Element[];
  showInvalidMatch?: boolean;
  popOverContainer?: any;
  showArrow?: boolean;
  testIdBuilder?: TestIdBuilder;
}

export class ResultBox extends React.Component<ResultBoxProps> {
  static defaultProps: Pick<
    ResultBoxProps,
    | 'clearable'
    | 'placeholder'
    | 'itemRender'
    | 'inputPlaceholder'
    | 'showArrow'
  > = {
    clearable: false,
    placeholder: 'placeholder.noData',
    inputPlaceholder: 'placeholder.enter',
    showArrow: true,
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
    e.stopPropagation();
    this.props.onClear && this.props.onClear(e);
    this.props.onResultChange && this.props.onResultChange([]);
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

  renderMultipeTags(tags: any[]) {
    const {
      maxTagCount,
      overflowTagPopover,
      itemRender,
      classnames: cx,
      showInvalidMatch,
      popOverContainer,
      testIdBuilder
    } = this.props;

    if (
      maxTagCount != null &&
      isInteger(Math.floor(maxTagCount)) &&
      Math.floor(maxTagCount) >= 0 &&
      Math.floor(maxTagCount) < tags.length
    ) {
      const maxVisibleCount = Math.floor(maxTagCount);
      const tooltipProps: TooltipObject = {
        placement: 'top',
        trigger: 'hover',
        showArrow: false,
        offset: [0, -10],
        tooltipClassName: cx(
          'ResultBox-overflow',
          overflowTagPopover?.tooltipClassName
        ),
        ...omit(overflowTagPopover, ['children', 'content', 'tooltipClassName'])
      };

      return [
        ...tags.slice(0, maxVisibleCount),
        {label: `+ ${tags.length - maxVisibleCount} ...`}
      ].map((item, index) => {
        const isShowInvalid = showInvalidMatch && item?.__unmatched;
        const itemTIB = testIdBuilder?.getChild(item.value || index);
        return index === maxVisibleCount ? (
          <TooltipWrapper
            key={tags.length}
            container={popOverContainer}
            tooltip={{
              ...tooltipProps,
              children: () => (
                <div className={cx('ResultBox-overflow-wrapper')}>
                  {tags
                    .slice(maxVisibleCount, tags.length)
                    .map((item, index) => {
                      const itemIndex = index + maxVisibleCount;

                      return (
                        <div
                          className={cx('ResultBox-value', {
                            'is-invalid': showInvalidMatch && item?.__unmatched
                          })}
                          key={itemIndex}
                          {...itemTIB?.getTestId()}
                        >
                          <span className={cx('ResultBox-valueLabel')}>
                            {itemRender(item)}
                          </span>
                          <a
                            data-index={itemIndex}
                            onClick={this.removeItem}
                            {...itemTIB?.getChild('close').getTestId()}
                          >
                            <Icon icon="close" className="icon" />
                          </a>
                        </div>
                      );
                    })}
                </div>
              )
            }}
          >
            <div
              className={cx('ResultBox-value', {
                'is-invalid': isShowInvalid
              })}
              key={index}
            >
              <span className={cx('ResultBox-valueLabel')}>{item.label}</span>
            </div>
          </TooltipWrapper>
        ) : (
          <TooltipWrapper
            container={popOverContainer}
            placement={'top'}
            tooltip={item['label']}
            trigger={'hover'}
            key={index}
          >
            <div
              className={cx('ResultBox-value', {
                'is-invalid': isShowInvalid
              })}
              {...itemTIB?.getTestId()}
            >
              <span className={cx('ResultBox-valueLabel')}>
                {itemRender(item)}
              </span>
              <a
                data-index={index}
                onClick={this.removeItem}
                {...itemTIB?.getChild('close').getTestId()}
              >
                <Icon icon="close" className="icon" />
              </a>
            </div>
          </TooltipWrapper>
        );
      });
    }

    return tags.map((item, index) => {
      const itemTIB = testIdBuilder?.getChild(index);
      return (
        <TooltipWrapper
          container={popOverContainer}
          placement={'top'}
          tooltip={item['label']}
          trigger={'hover'}
          key={index}
        >
          <div
            className={cx('ResultBox-value', {
              'is-invalid': showInvalidMatch && item?.__unmatched
            })}
            {...itemTIB?.getTestId()}
          >
            <span className={cx('ResultBox-valueLabel')}>
              {itemRender(item)}
            </span>
            <a
              data-index={index}
              onClick={this.removeItem}
              {...itemTIB?.getChild('close').getTestId()}
            >
              <Icon icon="close" className="icon" />
            </a>
          </div>
        </TooltipWrapper>
      );
    });
  }

  render() {
    /** 不需要透传给Input的属性要解构出来 */
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
      borderMode,
      mobileUI,
      hasDropDownArrow,
      actions,
      onClear,
      maxTagCount,
      overflowTagPopover,
      showArrow,
      popOverContainer,
      testIdBuilder,
      ...rest
    } = this.props;
    const isFocused = this.state.isFocused;

    return (
      <div
        className={cx('ResultBox', className, {
          'is-focused': isFocused,
          'is-disabled': disabled,
          'is-error': hasError,
          'is-clickable': onResultClick,
          'is-clearable': clearable,
          'is-mobile': mobileUI,
          'is-group': Array.isArray(result),
          [`ResultBox--border${ucFirst(borderMode)}`]: borderMode
        })}
        onClick={onResultClick}
        tabIndex={!allowInput && !disabled && onFocus ? 0 : -1}
        onKeyPress={allowInput ? undefined : onKeyPress}
        onFocus={allowInput ? undefined : onFocus}
        onBlur={allowInput ? undefined : onBlur}
        {...testIdBuilder?.getTestId()}
      >
        <div className={cx('ResultBox-value-wrap')}>
          {Array.isArray(result) && result.length ? (
            this.renderMultipeTags(result)
          ) : result && !Array.isArray(result) ? (
            <span className={cx('ResultBox-singleValue')}>
              {isPlainObject(result) ? itemRender(result) : result}
            </span>
          ) : allowInput && !disabled ? null : (
            <span className={cx('ResultBox-placeholder')}>
              {__(placeholder || 'placeholder.noData')}
            </span>
          )}

          {allowInput && !disabled ? (
            <Input
              {...rest}
              className={cx('ResultBox-value-input')}
              onKeyPress={onKeyPress}
              ref={this.inputRef}
              value={value || ''}
              onChange={this.handleChange}
              placeholder={__(
                /** 数组模式下输入内容后将不再展示placeholder */
                Array.isArray(result)
                  ? result.length > 0
                    ? inputPlaceholder
                    : placeholder
                  : result
                  ? ''
                  : placeholder
              )}
              onFocus={this.handleFocus}
              onBlur={this.handleBlur}
              testIdBuilder={testIdBuilder?.getChild('input')}
            />
          ) : null}

          {children}
        </div>

        <div className={cx('ResultBox-actions')}>
          {clearable &&
          !disabled &&
          (Array.isArray(result) ? result.length : result) ? (
            <a
              onClick={this.clearValue}
              className={cx('ResultBox-clear', {
                'ResultBox-clear-with-arrow': hasDropDownArrow
              })}
              {...testIdBuilder?.getChild('clear').getTestId()}
            >
              <div className={cx('ResultBox-clear-wrap')}>
                <Icon icon="input-clear" className="icon" />
              </div>
            </a>
          ) : null}

          {actions}

          {hasDropDownArrow && !mobileUI && (
            <span className={cx('ResultBox-pc-arrow')}>
              <Icon icon="right-arrow-bold" className="icon" />
            </span>
          )}
          {!allowInput && mobileUI && showArrow ? (
            <span className={cx('ResultBox-arrow')}>
              <Icon icon="right-arrow-bold" className="icon" />
            </span>
          ) : null}
        </div>
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
