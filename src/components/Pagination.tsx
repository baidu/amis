/*
 * @Description: Pagination分页组件
 * @Author: wangfeilong02@baidu.com
 * @Date: 2021-11-01 16:57:38
 */
import React from 'react';
import {themeable, ClassNamesFn} from '../theme';
import {autobind} from '../utils/helper';
import {Icon} from './icons';
import {BaseSchema, SchemaClassName} from '../Schema';
import Select from './Select';

export interface PaginationProps {
  className?: SchemaClassName;

  classnames: ClassNamesFn;

  /**
   * 通过控制layout属性的顺序，调整分页结构 total,pageSize,pager,go
   * @default 'total,pageSize,pager,go'
   */
  layout?: string | Array<string>;

  /**
   * 最多显示多少个分页按钮。
   *
   * @default 7
   */
  maxButtons: number;

  /**
   * 模式，默认显示多个分页数字，如果只想简单显示可以配置成 `simple`。
   * @default 'normal'
   */
  mode?: 'simple' | 'normal';

  /**
   * 当前页数
   */
  activePage: number;

  /**
   * 最后一页，总页数
   */
  lastPage: number;

  /**
   * 每页显示条数
   * @default 10
   */
  perPage: number;

  /**
   * 是否展示分页切换，也同时受layout控制
   * @default true
   */
  showPageSize: boolean;

  /**
   * 指定每页可以显示多少条
   * @default [10, 20, 50, 100]
   */
  perPageAvailable: Array<number>;

  /**
   * 只有一页时是否隐藏分页器
   * @default false
   */
  hideOnSinglePage: boolean;

  /**
   * 是否显示快速跳转输入框
   */
  showPageInput?: boolean;

  /**
   * 是否禁用
   * @default false
   */
  disabled?: boolean;


  hasNext: boolean;
  onPageChange: (page: number, perPage?: number) => void;
}
export interface PaginationState {
  pageNum: string;
  pageSize: number;
  activePage: number;
}
export class Pagination extends React.Component<
  PaginationProps,
  PaginationState
