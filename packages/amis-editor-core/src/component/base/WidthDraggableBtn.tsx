import React from 'react';
import cx from 'classnames';

interface WidthDraggableProps {
  isLeftDragIcon?: boolean;
  className?: any;
}

export class WidthDraggableBtn extends React.Component<WidthDraggableProps> {
  startX: number;
  startWidth: number;
  dragWrap: HTMLElement;

  constructor(props: any) {
    super(props);
    this.handleResizeMouseDown = this.handleResizeMouseDown.bind(this);
    this.handleResizeMouseMove = this.handleResizeMouseMove.bind(this);
    this.handleResizeMouseUp = this.handleResizeMouseUp.bind(this);
  }

  handleResizeMouseDown(e: React.MouseEvent) {
    // todo 可能 ie 不正确
    let isRightMB = e.nativeEvent.which == 3;

    if (isRightMB) {
      return;
    }

    this.dragWrap = e.currentTarget.parentElement as HTMLElement;
    document.addEventListener('mousemove', this.handleResizeMouseMove);
    document.addEventListener('mouseup', this.handleResizeMouseUp);
    this.startX = e.clientX;
    this.startWidth = this.dragWrap.offsetWidth;
  }

  handleResizeMouseMove(e: MouseEvent) {
    const {isLeftDragIcon} = this.props;
    const dx = e.clientX - this.startX;
    this.dragWrap.style.cssText += `width: ${Math.max(
      isLeftDragIcon ? this.startWidth - dx : this.startWidth + dx,
      260
    )}px`;
  }

  handleResizeMouseUp() {
    document.removeEventListener('mousemove', this.handleResizeMouseMove);
    document.removeEventListener('mouseup', this.handleResizeMouseUp);
  }

  render() {
    const {isLeftDragIcon, className} = this.props;
    return (
      <div
        onMouseDown={this.handleResizeMouseDown}
        className={cx(
          'width-draggable-icon',
          className,
          isLeftDragIcon ? 'leftBtn' : ''
        )}
      ></div>
    );
  }
}
