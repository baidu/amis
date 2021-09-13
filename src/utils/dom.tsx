import React from 'react';
import ReactDOM from 'react-dom';
import hoistNonReactStatic from 'hoist-non-react-statics';
import getOffset from './offset';
import getPosition from './position';

const bsMapping: {
  [propName: string]: string;
} = {
  level: 'bsStyle',
  classPrefix: 'bsClass',
  size: 'bsSize'
};

/**
 * 主要目的是希望在是用 bootstrap 组件的时候不需要带 bs 前缀。
 *
 * @param {Object} rawProps 原始属性对象。
 * @return {Object}
 */
export const props2BsProps = (rawProps: {[propName: string]: any}) => {
  let props: {[propName: string]: any} = {};

  Object.keys(rawProps).forEach(
    key => (props[bsMapping[key] || key] = rawProps[key])
  );

  return props;
};

/**
 * props2BsProps 的 hoc 版本
 *
 * @param {*} ComposedComponent 组合组件
 * @return {Component}
 */
export const props2BsPropsHoc: (
  ComposedComponent: React.ComponentType<any>
) => React.ComponentType<any> = ComposedComponent => {
  class BsComponent extends React.Component<any> {
    render() {
      return <ComposedComponent {...props2BsProps(this.props)} />;
    }
  }

  hoistNonReactStatic(BsComponent, ComposedComponent);
  return BsComponent;
};

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
  padding: any = 0
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
  placement =
    placement === 'auto'
      ? 'left-bottom-left-top right-bottom-right-top left-top-left-bottom right-top-right-bottom left-bottom-left-top'
      : placement;

  let positionLeft = 0,
    positionTop = 0,
    arrowOffsetLeft: any = '',
    arrowOffsetTop: any = '',
    activePlacement: string = placement;

  if (~placement.indexOf('-')) {
    const tests = placement.split(/\s+/);

    while (tests.length) {
      const current = (activePlacement = tests.shift());
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
      if (tests.length) {
        const transformed = {
          x: clip.x + positionLeft / scaleX,
          y: clip.y + positionTop / scaleY,
          width: overlayWidth,
          height: overlayHeight
        };

        if (
          transformed.x > 0 &&
          transformed.x + transformed.width < window.innerWidth &&
          transformed.y > 0 &&
          transformed.y + transformed.height < window.innerHeight
        ) {
          break;
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

  return {
    positionLeft: positionLeft / scaleX,
    positionTop: positionTop / scaleY,
    arrowOffsetLeft: arrowOffsetLeft / scaleX,
    arrowOffsetTop: arrowOffsetTop / scaleY,
    activePlacement
  };
}
