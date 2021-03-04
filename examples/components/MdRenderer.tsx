/* eslint-disable no-unused-vars */
import React from 'react';
import ReactDOM from 'react-dom';
import {getTheme, render} from '../../src/index';
import axios from 'axios';
import TitleBar from '../../src/components/TitleBar';
import LazyComponent from '../../src/components/LazyComponent';
import Overlay from '../../src/components/Overlay';
import PopOver from '../../src/components/PopOver';
import NestedLinks from '../../src/components/AsideNav';
import {Portal} from 'react-overlays';
import classnames from 'classnames';
import {Link} from 'react-router';
import Play from './Play';

class CodePreview extends React.Component<any> {
  state = {
    PlayGround: null
  };

  render() {
    const {container, setAsideFolded, setHeaderVisible, ...rest} = this.props;

    return <Play {...rest} vertical />;
  }
}

function eachDom(dom: HTMLElement, iterator: (dom: HTMLElement) => void) {
  if (!dom) {
    return;
  }

  iterator(dom);

  if (dom.children && dom.children.length) {
    [].slice.call(dom.children).forEach(dom => eachDom(dom, iterator));
  }
}

class Preview extends React.Component {
  static displayName = 'MarkdownRenderer';
  ref = null;
  doms = [];
  constructor(props) {
    super(props);
    this.divRef = this.divRef.bind(this);
  }

  componentDidMount() {
    this.renderSchema();
    this.fixHtmlPreview();

    if (location.hash && location.hash.length > 1) {
      // 禁用自动跳转
      if (window.history && 'scrollRestoration' in window.history) {
        window.history.scrollRestoration = 'manual';
      }

      const dom = document.querySelector(
        `[name="${location.hash.substring(1)}"]`
      );
      dom && dom.scrollIntoView();
    }
  }

  componentDidUpdate() {
    this.renderSchema();

    this.fixHtmlPreview();
  }

  componentWillUnmount() {
    this.doms.forEach(dom => ReactDOM.unmountComponentAtNode(dom));
  }

  divRef(ref) {
    this.ref = ref;

    if (ref) {
      ref.innerHTML = this.props.doc.html;
    }
  }

  renderSchema() {
    const scripts = document.querySelectorAll('script[type="text/schema"]');
    if (!scripts && !scripts.length) {
      return;
    }

    for (let i = 0, len = scripts.length; i < len; i++) {
      let script = scripts[i];
      let props = {};
      [].slice.apply(script.attributes).forEach(item => {
        props[item.name] = item.value;
      });

      let dom = document.createElement('div');
      let height = props.height ? parseInt(props.height, 10) : 200;

      if (this.props.viewMode === 'mobile') {
        // 移动端下高度不能太低
        if (height < 500) {
          height = 500;
        }
      }

      dom.setAttribute('class', 'doc-play-ground');
      // dom.setAttribute('style', `min-height: ${height}px;`);
      const origin = script.parentNode;
      origin.parentNode.replaceChild(dom, origin);

      this.doms.push(dom);
      ReactDOM.unstable_renderSubtreeIntoContainer(
        this,
        <LazyComponent
          {...this.props}
          container={() => ReactDOM.findDOMNode(this)}
          component={CodePreview}
          code={script.innerText}
          scope={props.scope}
          // unMountOnHidden
          height={height}
          placeholder="加载中，请稍后。。。"
        />,
        dom
      );
    }
  }

  fixHtmlPreview() {
    const htmlPreviews = document.querySelectorAll('.amis-doc>.preview');
    if (!htmlPreviews && !htmlPreviews.length) {
      return;
    }
    const ns = getTheme((this.props as any).theme)?.classPrefix;
    [].slice.call(htmlPreviews).forEach(dom => {
      eachDom(dom as HTMLElement, dom => {
        if (typeof dom.className !== 'string') {
          return;
        }

        dom.className = dom.className.replace(
          /(^|\s)([A-Z])/g,
          '$1' + ns + '$2'
        );
      });
    });
  }

  render() {
    return (
      <div className="MDPreview">
        <div className="markdown" ref={this.divRef}>
          Doc
        </div>
      </div>
    );
  }
}

