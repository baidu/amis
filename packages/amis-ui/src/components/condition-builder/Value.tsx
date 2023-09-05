import React from 'react';
import {FieldSimple} from './types';
import {ThemeProps, themeable, localeable, LocaleProps} from 'amis-core';
import InputBox from '../InputBox';
import NumberInput from '../NumberInput';
import DatePicker from '../DatePicker';
import {SelectWithRemoteOptions as Select} from '../Select';
import Switch from '../Switch';
import {FormulaPicker, FormulaPickerProps} from '../formula/Picker';
import type {OperatorType} from 'amis-core';

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
}

export class Value extends React.Component<ValueProps> {
  render() {
    let {
      classnames: cx,
      field,
      value,
      onChange,
      op,
      translate: __,
      data,
      disabled,
      formula,
      popOverContainer,
      renderEtrValue,
      mobileUI
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

      const inputSettings =
        field.type !== 'custom' && formula?.inputSettings
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
      input = <FormulaPicker {...formula} inputSettings={inputSettings} />;
    } else if (field.type === 'text') {
      input = (
        <InputBox
          value={value ?? field.defaultValue}
          onChange={onChange}
          placeholder={__(field.placeholder)}
          disabled={disabled}
          mobileUI={mobileUI}
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
          disabled={disabled}
          mobileUI={mobileUI}
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
          disabled={disabled}
          popOverContainer={popOverContainer}
          mobileUI={mobileUI}
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
          disabled={disabled}
          popOverContainer={popOverContainer}
          mobileUI={mobileUI}
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
          disabled={disabled}
          popOverContainer={popOverContainer}
          mobileUI={mobileUI}
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
          disabled={disabled}
          popOverContainer={popOverContainer}
          mobileUI={mobileUI}
          maxTagCount={field.maxTagCount}
          overflowTagPopover={field.overflowTagPopover}
        />
      );
    } else if (field.type === 'boolean') {
      input = (
        <Switch
          value={value ?? field.defaultValue}
          onChange={onChange}
          disabled={disabled}
        />
      );
    } else if (field.type === 'custom') {
      input = renderEtrValue
        ? renderEtrValue(
            {...field.value, name: 'TMP_WHATEVER_NAME'}, // name 随便输入，应该是 value 传入的为主，目前表单项内部逻辑还有问题先传一个 name

            {
              data,
              onChange,
              value: value ?? field.defaultValue
            }
          )
        : null;
    }

    return <div className={cx('CBValue')}>{input}</div>;
  }
}

export default themeable(localeable(Value));
