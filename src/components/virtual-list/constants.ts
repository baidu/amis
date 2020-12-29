export enum ALIGNMENT {
  AUTO = 'auto',
  START = 'start',
  CENTER = 'center',
  END = 'end'
}

export enum DIRECTION {
  HORIZONTAL = 'horizontal',
  VERTICAL = 'vertical'
}

export enum SCROLL_CHANGE_REASON {
  OBSERVED = 'observed',
  REQUESTED = 'requested'
}

export const scrollProp = {
  [DIRECTION.VERTICAL]: 'scrollTop',
  [DIRECTION.HORIZONTAL]: 'scrollLeft'
};

export const sizeProp = {
  [DIRECTION.VERTICAL]: 'height',
  [DIRECTION.HORIZONTAL]: 'width'
};

export const positionProp = {
  [DIRECTION.VERTICAL]: 'top',
  [DIRECTION.HORIZONTAL]: 'left'
};

export const marginProp = {
  [DIRECTION.VERTICAL]: 'marginTop',
  [DIRECTION.HORIZONTAL]: 'marginLeft'
};

export const oppositeMarginProp = {
  [DIRECTION.VERTICAL]: 'marginBottom',
  [DIRECTION.HORIZONTAL]: 'marginRight'
};
