/**
 * @file Overlay
 * @description
 * @author fex
 */

import Portal from 'react-overlays/Portal';
import classNames from 'classnames';
import ReactDOM, {findDOMNode} from 'react-dom';
import React, {cloneElement} from 'react';
import {
  autobind,
  calculatePosition,
  getComputedStyle,
  getContainer,
  getScrollParent,
  noop,
  ownerDocument,
  resizeSensor,
  RootClose
} from '../utils';

function onScroll(elem: HTMLElement, callback: () => void) {
  const handler = () => {
    requestAnimationFrame(callback);
  };
  elem.addEventListener('scroll', handler);
  return function () {
    elem.removeEventListener('scroll', handler);
  };
}

class Position extends React.Component<any, any> {
  props: any;
  _lastTarget: any;
  resizeDispose: Array<() => void>;
  watchedTarget: any;
  // setState: (state: any) => void;

  static defaultProps = {
    containerPadding: 0,
    placement: 'right',
    shouldUpdatePosition: false
  };

  constructor(props: any) {
    super(props);

    this.state = {
      positionLeft: 0,
      positionTop: 0,
      arrowOffsetLeft: null,
      arrowOffsetTop: null
    };

    this._lastTarget = null;
  }

  updatePosition(target: any) {
    this._lastTarget = target;

    if (!target) {
      return this.setState({
        positionLeft: 0,
        positionTop: 0,
        arrowOffsetLeft: null,
        arrowOffsetTop: null
      });
    }

    const watchTargetSizeChange = this.props.watchTargetSizeChange;
    const overlay = findDOMNode(this as any) as HTMLElement;
    const container = getContainer(
      this.props.container,
      ownerDocument(this).body
    );

    if (
      (!this.watchedTarget || this.watchedTarget !== target) &&
      getComputedStyle(target, 'position') !== 'static'
    ) {
      this.resizeDispose?.forEach(fn => fn());
      this.watchedTarget = target;
      this.resizeDispose = [
        watchTargetSizeChange !== false
          ? resizeSensor(target, () => this.updatePosition(target))
          : noop,
        resizeSensor(overlay, () => this.updatePosition(target))
      ];

      const scrollParent = getScrollParent(target);
      if (scrollParent && container.contains(scrollParent)) {
        this.resizeDispose.push(
          onScroll(scrollParent, () => {
            this.updatePosition(target);
          })
        );
      }
    }

    this.setState(
      calculatePosition(
        this.props.placement,
        overlay,
        target,
        container,
        this.props.containerPadding,
        this.props.offset
      )
    );
  }

  componentDidMount() {
    this.updatePosition(this.getTarget());
  }

  getTarget = () => {
    const {target} = this.props;
    const targetElement = typeof target === 'function' ? target() : target;
    return (targetElement && ReactDOM.findDOMNode(targetElement)) || null;
  };

  componentDidUpdate(prevProps: any) {
    this.maybeUpdatePosition(this.props.placement !== prevProps.placement);
  }

  maybeUpdatePosition = (placementChanged: any) => {
    const target = this.getTarget();

    if (
      !this.props.shouldUpdatePosition &&
      target === this._lastTarget &&
      !placementChanged
    ) {
      return;
    }

    this.updatePosition(target);
  };

  componentWillUnmount() {
    this.resizeDispose?.forEach(fn => fn());
  }

  render() {
    const {children, className, ...props} = this.props;
    const {positionLeft, positionTop, ...arrowPosition} = this.state;

    // These should not be forwarded to the child.
    delete props.target;
    delete props.container;
    delete props.containerPadding;
    delete props.shouldUpdatePosition;

    const child = React.Children.only(children);
    return cloneElement(child, {
      ...props,
      ...arrowPosition,
      // 防止 child offset 被 Overlay offset 覆盖
      ...(child.props.offset ? {offset: child.props.offset} : {}),
      // FIXME: Don't forward `positionLeft` and `positionTop` via both props
      // and `props.style`.
      positionLeft,
      positionTop,
      className: classNames(className, child.props.className),
      style: {
        ...child.props.style,
        left: positionLeft,
        top: positionTop
      }
    });
  }
}

