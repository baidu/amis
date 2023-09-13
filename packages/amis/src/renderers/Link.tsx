import React from 'react';
import {Renderer, RendererProps} from 'amis-core';
import {BaseSchema, SchemaTpl} from '../Schema';
import {autobind, createObject, getPropValue} from 'amis-core';
import {filter} from 'amis-core';
import {BadgeObject, withBadge} from 'amis-ui';
import {Link} from 'amis-ui';

/**
 * Link 链接展示控件。
 * 文档：https://aisuda.bce.baidu.com/amis/zh-CN/components/link
 */
export interface LinkSchema extends BaseSchema {
  /**
   * 指定为 link 链接展示控件
   */
  type: 'link';

  /**
   * 是否新窗口打开。
   */
  blank?: boolean;

  /**
   * 链接地址
   */
  href?: string;

  /**
   * 链接内容，如果不配置将显示链接地址。
   */
  body?: SchemaTpl;

  /**
   * 角标
   */
  badge?: BadgeObject;

  /**
   * a标签原生target属性
   */
  htmlTarget?: string;

  /**
   * 图标
   */
  icon?: string;

  /**
   * 右侧图标
   */
  rightIcon?: string;
}

export interface LinkProps
  extends RendererProps,
    Omit<LinkSchema, 'type' | 'className'> {}

export class LinkCmpt extends React.Component<LinkProps, object> {
  static defaultProps = {
    blank: true,
    disabled: false,
    htmlTarget: ''
  };

  @autobind
  handleClick(e: React.MouseEvent<any>) {
    const {env, href, blank, body} = this.props;

    env?.tracker(
      {
        eventType: 'url',
        // 需要和 action 里命名一致方便后续分析
        eventData: {url: href, blank, label: body}
      },
      this.props
    );
  }

  getHref() {}

  render() {
    const {
      className,
      style,
      body,
      href,
      classnames: cx,
      blank,
      disabled,
      htmlTarget,
      data,
      render,
      translate: __,
      title,
      icon,
      rightIcon
    } = this.props;

    let value =
      (typeof href === 'string' && href
        ? filter(href, data, '| raw')
        : undefined) || getPropValue(this.props);

    return (
      <Link
        className={className}
        style={style}
        href={value}
        disabled={disabled}
        title={title}
        htmlTarget={htmlTarget || (blank ? '_blank' : '_self')}
        icon={icon}
        rightIcon={rightIcon}
        onClick={this.handleClick}
      >
        {body ? render('body', body) : value || __('link')}
      </Link>
    );
  }
}

@Renderer({
  type: 'link'
})
// @ts-ignore 类型没搞定
@withBadge
export class LinkFieldRenderer extends LinkCmpt {}
