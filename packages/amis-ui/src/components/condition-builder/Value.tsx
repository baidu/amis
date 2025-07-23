import React from 'react';
import {FieldSimple} from './types';
import {
  ThemeProps,
  themeable,
  localeable,
  LocaleProps,
  autobind
} from 'amis-core';
import InputBox from '../InputBox';
import NumberInput from '../NumberInput';
import DatePicker from '../DatePicker';
import {SelectWithRemoteOptions as Select} from '../Select';
import Switch from '../Switch';
import {FormulaPicker, FormulaPickerProps} from '../formula/Picker';
import type {OperatorType, TestIdBuilder} from 'amis-core';
import omit from 'lodash/omit';

export interface ValueProps extends ThemeProps, LocaleProps {
  value: any;
  data?: any;
  onChange: (value: any) => void;
  field: FieldSimple;
  op?: OperatorType;
  disabled?: boolean;
  formula?: FormulaPickerProps;
  popOverContainer?: any;
  renderEtrValue?: any;
  testIdBuilder?: TestIdBuilder;
  onFocus?: (e: any) => void;
  onBlur?: (e: any) => void;
}

export class Value extends React.Component<ValueProps> {
  @autobind
  renderCustomValue(props: any) {
    const {renderEtrValue, data, classnames: cx} = this.props;
    const field = props.inputSettings;

    return renderEtrValue
      ? renderEtrValue(
          {...field.value, name: 'TMP_WHATEVER_NAME'}, // name 随便输入，应该是 value 传入的为主，目前表单项内部逻辑还有问题先传一个 name

          {
            data,
            onChange: props.onChange,
            value: props.value,
            inputClassName: cx(field.className, props.className)
          }
        )
      : null;
  }

  render() {
    let {
      classnames: cx,
      className,
      field,
      value,
      onChange,
      op,
      translate: __,
      data,
      disabled,
      formula,
      popOverContainer,
      mobileUI,
      testIdBuilder,
      onFocus,
      onBlur
    } = this.props;
    let input: JSX.Element | undefined = undefined;
    if (formula) {
      // 如果配置了 formula 字段，则所有的输入变为 formula 形式
      formula = {
        ...formula,
        translate: __,
        classnames: cx,
        data,
        value: value ?? field.defaultValue,
        onChange,
        disabled
      };

      const inputSettings = formula?.inputSettings
        ? {
            ...formula?.inputSettings,
            ...field,
            multiple:
              field.type === 'select' &&
              op &&
              typeof op === 'string' &&
              ['select_any_in', 'select_not_any_in'].includes(op)
          }
        : undefined;
      input = (
        <FormulaPicker
          {...formula}
          inputSettings={inputSettings}
          customInputRender={this.renderCustomValue}
        />
      );
    } else if (field.type === 'text') {
      input = (
        <InputBox
          value={value ?? field.defaultValue}
          onChange={onChange}
          placeholder={__(field.placeholder)}
          disabled={disabled || field.disabled}
          mobileUI={mobileUI}
          onFocus={onFocus}
          onBlur={onBlur}
          testIdBuilder={testIdBuilder?.getChild('text')}
        />
      );
    } else if (field.type === 'number') {
      input = (
        <NumberInput
          placeholder={__(field.placeholder) || __('NumberInput.placeholder')}
          step={field.step}
          min={field.minimum}
          max={field.maximum}
          precision={field.precision}
          value={value ?? field.defaultValue}
          onChange={onChange}
          disabled={disabled || field.disabled}
          onFocus={onFocus}
          onBlur={onBlur}
          mobileUI={mobileUI}
          testIdBuilder={testIdBuilder?.getChild('number')}
        />
      );
    } else if (field.type === 'date') {
      input = (
        <DatePicker
          placeholder={__(field.placeholder) || __('Date.placeholder')}
          format={field.format || 'YYYY-MM-DD'}
          inputFormat={field.inputFormat || 'YYYY-MM-DD'}
          value={value ?? field.defaultValue}
          onChange={onChange}
          timeFormat=""
          disabled={disabled || field.disabled}
          popOverContainer={popOverContainer}
          mobileUI={mobileUI}
          onFocus={onFocus}
          onBlur={onBlur}
          testIdBuilder={testIdBuilder?.getChild('date')}
        />
      );
    } else if (field.type === 'time') {
      input = (
        <DatePicker
          viewMode="time"
          placeholder={__(field.placeholder) || __('Time.placeholder')}
          format={field.format || 'HH:mm'}
          inputFormat={field.inputFormat || 'HH:mm'}
          value={value ?? field.defaultValue}
          onChange={onChange}
          dateFormat=""
          timeFormat={field.format || 'HH:mm'}
          disabled={disabled || field.disabled}
          popOverContainer={popOverContainer}
          mobileUI={mobileUI}
          onFocus={onFocus}
          onBlur={onBlur}
          testIdBuilder={testIdBuilder?.getChild('time')}
        />
      );
    } else if (field.type === 'datetime') {
      input = (
        <DatePicker
          placeholder={__(field.placeholder) || __('Time.placeholder')}
          format={field.format || ''}
          inputFormat={field.inputFormat || 'YYYY-MM-DD HH:mm'}
          value={value ?? field.defaultValue}
          onChange={onChange}
          timeFormat={field.timeFormat || 'HH:mm'}
          disabled={disabled || field.disabled}
          popOverContainer={popOverContainer}
          mobileUI={mobileUI}
          onFocus={onFocus}
          onBlur={onBlur}
          testIdBuilder={testIdBuilder?.getChild('datetime')}
        />
      );
    } else if (field.type === 'select') {
      const autoComplete = field.autoComplete;

      input = (
        <Select
          simpleValue
          options={field.options!}
          placeholder={__(field.placeholder) || 'Select.placeholder'}
          source={field.source}
          autoComplete={autoComplete}
          searchable={field.searchable}
          value={value ?? field.defaultValue ?? ''}
          data={data}
          onChange={onChange}
          multiple={op === 'select_any_in' || op === 'select_not_any_in'}
          disabled={disabled || field.disabled}
          popOverContainer={popOverContainer}
          mobileUI={mobileUI}
          maxTagCount={field.maxTagCount}
          overflowTagPopover={field.overflowTagPopover}
          onFocus={onFocus}
          onBlur={onBlur}
          testIdBuilder={testIdBuilder?.getChild('select')}
        />
      );
    } else if (field.type === 'boolean') {
      input = (
        <div className={cx(`SwitchControl`)}>
          <Switch
            value={value ?? field.defaultValue}
            onChange={onChange}
            disabled={disabled || field.disabled}
            testIdBuilder={testIdBuilder?.getChild('switch')}
          />
        </div>
      );
    } else if (field.type === 'custom') {
      input = this.renderCustomValue({
        value: value ?? field.defaultValue,
        onChange,
        onFocus,
        onBlur,
        disabled: disabled || field.disabled,
        inputSettings: field,
        testIdBuilder: testIdBuilder?.getChild('custom')
      });
    } else {
      // 不支持的也转给自定义组件处理
      input = this.renderCustomValue({
        value: value ?? (field as any).defaultValue,
        onChange,
        onFocus,
        onBlur,
        disabled: disabled || (field as any).disabled,
        testIdBuilder: testIdBuilder?.getChild('custom'),
        inputSettings: {
          value: omit(field, [
            'label',
            'operators',
            'defaultOp',
            'defaultValue'
          ])
        }
      });
    }

    return <div className={cx('CBValue', className)}>{input}</div>;
  }
}

export default themeable(localeable(Value));
