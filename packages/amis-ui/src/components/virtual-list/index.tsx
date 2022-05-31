/**
 * 基于 https://github.com/clauderic/react-tiny-virtual-list 改造，主要是加了宽度自适应
 */

import * as React from 'react';
import {findDOMNode} from 'react-dom';
import * as PropTypes from 'prop-types';
import SizeAndPositionManager, {ItemSize} from './SizeAndPositionManager';
import {
  ALIGNMENT,
  DIRECTION,
  SCROLL_CHANGE_REASON,
  marginProp,
  oppositeMarginProp,
  positionProp,
  scrollProp,
  sizeProp
} from './constants';

export {DIRECTION as ScrollDirection} from './constants';

export type ItemPosition = 'absolute' | 'sticky';

export interface ItemStyle {
  position: ItemPosition;
  top?: number;
  left: number;
  width: string | number;
  height?: number;
  marginTop?: number;
  marginLeft?: number;
  marginRight?: number;
  marginBottom?: number;
  zIndex?: number;
}

interface StyleCache {
  [id: number]: ItemStyle;
}

export interface ItemInfo {
  index: number;
  style: ItemStyle;
}

export interface RenderedRows {
  startIndex: number;
  stopIndex: number;
}

export interface Props {
  className?: string;
  estimatedItemSize?: number;
  height: number | string;
  itemCount: number;
  itemSize: ItemSize;
  overscanCount?: number;
  scrollOffset?: number;
  scrollToIndex?: number;
  scrollToAlignment?: ALIGNMENT;
  scrollDirection?: DIRECTION;
  stickyIndices?: number[];
  style?: React.CSSProperties;
  width?: number | string;
  onItemsRendered?({startIndex, stopIndex}: RenderedRows): void;
  onScroll?(offset: number, event: UIEvent): void;
  renderItem(itemInfo: ItemInfo): React.ReactNode;
}

export interface State {
  offset: number;
  scrollChangeReason: SCROLL_CHANGE_REASON;
}

const STYLE_WRAPPER: React.CSSProperties = {
  overflow: 'auto',
  willChange: 'transform',
  WebkitOverflowScrolling: 'touch'
};

const STYLE_INNER: React.CSSProperties = {
  position: 'relative',
  width: 'auto',
  whiteSpace: 'nowrap',
  minHeight: '100%'
};

const STYLE_ITEM: {
  position: ItemStyle['position'];
  top: ItemStyle['top'];
  left: ItemStyle['left'];
  width: ItemStyle['width'];
} = {
  position: 'absolute' as ItemPosition,
  top: 0,
  left: 0,
  width: 'auto'
};

const STYLE_STICKY_ITEM = {
  ...STYLE_ITEM,
  position: 'sticky' as ItemPosition
};

export default class VirtualList extends React.PureComponent<Props, State> {
  static defaultProps = {
    overscanCount: 3,
    scrollDirection: DIRECTION.VERTICAL,
    width: '100%'
  };

  static propTypes = {
    estimatedItemSize: PropTypes.number,
    height: PropTypes.oneOfType([PropTypes.number, PropTypes.string])
      .isRequired,
    itemCount: PropTypes.number.isRequired,
    itemSize: PropTypes.oneOfType([
      PropTypes.number,
      PropTypes.array,
      PropTypes.func
    ]).isRequired,
    onScroll: PropTypes.func,
    onItemsRendered: PropTypes.func,
    overscanCount: PropTypes.number,
    renderItem: PropTypes.func.isRequired,
    scrollOffset: PropTypes.number,
    scrollToIndex: PropTypes.number,
    scrollToAlignment: PropTypes.oneOf([
      ALIGNMENT.AUTO,
      ALIGNMENT.START,
      ALIGNMENT.CENTER,
      ALIGNMENT.END
    ]),
    scrollDirection: PropTypes.oneOf([
      DIRECTION.HORIZONTAL,
      DIRECTION.VERTICAL
    ]),
    stickyIndices: PropTypes.arrayOf(PropTypes.number),
    style: PropTypes.object,
    width: PropTypes.oneOfType([PropTypes.number, PropTypes.string])
  };

  itemSizeGetter = (itemSize: Props['itemSize']) => {
    return (index: any) => this.getSize(index, itemSize);
  };

