import React from 'react';
import {Renderer, RendererProps} from '../factory';
import {SchemaNode, Action} from '../types';
import {getScrollParent, autobind} from '../utils/helper';
import {findDOMNode} from 'react-dom';
import {resizeSensor} from '../utils/resize-sensor';

export interface PanelProps extends RendererProps {
  title?: string; // 标题
  header?: SchemaNode;
  body?: SchemaNode;
  footer?: SchemaNode;
  actions?: Action[];
  className?: string;
  headerClassName?: string;
  footerClassName?: string;
  actionsClassName?: string;
  bodyClassName?: string;
  affixFooter?: boolean | 'always';
}

export default class Panel extends React.Component<PanelProps> {
  static propsList: Array<string> = [
    'headerClassName',
    'footerClassName',
    'actionsClassName',
    'bodyClassName'
  ];
  static defaultProps = {
    // className: 'Panel--default',
    // headerClassName: 'Panel-heading',
    // footerClassName: 'Panel-footer bg-light lter Wrapper',
    // actionsClassName: 'Panel-footer',
    // bodyClassName: 'Panel-body'
  };

  parentNode?: any;
  unSensor: Function;
  affixDom: React.RefObject<HTMLDivElement> = React.createRef();
  footerDom: React.RefObject<HTMLDivElement> = React.createRef();

  componentDidMount() {
    const dom = findDOMNode(this) as HTMLElement;
    let parent: HTMLElement | Window | null = dom ? getScrollParent(dom) : null;
    if (!parent || parent === document.body) {
      parent = window;
    }
    this.parentNode = parent;
    parent.addEventListener('scroll', this.affixDetect);
    this.unSensor = resizeSensor(dom as HTMLElement, this.affixDetect);
    this.affixDetect();
  }

  componentWillUnmount() {
    const parent = this.parentNode;
    parent && parent.removeEventListener('scroll', this.affixDetect);
    this.unSensor && this.unSensor();
  }

  @autobind
  affixDetect() {
    if (
      !this.props.affixFooter ||
      !this.affixDom.current ||
      !this.footerDom.current
    ) {
      return;
    }

    const affixDom = this.affixDom.current;
    const footerDom = this.footerDom.current;
    let affixed = false;
    footerDom.offsetWidth &&
      (affixDom.style.cssText = `width: ${footerDom.offsetWidth}px;`);

    if (this.props.affixFooter === 'always') {
      affixed = true;
      footerDom.classList.add('invisible2');
    } else {
      const clip = footerDom.getBoundingClientRect();
      const clientHeight = window.innerHeight;
      affixed = clip.top + clip.height / 2 > clientHeight;
    }

    affixed ? affixDom.classList.add('in') : affixDom.classList.remove('in');
  }

  renderBody(): JSX.Element | null {
    const {
      type,
      className,
      data,
      header,
      body,
      render,
      bodyClassName,
      headerClassName,
      actionsClassName,
      footerClassName,
      children,
      title,
      actions,
      footer,
      classPrefix: ns,
      ...rest
    } = this.props;

    const subProps = {
      data,
      ...rest
    };

    return children
      ? typeof children === 'function'
        ? children(this.props)
        : children
      : body
      ? render('body', body, subProps)
      : null;
  }

  renderActions() {
    const {actions, render} = this.props;

    if (Array.isArray(actions) && actions.length) {
      return actions.map((action, key) =>
        render('action', action, {
          type: action.type || 'button',
          key: key
        })
      );
    }

    return null;
  }

  render() {
    const {
      type,
      className,
      data,
      header,
      body,
      render,
      bodyClassName,
      headerClassName,
      actionsClassName,
      footerClassName,
      children,
      title,
      footer,
      affixFooter,
      classPrefix: ns,
      classnames: cx,
      ...rest
    } = this.props;

    const subProps = {
      data,
      ...rest
    };

    const footerDoms = [];
    const actions = this.renderActions();
    actions &&
      footerDoms.push(
        <div
          key="actions"
          className={cx(`Panel-btnToolbar`, actionsClassName || `Panel-footer`)}
        >
          {actions}
        </div>
      );

    footer &&
      footerDoms.push(
        <div key="footer" className={cx(footerClassName || `Panel-footer`)}>
          {render('footer', footer, subProps)}
        </div>
      );

    let footerDom = footerDoms.length ? (
      <div ref={this.footerDom}>{footerDoms}</div>
    ) : null;

    return (
      <div className={cx(`Panel`, className || `Panel--default`)}>
        {header ? (
          <div className={cx(headerClassName || `Panel-heading`)}>
            {render('header', header, subProps)}
          </div>
        ) : title ? (
          <div className={cx(headerClassName || `Panel-heading`)}>
            <h3 className={cx(`Panel-title`)}>
              {render('title', title, subProps)}
            </h3>
          </div>
        ) : null}

        <div className={bodyClassName || `${ns}Panel-body`}>
          {this.renderBody()}
        </div>

        {footerDom}

        {affixFooter && footerDoms.length ? (
          <div ref={this.affixDom} className={cx('Panel-fixedBottom')}>
            {footerDoms}
          </div>
        ) : null}
      </div>
    );
  }
}

@Renderer({
  test: /(^|\/)panel$/,
  name: 'panel'
})
export class PanelRenderer extends Panel {}
