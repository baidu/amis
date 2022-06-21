import React from 'react';
import {localeable, LocaleProps, ThemeProps, themeable} from 'amis-core';
import InputBox from '../InputBox';

export interface FormulaProps extends ThemeProps, LocaleProps {
  value: any;
  onChange: (value: any) => void;
  disabled?: boolean;
}

export class Formula extends React.Component<FormulaProps> {
  render() {
    const {
      classnames: cx,
      value,
      onChange,
      disabled,
      translate: __
    } = this.props;

    return (
      <div className={cx('CBFormula')}>
        <InputBox
          disabled={disabled}
          value={value}
          onChange={onChange}
          placeholder={__('Condition.formula_placeholder')}
          prefix={
            <span className={cx('CBFormula-label')}>
              {__('Condition.expression')}
            </span>
          }
        />
      </div>
    );
  }
}

export default themeable(localeable(Formula));
