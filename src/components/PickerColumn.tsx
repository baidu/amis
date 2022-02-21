/**
 * @file Picker
 * @description 移动端列滚动选择器
 */
import React, {
  useEffect,
  useMemo,
  useRef,
  useImperativeHandle,
  useCallback,
  forwardRef
} from 'react';
import isObject from 'lodash/isObject';
import cloneDeep from 'lodash/cloneDeep';
import {uncontrollable} from 'uncontrollable';

import {useSetState, useUpdateEffect} from '../hooks';
import {range} from '../utils/helper';
import {themeable, ThemeProps} from '../theme';
import useTouch from '../hooks/use-touch';

export interface PickerColumnItem {
  labelField?: string;
  valueField?: string;
  readonly?: boolean;
  value?: PickerOption;
  swipeDuration?: number;
  visibleItemCount?: number;
  itemHeight?: number;
  options?: PickerOption[];
  optionRender?: (option: string | object | PickerOption) => React.ReactNode;
  onChange?: (
    value?: PickerOption | string,
    index?: number,
    confirm?: boolean
  ) => void;
}

export interface PickerColumnProps extends PickerColumnItem, ThemeProps {}

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
    visibleItemCount = 5,
    itemHeight = 48,
    value,
    valueField = 'value',
    swipeDuration = 1000,
    labelField = 'text',
    options = [],
    classnames: cx
  } = props;

  const root = useRef(null);
  const menuItemRef = useRef(null);
  const wrapper = useRef(null);

  const moving = useRef(false);
  const startOffset = useRef(0);
  const transitionEndTrigger = useRef(null);
  const touchStartTime = useRef(0);
  const momentumOffset = useRef(0);

  const touch = useTouch();
  const count = options.length;

  const getOptionText = (option: [] | PickerOption) => {
    if (isObject(option) && labelField in option) {
      //@ts-ignore
      return option[labelField];
    }
    return option;
  };

  const getOptionValue = (option: [] | PickerOption) => {
    if (isObject(option) && valueField in option) {
      //@ts-ignore
      return option[valueField];
    }
    return option;
  };

  const defaultIndex = options.findIndex(item => getOptionValue(item) === value);

  const baseOffset = useMemo(() => {
    // 默认转入第一个选项的位置
    return (itemHeight * (+visibleItemCount - 1)) / 2;
  }, [itemHeight, visibleItemCount]);

  const adjustIndex = (index: number) => {
    index = range(index, 0, count);
    if (!options) {
      return;
    }

    for (let i = index; i < count; i += 1) {
      if (!isOptionDisabled(options[i])) return i;
    }
    for (let i = index - 1; i >= 0; i -= 1) {
      if (!isOptionDisabled(options[i])) return i;
    }

    return null;
  };

  const [state, updateState] = useSetState({
    index: adjustIndex(defaultIndex) || 0,
    offset: 0,
    duration: 0,
    options: cloneDeep(options)
  });

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
        requestAnimationFrame(
          () => {
            props.onChange?.(getOptionValue(options[index]), index, confirm);
          }
        );
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
      const index = options.findIndex(item => getOptionValue(item) === value) || 0;
      setIndex(index, true, true);
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
    const style = {
      height: `${itemHeight}px`,
      lineHeight: `${itemHeight}px`
    };
    return state.options.map((option, index: number) => {
      const text: string | PickerOption = getOptionText(option);
      const disabled = isOptionDisabled(option);

      const data = {
        role: 'button',
        key: index,
        style,
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
      if (options[i] === value) {
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
    setIndex(defaultIndex);
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
  return (
    <div
      ref={root}
      className={props.classnames('PickerColumns', props.className)}
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
  );
});

PickerColumn.defaultProps = {
  options: [],
  visibleItemCount: 5,
  swipeDuration: 1000,
  itemHeight: 48
};

export default themeable(
  uncontrollable(PickerColumn, {
    value: 'onChange'
  })
);
