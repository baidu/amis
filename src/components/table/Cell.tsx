/**
 * @file table/BodyCell
 * @author fex
 */

import React from 'react';

import {themeable, ThemeProps} from '../../theme';
import {LocaleProps, localeable} from '../../locale';
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
  column?: ColumnProps
}

export class BodyCell extends React.Component<Props> {
  static defaultProps = {
    fixed: '',
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
      tagName,
      style,
      column,
      classnames: cx
    } = this.props;

    if (tagName === 'TH') {
      return (
        <th
          key={key || null}
          rowSpan={rowSpan && rowSpan > 1 ? rowSpan : null}
          colSpan={colSpan && colSpan > 1 ? colSpan : null}
          className={cx('Table-cell', className, {
            [cx(`Table-cell-fix-${fixed}`)] : fixed
          })}
          style={fixed ? {position: 'sticky', zIndex} : style}
        >{children}</th>
      );
    }

    return (
      <td
        key={key || null}
        rowSpan={rowSpan && rowSpan > 1 ? rowSpan : null}
        colSpan={colSpan && colSpan > 1 ? colSpan : null}
        className={cx('Table-cell', className, {
          [cx(`Table-cell-fix-${fixed}`)] : fixed,
          [`text-${column?.align}`] : column?.align
        })}
        style={fixed ? {position: 'sticky', zIndex} : {}}
      >{children}</td>
    );
  }
}

export default themeable(localeable(BodyCell));