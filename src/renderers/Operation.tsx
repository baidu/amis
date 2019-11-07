import React from 'react';
import {Renderer, RendererProps} from '../factory';
import {ServiceStore, IServiceStore} from '../store/service';
import {Api, SchemaNode, Action} from '../types';
import {filter} from '../utils/tpl';
import cx from 'classnames';
import moment from 'moment';

export interface OperationProps extends RendererProps {
  className?: string;
  buttons: Array<Action>;
}

export class OperationField extends React.Component<OperationProps, object> {
  static propsList: Array<string> = ['buttons', 'label'];

  static defaultProps: Partial<OperationProps> = {};

  render() {
    const {className, buttons, render, classnames: cx} = this.props;

    return (
      <div className={cx('OperationField', className)}>
        {Array.isArray(buttons)
          ? buttons.map((button, index) =>
              render(
                `${index}`,
                {
                  type: 'button',
                  size: button.size || 'sm',
                  level:
                    button.level ||
                    (button.icon && !button.label ? 'link' : ''),
                  ...button
                },
                {
                  key: index
                }
              )
            )
          : null}
      </div>
    );
  }
}

@Renderer({
  // test: /(^|\/)table\/(.*\/)operation$/,
  test: (path: string) => /(^|\/)table\/(.*\/)operation$/.test(path),
  name: 'operation'
})
export class OperationFieldRenderer extends OperationField {}
