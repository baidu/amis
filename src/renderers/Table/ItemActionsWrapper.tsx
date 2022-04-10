import {observer} from 'mobx-react';
import React, {useEffect, useRef} from 'react';
import {ITableStore} from '../../store/table';
import {ClassNamesFn} from '../../theme';

export interface ItemActionsProps {
  classnames: ClassNamesFn;
  children: JSX.Element;
  store: ITableStore;
}

function ItemActionsWrapper(props: ItemActionsProps) {
  const cx = props.classnames;
  const children = props.children;
  const store = props.store;
  const divRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const row = store.hoverRow!;
    if (!row) {
      return;
    }

    const frame = divRef.current!.parentElement?.querySelector(
      'table'
    ) as HTMLElement;
    const dom = frame?.querySelector(`tr[data-id="${row.id}"]`) as HTMLElement;
    if (!dom) {
      return;
    }
    const rect = dom.getBoundingClientRect();
    const height = rect.height;
    const top = rect.top - frame.getBoundingClientRect().top;
    divRef.current!.style.cssText += `top: ${top}px;height: ${height}px;`;
  }, [store.hoverRow?.id]);

  return (
    <div className={cx('Table-itemActions-wrap')} ref={divRef}>
      {children}
    </div>
  );
}

export default observer(ItemActionsWrapper);
