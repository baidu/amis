import React from 'react';
import {BaseSchema} from '../../Schema';
import {ActionSchema} from '../Action';
import {FormControlProps, FormItem} from 'amis-core';
import {CustomStyle, setThemeClassName} from 'amis-core';

/**
 * Button Toolar 渲染器。
 * 文档：https://aisuda.bce.baidu.com/amis/zh-CN/components/button-toolbar
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
    const {
      buttons,
      className,
      classnames: cx,
      render,
      style,
      wrapperCustomStyle,
      id,
      themeCss,
      env
    } = this.props;

    return (
      <div
        className={cx(
          'ButtonToolbar',
          className,
          setThemeClassName('baseControlClassName', id, themeCss),
          setThemeClassName('wrapperCustomStyle', id, wrapperCustomStyle)
        )}
      >
        {this.renderButtons()}
        <CustomStyle
          config={{
            wrapperCustomStyle,
            id,
            themeCss,
            classNames: [
              {
                key: 'baseControlClassName'
              }
            ]
          }}
          env={env}
        />
      </div>
    );
  }
}

@FormItem({
  type: 'button-toolbar',
  strictMode: false
})
export class ButtonToolbarRenderer extends ButtonToolbar {}
