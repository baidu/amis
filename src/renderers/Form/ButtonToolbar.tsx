import React from 'react';
import {RendererProps} from '../../factory';
import {BaseSchema} from '../../Schema';
import {ActionSchema} from '../Action';
import {FormControlProps, FormItem} from './Item';

/**
 * Button Toolar 渲染器。
 * 文档：https://baidu.gitee.io/amis/docs/components/button-toolbar
 */
export interface ButtonToolbarSchema extends BaseSchema {
  /**
   * 指定为按钮工具集合类型
   */
  type: 'button-toolbar';

  buttons: Array<ActionSchema>;
}

export interface ButtonToolbarProps
  extends FormControlProps,
    Omit<ButtonToolbarSchema, 'className'> {}

export default class ButtonToolbar extends React.Component<
  ButtonToolbarProps,
  object
> {
  static propsList: Array<string> = ['buttons', 'className'];

  /**
   * 这个方法editor里要用作hack，所以不能删掉这个方法
   * @returns
   */
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
    const {buttons, className, classnames: cx, render} = this.props;

    return (
      <div className={cx('ButtonToolbar', className)}>
        {this.renderButtons()}
      </div>
    );
  }
}

@FormItem({
  type: 'button-toolbar',
  strictMode: false
})
export class ButtonToolbarRenderer extends ButtonToolbar {}
