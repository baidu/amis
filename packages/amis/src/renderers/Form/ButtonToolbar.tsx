import React from 'react';
import {BaseSchema} from '../../Schema';
import {ActionSchema} from '../Action';
import {
  FormControlProps,
  FormItem,
  FormBaseControlWithoutSize,
  AMISButtonSchema
} from 'amis-core';

/**
 * Button Toolar 渲染器。
 * 文档：https://aisuda.bce.baidu.com/amis/zh-CN/components/button-toolbar
 */
/**
 * ButtonToolbar 用于在表单中展示多个操作按钮的工具条组件，通常用于批量操作或表单按钮组合。
 */
export interface AMISButtonToolbarSchema
  extends BaseSchema,
    FormBaseControlWithoutSize {
  /**
   * 指定为 button-toolbar 组件
   */
  type: 'button-toolbar';

  buttons: Array<AMISButtonSchema>;
}

export interface ButtonToolbarProps
  extends FormControlProps,
    Omit<
      AMISButtonToolbarSchema,
      'className' | 'descriptionClassName' | 'inputClassName'
    > {}

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
    const {buttons, className, classnames: cx, render, style} = this.props;

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
