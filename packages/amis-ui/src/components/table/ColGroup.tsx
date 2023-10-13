import React from 'react';
import {observer} from 'mobx-react';

import {ColumnProps} from './index';

export function ColGroup({
  columns,
  colWidths,
  isFixed,
  syncTableWidth,
  initTableWidth,
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
  showReal?: boolean;
}) {
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
      {columns.map((col, index) => {
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
    </colgroup>
  );
}

export default observer(ColGroup);