> {
  static defaultProps: Partial<PaginationProps> = {
    layout: 'total,pageSize,pager,go',
    maxButtons: 7,
    mode: 'normal',
    activePage: 1,
    lastPage: 1,
    perPage: 10,
    showPageSize: true,
    perPageAvailable: [10, 20, 50, 100],
    hideOnSinglePage: false,
    showPageInput: true,
    disabled: false,
    hasNext: false,
    onPageChange: (page: number, perPage: number) => {}
  };

  state = {
    pageNum: String(this.props.activePage) || '',
    pageSize: Number(this.props.perPage),
    activePage: Number(this.props.activePage)
  };

  constructor(props: PaginationProps) {
    super(props);

    this.doPageChange = this.doPageChange.bind(this);
  }

  doPageChange(page: number, perPage: number) {
    const props = this.props;
    if (props.disabled) {
      return;
    }
    this.setState({
      activePage: page
    });
    props.onPageChange && props.onPageChange(page, perPage);
  }

  componentDidUpdate(prevProps: PaginationProps) {
    const props = prevProps;
    if (prevProps.activePage !== props.activePage) {
      this.setState({
        pageNum: String(props.activePage) || ''
      });
    }
    if (prevProps.perPage !== props.perPage) {
      this.setState({
        pageSize: Number(props.perPage)
      });
    }
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

  render() {
    let {
      layout,
      maxButtons,
      mode,
      // activePage,
      // lastPage,
      // perPage,
      showPageSize,
      perPageAvailable,
      hideOnSinglePage,
      onPageChange,
      classnames: cx,
      showPageInput,
      className,
      disabled
    } = this.props;
    // const pageNum = this.state.pageNum;
    // const pageSize = this.state.pageSize;
    const activePage = this.state.activePage;
    // const activePage = parseInt(this.props.activePage, 10);
    const lastPage = Number(this.props.lastPage);
    const perPage = Number(this.props.perPage);

    let pageButtons: any = [];
    let startPage: number;
    let endPage: number;

    let layoutList = layout;
    if (Array.isArray(layout)) {
      layoutList = layout;
    } else {
      try {
        layoutList = (layout as string).split(',');
      } catch (error) {
        layoutList = [];
      }
    }

    if (lastPage <= maxButtons) {
      for (let page = lastPage; page >= 1; --page) {
        pageButtons.unshift(
          <li
            onClick={() => this.doPageChange(page, perPage)}
            key={page}
            className={cx({
              'is-active': page === activePage
            })}
          >
            <a role="button">{page}</a>
          </li>
        );
      }
    }
    else if (activePage < maxButtons - 2) {
      for (let page = 1; page <= lastPage; ++page) {
        if (pageButtons.length < maxButtons - 2) {
          pageButtons.push(
            <li
              onClick={() => this.doPageChange(page, perPage)}
              key={page}
              className={cx({
                'is-active': page === activePage
              })}
            >
              <a role="button">{page}</a>
            </li>
          );
        } else {
          pageButtons.push(
            <li onClick={() => this.doPageChange(page - 1, perPage)} key="next-ellipsis">
              <a role="button">...</a>
            </li>
          );
          pageButtons.push(
            <li
              onClick={() => this.doPageChange(lastPage, perPage)}
              key={lastPage}
              className={cx({
                'is-active': lastPage === activePage
              })}
            >
              <a role="button">{lastPage}</a>
            </li>
          );
          break;
        }
      }

    }
    else if (activePage >= lastPage - 3) {
      for (let page = lastPage; page >= 1; --page) {
        if (pageButtons.length < maxButtons - 2) {
          pageButtons.unshift(
            <li
              onClick={() => this.doPageChange(page, perPage)}
              key={page}
              className={cx({
                'is-active': page === activePage
              })}
            >
              <a role="button">{page}</a>
            </li>
          );
        } else {
          pageButtons.unshift(
            <li onClick={() => this.doPageChange(page - 1, perPage)} key="prev-ellipsis">
              <a role="button">...</a>
            </li>
          );
          pageButtons.unshift(
            <li
              onClick={() => this.doPageChange(1, perPage)}
              key={1}
              className={cx({
                'is-active': 1 === activePage
              })}
            >
              <a role="button">{1}</a>
            </li>
          );
          break;
        }
      }

    }
    else {
      let min = activePage;
      let max = activePage + 1;
      while(pageButtons.length < maxButtons - 4) {
        let page = min;
        pageButtons.unshift(
            <li
              onClick={() => this.doPageChange(page, perPage)}
              key={page}
              className={cx({
                'is-active': page === activePage
              })}
            >
              <a role="button">{page}</a>
            </li>
          );
        min--;
        if (pageButtons.length < maxButtons - 4) {
          page = max;
          pageButtons.push(
            <li
              onClick={() => this.doPageChange(page, perPage)}
              key={page}
              className={cx({
                'is-active': page === activePage
              })}
            >
              <a role="button">{page}</a>
            </li>
          );
          max++;
        }
      }
      pageButtons.unshift(
            <li onClick={() => this.doPageChange(min, perPage)} key="prev-ellipsis">
              <a role="button">...</a>
            </li>
          );
      pageButtons.unshift(
            <li
              onClick={() => this.doPageChange(1, perPage)}
              key={1}
              className={cx({
                'is-active': 1 === activePage
              })}
            >
              <a role="button">{1}</a>
            </li>
          );

      pageButtons.push(
            <li onClick={() => this.doPageChange(max, perPage)} key="next-ellipsis">
              <a role="button">...</a>
            </li>
          );
      pageButtons.push(
            <li
              onClick={() => this.doPageChange(lastPage, perPage)}
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
            : () => this.doPageChange(activePage - 1, perPage)
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
            : () => this.doPageChange(activePage + 1, perPage)
        }
        key="next"
      >
        <span>
          <Icon icon="right-arrow" className="icon" />
        </span>
      </li>
    );
    const go = <div className={cx('Pagination-inputGroup Pagination-item')} key="go">
        <span className={cx('go-left')} key="go-left">跳转至</span>
          <input
            className={cx('go-input')} key="go-put"
            type="text"
            disabled={disabled}
            onChange={this.handlePageChange}
            onFocus={(e: any) => e.currentTarget.select()}
            onKeyUp={(e: any) =>{
              const v: number = parseInt(e.currentTarget.value, 10);
              if (!v || e.keyCode != 13) {
                return;
              }
              this.setState({
                pageNum: String(v)
              });

              this.doPageChange(v, perPage);
            }}
            value={this.state.pageNum}
          />
          <span
            className={cx('go-right')}
            key="go-right"
            onClick={(e: any) => {
              this.doPageChange(+this.state.pageNum, perPage);
            }}
            >GO</span>
      </div>;
    const selection = perPageAvailable.map(v => ({label: `${v}条/页`, value: v}));
    const pageSizeEle =
            <Select
              key="pagesize"
              className={cx('Pagination-pagesize', 'Pagination-item')}
              overlayPlacement="right-bottom-right-top"
              clearable={false}
              disabled={disabled}
              value={this.state.pageSize}
              options={selection}
              onChange={(p: any) => {
                this.setState({pageSize: p.value});
                this.doPageChange(1, p.value);
              }}
            />;
    const totalPage = <div className={cx('Pagination-total Pagination-item')} key="total">共{lastPage}页</div>;
    return (
      <div className={cx('Pagination-wrap',  {'disabled': disabled}, className)}>
        {
          layoutList.map((layoutItem) => {
            if (layoutItem === 'pager') {
              return <ul key="pager" className={cx('Pagination', 'Pagination--sm','Pagination-item')}>{pageButtons}</ul>;
            }
            else if (layoutItem === 'go' && showPageInput) {
              return go;
            }
            else if (layoutItem === 'pageSize' && showPageSize) {
              return pageSizeEle;
            }
            else if (layoutItem === 'total') {
              return totalPage;
            }
            else {
              return null;
            }
          })
        }

      </div>
    );
  }

}

export default themeable(Pagination);

