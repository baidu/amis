import React from 'react';
import {
  OptionsControl,
  OptionsControlProps,
  highlight,
  FormOptionsControl
} from './Options';
import {Action} from '../../types';
import Downshift, {StateChangeOptions} from 'downshift';
import {matchSorter} from 'match-sorter';
import debouce from 'lodash/debounce';
import {filter} from '../../utils/tpl';
import find from 'lodash/find';
import {Icon} from '../../components/icons';
import Input from '../../components/Input';
import {autobind, createObject, setVariable, ucFirst} from '../../utils/helper';
import {isEffectiveApi} from '../../utils/api';
import Spinner from '../../components/Spinner';
import {FormBaseControl} from './Item';
import {ActionSchema} from '../Action';
import {SchemaApi} from '../../Schema';
import {generateIcon} from '../../utils/icon';

// declare function matchSorter(items:Array<any>, input:any, options:any): Array<any>;

/**
 * Text 文本输入框。
 * 文档：https://baidu.gitee.io/amis/docs/components/form/text
 */
export interface TextControlSchema extends FormOptionsControl {
  type:
    | 'input-text'
    | 'input-email'
    | 'input-url'
    | 'input-password'
    | 'native-date'
    | 'native-time'
    | 'native-number';

  addOn?: {
    position?: 'left' | 'right';
    label?: string;
    icon?: string;
    className?: string;
  } & ActionSchema;

  /**
   * 是否去除首尾空白文本。
   */
  trimContents?: boolean;

  /**
   * 自动完成 API，当输入部分文字的时候，会将这些文字通过 ${term} 可以取到，发送给接口。
   * 接口可以返回匹配到的选项，帮助用户输入。
   */
  autoComplete?: SchemaApi;

  /**
   * 边框模式，全边框，还是半边框，或者没边框。
   */
  borderMode?: 'full' | 'half' | 'none';

  /**
   * 限制文字个数
   */
  maxLength?: number;

  /**
   * 是否显示计数
   */
  showCounter?: boolean;
}

export interface TextProps extends OptionsControlProps {
  placeholder?: string;
  addOn?: Action & {
    position?: 'left' | 'right';
    label?: string;
    icon?: string;
    className?: string;
  };
  creatable?: boolean;
  clearable: boolean;
  resetValue?: any;
  autoComplete?: any;
  allowInputText?: boolean;
  spinnerClassName: string;
}

export interface TextState {
  isOpen?: boolean;
  inputValue?: string;
  isFocused?: boolean;
}

export default class TextControl extends React.PureComponent<
  TextProps,
  TextState
