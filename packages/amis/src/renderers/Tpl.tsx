import React from 'react';
import {Renderer, RendererProps} from 'amis-core';
import {filter} from 'amis-core';
import cx from 'classnames';
import {anyChanged, getPropValue} from 'amis-core';
import {escapeHtml} from 'amis-core';
import {BaseSchema, SchemaTpl} from '../Schema';
import {BadgeObject, withBadge} from 'amis-ui';
import {buildStyle} from 'amis-core';

/**
 * tpl 渲染器
 */
export interface TplSchema extends BaseSchema {
  /**
   * 指定为模板渲染器。
   *
   * 文档：https://baidu.gitee.io/amis/docs/concepts/template
   */
  type: 'tpl' | 'html';

  tpl?: SchemaTpl;
  html?: SchemaTpl;
  text?: SchemaTpl;
  raw?: string;

  /**
   * 是否内联显示？
   */
  inline?: boolean;

  /**
   * 自定义样式
   */
  style?: {
    [propName: string]: any;
  };

  /**
   * 角标
   */
  badge?: BadgeObject;
}

export interface TplProps extends RendererProps, TplSchema {
  className?: string;
  value?: string;
  wrapperComponent?: any;
  inline?: boolean;
}

export class Tpl extends React.Component<TplProps, object> {
  static defaultProps: Partial<TplProps> = {
    inline: true,
    placeholder: ''
  };

  dom: any;

  constructor(props: TplProps) {
    super(props);
  }

  getContent() {
    const {tpl, html, text, raw, data, placeholder} = this.props;
    const value = getPropValue(this.props);

    if (raw) {
      return raw;
    } else if (html) {
      return filter(html, data);
    } else if (tpl) {
      return filter(tpl, data);
    } else if (text) {
      return escapeHtml(filter(text, data));
    } else {
      return value == null || value === ''
        ? `<span class="text-muted">${placeholder}</span>`
        : typeof value === 'string'
        ? value
        : JSON.stringify(value);
    }
  }

  render() {
    const {
      className,
      wrapperComponent,
      inline,
      classnames: cx,
      style,
      showNativeTitle,
      data,
      env
    } = this.props;
    const Component = wrapperComponent || (inline ? 'span' : 'div');
    const content = env.filterHtml(this.getContent());

    return (
      <Component
        className={cx('TplField', className)}
        style={buildStyle(style, data)}
        {...(showNativeTitle
          ? {title: typeof content === 'string' ? content : ''}
          : {})}
      >
        <span dangerouslySetInnerHTML={{__html: content}}></span>
      </Component>
    );
  }
}

@Renderer({
  test: /(^|\/)(?:tpl|html)$/,
  name: 'tpl'
})
// @ts-ignore 类型没搞定
@withBadge
export class TplRenderer extends Tpl {}
