import React from 'react';
import Downshift, {StateChangeOptions} from 'downshift';
import {matchSorter} from 'match-sorter';
import debouce from 'lodash/debounce';
import find from 'lodash/find';
import {
  OptionsControl,
  OptionsControlProps,
  highlight,
  resolveEventData,
  CustomStyle,
  PopOver,
  Overlay,
  formatInputThemeCss,
  setThemeClassName,
  ActionObject,
  filter,
  autobind,
  createObject,
  setVariable,
  ucFirst,
  isEffectiveApi,
  getVariable
} from 'amis-core';
import {Icon, SpinnerExtraProps, Input, Spinner, OverflowTpl} from 'amis-ui';
import {ActionSchema} from '../Action';
import {FormOptionsSchema, SchemaApi} from '../../Schema';
import {supportStatic} from './StaticHoc';

import type {Option} from 'amis-core';
import type {ListenerAction} from 'amis-core';

// declare function matchSorter(items:Array<any>, input:any, options:any): Array<any>;

/**
 * Text 文本输入框。
 * 文档：https://aisuda.bce.baidu.com/amis/zh-CN/components/form/text
 */
export interface TextControlSchema extends FormOptionsSchema {
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
   * 配置原生 input 的 autoComplete 属性
   * @default off
   */
  nativeAutoComplete?: string;

  /**
   * 边框模式，全边框，还是半边框，或者没边框。
   */
  borderMode?: 'full' | 'half' | 'none';

  /**
   * 限制文字最小输入个数
   */
  minLength?: number;

  /**
   * 限制文字最大输入个数
   */
  maxLength?: number;

  /**
   * 是否显示计数
   */
  showCounter?: boolean;

  /**
   * 前缀
   */
  prefix?: string;

  /**
   * 后缀
   */
  suffix?: string;

  /**
   * 自动转换值
   */
  transform?: {
    /** 用户输入的字符自动转小写 */
    lowerCase?: boolean;
    /** 用户输入的字符自动转大写 */
    upperCase?: boolean;
  };

  /** control节点的CSS类名 */
  inputControlClassName?: string;

  /** 原生input标签的CSS类名 */
  nativeInputClassName?: string;

  /** 在内容为空的时候清除值 */
  clearValueOnEmpty?: boolean;
}

export type InputTextRendererEvent =
  | 'blur'
  | 'focus'
  | 'click'
  | 'change'
  | 'review' // 查看密码事件
  | 'encrypt' // 隐藏密码事件
  | 'enter';

