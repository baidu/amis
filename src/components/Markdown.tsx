import React from 'react';

import markdownRender from '../utils/markdown';

interface MarkdownProps {
  content: string;
}

export default class Markdown extends React.Component<MarkdownProps> {
  dom: any;

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

  _render() {
    const {content} = this.props;
    this.dom.innerHTML = markdownRender(content || '');
  }

  render() {
    return <div className="markdown-body" ref={this.htmlRef}></div>;
  }
}
