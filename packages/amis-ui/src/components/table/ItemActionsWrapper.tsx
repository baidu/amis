import React from 'react';

import {ClassNamesFn} from 'amis-core';

export interface ItemActionsProps {
  classnames: ClassNamesFn;
  children?: React.ReactNode | Array<React.ReactNode>;
  dom: HTMLTableRowElement;
}

export default class ItemActionsWrapper extends React.PureComponent<
  ItemActionsProps,
  {}
> {
  render() {
    const {classnames: cx, children, dom} = this.props;
    if (!dom) {
      return;
    }

    const frame = dom.closest('table')?.parentElement
      ?.parentElement as HTMLElement;

    const rect = dom.getBoundingClientRect();
    const height = rect.height;
    const top = rect.top - frame.getBoundingClientRect().top;

    return (
      <div
        className={cx('Table-itemActions-wrap')}
        style={{top: top + 'px', height: height + 'px'}}
      >
        {children}
      </div>
    );
  }
}
