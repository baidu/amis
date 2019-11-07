import React from 'react';
import {FormItem, FormControlProps} from './Item';
import cx from 'classnames';
import Checkbox from '../../components/Checkbox';

export interface CheckboxProps extends FormControlProps {
  option?: string;
  trueValue?: any;
  falseValue?: any;
}

export default class CheckboxControl extends React.Component<
  CheckboxProps,
  any
> {
  static defaultProps: Partial<CheckboxProps> = {
    trueValue: true,
    falseValue: false
  };
  render() {
    const {
      className,
      value,
      trueValue,
      falseValue,
      option,
      onChange,
      disabled,
      render,
      classPrefix: ns
    } = this.props;

    return (
      <div className={cx(`${ns}CheckboxControl`, className)}>
        <Checkbox
          inline
          value={value || ''}
          trueValue={trueValue}
          falseValue={falseValue}
          classPrefix={ns}
          disabled={disabled}
          onChange={(value: any) => onChange(value)}
        >
          {option ? render('option', option) : null}
        </Checkbox>
      </div>
    );
  }
}

@FormItem({
  type: 'checkbox',
  sizeMutable: false
})
export class CheckboxControlRenderer extends CheckboxControl {}