export default function (doc) {
  return class extends React.Component {
    popoverDom = null;

    state = {
      headingPopover: false
    };

    popoverRef = (ref: HTMLDivElement) => {
      this.popoverDom = ref;
    };

    renderHeading(children) {
      return children.map((child, idx) => (
        <div
          key={`${child.fullPath}-${idx}`}
          className={classnames('Doc-headingList-item', {
            'is-active': this.props.location.hash === child.fullPath
          })}
        >
          <a href={`#${child.fragment}`}>{child.label}</a>

          {child.children && child.children.length
            ? this.renderHeading(child.children)
            : null}
        </div>
      ));
    }

    handlePopOverClick = (e: React.MouseEvent<any>) => {
      this.setState({headingPopover: false});
      e.stopPropagation();
      // e.preventDefault();
    };

    renderHeadingPopover() {
      return this.state.headingPopover ? (
        <Overlay
          target={this.popoverDom}
          container={this.popoverDom}
          rootClose={false}
          placement="right-bottom-right-top"
          show
        >
          <PopOver
            classPrefix="cxd-"
            className=":Doc-headingPopover"
            onHide={() => this.setState({headingPopover: false})}
            overlay
            onClick={this.handlePopOverClick}
          >
            {this.renderHeading(doc.toc.children)}
          </PopOver>
        </Overlay>
      ) : null;
    }

    render() {
      const {prevDoc, nextDoc, ContextPath} = this.props;

      return (
        <>
          <div className="Doc-content">
            {doc.title ? (
              <div className="Doc-title">
                <h1>{doc.title}</h1>

                {doc?.toc.children?.length ? (
                  <div
                    ref={this.popoverRef}
                    onClick={e =>
                      this.setState({
                        headingPopover: !this.state.headingPopover
                      })
                    }
                    className="Doc-headingPopBtn visible-xs"
                  >
                    <i className="fa fa-align-right"></i>
                    {this.renderHeadingPopover()}
                  </div>
                ) : null}
              </div>
            ) : null}

            <Preview {...this.props} doc={doc} />

            <div className="Doc-footer">
              <div className="Doc-navLinks">
                {prevDoc ? (
                  <Link
                    className="Doc-navLinks--prev"
                    to={`${ContextPath}${prevDoc.path}`}
                  >
                    <div className="Doc-navLinks-icon">
                      <i className="iconfont icon-arrow-left"></i>
                    </div>

                    <div className="Doc-navLinks-body text-right">
                      <div className="Doc-navLinks-subtitle">
                        上一篇 - {prevDoc.group || '其他'}
                      </div>
                      <div className="Doc-navLinks-title">{prevDoc.label} </div>
                    </div>
                  </Link>
                ) : null}

                {nextDoc ? (
                  <Link
                    className="Doc-navLinks--next"
                    to={`${ContextPath}${nextDoc.path}`}
                  >
                    <div className="Doc-navLinks-body">
                      <div className="Doc-navLinks-subtitle">
                        下一篇 - {nextDoc.group || '其他'}
                      </div>
                      <div className="Doc-navLinks-title">{nextDoc.label}</div>
                    </div>

                    <div className="Doc-navLinks-icon">
                      <i className="iconfont icon-arrow-right"></i>
                    </div>
                  </Link>
                ) : null}
              </div>
              <div className="Doc-footer-divider"></div>
              <div className="Doc-footer-fixme">
                文档有误？
                <a
                  href={`https://github.com/baidu/amis/blob/master${location.pathname
                    .replace(ContextPath, '')
                    .replace(/(zh-CN)\/(docs|components|style)/, '$2/$1')}.md`}
                  rel="noopener"
                  target="_blank"
                >
                  在 Github 上编辑此页！
                </a>
              </div>
            </div>
          </div>
          {doc.toc && doc.toc.children && doc.toc.children.length > 0 ? (
            <div className="Doc-toc hidden-xs hidden-sm">
              <div>
                <div className="Doc-headingList">
                  {this.renderHeading(doc.toc.children)}
                </div>
              </div>
            </div>
          ) : null}
        </>
      );
    }
  };
}
