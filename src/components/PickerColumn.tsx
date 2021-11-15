/**
 * @file Picker
 * @description 移动端选择器
 */
import React, {
  useEffect,
  useMemo,
  useRef,
  useImperativeHandle,
  useCallback,
  forwardRef,
  CSSProperties
} from 'react';
import isObject from 'lodash/isObject';
import cloneDeep from 'lodash/cloneDeep';
import {uncontrollable} from 'uncontrollable';

import {useSetState, useUpdateEffect} from '../hooks';
import {range} from '../utils/helper';
import {themeable, ThemeProps} from '../theme';
import {localeable, LocaleProps} from '../locale';
import useTouch from '../hooks/use-touch';
import {Button} from '.';

export interface PickerColumnProps extends ThemeProps, LocaleProps {
  mobileClassName?: string;
  style?: CSSProperties;
  index?: number;
  labelField: string;
  readonly?: boolean;
  value: any;
  swipeDuration?: number | string;
  visibleItemCount?: number | string;
  options?: PickerOption[];
  children?: any;
  optionRender?: (option: string | object | PickerOption) => React.ReactNode;
  onChange?: (
    value?: PickerOption | string,
    index?: number,
    confirm?: boolean
  ) => void;
  onClose?: () => void;
  onConfirm?: () => void;
}

export interface Column {
  values?: string[];
  className?: string;
  children?: Column[];
  disabled?: boolean;
}

export type PickerOption = string | number | PickerObjectOption;

export type PickerObjectOption = {
  value?: string | number;
  text?: string | number;
  disabled?: boolean;
} & Record<string, {}>;

const DEFAULT_DURATION = 200;
const MOMENTUM_LIMIT_TIME = 300;
const MOMENTUM_LIMIT_DISTANCE = 15;

function getElementTranslateY(element: HTMLElement | null) {
  if (!element) {
    return 0;
  }
  const style = window.getComputedStyle(element);
  const transform = style.transform || style.webkitTransform;
  // 格式如：matrix( scaleX(), skewY(), skewX(), scaleY(), translateX(), translateY() );
  const translateY = transform.slice(7, transform.length - 1).split(', ')[5];

  return Number(translateY);
}

function isOptionDisabled(option: PickerOption) {
  return isObject(option) && option.disabled;
}

