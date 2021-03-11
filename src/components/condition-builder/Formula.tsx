import React from 'react';
import {ThemeProps, themeable} from '../../theme';
import InputBox from '../InputBox';

export interface FormulaProps extends ThemeProps {
  value: any;
  onChange: (value: any) => void;
}

export class Formula extends React.Component<FormulaProps> {
  render() {
    const {classnames: cx, value, onChange} = this.props;

    return (
      <div className={cx('CBFormula')}>
        <InputBox
          value={value}
          onChange={onChange}
          placeholder="请输入公式"
          prefix={<span className={cx('CBFormula-label')}>表达式</span>}
        />
      </div>
    );
  }
}

export default themeable(Formula);
