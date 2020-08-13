/**
 * @file Overlay
 * @description
 * @author fex
 */

import {
  Position as BasePosition,
  Portal,
  RootCloseWrapper
} from 'react-overlays';
import {findDOMNode} from 'react-dom';
import React from 'react';
import {calculatePosition, getContainer, ownerDocument} from '../utils/dom';
import {autobind} from '../utils/helper';
import {resizeSensor, getComputedStyle} from '../utils/resize-sensor';

// @ts-ignore
BasePosition.propTypes.placement = () => null;

// @ts-ignore
class Position extends BasePosition {
  props: any;
  _lastTarget: any;
  resizeDispose: Array<() => void>;
  watchedTarget: any;
  setState: (state: any) => void;

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
        resizeSensor(target, () => this.updatePosition(target)),
        resizeSensor(overlay, () => this.updatePosition(target))
      ];
    }

    this.setState(
      calculatePosition(
        this.props.placement,
        overlay,
        target,
        container,
        this.props.containerPadding
      )
    );
  }

  componentWillUnmount() {
    this.resizeDispose?.forEach(fn => fn());
  }
}

interface OverlayProps {
  placement?: string;
  show?: boolean;
  transition?: React.ReactType;
  containerPadding?: number;
  shouldUpdatePosition?: boolean;
  rootClose?: boolean;
  onHide?(props: any, ...args: any[]): any;
  container?: React.ReactNode | Function;
  target?: React.ReactNode | Function;

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

  componentWillReceiveProps(nextProps: OverlayProps) {
    if (nextProps.show) {
      this.setState({exited: false});
    } else if (!nextProps.transition) {
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

  render() {
    const {
      container,
      containerPadding,
      target,
      placement,
      shouldUpdatePosition,
      rootClose,
      children,
      transition: Transition,
      ...props
    } = this.props;

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
          shouldUpdatePosition
        }}
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
      child = (
        // @ts-ignore
        <RootCloseWrapper onRootClose={props.onHide}>{child}</RootCloseWrapper>
      );
    }

    // @ts-ignore
    return <Portal container={container}>{child}</Portal>;
  }
}
