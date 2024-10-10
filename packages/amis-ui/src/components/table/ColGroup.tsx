import React from 'react';

import {ColumnProps, DefaultCellWidth} from './index';
import {getBuildColumns} from './util';

export default function ColGroup({
  columns,
  colWidths,
  isFixed,
  syncTableWidth,
  initTableWidth,
  selectable,
  expandable,
  draggable,
  rowSelectionColumnWidth,
  expandableColumnWidth,
  isRightExpandable,
  isLeftExpandable,
  showReal
}: {
  columns: Array<ColumnProps>;
  colWidths: {
    [key: string]: {
      width: number;
      realWidth: number;
      minWidth: number;
      originWidth: number;
    };
  };
  isFixed: boolean;
  syncTableWidth: Function;
  initTableWidth: Function;
  selectable: boolean;
  expandable: boolean;
  draggable: boolean;
  rowSelectionColumnWidth: number;
  expandableColumnWidth: number;
  isRightExpandable?: boolean;
  isLeftExpandable?: boolean;
  showReal?: boolean;
}) {
  const {tdColumns} = getBuildColumns(columns);

  const domRef = React.createRef<HTMLTableColElement>();

  React.useEffect(() => {
    if (domRef.current) {
      initTableWidth();
      syncTableWidth();
    }
  }, []);

  React.useEffect(() => {
    const table = domRef.current!.parentElement!;
    const observer = new MutationObserver(() => {
      syncTableWidth();
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
      {draggable ? <col style={{width: DefaultCellWidth + 'px'}} /> : null}
      {selectable ? (
        <col style={{width: rowSelectionColumnWidth + 'px'}} />
      ) : null}
      {expandable && isLeftExpandable ? (
        <col style={{width: expandableColumnWidth + 'px'}} />
      ) : null}
      {tdColumns.map((col, index) => {
        const style: any = {};

        if (colWidths[col?.name]?.width) {
          style.width = colWidths[col?.name].width;
        } else if (col.width) {
          style.width = col.width;
        } else if (showReal) {
          style.width = col.realWidth;
        }

        if (!isFixed && style.width) {
          style.minWidth = style.width;
        }

        return <col style={style} key={index} />;
      })}
      {expandable && isRightExpandable ? (
        <col style={{width: expandableColumnWidth + 'px'}} />
      ) : null}
    </colgroup>
  );
}
