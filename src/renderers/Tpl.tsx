import React from 'react';
import {Renderer, RendererProps} from '../factory';
import {filter} from '../utils/tpl';
import cx from 'classnames';
import {anyChanged} from '../utils/helper';
import {escapeHtml} from '../utils/tpl-builtin';
import {BaseSchema, SchemaTpl} from '../Schema';

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
    placeholder: '',
    value: ''
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
    const {tpl, html, text, raw, value, data, placeholder} = this.props;

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

    this.dom.innerHTML = this.getContent();
  }

  render() {
    const {className, wrapperComponent, inline, classnames: cx} = this.props;
    const Component = wrapperComponent || 'div';

    return (
      <Component
        children={this.getContent()}
        ref={this.htmlRef}
        className={cx('TplField', inline ? 'is-inline' : '', className)}
      />
    );
  }
}

@Renderer({
  test: /(^|\/)(?:tpl|html)$/,
  name: 'tpl'
})
export class TplRenderer extends Tpl {}
