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
  onSort?: (payload: {orderBy: string; orderDir: string}) => any;
  active?: boolean;
  classnames: ClassNamesFn;
}

export interface State {
  orderDir: string; // 升序还是降序
  orderBy: string; // 一次只能按一列排序 当前列的key
}

export class HeadCellSort extends React.PureComponent<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      orderDir: '',
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
      this.setState({orderBy: '', orderDir: ''});
    }
  }

  render() {
    const {active, column, onSort, classnames: cx} = this.props;

    return (
      <span
        className={cx('TableCell-sortBtn', 'aaa')}
        onClick={async () => {
          let sortPayload: State = {
            orderBy: '',
            orderDir: ''
          };
          if (column.name === this.state.orderBy) {
            if (this.state.orderDir === 'desc') {
              // 降序改为取消
              sortPayload = {orderBy: '', orderDir: ''};
            } else {
              // 升序之后降序
              sortPayload = {orderBy: column.name, orderDir: 'desc'};
            }
          } else {
            // 默认先升序
            sortPayload = {orderBy: column.name, orderDir: 'asc'};
          }

          if (onSort) {
            const prevented = await onSort({
              orderBy: sortPayload.orderBy,
              orderDir: sortPayload.orderDir
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
            active && this.state.orderDir === 'desc' ? 'is-active' : ''
          )}
        >
          <Icon
            icon="sort-desc"
            className="icon"
            iconContent="table-sort-down"
          />
        </i>
        <i
          className={cx(
            'TableCell-sortBtn--up',
            active && this.state.orderDir === 'asc' ? 'is-active' : ''
          )}
        >
          <Icon icon="sort-asc" className="icon" iconContent="table-sort-up" />
        </i>
        <i
          className={cx(
            'TableCell-sortBtn--default',
            active ? '' : 'is-active'
          )}
        >
          <Icon
            icon="sort-default"
            className="icon"
            iconContent="table-sort-default"
          />
        </i>
      </span>
    );
  }
}

export default themeable(localeable(HeadCellSort));
