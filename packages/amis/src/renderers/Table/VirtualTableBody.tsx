import React, {startTransition} from 'react';
import {ITableStore, localeable, themeable, ThemeProps} from 'amis-core';
import {getScrollParent} from 'amis-core';
import {resizeSensor} from 'amis-core';
import type {IRow} from 'amis-core/lib/store/table';
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
  // get range
  const [from, to] = React.useMemo(() => {
    let from = 0;
    let offsetHeight = 0;

    for (let i = 0, len = rows.length; i < len; i++) {
      const row = rows[from] as React.ReactElement;
      const item = row?.props?.item;
      const height = item?.height || itemHeight.current;
      if (offsetHeight + height > scrollTop) {
        break;
      }
      offsetHeight += height;
      from++;
    }

    from = Math.max(0, from - buffer);
    let to = Math.min(from + sizeRef.current + buffer * 2, rows.length);

    if (store.combineNum) {
      // 开头的 rowSpan 如果有 0 的话，继续往上找，直到找到没有 0 的为止
      // 如果有 0 意味着这个单元格是被上面的单元格合并了的，要保证 table 的完整性需要这么处理
      while (from > 0) {
        const row = rows[from] as React.ReactElement;
        const item = row?.props?.item;
        if (
          Object.values(item?.rowSpans || {}).some(
            (value: number) => value === 0
          )
        ) {
          from--;
          continue;
        }
        break;
      }

      // 保障表格渲染的完整性，不能因为滚动位置的原因把 rowspan 切断了
      let index = to;
      for (; index >= from; index--) {
        const row = rows[index] as React.ReactElement;
        const item = row?.props?.item;
        const rowSpan = Math.max(
          1,
          ...(Object.values(item?.rowSpans || {}) as Array<number>)
        );
        if (rowSpan > 1) {
          to = Math.max(to, index + rowSpan);
        }
      }
    }
    return [from, to];
  }, [rows, scrollTop]);

  // get visible rows
  const [visibleRows, offsetHeight, totalHeight, virtualHeight] =
    React.useMemo(() => {
      let offsetHeight = 0;
      let totalHeight = 0;
      let virtualHeight = 0;
      offsetHeight = 0;
      rows.forEach((item, index) => {
        const row: IRow = (item as React.ReactElement)?.props?.item;
        const height = row?.height || itemHeight.current;

        totalHeight += height;
        if (index < from) {
          offsetHeight += height;
        } else if (index <= to) {
          virtualHeight += height;
        }
      });
      return [rows.slice(from, to), offsetHeight, totalHeight, virtualHeight];
    }, [rows, from, to]);

  React.useEffect(() => {
    const tbody = tBodyRef.current!;
    const table = tbody.parentElement!;
    const wrap = table.parentElement!;
    const rootDom = wrap.closest(`.${classPrefix}Table`)!;

    const fixedHeader = rootDom?.querySelector(`:scope > .${classPrefix}Table-fixedTop`);
    const header = fixedHeader || table.querySelector(':scope > thead')!;
    const firstRow = leadingPlaceholderRef.current!;
    const isAutoFill = rootDom.classList.contains(
      `${classPrefix}Table--autoFillHeight`
    );
    const toDispose: Array<() => void> = [];
    const check = () => {
      let scrollTop = 0;
      // 判断 header 是否是固定表头
      if (fixedHeader) {
        // 固定表头：用 getBoundingClientRect 计算
        const rect = header.getBoundingClientRect();
        const rect2 = firstRow.getBoundingClientRect();
        scrollTop = rect.bottom - rect2.top;
      } else {
        // 普通 thead：直接读取滚动容器的 scrollTop
        const scrollContainer: any = isAutoFill ? wrap : 
          (getScrollParent(rootDom as HTMLElement) === document.body ? 
            document.documentElement : getScrollParent(rootDom as HTMLElement));
        scrollTop = scrollContainer.scrollTop || 0;
      }
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
        const trs = [].slice.apply(tbody.querySelectorAll(':scope > tr')!);
        trs.forEach((tr: any) => {
          const id = tr.getAttribute('data-id');
          const item = store.getItemById(id);
          if (!item) {
            return;
          }
          itemHeight.current = tr.offsetHeight;
          item.setHeight(itemHeight.current!);
        });

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
    '--Table-scroll-height': `${totalHeight}px`,
    '--Table-scroll-offset': `${offsetHeight}px`,
    '--Table-frame-height': `${virtualHeight}px`
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
