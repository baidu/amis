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
  return (
    <colgroup>
      {columns.map(column => {
        const style: any = {};

        if (store.columnWidthReady) {
          style.width = column.width;
        } else if (column.pristine.width) {
          style.width = column.pristine.width;
        }

        return <col data-index={column.index} style={style} key={column.id} />;
      })}
    </colgroup>
  );
}

export default observer(ColGroup);