  sizeAndPositionManager = new SizeAndPositionManager({
    itemCount: this.props.itemCount,
    itemSizeGetter: this.itemSizeGetter(this.props.itemSize),
    estimatedItemSize: this.getEstimatedItemSize()
  });

  readonly state: State = {
    offset:
      this.props.scrollOffset ||
      (this.props.scrollToIndex != null &&
        this.getOffsetForIndex(this.props.scrollToIndex)) ||
      0,
    scrollChangeReason: SCROLL_CHANGE_REASON.REQUESTED
  };

  private rootNode: HTMLElement;

  private styleCache: StyleCache = {};

  componentDidMount() {
    const {scrollOffset, scrollToIndex} = this.props;
    this.rootNode.addEventListener('scroll', this.handleScroll, {
      passive: true
    });
    this.updateRootWidth();
    if (scrollOffset != null) {
      this.scrollTo(scrollOffset);
    } else if (scrollToIndex != null) {
      this.scrollTo(this.getOffsetForIndex(scrollToIndex));
    }
  }

  // 自适应宽度
  updateRootWidth() {
    const itemsDom = this.rootNode.children[0].children;
    const scrollbarWidth =
      window.innerWidth - document.documentElement.clientWidth || 15;
    const containerWidth =
      this.rootNode.parentElement!.getBoundingClientRect().width;
    let maxItemWidth = 0;
    for (let i = 0; i < itemsDom.length; i++) {
      let itemWidth = itemsDom[i].getBoundingClientRect().width;
      if (itemWidth > maxItemWidth) {
        maxItemWidth = itemWidth;
      }
    }
    if (maxItemWidth > containerWidth) {
      this.rootNode.style.width = maxItemWidth + scrollbarWidth + 'px';
    }
  }

  componentDidUpdate(prevProps: Props, prevState: State) {
    const props = this.props;
    const {
      estimatedItemSize,
      itemCount,
      itemSize,
      scrollOffset,
      scrollToAlignment,
      scrollToIndex
    } = prevProps;
    const scrollPropsHaveChanged =
      props.scrollToIndex !== scrollToIndex ||
      props.scrollToAlignment !== scrollToAlignment;
    const itemPropsHaveChanged =
      props.itemCount !== itemCount ||
      props.itemSize !== itemSize ||
      props.estimatedItemSize !== estimatedItemSize;

    if (props.itemSize !== itemSize) {
      this.sizeAndPositionManager.updateConfig({
        itemSizeGetter: this.itemSizeGetter(props.itemSize)
      });
    }

    if (
      props.itemCount !== itemCount ||
      props.estimatedItemSize !== estimatedItemSize
    ) {
      this.sizeAndPositionManager.updateConfig({
        itemCount: props.itemCount,
        estimatedItemSize: this.getEstimatedItemSize(props)
      });
    }

    if (itemPropsHaveChanged) {
      this.recomputeSizes();
    }

    if (props.scrollOffset !== scrollOffset) {
      this.setState({
        offset: props.scrollOffset || 0,
        scrollChangeReason: SCROLL_CHANGE_REASON.REQUESTED
      });
    } else if (
      typeof props.scrollToIndex === 'number' &&
      (scrollPropsHaveChanged || itemPropsHaveChanged)
    ) {
      this.setState({
        offset: this.getOffsetForIndex(
          props.scrollToIndex,
          props.scrollToAlignment,
          props.itemCount
        ),
        scrollChangeReason: SCROLL_CHANGE_REASON.REQUESTED
      });
    }

    const {offset, scrollChangeReason} = this.state;
    if (
      prevState.offset !== offset &&
      scrollChangeReason === SCROLL_CHANGE_REASON.REQUESTED
    ) {
      this.scrollTo(offset);
    }
  }

  componentWillUnmount() {
    this.rootNode.removeEventListener('scroll', this.handleScroll);
  }

  scrollTo(value: number) {
    const {scrollDirection = DIRECTION.VERTICAL} = this.props;

    (this.rootNode as any)[scrollProp[scrollDirection]] = value;
  }

