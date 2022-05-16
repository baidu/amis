import React from 'react';
import {Renderer, RendererProps} from '../factory';
import {filter} from '../utils/tpl';
import cx from 'classnames';
import {anyChanged, getPropValue} from '../utils/helper';
import {escapeHtml} from '../utils/tpl-builtin';
import {BaseSchema, SchemaTpl} from '../Schema';
import {BadgeSchema, withBadge} from '../components/Badge';
import {buildStyle} from '../utils/style';

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
  badge?: BadgeSchema;
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
    this.htmlRef = this.htmlRef.bind(this);
  }

  componentDidUpdate(prevProps: TplProps) {
    if (
      anyChanged(
        ['data', 'tpl', 'html', 'text', 'raw', 'value'],
        this.props,
        prevProps
      )
    ) {
      this._render();
    }
  }

  htmlRef(dom: any) {
    this.dom = dom;
    this._render();
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

  _render() {
    if (!this.dom) {
      return;
    }

    this.dom.firstChild.innerHTML = this.props.env.filterHtml(
      this.getContent()
    );
  }

  render() {
    const {
      className,
      wrapperComponent,
      inline,
      classnames: cx,
      style,
      data
    } = this.props;
    const Component = wrapperComponent || (inline ? 'span' : 'div');

    return (
      <Component
        ref={this.htmlRef}
        className={cx('TplField', className)}
        style={buildStyle(style, data)}
      >
        <span>{this.getContent()}</span>
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
