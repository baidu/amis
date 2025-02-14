/**
 * @file Slider 滑动条
 * @author qhy
 * @date 2025/01/21
 */

import React, {useCallback, useEffect, useMemo} from 'react';
import {themeable, ThemeProps} from 'amis-core';
import useClickAway from '../hooks/use-click-away';

interface SliderProps extends ThemeProps {
  body: React.ReactElement;
  left?: React.ReactElement;
  right?: React.ReactElement;
  bodyWidth?: string;
  showLeft?: boolean;
  showRight?: boolean;
  canSwitch?: boolean;
  onLeftShow?: () => void;
  onRightShow?: () => void;
  onLeftHide?: () => void;
  onRightHide?: () => void;
}

function Slider(props: SliderProps) {
  const {
    classnames: cx,
    mobileUI,
    bodyWidth,
    showLeft,
    showRight,
    canSwitch = true,
    onLeftShow,
    onRightShow,
    onLeftHide,
    onRightHide
  } = props;
  const sliderRef = React.useRef<HTMLDivElement>(null);
  const leftRef = React.useRef<HTMLDivElement>(null);
  const rightRef = React.useRef<HTMLDivElement>(null);
  const leftShow = React.useRef(false);
  const rightShow = React.useRef(false);

  const isMouseDown = React.useRef(false);
  const direction = React.useRef<'left' | 'right' | null>(null);
  const startX = React.useRef(0);
  const doc = React.useRef(document);

  const leftRightDefaultWidth = useMemo(
    () => (100 - parseInt(bodyWidth || '60')) / 2,
    [bodyWidth]
  );

  function handleStart(e: React.MouseEvent | React.TouchEvent) {
    if (mobileUI && canSwitch && !showLeft && !showRight) {
      isMouseDown.current = true;
      if ((e as any).touches?.[0]) {
        startX.current = (e as React.TouchEvent).touches[0].clientX;
        doc.current.addEventListener('touchend', handleUp);
      } else {
        startX.current = (e as React.MouseEvent).clientX;
        doc.current.addEventListener('mouseup', handleUp);
      }
    }
  }
  function handleMove(e: React.MouseEvent | React.TouchEvent) {
    if (!isMouseDown.current) {
      return;
    }

    let currentX = 0;
    if ((e as any).changedTouches?.[0]) {
      currentX = (e as React.TouchEvent).changedTouches[0].clientX;
    } else {
      currentX = (e as React.MouseEvent).clientX;
    }

    const currentDirection = currentX < startX.current ? 'left' : 'right';

    let leftWidth = Number(leftRef.current?.style.width.replace('%', '') || 0);
    let rightWidth = Number(
      rightRef.current?.style.width.replace('%', '') || 0
    );
    if (currentDirection === 'right') {
      leftWidth = Math.min(leftWidth + 1, leftRightDefaultWidth);
      if (rightWidth > 0) {
        rightWidth = Math.max(rightWidth - 1, 0);
      }
    } else {
      rightWidth = Math.min(rightWidth + 1, leftRightDefaultWidth);
      if (leftWidth > 0) {
        leftWidth = Math.max(leftWidth - 1, 0);
      }
    }

    direction.current = currentDirection;

    leftRef.current?.style.setProperty('width', leftWidth + '%');
    rightRef.current?.style.setProperty('width', rightWidth + '%');
  }

  function handleUp(e: MouseEvent | TouchEvent) {
    if (!mobileUI || !isMouseDown.current) {
      return;
    }
    isMouseDown.current = false;
    let currentX = 0;
    if ((e as any).changedTouches?.[0]) {
      currentX = (e as TouchEvent).changedTouches[0].clientX;
      doc.current.removeEventListener('touchend', handleUp);
    } else {
      currentX = (e as MouseEvent).clientX;
      doc.current.removeEventListener('mouseup', handleUp);
    }

    const isMove = Math.abs(currentX - startX.current) > 10;
    let leftWidth =
      isMove && direction.current === 'right' ? leftRightDefaultWidth : 0;
    let rightWidth =
      isMove && direction.current === 'left' ? leftRightDefaultWidth : 0;

    setWidth(leftWidth, rightWidth);
  }

  function setWidth(left: number, right: number) {
    if (left === 0 && leftShow.current) {
      leftShow.current = false;
      onLeftHide && onLeftHide();
    }
    if (right === 0 && rightShow.current) {
      rightShow.current = false;
      onRightHide && onRightHide();
    }
    if (left === leftRightDefaultWidth) {
      leftShow.current = true;
      onLeftShow && onLeftShow();
    }
    if (right === leftRightDefaultWidth) {
      rightShow.current = true;
      onRightShow && onRightShow();
    }

    leftRef.current?.style.setProperty('width', left + '%');
    rightRef.current?.style.setProperty('width', right + '%');
  }

  const reset = useCallback((e: MouseEvent) => {
    if (!sliderRef.current) {
      return;
    }

    if (
      !sliderRef.current.contains(e.target as HTMLElement) &&
      (leftShow.current || rightShow.current)
    ) {
      setWidth(0, 0);
    }
  }, []);

  // 点击外部时，重置滑动条
  useClickAway(sliderRef, reset, doc.current, ['mouseup', 'touchend']);

  return (
    <div className={cx('Slider')} ref={sliderRef}>
      {mobileUI ? (
        <>
          {props.left && (
            <div
              className={cx('Slider-LeftContainer')}
              ref={leftRef}
              style={{
                width: showLeft ? leftRightDefaultWidth + '%' : '0%'
              }}
            >
              {props.left}
            </div>
          )}
          <div
            className={cx('Slider-BodyContainer')}
            onMouseDown={handleStart}
            onMouseMove={handleMove}
            onTouchStart={handleStart}
            onTouchMove={handleMove}
          >
            {props.body}
          </div>
          {props.right && (
            <div
              className={cx('Slider-RightContainer')}
              ref={rightRef}
              style={{
                width: showRight ? leftRightDefaultWidth + '%' : '0%'
              }}
            >
              {props.right}
            </div>
          )}
        </>
      ) : (
        <>
          <div
            className={cx('Slider-BodyContainer')}
            style={{
              width: bodyWidth ? bodyWidth : '60%'
            }}
          >
            {props.body}
          </div>
          {props.left && (
            <div className={cx('Slider-LeftContainer')}>{props.left}</div>
          )}
          {props.right && (
            <div className={cx('Slider-RightContainer')}>{props.right}</div>
          )}
        </>
      )}
    </div>
  );
}

export default themeable(Slider);
