import ReactDOM from 'react-dom';
import React from 'react';
import getOffset from './offset';
import getPosition from './position';

export function getContainer(container: any, defaultContainer: any) {
  container = typeof container === 'function' ? container() : container;
  return ReactDOM.findDOMNode(container) || defaultContainer;
}

export function ownerDocument(componentOrElement: any) {
  return (
    (ReactDOM.findDOMNode(componentOrElement) as Element)?.ownerDocument ||
    document
  );
}

function getContainerDimensions(containerNode: any) {
  let width, height, scroll;

  if (containerNode.tagName === 'BODY') {
    width = window.innerWidth;
    height = window.innerHeight;

    scroll =
      ownerDocument(containerNode).documentElement.scrollTop ||
      containerNode?.scrollTop;
  } else {
    ({width, height} = getOffset(containerNode) as any);
    scroll = containerNode.scrollTop;
  }

  return {width, height, scroll};
}

function getTopDelta(
  top: any,
  overlayHeight: any,
  container: any,
  padding: any
) {
  const containerDimensions = getContainerDimensions(container);
  const containerScroll = containerDimensions.scroll;
  const containerHeight = containerDimensions.height;

  const topEdgeOffset = top - padding - containerScroll;
  const bottomEdgeOffset = top + padding - containerScroll + overlayHeight;

  if (topEdgeOffset < 0) {
    return -topEdgeOffset;
  } else if (bottomEdgeOffset > containerHeight) {
    return containerHeight - bottomEdgeOffset;
  } else {
    return 0;
  }
}

function getLeftDelta(
  left: any,
  overlayWidth: any,
  container: any,
  padding: any
) {
  const containerDimensions = getContainerDimensions(container);
  const containerWidth = containerDimensions.width;

  const leftEdgeOffset = left - padding;
  const rightEdgeOffset = left + padding + overlayWidth;

  if (leftEdgeOffset < 0) {
    return -leftEdgeOffset;
  } else if (rightEdgeOffset > containerWidth) {
    return containerWidth - rightEdgeOffset;
  }

  return 0;
}

