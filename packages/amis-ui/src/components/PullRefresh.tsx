/**
 * @file PullRefresh.tsx
 * @description 下拉刷新
 * @author hongyang03
 */

import React, {forwardRef, useEffect} from 'react';
import {ClassNamesFn, themeable} from 'amis-core';
import {useOnScreen, useSetState} from '../hooks';
import useTouch from '../hooks/use-touch';
import {Icon} from './icons';
import {TranslateFn} from 'amis-core';
import {Spinner} from './Spinner';

export interface PullRefreshProps {
  classnames: ClassNamesFn;
  classPrefix: string;
  translate: TranslateFn;
  disabled?: boolean;
  completed?: boolean;
  direction?: 'up' | 'down';
  showIcon?: boolean;
  showText?: boolean;
  iconType?: string;
  color?: string;
  contentText?: {
    normalText?: string;
    pullingText?: string;
    loosingText?: string;
    loadingText?: string;
    successText?: string;
    completedText?: string;
  };
  normalText?: string;
  pullingText?: string;
  loosingText?: string;
  loadingText?: string;
  successText?: string;
  completedText?: string;
  onRefresh?: () => void;
  loading?: boolean;
  successDuration?: number;
  loadingDuration?: number;
  children?: React.ReactNode | Array<React.ReactNode>;
}

type statusText = 'normal' | 'pulling' | 'loosing' | 'success' | 'loading';

export interface PullRefreshState {
  status: statusText;
  offsetY: number;
}

const defaultProps: {
  successDuration: number;
  loadingDuration: number;
  direction?: 'up' | 'down';
  showIcon: boolean;
  showText: boolean;
  iconType: string;
} = {
  successDuration: 0,
  loadingDuration: 0,
  direction: 'down',
  showIcon: true,
  showText: true,
  iconType: 'loading-outline'
};

const defaultHeaderHeight = 28;

const PullRefresh = forwardRef<{}, PullRefreshProps>((props, ref) => {
  const {
    classnames: cx,
    translate: __,
    children,
    successDuration,
    loadingDuration,
    direction,
    completed,
    showIcon,
    showText,
    iconType,
    color,
    contentText
  } = props;

  const refreshText = {
    normalText: contentText?.normalText ?? __('pullRefresh.normalText'),
    pullingText: contentText?.pullingText ?? __('pullRefresh.pullingText'),
    loosingText: contentText?.loosingText ?? __('pullRefresh.loosingText'),
    loadingText: contentText?.loadingText ?? __('pullRefresh.loadingText'),
    successText: contentText?.successText ?? __('pullRefresh.successText'),
    completedText: contentText?.completedText ?? __('pullRefresh.completedText')
  };

  const touch = useTouch();
  const loadingRef = React.useRef<HTMLDivElement>(null);
  // 当占位文字在屏幕内时，需要刷新
  const needRefresh = useOnScreen(loadingRef);

  useEffect(() => {
    if (props.loading === false) {
      loadSuccess();
    }
  }, [props.loading]);

  const [state, updateState] = useSetState({
    status: 'normal',
    offsetY: 0
  } as PullRefreshState);

  const isTouchable = () => {
    return (
      !completed &&
      needRefresh &&
      !props.disabled &&
      state.status !== 'loading' &&
      state.status !== 'success'
    );
  };

  const ease = (distance: number) => {
    const pullDistance = defaultHeaderHeight;

    if (distance > pullDistance) {
      if (distance < pullDistance * 2) {
        distance = pullDistance + (distance - pullDistance) / 2;
      } else {
        distance = pullDistance * 1.5 + (distance - pullDistance * 2) / 4;
      }
    }

    return Math.round(distance);
  };

  const setStatus = (distance: number, isLoading?: boolean) => {
    const pullDistance = defaultHeaderHeight;
    let status: statusText = 'normal';

    if (isLoading) {
      status = 'loading';
    } else if (distance === 0) {
      status = 'normal';
    } else if (Math.abs(distance) < pullDistance) {
      status = 'pulling';
    } else {
      status = 'loosing';
    }

    updateState({offsetY: distance, status});
  };

  const loadSuccess = () => {
    if (!successDuration) {
      setStatus(0);
      return;
    }
    updateState({status: 'success'});

    setTimeout(() => {
      setStatus(0);
    }, successDuration);
  };

  const onTouchStart = (event: any) => {
    event.stopPropagation();

    if (isTouchable() && state.offsetY === 0) {
      touch.start(event);
      updateState({});
    }
  };

  const onTouchMove = (event: any) => {
    event.stopPropagation();

    if (isTouchable()) {
      touch.move(event);
      updateState({});

      if (touch.isVertical()) {
        if (direction === 'down' && touch.deltaY > 0) {
          setStatus(ease(touch.deltaY));
        } else if (direction === 'up' && touch.deltaY < 0) {
          setStatus(-1 * ease(-1 * touch.deltaY));
        }
      }
    }
    return false;
  };

  const onTouchEnd = (event: any) => {
    event.stopPropagation();
    if (isTouchable() && state.offsetY !== 0) {
      if (state.status === 'loosing') {
        if (loadingDuration) {
          setStatus(defaultHeaderHeight, true);
        } else {
          setStatus(0);
        }
        props.onRefresh && props.onRefresh();
      } else {
        setStatus(0);
      }
    }
  };

  const transformStyle = {
    transform: `translate3d(0, ${state.offsetY}px, 0)`,
    // 不清楚历史原因为什么要加这个，兼容一下
    ...(direction === 'down'
      ? {
          touchAction: 'none'
        }
      : {})
  };

  const getStatusText = (status: statusText) => {
    if (props.loading) {
      return refreshText.loadingText;
    }
    if (completed) {
      return refreshText.completedText;
    }
    return refreshText[`${status}Text`];
  };

  const loadingDom = (className: string) => {
    return (
      <div
        className={className}
        ref={loadingRef}
        style={
          color
            ? ({
                '--Spinner-color': color,
                'color': color
              } as React.CSSProperties)
            : undefined
        }
      >
        {showIcon && props.loading && (
          <Spinner
            show={true}
            icon={iconType}
            size="sm"
            className="PullRefresh-spinner"
            classnames={cx}
            classPrefix={props.classPrefix}
          />
        )}
        {showText && getStatusText(state.status)}
      </div>
    );
  };

  return (
    <div
      className={cx('PullRefresh')}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
      onTouchCancel={onTouchEnd}
    >
      <div className={cx('PullRefresh-wrap')} style={transformStyle}>
        {direction === 'down' ? loadingDom(cx('PullRefresh-header')) : null}
        {children}
        {direction === 'up' ? loadingDom(cx('PullRefresh-footer')) : null}
      </div>
    </div>
  );
});

PullRefresh.defaultProps = defaultProps;

export default themeable(PullRefresh);
