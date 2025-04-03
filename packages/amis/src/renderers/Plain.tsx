import React from 'react';
import {autobind, createObject, Renderer, RendererProps} from 'amis-core';
import {filter} from 'amis-core';
import cx from 'classnames';
import {BaseSchema, SchemaTpl} from '../Schema';
import {getPropValue} from 'amis-core';

/**
 * Plain 纯文本渲染器
 * 文档：https://aisuda.bce.baidu.com/amis/zh-CN/components/plain
 */
export interface PlainSchema extends BaseSchema {
  /**
   * 指定为模板渲染器。
   *
   * 文档：https://aisuda.bce.baidu.com/amis/zh-CN/docs/concepts/template
   */
  type: 'plain' | 'text';

  tpl?: SchemaTpl;
  text?: SchemaTpl;

  /**
   * 是否内联显示？
   */
  inline?: boolean;

  /**
   * 占位符
   * @deprecated -
   */
  placeholder?: string;
}
export interface PlainProps
  extends RendererProps,
    Omit<PlainSchema, 'type' | 'className'> {
  wrapperComponent?: any;
}

export class Plain extends React.Component<PlainProps, object> {
  static defaultProps: Partial<PlainProps> = {
    wrapperComponent: '',
    inline: true,
    placeholder: '-'
  };

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
      style,
      wrapperComponent,
      text,
      data,
      tpl,
      inline,
      placeholder,
      classnames: cx
    } = this.props;

    const value = getPropValue(this.props);
    const Component = wrapperComponent || (inline ? 'span' : 'div');

    return (
      <Component
        className={cx('PlainField', className)}
        style={style}
        onClick={this.handleClick}
        onMouseEnter={this.handleMouseEnter}
        onMouseLeave={this.handleMouseLeave}
      >
        {tpl || text ? (
          filter(tpl || (text as string), data)
        ) : typeof value === 'undefined' || value === '' || value === null ? (
          <span className="text-muted">{placeholder}</span>
        ) : (
          String(value)
        )}
      </Component>
    );
  }
}

@Renderer({
  type: 'plain',
  alias: ['text'],
  name: 'plain'
})
export class PlainRenderer extends Plain {}
