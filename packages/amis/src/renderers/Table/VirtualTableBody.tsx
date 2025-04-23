import React from 'react';
import {ITableStore} from 'amis-core';
import {getScrollParent} from 'amis-core';
export interface VirtualTableBodyProps {
  className?: string;
  rows: React.ReactNode[];
  store: ITableStore;
}

export function VirtualTableBody(props: VirtualTableBodyProps) {
  const {className, rows, store} = props;
  const leadingPlaceholderRef = React.useRef<HTMLTableSectionElement>(null);
  const trailingPlaceholderRef = React.useRef<HTMLTableSectionElement>(null);
  const tBodyRef = React.useRef<HTMLTableSectionElement>(null);
  const [scrollTop, setScrollTop] = React.useState(0);
  const itemHeight = React.useRef(44);
  const sizeRef = React.useRef(20);

  const buffer = 10;
  const offset = Math.floor(scrollTop / itemHeight.current);
  const start = Math.max(0, offset - buffer);

  const visibleRows = React.useMemo(() => {
    return rows.slice(start, offset + sizeRef.current + buffer);
  }, [rows, offset, start, buffer]);

  React.useEffect(() => {
    const tbody = tBodyRef.current!;
    const table = tbody.parentElement!;
    const wrap = table.parentElement!;
    const rect = tbody.querySelector(':scope > tr')!.getBoundingClientRect();
    itemHeight.current = rect.height;
    wrap.classList.add('use-virtual-list');
    sizeRef.current = Math.min(
      Math.ceil(document.body.clientHeight / itemHeight.current),
      20
    );

    const header =
      wrap
        .closest('.cxd-Table')
        ?.querySelector(':scope > .cxd-Table-fixedTop') ||
      table.querySelector(':scope > thead')!;
    const firstRow = leadingPlaceholderRef.current!;

    const checkOffset = () => {
      const rect = header.getBoundingClientRect();
      const rect2 = firstRow.getBoundingClientRect();
      itemHeight.current = tbody
        .querySelector(':scope > tr')!
        .getBoundingClientRect().height;
      sizeRef.current = Math.min(
        Math.ceil(document.body.clientHeight / itemHeight.current),
        20
      );
      setScrollTop(rect.bottom - rect2.top);
    };

    // 使用 IntersectionObserver
    const observer = new IntersectionObserver(checkOffset, {
      rootMargin: '200px', // 提前加载的缓冲区
      threshold: [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1] // 触发阈值
    });

    // 观察元素
    observer.observe(leadingPlaceholderRef.current!);
    observer.observe(trailingPlaceholderRef.current!);
    document.addEventListener('scrollend', checkOffset, true);

    return () => {
      observer.disconnect();
      document.removeEventListener('scrollend', checkOffset, true);
    };
  }, []);

  React.useLayoutEffect(() => {
    const tbody = tBodyRef.current!;
    const table = tbody.parentElement!;
    const wrap = table.parentElement!;

    wrap.classList.add('use-virtual-list');
    wrap.style.cssText += `--Table-scroll-height: ${
      itemHeight.current * rows.length
    }px;--Table-scroll-offset: ${
      start * itemHeight.current
    }px; --Table-frame-height: ${itemHeight.current * visibleRows.length}px;`;
  }, [start, visibleRows, itemHeight.current, rows]);

  return (
    <>
      <tbody className="virtual-table-body-placeholder leading">
        <tr>
          <td colSpan={store.filteredColumns.length}>
            <div ref={leadingPlaceholderRef}></div>
          </td>
        </tr>
      </tbody>
      <tbody className={className} ref={tBodyRef}>
        {visibleRows}
      </tbody>
      <tbody className="virtual-table-body-placeholder trailing">
        <tr>
          <td colSpan={store.filteredColumns.length}>
            <div ref={trailingPlaceholderRef}></div>
          </td>
        </tr>
      </tbody>
    </>
  );
}
