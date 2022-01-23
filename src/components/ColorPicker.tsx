/**
 * @file ColorPicker
 * @description 颜色选择器组件
 * @author fex
 */

import React from 'react';
import {findDOMNode} from 'react-dom';
import {SketchPicker, GithubPicker, ColorResult} from 'react-color';
import {Icon} from './icons';
import Overlay from './Overlay';
import {uncontrollable} from 'uncontrollable';
import PopOver from './PopOver';
import PopUp from './PopUp';
import {ClassNamesFn, themeable, ThemeProps} from '../theme';
import {autobind, isMobile, isObject} from '../utils/helper';
import {localeable, LocaleProps} from '../locale';

export type PresetColor = {color: string; title: string} | string;

export interface ColorProps extends LocaleProps, ThemeProps {
  placeholder?: string;
  format: string;
  // closeOnSelect:boolean;
  clearable: boolean;
  className?: string;
  popoverClassName?: string;
  disabled?: boolean;
  popOverContainer?: any;
  placement?: string;
  value?: any;
  onChange: (value: any) => void;
  presetColors?: PresetColor[];
  resetValue?: string;
  allowCustomColor?: boolean;
  useMobileUI?: boolean;
}

export interface ColorControlState {
  isOpened: boolean;
  isFocused: boolean;
  inputValue: string;
}

export class ColorControl extends React.PureComponent<
  ColorProps,
  ColorControlState
