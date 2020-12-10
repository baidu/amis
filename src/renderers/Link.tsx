import React from 'react';
import {Renderer, RendererProps} from '../factory';
import {BaseSchema, SchemaTpl} from '../Schema';
import {filter} from '../utils/tpl';

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
}

export interface LinkProps extends RendererProps, LinkSchema {}

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
      translate: __
    } = this.props;

    let value = this.props.value;
    const finnalHref = href ? filter(href, data, '| raw') : '';

    return (
      <a
        href={finnalHref || value}
        target={htmlTarget || (blank ? '_blank' : '_self')}
        className={cx('Link', className)}
      >
        {body ? render('body', body) : finnalHref || value || __('链接')}
      </a>
    );
  }
}

@Renderer({
  test: /(^|\/)link$/,
  name: 'link'
})
export class LinkFieldRenderer extends LinkField {}
