import React from 'react';
import {FormItem, FormControlProps} from './Item';
import cx from 'classnames';
import Switch from '../../components/Switch';

export interface SwitchProps extends FormControlProps {
  option?: string;
  trueValue?: any;
  falseValue?: any;
}

export default class SwitchControl extends React.Component<SwitchProps, any> {
  static defaultProps = {
    trueValue: true,
    falseValue: false,
    optionAtLeft: false
  };
  render() {
    const {
      className,
      classPrefix: ns,
      classnames: cx,
      value,
      trueValue,
      falseValue,
      option,
      onChange,
      disabled,
      optionAtLeft
    } = this.props;

    return (
      <div className={cx(`SwitchControl`, className)}>
        {optionAtLeft ? (
          <span className={cx('Switch-option')}>{option}</span>
        ) : null}

        <Switch
          classPrefix={ns}
          value={value}
          trueValue={trueValue}
          falseValue={falseValue}
          disabled={disabled}
          onChange={onChange}
        />

        {optionAtLeft ? null : (
          <span className={cx('Switch-option')}>{option}</span>
        )}
      </div>
    );
  }
}

@FormItem({
  type: 'switch',
  sizeMutable: false
})
export class SwitchControlRenderer extends SwitchControl {}
