/**
 * @file PullRefresh.tsx
 * @description 下拉刷新
 * @author hongyang03
 */

import React, {forwardRef, useEffect} from 'react';
import {ClassNamesFn, themeable} from '../theme';
import {useSetState} from '../hooks';
import useTouch from '../hooks/use-touch';
import {Icon} from './icons';

export interface PullRefreshProps {
  classnames: ClassNamesFn;
  classPrefix: string;
  disabled?: boolean;
  pullingText?: string;
  loosingText?: string;
  loadingText?: string;
  successText?: string;
  onRefresh?: () => void;
  loading?: boolean;
  successDuration?: number;
  loadingDuration?: number;
}

type statusText = 'normal' | 'pulling' | 'loosing' |'success' | 'loading';

export interface PullRefreshState {
  status: statusText;
  offsetY: number;
}

const defaultProps = {
  pullingText: '下拉即可刷新...',
  loosingText: '释放即可刷新...',
  loadingText: '加载中...',
  successText: '加载成功',
  successDuration: 0,
  loadingDuration: 0
};

const defaultHeaderHeight = 28;

const PullRefresh = forwardRef<{}, PullRefreshProps>((props, ref) => {

  const {
    classnames: cx,
    children,
    successDuration,
    loadingDuration
  } = props;

  const touch = useTouch();

  useEffect(()=>{
    if (props.loading === false) {
      loadSuccess();
    }
  },[props.loading]);

  const [state, updateState] = useSetState({
    status: 'normal',
    offsetY: 0
  } as PullRefreshState);

  const isTouchable = () => {
    return !props.disabled && state.status !== 'loading' && state.status !== 'success';
  }

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
    } else if (distance < pullDistance) {
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
    event.stopPropagation()

    if (isTouchable() && state.offsetY === 0) {
      touch.start(event);
      updateState({});
    }
  }

  const onTouchMove = (event: any) => {
    event.stopPropagation();

    if (isTouchable()) {
      touch.move(event);
      updateState({});
      if (touch.isVertical() && touch.deltaY > 0) {
        setStatus(ease(touch.deltaY));
      }
    }
    return false;
  }

  const onTouchEnd = (event: any) => {
    event.stopPropagation();

    if (isTouchable() && state.offsetY > 0) {
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
  }

  const transformStyle = {
    transform: `translate3d(0, ${state.offsetY}px, 0)`,
    touchAction: 'none'
  };

  const getStatusText = (status: statusText) => {
    if (status === 'normal') {
      return '';
    }
    return props[`${status}Text`];
  }

  return (
    <div
      className={cx('PullRefresh')}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
      onTouchCancel={onTouchEnd}
    >
      <div className={cx('PullRefresh-wrap')} style={transformStyle}>
        <div className={cx('PullRefresh-header')}>
          {state.status === 'loading' && <Icon icon="loading-outline" className="icon loading-icon" />}
          {getStatusText(state.status)}
        </div>
        {children}
      </div>
    </div>
  );
});

PullRefresh.defaultProps = defaultProps;

export default themeable(PullRefresh);
