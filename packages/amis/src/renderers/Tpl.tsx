import React from 'react';
import {autobind, createObject, Renderer, RendererProps} from 'amis-core';
import {filter, asyncFilter} from 'amis-core';
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
   * 文档：https://aisuda.bce.baidu.com/amis/zh-CN/docs/concepts/template
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

interface TplState {
  content: string;
}

export class Tpl extends React.Component<TplProps, TplState> {
  static defaultProps: Partial<TplProps> = {
    inline: true,
    placeholder: ''
  };

  dom: any;
  mounted: boolean;

  constructor(props: TplProps) {
    super(props);
    this.state = {
      content: this.getContent()
    };
    this.mounted = true;
  }

  componentDidUpdate(prevProps: Readonly<TplProps>): void {
    const checkProps = ['tpl', 'html', 'text', 'raw', 'data', 'placeholder'];
    if (
      checkProps.some(key => prevProps[key] !== this.props[key]) ||
      getPropValue(prevProps) !== getPropValue(this.props)
    ) {
      this.updateContent();
    }
  }

  componentDidMount() {
    this.updateContent();
  }

  componentWillUnmount() {
    this.mounted = false;
  }

  @autobind
  updateContent() {
    const {tpl, html, text} = this.props;

    if (html || tpl || text) {
      this.getAsyncContent().then(content => {
        this.mounted && this.setState({content});
      });
    }
  }

  @autobind
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

  @autobind
  async getAsyncContent() {
    const {tpl, html, text, data} = this.props;

    if (html || tpl) {
      return asyncFilter(html || tpl, data);
    } else {
      return escapeHtml(await asyncFilter(text, data));
    }
  }

  /**
   * 过滤掉HTML标签, 仅提取文本内容, 用于HTML标签的title属性
   */
  @autobind
  getTitle(content: string) {
    const {showNativeTitle} = this.props;

    if (!showNativeTitle) {
      return '';
    }

    let title = typeof content === 'string' ? content : '';
    const tempDom = new DOMParser().parseFromString(content, 'text/html');

    if (tempDom?.body?.textContent) {
      title = tempDom.body.textContent;
    }

    return title;
  }

  @autobind
  handleClick(e: React.MouseEvent<HTMLDivElement>) {
    const {dispatchEvent, data} = this.props;
    dispatchEvent(e, data);
  }

  @autobind
  handleMouseEnter(e: React.MouseEvent<any>) {
    const {dispatchEvent, data} = this.props;
    dispatchEvent(e, data);
  }

  @autobind
  handleMouseLeave(e: React.MouseEvent<any>) {
    const {dispatchEvent, data} = this.props;
    dispatchEvent(e, data);
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
    const {content} = this.state;

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
