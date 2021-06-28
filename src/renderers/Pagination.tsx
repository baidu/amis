import React from 'react';
import {Renderer, RendererProps} from '../factory';
import {autobind} from '../utils/helper';
import {Icon} from '../components/icons';
import {BaseSchema, SchemaClassName} from '../Schema';

export interface PaginationSchema extends BaseSchema {
  type: 'pagination';

  className?: SchemaClassName;

  /**
   * 是否显示快速跳转输入框
   */
  showPageInput?: boolean;

  /**
   * 模式，默认显示多个分页数字，如果只想简单显示可以配置成 `simple`。
   */
  mode?: 'simple' | 'normal';

  /**
   * 最多显示多少个分页按钮。
   *
   * @default 5
   */
  maxButtons?: number;
}

export interface PaginationProps
  extends RendererProps,
    Omit<PaginationSchema, 'type' | 'className'> {
  activePage: number;
  lastPage: number;
  hasNext: boolean;
  maxButtons: number;
  onPageChange: (page: number, perPage?: number) => void;
}

export interface PaginationState {
  pageNum: string;
}

export default class Pagination extends React.Component<
  PaginationProps,
  PaginationState
> {
  static defaultProps = {
    activePage: 1,
    lastPage: 1,
    maxButtons: 5,
    mode: 'normal',
    hasNext: false,
    showPageInput: false
  };

  state = {
    pageNum: String(this.props.activePage) || ''
  };

  componentDidUpdate(prevProps: PaginationProps) {
    const props = prevProps;
    if (prevProps.activePage !== props.activePage) {
      this.setState({
        pageNum: String(props.activePage) || ''
      });
    }
  }

  renderSimple() {
    const {activePage, hasNext, onPageChange, classnames: cx} = this.props;

    return (
      <ul className={cx('Pagination', 'Pagination--sm')}>
        <li
          className={cx({
            'is-disabled': activePage < 2
          })}
          onClick={
            activePage < 2
              ? e => e.preventDefault()
              : () => onPageChange(activePage - 1)
          }
        >
          <a>
            <Icon icon="left-arrow" className="icon" />
          </a>
        </li>
        <li
          className={cx({
            'is-disabled': !hasNext
          })}
          onClick={
            !hasNext
              ? e => e.preventDefault()
              : () => onPageChange(activePage + 1)
          }
        >
          <a>
            <Icon icon="right-arrow" className="icon" />
          </a>
        </li>
      </ul>
    );
  }

  @autobind
  handlePageChange(e: React.ChangeEvent<any>) {
    const {lastPage} = this.props;
    let value = e.currentTarget.value;

    if (/^\d+$/.test(value) && parseInt(value, 10) > lastPage) {
      value = String(lastPage);
    }

    this.setState({pageNum: value});
  }

  renderNormal() {
    let {
      activePage,
      lastPage,
      maxButtons,
      onPageChange,
      classnames: cx,
      showPageInput,
      className,
      translate: __
    } = this.props;
    const pageNum = this.state.pageNum;

    let pageButtons: any = [];
    let startPage: number;
    let endPage: number;

    if (activePage < (maxButtons - 1) / 2 + 2) {
      maxButtons = activePage + (maxButtons - 1) / 2;
    }

    if (lastPage - activePage < (maxButtons - 1) / 2 + 2) {
      maxButtons = lastPage - activePage + (maxButtons - 1) / 2 + 1;
    }

    if (maxButtons && maxButtons < lastPage) {
      startPage = Math.max(
        Math.min(
          activePage - Math.floor(maxButtons / 2),
          lastPage - maxButtons + 1
        ),
        1
      );
      endPage = startPage + maxButtons - 1;
    } else {
      startPage = 1;
      endPage = lastPage;
    }

    for (let page = startPage; page <= endPage; ++page) {
      pageButtons.push(
        <li
          onClick={() => onPageChange(page)}
          key={page}
          className={cx({
            'is-active': page === activePage
          })}
        >
          <a role="button">{page}</a>
        </li>
      );
    }

    if (startPage > 1) {
      if (startPage > 2) {
        pageButtons.unshift(
          <li onClick={() => onPageChange(startPage - 1)} key="prev-ellipsis">
            <a role="button">...</a>
          </li>
        );
      }

      pageButtons.unshift(
        <li
          onClick={() => onPageChange(1)}
          key={1}
          className={cx({
            'is-active': 1 === activePage
          })}
        >
          <a role="button">{1}</a>
        </li>
      );
    }

    if (endPage < lastPage) {
      if (lastPage - endPage > 1) {
        pageButtons.push(
          <li
            className={cx('Pagination-ellipsis')}
            onClick={() => onPageChange(endPage + 1)}
            key="next-ellipsis"
          >
            <a role="button">
              <span>...</span>
            </a>
          </li>
        );
      }

      pageButtons.push(
        <li
          onClick={() => onPageChange(lastPage)}
          key={lastPage}
          className={cx({
            'is-active': lastPage === activePage
          })}
        >
          <a role="button">{lastPage}</a>
        </li>
      );
    }

    pageButtons.unshift(
      <li
        className={cx('Pagination-prev', {
          'is-disabled': activePage === 1
        })}
        onClick={
          activePage === 1
            ? (e: any) => e.preventDefault()
            : () => onPageChange(activePage - 1)
        }
        key="prev"
      >
        <span>
          <Icon icon="left-arrow" className="icon" />
        </span>
      </li>
    );

    pageButtons.push(
      <li
        className={cx('Pagination-next', {
          'is-disabled': activePage === lastPage
        })}
        onClick={
          activePage === lastPage
            ? (e: any) => e.preventDefault()
            : () => onPageChange(activePage + 1)
        }
        key="next"
      >
        <span>
          <Icon icon="right-arrow" className="icon" />
        </span>
      </li>
    );

    return (
      <div className={cx('Pagination-wrap', className)}>
        <ul className={cx('Pagination', 'Pagination--sm')}>{pageButtons}</ul>

        {showPageInput === true || lastPage > 9 ? (
          <div className={cx('Pagination-inputGroup')} key="toPage">
            {__('CRUD.paginationGoText')}
            <input
              type="text"
              onChange={this.handlePageChange}
              onFocus={(e: any) => e.currentTarget.select()}
              onKeyUp={(e: any) =>
                e.keyCode == 13 &&
                onPageChange(parseInt(e.currentTarget.value, 10))
              }
              value={pageNum}
            />
            {__('CRUD.paginationPageText')}
          </div>
        ) : null}
      </div>
    );
  }

  render() {
    const {mode} = this.props;

    return mode === 'simple' ? this.renderSimple() : this.renderNormal();
  }
}

@Renderer({
  test: /(^|\/)(?:pagination|pager)$/,
  name: 'pagination'
})
export class PaginationRenderer extends Pagination {}
