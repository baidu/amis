/**
 * @file 用来渲染 Markdown
 */
import React from 'react';
import {AMISSchemaBase, Renderer, RendererProps} from 'amis-core';
import {BaseSchema} from '../Schema';
import {isPureVariable, resolveVariableAndFilter} from 'amis-core';
import {LazyComponent} from 'amis-core';
import {getPropValue} from 'amis-core';
import {isApiOutdated, isEffectiveApi} from 'amis-core';

/**
 * Markdown 渲染组件，用于渲染 Markdown 内容。支持代码高亮、数学公式等扩展语法。
 */
export interface AMISMarkdownSchema extends AMISSchemaBase {
  /**
   * 指定为 markdown 组件
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
   * 名称映射
   */
  name?: string;
}

function loadComponent(): Promise<any> {
  return import('amis-ui/lib/components/Markdown').then(item => item.default);
}

export interface MarkdownProps
  extends RendererProps,
    Omit<AMISMarkdownSchema, 'type' | 'className'> {}

interface MarkdownState {
  content: string;
}

export class Markdown extends React.Component<MarkdownProps, MarkdownState> {
  constructor(props: MarkdownProps) {
    super(props);
    const {name, data, src} = this.props;
    if (src) {
      this.state = {content: ''};
      this.updateContent();
    } else {
      const content =
        getPropValue(this.props) ||
        (name && isPureVariable(name)
          ? resolveVariableAndFilter(name, data, '| raw')
          : null);
      this.state = {content};
    }
  }

  componentDidUpdate(prevProps: MarkdownProps) {
    const props = this.props;
    if (props.src) {
      if (isApiOutdated(prevProps.src, props.src, prevProps.data, props.data)) {
        this.updateContent();
      }
    } else {
      this.updateContent();
    }
  }

  async updateContent() {
    const {name, data, src, env} = this.props;
    if (src && isEffectiveApi(src, data)) {
      const ret = await env.fetcher(src, data);
      if (typeof ret === 'string') {
        this.setState({content: ret});
      } else if (typeof ret === 'object' && ret.data) {
        this.setState({content: ret.data});
      } else {
        console.error('markdown response error', ret);
      }
    } else {
      const content =
        getPropValue(this.props) ||
        (name && isPureVariable(name)
          ? resolveVariableAndFilter(name, data, '| raw')
          : null);
      if (content !== this.state.content) {
        this.setState({content});
      }
    }
  }

  render() {
    const {className, style, classnames: cx, options} = this.props;

    return (
      <div className={cx('Markdown', className)} style={style}>
        <LazyComponent
          getComponent={loadComponent}
          content={this.state.content || ''}
          options={options}
        />
      </div>
    );
  }
}

@Renderer({
  type: 'markdown'
})
export class MarkdownRenderer extends Markdown {}