const PickerColumn = forwardRef<{}, PickerColumnProps>((props, ref) => {
  const {
    onClose,
    onConfirm,
    mobileClassName,
    visibleItemCount = 5,
    value,
    swipeDuration = 1000,
    labelField = 'value',
    translate: __,
    options = [],
    classnames: cx
  } = props;
  let itemHeight = 24;

  const defaultIndex = options.findIndex(item => item === value);

  const root = useRef(null);
  const menuItemRef = useRef(null);
  const wrapper = useRef(null);

  const moving = useRef(false);
  const startOffset = useRef(0);
  const transitionEndTrigger = useRef(null);
  const touchStartTime = useRef(0);
  const momentumOffset = useRef(0);

  if (menuItemRef.current) {
    //@ts-ignore
    itemHeight = menuItemRef.current.getBoundingClientRect().height;
  }

  const [state, updateState] = useSetState({
    index: defaultIndex,
    offset: 0,
    duration: 0,
    options: cloneDeep(options)
  });

  const touch = useTouch();

  const count = state.options.length;

  const baseOffset = useMemo(() => {
    // 默认转入第一个选项的位置
    return (itemHeight * (+visibleItemCount - 1)) / 2;
  }, [itemHeight, visibleItemCount]);

  const adjustIndex = (index: number) => {
    index = range(index, 0, count);
    if (!state.options) {
      return;
    }

    for (let i = index; i < count; i += 1) {
      if (!isOptionDisabled(state.options[i])) return i;
    }
    for (let i = index - 1; i >= 0; i -= 1) {
      if (!isOptionDisabled(state.options[i])) return i;
    }

    return null;
  };

  /**
   *
   * @param index 索引
   * @param emitChange 是否派发变动消息
   * @param confirm 是否为确认类型，为真时触发value改变
   */
  const setIndex = (index: number, emitChange?: boolean, confirm?: boolean) => {
    index = adjustIndex(index) || 0;

    const offset = -index * itemHeight;
    const trigger = () => {
      updateState({index});

      if (emitChange && props.onChange) {
        setTimeout(() => {
          props.onChange?.(options[index], index, confirm);
        }, 0);
      }
    };

    // trigger the change event after transitionend when moving
    if (moving.current && offset !== state.offset) {
      //@ts-ignore
      transitionEndTrigger.current = trigger;
    } else {
      trigger();
    }
    updateState({offset});
  };

  const setOptions = (options: Array<PickerOption>) => {
    if (JSON.stringify(options) !== JSON.stringify(state.options)) {
      updateState({options});
      setIndex(defaultIndex, true);
    }
  };

  const onClickItem = (index: number) => {
    if (moving.current || props.readonly) {
      return;
    }
    transitionEndTrigger.current = null;
    updateState({duration: DEFAULT_DURATION});
    setIndex(index, true, true);
  };

  const getOptionText = (option: [] | PickerOption) => {
    if (isObject(option) && props.labelField in option) {
      //@ts-ignore
      return option[labelField];
    }
    return option;
  };

  const getIndexByOffset = (offset: number) =>
    range(Math.round(-offset / itemHeight), 0, count - 1);

  const momentum = (distance: number, duration: number) => {
    const speed = Math.abs(distance / duration);

    distance = state.offset + (speed / 0.003) * (distance < 0 ? -1 : 1);

    const index = getIndexByOffset(distance);
    updateState({duration: +swipeDuration});
    setIndex(index, true);
  };

  const stopMomentum = () => {
    moving.current = false;
    updateState({duration: 0});

    if (transitionEndTrigger.current) {
      //@ts-ignore
      transitionEndTrigger.current();
      transitionEndTrigger.current = null;
    }
  };

  const onTouchStart = (event: any) => {
    if (props.readonly) {
      return;
    }

    touch.start(event);
    let {offset} = state;

    if (moving.current) {
      const translateY = getElementTranslateY(wrapper.current);
      offset = Math.min(0, translateY - baseOffset);
      startOffset.current = offset;
    } else {
      startOffset.current = offset;
    }

    updateState({duration: 0, offset});
    touchStartTime.current = Date.now();
    momentumOffset.current = startOffset.current;
    transitionEndTrigger.current = null;
  };

  const onTouchMove = (event: TouchEvent | React.TouchEvent) => {
    if (props.readonly) {
      return;
    }

    touch.move(event as TouchEvent);

    if (touch.isVertical()) {
      moving.current = true;
    }

    const offset = range(
      startOffset.current + touch.deltaY,
      -(count * itemHeight),
      itemHeight
    );

    updateState({
      offset
    });

    const now = Date.now();
    if (now - touchStartTime.current > MOMENTUM_LIMIT_TIME) {
      touchStartTime.current = now;
      momentumOffset.current = offset;
    }
  };

  const onTouchEnd = () => {
    if (props.readonly) {
      return;
    }
    const distance = state.offset - momentumOffset.current;
    const duration = Date.now() - touchStartTime.current;

    const allowMomentum =
      duration < MOMENTUM_LIMIT_TIME &&
      Math.abs(distance) > MOMENTUM_LIMIT_DISTANCE;

    if (allowMomentum) {
      momentum(distance, duration);
      return;
    }

    const index = getIndexByOffset(state.offset);
    updateState({duration: DEFAULT_DURATION});
    setIndex(index, true);

    // compatible with desktop scenario
    // use setTimeout to skip the click event triggered after touchstart
    setTimeout(() => {
      moving.current = false;
    }, 0);
  };

  const renderOptions = () => {
    return state.options.map((option, index: number) => {
      const text: string | PickerOption = getOptionText(option);
      const disabled = isOptionDisabled(option);

      const data = {
        role: 'button',
        key: index,
        tabIndex: disabled ? -1 : 0,
        className: props.classnames(`PickerColumns-columnItem`, {
          'is-disabled': disabled,
          'is-selected': index === state.index
        }),
        onClick: () => {
          onClickItem(index);
        }
      };

      const childData = {
        className: 'text-ellipsis',
        children: text
      };

      return (
        <li {...data} ref={menuItemRef}>
          {props.optionRender ? (
            props.optionRender(option)
          ) : (
            <div {...childData} />
          )}
        </li>
      );
    });
  };

  const setValue = (value: string) => {
    const {options} = state;
    for (let i = 0; i < options.length; i += 1) {
      if (getOptionText(options[i]) === value) {
        return setIndex(i);
      }
    }
    return null;
  };

  const getValue = useCallback<() => PickerOption>(
    () => state.options[state.index],
    [state.index, state.options]
  );

  useEffect(() => {
    setIndex(defaultIndex, true);
  }, [defaultIndex]);

  useUpdateEffect(() => {
    setOptions(cloneDeep(options));
  }, [options]);

  useImperativeHandle(ref, () => ({
    state,
    setIndex,
    getValue,
    setValue,
    setOptions,
    stopMomentum
  }));

  const wrapperStyle = {
    transform: `translate3d(0, ${state.offset + baseOffset}px, 0)`,
    transitionDuration: `${state.duration}ms`,
    transitionProperty: state.duration ? 'all' : 'none'
  };

  const wrapHeight = itemHeight * +visibleItemCount;
  const frameStyle = {height: `${itemHeight}px`};
  const columnsStyle = {height: `${wrapHeight}px`};
  const maskStyle = {
    backgroundSize: `100% ${(wrapHeight - itemHeight) / 2}px`
  };

  return (
    <div
      className={cx(mobileClassName, 'PickerColumns', 'PickerColumns-popOver')}
    >
      <div className={cx('PickerColumns-toolbar')}>
        <Button level="default" onClick={onClose}>
          {__('cancel')}
        </Button>
        <Button level="primary" onClick={onConfirm}>
          {__('confirm')}
        </Button>
      </div>
      <div className={cx('PickerColumns-columns')} style={columnsStyle}>
        <div
          ref={root}
          className={props.classnames(props.className)}
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
          onTouchCancel={onTouchEnd}
        >
          <ul
            ref={wrapper}
            style={wrapperStyle}
            className={props.classnames('PickerColumns-columnWrapper')}
            onTransitionEnd={stopMomentum}
          >
            {renderOptions()}
          </ul>
        </div>
        <div className={cx('PickerColumns-mask')} style={maskStyle}></div>
        <div className={cx('PickerColumns-frame')} style={frameStyle}></div>
      </div>
    </div>
  );
});

PickerColumn.defaultProps = {
  options: [],
  visibleItemCount: 5,
  swipeDuration: 1000
};

export default themeable(
  localeable(
    uncontrollable(PickerColumn, {
      value: 'onChange'
    })
  )
);
