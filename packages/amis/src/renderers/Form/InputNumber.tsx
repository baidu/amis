import React from 'react';
import {toFixed} from '@rc-component/mini-decimal';
import {
  FormItem,
  FormControlProps,
  FormBaseControl,
  resolveEventData,
  CustomStyle,
  formatInputThemeCss,
  setThemeClassName,
  TestIdBuilder,
  getVariable
} from 'amis-core';
import cx from 'classnames';
import {NumberInput, Select} from 'amis-ui';
import {
  filter,
  autobind,
  createObject,
  numberFormatter,
  numberReverter,
  safeSub,
  normalizeOptions,
  Option,
  PlainObject,
  ActionObject
} from 'amis-core';
import {FormBaseControlSchema} from '../../Schema';
import {supportStatic} from './StaticHoc';

/**
 * 数字输入框
 * 文档：https://aisuda.bce.baidu.com/amis/zh-CN/components/form/input-number
 */
export interface NumberControlSchema extends FormBaseControlSchema {
  type: 'input-number';

  /**
   * 最大值
   */
  max?: number;

  /**
   * 最小值
   */
  min?: number;

  /**
   * 步长
   */
  step?: number;

  /**
   * 精度
   */
  precision?: number;

  /**
   * 是否显示上下点击按钮
   */
  showSteps?: boolean;

  /**
   * 边框模式，全边框，还是半边框，或者没边框。
   */
  borderMode?: 'full' | 'half' | 'none';

  /**
   * 前缀
   */
  prefix?: string;

  /**
   * 后缀
   */
  suffix?: string;

  /**
   * 单位列表
   */
  unitOptions?: string | Array<Option> | string[] | PlainObject;

  /**
   * 是否是大数，如果是的话输入输出都将是字符串
   */
  big?: boolean;

  /**
   * 是否千分分隔
   */
  kilobitSeparator?: boolean;

  /**
   * 只读
   */
  readOnly?: boolean;

  /**
   * 是否启用键盘行为
   */
  keyboard?: boolean;

  /**
   * 输入框为基础输入框还是加强输入框
   */
  displayMode?: 'base' | 'enhance';

  /**
   * 用来开启百分号的展示形式
   */
  showAsPercent?: boolean;
}

export interface NumberProps extends FormControlProps {
  placeholder?: string;
  max?: number | string;
  min?: number | string;
  step?: number;

  /**
   *  精度
   */
  precision?: number;

  /**
   * 边框模式，全边框，还是半边框，或者没边框。
   */
  borderMode?: 'full' | 'half' | 'none';

  /**
   * 前缀
   */
  prefix?: string;

  /**
   * 后缀
   */
  suffix?: string;

  /**
   * 是否千分分隔
   */
  kilobitSeparator?: boolean;

  /**
   * 只读
   */
  readOnly?: boolean;

  /**
   * 启用键盘行为，即通过上下方向键控制是否生效
   */
  keyboard?: boolean;

  /**
   * 输入框为基础输入框还是加强输入框
   */
  displayMode?: 'base' | 'enhance';

  /**
   * 是否是大数，如果是的话输入输出都将是字符串
   */
  big?: boolean;

  /**
   * 是否在清空内容时从数据域中删除该表单项对应的值
   */
  clearValueOnEmpty?: boolean;

  testIdBuilder?: TestIdBuilder;

  /**
   * 用来开启百分号的展示形式，搭配suffix使用
   */
  showAsPercent?: boolean;
}

interface NumberState {
  // 数字单位，将会影响输出
  unit?: string;
  unitOptions?: Option[];
}

export type InputNumberRendererEvent = 'blur' | 'focus' | 'change';
export type InputNumberRendererAction = 'clear';

export default class NumberControl extends React.Component<
  NumberProps,
  NumberState
