import React from 'react';
import {Renderer, RendererProps} from '../factory';
import {SchemaNode, Action} from '../types';
import {getScrollParent, autobind} from '../utils/helper';
import {findDOMNode} from 'react-dom';
import {resizeSensor} from '../utils/resize-sensor';
import {
  BaseSchema,
  SchemaClassName,
  SchemaCollection,
  SchemaTpl
} from '../Schema';
import {ActionSchema} from './Action';
import {FormSchemaHorizontal} from './Form/index';

/**
 * Panel渲染器。
 * 文档：https://baidu.gitee.io/amis/docs/components/panel
 */
export interface PanelSchema extends BaseSchema {
  /**
   * 指定为Panel渲染器。
   */
  type: 'panel';

  /**
   * 按钮集合
   */
  actions?: Array<ActionSchema>;

  /**
   * 按钮集合外层类名
   */
  actionsClassName?: SchemaClassName;

  /**
   * 内容区域
   */
  body?: SchemaCollection;

  /**
   * 配置 Body 容器 className
   */
  bodyClassName?: SchemaClassName;

  /**
   * 底部内容区域
   */
  footer?: SchemaCollection;

  /**
   * 配置 footer 容器 className
   */
  footerClassName?: SchemaClassName;

  /**
   * footer 和 actions 外层 div 类名。
   */
  footerWrapClassName?: SchemaClassName;

  /**
   * 头部内容, 和 title 二选一。
   */
  header?: SchemaCollection;

  /**
   * 配置 header 容器 className
   */
  headerClassName?: SchemaClassName;

  /**
   * Panel 标题
   */
  title?: SchemaTpl;

  /**
   * 固定底部, 想要把按钮固定在底部的时候配置。
   */
  affixFooter?: boolean | 'always';

  /**
   * 配置子表单项默认的展示方式。
   */
  subFormMode?: 'normal' | 'inline' | 'horizontal';
  /**
   * 如果是水平排版，这个属性可以细化水平排版的左右宽度占比。
   */
  subFormHorizontal?: FormSchemaHorizontal;
}

export interface PanelProps
  extends RendererProps,
    Omit<
      PanelSchema,
      'type' | 'className' | 'panelClassName' | 'bodyClassName'
    > {}

export default class Panel extends React.Component<PanelProps> {
  static propsList: Array<string> = [
    'header',
    'actions',
    'children',
    'headerClassName',
    'footerClassName',
    'footerWrapClassName',
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
  timer: ReturnType<typeof setTimeout>;

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
    clearTimeout(this.timer);
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
    const offsetBottom =
      this.props.affixOffsetBottom ?? this.props.env.affixOffsetBottom ?? 0;
    let affixed = false;

    if (footerDom.offsetWidth) {
      affixDom.style.cssText = `bottom: ${offsetBottom}px;width: ${footerDom.offsetWidth}px`;
    } else {
      this.timer = setTimeout(this.affixDetect, 250);
      return;
    }

    if (this.props.affixFooter === 'always') {
      affixed = true;
      footerDom.classList.add('invisible2');
    } else {
      const clip = footerDom.getBoundingClientRect();
      const clientHeight = window.innerHeight;
      // affixed = clip.top + clip.height / 2 > clientHeight;
      affixed = clip.bottom > clientHeight - offsetBottom;
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
      formMode,
      formHorizontal,
      subFormMode,
      subFormHorizontal,
      ...rest
    } = this.props;

    const subProps = {
      data,
      ...rest,
      formMode: subFormMode || formMode,
      formHorizontal: subFormHorizontal || formHorizontal
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
      footerWrapClassName,
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
      <div
        className={cx('Panel-footerWrap', footerWrapClassName)}
        ref={this.footerDom}
      >
        {footerDoms}
      </div>
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
          <div
            ref={this.affixDom}
            className={cx(
              'Panel-fixedBottom Panel-footerWrap',
              footerWrapClassName
            )}
          >
            {footerDoms}
          </div>
        ) : null}
      </div>
    );
  }
}

@Renderer({
  type: 'panel'
})
export class PanelRenderer extends Panel {}
