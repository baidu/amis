import React from 'react';
import {autobind, PopOver, Overlay, toNumber} from 'amis-core';
import PopUp from './PopUp';
import {findDOMNode} from 'react-dom';
import isNumber from 'lodash/isNumber';

export type OverlayAlignType = 'left' | 'center' | 'right';

export interface PopOverOverlay {
  width?: string | number;
  align?: OverlayAlignType;
}

export interface PopOverContainerProps {
  show?: boolean;
  children: (props: {
    disabled?: boolean;
    onClick: (e: React.MouseEvent) => void;
    isOpened: boolean;
    ref: any;
  }) => JSX.Element;
  disabled?: boolean;
  /** 弹出层打开时触发的事件 */
  onOpen?: () => void;
  popOverRender: (props: {onClose: () => void}) => JSX.Element;
  popOverContainer?: any;
  popOverClassName?: string;
  mobileUI?: boolean;
  placement?: string;
  overlayWidth?: number | string;
  overlayWidthField?: 'minWidth' | 'width';
  showConfirm?: boolean;
  // 相当于 placement 的简化版
  align?: OverlayAlignType;
  /** Popover层隐藏前触发的事件 */
  onBeforeHide?: () => void;
  /** Popover层隐藏后触发的事件 */
  onAfterHide?: () => void;
  onConfirm?: () => void;
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
  handleClick(e?: React.MouseEvent) {
    e?.preventDefault();

    this.props.disabled ||
      this.setState(
        {
          isOpened: true
        },
        () => {
          this.props.onOpen?.();
        }
      );
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

  @autobind
  onConfirm() {
    this.props.onConfirm?.();
    this.close();
  }

  static calcOverlayWidth(overlay: PopOverOverlay, targetWidth: number) {
    const overlayWidth = overlay && overlay.width;

    if (!overlayWidth || !isNumber(targetWidth) || targetWidth < 1) return;
    // 数字字符串需要转化下，否则不生效
    if (typeof overlayWidth === 'number' || /^\d+$/.test(overlayWidth)) {
      return toNumber(overlayWidth);
    }
    // 带单位，如: 80%、200px、30vw、5rem
    if (/^\d+(px|%|rem|em|vw)$/.test(overlayWidth)) {
      return overlayWidth;
    }
    // 带单位的相对值
    // 如: -100px 代表 100% - 100px。+10vw 代表 100% + 10vw
    if (/^(\+|\-)\d+(px|%|rem|em|vw)$/.test(overlayWidth)) {
      // 不能使用 calc(100% $1 $2)，需要考虑到 popOverContainer
      return overlayWidth.replace(
        /^(\+|\-)(.*)/,
        `calc(${targetWidth}px $1 $2)`
      );
    }

    return;
  }

  static alignToPlacement(overlay?: PopOverOverlay) {
    const align = overlay && overlay.align;
    return (align && PopOverContainer.alignPlacementMap[align]) || 'auto';
  }

  // 可以自定义下拉框宽度
  getOverlayStyle() {
    const {overlayWidth, overlayWidthField} = this.props;

    return {
      [overlayWidthField || 'minWidth']:
        PopOverContainer.calcOverlayWidth(
          {width: overlayWidth},
          this.target?.offsetWidth
        ) || (this.target ? Math.max(this.target.offsetWidth, 100) : 'auto')
    };
  }

  render() {
    const {
      mobileUI,
      children,
      popOverContainer,
      popOverClassName,
      popOverRender: dropdownRender,
      placement,
      align,
      showConfirm,
      onConfirm,
      disabled
    } = this.props;

    return (
      <>
        {children({
          isOpened: this.state.isOpened && this.props.show !== false,
          onClick: this.handleClick,
          ref: this.targetRef,
          disabled
        })}
        {mobileUI ? (
          <PopUp
            isShow={this.state.isOpened && this.props.show !== false}
            container={popOverContainer}
            className={popOverClassName}
            showConfirm={showConfirm}
            onHide={this.close}
            onConfirm={this.onConfirm}
          >
            {dropdownRender({onClose: this.close})}
          </PopUp>
        ) : (
          <Overlay
            container={popOverContainer || this.getParent}
            target={this.getTarget}
            placement={placement || PopOverContainer.alignToPlacement({align})}
            show={this.state.isOpened && this.props.show !== false}
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
