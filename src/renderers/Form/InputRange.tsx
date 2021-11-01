import React from 'react';
import isNumber from 'lodash/isNumber';
import isObject from 'lodash/isObject';
import isEqual from 'lodash/isEqual';
import {FormItem, FormControlProps, FormBaseControl} from './Item';

import InputRange from '../../components/Range';
import {Icon} from '../../components/icons';
import {FormOptionsControl} from './Options';
import {stripNumber} from '../../utils/tpl-builtin';

/**
 * Range
 * 文档：https://baidu.gitee.io/amis/docs/components/form/range
 */
export interface RangeControlSchema extends FormBaseControl {
  type: 'input-range';

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
   * 单位
   */
  unit?: string;
}

export interface RangeProps extends FormControlProps {
  max?: number;
  min?: number;
  step?: number;
  unit?: string;
  clearable?: boolean;
  name?: string;
  showInput?: boolean;
  className?: string;
  value: any;
  onChange: (value: any) => void;
  multiple?: boolean;
  joinValues?: boolean;
  delimiter?: string;
}

export interface DefaultProps {
  max: number;
  min: number;
  step: number;
  unit: string;
  clearable: boolean;
  disabled: boolean;
  showInput: boolean;
  multiple: boolean;
  joinValues: boolean;
  delimiter: string;
}

export function formatValue(
  value: string | number | {min: number; max: number},
  props: Partial<RangeProps>
) {
  if (props.multiple) {
    if (typeof value === 'string') {
      const [minValue, maxValue] = value
        .split(props.delimiter || ',')
        .map(v => Number(v));
      return {
        min:
          (props.min && minValue < props.min && props.min) ||
          minValue ||
          props.min,
        max:
          (props.max && maxValue > props.max && props.max) ||
          maxValue ||
          props.max
      };
    } else if (typeof value === 'object') {
      return {
        min:
          (props.min && value.min < props.min && props.min) ||
          value.min ||
          props.min,
        max:
          (props.max && value.max > props.max && props.max) ||
          value.max ||
          props.max
      };
    }
  }
  return value ?? props.min;
}

type PropsWithDefaults = RangeProps & DefaultProps;

export interface RangeState {
  value:
    | {
        min?: number;
        max?: number;
      }
    | number
    | string
    | undefined;
  minValue?: any;
  maxValue?: any;
}

export default class RangeControl extends React.PureComponent<
  RangeProps,
  RangeState
