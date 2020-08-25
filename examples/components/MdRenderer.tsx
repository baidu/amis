/* eslint-disable no-unused-vars */
import React from 'react';
import ReactDOM from 'react-dom';
import {render} from '../../src/index';
import axios from 'axios';
import TitleBar from '../../src/components/TitleBar';
import LazyComponent from '../../src/components/LazyComponent';
import Overlay from '../../src/components/Overlay';
import PopOver from '../../src/components/PopOver';
import NestedLinks from '../../src/components/AsideNav';
import {Portal} from 'react-overlays';
import classnames from 'classnames';
import {Link} from 'react-router';

class CodePreview extends React.Component {
  state = {
    PlayGround: null
  };
  componentDidMount() {
    require(['./Play'], component =>
      this.setState({
        PlayGround: component.default
      }));
  }

  render() {
    const {
      container,
      height,
      setAsideFolded,
      setHeaderVisible,
      ...rest
    } = this.props;

    const PlayGround = this.state.PlayGround;
    // 不要放在 .markdown-body 下面，因为样式会干扰，复写又麻烦，所以通过 Overlay 渲染到同级

    return (
      <div>
        <span style={{display: 'block', height: height}} ref="span" />
        {PlayGround ? (
          <Overlay
            container={container}
            target={() => this.refs.span}
            placement="bottom"
            show
          >
            <PopOver
              theme={(rest as any).theme}
              offset={{x: 0, y: -height}}
              style={{height}}
              className=":MDPreview-shcema-preview-popover"
            >
              <div className="MDPreview-schema-preview">
                <PlayGround {...rest} vertical />
              </div>
            </PopOver>
          </Overlay>
        ) : null}
      </div>
    );
  }
}

function isActive(link, location) {
  return !!(link.fullPath && link.fullPath === location.hash);
}

class Preview extends React.Component {
  static displayName = 'MarkdownRenderer';
  ref = null;
  doms = [];
  constructor(props) {
    super(props);
    this.divRef = this.divRef.bind(this);
    this.handleClick = this.handleClick.bind(this);
  }

  componentDidMount() {
    this.renderSchema();

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
  }

  componentWillUnmount() {
    this.doms.forEach(dom => ReactDOM.unmountComponentAtNode(dom));
  }

  handleClick(e) {
    const href = e.target.getAttribute('href');
    if (href && href[0] !== '#' && !/^http/.test(href)) {
      e.preventDefault();
      this.props.push(href);
    }
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
      dom.setAttribute('class', 'doc-play-ground');
      dom.setAttribute('style', `height: ${height}px;`);
      script.parentNode.replaceChild(dom, script);

      this.doms.push(dom);
      ReactDOM.unstable_renderSubtreeIntoContainer(
        this,
        <LazyComponent
          {...this.props}
          height={height}
          container={() => ReactDOM.findDOMNode(this)}
          height={height}
          component={CodePreview}
          code={script.innerText}
          scope={props.scope}
          unMountOnHidden
          placeholder="加载中，请稍后。。。"
        />,
        dom
      );
    }
  }

  render() {
    return (
      <div className="MDPreview">
        <div className="markdown-body" ref={this.divRef}>
          Doc
        </div>
      </div>
    );
  }
}

export default function (doc) {
  return class extends React.Component {
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

    render() {
      const {prevDoc, nextDoc, ContextPath} = this.props;

      return (
        <>
          <div className="Doc-content">
            {doc.title ? (
              <div className="Doc-title">
                <h1>{doc.title}</h1>
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
                  href={`https://github.com/baidu/amis/tree/master${location.pathname.replace(
                    ContextPath,
                    ''
                  )}.md`}
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