> {
  input?: HTMLInputElement;

  highlightedIndex?: any;
  unHook: Function;
  constructor(props: TextProps) {
    super(props);

    const value = props.value;
    this.state = {
      isOpen: false,
      inputValue:
        props.multiple || props.creatable === false
          ? ''
          : this.valueToString(value),
      isFocused: false
    };
    this.focus = this.focus.bind(this);
    this.clearValue = this.clearValue.bind(this);
    this.inputRef = this.inputRef.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.handleFocus = this.handleFocus.bind(this);
    this.handleBlur = this.handleBlur.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleStateChange = this.handleStateChange.bind(this);
    this.loadAutoComplete = debouce(this.loadAutoComplete.bind(this), 250, {
      trailing: true,
      leading: false
    });
  }

  static defaultProps: Partial<TextProps> = {
    resetValue: '',
    labelField: 'label',
    valueField: 'value',
    placeholder: '',
    allowInputText: true,
    trimContents: true
  };

  componentDidMount() {
    const {formItem, autoComplete, addHook, formInited, data, name} =
      this.props;

    if (isEffectiveApi(autoComplete, data) && formItem) {
      if (formInited) {
        formItem.loadOptions(
          autoComplete,
          createObject(data, {
            term: ''
          })
        );
      } else {
        this.unHook = addHook(async (data: any) => {
          await formItem.loadOptions(
            autoComplete,
            createObject(data, {
              term: ''
            })
          );

          if (formItem.value) {
            setVariable(data, name!, formItem.value);
          }
        }, 'init');
      }
    }
  }

  componentDidUpdate(prevProps: TextProps) {
    const props = this.props;

    if (prevProps.value !== props.value) {
      this.setState({
        inputValue:
          props.multiple || props.creatable === false
            ? ''
            : this.valueToString(props.value)
      });
    }
  }

  componentWillUnmount() {
    this.unHook && this.unHook();
  }

  inputRef(ref: any) {
    this.input = ref;
  }

  focus() {
    if (!this.input) {
      return;
    }

    this.input.focus();

    // 光标放到最后
    const len = this.input.value.length;
    len && this.input.setSelectionRange(len, len);
  }

  clearValue() {
    const {onChange, resetValue} = this.props;

    onChange(resetValue);
    this.setState(
      {
        inputValue: resetValue
      },
      () => {
        this.focus();
        this.loadAutoComplete();
      }
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

  handleClick() {
    this.focus();
    this.setState({
      isOpen: true
    });
  }

  handleFocus(e: any) {
    this.setState({
      isOpen: true,
      isFocused: true
    });

    this.props.onFocus && this.props.onFocus(e);
  }

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

  handleInputChange(evt: React.ChangeEvent<HTMLInputElement>) {
    let value = evt.currentTarget.value;
    const {creatable, multiple, onChange} = this.props;

    this.setState(
      {
        inputValue: value
      },
      () => {
        if (creatable !== false && !multiple) {
          onChange?.(value);
        }

        this.loadAutoComplete();
      }
    );
  }

  handleKeyDown(evt: React.KeyboardEvent<HTMLInputElement>) {
    const {
      selectedOptions,
      onChange,
      joinValues,
      extractValue,
      delimiter,
      multiple,
      valueField,
      creatable
    } = this.props;

    if (selectedOptions.length && !this.state.inputValue && evt.keyCode === 8) {
      evt.preventDefault();
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
      this.setState(
        {
          inputValue: ''
        },
        this.loadAutoComplete
      );
    } else if (
      evt.keyCode === 13 &&
      this.state.inputValue &&
      typeof this.highlightedIndex !== 'number'
    ) {
      evt.preventDefault();
      const value = this.state.inputValue;

      if (multiple) {
        if (value && !find(selectedOptions, item => item.value == value)) {
          const newValue = selectedOptions.concat();
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
      } else {
        onChange(value);
      }

      if (creatable === false || multiple) {
        this.setState(
          {
            inputValue: '',
            isOpen: false
          },
          this.loadAutoComplete
        );
      }
    } else if (
      evt.keyCode === 13 &&
      this.state.isOpen &&
      typeof this.highlightedIndex !== 'number'
    ) {
      this.setState({
        isOpen: false
      });
    }
  }

  handleChange(value: any) {
    const {
      onChange,
      multiple,
      joinValues,
      extractValue,
      delimiter,
      selectedOptions,
      valueField,
      creatable
    } = this.props;

    if (multiple) {
      const newValue = selectedOptions.concat();
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
    } else {
      onChange(value);
    }

    if (multiple || creatable === false) {
      this.setState(
        {
          inputValue: ''
        },
        this.loadAutoComplete
      );
    }
  }

  handleStateChange(changes: StateChangeOptions<any>) {
    const creatable = this.props.creatable;
    const multiple = this.props.multiple || this.props.multi;
    switch (changes.type) {
      case Downshift.stateChangeTypes.itemMouseEnter:
        this.setState({
          isOpen: true
        });
        break;
      case Downshift.stateChangeTypes.changeInput:
        this.setState({
          isOpen: true
        });
        break;
      default:
        const state: TextState = {};
        if (typeof changes.isOpen !== 'undefined') {
          state.isOpen = changes.isOpen;
        }

        if (typeof changes.highlightedIndex !== 'undefined') {
          this.highlightedIndex = changes.highlightedIndex;
        }

        // 输入框清空
        if (
          !multiple &&
          creatable === false &&
          this.state.isOpen &&
          changes.isOpen === false
        ) {
          state.inputValue = '';
        }

        this.setState(state);
        break;
    }
  }

  @autobind
  handleNormalInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const {onChange} = this.props;

    let value = e.currentTarget.value;

    onChange(value);
  }

  loadAutoComplete() {
    const {formItem, autoComplete, data, multiple, selectedOptions} =
      this.props;

    if (isEffectiveApi(autoComplete, data) && formItem) {
      formItem.loadOptions(
        autoComplete,
        createObject(data, {
          term: this.state.inputValue || '' // (multiple ? '' : selectedOptions[selectedOptions.length - 1]?.value)
        }),
        {
          extendsOptions: true
        }
      );
    }
  }

  reload() {
    const reload = this.props.reloadOptions;
    reload && reload();
  }

  valueToString(value: any) {
    return typeof value === 'undefined' || value === null
      ? ''
      : typeof value === 'string'
      ? value
      : JSON.stringify(value);
  }

  renderSugestMode() {
    const {
      className,
      inputOnly,
      value,
      placeholder,
      classnames: cx,
      disabled,
      name,
      loading,
      clearable,
      options,
      selectedOptions,
      autoComplete,
      labelField,
      valueField,
      multiple,
      creatable,
      borderMode,
      translate: __
    } = this.props;
    let type = this.props.type?.replace(/^(?:native|input)\-/, '');

    return (
      <Downshift
        isOpen={this.state.isOpen && !disabled}
        inputValue={this.state.inputValue}
        onChange={this.handleChange}
        onStateChange={this.handleStateChange}
        selectedItem={selectedOptions.map(item => item[valueField || 'value'])}
      >
        {({
          getInputProps,
          getItemProps,
          isOpen,
          inputValue,
          selectedItem,
          highlightedIndex
        }) => {
          let filtedOptions =
            inputValue && isOpen && !autoComplete
              ? matchSorter(options, inputValue, {
                  keys: [labelField || 'label', valueField || 'value']
                })
              : options;
          const indices = isOpen
            ? mapItemIndex(filtedOptions, selectedItem)
            : {};
          filtedOptions = filtedOptions.filter(
            (option: any) => !~selectedItem.indexOf(option.value)
          );

          return (
            <div
              className={cx(
                `TextControl-input TextControl-input--withAC`,
                inputOnly ? className : '',
                {
                  'is-opened': isOpen,
                  'TextControl-input--multiple': multiple,
                  [`TextControl-input--border${ucFirst(borderMode)}`]:
                    borderMode
                }
              )}
              onClick={this.handleClick}
            >
              <>
                {placeholder &&
                !selectedOptions.length &&
                !this.state.inputValue &&
                !this.state.isFocused ? (
                  <div className={cx('TextControl-placeholder')}>
                    {placeholder}
                  </div>
                ) : null}

                {selectedOptions.map((item, index) =>
                  multiple ? (
                    <div className={cx('TextControl-value')} key={index}>
                      <span
                        className={cx('TextControl-valueIcon')}
                        onClick={this.removeItem.bind(this, index)}
                      >
                        ×
                      </span>
                      <span className={cx('TextControl-valueLabel')}>
                        {`${item[labelField || 'label']}`}
                      </span>
                    </div>
                  ) : (inputValue && isOpen) || creatable !== false ? null : (
                    <div className={cx('TextControl-value')} key={index}>
                      {item.label}
                    </div>
                  )
                )}

                <Input
                  {...getInputProps({
                    name,
                    ref: this.inputRef,
                    disabled,
                    type,
                    onFocus: this.handleFocus,
                    onBlur: this.handleBlur,
                    onChange: this.handleInputChange,
                    onKeyDown: this.handleKeyDown
                  })}
                  autoComplete="off"
                  size={10}
                />
              </>

              {clearable && !disabled && value ? (
                <a
                  onClick={this.clearValue}
                  className={cx('TextControl-clear')}
                >
                  <Icon icon="close" className="icon" />
                </a>
              ) : null}

              {loading ? (
                <Spinner
                  show
                  icon="reload"
                  spinnerClassName={cx('TextControl-spinner')}
                />
              ) : null}

              {isOpen && filtedOptions.length ? (
                <div className={cx('TextControl-sugs')}>
                  {filtedOptions.map((option: any) => {
                    return (
                      <div
                        {...getItemProps({
                          item: option.value,
                          disabled: option.disabled,
                          className: cx(`TextControl-sugItem`, {
                            'is-highlight':
                              highlightedIndex === indices[option.value],
                            'is-disabled': option.disabled
                          })
                        })}
                        key={option.value}
                      >
                        <span>
                          {option.disabled
                            ? option.label
                            : highlight(option.label, inputValue as string)}
                          {option.tip}
                        </span>
                      </div>
                    );
                  })}
                </div>
              ) : null}
            </div>
          );
        }}
      </Downshift>
    );
  }

  renderNormal(): JSX.Element {
    const {
      classPrefix: ns,
      classnames: cx,
      className,
      inputOnly,
      value,
      placeholder,
      onChange,
      disabled,
      readOnly,
      max,
      min,
      step,
      clearable,
      name,
      borderMode,
      prefix,
      suffix,
      data,
      showCounter,
      maxLength
    } = this.props;

    const type = this.props.type?.replace(/^(?:native|input)\-/, '');

    return (
      <div
        className={cx(
          'TextControl-input',
          {
            [`TextControl-input--border${ucFirst(borderMode)}`]: borderMode
          },
          inputOnly ? className : ''
        )}
      >
        {prefix ? (
          <span className={cx('TextControl-inputPrefix')}>
            {filter(prefix, data)}
          </span>
        ) : null}
        <input
          name={name}
          placeholder={placeholder}
          ref={this.inputRef}
          disabled={disabled}
          readOnly={readOnly}
          type={type}
          onFocus={this.handleFocus}
          onBlur={this.handleBlur}
          max={max}
          min={min}
          autoComplete="off"
          size={10}
          step={step}
          onChange={this.handleNormalInputChange}
          value={this.valueToString(value)}
        />
        {clearable && !disabled && value ? (
          <a onClick={this.clearValue} className={`${ns}TextControl-clear`}>
            <Icon icon="close" className="icon" />
          </a>
        ) : null}
        {showCounter ? (
          <span className={cx('TextControl-counter')}>
            {`${
              (typeof value === 'undefined' || value === null
                ? ''
                : typeof value === 'string'
                ? value
                : JSON.stringify(value)
              ).length
            }${
              typeof maxLength === 'number' && maxLength ? `/${maxLength}` : ''
            }`}
          </span>
        ) : null}
        {suffix ? (
          <span className={cx('TextControl-inputSuffix')}>
            {filter(suffix, data)}
          </span>
        ) : null}
      </div>
    );
  }

  render(): JSX.Element {
    const {
      classnames: cx,
      className,
      classPrefix: ns,
      options,
      source,
      autoComplete,
      addOn: addOnRaw,
      render,
      data,
      disabled,
      inputOnly
    } = this.props;

    const addOn: any =
      typeof addOnRaw === 'string'
        ? {
            label: addOnRaw,
            type: 'plain'
          }
        : addOnRaw;

    let input =
      autoComplete !== false && (source || options.length || autoComplete)
        ? this.renderSugestMode()
        : this.renderNormal();

    const iconElement = generateIcon(cx, addOn?.icon, 'Icon');

    let addOnDom = addOn ? (
      addOn.actionType ||
      ~['button', 'submit', 'reset', 'action'].indexOf(addOn.type) ? (
        <div className={cx(`${ns}TextControl-button`, addOn.className)}>
          {render('addOn', addOn, {
            disabled
          })}
        </div>
      ) : (
        <div className={cx(`${ns}TextControl-addOn`, addOn.className)}>
          {addOn.label ? filter(addOn.label, data) : null}
          {iconElement}
        </div>
      )
    ) : null;

    if (inputOnly) {
      return input;
    }

    return (
      <div
        className={cx(className, `${ns}TextControl`, {
          [`${ns}TextControl--withAddOn`]: !!addOnDom,
          'is-focused': this.state.isFocused,
          'is-disabled': disabled
        })}
      >
        {addOn && addOn.position === 'left' ? addOnDom : null}
        {input}
        {addOn && addOn.position !== 'left' ? addOnDom : null}
      </div>
    );
  }
}

export function mapItemIndex(
  items: Array<any>,
  values: Array<any>,
  valueField: string = 'value'
) {
  return items
    .filter(item => values.indexOf(item[valueField || 'value']) === -1)
    .reduce((prev, next, i) => {
      prev[next[valueField || 'value']] = i;
      return prev;
    }, {});
}

@OptionsControl({
  type: 'input-text'
})
export class TextControlRenderer extends TextControl {}

@OptionsControl({
  type: 'input-password'
})
export class PasswordControlRenderer extends TextControl {}

@OptionsControl({
  type: 'input-email',
  validations: 'isEmail'
})
export class EmailControlRenderer extends TextControl {}

@OptionsControl({
  type: 'input-url',
  validations: 'isUrl'
})
export class UrlControlRenderer extends TextControl {}

@OptionsControl({
  type: 'native-date'
})
export class NativeDateControlRenderer extends TextControl {}

@OptionsControl({
  type: 'native-time'
})
export class NativeTimeControlRenderer extends TextControl {}

@OptionsControl({
  type: 'native-number'
})
export class NativeNumberControlRenderer extends TextControl {}
