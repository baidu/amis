import React from 'react';
import {Renderer, RendererProps} from 'amis-core';
import {ServiceStore, IServiceStore} from 'amis-core';
import {Api, SchemaNode, ActionObject} from 'amis-core';
import {filter} from 'amis-core';
import cx from 'classnames';
import moment from 'moment';
import {BaseSchema} from '../Schema';
import {ActionSchema} from './Action';

/**
 * 操作栏渲染器。
 * 文档：https://baidu.gitee.io/amis/docs/components/operation
 */
export interface OperationSchema extends BaseSchema {
  /**
   * 指定为操作栏
   */
  type: 'operation';

  /**
   * 占位符
   */
  placeholder?: string;

  buttons: Array<ActionSchema>;
}

export interface OperationProps
  extends RendererProps,
    Omit<OperationSchema, 'type' | 'className'> {}

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
                  ...(button as any)
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
  type: 'operation'
})
export class OperationFieldRenderer extends OperationField {}