export interface TextProps extends OptionsControlProps, SpinnerExtraProps {
  placeholder?: string;
  addOn?: ActionObject & {
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
  revealPassword?: boolean;
  transform?: {
    lowerCase?: boolean; // 用户输入的字符自动转小写
    upperCase?: boolean; // 用户输入的字符自动转大写
  };
  /** control节点的CSS类名 */
  inputControlClassName?: string;
  /** 原生input标签的CSS类名 */
  nativeInputClassName?: string;

  popOverContainer?: any;
}

export interface TextState {
  isOpen?: boolean;
  inputValue?: string;
  isFocused?: boolean;
  revealPassword?: boolean; // 主要用于 password 的时候切换一下显影
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
      isFocused: false,
      revealPassword: false
    };
    this.focus = this.focus.bind(this);
    this.clearValue = this.clearValue.bind(this);
    this.toggleRevealPassword = this.toggleRevealPassword.bind(this);
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
    trimContents: true,
    nativeAutoComplete: 'off'
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
      } else if (addHook) {
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
    if (prevProps.revealPassword !== props.revealPassword) {
      /** 隐藏按钮的同时将密码设置为隐藏态 */
      !props.revealPassword && this.setState({revealPassword: false});
    }
  }

  componentWillUnmount() {
    this.unHook && this.unHook();
  }

  inputRef(ref: any) {
    this.input = ref;
  }

  doAction(
    action: ListenerAction,
    data: any,
    throwErrors: boolean = false,
    args?: any
  ) {
    const actionType = action?.actionType as string;

    if (actionType === 'reset') {
      this.resetValue();
    } else if (actionType === 'clear') {
      this.clearValue();
    } else if (actionType === 'focus') {
      this.focus();
    } else if (actionType === 'review') {
      this.setState({revealPassword: true});
    } else if (actionType === 'encrypt') {
      this.setState({revealPassword: false});
    }
  }

  focus() {
    if (!this.input) {
      return;
    }

    this.input.focus();

    // 光标放到最后
    const len = this.input.value.length;
    if (len) {
      // type为email的input元素不支持setSelectionRange，先改为text
      if (this.input.type === 'email') {
        this.input.type = 'text';
        this.input.setSelectionRange(len, len);
        this.input.type = 'email';
      } else {
        this.input.setSelectionRange(len, len);
      }
    }
  }

  async resetValue() {
    const {onChange, dispatchEvent, resetValue, formStore, store, name} =
      this.props;
    const pristineVal =
      getVariable(formStore?.pristine ?? store?.pristine, name) ?? resetValue;

    const changeEvent = await dispatchEvent(
      'change',
      resolveEventData(this.props, {value: pristineVal})
    );

    if (changeEvent?.prevented) {
      return;
    }

    onChange(pristineVal);

    this.setState(
      {
        inputValue: pristineVal
      },
      () => {
        //this.focus();
        this.loadAutoComplete();
      }
    );
  }

  async clearValue() {
    const {onChange, dispatchEvent, clearValueOnEmpty} = this.props;
    let resetValue = this.props.resetValue;

    if (clearValueOnEmpty && resetValue === '') {
      resetValue = undefined;
    }

    const clearEvent = await dispatchEvent(
      'clear',
      resolveEventData(this.props, {value: resetValue})
    );

    if (clearEvent?.prevented) {
      return;
    }

    const changeEvent = await dispatchEvent(
      'change',
      resolveEventData(this.props, {value: resetValue})
    );

    if (changeEvent?.prevented) {
      return;
    }

    onChange(resetValue);
    this.setState(
      {
        inputValue: resetValue
      },
      () => {
        //this.focus();
        this.loadAutoComplete();
      }
    );
  }

  removeItem(index: number) {
    const {selectedOptions, onChange} = this.props;

    const newValue = selectedOptions.concat();
    newValue.splice(index, 1);

    onChange(this.normalizeValue(newValue));
  }

  async handleClick(event: React.MouseEvent) {
    const {dispatchEvent, value, multiple} = this.props;
    const rendererEvent = await dispatchEvent(
      'click',
      resolveEventData(this.props, {
        value
      })
    );

    if (rendererEvent?.prevented) {
      return;
    }

    if (multiple || event.target === this.input) {
      // 已经 focus 的就不重复执行，否则总重新定位光标
      this.state.isFocused || this.focus();
      this.setState({
        isOpen: true
      });
    }
  }

  async handleFocus(e: any) {
    const {dispatchEvent, onFocus, value} = this.props;
    this.setState({
      isOpen: true,
      isFocused: true
    });

    const rendererEvent = await dispatchEvent(
      'focus',
      resolveEventData(this.props, {
        value
      })
    );

    if (rendererEvent?.prevented) {
      return;
    }

    onFocus?.(e);
  }

  async handleBlur(e: any) {
    const {onBlur, trimContents, value, onChange, dispatchEvent} = this.props;

    this.setState(
      {
        isFocused: false
      },
      () => {
        if (trimContents && value && typeof value === 'string') {
          const trimedValue = value.trim();

          // 因为下发给 Input 的 value 可能不会变，所以这里需要手动同步一下
          if (this.input) {
            this.input.value = trimedValue;
          }
          onChange(trimedValue);
        }
      }
    );

    const rendererEvent = await dispatchEvent(
      'blur',
      resolveEventData(this.props, {
        value
      })
    );

    if (rendererEvent?.prevented) {
      return;
    }

    onBlur && onBlur(e);
  }

  @autobind
  close() {
    this.setState({
      isFocused: false
    });
  }

  async handleInputChange(evt: React.ChangeEvent<HTMLInputElement>) {
    let value = this.transformValue(evt.currentTarget.value);
    const {creatable, multiple, onChange, dispatchEvent} = this.props;
    const rendererEvent = await dispatchEvent(
      'change',
      resolveEventData(this.props, {value})
    );

    if (rendererEvent?.prevented) {
      return;
    }

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

  async handleKeyDown(evt: React.KeyboardEvent<HTMLInputElement>) {
    const {selectedOptions, onChange, multiple, creatable, dispatchEvent} =
      this.props;
    const valueField = this.props?.valueField || 'value';

    if (selectedOptions.length && !this.state.inputValue && evt.keyCode === 8) {
      evt.preventDefault();
      const newValue = selectedOptions.concat();
      newValue.pop();

      onChange(this.normalizeValue(newValue));

      this.setState(
        {
          inputValue: ''
        },
        this.loadAutoComplete
      );
    } else if (
      evt.key === 'Enter' &&
      this.state.inputValue &&
      typeof this.highlightedIndex !== 'number' &&
      creatable !== false
    ) {
      evt.preventDefault();
      let value: string | Array<string | any> = this.state.inputValue;

      if (multiple && value) {
        if (!find(selectedOptions, item => item[valueField] == value)) {
          const newValue = selectedOptions.concat();
          newValue.push({
            label: value,
            value: value
          });

          value = this.normalizeValue(newValue).concat();
        } else {
          value = this.normalizeValue(selectedOptions).concat();
        }
      }

      const rendererEvent = await dispatchEvent(
        'enter',
        resolveEventData(this.props, {value})
      );

      if (rendererEvent?.prevented) {
        return;
      }

      onChange(value);

      this.setState(
        {
          inputValue: multiple ? '' : (value as string),
          isOpen: false
        },
        this.loadAutoComplete
      );
    } else if (
      evt.key === 'Enter' &&
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
      options,
      selectedOptions,
      creatable,
      valueField
    } = this.props;
    // Downshift传入的selectedItem是valueField字段，需要取回选项
    const toggledOption = options.find(
      item => item[valueField || 'value'] === value
    );

    if (multiple) {
      const newValue = selectedOptions.concat();
      if (toggledOption) {
        newValue.push(toggledOption);
      } else if (value && creatable !== false) {
        newValue.push({
          label: value,
          value
        });
      }
      onChange(this.normalizeValue(newValue));
    } else {
      onChange(toggledOption ? this.normalizeValue(toggledOption) : value);
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
  async handleNormalInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const {onChange, dispatchEvent, trimContents, clearValueOnEmpty} =
      this.props;
    let value: string | undefined = this.transformValue(e.currentTarget.value);
    if (typeof value === 'string') {
      if (trimContents) {
        value = value.trim();
      }

      if (clearValueOnEmpty && value === '') {
        value = undefined;
      }
    }

    const rendererEvent = await dispatchEvent(
      'change',
      resolveEventData(this.props, {value})
    );

    if (rendererEvent?.prevented) {
      return;
    }

    onChange(value);
  }

  normalizeValue(value: Option[] | Option | undefined | null) {
    const {multiple, delimiter, joinValues, extractValue, valueField} =
      this.props;
    const selectedOptions = Array.isArray(value) ? value : value ? [value] : [];

    if (joinValues) {
      return selectedOptions
        .map(item => item[valueField || 'value'])
        .join(delimiter || ',');
    } else if (extractValue) {
      const mappedValue = selectedOptions.map(
        item => item[valueField || 'value']
      );
      return multiple ? mappedValue : mappedValue[0];
    } else {
      return multiple ? selectedOptions : selectedOptions[0];
    }
  }

  transformValue(value: string) {
    const {transform} = this.props;

    if (!transform) {
      return value;
    }

    Object.keys(transform).forEach((key: 'lowerCase' | 'upperCase') => {
      const propValue = transform[key];
      switch (key) {
        case 'lowerCase':
          propValue && (value = value.toLowerCase());
          break;
        case 'upperCase':
          propValue && (value = value.toUpperCase());
          break;
      }
    });

    return value;
  }

  loadAutoComplete() {
    const {formItem, autoComplete, data} = this.props;

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

  reload(subpath?: string, query?: any) {
    const reload = this.props.reloadOptions;
    reload && reload(subpath, query);
  }

  valueToString(value: any) {
    return typeof value === 'undefined' || value === null
      ? ''
      : typeof value === 'string'
      ? value
      : value instanceof Date
      ? value.toISOString()
      : JSON.stringify(value);
  }

  @autobind
  getTarget() {
    return this.input?.parentElement;
  }

  renderSugestMode() {
    const {
      className,
      style,
      inputControlClassName,
      nativeInputClassName,
      inputOnly,
      value,
      placeholder,
      classnames: cx,
      disabled,
      readOnly,
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
      showCounter,
      data,
      maxLength,
      minLength,
      translate: __,
      loadingConfig,
      popOverContainer,
      themeCss,
      css,
      id,
      nativeAutoComplete,
      testIdBuilder
    } = this.props;
    let type = this.props.type?.replace(/^(?:native|input)\-/, '');

    return (
      <Downshift
        isOpen={this.state.isOpen && !disabled && !readOnly}
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
                  keys: [labelField || 'label', valueField || 'value'],
                  threshold: matchSorter.rankings.CONTAINS
                })
              : options;
          const indices = isOpen
            ? mapItemIndex(filtedOptions, selectedItem)
            : {};
          filtedOptions = filtedOptions.filter(
            (option: any) => !~selectedItem.indexOf(option.value)
          );

          if (
            this.state.inputValue &&
            creatable !== false &&
            multiple &&
            !filtedOptions.some(
              (option: any) => option.value === this.state.inputValue
            ) &&
            !~selectedItem.indexOf(this.state.inputValue)
          ) {
            filtedOptions.push({
              [labelField || 'label']: this.state.inputValue,
              [valueField || 'value']: this.state.inputValue,
              isNew: true
            });
          }

          const filteredPlaceholder = filter(placeholder, data);

          return (
            <div
              className={cx(
                `TextControl-input TextControl-input--withAC`,
                inputControlClassName,
                setThemeClassName({
                  ...this.props,
                  name: 'inputControlClassName',
                  id,
                  themeCss: themeCss || css
                }),
                setThemeClassName({
                  ...this.props,
                  name: 'inputControlClassName',
                  id,
                  themeCss: themeCss || css,
                  extra: 'inner'
                }),
                inputOnly ? className : '',
                {
                  'is-opened': isOpen,
                  'TextControl-input--multiple': multiple,
                  [`TextControl-input--border${ucFirst(borderMode)}`]:
                    borderMode
                }
              )}
              onClick={this.handleClick}
              {...testIdBuilder?.getTestId()}
            >
              <>
                {filteredPlaceholder &&
                !selectedOptions.length &&
                !this.state.inputValue &&
                !this.state.isFocused ? (
                  <div className={cx('TextControl-placeholder')}>
                    {filteredPlaceholder}
                  </div>
                ) : null}

                {selectedOptions.map((item, index) =>
                  multiple ? (
                    <div className={cx('TextControl-value')} key={index}>
                      <OverflowTpl
                        className={cx('TextControl-valueLabel')}
                        tooltip={`${item[labelField || 'label']}`}
                      >
                        {`${item[labelField || 'label']}`}
                      </OverflowTpl>
                      <Icon
                        icon="close"
                        className={cx('TextControl-valueIcon', 'icon')}
                        onClick={this.removeItem.bind(this, index)}
                      />
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
                    readOnly,
                    type,
                    onFocus: this.handleFocus,
                    onBlur: this.handleBlur,
                    onChange: this.handleInputChange,
                    onKeyDown: this.handleKeyDown,
                    maxLength,
                    minLength
                  })}
                  autoComplete={nativeAutoComplete}
                  size={10}
                  className={cx(nativeInputClassName)}
                />
              </>

              {clearable && !disabled && !readOnly && value ? (
                <a
                  onClick={this.clearValue}
                  className={cx('TextControl-clear')}
                >
                  <Icon
                    icon="input-clear"
                    className="icon"
                    iconContent="InputText-clear"
                  />
                </a>
              ) : null}

              {showCounter ? (
                <span className={cx('TextControl-counter')}>
                  {`${this.valueToString(value)?.length}${
                    typeof maxLength === 'number' && maxLength
                      ? `/${maxLength}`
                      : ''
                  }`}
                </span>
              ) : null}

              {loading ? (
                <Spinner
                  show
                  icon="reload"
                  size="sm"
                  spinnerClassName={cx('TextControl-spinner')}
                  loadingConfig={loadingConfig}
                />
              ) : null}

              <Overlay
                container={popOverContainer || this.getTarget}
                target={this.getTarget}
                show={!!(isOpen && filtedOptions.length)}
              >
                <PopOver
                  className={cx('TextControl-popover')}
                  style={{
                    width: this.input
                      ? this.input.parentElement!.offsetWidth
                      : 'auto'
                  }}
                >
                  <div className={cx('TextControl-sugs')}>
                    {filtedOptions.map((option: any) => {
                      const label = option[labelField || 'label'];
                      const value = option[valueField || 'value'];

                      return (
                        <div
                          {...getItemProps({
                            item: value,
                            disabled: option.disabled,
                            className: cx(`TextControl-sugItem`, {
                              'is-highlight':
                                highlightedIndex === indices[value],
                              'is-disabled': option.disabled || option.readOnly
                            })
                          })}
                          key={value}
                        >
                          {option.isNew ? (
                            <span>
                              {__('Text.add', {label: label})}
                              <Icon icon="enter" className="icon" />
                            </span>
                          ) : (
                            <span>
                              {option.disabled
                                ? label
                                : highlight(label, inputValue as string)}
                              {option.tip}
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </PopOver>
              </Overlay>
            </div>
          );
        }}
      </Downshift>
    );
  }

  async toggleRevealPassword() {
    const {dispatchEvent, value} = this.props;
    const eventName = this.state.revealPassword ? 'encrypt' : 'review';

    const rendererEvent = await dispatchEvent(
      eventName,
      resolveEventData(this.props, {
        value
      })
    );

    if (rendererEvent?.prevented || rendererEvent?.stoped) {
      return;
    }

    this.setState({revealPassword: !this.state.revealPassword});
  }

  renderNormal(): JSX.Element {
    const {
      classPrefix: ns,
      classnames: cx,
      className,
      style,
      inputControlClassName,
      nativeInputClassName,
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
      revealPassword = true,
      name,
      borderMode,
      prefix,
      suffix,
      data,
      showCounter,
      maxLength,
      minLength,
      themeCss,
      css,
      id,
      nativeAutoComplete,
      testIdBuilder
    } = this.props;

    const type = this.props.type?.replace(/^(?:native|input)\-/, '');

    return (
      <div
        className={cx(
          'TextControl-input',
          {
            [`TextControl-input--border${ucFirst(borderMode)}`]: borderMode
          },
          setThemeClassName({
            ...this.props,
            name: 'inputControlClassName',
            id,
            themeCss: themeCss || css
          }),
          setThemeClassName({
            ...this.props,
            name: 'inputControlClassName',
            id,
            themeCss: themeCss || css,
            extra: 'inner'
          }),
          inputControlClassName,
          inputOnly ? className : ''
        )}
        {...testIdBuilder?.getTestId()}
      >
        {prefix ? (
          <span className={cx('TextControl-inputPrefix')}>
            {filter(prefix, data)}
          </span>
        ) : null}
        <Input
          name={name}
          placeholder={filter(placeholder, data)}
          ref={this.inputRef}
          disabled={disabled}
          readOnly={readOnly}
          type={this.state.revealPassword ? 'text' : type}
          onFocus={this.handleFocus}
          onBlur={this.handleBlur}
          max={max}
          min={min}
          maxLength={maxLength}
          minLength={minLength}
          autoComplete={nativeAutoComplete}
          size={10}
          step={step}
          onChange={this.handleNormalInputChange}
          value={this.valueToString(value)}
          className={cx(nativeInputClassName, {
            'TextControl-input-password': type === 'password' && revealPassword
          })}
          {...testIdBuilder?.getChild('input').getTestId()}
        />
        {clearable && !disabled && !readOnly && value ? (
          <a onClick={this.clearValue} className={cx('TextControl-clear')}>
            <Icon
              icon="input-clear"
              className="icon"
              iconContent="InputText-clear"
            />
          </a>
        ) : null}
        {type === 'password' && revealPassword && !disabled ? (
          <a
            onClick={this.toggleRevealPassword}
            className={cx('TextControl-revealPassword')}
          >
            {this.state.revealPassword ? (
              <Icon
                icon="view"
                className={cx('TextControl-icon-view')}
                classNameProp={cx('TextControl-icon-view')}
                iconContent="InputText-view"
              />
            ) : (
              <Icon
                icon="invisible"
                className={cx('TextControl-icon-invisible')}
                classNameProp={cx('TextControl-icon-invisible')}
                iconContent="InputText-invisible"
              />
            )}
          </a>
        ) : null}
        {showCounter ? (
          <span className={cx('TextControl-counter')}>
            {`${this.valueToString(value)?.length}${
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

  renderBody(body: JSX.Element) {
    const {
      classnames: cx,
      className,
      style,
      classPrefix: ns,
      addOn: addOnRaw,
      render,
      data,
      disabled,
      readOnly,
      inputOnly,
      static: isStatic,
      addOnClassName,
      themeCss,
      css,
      id
    } = this.props;

    const addOn: any =
      typeof addOnRaw === 'string'
        ? {
            label: addOnRaw,
            type: 'plain'
          }
        : addOnRaw;

    const iconElement = <Icon cx={cx} icon={addOn?.icon} className="Icon" />;

    let addOnDom =
      addOn && !isStatic ? (
        addOn.actionType ||
        ~['button', 'submit', 'reset', 'action'].indexOf(addOn.type) ? (
          <div
            className={cx(
              `${ns}TextControl-button`,
              addOnClassName,
              setThemeClassName({
                ...this.props,
                name: 'addOnClassName',
                id,
                themeCss: themeCss || css,
                extra: 'addOn'
              })
            )}
          >
            {render('addOn', addOn, {
              disabled
            })}
          </div>
        ) : (
          <div
            className={cx(
              `${ns}TextControl-addOn`,
              addOnClassName,
              setThemeClassName({
                ...this.props,
                name: 'addOnClassName',
                id,
                themeCss: themeCss || css,
                extra: 'addOn'
              })
            )}
          >
            {iconElement}
            {addOn.label ? filter(addOn.label, data) : null}
          </div>
        )
      ) : null;

    if (inputOnly) {
      return body;
    }

    const classNames = !isStatic
      ? cx(className, `${ns}TextControl`, {
          [`${ns}TextControl--withAddOn`]: !!addOnDom,
          'is-focused': this.state.isFocused,
          'is-disabled': disabled || readOnly
        })
      : cx(`${ns}TextControl`, {
          [`${ns}TextControl--withAddOn`]: !!addOnDom
        });

    return (
      <div className={classNames} style={style}>
        {addOn && addOn.position === 'left' ? addOnDom : null}
        {body}
        {addOn && addOn.position !== 'left' ? addOnDom : null}
      </div>
    );
  }

  /**
   * 处理input的自定义样式
   */
  @autobind
  @supportStatic()
  render(): JSX.Element {
    const {
      options,
      source,
      autoComplete,
      themeCss,
      css,
      id,
      env,
      classPrefix: ns
    } = this.props;
    let input =
      autoComplete !== false && (source || options?.length || autoComplete)
        ? this.renderSugestMode()
        : this.renderNormal();

    return (
      <>
        {this.renderBody(input)}
        <CustomStyle
          {...this.props}
          config={{
            themeCss: themeCss || css,
            classNames: [
              {
                key: 'inputControlClassName',
                weights: {
                  focused: {
                    parent: `.${ns}TextControl.is-focused`
                  },
                  disabled: {
                    parent: `.${ns}TextControl.is-disabled`
                  }
                }
              }
            ],
            id: id
          }}
          env={env}
        />
        <CustomStyle
          {...this.props}
          config={{
            themeCss: formatInputThemeCss(themeCss || css),
            classNames: [
              {
                key: 'inputControlClassName',
                weights: {
                  default: {
                    inner: 'input'
                  },
                  hover: {
                    inner: 'input'
                  },
                  focused: {
                    parent: `.${ns}TextControl.is-focused`,
                    inner: 'input'
                  },
                  disabled: {
                    parent: `.${ns}TextControl.is-disabled`,
                    inner: 'input'
                  }
                }
              }
            ],
            id: id && id + '-inner'
          }}
          env={env}
        />

        <CustomStyle
          {...this.props}
          config={{
            themeCss: themeCss || css,
            classNames: [
              {
                key: 'addOnClassName'
              }
            ],
            id: id && id + '-addOn'
          }}
          env={env}
        />
      </>
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
  type: 'input-text',
  alias: ['input-password', 'native-date', 'native-time', 'native-number']
})
export class TextControlRenderer extends TextControl {}

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
