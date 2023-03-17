import React from 'react';
import {autobind, createObject, Renderer, RendererProps} from 'amis-core';
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
   * 标签类型
   */
  wrapperComponent?: any;

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

  /**
   * 过滤掉HTML标签, 仅提取文本内容, 用于HTML标签的title属性
   */
  getTitle(content: string): string {
    const {showNativeTitle} = this.props;

    if (!showNativeTitle) {
      return '';
    }

    let title = typeof content === 'string' ? content : '';
    const tempDom = new DOMParser().parseFromString(
      this.getContent(),
      'text/html'
    );

    if (tempDom?.body?.textContent) {
      title = tempDom.body.textContent;
    }

    return title;
  }

  @autobind
  handleClick(e: React.MouseEvent<HTMLDivElement>) {
    const {dispatchEvent, data} = this.props;
    dispatchEvent(
      'click',
      createObject(data, {
        nativeEvent: e
      })
    );
  }

  @autobind
  handleMouseEnter(e: React.MouseEvent<any>) {
    const {dispatchEvent, data} = this.props;
    dispatchEvent(
      e,
      createObject(data, {
        nativeEvent: e
      })
    );
  }

  @autobind
  handleMouseLeave(e: React.MouseEvent<any>) {
    const {dispatchEvent, data} = this.props;
    dispatchEvent(
      e,
      createObject(data, {
        nativeEvent: e
      })
    );
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
    const content = this.getContent();

    return (
      <Component
        className={cx('TplField', className)}
        style={buildStyle(style, data)}
        {...(showNativeTitle ? {title: this.getTitle(content)} : {})}
        onClick={this.handleClick}
        onMouseEnter={this.handleMouseEnter}
        onMouseLeave={this.handleMouseLeave}
      >
        <span
          dangerouslySetInnerHTML={{__html: env.filterHtml(content)}}
        ></span>
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
