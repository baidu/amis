import React from 'react';
import {FormItem, FormControlProps, FormBaseControl} from './Item';
import cx from 'classnames';
import {Button} from '../../types';
import {ActionSchema} from '../Action';

/**
 * 按钮控件。
 * 文档：https://baidu.gitee.io/amis/docs/components/form/button
 */
export type ButtonControlSchema = ActionSchema;

export interface ButtonProps extends FormControlProps, Omit<Button, 'size'> {}

export class ButtonControl extends React.Component<ButtonProps, any> {
  static defaultProps: Partial<ButtonProps> = {};
  render() {
    const {render, type, children, data, ...rest} = this.props;

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
