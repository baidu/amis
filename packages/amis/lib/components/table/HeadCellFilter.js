"use strict";
/**
 * @file table/HeadCellFilter
 * @author fex
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.HeadCellFilter = void 0;
var tslib_1 = require("tslib");
var react_1 = (0, tslib_1.__importDefault)(require("react"));
var react_dom_1 = require("react-dom");
var isEqual_1 = (0, tslib_1.__importDefault)(require("lodash/isEqual"));
var theme_1 = require("../../theme");
var locale_1 = require("../../locale");
var HeadCellDropDown_1 = (0, tslib_1.__importDefault)(require("./HeadCellDropDown"));
var Checkbox_1 = (0, tslib_1.__importDefault)(require("../Checkbox"));
var Button_1 = (0, tslib_1.__importDefault)(require("../Button"));
var icons_1 = require("../icons");
var HeadCellFilter = /** @class */ (function (_super) {
    (0, tslib_1.__extends)(HeadCellFilter, _super);
    function HeadCellFilter(props) {
        var _this = _super.call(this, props) || this;
        _this.state = {
            options: [],
            filteredValue: props.filteredValue || []
        };
        return _this;
    }
    HeadCellFilter.prototype.alterOptions = function (options) {
        var _this = this;
        options = options.map(function (option) { return ((0, tslib_1.__assign)((0, tslib_1.__assign)({}, option), { selected: _this.state.filteredValue.indexOf(option.value) > -1 })); });
        return options;
    };
    HeadCellFilter.prototype.componentDidMount = function () {
        var column = this.props.column;
        if (column.filters && column.filters.length > 0) {
            this.setState({ options: this.alterOptions(column.filters) });
        }
    };
    HeadCellFilter.prototype.componentDidUpdate = function (prevProps, prevState) {
        var column = this.props.column;
        if (column.filters &&
            column.filters.length > 0 &&
            !(0, isEqual_1.default)(prevState.filteredValue, this.state.filteredValue)) {
            this.setState({ options: this.alterOptions(column.filters) });
        }
    };
    HeadCellFilter.prototype.render = function () {
        var _this = this;
        var options = this.state.options;
        var _a = this.props, column = _a.column, popOverContainer = _a.popOverContainer, cx = _a.classnames, ns = _a.classPrefix;
        var filterProps = {
            filterDropdown: function (payload) {
                var setSelectedKeys = payload.setSelectedKeys, selectedKeys = payload.selectedKeys, confirm = payload.confirm, clearFilters = payload.clearFilters;
                return options && options.length > 0 ? (react_1.default.createElement("ul", { className: cx('DropDown-menu') },
                    !column.filterMultiple
                        ? options.map(function (option, index) { return (react_1.default.createElement("li", { key: index, className: cx({
                                'is-active': option.selected
                            }), onClick: function () {
                                return _this.handleClick(confirm, setSelectedKeys, [option.value]);
                            } }, option.text)); })
                        : options.map(function (option, index) { return (react_1.default.createElement("li", { key: index },
                            react_1.default.createElement(Checkbox_1.default, { classPrefix: ns, onChange: function (e) {
                                    return _this.handleCheck(confirm, setSelectedKeys, e ? [option.value] : option.value);
                                }, checked: option.selected }, option.text))); }),
                    column.filterMultiple ? (react_1.default.createElement("li", { key: "dropDown-multiple-menu", className: cx('DropDown-multiple-menu') },
                        react_1.default.createElement(Button_1.default, { size: 'xs', level: 'primary', onClick: function () { return _this.handleConfirmClick(confirm); } }, "\u786E\u5B9A"),
                        react_1.default.createElement(Button_1.default, { size: 'xs', onClick: function () {
                                return _this.handleCancelClick(confirm, setSelectedKeys);
                            } }, "\u53D6\u6D88"))) : null)) : null;
            },
            setSelectedKeys: function (keys) {
                return _this.setState({ filteredValue: keys });
            }
        };
        return (react_1.default.createElement(HeadCellDropDown_1.default, (0, tslib_1.__assign)({ className: "".concat(ns, "TableCell-filterBtn"), layerClassName: "".concat(ns, "TableCell-filterPopOver"), filterIcon: react_1.default.createElement(icons_1.Icon, { icon: "column-filter", className: "icon" }), active: column.filtered ||
                (options && options.some(function (item) { return item.selected; })), popOverContainer: popOverContainer ? popOverContainer : function () { return (0, react_dom_1.findDOMNode)(_this); }, selectedKeys: this.state.filteredValue }, filterProps)));
    };
    HeadCellFilter.prototype.handleClick = function (confirm, setSelectedKeys, selectedKeys) {
        return (0, tslib_1.__awaiter)(this, void 0, void 0, function () {
            var _a, onFilter, column, payload, prevented;
            var _b;
            return (0, tslib_1.__generator)(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        _a = this.props, onFilter = _a.onFilter, column = _a.column;
                        payload = (_b = {}, _b[column.key] = selectedKeys, _b);
                        if (!onFilter) return [3 /*break*/, 2];
                        return [4 /*yield*/, onFilter(payload)];
                    case 1:
                        prevented = _c.sent();
                        if (prevented) {
                            return [2 /*return*/];
                        }
                        _c.label = 2;
                    case 2:
                        setSelectedKeys && setSelectedKeys(selectedKeys);
                        onFilter && onFilter(payload);
                        confirm();
                        return [2 /*return*/];
                }
            });
        });
    };
    HeadCellFilter.prototype.handleCheck = function (confirm, setSelectedKeys, selectedKeys) {
        var filteredValue = this.state.filteredValue;
        // 选中
        if (Array.isArray(selectedKeys)) {
            setSelectedKeys && setSelectedKeys((0, tslib_1.__spreadArray)((0, tslib_1.__spreadArray)([], filteredValue, true), selectedKeys, true));
        }
        else {
            // 取消选中
            setSelectedKeys &&
                setSelectedKeys(filteredValue.filter(function (v) { return v !== selectedKeys; }));
        }
    };
    HeadCellFilter.prototype.handleConfirmClick = function (confirm) {
        var _a;
        var _b = this.props, onFilter = _b.onFilter, column = _b.column;
        onFilter && onFilter((_a = {}, _a[column.key] = this.state.filteredValue, _a));
        confirm();
    };
    HeadCellFilter.prototype.handleCancelClick = function (confirm, setSelectedKeys) {
        setSelectedKeys && setSelectedKeys([]);
        confirm();
    };
    HeadCellFilter.defaultProps = {
        filteredValue: [],
        filterMultiple: false
    };
    return HeadCellFilter;
}(react_1.default.Component));
exports.HeadCellFilter = HeadCellFilter;
exports.default = (0, theme_1.themeable)((0, locale_1.localeable)(HeadCellFilter));
//# sourceMappingURL=./components/table/HeadCellFilter.js.map
