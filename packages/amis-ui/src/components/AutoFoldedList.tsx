/**
 * AutoFoldedList Component
 *
 * A component that automatically folds list items when there are too many to display.
 * When clicked, it expands to show all items.
 *
 * @component
 */

import React, {useEffect, useRef, useState} from 'react';
import {themeable, ThemeProps} from 'amis-core';
import {resizeSensor} from 'amis-core';
import TooltipWrapper, {type TooltipObject} from './TooltipWrapper';

export interface AutoFoldedListProps extends ThemeProps {
  enabled?: boolean;

  /**
   * Maximum number of items to be visible
   */
  maxVisibleCount?: number;

  /**
   * Custom class name for the tooltip
   */
  tooltipClassName?: string;

  /**
   * Configuration options for the tooltip
   */
  tooltipOptions?: TooltipObject;

  /**
   * Array of items to be displayed in the list
   */
  items: Array<any>;

  /**
   * Function to render each list item
   * @param item - The item to render
   * @param index - The index of the item
   * @param folded - Whether the item is in folded state
   */
  renderItem: (item: any, index: number, folded: boolean) => React.ReactNode;

  /**
   * Function to render the summary text for remaining items
   * @param restItems - Array of remaining items
   */
  renderMoreSummary?: (restItems: any[]) => React.ReactNode;

  /**
   * Function to render the tooltip content
   * @param restItems - Array of remaining items
   */
  renderTooltipContent?: (restItems: any[]) => React.ReactNode;

  /**
   * Container element for the popover
   */
  popOverContainer?: any;
}

export const AutoFoldedList: React.FC<AutoFoldedListProps> = props => {
  const {
    items,
    renderItem,
    renderMoreSummary,
    renderTooltipContent,
    enabled = true,
    classnames: cx,
    popOverContainer,
    tooltipClassName,
    tooltipOptions,
    maxVisibleCount
  } = props;

  // State to track number of visible items
  const [visibleCount, setVisibleCount] = useState(0);

  // Refs for container and "more" elements
  const moreRef = useRef<HTMLDivElement>(null);

  const [visibleItems, restItems] = React.useMemo(() => {
    return [
      visibleCount && enabled ? items.slice(0, visibleCount) : items,
      visibleCount && enabled ? items.slice(visibleCount) : []
    ];
  }, [items, visibleCount, enabled]);

  /**
   * Renders a single list item with proper key
   */
  const itemRender = React.useCallback(
    (item: any, index: number, folded: boolean) => {
      const dom = renderItem(item, index, folded);
      if (React.isValidElement(dom)) {
        return React.cloneElement<any>(dom, {
          key: index
        });
      }
      return <div key={index}>{dom}</div>;
    },
    [renderItem]
  );

  /**
   * Effect to calculate and update visible items count based on container width
   */
  useEffect(() => {
    if (!enabled) {
      return;
    }

    const more = moreRef.current!;
    const container = more.parentElement!;
    const moreWidth = Math.max(more.offsetWidth, 30);
    const gap = 10;
    let lastExtendAt = 0;

    const calculateVisibleCount = () => {
      const rect = container.getBoundingClientRect();
      if (!rect.width) {
        return;
      }

      const list = Array.from(container.children).filter(
        item => !item.hasAttribute('data-folder-ignore')
      );
      let rightElementsWidth = 0;

      let rightElement: HTMLElement | null =
        more.nextElementSibling as HTMLElement;
      while (rightElement) {
        rightElementsWidth += rightElement.offsetWidth;
        rightElement = rightElement.nextElementSibling as HTMLElement;
      }

      let last = more.previousElementSibling;
      while (last) {
        if (
          last.getBoundingClientRect().right +
            moreWidth +
            gap +
            rightElementsWidth <
          rect.right
        ) {
          break;
        }
        last = last.previousElementSibling;
      }

      if (
        last &&
        last === more.previousElementSibling &&
        Date.now() - lastExtendAt > 200 // Prevent flickering
      ) {
        // Expand to show more items
        const width = (last as HTMLElement).offsetWidth;
        lastExtendAt = Date.now();
        const extend = Math.max(
          Math.floor(
            (rect.right -
              last.getBoundingClientRect().right -
              moreWidth -
              gap) /
              width
          ),
          0
        );
        setVisibleCount(
          Math.min(
            list.indexOf(last) + 1 + extend,
            maxVisibleCount ?? items.length
          )
        );
      } else if (last) {
        // Collapse to show fewer items
        setVisibleCount(list.indexOf(last) + 1);
      }
    };

    calculateVisibleCount();
    return resizeSensor(container, calculateVisibleCount, false, 'both', true);
  }, [items, maxVisibleCount, enabled]);

  React.useLayoutEffect(() => {
    if (!enabled) {
      return;
    }

    moreRef.current!.parentElement?.classList.add(cx('AutoFoldedList'));
    return () => {
      moreRef.current!.parentElement?.classList.remove(cx('AutoFoldedList'));
    };
  }, [enabled]);

  return (
    <>
      {visibleItems.map((item, index) => itemRender(item, index, false))}
      <div className={cx('AutoFoldedList-more')} ref={moreRef}>
        {restItems.length > 0 ? (
          <TooltipWrapper
            container={popOverContainer}
            tooltip={{
              placement: 'auto',
              trigger: 'hover',
              showArrow: false,
              ...tooltipOptions,
              children: () => (
                <div
                  className={cx(
                    'AutoFoldedList-more-tooltip',
                    tooltipClassName
                  )}
                >
                  {renderTooltipContent
                    ? renderTooltipContent(restItems)
                    : restItems.map((item, index) =>
                        itemRender(item, index + visibleCount, true)
                      )}
                </div>
              )
            }}
          >
            {renderMoreSummary ? (
              renderMoreSummary(restItems)
            ) : (
              <span>+ {restItems.length} ...</span>
            )}
          </TooltipWrapper>
        ) : null}
      </div>
    </>
  );
};

export default themeable(AutoFoldedList);
