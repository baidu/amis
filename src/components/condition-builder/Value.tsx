import React from 'react';
import {FieldSimple, OperatorType} from './types';
import {ThemeProps, themeable} from '../../theme';
import InputBox from '../InputBox';
import NumberInput from '../NumberInput';
import DatePicker from '../DatePicker';
import {SelectWithRemoteOptions as Select} from '../Select';
import Switch from '../Switch';
import {localeable, LocaleProps} from '../../locale';

export interface ValueProps extends ThemeProps, LocaleProps {
  value: any;
  data?: any;
  onChange: (value: any) => void;
  field: FieldSimple;
  op?: OperatorType;
}

export class Value extends React.Component<ValueProps> {
  render() {
    const {
      classnames: cx,
      field,
      value,
      onChange,
      op,
      translate: __,
      data
    } = this.props;
    let input: JSX.Element | undefined = undefined;

    if (field.type === 'text') {
      input = (
        <InputBox
          value={value ?? field.defaultValue}
          onChange={onChange}
          placeholder={field.placeholder}
        />
      );
    } else if (field.type === 'number') {
      input = (
        <NumberInput
          placeholder={field.placeholder || __('NumberInput.placeholder')}
          step={field.step}
          min={field.minimum}
          max={field.maximum}
          precision={field.precision}
          value={value ?? field.defaultValue}
          onChange={onChange}
        />
      );
    } else if (field.type === 'date') {
      input = (
        <DatePicker
          placeholder={field.placeholder || __('Date.placeholder')}
          format={field.format || 'YYYY-MM-DD'}
          inputFormat={field.inputFormat || 'YYYY-MM-DD'}
          value={value ?? field.defaultValue}
          onChange={onChange}
          timeFormat=""
        />
      );
    } else if (field.type === 'time') {
      input = (
        <DatePicker
          viewMode="time"
          placeholder={field.placeholder || 'Time.placeholder'}
          format={field.format || 'HH:mm'}
          inputFormat={field.inputFormat || 'HH:mm'}
          value={value ?? field.defaultValue}
          onChange={onChange}
          dateFormat=""
          timeFormat={field.format || 'HH:mm'}
        />
      );
    } else if (field.type === 'datetime') {
      input = (
        <DatePicker
          placeholder={field.placeholder || '请选择日期时间'}
          format={field.format || ''}
          inputFormat={field.inputFormat || 'YYYY-MM-DD HH:mm'}
          value={value ?? field.defaultValue}
          onChange={onChange}
          timeFormat={field.timeFormat || 'HH:mm'}
        />
      );
    } else if (field.type === 'select') {
      input = (
        <Select
          simpleValue
          options={field.options}
          source={field.source}
          searchable={field.searchable}
          value={value ?? field.defaultValue ?? ''}
          data={data}
          onChange={onChange}
          multiple={op === 'select_any_in' || op === 'select_not_any_in'}
        />
      );
    } else if (field.type === 'boolean') {
      input = (
        <Switch value={value ?? field.defaultValue} onChange={onChange} />
      );
    }

    return <div className={cx('CBValue')}>{input}</div>;
  }
}

export default themeable(localeable(Value));
