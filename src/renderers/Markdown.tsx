/**
 * @file 用来渲染 Markdown
 */
import React from 'react';
import {Renderer, RendererProps} from '../factory';
import {BaseSchema} from '../Schema';
import {resolveVariableAndFilter} from '../utils/tpl-builtin';
import LazyComponent from '../components/LazyComponent';
import {getPropValue} from '../utils/helper';

/**
 * Markdown 渲染
 * 文档：https://baidu.gitee.io/amis/docs/components/markdown
 */
export interface MarkdownSchema extends BaseSchema {
  /**
   * markdown 渲染
   */
  type: 'markdown';

  /**
   * markdown 内容
   */
  value?: string;

  /**
   * 样式类
   */
  className?: string;

  /**
   * 名字映射
   */
  name?: string;
}

function loadComponent(): Promise<any> {
  return import('../components/Markdown').then(item => item.default);
}

export interface MarkdownProps
  extends RendererProps,
    Omit<MarkdownSchema, 'type' | 'className'> {}

export class Markdown extends React.Component<MarkdownProps, object> {
  render() {
    const {className, data, classnames: cx, name} = this.props;
    const content =
      getPropValue(this.props) ||
      (name ? resolveVariableAndFilter(name, data, '| raw') : null);

    return (
      <div className={cx('Markdown', className)}>
        <LazyComponent getComponent={loadComponent} content={content} />
      </div>
    );
  }
}

@Renderer({
  type: 'markdown'
})
export class MarkdownRenderer extends Markdown {}
