import React from 'react';
import {Renderer, RendererProps} from '../factory';
import {BaseSchema, SchemaTpl} from '../Schema';
import {getPropValue} from '../utils/helper';
import {filter} from '../utils/tpl';
import {BadgeSchema, withBadge} from '../components/Badge';

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
}

export interface LinkProps
  extends RendererProps,
    Omit<LinkSchema, 'type' | 'className'> {}

export class LinkField extends React.Component<LinkProps, object> {
  static defaultProps = {
    className: '',
    blank: false
  };

  render() {
    const {
      className,
      body,
      href,
      classnames: cx,
      blank,
      htmlTarget,
      data,
      render,
      translate: __,
      title
    } = this.props;

    let value = getPropValue(this.props);
    const finnalHref = href ? filter(href, data, '| raw') : '';

    return (
      <a
        href={finnalHref || value}
        target={htmlTarget || (blank ? '_blank' : '_self')}
        className={cx('Link', className)}
        title={title}
      >
        {body ? render('body', body) : finnalHref || value || __('link')}
      </a>
    );
  }
}

@Renderer({
  type: 'link'
})
// @ts-ignore 类型没搞定
@withBadge
export class LinkFieldRenderer extends LinkField {}
