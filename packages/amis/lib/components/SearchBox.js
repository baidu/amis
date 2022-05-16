"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SearchBox = void 0;
var tslib_1 = require("tslib");
var react_1 = (0, tslib_1.__importDefault)(require("react"));
var theme_1 = require("../theme");
var icons_1 = require("./icons");
var uncontrollable_1 = require("uncontrollable");
var helper_1 = require("../utils/helper");
var locale_1 = require("../locale");
var debounce_1 = (0, tslib_1.__importDefault)(require("lodash/debounce"));
var SearchBox = /** @class */ (function (_super) {
    (0, tslib_1.__extends)(SearchBox, _super);
    function SearchBox() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.inputRef = react_1.default.createRef();
        _this.lazyEmitSearch = (0, debounce_1.default)(function () {
            var onSearch = _this.props.onSearch;
            onSearch === null || onSearch === void 0 ? void 0 : onSearch(_this.props.value || '');
        }, 250, {
            leading: false,
            trailing: true
        });
        return _this;
    }
    SearchBox.prototype.componentWillUnmount = function () {
        this.lazyEmitSearch.cancel();
    };
    SearchBox.prototype.handleActive = function () {
        var _a;
        var onActiveChange = this.props.onActiveChange;
        onActiveChange === null || onActiveChange === void 0 ? void 0 : onActiveChange(true);
        (_a = this.inputRef.current) === null || _a === void 0 ? void 0 : _a.focus();
    };
    SearchBox.prototype.handleCancel = function () {
        var _a = this.props, onActiveChange = _a.onActiveChange, onCancel = _a.onCancel, onChange = _a.onChange;
        onActiveChange === null || onActiveChange === void 0 ? void 0 : onActiveChange(false);
        onCancel === null || onCancel === void 0 ? void 0 : onCancel();
        onChange === null || onChange === void 0 ? void 0 : onChange('');
    };
    SearchBox.prototype.handleChange = function (e) {
        var _a = this.props, searchImediately = _a.searchImediately, onChange = _a.onChange;
        onChange === null || onChange === void 0 ? void 0 : onChange(e.currentTarget.value);
        searchImediately && this.lazyEmitSearch();
    };
    SearchBox.prototype.handleSearch = function () {
        var _a = this.props, onSearch = _a.onSearch, value = _a.value;
        onSearch === null || onSearch === void 0 ? void 0 : onSearch(value || '');
    };
    SearchBox.prototype.handleKeyDown = function (e) {
        if (e.key === 'Enter') {
            this.handleSearch();
            e.preventDefault();
        }
    };
    SearchBox.prototype.render = function () {
        var _a = this.props, cx = _a.classnames, active = _a.active, name = _a.name, className = _a.className, disabled = _a.disabled, placeholder = _a.placeholder, mini = _a.mini, value = _a.value, __ = _a.translate;
        return (react_1.default.createElement("div", { className: cx('SearchBox', className, disabled ? 'is-disabled' : '', !mini || active ? 'is-active' : '') },
            react_1.default.createElement("input", { name: name, disabled: disabled, onChange: this.handleChange, value: value || '', placeholder: __(placeholder || 'placeholder.enter'), ref: this.inputRef, autoComplete: "off", onKeyDown: this.handleKeyDown }),
            !mini ? (react_1.default.createElement("a", { className: cx('SearchBox-searchBtn'), onClick: this.handleSearch },
                react_1.default.createElement(icons_1.Icon, { icon: "search", className: "icon" }))) : active ? (react_1.default.createElement("a", { className: cx('SearchBox-cancelBtn'), onClick: this.handleCancel },
                react_1.default.createElement(icons_1.Icon, { icon: "close", className: "icon" }))) : (react_1.default.createElement("a", { className: cx('SearchBox-activeBtn'), onClick: this.handleActive },
                react_1.default.createElement(icons_1.Icon, { icon: "search", className: "icon" })))));
    };
    var _a, _b;
    SearchBox.defaultProps = {
        mini: true,
        searchImediately: true
    };
    (0, tslib_1.__decorate)([
        helper_1.autobind,
        (0, tslib_1.__metadata)("design:type", Function),
        (0, tslib_1.__metadata)("design:paramtypes", []),
        (0, tslib_1.__metadata)("design:returntype", void 0)
    ], SearchBox.prototype, "handleActive", null);
    (0, tslib_1.__decorate)([
        helper_1.autobind,
        (0, tslib_1.__metadata)("design:type", Function),
        (0, tslib_1.__metadata)("design:paramtypes", []),
        (0, tslib_1.__metadata)("design:returntype", void 0)
    ], SearchBox.prototype, "handleCancel", null);
    (0, tslib_1.__decorate)([
        helper_1.autobind,
        (0, tslib_1.__metadata)("design:type", Function),
        (0, tslib_1.__metadata)("design:paramtypes", [typeof (_a = typeof react_1.default !== "undefined" && react_1.default.ChangeEvent) === "function" ? _a : Object]),
        (0, tslib_1.__metadata)("design:returntype", void 0)
    ], SearchBox.prototype, "handleChange", null);
    (0, tslib_1.__decorate)([
        helper_1.autobind,
        (0, tslib_1.__metadata)("design:type", Function),
        (0, tslib_1.__metadata)("design:paramtypes", []),
        (0, tslib_1.__metadata)("design:returntype", void 0)
    ], SearchBox.prototype, "handleSearch", null);
    (0, tslib_1.__decorate)([
        helper_1.autobind,
        (0, tslib_1.__metadata)("design:type", Function),
        (0, tslib_1.__metadata)("design:paramtypes", [typeof (_b = typeof react_1.default !== "undefined" && react_1.default.KeyboardEvent) === "function" ? _b : Object]),
        (0, tslib_1.__metadata)("design:returntype", void 0)
    ], SearchBox.prototype, "handleKeyDown", null);
    return SearchBox;
}(react_1.default.Component));
exports.SearchBox = SearchBox;
exports.default = (0, theme_1.themeable)((0, locale_1.localeable)((0, uncontrollable_1.uncontrollable)(SearchBox, {
    active: 'onActiveChange',
    value: 'onChange'
})));
//# sourceMappingURL=./components/SearchBox.js.map
