/**
 * @file Html
 * @description
 * @author fex
 */

import React from 'react';
import cx from 'classnames';
import {classPrefix, classnames} from '../themes/default';
import {ClassNamesFn, themeable} from '../theme';

export interface HtmlProps {
  className?: string;
  html?: string;
  wrapperComponent?: any;
  inline: boolean;
  classPrefix: string;
  classnames: ClassNamesFn;
}

export class Html extends React.Component<HtmlProps> {
  static defaultProps = {
    inline: true
  };

  dom: any;

  constructor(props: HtmlProps) {
    super(props);
    this.htmlRef = this.htmlRef.bind(this);
  }

  componentDidUpdate(prevProps: HtmlProps) {
    if (this.props.html !== prevProps.html) {
      this._render();
    }
  }

  htmlRef(dom: any) {
    this.dom = dom;

    if (!dom) {
      return;
    }

    this._render();
  }

  _render() {
    const {html} = this.props;

    if (html) {
      this.dom.firstChild.innerHTML = html;
    }
  }

  render() {
    const {className, wrapperComponent, inline, classPrefix: ns} = this.props;

    const Component = wrapperComponent || (inline ? 'span' : 'div');

    return (
      <Component ref={this.htmlRef} className={cx(`${ns}Html`, className)}>
        <span />
      </Component>
    );
  }
}

export default themeable(Html);
