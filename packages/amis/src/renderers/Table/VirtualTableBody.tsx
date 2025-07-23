import React, {startTransition} from 'react';
import {ITableStore, localeable, themeable, ThemeProps} from 'amis-core';
import {getScrollParent} from 'amis-core';
import {resizeSensor} from 'amis-core';
export interface VirtualTableBodyProps extends ThemeProps {
  className?: string;
  rows: React.ReactNode[];
  store: ITableStore;
}

function VirtualTableBody(props: VirtualTableBodyProps) {
  const {className, rows, store, classPrefix} = props;
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
    const rootDom = wrap.closest(`.${classPrefix}Table`)!;

    const header =
      rootDom?.querySelector(`:scope > .${classPrefix}Table-fixedTop`) ||
      table.querySelector(':scope > thead')!;
    const firstRow = leadingPlaceholderRef.current!;
    const isAutoFill = rootDom.classList.contains(`${classPrefix}Table--autoFillHeight`);
    const toDispose: Array<() => void> = [];

    const check = () => {
      const rect = header.getBoundingClientRect();
      const rect2 = firstRow.getBoundingClientRect();
      const scrollTop = rect.bottom - rect2.top;
      setScrollTop(scrollTop);
      if (scrollTop && store.tableLayout !== 'fixed') {
        store.switchToFixedLayout();
      }
    };
    let timer: ReturnType<typeof requestAnimationFrame> | null = null;
    const lazyCheck = () => {
      timer && cancelAnimationFrame(timer);
      timer = requestAnimationFrame(check);
    };

    if (isAutoFill) {
      wrap.addEventListener('scroll', lazyCheck);
      toDispose.push(() => wrap.removeEventListener('scroll', lazyCheck));
    } else {
      let scrollContainer: HTMLElement | Document = getScrollParent(
        rootDom as HTMLElement
      ) as HTMLElement | Document;
      scrollContainer =
        scrollContainer === document.body ? document : scrollContainer;
      scrollContainer.addEventListener('scroll', lazyCheck);
      toDispose.push(() =>
        scrollContainer.removeEventListener('scroll', lazyCheck)
      );
    }

    toDispose.push(
      resizeSensor(wrap, () => {
        itemHeight.current = tbody
          .querySelector(':scope > tr')!
          .getBoundingClientRect().height;
        sizeRef.current = Math.min(
          Math.ceil(
            Math.min(isAutoFill ? wrap.clientHeight : window.innerHeight) /
              itemHeight.current
          ),
          20
        );
        check();
      })
    );

    return () => {
      toDispose.forEach(fn => fn());
      toDispose.length = 0;
    };
  }, []);

  const styles: any = {
    '--Table-scroll-height': `${itemHeight.current * rows.length}px`,
    '--Table-scroll-offset': `${start * itemHeight.current}px`,
    '--Table-frame-height': `${itemHeight.current * visibleRows.length}px`
  };

  return (
    <>
      <tbody style={styles} className="virtual-table-body-placeholder leading">
        <tr>
          <td colSpan={store.filteredColumns.length}>
            <div ref={leadingPlaceholderRef}></div>
          </td>
        </tr>
      </tbody>
      <tbody className={className} ref={tBodyRef}>
        {visibleRows}
      </tbody>
      <tbody style={styles} className="virtual-table-body-placeholder trailing">
        <tr>
          <td colSpan={store.filteredColumns.length}>
            <div ref={trailingPlaceholderRef}></div>
          </td>
        </tr>
      </tbody>
    </>
  );
}

export default themeable(VirtualTableBody);
