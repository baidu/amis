import React from 'react';
import cx from 'classnames';
import matchSorter from 'match-sorter';
import keycode from 'keycode';
import Downshift, {StateChangeOptions} from 'downshift';
import {autobind} from '../../utils/helper';
import {ICONS} from './IconPickerIcons';
import {FormItem, FormControlProps} from './Item';

export interface Option {
  label?: string;
  value?: any;
}

export interface IconPickerProps extends FormControlProps {
  placeholder?: string;
  resetValue?: any;
  noDataTip?: string;
}

export interface IconPickerState {
  isOpen?: boolean;
  inputValue?: string;
  isFocused?: boolean;
  vendorIndex?: number;
}

export default class IconPickerControl extends React.PureComponent<
  IconPickerProps,
  IconPickerState
> {
  input?: HTMLInputElement;

  state: IconPickerState = {
    isOpen: false,
    inputValue: '',
    isFocused: false,
    vendorIndex: 0
  };

  static defaultProps: Pick<
    IconPickerProps,
    'resetValue' | 'placeholder' | 'noDataTip'
  > = {
    resetValue: '',
    placeholder: '',
    noDataTip: '未找到匹配的图标'
  };

  componentWillReceiveProps(nextProps: IconPickerProps) {
    const props = this.props;

    if (props.value !== nextProps.value) {
      this.setState({
        inputValue: ''
      });
    }
  }

  @autobind
  changeVendor(index: number) {
    this.setState(
      {
        vendorIndex: index
      },
      this.formatOptions
    );
  }

  @autobind
  formatOptions() {
    let vendorIndex = this.state.vendorIndex || 0;
    let {prefix, icons} = ICONS[vendorIndex];
    return icons.map((icon: string) => ({
      label: prefix + icon,
      value: prefix + icon
    }));
  }

  @autobind
  getVendors() {
    return ICONS.map(icons => icons.name);
  }

  @autobind
  inputRef(ref: any) {
    this.input = ref;
  }

  @autobind
  focus() {
    if (!this.input) {
      return;
    }

    this.input.focus();

    const len = this.input.value.length;
    len && this.input.setSelectionRange(len, len);
  }

  @autobind
  handleClick() {
    this.focus();
    this.setState({
      isOpen: true
    });
  }

  @autobind
  handleFocus(e: any) {
    this.setState({
      isOpen: true,
      isFocused: true
    });

    this.props.onFocus && this.props.onFocus(e);
  }

  @autobind
  handleBlur(e: any) {
    const {onBlur, trimContents, value, onChange} = this.props;

    this.setState(
      {
        isFocused: false
      },
      () => {
        if (trimContents && value && typeof value === 'string') {
          onChange(value.trim());
        }
      }
    );

    onBlur && onBlur(e);
  }

  @autobind
  handleInputChange(evt: React.ChangeEvent<HTMLInputElement>) {
    let value = evt.currentTarget.value;

    this.setState({
      inputValue: value
    });
  }

  @autobind
  handleKeyDown(evt: React.KeyboardEvent<HTMLInputElement>) {
    const code = keycode(evt.keyCode);
    if (code !== 'backspace') {
      return;
    }

    const {onChange} = this.props;

    if (!this.state.inputValue) {
      onChange('');
      this.setState({
        inputValue: ''
      });
    }
  }

  @autobind
  handleChange(value: any) {
    const {onChange} = this.props;

    onChange(value);
    this.setState({
      isFocused: false,
      inputValue: ''
    });
  }

  @autobind
  handleStateChange(changes: StateChangeOptions<any>) {
    switch (changes.type) {
      case Downshift.stateChangeTypes.itemMouseEnter:
      case Downshift.stateChangeTypes.changeInput:
        this.setState({
          isOpen: true
        });
        break;
      default:
        const state: IconPickerState = {};
        if (typeof changes.isOpen !== 'undefined') {
          state.isOpen = changes.isOpen;
        }

        if (this.state.isOpen && changes.isOpen === false) {
          state.inputValue = '';
        }

        this.setState(state);
        break;
    }
  }

  renderFontIcons() {
    const {
      className,
      inputOnly,
      placeholder,
      classnames: cx,
      name,
      value,
      noDataTip,
      formItem
    } = this.props;
    const options = this.formatOptions();
    const vendors = this.getVendors();
    const selectedOptions =
      formItem && formItem.selectedOptions.length
        ? formItem.selectedOptions
        : value
        ? [{label: value, value: value}]
        : [];

    return (
      <Downshift
        isOpen={this.state.isOpen}
        inputValue={this.state.inputValue}
        onChange={this.handleChange}
        onOuterClick={this.handleBlur}
        onStateChange={this.handleStateChange}
        selectedItem={selectedOptions.map((option: Option) => option['value'])}
      >
        {({getInputProps, getItemProps, isOpen, inputValue, selectedItem}) => {
          let filteredOptions =
            inputValue && isOpen
              ? matchSorter(options, inputValue, {keys: ['label', 'value']})
              : options;
          filteredOptions = filteredOptions.filter(
            (option: any) => !~selectedItem.indexOf(option.value)
          );

          return (
            <div
              className={cx(
                `IconPickerControl-input IconPickerControl-input--withAC`,
                inputOnly ? className : '',
                {
                  'is-opened': isOpen
                }
              )}
              onClick={this.handleClick}
            >
              <div className={cx('IconPickerControl-valueWrap')}>
                {placeholder &&
                !selectedOptions.length &&
                !this.state.inputValue ? (
                  <div className={cx('IconPickerControl-placeholder')}>
                    {placeholder}
                  </div>
                ) : null}

                {selectedOptions.map((option: Option, index: number) =>
                  inputValue && isOpen ? null : (
                    <div className={cx('IconPickerControl-value')} key={index}>
                      <i className={cx(`${option.value}`)} />
                      {option.label}
                    </div>
                  )
                )}

                <input
                  {...getInputProps({
                    name,
                    ref: this.inputRef,
                    onFocus: this.handleFocus,
                    onChange: this.handleInputChange,
                    onKeyDown: this.handleKeyDown
                  })}
                  autoComplete="off"
                />
              </div>
              {isOpen ? (
                <div className={cx('IconPickerControl-sugsPanel')}>
                  {vendors.length > 1 ? (
                    <div className={cx('IconPickerControl-tabs')}>
                      {vendors.map((vendor: string, index: number) => (
                        <div
                          className={cx('IconPickerControl-tab', {
                            active: this.state.vendorIndex === index
                          })}
                          onClick={() => this.changeVendor(index)}
                          key={index}
                        >
                          {vendor}
                        </div>
                      ))}
                    </div>
                  ) : null}

                  {filteredOptions.length ? (
                    <div
                      className={cx(
                        'IconPickerControl-sugs',
                        vendors.length > 1
                          ? 'IconPickerControl-multiVendor'
                          : 'IconPickerControl-singleVendor'
                      )}
                    >
                      {filteredOptions.map((option: Option, index: number) => (
                        <div
                          {...getItemProps({
                            item: option.value,
                            className: cx(`IconPickerControl-sugItem`)
                          })}
                          key={index}
                        >
                          <i
                            className={cx(`${option.value}`)}
                            title={`${option.value}`}
                          />
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div
                      className={cx(
                        vendors.length > 1
                          ? 'IconPickerControl-multiVendor'
                          : 'IconPickerControl-singleVendor'
                      )}
                    >
                      {noDataTip}
                    </div>
                  )}
                </div>
              ) : null}
            </div>
          );
        }}
      </Downshift>
    );
  }

  render(): JSX.Element {
    const {className, classPrefix: ns, inputOnly} = this.props;

    let input = this.renderFontIcons();

    if (inputOnly) {
      return input;
    }

    return (
      <div
        className={cx(className, `${ns}IconPickerControl`, {
          'is-focused': this.state.isFocused
        })}
      >
        {input}
      </div>
    );
  }
}

@FormItem({
  type: 'icon-picker'
})
export class IconPickerControlRenderer extends IconPickerControl {}