> {
  static defaultProps = {
    format: 'hex',
    clearable: true,
    placeholder: 'ColorPicker.placeholder',
    allowCustomColor: true
    // closeOnSelect: true
  };
  state = {
    isOpened: false,
    isFocused: false,
    inputValue: this.props.value || ''
  };
  popover: any;
  closeTimer: number;
  preview: React.RefObject<HTMLElement>;
  input: React.RefObject<HTMLInputElement>;
  constructor(props: ColorProps) {
    super(props);

    this.open = this.open.bind(this);
    this.close = this.close.bind(this);
    this.focus = this.focus.bind(this);
    this.blur = this.blur.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleFocus = this.handleFocus.bind(this);
    this.handleBlur = this.handleBlur.bind(this);
    this.clearValue = this.clearValue.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.preview = React.createRef();
    this.input = React.createRef();
  }

  componentDidUpdate(prevProps: ColorProps) {
    const props = this.props;

    if (prevProps.value !== props.value) {
      this.setState({
        inputValue: props.value || ''
      });
    }
  }

  handleFocus() {
    this.setState({
      isFocused: true
    });
  }

  handleBlur() {
    this.setState({
      isFocused: false,
      inputValue: this.props.value
    });
  }

  focus() {
    this.input.current && this.input.current.focus();
  }

  blur() {
    this.input.current && this.input.current.blur();
  }

  open(fn?: () => void) {
    if (this.props.disabled) {
      return;
    }
    this.setState(
      {
        isOpened: true
      },
      fn
    );
  }

  close() {
    this.setState({
      isOpened: false
    });
  }

  clearValue() {
    const {onChange, resetValue} = this.props;
    onChange(resetValue || '');
  }

  handleClick() {
    this.state.isOpened ? this.close() : this.open(this.focus);
  }

  handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (!this.props.allowCustomColor) {
      return;
    }

    const onChange = this.props.onChange;

    this.setState(
      {
        inputValue: e.currentTarget.value
      },
      () => {
        let isValidated = this.validateColor(this.state.inputValue);
        if (isValidated) {
          onChange(this.state.inputValue);
        }
      }
    );
  }

  @autobind
  validateColor(value: string) {
    if (value === '') {
      return false;
    }
    if (value === 'inherit') {
      return false;
    }
    if (value === 'transparent') {
      return false;
    }

    let image = document.createElement('img');
    image.style.color = 'rgb(0, 0, 0)';
    image.style.color = value;
    if (image.style.color !== 'rgb(0, 0, 0)') {
      return true;
    }
    image.style.color = 'rgb(255, 255, 255)';
    image.style.color = value;
    return image.style.color !== 'rgb(255, 255, 255)';
  }

  handleChange(color: ColorResult) {
    const {
      onChange,
      format
      // closeOnSelect
    } = this.props;

    if (format === 'rgba') {
      onChange(
        `rgba(${color.rgb.r}, ${color.rgb.g}, ${color.rgb.b}, ${color.rgb.a})`
      );
    } else if (format === 'rgb') {
      onChange(`rgb(${color.rgb.r}, ${color.rgb.g}, ${color.rgb.b})`);
    } else if (format === 'hsl') {
      onChange(
        `hsl(${Math.round(color.hsl.h)}, ${Math.round(
          color.hsl.s * 100
        )}%, ${Math.round(color.hsl.l * 100)}%)`
      );
    } else {
      onChange(color.hex);
    }

    // closeOnSelect && this.close();
  }

  render() {
    const {
      classPrefix: ns,
      className,
      popoverClassName,
      value,
      placeholder,
      disabled,
      popOverContainer,
      format,
      clearable,
      placement,
      classnames: cx,
      presetColors,
      allowCustomColor,
      useMobileUI
    } = this.props;

    const __ = this.props.translate;
    const isOpened = this.state.isOpened;
    const isFocused = this.state.isFocused;
    const mobileUI = useMobileUI && isMobile();

    return (
      <div
        className={cx(
          `ColorPicker`,
          {
            'is-disabled': disabled,
            'is-focused': isFocused,
            'is-opened': isOpened
          },
          className
        )}
      >
        <span onClick={this.handleClick} className={cx('ColorPicker-preview')}>
          <i
            ref={this.preview}
            className={`${ns}ColorPicker-previewIcon`}
            style={{background: this.state.inputValue || '#ccc'}}
          />
        </span>

        <input
          ref={this.input}
          type="text"
          autoComplete="off"
          size={10}
          className={cx('ColorPicker-input')}
          value={this.state.inputValue || ''}
          placeholder={__(placeholder)}
          disabled={disabled}
          onChange={this.handleInputChange}
          onFocus={this.handleFocus}
          onBlur={this.handleBlur}
          onClick={this.handleClick}
          readOnly={mobileUI}
        />

        {clearable && !disabled && value ? (
          <a onClick={this.clearValue} className={cx('ColorPicker-clear')}>
            <Icon icon="input-clear" className="icon" />
          </a>
        ) : null}

        <span className={cx('ColorPicker-arrow')}>
          <Icon icon="caret" className="icon" onClick={this.handleClick} />
        </span>

        {!mobileUI && isOpened ? (
          <Overlay
            placement={placement || 'auto'}
            target={() => findDOMNode(this)}
            onHide={this.close}
            container={popOverContainer || (() => findDOMNode(this))}
            rootClose={false}
            show
          >
            <PopOver
              classPrefix={ns}
              className={cx('ColorPicker-popover', popoverClassName)}
              onHide={this.close}
              overlay
            >
              {allowCustomColor ? (
                <SketchPicker
                  styles={{}}
                  disableAlpha={!!~['rgb', 'hex'].indexOf(format as string)}
                  color={value}
                  presetColors={presetColors}
                  onChangeComplete={this.handleChange}
                />
              ) : (
                <GithubPicker
                  color={value}
                  colors={
                    Array.isArray(presetColors)
                      ? (presetColors
                          .filter(
                            item => typeof item === 'string' || isObject(item)
                          )
                          .map(item =>
                            typeof item === 'string'
                              ? item
                              : isObject(item)
                              ? item?.color
                              : item
                          ) as string[])
                      : undefined
                  }
                  onChangeComplete={this.handleChange}
                />
              )}
            </PopOver>
          </Overlay>
        ) : null}
        {mobileUI && (
          <PopUp
            className={cx(`${ns}ColorPicker-popup`)}
            container={popOverContainer}
            isShow={isOpened}
            onHide={this.handleClick}
          >
            {allowCustomColor ? (
              <SketchPicker
                styles={{}}
                disableAlpha={!!~['rgb', 'hex'].indexOf(format as string)}
                color={value}
                presetColors={presetColors}
                onChangeComplete={this.handleChange}
              />
            ) : (
              <GithubPicker
                color={value}
                colors={
                  Array.isArray(presetColors)
                    ? (presetColors
                        .filter(
                          item => typeof item === 'string' || isObject(item)
                        )
                        .map(item =>
                          typeof item === 'string'
                            ? item
                            : isObject(item)
                            ? item?.color
                            : item
                        ) as string[])
                    : undefined
                }
                onChangeComplete={this.handleChange}
              />
            )}
          </PopUp>
        )}
      </div>
    );
  }
}

export default themeable(
  localeable(
    uncontrollable(ColorControl, {
      value: 'onChange'
    })
  )
);
