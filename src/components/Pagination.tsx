/*
 * @Description: Pagination分页组件
 * @Author: wangfeilong02@baidu.com
 * @Date: 2021-11-01 16:57:38
 */
import React from 'react';
import {localeable, LocaleProps} from '../locale';
import {themeable, ThemeProps} from '../theme';
import {autobind} from '../utils/helper';
import {Icon} from './icons';
import Select from './Select';

export interface PaginationProps extends ThemeProps, LocaleProps {

  /**
   * 通过控制layout属性的顺序，调整分页结构 total,perPage,pager,go
   * @default 'total,perPage,pager,go'
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
   * 总条数
   */
  total: number;

  /**
   * 最后一页，总页数（如果传入了total，会重新计算lastPage）
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
  showPerPage: boolean;

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
  perPage: number;
  activePage: number;
  lastPage: number;
}
export class Pagination extends React.Component<
  PaginationProps,
  PaginationState
> {
  static defaultProps: Partial<PaginationProps> = {
    layout: 'total,perPage,pager,go',
    maxButtons: 7,
    mode: 'normal',
    activePage: 1,
    lastPage: 1,
    perPage: 10,
    showPerPage: true,
    perPageAvailable: [10, 20, 50, 100],
    showPageInput: true
  };

  state = {
    pageNum: String(this.props.activePage) || '',
    perPage: Number(this.props.perPage),
    activePage: Number(this.props.activePage),
    lastPage: this.getLastPage()
  };

  constructor(props: PaginationProps) {
    super(props);

    this.handlePageNumChange = this.handlePageNumChange.bind(this);
    this.renderPageItem = this.renderPageItem.bind(this);
    this.renderEllipsis = this.renderEllipsis.bind(this);
    this.handlePageNums = this.handlePageNums.bind(this);
  }

  handlePageNumChange(page: number, perPage: number) {
    const props = this.props;
    if (props.disabled) {
      return;
    }
    this.setState({activePage: page});
    props.onPageChange && props.onPageChange(page, perPage);
  }

  /**
  * 渲染每个页码li
  *
  * @param page 页码
  */
  renderPageItem(page: number) {
    const {classnames: cx} = this.props;
    const {perPage, activePage} = this.state;

    return (<li
      onClick={() => this.handlePageNumChange(page, perPage)}
      key={page}
      className={cx('page-item', {
        'is-active': page === activePage
      })}
    >
      <a role="button">{page}</a>
    </li>);
  }

  /**
  * 渲染...
  *
  * @param key 类型 'prev-ellipsis' | 'next-ellipsis'
  * @param page 页码
  */
  renderEllipsis(key: string) {
    const {classnames: cx} = this.props;
    return (<li key={key} className={cx('ellipsis')}><a role="button">...</a></li>);
  }

  /**
  * 渲染器事件方法装饰器
  *
  * @param cur 当前页数
  * @param counts 总共页码按钮数
  * @param min 最小页码
  * @param max 最大页码
  */
  handlePageNums(cur: number, counts: number, min: number, max: number): Array<any> {
    const pageButtons: Array<any> = [];
    if (counts === 0) {
      return pageButtons;
    }

    let step = 0;
    let page = cur;
    while (true) {
      if (pageButtons.length >= counts) {
        return pageButtons;
      }
      if ((cur - step) < min && (cur + step) > max) {
        return pageButtons;
      }
      page = cur - step;
      if (pageButtons.length < counts && page >= min) {
        pageButtons.unshift(this.renderPageItem(page));
      }
      page = cur + step;
      if (step !== 0 && pageButtons.length < counts && page <= max) {
        pageButtons.push(this.renderPageItem(page));
      }
      step++;
    }
  }

  getLastPage() {
    const {total, perPage, lastPage} = this.props;
    // 输入total，重新计算lastPage
    if (total || total === 0) {
      return Math.ceil(total / perPage);
    }
    return Number(lastPage);
  }

  componentDidUpdate(prevProps: PaginationProps) {
  }


  @autobind
  handlePageChange(e: React.ChangeEvent<any>) {
    const {lastPage} = this.state;
    let value = e.currentTarget.value;

    if (/^\d+$/.test(value) && parseInt(value, 10) > lastPage) {
      value = String(lastPage);
    }

    this.setState({pageNum: value});
  }

