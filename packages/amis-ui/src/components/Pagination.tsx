/*
 * @Description: Pagination分页组件
 * @Author: wangfeilong02@baidu.com
 * @Date: 2021-11-01 16:57:38
 */
import React from 'react';
import isInteger from 'lodash/isInteger';
import {
  localeable,
  LocaleProps,
  resolveEventData,
  TestIdBuilder
} from 'amis-core';
import {themeable, ThemeProps} from 'amis-core';
import {autobind} from 'amis-core';
import {Icon} from './icons';
import Select from './Select';

export type MODE_TYPE = 'simple' | 'normal';

export const enum PaginationWidget {
  Pager = 'pager',
  PerPage = 'perpage',
  Total = 'total',
  Go = 'go'
}

export const enum KeyCode {
  ENTER = 'Enter',
  UP = 'ArrowUp',
  DOWN = 'ArrowDown'
}

export interface BasicPaginationProps {
  /**
   * 通过控制layout属性的顺序，调整分页结构 total,perPage,pager,go
   * @default ['pager']
   */
  layout?: string | Array<string>;

  /**
   * 最多显示多少个分页按钮。
   *
   * @default 5
   */
  maxButtons: number;

  /**
   * 模式，默认normal，如果只想简单显示可以配置成 `simple`。
   * @default 'normal'
   */
  mode?: MODE_TYPE;

  /**
   * 当前页数
   */
  activePage: number;

  /**
   * 总条数
   */
  total?: number;

  /**
   * 最后一页，总页数（如果传入了total，会重新计算lastPage）
   */
  lastPage?: number;

  /**
   * 每页显示条数
   * @default 10
   */
  perPage?: number;

  /**
   * 是否展示分页切换，也同时受layout控制
   * @default false
   */
  showPerPage?: boolean;

  /**
   * 指定每页可以显示多少条
   * @default [10, 20, 50, 100]
   */
  perPageAvailable?: Array<number>;

  /**
   * 是否显示快速跳转输入框
   * @default false
   */
  showPageInput?: boolean;

  /**
   * 是否禁用
   * @default false
   */
  disabled?: boolean;

  hasNext?: boolean;

  /**
   * 弹层挂载节点
   * @default false
   */
  popOverContainerSelector?: string;

  /**
   * 多页跳转页数
   *
   * @default 5
   */
  ellipsisPageGap?: number;

  /**
   * 组件尺寸
   *
   * @default 'md'
   */
  size?: string;

  onPageChange?: (page: number, perPage?: number, dir?: string) => void;

  /**
   * 按钮类型
   *
   * @default 'icon'
   */
  buttonType?: string;
}
export interface PaginationProps
  extends BasicPaginationProps,
    ThemeProps,
    LocaleProps {
  popOverContainer?: any;
  testIdBuilder?: TestIdBuilder;
}
export interface PaginationState {
  pageNum: string;
  internalPageNum: string;
  perPage: number;
}
export class Pagination extends React.Component<
  PaginationProps,
  PaginationState