interface OverlayProps {
  placement?: string;
  show?: boolean;
  transition?: React.ElementType;
  containerPadding?: number;
  children?: any;
  shouldUpdatePosition?: boolean;
  rootClose?: boolean;
  onHide?(props: any, ...args: any[]): any;
  container?: React.ReactNode | Function;
  containerSelector?: string;
  target?: React.ReactNode | Function;
  watchTargetSizeChange?: boolean;
  offset?: [number, number];
  onEnter?(node: HTMLElement): any;
  onEntering?(node: HTMLElement): any;
  onEntered?(node: HTMLElement): any;
  onExit?(node: HTMLElement): any;
  onExiting?(node: HTMLElement): any;
  onExited?(node: HTMLElement): any;
}
interface OverlayState {
  exited: boolean;
}
export default class Overlay extends React.Component<
  OverlayProps,
  OverlayState
> {
  static defaultProps = {
    placement: 'auto'
  };
  constructor(props: OverlayProps) {
    super(props as any);

    this.state = {
      exited: !props.show
    };
  }

  position: any = null;
  positionRef = (position: any) => {
    this.position = position;
  };

  updatePosition() {
    this.position?.maybeUpdatePosition(true);
  }

  componentDidUpdate(prevProps: OverlayProps) {
    const props = this.props;
    if (prevProps.show !== props.show && props.show) {
      this.setState({exited: false});
    } else if (props.transition !== prevProps.transition && !props.transition) {
      // Otherwise let handleHidden take care of marking exited.
      this.setState({exited: true});
    }
  }

  @autobind
  onHiddenListener(node: HTMLElement) {
    this.setState({exited: true});

    if (this.props.onExited) {
      this.props.onExited(node);
    }
  }

  @autobind
  getContainerSelector() {
    const containerSelector = this.props.containerSelector;
    let container = null;

    if (typeof containerSelector === 'string') {
      container = document.querySelector(containerSelector);
    }

    return container;
  }

  render() {
    const {
      containerPadding,
      target,
      placement,
      shouldUpdatePosition,
      rootClose,
      children,
      watchTargetSizeChange,
      transition: Transition,
      offset,
      ...props
    } = this.props;
    const container = this.getContainerSelector()
      ? this.getContainerSelector
      : this.props.container;
    const mountOverlay = props.show || (Transition && !this.state.exited);
    if (!mountOverlay) {
      // Don't bother showing anything if we don't have to.
      return null;
    }

    let child = children;

    // Position is be inner-most because it adds inline styles into the child,
    // which the other wrappers don't forward correctly.
    child = (
      // @ts-ignore
      <Position
        {...{
          container,
          containerPadding,
          target,
          placement,
          shouldUpdatePosition,
          offset
        }}
        ref={this.positionRef}
      >
        {child}
      </Position>
    );

    if (Transition) {
      let {onExit, onExiting, onEnter, onEntering, onEntered} = props;

      // This animates the child node by injecting props, so it must precede
      // anything that adds a wrapping div.
      child = (
        <Transition
          in={props.show}
          appear
          onExit={onExit}
          onExiting={onExiting}
          onExited={this.onHiddenListener}
          onEnter={onEnter}
          onEntering={onEntering}
          onEntered={onEntered}
        >
          {child}
        </Transition>
      );
    }

    // This goes after everything else because it adds a wrapping div.
    if (rootClose) {
      return (
        // @ts-ignore
        <Portal container={container}>
          <RootClose onRootClose={props.onHide}>
            {(ref: any) => {
              if (React.isValidElement(child)) {
                return React.cloneElement(child as React.ReactElement, {
                  ref: ref
                });
              }

              return <div ref={ref}>{child}</div>;
            }}
          </RootClose>
        </Portal>
      );
    }

    // @ts-ignore
    return <Portal container={container}>{child}</Portal>;
  }
}
