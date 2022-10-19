/**
 * @file Password
 */
import React from 'react';
import {autobind, Renderer, RendererProps} from 'amis-core';
import {BaseSchema} from '../Schema';
import {Icon} from 'amis-ui';

/**
 * Password
 */
export interface PasswordSchema extends BaseSchema {
  type: 'password';

  /**
  * 打码模式的文本
  */
  mosaicText?: string;
}

export interface PasswordProps
  extends RendererProps,
    Omit<PasswordSchema, 'type' | 'className'> {}

export class PasswordField extends React.Component<PasswordProps, object> {
  state = {
    visible: false
  };

  @autobind
  toggleVisible() {
    this.setState({
      visible: !this.state.visible
    });
  }

  render() {
    const {
      classnames: cx,
      className,
      mosaicText = '********',
      value
    } = this.props;

    return (
      <span className={cx('Password-field', className)}>
        {this.state.visible ? value : mosaicText}
        {this.state.visible
          ? <Icon icon="view" className="icon" onClick={this.toggleVisible} />
          : <Icon icon="invisible" className="icon" onClick={this.toggleVisible} />
        }
      </span>
    );
  }
}

@Renderer({
  type: 'password'
})
export class PasswordFieldRenderer extends PasswordField {}
