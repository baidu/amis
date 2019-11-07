/**
 * @file ColorPicker
 * @description 颜色选择器组件
 * @author fex
 */

import React from 'react';
import cx from 'classnames';
import {findDOMNode} from 'react-dom';
import {SketchPicker, ColorResult} from 'react-color';
import {Icon} from './icons';
import Overlay from './Overlay';
import uncontrollable = require('uncontrollable');
import PopOver from './PopOver';
import {ClassNamesFn, themeable} from '../theme';

export interface ColorProps {
  placeholder?: string;
  format: string;
  // closeOnSelect:boolean;
  clearable: boolean;
  className?: string;
  disabled?: boolean;
  popOverContainer?: any;
  placement?: string;
  value: any;
  classPrefix: string;
  classnames: ClassNamesFn;
  onChange: (value: any) => void;
  presetColors?: string[];
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
    placeholder: '请选择颜色'
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

  componentWillReceiveProps(nextProps: ColorProps) {
    const props = this.props;

    if (props.value !== nextProps.value) {
      this.setState({
        inputValue: nextProps.value || ''
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
    const onChange = this.props.onChange;
    onChange('');
  }

  handleClick() {
    this.state.isOpened ? this.close() : this.open(this.focus);
  }

  handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const onChange = this.props.onChange;

    this.setState(
      {
        inputValue: e.currentTarget.value
      },
      () => {
        const dom: HTMLElement = this.preview.current as HTMLElement;

        // 通过读取dom上到值，确认当前输入值是否有效。
        if (dom && dom.style.backgroundColor === this.state.inputValue) {
          onChange(this.state.inputValue);
        }
      }
    );
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
      value,
      placeholder,
      disabled,
      popOverContainer,
      format,
      clearable,
      placement,
      classnames: cx,
      presetColors
    } = this.props;

    const isOpened = this.state.isOpened;
    const isFocused = this.state.isFocused;

    return (
      <div
        className={cx(
          `ColorPicker`,
          {
            'is-disabled': disabled,
            'is-focused': isFocused
          },
          className
        )}
      >
        <input
          size={10}
          ref={this.input}
          type="text"
          autoComplete="off"
          className={cx('ColorPicker-input')}
          value={this.state.inputValue || ''}
          placeholder={placeholder}
          disabled={disabled}
          onChange={this.handleInputChange}
          onFocus={this.handleFocus}
          onBlur={this.handleBlur}
          onClick={this.handleClick}
        />

        {clearable && !disabled && value ? (
          <a onClick={this.clearValue} className={cx('ColorPicker-clear')}>
            <Icon icon="close" className="icon" />
          </a>
        ) : null}

        <span onClick={this.handleClick} className={cx('ColorPicker-preview')}>
          <i
            ref={this.preview}
            className={`${ns}ColorPicker-previewIcon`}
            style={{background: this.state.inputValue || '#ccc'}}
          />
        </span>

        {isOpened ? (
          <Overlay
            placement={
              placement || 'left-bottom-left-top  right-bottom-right-top'
            }
            target={() => findDOMNode(this)}
            onHide={this.close}
            container={popOverContainer || (() => findDOMNode(this))}
            rootClose={false}
            show
          >
            <PopOver
              classPrefix={ns}
              className={cx('ColorPicker-popover')}
              onHide={this.close}
              overlay
            >
              <SketchPicker
                disableAlpha={!!~['rgb', 'hex'].indexOf(format as string)}
                color={value}
                presetColors={presetColors}
                onChangeComplete={this.handleChange}
              />
            </PopOver>
          </Overlay>
        ) : null}
      </div>
    );
  }
}

export default themeable(
  uncontrollable(ColorControl, {
    value: 'onChange'
  })
);
