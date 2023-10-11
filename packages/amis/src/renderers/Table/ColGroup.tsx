import React from 'react';
import type {IColumn, ITableStore} from 'amis-core';
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
