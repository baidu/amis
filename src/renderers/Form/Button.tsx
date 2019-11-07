import React from 'react';
import {FormItem, FormControlProps} from './Item';
import cx from 'classnames';
import {Button} from '../../types';

export interface ButtonProps extends FormControlProps, Button {}

export class ButtonControl extends React.Component<ButtonProps, any> {
  static defaultProps: Partial<ButtonProps> = {};
  render() {
    const {render, type, children, ...rest} = this.props;

    return render('action', {
      ...rest,
      type
    }) as JSX.Element;
  }
}

@FormItem({
  type: 'button',
  renderLabel: false,
  strictMode: false,
  sizeMutable: false
})
export class ButtonControlRenderer extends ButtonControl {}

@FormItem({
  type: 'submit',
  renderLabel: false,
  sizeMutable: false,
  strictMode: false
})
export class SubmitControlRenderer extends ButtonControl {}

@FormItem({
  type: 'reset',
  renderLabel: false,
  strictMode: false,
  sizeMutable: false
})
export class ResetControlRenderer extends ButtonControl {}
