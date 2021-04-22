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
      this.dom.innerHTML = markdownRender(nextProps.content || '');
    }
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
