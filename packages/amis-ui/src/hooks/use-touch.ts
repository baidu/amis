import {useCallback, useRef} from 'react';

const MIN_DISTANCE = 10;

type Direction = '' | 'vertical' | 'horizontal';

function getDirection(x: number, y: number) {
  if (x > y && x > MIN_DISTANCE) {
    return 'horizontal';
  }
  if (y > x && y > MIN_DISTANCE) {
    return 'vertical';
  }
  return '';
}

const INITIAL_STATE = {
  startX: 0,
  startY: 0,
  deltaX: 0,
  deltaY: 0,
  offsetX: 0,
  offsetY: 0,
  direction: '' as Direction
};

type StateType = Partial<typeof INITIAL_STATE>;
type StateFunctionType = (value: StateType) => typeof INITIAL_STATE;

const useTouch = () => {
  const refState = useRef(INITIAL_STATE);
  const innerState = refState.current;

  const update = (value: StateType | StateFunctionType) => {
    if (typeof value === 'function') {
      value = value(refState.current);
    }
    Object.entries(value).forEach(([k, v]) => {
      //@ts-ignore
      refState.current[k] = v;
    });
  };

  const isVertical = useCallback(
    () => innerState.direction === 'vertical',
    [innerState.direction]
  );
  const isHorizontal = useCallback(
    () => innerState.direction === 'horizontal',
    [innerState.direction]
  );

  const reset = () => {
    update({
      deltaX: 0,
      deltaY: 0,
      offsetX: 0,
      offsetY: 0,
      direction: ''
    });
  };

  const start = ((event: TouchEvent) => {
    reset();
    update({
      startX: event.touches[0].clientX,
      startY: event.touches[0].clientY
    });
  }) as EventListener;

  const move = ((event: TouchEvent) => {
    const touch = event.touches[0];

    update(value => {
      // Fix: Safari back will set clientX to negative number
      const newState = {...value} as typeof innerState;

      newState.deltaX = touch.clientX < 0 ? 0 : touch.clientX - newState.startX;
      newState.deltaY = touch.clientY - newState.startY;
      newState.offsetX = Math.abs(newState.deltaX);
      newState.offsetY = Math.abs(newState.deltaY);

      if (!newState.direction) {
        newState.direction = getDirection(newState.offsetX, newState.offsetY);
      }
      return newState;
    });
  }) as EventListener;

  return {
    ...innerState,
    move,
    start,
    reset,
    isVertical,
    isHorizontal
  };
};

export default useTouch;