export function calculatePosition(
  placement: any,
  overlayNode: any,
  target: HTMLElement,
  container: any,
  padding: any = 0,
  customOffset: [number, number] = [0, 0]
) {
  const childOffset: any =
    container.tagName === 'BODY'
      ? getOffset(target)
      : getPosition(target, container);
  const {height: overlayHeight, width: overlayWidth} = getOffset(
    overlayNode
  ) as any;

  const clip = container.getBoundingClientRect();
  const clip2 = overlayNode.getBoundingClientRect();
  const scaleX = overlayNode.offsetWidth
    ? clip2.width / overlayNode.offsetWidth
    : 1;
  const scaleY = overlayNode.offsetHeight
    ? clip2.height / overlayNode.offsetHeight
    : 1;

  // auto 尝试四个方向对齐。
  const isAuto = placement === 'auto';
  // 兜底方向
  const autoDefaultPlacement = 'left-bottom-left-top';
  placement = isAuto
    ? `left-bottom-left-top right-bottom-right-top left-top-left-bottom right-top-right-bottom ${autoDefaultPlacement}`
    : placement;

  let positionLeft = 0,
    positionTop = 0,
    arrowOffsetLeft: any = '',
    arrowOffsetTop: any = '',
    activePlacement: string = placement;

  if (~placement.indexOf('-')) {
    const tests = placement.split(/\s+/);

    // 收集可见方向
    let visiblePlacement: {
      atX?: string;
      atY?: string;
      myX?: string;
      myY?: string;
    } = {};

    while (tests.length) {
      let current = (activePlacement = tests.shift());

      // 自动对齐模式下，当四个方向都无法完全可见时
      // 根据之前的计算结果，使用收集的可见方向作为兜底，避免完全不可见
      if (isAuto && tests.length === 0) {
        const [_atX, _atY, _myX, _myY] = autoDefaultPlacement.split('-');
        const {
          atX = _atX,
          atY = _atY,
          myX = _myX,
          myY = _myY
        } = visiblePlacement;
        current = activePlacement = [atX, atY, myX, myY].join('-');
      }

      let [atX, atY, myX, myY] = current.split('-');
      myX = myX || atX;
      myY = myY || atY;

      positionLeft =
        atX === 'left'
          ? childOffset.left
          : atX === 'right'
          ? childOffset.left + childOffset.width
          : childOffset.left + childOffset.width / 2;
      positionTop =
        atY === 'top'
          ? childOffset.top
          : atY === 'bottom'
          ? childOffset.top + childOffset.height
          : childOffset.top + childOffset.height / 2;

      positionLeft -=
        myX === 'left' ? 0 : myX === 'right' ? overlayWidth : overlayWidth / 2;
      positionTop -=
        myY === 'top'
          ? 0
          : myY === 'bottom'
          ? overlayHeight
          : overlayHeight / 2;

      // 如果还有其他可选项，则做位置判断，是否在可视区域，不完全在则继续看其他定位情况。
      if (tests.length || isAuto) {
        const transformed = {
          x: clip.x + positionLeft / scaleX,
          y: clip.y + positionTop / scaleY,
          width: overlayWidth,
          height: overlayHeight
        };

        let visibleX = false;
        let visibleY = false;

        if (
          transformed.x > 0 &&
          transformed.x + transformed.width < window.innerWidth
        ) {
          visibleX = true;
          !visiblePlacement.atX && (visiblePlacement.atX = atX);
          !visiblePlacement.myX && (visiblePlacement.myX = myX);
        }

        if (
          transformed.y > 0 &&
          transformed.y + transformed.height < window.innerHeight
        ) {
          visibleY = true;
          !visiblePlacement.atY && (visiblePlacement.atY = atY);
          !visiblePlacement.myY && (visiblePlacement.myY = myY);
        }

        if (visibleX && visibleY) {
          break;
        } else if (isAuto && tests.length === 0) {
          // 如果是 auto 模式，且最后一个方向都不可见，则直接平移到可见区域
          visibleY || (positionTop = window.innerHeight - transformed.height);
          visibleX || (positionLeft = window.innerWidth - transformed.width);
        }
      }
    }

    // todo arrow 位置支持
  } else if (placement === 'left' || placement === 'right') {
    // atX = placement;
    // atY = myY = 'center';
    // myX = placement === 'left' ? 'right' : 'left';
    if (placement === 'left') {
      positionLeft = childOffset.left - overlayWidth;
    } else {
      positionLeft = childOffset.left + childOffset.width;
    }

    positionTop = childOffset.top + (childOffset.height - overlayHeight) / 2;
    const topDelta = getTopDelta(
      positionTop,
      overlayHeight,
      container,
      padding
    );

    positionTop += topDelta;
    arrowOffsetTop = 50 * (1 - (2 * topDelta) / overlayHeight) + '%';
  } else if (placement === 'top' || placement === 'bottom') {
    // atY = placement;
    // atX = myX = 'center';
    // myY = placement === 'top' ? 'bottom': 'top';
    if (placement === 'top') {
      positionTop = childOffset.top - overlayHeight;
    } else {
      positionTop = childOffset.top + childOffset.height;
    }

    positionLeft = childOffset.left + (childOffset.width - overlayWidth) / 2;
    const leftDelta = getLeftDelta(
      positionLeft,
      overlayWidth,
      container,
      padding
    );

    positionLeft += leftDelta;
    arrowOffsetLeft = 50 * (1 - (2 * leftDelta) / overlayHeight) + '%';
  } else if (placement === 'center') {
    // atX = atY = myX = myY = 'center';
    positionLeft = childOffset.left + (childOffset.width - overlayWidth) / 2;
    positionTop = childOffset.top + (childOffset.height - overlayHeight) / 2;
    arrowOffsetLeft = arrowOffsetTop = void 0;
  } else {
    throw new Error(
      `calcOverlayPosition(): No such placement of "${placement}" found.`
    );
  }
  const [offSetX = 0, offSetY = 0] = customOffset;
  return {
    positionLeft: (positionLeft + offSetX) / scaleX,
    positionTop: (positionTop + offSetY) / scaleY,
    arrowOffsetLeft: (arrowOffsetLeft + offSetX) / scaleX,
    arrowOffsetTop: (arrowOffsetTop + offSetY) / scaleY,
    activePlacement
  };
}

/**
 * 专门用来获取样式的像素值，默认返回 0
 */
export function getStyleNumber(element: HTMLElement, styleName: string) {
  if (!element) {
    return 0;
  }
  return (
    parseInt(getComputedStyle(element).getPropertyValue(styleName), 10) || 0
  );
}

/** 根据关键字高亮显示文本内容 */
export function renderTextByKeyword(rendererText: string, curKeyword: string) {
  if (!rendererText || typeof rendererText !== 'string') {
    return rendererText;
  }

  if (curKeyword && ~rendererText.indexOf(curKeyword)) {
    const keywordStartIndex = rendererText.indexOf(curKeyword);
    const keywordEndIndex = keywordStartIndex + curKeyword.length;
    return (
      <span>
        {rendererText.substring(0, keywordStartIndex)}
        <span className="is-keyword">{curKeyword}</span>
        {rendererText.substring(keywordEndIndex)}
      </span>
    );
  } else {
    return rendererText;
  }
}
