import React from 'react';
import {Renderer, RendererProps} from '../factory';
import {BaseSchema} from '../Schema';
import {ActionSchema} from './Action';

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
  extends RendererProps,
    Omit<ButtonToolbarSchema, 'className'> {}

export default class ButtonToolbar extends React.Component<
  ButtonToolbarProps,
  object
> {
  static propsList: Array<string> = ['buttons', 'className'];

  render() {
    const {buttons, className, classnames: cx, render} = this.props;

    return (
      <div className={cx('ButtonToolbar', className)}>
        {Array.isArray(buttons)
          ? buttons.map((button, key) =>
              render(`${key}`, button, {
                key
              })
            )
          : null}
      </div>
    );
  }
}

@Renderer({
  type: 'button-toolbar',
  name: 'button-toolbar'
})
export class ButtonToolbarRenderer extends ButtonToolbar {}
