import React from 'react';
import {FormItem, FormControlProps, FormBaseControl} from './Item';
import cx from 'classnames';
import {Button} from '../../types';
import {ButtonToolbarSchema} from '../ButtonToolbar';

/**
 * 按钮工具栏控件。
 * 文档：https://baidu.gitee.io/amis/docs/components/form/button-toolbar
 */
export interface ButtonToolbarControlSchema
  extends ButtonToolbarSchema,
    FormBaseControl {
  type: 'button-toolbar';
}

export interface ButtonToolbarProps
  extends FormControlProps,
    Omit<
      ButtonToolbarControlSchema,
      'type' | 'className' | 'descriptionClassName' | 'inputClassName'
    > {}

export class ButtonToolbarControl extends React.Component<ButtonToolbarProps> {
  static defaultProps = {};

  renderButtons() {
    const {render, classPrefix: ns, buttons} = this.props;
    return Array.isArray(buttons)
      ? buttons.map((button, key) =>
          render(`button/${key}`, button, {
            key: key
          })
        )
      : null;
  }

  render() {
    const {render, className, classPrefix: ns, buttons} = this.props;

    return (
      <div className={cx(`${ns}ButtonToolbar`, className)}>
        {this.renderButtons()}
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
