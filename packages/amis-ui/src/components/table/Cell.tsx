/**
 * @file table/BodyCell
 * @author fex
 */

import React from 'react';

import {themeable, ThemeProps, LocaleProps, localeable} from 'amis-core';
import {ColumnProps} from './index';

const zIndex = 1;

export interface Props extends ThemeProps, LocaleProps {
  fixed?: string | boolean; // left | right
  rowSpan?: number | any;
  colSpan?: number | any;
  key?: string | number;
  className?: string;
  children?: any;
  tagName?: string;
  style?: Object;
  column?: ColumnProps;
  wrapperComponent: any;
  groupId?: string; // 表头分组随机生成的id
  depth?: number; // 表头分组
}

export class BodyCell extends React.Component<Props> {
  static defaultProps = {
    fixed: '',
    wrapperComponent: 'td',
    rowSpan: null,
    colSpan: null
  };

  render() {
    const {
      fixed,
      rowSpan,
      colSpan,
      key,
      children,
      className,
      column,
      style,
      groupId,
      depth,
      wrapperComponent: Component,
      classnames: cx
    } = this.props;

    return (
      <Component
        key={key || null}
        rowSpan={rowSpan && rowSpan > 1 ? rowSpan : null}
        colSpan={colSpan && colSpan > 1 ? colSpan : null}
        className={cx('Table-cell', className, {
          [cx(`Table-cell-fix-${fixed}`)]: fixed,
          [`text-${column?.align}`]: column?.align
        })}
        style={fixed ? {position: 'sticky', zIndex, ...style} : {...style}}
        data-group-id={groupId || null}
        data-depth={depth || null}
      >
        {children}
      </Component>
    );
  }
}

export default themeable(localeable(BodyCell));
