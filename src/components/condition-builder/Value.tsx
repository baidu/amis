import React from 'react';
import {FieldSimple} from './types';
import {ThemeProps, themeable} from '../../theme';
import InputBox from '../InputBox';
import NumberInput from '../NumberInput';
import DatePicker from '../DatePicker';

export interface ValueProps extends ThemeProps {
  value: any;
  onChange: (value: any) => void;
  field: FieldSimple;
}

export class Value extends React.Component<ValueProps> {
  render() {
    const {classnames: cx, field, value, onChange} = this.props;
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
          placeholder={field.placeholder || '请选择日期'}
          min={field.minimum}
          max={field.maximum}
          value={value ?? field.defaultValue}
          onChange={onChange}
        />
      );
    } else if (field.type === 'date') {
      input = (
        <DatePicker
          placeholder={field.placeholder || '请选择日期'}
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
          placeholder={field.placeholder || '请选择时间'}
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
    }

    return <div className={cx('CBValue')}>{input}</div>;
  }
}

export default themeable(Value);
