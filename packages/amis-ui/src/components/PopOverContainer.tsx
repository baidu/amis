import React from 'react';
import {autobind, isMobile, PopOver, Overlay, toNumber} from 'amis-core';
import PopUp from './PopUp';
import {findDOMNode} from 'react-dom';

export type OverlayAlignType = 'left' | 'center' | 'right';

export interface PopOverContainerProps {
  children: (props: {
    onClick: (e: React.MouseEvent) => void;
    isOpened: boolean;
    ref: any;
  }) => JSX.Element;
  popOverRender: (props: {onClose: () => void}) => JSX.Element;
  popOverContainer?: any;
  popOverClassName?: string;
  useMobileUI?: boolean;
  placement?: string;
  overlayWidth?: number | string;
  overlayWidthChar?: 'minWidth' | 'width';
  // 相当于 placement 的简化版
  align?: OverlayAlignType;
  /** Popover层隐藏前触发的事件 */
  onBeforeHide?: () => void;
  /** Popover层隐藏后触发的事件 */
  onAfterHide?: () => void;
}

export interface PopOverContainerState {
  isOpened: boolean;
}

export class PopOverContainer extends React.Component<
  PopOverContainerProps,
  PopOverContainerState
> {
  static alignPlacementMap = {
    left: 'left-bottom-left-top',
    right: 'right-bottom-right-top',
    center: 'center-bottom-center-top'
  };

  state: PopOverContainerState = {
    isOpened: false
  };

  target: any;

  @autobind
  targetRef(target: any) {
    this.target = target ? findDOMNode(target) : null;
  }

  @autobind
  handleClick() {
    this.setState({
      isOpened: true
    });
  }

  @autobind
  close() {
    const {onBeforeHide, onAfterHide} = this.props;

    if (onBeforeHide && typeof onBeforeHide === 'function') {
      onBeforeHide?.();
    }

    this.setState({
      isOpened: false
    });

    if (onAfterHide && typeof onAfterHide === 'function') {
      onAfterHide?.();
    }
  }

  @autobind
  getTarget() {
    return this.target || (findDOMNode(this) as HTMLElement);
  }

  @autobind
  getParent() {
    return this.getTarget()?.parentElement;
  }

  static calcOverlayWidth(overlayWidth?: number | string) {
    if (!overlayWidth) return;
    // 数字字符串需要转化下，否则不生效
    if (typeof overlayWidth === 'number' || /^\d+$/.test(overlayWidth)) {
      return toNumber(overlayWidth);
    }
    if (/^\d+(px|%)$/.test(overlayWidth)) {
      return overlayWidth;
    }

    return;
  }

  static alignToPlacement(align?: 'left' | 'right' | 'center') {
    debugger;
    return (align && PopOverContainer.alignPlacementMap[align]) || 'auto';
  }

  // 可以自定义下拉框宽度
  getOverlayStyle() {
    const {overlayWidth, overlayWidthChar} = this.props;

    return {
      [overlayWidthChar || 'minWidth']:
        PopOverContainer.calcOverlayWidth(overlayWidth) ||
        (this.target ? Math.max(this.target.offsetWidth, 100) : 'auto')
    };
  }

  render() {
    const {
      useMobileUI,
      children,
      popOverContainer,
      popOverClassName,
      popOverRender: dropdownRender,
      placement,
      align
    } = this.props;
    const mobileUI = useMobileUI && isMobile();
    return (
      <>
        {children({
          isOpened: this.state.isOpened,
          onClick: this.handleClick,
          ref: this.targetRef
        })}
        {mobileUI ? (
          <PopUp
            isShow={this.state.isOpened}
            container={popOverContainer}
            className={popOverClassName}
            onHide={this.close}
          >
            {dropdownRender({onClose: this.close})}
          </PopUp>
        ) : (
          <Overlay
            container={popOverContainer || this.getParent}
            target={this.getTarget}
            placement={placement || PopOverContainer.alignToPlacement(align)}
            show={this.state.isOpened}
          >
            <PopOver
              overlay
              className={popOverClassName}
              style={this.getOverlayStyle()}
              onHide={this.close}
            >
              {dropdownRender({onClose: this.close})}
            </PopOver>
          </Overlay>
        )}
      </>
    );
  }
}

export default PopOverContainer;
