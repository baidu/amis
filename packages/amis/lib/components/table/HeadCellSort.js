"use strict";
/**
 * @file table/HeadCellSort
 * @author fex
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.HeadCellSort = void 0;
var tslib_1 = require("tslib");
var react_1 = (0, tslib_1.__importDefault)(require("react"));
var theme_1 = require("../../theme");
var locale_1 = require("../../locale");
var icons_1 = require("../icons");
var HeadCellSort = /** @class */ (function (_super) {
    (0, tslib_1.__extends)(HeadCellSort, _super);
    function HeadCellSort(props) {
        var _this = _super.call(this, props) || this;
        _this.state = {
            order: '',
            orderBy: ''
        };
        return _this;
    }
    HeadCellSort.prototype.render = function () {
        var _this = this;
        var _a = this.props, column = _a.column, onSort = _a.onSort, cx = _a.classnames;
        return (react_1.default.createElement("span", { className: cx('TableCell-sortBtn'), onClick: function () { return (0, tslib_1.__awaiter)(_this, void 0, void 0, function () {
                var sortPayload, prevented;
                return (0, tslib_1.__generator)(this, function (_a) {
                    sortPayload = {};
                    if (column.key === this.state.orderBy) {
                        if (this.state.order === 'descend') {
                            // 降序改为取消
                            sortPayload = { orderBy: '', order: 'ascend' };
                        }
                        else {
                            // 升序之后降序
                            sortPayload = { order: 'descend' };
                        }
                    }
                    else {
                        // 默认先升序
                        sortPayload = { orderBy: column.key, order: 'ascend' };
                    }
                    if (onSort) {
                        prevented = onSort({
                            orderBy: this.state.orderBy,
                            order: this.state.order
                        });
                        if (prevented) {
                            return [2 /*return*/];
                        }
                    }
                    this.setState(sortPayload);
                    return [2 /*return*/];
                });
            }); } },
            react_1.default.createElement("i", { className: cx('TableCell-sortBtn--down', this.state.orderBy === column.key && this.state.order === 'descend'
                    ? 'is-active'
                    : '') },
                react_1.default.createElement(icons_1.Icon, { icon: "sort-desc", className: "icon" })),
            react_1.default.createElement("i", { className: cx('TableCell-sortBtn--up', this.state.orderBy === column.key && this.state.order === 'ascend'
                    ? 'is-active'
                    : '') },
                react_1.default.createElement(icons_1.Icon, { icon: "sort-asc", className: "icon" })),
            react_1.default.createElement("i", { className: cx('TableCell-sortBtn--default', this.state.orderBy === column.key ? '' : 'is-active') },
                react_1.default.createElement(icons_1.Icon, { icon: "sort-default", className: "icon" }))));
    };
    return HeadCellSort;
}(react_1.default.Component));
exports.HeadCellSort = HeadCellSort;
exports.default = (0, theme_1.themeable)((0, locale_1.localeable)(HeadCellSort));
//# sourceMappingURL=./components/table/HeadCellSort.js.map
