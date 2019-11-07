import React from 'react';
import {OptionsControl, OptionsControlProps, Option} from './Options';
import cx from 'classnames';
import {Action} from '../../types';
import Downshift from 'downshift';
import matchSorter from 'match-sorter';
import debouce = require('lodash/debounce');
import find = require('lodash/find');
import {Icon} from '../../components/icons';
import {Portal} from 'react-overlays';
import {findDOMNode} from 'react-dom';

// declare function matchSorter(items:Array<any>, input:any, options:any): Array<any>;

export interface TagProps extends OptionsControlProps {
  placeholder?: string;
  clearable: boolean;
  resetValue?: any;
  optionsTip: string;
}

export interface TagState {
  inputValue: string;
  isFocused?: boolean;
}

export default class TagControl extends React.PureComponent<
  TagProps,
  TagState
> {
  input: React.RefObject<HTMLInputElement> = React.createRef();

  constructor(props: TagProps) {
    super(props);

    this.state = {
      inputValue: '',
      isFocused: false
    };
    this.focus = this.focus.bind(this);
    this.clearValue = this.clearValue.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.handleFocus = this.handleFocus.bind(this);
    this.handleBlur = this.handleBlur.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.getParent = this.getParent.bind(this);
  }

  static defaultProps: Partial<TagProps> = {
    resetValue: '',
    labelField: 'label',
    valueField: 'value',
    placeholder: '',
    multiple: true,
    optionsTip: '最近您使用的标签'
  };

  componentWillReceiveProps(nextProps: TagProps) {
    const props = this.props;

    if (props.value !== nextProps.value) {
      this.setState({
        inputValue: ''
      });
    }
  }

  focus() {
    if (!this.input.current) {
      return;
    }

    this.input.current.focus();

    // 光标放到最后
    const len = this.input.current.value.length;
    len && this.input.current.setSelectionRange(len, len);
  }

  clearValue() {
    const {onChange, resetValue} = this.props;

    onChange(resetValue);
    this.setState(
      {
        inputValue: resetValue
      },
      this.focus
    );
  }

  removeItem(index: number) {
    const {
      selectedOptions,
      onChange,
      joinValues,
      extractValue,
      delimiter,
      valueField
    } = this.props;

    const newValue = selectedOptions.concat();
    newValue.splice(index, 1);

    onChange(
      joinValues
        ? newValue
            .map(item => item[valueField || 'value'])
            .join(delimiter || ',')
        : extractValue
        ? newValue.map(item => item[valueField || 'value'])
        : newValue
    );
  }

  addItem(option: Option) {
    const {
      selectedOptions,
      onChange,
      joinValues,
      extractValue,
      delimiter,
      valueField
    } = this.props;
    const newValue = selectedOptions.concat();

    if (find(newValue, item => item.value == option.value)) {
      return;
    }

    newValue.push(option);

    onChange(
      joinValues
        ? newValue
            .map(item => item[valueField || 'value'])
            .join(delimiter || ',')
        : extractValue
        ? newValue.map(item => item[valueField || 'value'])
        : newValue
    );
  }

  handleClick() {
    this.focus();
  }

  handleFocus(e: any) {
    this.setState({
      isFocused: true
    });

    this.props.onFocus && this.props.onFocus(e);
  }

  handleBlur(e: any) {
    const {
      selectedOptions,
      onChange,
      joinValues,
      extractValue,
      delimiter,
      valueField
    } = this.props;

    const value = this.state.inputValue.trim();
    this.props.onBlur && this.props.onBlur(e);
    this.setState(
      {
        isFocused: false,
        inputValue: ''
      },
      value
        ? () => {
            const newValue = selectedOptions.concat();
            if (!find(newValue, item => item.value === value)) {
              const option = {
                label: value,
                value: value
              };
              newValue.push(option);
              onChange(
                joinValues
                  ? newValue
                      .map(item => item[valueField || 'value'])
                      .join(delimiter || ',')
                  : extractValue
                  ? newValue.map(item => item[valueField || 'value'])
                  : newValue
              );
            }
          }
        : undefined
    );
  }

  handleInputChange(evt: React.ChangeEvent<HTMLInputElement>) {
    let value = evt.currentTarget.value;

    this.setState({
      inputValue: value
    });
  }

  handleKeyDown(evt: React.KeyboardEvent<HTMLInputElement>) {
    const {
      selectedOptions,
      onChange,
      joinValues,
      extractValue,
      delimiter,
      valueField
    } = this.props;

    const value = this.state.inputValue.trim();

    if (selectedOptions.length && !value && evt.key == 'Backspace') {
      const newValue = selectedOptions.concat();
      newValue.pop();

      onChange(
        joinValues
          ? newValue
              .map(item => item[valueField || 'value'])
              .join(delimiter || ',')
          : extractValue
          ? newValue.map(item => item[valueField || 'value'])
          : newValue
      );
    } else if (value && (evt.key === 'Enter' || evt.key === delimiter)) {
      evt.preventDefault();
      const newValue = selectedOptions.concat();

      if (!find(newValue, item => item.value == value)) {
        newValue.push({
          label: value,
          value: value
        });

        onChange(
          joinValues
            ? newValue
                .map(item => item[valueField || 'value'])
                .join(delimiter || ',')
            : extractValue
            ? newValue.map(item => item[valueField || 'value'])
            : newValue
        );
      }

      this.setState({
        inputValue: ''
      });
    }
  }

  getParent() {
    return (findDOMNode(this) as HTMLElement).parentNode;
  }

  reload() {
    const reload = this.props.reloadOptions;
    reload && reload();
  }

  render() {
    const {
      className,
      classnames: cx,
      disabled,
      placeholder,
      name,
      options,
      optionsTip,
      clearable,
      value,
      loading,
      spinnerClassName,
      selectedOptions,
      labelField
    } = this.props;

    return (
      <div
        className={cx(className, `TagControl`, {
          'is-focused': this.state.isFocused,
          'is-disabled': disabled
        })}
      >
        <div onClick={this.handleClick} className={cx('TagControl-input')}>
          <div className={cx('TagControl-valueWrap')}>
            {placeholder &&
            !selectedOptions.length &&
            !this.state.inputValue ? (
              <div className={cx('TagControl-placeholder')}>{placeholder}</div>
            ) : null}

            {selectedOptions.map((item, index) => (
              <div className={cx('TagControl-value')} key={index}>
                <span
                  className={cx('TagControl-valueIcon')}
                  onClick={this.removeItem.bind(this, index)}
                >
                  ×
                </span>
                <span className={cx('TagControl-valueLabel')}>
                  {item[labelField || 'label']}
                </span>
              </div>
            ))}

            <input
              ref={this.input}
              name={name}
              value={this.state.inputValue}
              onChange={this.handleInputChange}
              onKeyDown={this.handleKeyDown}
              onFocus={this.handleFocus}
              onBlur={this.handleBlur}
            />
          </div>

          {clearable && !disabled && value ? (
            <a onClick={this.clearValue} className={cx('TagControl-clear')}>
              <Icon icon="close" className="icon" />
            </a>
          ) : null}
          {loading ? (
            <i className={cx(`TagControl-spinner`, spinnerClassName)} />
          ) : null}
        </div>

        {options.length ? (
          <Portal container={this.getParent}>
            <div className={cx('TagControl-sug')}>
              {optionsTip ? (
                <div className={cx('TagControl-sugTip')}>{optionsTip}</div>
              ) : null}
              {options.map((item, index) => (
                <div
                  className={cx('TagControl-sugItem')}
                  key={index}
                  onClick={this.addItem.bind(this, item)}
                >
                  {item.label}
                </div>
              ))}
            </div>
          </Portal>
        ) : null}
      </div>
    );
  }
}

@OptionsControl({
  type: 'tag'
})
export class TagControlRenderer extends TagControl {}
