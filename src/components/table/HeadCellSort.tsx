/**
 * @file table/HeadCellSort
 * @author fex
 */

import React from 'react';

import {themeable, ThemeProps} from '../../theme';
import {LocaleProps, localeable} from '../../locale';
import {Icon} from '../icons';

export interface Props extends ThemeProps, LocaleProps {
  column: any;
  onSort?: Function;
}

export interface State {
  order: string; // 升序还是降序
  orderBy: string; // 一次只能按一列排序 当前列的key
}

export class HeadCellSort extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      order: '',
      orderBy: ''
    };
  }

  render() {
    const {
      column,
      onSort,
      classnames: cx
    } = this.props;

    return (
      <span
        className={cx('TableCell-sortBtn')}
        onClick={() => {
          const callback = () => {
            if (onSort) {
              onSort({
                orderBy: this.state.orderBy,
                order: this.state.order
              });
            }
          }

          let sortPayload = {};
          if (column.key === this.state.orderBy) {
            if (this.state.order === 'descend') {
              // 降序改为取消
              sortPayload = {orderBy: '', order: 'ascend'};
            } else {
              // 升序之后降序
              sortPayload = {order: 'descend'};
            }
          } else {
            // 默认先升序
            sortPayload = {orderBy: column.key, order: 'ascend'};
          }

          this.setState(sortPayload, callback);
        }}
      >
        <i
          className={cx(
            'TableCell-sortBtn--down',
            this.state.orderBy === column.key && this.state.order === 'descend'
              ? 'is-active'
              : ''
          )}
        >
          <Icon icon="sort-desc" className="icon" />
        </i>
        <i
          className={cx(
            'TableCell-sortBtn--up',
            this.state.orderBy === column.key && this.state.order === 'ascend'
              ? 'is-active'
              : ''
          )}
        >
          <Icon icon="sort-asc" className="icon" />
        </i>
        <i
          className={cx(
            'TableCell-sortBtn--default',
            this.state.orderBy === column.key ? '' : 'is-active'
          )}
        >
          <Icon icon="sort-default" className="icon" />
        </i>
      </span>
    );
  }
}

export default themeable(localeable(HeadCellSort));