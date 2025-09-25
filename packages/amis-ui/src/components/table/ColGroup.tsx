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
    [key: number]: {
      width: number;
      realWidth: number;
      minWidth: number;
      originWidth: number;
    };
  };
  isFixed: boolean;
  syncTableWidth?: Function;
  initTableWidth?: Function;
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
    initTableWidth?.();

    if (!syncTableWidth) {
      return;
    }
    const table = domRef.current!.parentElement!;
    let trs: Array<HTMLElement> = [];

    function reConnect() {
      // 整体监听不准，因为整体可能不会宽度变化
      // 监控 thead 下面所有的 th 的 resize 变化
      // 如果变化了，需要重新更新表格宽度计算
      const doms: Array<HTMLElement> = [].slice.call(
        table.querySelectorAll(':scope > tbody > tr:first-child > *')
      );

      // 先看 th 本身有没有变化，如果没变化，就不要重新监听了
      if (doms.some((d, index) => trs[index] !== d)) {
        observer.disconnect();
        trs = doms;
        doms.forEach((dom: any) => {
          observer.observe(dom);
        });
      }
    }

    const observer = new ResizeObserver(() => {
      reConnect();
      syncTableWidth();
    });

    reConnect();
    syncTableWidth();
    return () => {
      observer.disconnect();
    };
  }, [columns.length]);
  let offset = 0;

  return (
    <colgroup ref={domRef}>
      {draggable
        ? (offset++, (<col style={{width: DefaultCellWidth + 'px'}} />))
        : null}
      {selectable
        ? (offset++, (<col style={{width: rowSelectionColumnWidth + 'px'}} />))
        : null}
      {expandable && isLeftExpandable
        ? (offset++, (<col style={{width: expandableColumnWidth + 'px'}} />))
        : null}
      {tdColumns.map((col, index) => {
        const style: any = {};
        const colIndex = index + offset;

        if (colWidths[colIndex]?.width) {
          style.width = colWidths[colIndex].width;
        } else if (col.width) {
          style.width = col.width;
        } else if (showReal) {
          style.width = colWidths[colIndex]?.realWidth;
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
