import * as React from 'react';
import {Renderer, RendererProps} from '../factory';
import { autobind } from '../utils/helper';

export interface PaginationProps extends RendererProps {
    activePage: number;
    items: number;
    maxButtons: number;
    hasNext: boolean;
    mode: string;
    onPageChange: (page: number, perPage?: number) => void;
    showPageInput: boolean;
}

export interface PaginationState {
    pageNum: string;
};

export default class Pagination extends React.Component<PaginationProps, PaginationState> {
    static defaultProps = {
        activePage: 1,
        items: 1,
        maxButtons: 5,
        mode: 'normal',
        hasNext: false,
        showPageInput: true,
    };

    state = {
        pageNum:  String(this.props.activePage) || ''
    };

    componentWillReceiveProps(nextProps:PaginationProps) {
        if (this.props.activePage !== nextProps.activePage) {
            this.setState({
                pageNum: String(nextProps.activePage) || ''
            })
        }
    }

    renderSimple() {
        const {activePage, hasNext, onPageChange, classnames: cx} = this.props;

        return (
            <ul className={cx('Pagination', 'Pagination--sm')}>
                <li
                    className={cx({
                        disabled: activePage < 2,
                    })}
                    onClick={activePage < 2 ? e => e.preventDefault() : () => onPageChange(activePage - 1)}
                >
                    <a>
                        <i className="fa fa-chevron-left" />
                    </a>
                </li>
                <li
                    className={cx({
                        disabled: !hasNext,
                    })}
                    onClick={!hasNext ? e => e.preventDefault() : () => onPageChange(activePage + 1)}
                >
                    <a>
                        <i className="fa fa-chevron-right" />
                    </a>
                </li>
            </ul>
        );
    }

    @autobind
    handlePageChange(e: React.ChangeEvent<any>) {
        const {items} = this.props;
        let value = e.currentTarget.value;

        if (/^\d+$/.test(value) && parseInt(value, 10) > items) {
            value = String(items);
        }

        this.setState({pageNum: value});
    }

    renderNormal() {
        let {activePage, items, maxButtons, onPageChange, classnames: cx, showPageInput} = this.props;
        const pageNum = this.state.pageNum;

        let pageButtons: any = [];
        let startPage: number;
        let endPage: number;

        if (activePage < (maxButtons - 1) / 2 + 2) {
            maxButtons = activePage + (maxButtons - 1) / 2;
        }

        if (items - activePage < (maxButtons - 1) / 2 + 2) {
            maxButtons = items - activePage + (maxButtons - 1) / 2 + 1;
        }

        if (maxButtons && maxButtons < items) {
            startPage = Math.max(Math.min(activePage - Math.floor(maxButtons / 2), items - maxButtons + 1), 1);
            endPage = startPage + maxButtons - 1;
        } else {
            startPage = 1;
            endPage = items;
        }

        for (let page = startPage; page <= endPage; ++page) {
            pageButtons.push(
                <li
                    onClick={() => onPageChange(page)}
                    key={page}
                    className={cx({
                        active: page === activePage,
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
                        active: 1 === activePage,
                    })}
                >
                    <a role="button">{1}</a>
                </li>
            );
        }

        if (endPage < items) {
            if (items - endPage > 1) {
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
                    onClick={() => onPageChange(items)}
                    key={items}
                    className={cx({
                        active: items === activePage,
                    })}
                >
                    <a role="button">{items}</a>
                </li>
            );
        }

        pageButtons.unshift(
            <li
                className={cx('Pagination-prev', {
                    disabled: activePage === 1,
                })}
                onClick={activePage === 1 ? (e: any) => e.preventDefault() : () => onPageChange(activePage - 1)}
                key="prev"
            >
                <span />
            </li>
        );

        pageButtons.push(
            <li
                className={cx('Pagination-next', {
                    disabled: activePage === items,
                })}
                onClick={activePage === items ? (e: any) => e.preventDefault() : () => onPageChange(activePage + 1)}
                key="next"
            >
                <span />
            </li>
        );

        return (
            <div>
                <ul className={cx('Pagination', 'Pagination--sm')}>
                    {pageButtons}
                </ul>

                {items > 9 && showPageInput ? (
                    <div className="inline m-l-xs w-xs" key="toPage">
                        <span className={cx('Pagination-inputGroup')}>
                            <input
                                type="text"
                                className={cx('Pagination-input')}
                                onChange={this.handlePageChange}
                                onFocus={(e: any) => e.currentTarget.select()}
                                onKeyUp={(e: any) =>
                                    e.keyCode == 13 && onPageChange(parseInt(e.currentTarget.value, 10))
                                }
                                value={pageNum}
                            />
                            <span>
                                <button
                                    onClick={() => onPageChange(parseInt(pageNum, 10))}
                                    type="submit"
                                    className={cx('Button', 'Button--default')}
                                >
                                    Go
                                </button>
                            </span>
                        </span>
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
    test: /(^|\/)pagination$/,
    name: 'pagination',
})
export class PaginationRenderer extends Pagination {}
