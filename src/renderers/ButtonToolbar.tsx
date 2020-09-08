import React from 'react';
import {Renderer, RendererProps} from '../factory';
import {Action} from '../types';
import {ButtonToolbarSchema} from '../schemas/ButtonToolbar';

export interface ButtonToolbarProps
  extends RendererProps,
    ButtonToolbarSchema {}

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
  test: /(^|\/)button-toolbar$/,
  name: 'button-toolbar'
})
export class ButtonToolbarRenderer extends ButtonToolbar {}
