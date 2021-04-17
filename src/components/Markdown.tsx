import React from 'react';

import markdownRender from '../utils/markdown';

interface MarkdownProps {
  content: string;
}

export default class Markdown extends React.Component<MarkdownProps> {
  dom: any;
  htmlRef(dom: any) {
    this.dom = dom;
    if (!dom) {
      return;
    }
    this._render();
  }

  _render() {
    const {content} = this.props;
    if (content) {
      this.dom.innerHTML = markdownRender(content);
    }
  }

  render() {
    return <div ref={this.htmlRef}></div>;
  }
}
