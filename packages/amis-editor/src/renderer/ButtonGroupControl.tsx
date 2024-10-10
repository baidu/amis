/**
 * @file icon按钮组
 */
import React from 'react';
import {FormItem, Button, Icon, hasIcon, FormControlProps} from 'amis';
import cx from 'classnames';

export interface ButtonGroupControlProps extends FormControlProps {
  options?: Array<{
    label: string;
    iconFont?: string;
    icon: string;
    value: string;
    iconClassName?: string;
  }>;
  onChange: (value: string | number) => void;
  value?: string | number;
}

export default class ButtonGroupControl extends React.Component<ButtonGroupControlProps> {
  constructor(props: any) {
    super(props);
  }

  render() {
    const {options, value, onChange, classnames} = this.props;
    const cls = classnames || cx;
    return (
      <div className={cls('ButtonGroup', 'icon-ButtonList')}>
        {options &&
          options.map(item => (
            <Button
              key={item.value}
              onClick={() => onChange(item.value)}
              level={value === item.value ? 'primary' : 'default'}
              tooltip={item.label}
              active={value === item.value}
            >
              {hasIcon(item.icon) ? (
                <Icon
                  icon={item.icon}
                  className={cx('icon', item.iconClassName)}
                />
              ) : item.icon ? (
                <i className={cx(item.icon, item.iconClassName)}></i>
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
  type: 'icon-button-group'
})
export class ButtonGroupControlRenderer extends ButtonGroupControl {}
