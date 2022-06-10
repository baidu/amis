/**
 * @file Collapse
 * @description
 * @author fex
 */

import React from 'react';
import {ClassNamesFn, themeable} from 'amis-core';
import Transition, {
  EXITED,
  ENTERING,
  EXITING
} from 'react-transition-group/Transition';
import {autobind} from 'amis-core';
import {isClickOnInput} from 'amis-core';
import {TranslateFn} from 'amis-core';

const collapseStyles: {
  [propName: string]: string;
} = {
  [EXITED]: 'out',
  [EXITING]: 'out',
  [ENTERING]: 'in'
};

export interface CollapseProps {
  key?: string;
  collapseId?: string;
  propKey?: string;
  mountOnEnter?: boolean;
  unmountOnExit?: boolean;
  className?: string;
  classPrefix: string;
  classnames: ClassNamesFn;
  headerPosition?: 'top' | 'bottom';
  header?: React.ReactNode;
  body: any;
  bodyClassName?: string;
  disabled?: boolean;
  collapsable?: boolean;
  collapsed?: boolean;
  showArrow?: boolean;
  expandIcon?: React.ReactElement | null;
  headingClassName?: string;
  collapseHeader?: React.ReactElement | null;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'base';
  onCollapse?: (item: any, collapsed: boolean) => void;
  wrapperComponent?: any;
  headingComponent?: any;
  translate?: TranslateFn;
  propsUpdate?: boolean;
}

export interface CollapseState {
  collapsed: boolean;
}

export class Collapse extends React.Component<CollapseProps, CollapseState> {
  static defaultProps: Partial<CollapseProps> = {
    mountOnEnter: false,
    unmountOnExit: false,
    headerPosition: 'top',
    wrapperComponent: 'div',
    headingComponent: 'div',
    className: '',
    headingClassName: '',
    bodyClassName: '',
    collapsable: true,
    disabled: false,
    showArrow: true,
    propsUpdate: false
  };

  state: CollapseState = {
    collapsed: false
  };

  constructor(props: CollapseProps) {
    super(props);

    this.toggleCollapsed = this.toggleCollapsed.bind(this);
    this.state.collapsed = props.collapsable ? !!props.collapsed : false;
  }

  static getDerivedStateFromProps(
    nextProps: CollapseProps,
    preState: CollapseState
  ) {
    if (nextProps.propsUpdate && nextProps.collapsed !== preState.collapsed) {
      return {
        collapsed: !!nextProps.collapsed
      };
    }
    return null;
  }

  toggleCollapsed(e: React.MouseEvent<HTMLElement>) {
    if (isClickOnInput(e)) {
      return;
    }
    const props = this.props;
    if (props.disabled || props.collapsable === false) {
      return;
    }
    props.onCollapse && props.onCollapse(props, !this.state.collapsed);
    this.setState({
      collapsed: !this.state.collapsed
    });
  }

  contentDom: any;
  contentRef = (ref: any) => (this.contentDom = ref);

  @autobind
  handleEnter(elem: HTMLElement) {
    elem.style['height'] = '';
  }

  @autobind
  handleEntering(elem: HTMLElement) {
    elem.style['height'] = `${elem['scrollHeight']}px`;
  }

  @autobind
  handleEntered(elem: HTMLElement) {
    elem.style['height'] = '';
  }

  @autobind
  handleExit(elem: HTMLElement) {
    let offsetHeight = elem['offsetHeight'];
    const height =
      offsetHeight +
      parseInt(getComputedStyle(elem).getPropertyValue('margin-top'), 10) +
      parseInt(getComputedStyle(elem).getPropertyValue('margin-bottom'), 10);
    elem.style['height'] = `${height}px`;
    // trigger browser reflow
    elem.offsetHeight;
  }

  @autobind
  handleExiting(elem: HTMLElement) {
    elem.style['height'] = '';
  }

  render() {
    const {
      classnames: cx,
      mountOnEnter,
      unmountOnExit,
      classPrefix: ns,
      size,
      wrapperComponent: WrapperComponent,
      headingComponent: HeadingComponent,
      className,
      headingClassName,
      headerPosition,
      collapseHeader,
      header,
      body,
      bodyClassName,
      collapsable,
      translate: __,
      showArrow,
      expandIcon,
      disabled,
      children
    } = this.props;

    const finalHeader = this.state.collapsed
      ? header
      : collapseHeader || header;

    let dom = [
      finalHeader ? (
        <HeadingComponent
          key="header"
          onClick={this.toggleCollapsed}
          className={cx(`Collapse-header`, headingClassName)}
        >
          {showArrow && collapsable ? (
            expandIcon ? (
              React.cloneElement(expandIcon, {
                ...expandIcon.props,
                className: cx(
                  'Collapse-icon-tranform',
                  expandIcon.props?.className
                )
              })
            ) : (
              <span className={cx('Collapse-arrow')} />
            )
          ) : (
            ''
          )}
          {finalHeader}
        </HeadingComponent>
      ) : null,

      <Transition
        key="body"
        mountOnEnter={mountOnEnter}
        unmountOnExit={unmountOnExit}
        in={!this.state.collapsed}
        timeout={300}
        onEnter={this.handleEnter}
        onEntering={this.handleEntering}
        onEntered={this.handleEntered}
        onExit={this.handleExit}
        onExiting={this.handleExiting}
      >
        {(status: string) => {
          if (status === ENTERING) {
            this.contentDom.offsetWidth;
          }
          return (
            <div
              className={cx('Collapse-contentWrapper', collapseStyles[status])}
              ref={this.contentRef}
            >
              <div className={cx('Collapse-body', bodyClassName)}>
                <div className={cx('Collapse-content')}>{body || children}</div>
              </div>
            </div>
          );
        }}
      </Transition>
    ];

    if (headerPosition === 'bottom') {
      dom.reverse();
    }

    return (
      <WrapperComponent
        className={cx(
          `Collapse`,
          {
            'is-active': !this.state.collapsed,
            [`Collapse--${size}`]: size,
            'Collapse--disabled': disabled,
            'Collapse--title-bottom': headerPosition === 'bottom'
          },
          className
        )}
      >
        {dom}
      </WrapperComponent>
    );
  }
}

export default themeable(Collapse);