> {
  input?: HTMLInputElement;
  static defaultProps: Partial<NumberProps> = {
    step: 1,
    resetValue: '',
    clearValueOnEmpty: false
  };

  constructor(props: NumberProps) {
    super(props);

    this.handleChange = this.handleChange.bind(this);
    this.handleChangeUnit = this.handleChangeUnit.bind(this);
    const unit = this.getUnit();
    const unitOptions = normalizeOptions(props.unitOptions);
    const {formItem, value} = props;

    formItem && this.formatNumber(value, true);

    this.state = {unit, unitOptions};
  }

  /**
   * 动作处理
   */
  doAction(
    action: ActionObject,
    data: any,
    throwErrors: boolean = false,
    args?: any
  ) {
    const actionType = action?.actionType as string;
    const {
      min,
      max,
      precision,
      step,
      resetValue,
      big,
      onChange,
      clearValueOnEmpty,
      formStore,
      store,
      name
    } = this.props;

    if (actionType === 'clear') {
      onChange?.(clearValueOnEmpty ? undefined : '');
    } else if (actionType === 'reset') {
      const finalPrecision = NumberInput.normalizePrecision(
        this.filterNum(precision),
        this.filterNum(step)
      );
      const pristineVal =
        getVariable(formStore?.pristine ?? store?.pristine, name) ?? resetValue;
      const value = NumberInput.normalizeValue(
        pristineVal ?? '',
        this.filterNum(min, big),
        this.filterNum(max, big),
        finalPrecision,
        pristineVal ?? '',
        clearValueOnEmpty,
        big
      );

      onChange?.(clearValueOnEmpty && value === '' ? undefined : value);
    }
  }

  formatNumber(value: any, setPrinstine = false) {
    const {showAsPercent, suffix, step, big, setPrinstineValue} = this.props;
    let {precision} = this.props;
    //展示百分号情况下，需要精度加2后，才能保持跟配置一致
    if (showAsPercent && suffix === '%') {
      precision = (precision || 0) + 2;
    }
    const unit = this.getUnit();
    const unitOptions = normalizeOptions(this.props.unitOptions);
    const normalizedPrecision = NumberInput.normalizePrecision(
      this.filterNum(precision),
      this.filterNum(step)
    );
    if (
      value != null &&
      normalizedPrecision != null &&
      (!unit || unitOptions.length === 0) &&
      // 大数下不需要进行精度处理，因为是字符串
      big !== true
    ) {
      // 精度处理，遵循四舍五入的处理规则
      const normalizedValue = parseFloat(
        toFixed(value.toString(), '.', normalizedPrecision)
      );

      if (!isNaN(normalizedValue) && normalizedValue !== value) {
        value = normalizedValue;
        setPrinstine && setPrinstineValue(normalizedValue);
      }
    }
    return value;
  }

  // 解析出单位
  getUnit() {
    const props = this.props;
    if (props.unitOptions && props.unitOptions.length) {
      const optionValues = normalizeOptions(props.unitOptions).map(
        option => option.value
      );
      // 如果有值就解析出来作为单位
      if (props.value && typeof props.value === 'string') {
        let unit = optionValues[0];
        // 先找长的字符，这样如果有 ab 和 b 两种后缀相同的也能识别
        optionValues.sort((a, b) => b.length - a.length);
        for (const optionValue of optionValues) {
          if (props.value.endsWith(optionValue)) {
            unit = optionValue;
            break;
          }
        }
        return unit;
      } else {
        // 没有值就使用第一个单位
        return optionValues[0];
      }
    }
    return undefined;
  }

  getValue(inputValue: any) {
    const {resetValue, unitOptions} = this.props;

    if (
      inputValue &&
      typeof inputValue !== 'number' &&
      typeof inputValue !== 'string'
    ) {
      return;
    }

    if (inputValue !== null && unitOptions && this.state.unit) {
      inputValue = inputValue + String(this.state.unit);
    }
    return inputValue === null ? resetValue ?? null : inputValue;
  }

  // 派发有event的事件
  @autobind
  async dispatchEvent(eventName: string) {
    const {dispatchEvent, value} = this.props;

    dispatchEvent(eventName, resolveEventData(this.props, {value}));
  }

  async handleChange(inputValue: any) {
    const {onChange, dispatchEvent, clearValueOnEmpty} = this.props;
    const value = this.getValue(inputValue);
    let resultValue = clearValueOnEmpty && value === '' ? undefined : value;

    // 精度处理
    resultValue = this.formatNumber(resultValue);
    const rendererEvent = await dispatchEvent(
      'change',
      resolveEventData(this.props, {value: resultValue})
    );
    if (rendererEvent?.prevented) {
      return;
    }
    onChange(resultValue);

    // 移动光标的方式会引发其他问题，暂不使用这种方式
    // setTimeout(() => {
    //   this.changeCursorPos(+resultValue);
    // }, 0);
  }

  // 取真实用户输入的值去改变光标的位置
  @autobind
  changeCursorPos(value: number) {
    if (isNaN(value)) {
      return;
    }
    const {kilobitSeparator, prefix} = this.props;
    const integer = value > 0 ? Math.floor(value) : Math.ceil(value);
    let pos = `${value}`.length;

    if (prefix) {
      pos += prefix.length;
    }

    if (kilobitSeparator) {
      // 处理有千分符的情况 123,456,789
      const ksLen = Math.floor((`${Math.abs(integer)}`.length - 1) / 3);
      if (ksLen > 0) {
        pos += ksLen;
      }
    }

    if (this.input && (kilobitSeparator || prefix)) {
      this.input.setSelectionRange?.(pos, pos);
    }
  }
  filterNum(value: number | string | undefined): number | undefined;
  filterNum(
    value: number | string | undefined,
    isbig: boolean | undefined
  ): number | string | undefined;
  /** 处理数字类的props，支持从数据域获取变量值 */
  filterNum(value: number | string | undefined, isbig: boolean = false) {
    if (typeof value === 'undefined') {
      return undefined;
    }
    if (typeof value !== 'number') {
      value = filter(value, this.props.data);
      // 大数模式，不转数字
      value = /^[-]?\d+/.test(value) ? (isbig ? value : +value) : undefined;
    }
    return value;
  }

  // 单位选项的变更
  handleChangeUnit(option: Option) {
    let value = this.props.value;
    const prevUnitValue = this.state.unit;
    this.setState({unit: option.value}, () => {
      if (value) {
        value = value.toString().replace(prevUnitValue, '');
        this.props.onChange(value + this.state.unit);
      }
    });
  }

  componentDidUpdate(prevProps: NumberProps) {
    const unit = this.getUnit();
    const {value, formInited, onChange, setPrinstineValue} = this.props;
    if (
      value != null &&
      (typeof value === 'string' || typeof value === 'number') &&
      unit &&
      !String(value).endsWith(unit)
    ) {
      const finalValue = this.getValue(value);
      formInited === false
        ? setPrinstineValue?.(finalValue)
        : onChange?.(finalValue);
    }
    // 匹配 数字 + ?字符
    const reg = /^([-+]?(([1-9]\d*\.?\d*)|(0\.\d*[1-9]))[^\d\.]*)$/;
    if (this.props.value !== prevProps.value && reg.test(this.props.value)) {
      this.setState({unit: unit});
    }

    if (this.props.unitOptions !== prevProps.unitOptions) {
      this.setState({unitOptions: normalizeOptions(this.props.unitOptions)});
    }
  }
  @autobind
  inputRef(ref: any) {
    this.input = ref;
  }
  focus() {
    if (!this.input) {
      return;
    }
    this.input.focus();
  }

  @supportStatic()
  render() {
    const {
      className,
      style,
      classPrefix: ns,
      value,
      step,
      precision,
      max,
      min,
      disabled,
      placeholder,
      showSteps,
      borderMode,
      suffix,
      prefix,
      kilobitSeparator,
      unitOptions,
      readOnly,
      keyboard,
      displayMode,
      big,
      resetValue,
      clearValueOnEmpty,
      css,
      themeCss,
      inputControlClassName,
      id,
      env,
      name,
      showAsPercent,
      testIdBuilder,
      popOverContainer
    } = this.props;
    const {unit} = this.state;
    const finalPrecision = this.filterNum(precision);
    // 数据格式化
    const formatter =
      kilobitSeparator || prefix || suffix
        ? (
            value: string | number,
            {userTyping, input}: {userTyping: boolean; input: string}
          ) => {
            // 增加千分分隔
            if (kilobitSeparator && value) {
              if (
                (userTyping || this.input === document.activeElement) &&
                numberReverter(value) === numberReverter(this.input?.value)
              ) {
                // 如果是用户输入状态，且value与输入框内值相同，则只进行千分隔处理，避免光标乱跳
                let parts = value.toString().split('.');
                parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
                value = parts.join('.');
              } else {
                // 如果是非用户输入状态（如 blur），则进行千分隔 + 精度处理
                value = numberFormatter(value, finalPrecision);
              }
            }
            if (
              suffix &&
              userTyping &&
              this.input?.selectionStart === input.length
            ) {
              return `${prefix || ''}${value}`;
            }

            return `${prefix || ''}${value}${suffix || ''}`;
          }
        : undefined;
    // 将数字还原
    const parser = (value: string) => {
      if (value) {
        prefix && (value = value.replace(prefix, ''));
        suffix && (value = value.replace(suffix, ''));
        kilobitSeparator && (value = value.replace(/,/g, ''));
      }
      return value;
    };

    const finalValue =
      unit && value && typeof value === 'string'
        ? value.replace(unit, '')
        : isNaN(value)
        ? void 0
        : value;

    return (
      <div
        className={cx(
          `${ns}NumberControl`,
          {
            [`${ns}NumberControl--withUnit`]: unitOptions
          },
          className
        )}
        style={style}
      >
        <NumberInput
          name={name}
          inputControlClassName={cx(
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
            })
          )}
          inputRef={this.inputRef}
          value={finalValue}
          resetValue={resetValue}
          step={step}
          max={this.filterNum(max, big)}
          min={this.filterNum(min, big)}
          formatter={formatter}
          parser={parser}
          onChange={this.handleChange}
          disabled={disabled}
          placeholder={placeholder}
          precision={finalPrecision}
          showSteps={showSteps}
          borderMode={borderMode}
          readOnly={readOnly}
          suffix={suffix}
          showAsPercent={showAsPercent}
          onFocus={() => this.dispatchEvent('focus')}
          onBlur={() => this.dispatchEvent('blur')}
          keyboard={keyboard}
          displayMode={displayMode}
          big={big}
          clearValueOnEmpty={clearValueOnEmpty}
          testIdBuilder={testIdBuilder}
        />
        {Array.isArray(unitOptions) && unitOptions.length !== 0 ? (
          unitOptions.length > 1 ? (
            <Select
              value={unit}
              clearable={false}
              options={this.state.unitOptions || []}
              onChange={this.handleChangeUnit}
              className={`${ns}NumberControl-unit`}
              disabled={disabled}
              popOverContainer={popOverContainer}
            />
          ) : (
            <div
              className={cx(
                `${ns}NumberControl-unit`,
                `${ns}NumberControl-single-unit`,
                `${ns}Select`,
                `${readOnly ? `${ns}NumberControl-readonly` : ''}`
              )}
            >
              {typeof unitOptions[0] === 'string'
                ? unitOptions[0]
                : unitOptions[0].label}
            </div>
          )
        ) : null}
        <CustomStyle
          {...this.props}
          config={{
            themeCss: themeCss || css,
            classNames: [
              {
                key: 'inputControlClassName',
                weights: {
                  focused: {
                    pre: `${ns}Number-${
                      displayMode ? displayMode + '-' : ''
                    }focused.`
                  },
                  disabled: {
                    pre: `${ns}Number-${
                      displayMode ? displayMode + '-' : ''
                    }disabled.`
                  }
                }
              }
            ],
            id
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
                    pre: `${ns}Number-${
                      displayMode ? displayMode + '-' : ''
                    }focused.`,
                    inner: 'input'
                  },
                  disabled: {
                    pre: `${ns}Number-${
                      displayMode ? displayMode + '-' : ''
                    }disabled.`,
                    inner: 'input'
                  }
                }
              }
            ],
            id: id && id + '-inner'
          }}
          env={env}
        />
      </div>
    );
  }
}

@FormItem({
  type: 'input-number',
  detectProps: ['unitOptions', 'precision', 'suffix']
})
export class NumberControlRenderer extends NumberControl {
  static defaultProps: Partial<FormControlProps> = {
    validations: 'isNumeric',
    ...NumberControl.defaultProps
  };
}
