"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Pagination = exports.PaginationWidget = void 0;
var tslib_1 = require("tslib");
/*
 * @Description: Pagination分页组件
 * @Author: wangfeilong02@baidu.com
 * @Date: 2021-11-01 16:57:38
 */
var react_1 = (0, tslib_1.__importDefault)(require("react"));
var locale_1 = require("../locale");
var theme_1 = require("../theme");
var helper_1 = require("../utils/helper");
var icons_1 = require("./icons");
var Select_1 = (0, tslib_1.__importDefault)(require("./Select"));
var PaginationWidget;
(function (PaginationWidget) {
    PaginationWidget["Pager"] = "pager";
    PaginationWidget["PerPage"] = "perpage";
    PaginationWidget["Total"] = "total";
    PaginationWidget["Go"] = "go";
})(PaginationWidget = exports.PaginationWidget || (exports.PaginationWidget = {}));
var Pagination = /** @class */ (function (_super) {
    (0, tslib_1.__extends)(Pagination, _super);
    function Pagination(props) {
        var _this = _super.call(this, props) || this;
        _this.state = {
            pageNum: '',
            perPage: Number(_this.props.perPage)
        };
        _this.handlePageNumChange = _this.handlePageNumChange.bind(_this);
        _this.renderPageItem = _this.renderPageItem.bind(_this);
        _this.renderEllipsis = _this.renderEllipsis.bind(_this);
        _this.handlePageNums = _this.handlePageNums.bind(_this);
        return _this;
    }
    Pagination.prototype.handlePageNumChange = function (page, perPage) {
        var props = this.props;
        if (props.disabled) {
            return;
        }
        props.onPageChange && props.onPageChange(page, perPage);
    };
    /**
     * 渲染每个页码li
     *
     * @param page 页码
     */
    Pagination.prototype.renderPageItem = function (page) {
        var _this = this;
        var _a = this.props, cx = _a.classnames, activePage = _a.activePage;
        var perPage = this.state.perPage;
        return (react_1.default.createElement("li", { onClick: function () { return _this.handlePageNumChange(page, perPage); }, key: page, className: cx('Pagination-pager-item', {
                'is-active': page === activePage
            }) },
            react_1.default.createElement("a", { role: "button" }, page)));
    };
    /**
     * 渲染...
     *
     * @param key 类型 'prev-ellipsis' | 'next-ellipsis'
     * @param page 页码
     */
    Pagination.prototype.renderEllipsis = function (key) {
        var cx = this.props.classnames;
        return (react_1.default.createElement("li", { key: key, className: cx('ellipsis') },
            react_1.default.createElement("a", { role: "button" }, "...")));
    };
    /**
     * 渲染器事件方法装饰器
     *
     * @param cur 当前页数
     * @param counts 总共页码按钮数
     * @param min 最小页码
     * @param max 最大页码
     */
    Pagination.prototype.handlePageNums = function (cur, counts, min, max) {
        var pageButtons = [];
        if (counts === 0) {
            return pageButtons;
        }
        var step = 0;
        var page = cur;
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
    };
    Pagination.prototype.getLastPage = function () {
        var _a = this.props, total = _a.total, perPage = _a.perPage, lastPage = _a.lastPage, activePage = _a.activePage, hasNext = _a.hasNext;
        // 输入total，重新计算lastPage
        if (total || total === 0) {
            return Math.ceil(total / perPage);
        }
        if (lastPage) {
            return Number(lastPage);
        }
        if (hasNext) {
            return Number(activePage + 1);
        }
        return Number(activePage);
    };
    Pagination.prototype.handlePageChange = function (e) {
        var lastPage = this.getLastPage();
        var value = e.currentTarget.value;
        if (/^\d+$/.test(value) && parseInt(value, 10) > lastPage) {
            value = String(lastPage);
        }
        this.setState({ pageNum: value });
    };
    Pagination.prototype.render = function () {
        var _this = this;
        var _a = this.props, layout = _a.layout, maxButtons = _a.maxButtons, mode = _a.mode, activePage = _a.activePage, total = _a.total, showPerPage = _a.showPerPage, perPageAvailable = _a.perPageAvailable, cx = _a.classnames, showPageInput = _a.showPageInput, className = _a.className, disabled = _a.disabled, hasNext = _a.hasNext, __ = _a.translate;
        var _b = this.state, pageNum = _b.pageNum, perPage = _b.perPage;
        var lastPage = this.getLastPage();
        // 简易模式
        if (mode === 'simple') {
            return (react_1.default.createElement("div", { className: cx('Pagination-wrap', 'Pagination-simple', { disabled: disabled }, className) },
                react_1.default.createElement("ul", { key: "pager-items", className: cx('Pagination', 'Pagination--sm', 'Pagination-pager-items', 'Pagination-item') },
                    react_1.default.createElement("li", { className: cx('Pagination-prev', {
                            'is-disabled': activePage < 2
                        }), onClick: function (e) {
                            if (activePage < 2) {
                                return e.preventDefault();
                            }
                            return _this.handlePageNumChange(activePage - 1);
                        }, key: "prev" },
                        react_1.default.createElement("span", null,
                            react_1.default.createElement(icons_1.Icon, { icon: "left-arrow", className: "icon" }))),
                    react_1.default.createElement("li", { className: cx('Pagination-next', {
                            'is-disabled': !hasNext
                        }), onClick: function (e) {
                            if (!hasNext) {
                                return e.preventDefault();
                            }
                            return _this.handlePageNumChange(activePage + 1, perPage);
                        }, key: "next" },
                        react_1.default.createElement("span", null,
                            react_1.default.createElement(icons_1.Icon, { icon: "right-arrow", className: "icon" }))))));
        }
        var pageButtons = [];
        var layoutList = Array.isArray(layout)
            ? layout
            : typeof layout === 'string'
                ? layout.split(',')
                : [];
        /** 分页组件至少要包含页码 */
        if (!layoutList.includes(PaginationWidget.Pager)) {
            layoutList.unshift(PaginationWidget.Pager);
        }
        /** 统一使用小写格式，外部属性case insensitive */
        layoutList = layoutList.map(function (widget) { return widget.trim().toLowerCase(); });
        /** 兼容showPageInput属性，默认展示跳转页面 */
        if (showPageInput && !layoutList.includes(PaginationWidget.Go)) {
            layoutList.push(PaginationWidget.Go);
        }
        if (showPerPage && !layoutList.includes(PaginationWidget.PerPage)) {
            layoutList.unshift(PaginationWidget.PerPage);
        }
        // 页码全部显示 [1, 2, 3, 4]
        if (lastPage <= maxButtons) {
            pageButtons = this.handlePageNums(activePage, maxButtons, 1, Math.min(maxButtons, lastPage));
        }
        //当前为1234页时， [1, 2, 3, 4, 5, ... 12]
        else if (activePage <= maxButtons - 3) {
            pageButtons = this.handlePageNums(activePage, maxButtons - 2, 1, Math.min(maxButtons - 2, lastPage));
            pageButtons.push(this.renderEllipsis('next-ellipsis'));
            pageButtons.push(this.renderPageItem(lastPage));
        }
        // [1, ..., 5, 6, 7, 8, 9]
        else if (activePage > lastPage - (maxButtons - 3)) {
            var min = lastPage - (maxButtons - 3);
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
        pageButtons.unshift(react_1.default.createElement("li", { className: cx('Pagination-prev', {
                'is-disabled': activePage < 2
            }), onClick: function (e) {
                if (activePage < 2) {
                    return e.preventDefault();
                }
                return _this.handlePageNumChange(activePage - 1, perPage);
            }, key: "prev" },
            react_1.default.createElement("span", null,
                react_1.default.createElement(icons_1.Icon, { icon: "left-arrow", className: "icon" }))));
        pageButtons.push(react_1.default.createElement("li", { className: cx('Pagination-next', {
                'is-disabled': activePage === lastPage
            }), onClick: function (e) {
                if (activePage === lastPage) {
                    return e.preventDefault();
                }
                return _this.handlePageNumChange(activePage + 1, perPage);
            }, key: "next" },
            react_1.default.createElement("span", null,
                react_1.default.createElement(icons_1.Icon, { icon: "right-arrow", className: "icon" }))));
        var go = (react_1.default.createElement("div", { className: cx('Pagination-inputGroup Pagination-item'), key: "go" },
            react_1.default.createElement("span", { className: cx('Pagination-inputGroup-left'), key: "go-left" }, __('Pagination.goto')),
            react_1.default.createElement("input", { className: cx('Pagination-inputGroup-input'), key: "go-input", type: "text", disabled: disabled, onChange: this.handlePageChange, onFocus: function (e) { return e.currentTarget.select(); }, onKeyUp: function (e) {
                    var v = parseInt(e.currentTarget.value, 10);
                    if (!v || e.code != 'Enter') {
                        return;
                    }
                    _this.setState({ pageNum: '' });
                    _this.handlePageNumChange(v, perPage);
                }, value: pageNum }),
            react_1.default.createElement("span", { className: cx('Pagination-inputGroup-right'), key: "go-right", onClick: function (e) {
                    if (!pageNum) {
                        return;
                    }
                    _this.setState({ pageNum: '' });
                    _this.handlePageNumChange(+pageNum, perPage);
                } }, __('Pagination.go'))));
        var selection = perPageAvailable
            .filter(function (v) { return !!v; })
            .map(function (v) { return ({ label: __('Pagination.select', { count: v }), value: v }); });
        var perPageEle = (react_1.default.createElement(Select_1.default, { key: "perpage", className: cx('Pagination-perpage', 'Pagination-item'), overlayPlacement: "right-bottom-right-top", clearable: false, disabled: disabled, value: perPage, options: selection, onChange: function (p) {
                _this.setState({
                    perPage: p.value,
                    pageNum: ''
                });
                _this.handlePageNumChange(1, p.value);
            } }));
        // total或者lastpage不存在，不渲染总数
        var totalPage = !(total || lastPage) ? null : (react_1.default.createElement("div", { className: cx('Pagination-total Pagination-item'), key: "total" }, total || total === 0
            ? __('Pagination.totalCount', { total: total })
            : __('Pagination.totalPage', { lastPage: lastPage })));
        return (react_1.default.createElement("div", { className: cx('Pagination-wrap', { disabled: disabled }, className) }, layoutList.map(function (layoutItem) {
            if (layoutItem === PaginationWidget.Pager) {
                return (react_1.default.createElement("ul", { key: "pager-items", className: cx('Pagination', 'Pagination--sm', 'Pagination-item') }, pageButtons));
            }
            else if (layoutItem === PaginationWidget.Go) {
                return go;
            }
            else if (layoutItem === PaginationWidget.PerPage) {
                return perPageEle;
            }
            else if (layoutItem === PaginationWidget.Total) {
                return totalPage;
            }
            else {
                return null;
            }
        })));
    };
    var _a;
    Pagination.defaultProps = {
        layout: [PaginationWidget.Pager],
        maxButtons: 5,
        mode: 'normal',
        activePage: 1,
        perPage: 10,
        perPageAvailable: [10, 20, 50, 100]
    };
    (0, tslib_1.__decorate)([
        helper_1.autobind,
        (0, tslib_1.__metadata)("design:type", Function),
        (0, tslib_1.__metadata)("design:paramtypes", [typeof (_a = typeof react_1.default !== "undefined" && react_1.default.ChangeEvent) === "function" ? _a : Object]),
        (0, tslib_1.__metadata)("design:returntype", void 0)
    ], Pagination.prototype, "handlePageChange", null);
    return Pagination;
}(react_1.default.Component));
exports.Pagination = Pagination;
exports.default = (0, theme_1.themeable)((0, locale_1.localeable)(Pagination));
//# sourceMappingURL=./components/Pagination.js.map
