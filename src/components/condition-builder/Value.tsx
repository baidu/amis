import React from 'react';
import {FieldSimple} from './types';
import {ThemeProps, themeable} from '../../theme';
import InputBox from '../InputBox';

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
          value={value}
          onChange={onChange}
          placeholder={field.placeholder}
        />
      );
    }

    return <div className={cx('CBValue')}>{input}</div>;
  }
}

export default themeable(Value);
