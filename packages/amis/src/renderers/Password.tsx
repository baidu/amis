/**
 * @file Password
 */
import React from 'react';
import {AMISSchemaBase, autobind, Renderer, RendererProps} from 'amis-core';
import {BaseSchema} from '../Schema';
import {Icon} from 'amis-ui';

/**
 * Password
 */
/**
 * 密码展示组件，用于安全显示或校验密码字段。
 */
export interface AMISPasswordSchema extends AMISSchemaBase {
  type: 'password';

  /**
   * 打码模式的文本
   */
  mosaicText?: string;
}

export interface PasswordProps
  extends RendererProps,
    Omit<AMISPasswordSchema, 'type' | 'className'> {}

export interface PasswordState {
  visible: boolean;
}

export class PasswordField extends React.Component<
  PasswordProps,
  PasswordState
> {
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
      style,
      mosaicText = '********',
      value
    } = this.props;

    return (
      <span className={cx('Password-field', className)} style={style}>
        {this.state.visible ? value : mosaicText}
        {this.state.visible ? (
          <Icon icon="view" className="icon" onClick={this.toggleVisible} />
        ) : (
          <Icon
            icon="invisible"
            className="icon"
            onClick={this.toggleVisible}
          />
        )}
      </span>
    );
  }
}

@Renderer({
  type: 'password'
})
export class PasswordFieldRenderer extends PasswordField {}