> {
  midLabel?: HTMLSpanElement;

  static defaultProps: DefaultProps = {
    max: 100,
    min: 0,
    step: 1,
    unit: '',
    clearable: true,
    disabled: false,
    showInput: false,
    multiple: false,
    joinValues: true,
    delimiter: ','
  };

  constructor(props: RangeProps) {
    super(props);
    const {value: propsValue, multiple, delimiter, min, max} = this.props;
    const value = formatValue(propsValue, {
      multiple,
      delimiter,
      min,
      max
    });

    this.state = {
      value: value,
      minValue: isObject(value) ? value.min : min,
      maxValue: isObject(value) ? value.max : max
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleEnd = this.handleEnd.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.midLabelRef = this.midLabelRef.bind(this);
    this.clearValue = this.clearValue.bind(this);
    this.handleMinInputBlur = this.handleMinInputBlur.bind(this);
    this.handleMaxInputBlur = this.handleMaxInputBlur.bind(this);
    this.handleMinInputChange = this.handleMinInputChange.bind(this);
    this.handleMaxInputChange = this.handleMaxInputChange.bind(this);
  }

  componentDidMount() {
    this.updateStyle();
  }

  componentDidUpdate(prevProps: RangeProps) {
    const {value} = prevProps;
    const {value: nextPropsValue, multiple, delimiter, min, max} = this.props;
    if (value !== nextPropsValue) {
      const value = formatValue(nextPropsValue, {
        multiple,
        delimiter,
        min,
        max
      });

      this.setState({
        value: value,
        minValue: isObject(value) ? value.min : min,
        maxValue: isObject(value) ? value.max : max
      });
    }

    if (prevProps.showInput !== this.props.showInput) {
      this.updateStyle();
    }
  }

  updateStyle() {
    const {showInput, classPrefix: ns, max, min} = this.props;

    let offsetWidth = (this.midLabel as HTMLSpanElement).offsetWidth;
    const midValue = parseFloat(
      ((max! + min! - 0.000001) / 2).toFixed(this.getStepPrecision())
    );

    let left = `${100 * ((midValue - min!) / (max! - min!))}%`;
    (this.midLabel as HTMLSpanElement).style.left = left;
  }

  midLabelRef(ref: any) {
    this.midLabel = ref;
  }

  handleChange(value: any) {
    this.setState({
      value: stripNumber(value),
      minValue: value.min,
      maxValue: value.max
    });
  }

  clearValue() {
    const {multiple, joinValues, delimiter, min, max, onChange} = this.props;
    if (multiple) {
      this.setState(
        {
          value: {
            min: min,
            max: max
          },
          minValue: min,
          maxValue: max
        },
        () =>
          onChange(
            joinValues
              ? [min, max].join(delimiter || ',')
              : {
                  min: min,
                  max: max
                }
          )
      );
    } else {
      this.setState(
        {
          value: min
        },
        () => onChange(min)
      );
    }
  }

  handleEnd(value: any) {
    const {multiple, joinValues, delimiter} = this.props;
    let endValue = value;
    if (multiple) {
      endValue = joinValues
        ? [value.min, value.max].join(delimiter || ',')
        : {
            min: value.min,
            max: value.max
          };
    } else {
      endValue = stripNumber(value);
    }
    const {onChange} = this.props;
    this.setState(
      {
        value
      },
      () => onChange(endValue)
    );
  }

  getStepPrecision() {
    const {step} = this.props;

    return typeof step !== 'number' || step >= 1 || step < 0
      ? 0
      : step.toString().split('.')[1]?.length;
  }

  getValue(value: any, type?: string) {
    const {max, min, step} = this.props as PropsWithDefaults;
    const {value: stateValue} = this.state;

    if (
      value === '' ||
      value === '-' ||
      new RegExp('^[-]?\\d+[.]{1}[0]{0,' + this.getStepPrecision() + '}$').test(
        value
      )
    ) {
      return value;
    }

    value = Math.round(parseFloat(value) / step) * step;
    value =
      step < 1 ? parseFloat(value.toFixed(this.getStepPrecision())) : ~~value;

    switch (type) {
      case 'min': {
        if (isObject(stateValue) && isNumber(stateValue.max)) {
          if (value >= stateValue.max && min <= stateValue.max - step) {
            return stateValue.max - step;
          }
          if (value < stateValue.max - step) {
            return value;
          }
        }
        return min;
      }
      case 'max':
        return isObject(stateValue) && isNumber(stateValue.min)
          ? (value > max && max) ||
              (value <= stateValue.min && stateValue.min + step) ||
              value
          : max;
      default:
        return (value < min && min) || (value > max && max) || value;
    }
  }

  handleInputChange(evt: React.ChangeEvent<HTMLInputElement>) {
    const value = this.getValue(evt.target.value);
    this.setState(
      {
        value
      },
      () => this.props.onChange(value)
    );
  }

  handleMinInputBlur(evt: React.ChangeEvent<HTMLInputElement>) {
    const {joinValues, delimiter} = this.props;
    const minValue = this.getValue(evt.target.value, 'min');
    const {value} = this.state;
    isObject(value)
      ? this.setState(
          {
            value: {
              min: minValue,
              max: value.max
            },
            minValue: minValue
          },
          () =>
            this.props.onChange(
              joinValues
                ? [minValue, value.max].join(delimiter || ',')
                : {
                    min: minValue,
                    max: value.max
                  }
            )
        )
      : null;
  }

  handleMaxInputBlur(evt: React.ChangeEvent<HTMLInputElement>) {
    const {joinValues, delimiter} = this.props;
    const maxValue = this.getValue(evt.target.value, 'max');
    const {value} = this.state;

    if (isObject(value)) {
      this.setState(
        {
          value: {
            min: value.min,
            max: maxValue
          },
          maxValue: maxValue
        },
        () =>
          this.props.onChange(
            joinValues
              ? [value.min, maxValue].join(delimiter || ',')
              : {
                  min: value.min,
                  max: maxValue
                }
          )
      );
    }
  }

  handleMinInputChange(evt: React.ChangeEvent<HTMLInputElement>) {
    this.setState({
      minValue: evt.target.value
    });
  }

  handleMaxInputChange(evt: React.ChangeEvent<HTMLInputElement>) {
    this.setState({
      maxValue: evt.target.value
    });
  }

  render() {
    const {
      max,
      min,
      step,
      unit,
      clearable,
      name,
      disabled,
      className,
      showInput,
      multiple,
      classnames: cx,
      classPrefix: ns
    } = this.props as PropsWithDefaults;
    const midValue = ((max + min - 0.000001) / 2).toFixed(
      this.getStepPrecision()
    );

    return (
      <div
        className={cx(
          'RangeControl',
          {
            'RangeControl--withInput': showInput,
            'RangeControl--clearable': clearable,
            'is-multiple': multiple
          },
          className
        )}
      >
        <InputRange
          classPrefix={ns}
          value={this.state.value}
          disabled={disabled}
          onChange={this.handleChange}
          onChangeComplete={this.handleEnd}
          max={max}
          min={min}
          step={step}
          formatLabel={(value: any) => value + unit}
          multiple={multiple}
        />

        <span
          className={cx('InputRange-label InputRange-label--mid')}
          ref={this.midLabelRef}
        >
          <span className={cx('InputRange-labelContainer')}>
            {midValue}
            {unit}
          </span>
        </span>

        {showInput ? (
          multiple && isObject(this.state.value) ? (
            <div className={cx('InputRange-input is-multiple')}>
              <input
                className={this.state.value.min !== min ? 'is-active' : ''}
                type="text"
                name={name}
                value={this.state.minValue}
                disabled={disabled}
                onChange={this.handleMinInputChange}
                onBlur={this.handleMinInputBlur}
              />
              <span className={cx('InputRange-input-separator')}> - </span>
              <input
                className={this.state.value.max !== max ? 'is-active' : ''}
                type="text"
                name={name}
                value={this.state.maxValue}
                disabled={disabled}
                onChange={this.handleMaxInputChange}
                onBlur={this.handleMaxInputBlur}
              />
            </div>
          ) : (
            <div className={cx('InputRange-input')}>
              <input
                className={this.state.value !== min ? 'is-active' : ''}
                type="text"
                name={name}
                value={!isObject(this.state.value) ? this.state.value : 0}
                disabled={disabled}
                onChange={this.handleInputChange}
              />
            </div>
          )
        ) : null}

        {clearable && !disabled && showInput ? (
          <a
            onClick={() => this.clearValue()}
            className={cx('InputRange-clear', {
              'is-active': multiple
                ? isEqual(this.state.value, {min: min, max: max})
                : this.state.value !== min
            })}
          >
            <Icon icon="close" className="icon" />
          </a>
        ) : null}
      </div>
    );
  }
}

@FormItem({
  type: 'input-range'
})
export class RangeControlRenderer extends RangeControl {}
