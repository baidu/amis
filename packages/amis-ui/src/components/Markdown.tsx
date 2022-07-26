import React from 'react';

/**
 * @file markdown 解析
 */

import markdownIt from 'markdown-it';
// @ts-ignore
import {html5Media} from 'markdown-it-html5-media';

const doMarkdown = markdownIt();
doMarkdown.use(html5Media);

export function markdown(content: string, options?: markdownIt.Options) {
  if (options) {
    doMarkdown.set(options);
  }
  return doMarkdown.render(content);
}

interface MarkdownProps {
  content: string;
  options: object;
}

export default class Markdown extends React.Component<MarkdownProps> {
  dom: any;

  static defaultProps = {
    content: '',
    options: {
      linkify: true
    }
  };

  constructor(props: MarkdownProps) {
    super(props);
    this.htmlRef = this.htmlRef.bind(this);
  }

  htmlRef(dom: any) {
    this.dom = dom;
    if (!dom) {
      return;
    }
    this._render();
  }

  componentDidUpdate(nextProps: MarkdownProps) {
    if (this.props.content !== nextProps.content) {
      this._render();
    }
  }

  async _render() {
    const {content, options} = this.props;
    this.dom.innerHTML = markdown(content, options);
  }

  render() {
    return (
      <div
        data-testid="markdown-body"
        className="markdown-body"
        ref={this.htmlRef}
      ></div>
    );
  }
}