> {
  static defaultProps = {
    layout: [PaginationWidget.Pager],
    maxButtons: 5,
    mode: 'normal' as MODE_TYPE,
    activePage: 1,
    perPage: 10,
    perPageAvailable: [10, 20, 50, 100],
    ellipsisPageGap: 5,
    size: 'md',
    buttonType: 'icon'
  };

  state = {
    pageNum: '',
    internalPageNum: '1',
    perPage: Number(this.props.perPage)
  };

  constructor(props: PaginationProps) {
    super(props);

    this.handlePageNumChange = this.handlePageNumChange.bind(this);
    this.renderPageItem = this.renderPageItem.bind(this);
    this.renderEllipsis = this.renderEllipsis.bind(this);
    this.handlePageNums = this.handlePageNums.bind(this);
  }

  componentDidUpdate(prevProps: PaginationProps) {
    if (prevProps.perPage !== this.props.perPage) {
      const perPage = Number(this.props.perPage);
      this.setState({perPage: isInteger(perPage) ? perPage : 10});
    }
  }

  componentWillReceiveProps(nextProps: PaginationProps) {
    if (
      // 原本作用在simple上的样式和部分方法变成了normal的，这里需要重置内部状态
      this.props.mode !== 'simple' &&
      nextProps.activePage !== Number(this.state.internalPageNum)
    ) {
      this.setState({internalPageNum: String(nextProps.activePage)});
    }
  }

  async handlePageNumChange(page: number, perPage?: number, dir?: string) {
    const {disabled, onPageChange} = this.props;
    const _page = isNaN(Number(page)) || Number(page) < 1 ? 1 : page;

    if (disabled) {
      return;
    }
    onPageChange?.(_page, perPage, dir);
  }

  /**
   * 渲染每个页码li
   *
   * @param page 页码
   */
  renderPageItem(page: number) {
    const {classnames: cx, activePage, testIdBuilder} = this.props;
    const {perPage} = this.state;

    return (
      <li
        onClick={() => this.handlePageNumChange(page, perPage)}
        key={page}
        className={cx('Pagination-pager-item', {
          'is-active': page === activePage
        })}
      >
        <a
          role="button"
          {...testIdBuilder?.getChild(`page-${page}`).getTestId()}
        >
          {page}
        </a>
      </li>
    );
  }

  /**
   * 渲染...
   *
   * @param key 类型 'prev-ellipsis' | 'next-ellipsis'
   * @param page 页码
   */
  renderEllipsis(key: string) {
    const {
      classnames: cx,
      activePage,
      ellipsisPageGap,
      testIdBuilder
    } = this.props;
    const {perPage} = this.state;
    const lastPage = this.getLastPage();
    const gap: number =
      isNaN(Number(ellipsisPageGap)) || Number(ellipsisPageGap) < 1
        ? 5
        : Number(ellipsisPageGap);
    const isPrevEllipsis = key === 'prev-ellipsis';
    const jumpContent = isPrevEllipsis ? (
      <Icon icon="arrow-double-left" className="icon" />
    ) : (
      <Icon icon="arrow-double-right" className="icon" />
    );
    const jumpPage = isPrevEllipsis
      ? Math.max(1, activePage - gap)
      : Math.min(lastPage, activePage + gap);

    return (
      <li
        key={key}
        className={cx('Pagination-ellipsis')}
        onClick={(e: any) => {
          return this.handlePageNumChange(
            jumpPage,
            perPage,
            isPrevEllipsis ? 'backward' : 'forward'
          );
        }}
        {...testIdBuilder?.getChild(key).getTestId()}
      >
        <a role="button">...</a>
        <span className="icon">{jumpContent}</span>
      </li>
    );
  }

  /**
   * 渲染器事件方法装饰器
   *
   * @param cur 当前页数
   * @param counts 总共页码按钮数
   * @param min 最小页码
   * @param max 最大页码
   */
  handlePageNums(
    cur: number,
    counts: number,
    min: number,
    max: number
  ): Array<any> {
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
      if (cur - step < min && cur + step > max) {
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
    const {total, lastPage, activePage, hasNext} = this.props;
    const perPage = this.state.perPage;

    // 输入total，重新计算lastPage
    if (total && perPage) {
      return Math.ceil(total / (perPage as number));
    }
    if (lastPage) {
      return Number(lastPage);
    }
    if (hasNext) {
      return Number(activePage + 1);
    }
    return Number(activePage);
  }

  @autobind
  handlePageChange(e: React.ChangeEvent<any>) {
    const lastPage = this.getLastPage();
    let value = e.currentTarget.value;

    if (/^\d+$/.test(value) && parseInt(value, 10) > lastPage) {
      value = String(lastPage);
    }

    this.setState({pageNum: value});
  }

  /**
   * 简洁模式input onChange/onKeyUp事件
   *
   * @param event
   */
  @autobind
  handleSimpleKeyUp(
    e:
      | React.KeyboardEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLInputElement>
  ) {
    const lastPage = this.getLastPage();
    const key = (e as React.KeyboardEvent<HTMLInputElement>).key;
    let v: number = parseInt(e.currentTarget.value, 10);
    // handle keyboard up and down events value
    switch (key) {
      case KeyCode.DOWN:
        v = isNaN(v) || v < 2 ? 1 : v - 1;
        break;
      case KeyCode.UP:
        v = v + 1;
        break;
      default:
        break;
    }
    // validate inputvalue
    if (/^\d+$/.test(String(v)) && v >= lastPage) {
      v = lastPage;
    }
    this.setState({internalPageNum: String(v)});
    // handle empty val
    if (!v) {
      this.setState({internalPageNum: ''});
      return;
    }
    if (([KeyCode.UP, KeyCode.DOWN, KeyCode.ENTER] as string[]).includes(key)) {
      this.handlePageNumChange(v, this.props.perPage);
    }
  }

  /**
   * 简洁模式input onBlur事件
   */
  @autobind
  handleSimpleBlur() {
    this.setState({internalPageNum: String(this.props.activePage)});
  }

  render() {
    const {
      layout,
      mode,
      activePage,
      total,
      showPerPage,
      perPageAvailable,
      classnames: cx,
      showPageInput,
      className,
      style,
      disabled,
      hasNext,
      popOverContainer,
      popOverContainerSelector,
      mobileUI,
      size,
      translate: __,
      buttonType,
      testIdBuilder
    } = this.props;
    let maxButtons = this.props.maxButtons;
    const {pageNum, perPage, internalPageNum} = this.state;
    const lastPage = this.getLastPage();

    let basePager: React.ReactNode = null;
    // 移动端复用简洁模式的样式
    if ((mode !== 'simple' && mobileUI) || mode === 'simple') {
      basePager = mobileUI ? (
        // 移动端简洁模式不需要中间的数字
        mode === 'simple' ? null : (
          <li className={cx('Pagination-simplego')} key="simple-go">
            <input
              className={cx('Pagination-simplego-input')}
              key="simple-input"
              type="text"
              disabled={disabled}
              onChange={this.handleSimpleKeyUp}
              onKeyUp={this.handleSimpleKeyUp}
              onBlur={this.handleSimpleBlur}
              value={internalPageNum}
              {...testIdBuilder?.getChild('simple-input').getTestId()}
            />
            /
            <span className={cx('Pagination-simplego-right')} key="go-right">
              {lastPage}
            </span>
          </li>
        )
      ) : (
        <span className="Pagination-simple-number">{activePage}</span>
      );

      return (
        <div
          className={cx(
            'Pagination-wrap',
            `Pagination-wrap-size--${size}`,
            'Pagination-simple',
            {disabled: disabled},
            className
          )}
          style={style}
          {...testIdBuilder?.getTestId()}
        >
          <ul
            key="pager-items"
            className={cx(
              'Pagination',
              'Pagination--sm',
              'Pagination-pager-items',
              'Pagination-item'
            )}
          >
            <li
              className={cx('Pagination-prev', {
                'is-disabled': activePage < 2
              })}
              onClick={(e: any) => {
                if (activePage < 2) {
                  return e.preventDefault();
                }

                return this.handlePageNumChange(
                  activePage - 1,
                  undefined,
                  'backward'
                );
              }}
              key="prev"
            >
              <span {...testIdBuilder?.getChild(`go-prev`).getTestId()}>
                {buttonType === 'icon' ? (
                  <Icon icon="left-arrow" className="icon" />
                ) : buttonType === 'text' ? (
                  '上一页'
                ) : null}
              </span>
            </li>
            {basePager}
            <li
              className={cx('Pagination-next', {
                'is-disabled': activePage >= lastPage && !hasNext // 到达最后一页并且没有配置hasNext属性时，禁止点击下一页按钮
              })}
              onClick={(e: any) => {
                if (activePage === lastPage && !hasNext) {
                  return e.preventDefault();
                }
                return this.handlePageNumChange(
                  activePage + 1,
                  perPage,
                  'forward'
                );
              }}
              key="next"
            >
              <span {...testIdBuilder?.getChild(`go-next`).getTestId()}>
                {buttonType === 'icon' ? (
                  <Icon icon="right-arrow" className="icon" />
                ) : buttonType === 'text' ? (
                  '下一页'
                ) : null}
              </span>
            </li>
          </ul>
        </div>
      );
    }

    let pageButtons: any = [];
    let layoutList: Array<string> = Array.isArray(layout)
      ? layout
      : typeof layout === 'string'
      ? layout.split(',')
      : [];

    /** 分页组件至少要包含页码 */
    if (!layoutList.includes(PaginationWidget.Pager)) {
      layoutList.unshift(PaginationWidget.Pager);
    }
    /** 统一使用小写格式，外部属性case insensitive */
    layoutList = layoutList.map(widget => widget.trim().toLowerCase());

    /** 兼容showPageInput属性，默认展示跳转页面 */
    if (showPageInput && !layoutList.includes(PaginationWidget.Go)) {
      layoutList.push(PaginationWidget.Go);
    }

    if (showPerPage && !layoutList.includes(PaginationWidget.PerPage)) {
      layoutList.unshift(PaginationWidget.PerPage);
    }

    // 页码全部显示 [1, 2, 3, 4]
    if (lastPage <= maxButtons) {
      pageButtons = this.handlePageNums(
        activePage,
        maxButtons,
        1,
        Math.min(maxButtons, lastPage)
      );
    }
    //当前为1234页时， [1, 2, 3, 4, 5, ... 12]
    else if (activePage <= maxButtons - 3) {
      pageButtons = this.handlePageNums(
        activePage,
        maxButtons - 2,
        1,
        Math.min(maxButtons - 2, lastPage)
      );
      pageButtons.push(this.renderEllipsis('next-ellipsis'));
      pageButtons.push(this.renderPageItem(lastPage));
    }
    // [1, ..., 5, 6, 7, 8, 9]
    else if (activePage > lastPage - (maxButtons - 3)) {
      const min = lastPage - (maxButtons - 3);
      pageButtons = this.handlePageNums(
        activePage,
        maxButtons - 2,
        min,
        lastPage
      );
      pageButtons.unshift(this.renderEllipsis('prev-ellipsis'));
      pageButtons.unshift(this.renderPageItem(1));
    }
    // [1, ... 4, 5, 6, ... 10]
    else {
      pageButtons = this.handlePageNums(
        activePage,
        maxButtons - 2,
        3,
        lastPage - 3
      );
      pageButtons.unshift(this.renderEllipsis('prev-ellipsis'));
      pageButtons.unshift(this.renderPageItem(1));
      pageButtons.push(this.renderEllipsis('next-ellipsis'));
      pageButtons.push(this.renderPageItem(lastPage));
    }
    pageButtons.unshift(
      <li
        className={cx('Pagination-prev', {
          'is-disabled': activePage < 2
        })}
        onClick={(e: any) => {
          if (activePage < 2) {
            return e.preventDefault();
          }
          return this.handlePageNumChange(activePage - 1, perPage);
        }}
        key="prev"
      >
        <span {...testIdBuilder?.getChild('go-prev').getTestId()}>
          {buttonType === 'icon' ? (
            <Icon icon="left-arrow" className="icon" />
          ) : buttonType === 'text' ? (
            '上一页'
          ) : null}
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
          return this.handlePageNumChange(activePage + 1, perPage);
        }}
        key="next"
      >
        <span {...testIdBuilder?.getChild('go-next').getTestId()}>
          {buttonType === 'icon' ? (
            <Icon icon="right-arrow" className="icon" />
          ) : buttonType === 'text' ? (
            '下一页'
          ) : null}
        </span>
      </li>
    );

    if (mobileUI) {
      pageButtons = [
        pageButtons[0],
        // this.renderPageItem(activePage),
        pageButtons[pageButtons.length - 1]
      ];
    }

    const go = mobileUI ? null : (
      <div className={cx('Pagination-inputGroup Pagination-item')} key="go">
        <span className={cx('Pagination-inputGroup-left')} key="go-left">
          {__('Pagination.goto')}
        </span>
        <input
          className={cx('Pagination-inputGroup-input')}
          key="go-input"
          type="text"
          disabled={disabled}
          onChange={this.handlePageChange}
          onFocus={(e: any) => e.currentTarget.select()}
          onKeyUp={(e: any) => {
            const v: number = parseInt(e.currentTarget.value, 10);
            if (!v || e.code != 'Enter') {
              return;
            }
            this.setState({pageNum: ''});
            this.handlePageNumChange(v, perPage);
          }}
          value={pageNum}
          {...testIdBuilder?.getChild('go-input').getTestId()}
        />
        <span
          className={cx('Pagination-inputGroup-right')}
          key="go-right"
          onClick={(e: any) => {
            if (!pageNum) {
              return;
            }
            this.setState({pageNum: ''});
            this.handlePageNumChange(+pageNum, perPage);
          }}
          {...testIdBuilder?.getChild('go').getTestId()}
        >
          {__('Pagination.go')}
        </span>
      </div>
    );
    const selection = (perPageAvailable as Array<number>)
      .filter(v => !!v)
      .map(v => ({label: __('Pagination.select', {count: v}), value: v}));
    const perPageEle = mobileUI ? null : (
      <Select
        key="perpage"
        className={cx('Pagination-perpage', 'Pagination-item')}
        clearable={false}
        disabled={disabled}
        value={perPage}
        options={selection || []}
        popOverContainer={popOverContainer}
        popOverContainerSelector={popOverContainerSelector}
        onChange={(p: any) => {
          this.setState({
            perPage: p.value,
            pageNum: ''
          });
          this.handlePageNumChange(1, p.value);
        }}
        {...testIdBuilder?.getChild('perpage').getTestId()}
      />
    );

    // total或者lastpage不存在，不渲染总数
    const totalPage =
      !(total || lastPage) || mobileUI ? null : (
        <div className={cx('Pagination-total Pagination-item')} key="total">
          {total || total === 0
            ? __('Pagination.totalCount', {total})
            : __('Pagination.totalPage', {lastPage})}
        </div>
      );
    return (
      <div
        className={cx(
          'Pagination-wrap',
          `Pagination-wrap-size--${size}`,
          {disabled: disabled},
          className
        )}
        {...testIdBuilder?.getTestId()}
      >
        {layoutList.map(layoutItem => {
          if (layoutItem === PaginationWidget.Pager) {
            return (
              <ul
                key="pager-items"
                className={cx(
                  'Pagination',
                  'Pagination--sm',
                  'Pagination-item'
                )}
              >
                {pageButtons}
              </ul>
            );
          } else if (layoutItem === PaginationWidget.Go) {
            return go;
          } else if (layoutItem === PaginationWidget.PerPage) {
            return perPageEle;
          } else if (layoutItem === PaginationWidget.Total) {
            return totalPage;
          } else {
            return null;
          }
        })}
      </div>
    );
  }
}

export default themeable(localeable(Pagination));
