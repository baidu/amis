/**
 * @file Overlay
 * @description
 * @author fex
 */

import {Position, Overlay as BaseOverlay} from 'react-overlays';
import {findDOMNode} from 'react-dom';
import React from 'react';
import {calculatePosition, getContainer, ownerDocument} from '../utils/dom';

Position.propTypes.placement = BaseOverlay.propTypes.placement = () => null;

Position.prototype.updatePosition = function(target: any) {
  this._lastTarget = target;

  if (!target) {
    return this.setState({
      positionLeft: 0,
      positionTop: 0,
      arrowOffsetLeft: null,
      arrowOffsetTop: null
    });
  }

  const overlay = findDOMNode(this);
  const container = getContainer(
    this.props.container,
    ownerDocument(this).body
  );

  this.setState(
    calculatePosition(
      this.props.placement,
      overlay,
      target,
      container,
      this.props.containerPadding
    )
  );
};

interface OverlayProps {
  placement?: string;
  show?: boolean;
  rootClose?: boolean;
  onHide?(props: any, ...args: any[]): any;
  container?: React.ReactNode | Function;
  target?: React.ReactNode | Function;
}
export default class Overlay extends React.Component<OverlayProps> {
  static defaultProps = {
    placement: 'auto'
  };
  constructor(props: OverlayProps) {
    super(props as any);
  }

  render() {
    return <BaseOverlay {...this.props as any} />;
  }
}
