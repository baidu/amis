import React from 'react';
import {Renderer, RendererProps} from '../factory';
import {BaseSchema, SchemaTpl} from '../Schema';
import {autobind, getPropValue} from '../utils/helper';
import {filter} from '../utils/tpl';
import {BadgeSchema, withBadge} from '../components/Badge';
import Link from '../components/Link';

/**
 * Link 链接展示控件。
 * 文档：https://baidu.gitee.io/amis/docs/components/link
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
   * 链接内容，如果不配置将显示链接地址。
   */
  body?: SchemaTpl;

  /**
   * 角标
   */
  badge?: BadgeSchema;

  /**
   * a标签原生target属性
   */
  htmlTarget?: string;

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

export class LinkCmpt extends React.Component<LinkProps, object> {
  static defaultProps = {
    blank: true,
    disabled: false
  };

  handleClick(href: string) {
    const {env, blank, body} = this.props;
    env.tracker(
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
      position
    } = this.props;

    let value = getPropValue(this.props, () =>
      typeof href === 'string' && href ? filter(href, data, '| raw') : undefined
    );
    const text = body ? render('body', body) : value || __('link');

    return (
      <Link
        className={className}
        href={value}
        body={text}
        blank={blank}
        disabled={disabled}
        title={title}
        htmlTarget={htmlTarget}
        icon={icon}
        position={position}
        onClick={() => this.handleClick(value)}
      ></Link>
    );
  }
}

@Renderer({
  type: 'link'
})
// @ts-ignore 类型没搞定
@withBadge
export class LinkFieldRenderer extends LinkCmpt {}
