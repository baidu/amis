import React from 'react';
import {FormItem, FormControlProps} from './Item';
import cx from 'classnames';
import {Button} from '../../types';

export interface ButtonToolbarProps extends FormControlProps {
  buttons?: Array<Button>;
}

export class ButtonToolbarControl extends React.Component<ButtonToolbarProps> {
  static defaultProps = {};

  render() {
    const {render, className, classPrefix: ns, buttons} = this.props;

    return (
      <div className={cx(`${ns}ButtonToolbar`, className)}>
        {Array.isArray(buttons)
          ? buttons.map((button, key) =>
              render(`button/${key}`, button, {
                key: key
              })
            )
          : null}
      </div>
    );
  }
}

@FormItem({
  type: 'button-toolbar',
  sizeMutable: false,
  strictMode: false // data 变化也更新
})
export class ButtonToolbarRenderer extends ButtonToolbarControl {}