  getOffsetForIndex(
    index: number,
    scrollToAlignment = this.props.scrollToAlignment,
    itemCount: number = this.props.itemCount
  ): number {
    const {scrollDirection = DIRECTION.VERTICAL} = this.props;

    if (index < 0 || index >= itemCount) {
      index = 0;
    }

    return this.sizeAndPositionManager.getUpdatedOffsetForIndex({
      align: scrollToAlignment,
      containerSize: this.props[sizeProp[scrollDirection] as 'scrollOffset']!,
      currentOffset: (this.state && this.state.offset) || 0,
      targetIndex: index
    });
  }

  recomputeSizes(startIndex = 0) {
    this.styleCache = {};
    this.sizeAndPositionManager.resetItem(startIndex);
  }

  render() {
    const {
      estimatedItemSize,
      height,
      overscanCount = 3,
      renderItem,
      itemCount,
      itemSize,
      onItemsRendered,
      onScroll,
      scrollDirection = DIRECTION.VERTICAL,
      scrollOffset,
      scrollToIndex,
      scrollToAlignment,
      stickyIndices,
      style,
      width,
      ...props
    } = this.props;
    const {offset} = this.state;
    const {start, stop} = this.sizeAndPositionManager.getVisibleRange({
      containerSize: (this as any).props[sizeProp[scrollDirection]] || 0,
      offset,
      overscanCount
    });
    const items: React.ReactNode[] = [];
    const wrapperStyle = {...STYLE_WRAPPER, ...style, height, width};
    const innerStyle = {
      ...STYLE_INNER,
      [sizeProp[scrollDirection]]: this.sizeAndPositionManager.getTotalSize()
    };

    if (stickyIndices != null && stickyIndices.length !== 0) {
      stickyIndices.forEach((index: number) =>
        items.push(
          renderItem({
            index,
            style: this.getStyle(index, true)
          })
        )
      );

      if (scrollDirection === DIRECTION.HORIZONTAL) {
        innerStyle.display = 'flex';
      }
    }

    if (typeof start !== 'undefined' && typeof stop !== 'undefined') {
      for (let index = start; index <= stop; index++) {
        if (stickyIndices != null && ~stickyIndices.indexOf(index)) {
          continue;
        }

        items.push(
          renderItem({
            index,
            style: this.getStyle(index, false)
          })
        );
      }

      if (typeof onItemsRendered === 'function') {
        onItemsRendered({
          startIndex: start,
          stopIndex: stop
        });
      }
    }

    return (
      <div ref={this.getRef} {...props} style={wrapperStyle}>
        <div style={innerStyle}>{items}</div>
      </div>
    );
  }

  private getRef = (node: HTMLDivElement): void => {
    this.rootNode = node;
  };

  private handleScroll = (event: UIEvent) => {
    const {onScroll} = this.props;
    const offset = this.getNodeOffset();

    if (
      offset < 0 ||
      this.state.offset === offset ||
      event.target !== this.rootNode
    ) {
      return;
    }

    this.setState({
      offset,
      scrollChangeReason: SCROLL_CHANGE_REASON.OBSERVED
    });

    if (typeof onScroll === 'function') {
      onScroll(offset, event);
    }
  };

  private getNodeOffset() {
    const {scrollDirection = DIRECTION.VERTICAL} = this.props;

    return (this as any).rootNode[scrollProp[scrollDirection]];
  }

  private getEstimatedItemSize(props = this.props) {
    return (
      props.estimatedItemSize ||
      (typeof props.itemSize === 'number' && props.itemSize) ||
      50
    );
  }

  private getSize(index: number, itemSize: any) {
    if (typeof itemSize === 'function') {
      return itemSize(index);
    }

    return Array.isArray(itemSize) ? itemSize[index] : itemSize;
  }

  private getStyle(index: number, sticky: boolean) {
    const style = this.styleCache[index];

    if (style) {
      return style;
    }

    const {scrollDirection = DIRECTION.VERTICAL} = this.props;
    const {size, offset} =
      this.sizeAndPositionManager.getSizeAndPositionForIndex(index);

    return (this.styleCache[index] = sticky
      ? {
          ...STYLE_STICKY_ITEM,
          [sizeProp[scrollDirection]]: size,
          [marginProp[scrollDirection]]: offset,
          [oppositeMarginProp[scrollDirection]]: -(offset + size),
          zIndex: 1
        }
      : {
          ...STYLE_ITEM,
          [sizeProp[scrollDirection]]: size,
          [positionProp[scrollDirection]]: offset
        });
  }
}
