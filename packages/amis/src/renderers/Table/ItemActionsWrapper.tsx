import {observer} from 'mobx-react';
import React, {useEffect, useRef} from 'react';
import {ITableStore} from 'amis-core';
import {ClassNamesFn} from 'amis-core';

export interface ItemActionsProps {
  classnames: ClassNamesFn;
  children: React.ReactNode | Array<React.ReactNode>;
  store: ITableStore;
}

function ItemActionsWrapper(props: ItemActionsProps) {
  const cx = props.classnames;
  const children = props.children;
  const store = props.store;
  const divRef = useRef<HTMLDivElement>(null);

  const updatePosition = React.useCallback(
    (id: string = store.hoverRow?.id || '') => {
      const frame = divRef.current!.parentElement?.querySelector(
        'table'
      ) as HTMLElement;

      const dom = frame?.querySelector(`tr[data-id="${id}"]`) as HTMLElement;
      if (!dom) {
        return;
      }

      const rect = dom.getBoundingClientRect();
      const height = rect.height;
      const top =
        rect.top -
        frame.getBoundingClientRect().top +
        parseInt(getComputedStyle(frame)['marginTop'], 10);
      divRef.current!.style.cssText += `top: ${top}px;height: ${height}px; left: ${
        frame.parentElement!.scrollLeft
      }px;`;
    },
    []
  );

  useEffect(() => {
    const row = store.hoverRow!;
    if (!row) {
      return;
    }

    updatePosition(row.id);
  }, [store.hoverRow?.id]);

  useEffect(() => {
    const frame = divRef.current!.parentElement as HTMLElement;
    if (!frame) {
      return;
    }
    let onScroll = () => {
      updatePosition(store.hoverRow?.id);
    };

    frame.addEventListener('scroll', onScroll);
    return () => {
      frame.removeEventListener('scroll', onScroll);
    };
  });

  return (
    <div className={cx('Table-itemActions-wrap')} ref={divRef}>
      {children}
    </div>
  );
}

export default observer(ItemActionsWrapper);
