/**
 * @file table/HeadCellSort
 * @author fex
 */

import React from 'react';

import {
  themeable,
  ThemeProps,
  ClassNamesFn,
  LocaleProps,
  localeable
} from 'amis-core';
import {Icon} from '../icons';
import {ColumnProps} from './index';

export interface Props extends ThemeProps, LocaleProps {
  column: ColumnProps;
  onSort?: Function;
  active?: boolean;
  classnames: ClassNamesFn;
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

  componentDidUpdate(prevProps: Readonly<Props>): void {
    const props = this.props;
    // 失效后重置，同时只能有一列在排序
    if (
      props?.active !== undefined &&
      !props?.active &&
      props.active !== prevProps?.active
    ) {
      this.setState({orderBy: '', order: ''});
    }
  }

  render() {
    const {active, column, onSort, classnames: cx} = this.props;

    return (
      <span
        className={cx('TableCell-sortBtn')}
        onClick={async () => {
          let sortPayload: State = {
            orderBy: '',
            order: ''
          };
          if (column.name === this.state.orderBy) {
            if (this.state.order === 'desc') {
              // 降序改为取消
              sortPayload = {orderBy: '', order: ''};
            } else {
              // 升序之后降序
              sortPayload = {orderBy: column.name, order: 'desc'};
            }
          } else {
            // 默认先升序
            sortPayload = {orderBy: column.name, order: 'asc'};
          }

          if (onSort) {
            const prevented = await onSort({
              orderBy: sortPayload.orderBy,
              order: sortPayload.order
            });
            if (prevented) {
              return;
            }
          }

          this.setState(sortPayload);
        }}
      >
        <i
          className={cx(
            'TableCell-sortBtn--down',
            active && this.state.order === 'desc' ? 'is-active' : ''
          )}
        >
          <Icon icon="sort-desc" className="icon" />
        </i>
        <i
          className={cx(
            'TableCell-sortBtn--up',
            active && this.state.order === 'asc' ? 'is-active' : ''
          )}
        >
          <Icon icon="sort-asc" className="icon" />
        </i>
        <i
          className={cx(
            'TableCell-sortBtn--default',
            active ? '' : 'is-active'
          )}
        >
          <Icon icon="sort-default" className="icon" />
        </i>
      </span>
    );
  }
}

export default themeable(localeable(HeadCellSort));
