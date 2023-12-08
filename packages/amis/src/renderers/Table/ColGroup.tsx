import React from 'react';
import {chromeVersion, type IColumn, type ITableStore} from 'amis-core';
import {observer} from 'mobx-react';

export function ColGroup({
  columns,
  store
}: {
  columns: Array<IColumn>;
  store: ITableStore;
}) {
  const domRef = React.createRef<HTMLTableColElement>();

  React.useEffect(() => {
    if (domRef.current) {
      store.initTableWidth();
      store.syncTableWidth();
    }
  }, []);

  React.useEffect(() => {
    const table = domRef.current!.parentElement!;
    const observer = new MutationObserver(() => {
      store.syncTableWidth();
    });
    observer.observe(table, {
      attributes: true,
      childList: true,
      subtree: true
    });
    return () => {
      observer.disconnect();
    };
  }, []);

  // 解决 chrome 91 以下版本的设置 colgroup>col 的 width 属性无效的问题
  // 低版本同时设置 thead>th
  // The problem is min-width CSS property.
  // Before Chrome 91, min-width was ignored on COL elements. 91 no longer ignores it.
  if (typeof chromeVersion === 'number' && chromeVersion < 91) {
    React.useEffect(() => {
      if (domRef.current) {
        const ths = [].slice.call(
          domRef.current.parentElement!.querySelectorAll(
            ':scope > thead > tr > th[data-index]'
          )
        );
        ths.forEach((th: HTMLTableCellElement) => {
          const index = parseInt(th.getAttribute('data-index')!, 10);
          const column = store.columns[index];

          let style = '';
          let width: any = -1;

          if (store.columnWidthReady && column.width) {
            width = column.width;
          } else if (column.pristine.width) {
            width = column.pristine.width;
          }

          if (width === -1) {
            return;
          }
          style += `width: ${
            // 有可能是百分比
            typeof width === 'number' ? `${width}px` : width
          };`;

          if (store.tableLayout === 'auto') {
            style += `min-width: ${
              typeof width === 'number' ? `${width}px` : width
            };`;
          }
          th.style.cssText = style;
        });
      }
    }, columns.map(column => column.width).concat(store.columnWidthReady as any));
  }

  return (
    <colgroup ref={domRef}>
      {columns.map(column => {
        const style: any = {};

        if (store.columnWidthReady && column.width) {
          style.width = column.width;
        } else if (column.pristine.width) {
          style.width = column.pristine.width;
        }

        if (store.tableLayout === 'auto' && style.width) {
          style.minWidth = style.width;
        }

        return <col data-index={column.index} style={style} key={column.id} />;
      })}
    </colgroup>
  );
}

export default observer(ColGroup);
