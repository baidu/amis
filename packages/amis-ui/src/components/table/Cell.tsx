/**
 * @file table/BodyCell
 * @author fex
 */

import React from 'react';

import {ThemeProps, ClassNamesFn} from 'amis-core';

import {ColumnProps} from './index';
import type {TestIdBuilder} from 'amis-core';

const zIndex = 1;

export interface Props extends ThemeProps {
  fixed?: string | boolean; // left | right
  selfSticky?: boolean;
  rowSpan?: number | any;
  colSpan?: number | any;
  key?: string | number;
  className?: string;
  children?: any;
  tagName?: string;
  style?: Object;
  column?: ColumnProps;
  wrapperComponent: any;
  depth?: number; // 表头分组
  col?: string;
  index?: number;
  classnames: ClassNamesFn;
  testIdBuilder?: TestIdBuilder;
}

export default class BodyCell extends React.PureComponent<Props> {
  static defaultProps = {
    fixed: '',
    selfSticky: false,
    wrapperComponent: 'td',
    rowSpan: null,
    colSpan: null
  };

  render() {
    const {
      fixed,
      selfSticky,
      rowSpan,
      colSpan,
      children,
      className,
      column,
      style,
      depth,
      col,
      wrapperComponent: Component,
      classnames: cx,
      testIdBuilder
    } = this.props;

    let _style: object = {...style};

    if (fixed || selfSticky) {
      _style = {
        position: 'sticky',
        zIndex,
        ..._style
      };
    }

    return (
      <Component
        rowSpan={rowSpan && rowSpan > 1 ? rowSpan : null}
        colSpan={colSpan && colSpan > 1 ? colSpan : null}
        className={cx('Table-cell', className, {
          [cx(`Table-cell-fix-${fixed}`)]: fixed,
          [`Table-cell-self-sticky`]: selfSticky,
          [`text-${column?.align}`]: column?.align,
          [`align-${column?.vAlign}`]: column?.vAlign
        })}
        style={_style}
        data-depth={depth || null}
        data-col={col}
        {...testIdBuilder?.getTestId()}
      >
        {children}
      </Component>
    );
  }
}