  render() {
    const {
      layout,
      maxButtons,
      mode,
      total,
      showPerPage,
      perPageAvailable,
      hideOnSinglePage,
      onPageChange,
      classnames: cx,
      showPageInput,
      className,
      disabled,
      translate: __
    } = this.props;
    const {pageNum, perPage, activePage, lastPage} = this.state;


    let pageButtons: any = [];

    let layoutList: Array<string> = [];
    if (Array.isArray(layout)) {
      layoutList = layout;
    }
    else if (typeof layout === 'string') {
      layoutList = (layout as string).split(',');
    }

    // 页码全部显示 [1, 2, 3, 4]
    if (lastPage <= maxButtons) {
      pageButtons = this.handlePageNums(activePage, maxButtons, 1, maxButtons);
    }
    //当前为1234页时， [1, 2, 3, 4, 5, ... 12]
    else if (activePage <= maxButtons - 3) {
      pageButtons = this.handlePageNums(activePage, maxButtons - 2, 1, maxButtons - 2);
      pageButtons.push(this.renderEllipsis('next-ellipsis'));
      pageButtons.push(this.renderPageItem(lastPage));
    }
    // [1, ..., 5, 6, 7, 8, 9]
    else if (activePage > (lastPage - (maxButtons- 3))) {
      const min = lastPage - (maxButtons- 3);
      pageButtons = this.handlePageNums(activePage, maxButtons - 2, min, lastPage);
      pageButtons.unshift(this.renderEllipsis('prev-ellipsis'));
      pageButtons.unshift(this.renderPageItem(1));
    }
    // [1, ... 4, 5, 6, ... 10]
    else {
      pageButtons = this.handlePageNums(activePage, maxButtons - 2, 3, lastPage - 3);
      pageButtons.unshift(this.renderEllipsis('prev-ellipsis'));
      pageButtons.unshift(this.renderPageItem(1));
      pageButtons.push(this.renderEllipsis('next-ellipsis'));
      pageButtons.push(this.renderPageItem(lastPage));
    }

    pageButtons.unshift(
      <li
        className={cx('Pagination-prev', {
          'is-disabled': activePage === 1
        })}
        onClick={(e: any) => {
          if (activePage === 1) {
            return e.preventDefault();
          }
          return this.handlePageNumChange(activePage - 1, perPage)
        }}
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
        onClick={(e: any) => {
          if (activePage === lastPage) {
            return e.preventDefault();
          }
          return this.handlePageNumChange(activePage + 1, perPage)
        }}
        key="next"
      >
        <span>
          <Icon icon="right-arrow" className="icon" />
        </span>
      </li>
    );
    const go = <div className={cx('Pagination-inputGroup Pagination-item')} key="go">
        <span className={cx('go-left')} key="go-left">{__('Pagination.goto')}</span>
          <input
            className={cx('go-input')} key="go-input"
            type="text"
            disabled={disabled}
            onChange={this.handlePageChange}
            onFocus={(e: any) => e.currentTarget.select()}
            onKeyUp={(e: any) =>{
              const v: number = parseInt(e.currentTarget.value, 10);
              if (!v || e.code != 'Enter') {
                return;
              }
              this.setState({pageNum: String(v)});

              this.handlePageNumChange(v, perPage);
            }}
            value={pageNum}
          />
          <span
            className={cx('go-right')}
            key="go-right"
            onClick={(e: any) => {
              this.handlePageNumChange(+pageNum, perPage);
            }}
            >GO</span>
      </div>;
    const selection = perPageAvailable.map(v => ({label: __('Pagination.select', {count: v}), value: v}));
    const perPageEle =
            <Select
              key="perpage"
              className={cx('Pagination-perpage', 'Pagination-item')}
              overlayPlacement="right-bottom-right-top"
              clearable={false}
              disabled={disabled}
              value={perPage}
              options={selection}
              onChange={(p: any) => {
                this.setState({perPage: p.value});
                if (total) {
                  this.setState({lastPage: Math.ceil(total / p.value)})
                }
                this.handlePageNumChange(1, p.value);
              }}
            />;
    const totalPage = <div className={cx('Pagination-total Pagination-item')} key="total">{__('Pagination.total', {total: lastPage})}</div>;
    return (
      <div className={cx('Pagination-wrap',  {'disabled': disabled}, className)}>
        {
          layoutList.map((layoutItem) => {
            if (layoutItem === 'pager') {
              return <ul key="pager-items" className={cx('Pagination', {
          'Pagination-simple': mode === 'simple'}, 'Pagination--sm','Pagination-item')}>{pageButtons}</ul>;
            }
            else if (layoutItem === 'go' && showPageInput) {
              return go;
            }
            else if (layoutItem === 'perPage'&& showPerPage) {
              return perPageEle;
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


export default themeable(localeable(Pagination));
