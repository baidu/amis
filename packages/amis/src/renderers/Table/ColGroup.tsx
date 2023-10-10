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

  return (
    <colgroup ref={domRef}>
      {columns.map(column => {
        const style: any = {
          width: `var(--Table-column-${column.index}-width)`
        };

        if (store.tableLayout === 'auto') {
          style.minWidth = style.width;
        }

        return <col data-index={column.index} style={style} key={column.id} />;
      })}
    </colgroup>
  );
}

export default observer(ColGroup);
