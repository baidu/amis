/**
 * @file icon按钮组
 */
import React from 'react';
import {FormItem, Button, Icon, ClassNamesFn} from 'amis';

export interface ButtonGroupControlProps {
  options?: Array<{
    label: string;
    icon: string;
    value: string;
  }>;
  onChange: (value: string | number) => void;
  value?: string | number;
  classnames?: ClassNamesFn;
}

export default class ButtonGroupControl extends React.Component<ButtonGroupControlProps> {
  constructor(props: any) {
    super(props);
  }

  render() {
    const {options, value, onChange, classnames: cx} = this.props;
    return (
      <div className={cx('ButtonGroup', 'icon-ButtonList')}>
        {options &&
          options.map(item => (
            <Button
              key={item.value}
              onClick={() => onChange(item.value)}
              level={value === item.value ? 'primary' : 'default'}
              tooltip={item.label}
              active={value === item.value}
            >
              {item.icon ? (
                <Icon icon={item.icon} className="icon" />
              ) : (
                item.label
              )}
            </Button>
          ))}
      </div>
    );
  }
}
@FormItem({
  type: 'button-icon-group'
})
export class ButtonGroupControlRenderer extends ButtonGroupControl {}
