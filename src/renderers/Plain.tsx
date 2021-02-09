import React from 'react';
import {Renderer, RendererProps} from '../factory';
import {filter} from '../utils/tpl';
import cx from 'classnames';
import {BaseSchema, SchemaTpl} from '../Schema';

/**
 * Plain 纯文本渲染器
 * 文档：https://baidu.gitee.io/amis/docs/components/plain
 */
export interface PlainSchema extends BaseSchema {
  /**
   * 指定为模板渲染器。
   *
   * 文档：https://baidu.gitee.io/amis/docs/concepts/template
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

  render() {
    const {
      className,
      wrapperComponent,
      value,
      text,
      data,
      tpl,
      inline,
      placeholder,
      classnames: cx
    } = this.props;

    const Component = wrapperComponent || (inline ? 'span' : 'div');

    return (
      <Component className={cx('PlainField', className)}>
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
  test: /(^|\/)(?:plain|text)$/,
  name: 'plain'
})
export class PlainRenderer extends Plain {}
