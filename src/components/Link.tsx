import React from 'react';
import {RendererProps} from '../factory';
import {BaseSchema, SchemaTpl} from '../Schema';
import {getPropValue} from '../utils/helper';
import {filter} from '../utils/tpl';
import {themeable} from '../theme';
import {autobind} from '../utils/helper';

export interface LinkSchema extends BaseSchema {
  /**
   * 是否新窗口打开。
   */
  blank?: boolean;

  /**
   * 链接内容，如果不配置将显示链接地址。
   */
  body?: SchemaTpl;

  /**
   * 禁用
   */
  disabled?: boolean;

  /**
   * 图标
   */
  icon?: string;

  /**
   * 图标位置
   */
  position?: string;
}

export interface LinkProps
  extends RendererProps,
    Omit<LinkSchema, 'type' | 'className'> {}

export class Link extends React.Component<LinkProps, object> {
  constructor(props: LinkProps) {
    super(props);
  }

  @autobind
  aClick(e: React.MouseEvent<any>) {
    const {disabled} = this.props;
    if (disabled) {
      e.preventDefault();
      e.stopPropagation();
    }
  }

  render() {
    const {
      className,
      body,
      href,
      classnames: cx,
      blank,
      disabled,
      htmlTarget,
      data,
      title,
      icon,
      position
    } = this.props;

    let value = getPropValue(this.props);
    const finnalHref = href ? filter(href, data, '| raw') : '';

    return (
      <a
        href={finnalHref || value}
        target={htmlTarget || (blank ? '_blank' : '_self')}
        className={cx(
          `Link`,
          {
            'is-disabled': disabled
          },
          className
        )}
        title={title}
        onClick={this.aClick}
      >
        <i className={icon} style={{display: position !== 'right' ? 'inline-block' : 'none' }} />
        {body}
        <i className={icon} style={{display: position !== 'right' ? 'none' : 'inline-block' }} />
      </a>
    );
  }
}

export default themeable(Link);
