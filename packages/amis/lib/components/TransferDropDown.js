"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransferDropDown = void 0;
var tslib_1 = require("tslib");
var locale_1 = require("../locale");
var theme_1 = require("../theme");
var Transfer_1 = require("./Transfer");
var uncontrollable_1 = require("uncontrollable");
var react_1 = (0, tslib_1.__importDefault)(require("react"));
var ResultBox_1 = (0, tslib_1.__importDefault)(require("./ResultBox"));
var icons_1 = require("./icons");
var InputBox_1 = (0, tslib_1.__importDefault)(require("./InputBox"));
var PopOverContainer_1 = (0, tslib_1.__importDefault)(require("./PopOverContainer"));
var helper_1 = require("../utils/helper");
var TransferDropDown = /** @class */ (function (_super) {
    (0, tslib_1.__extends)(TransferDropDown, _super);
    function TransferDropDown() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    TransferDropDown.prototype.render = function () {
        var _this = this;
        var _a = this.props, cx = _a.classnames, value = _a.value, itemRender = _a.itemRender, __ = _a.translate, disabled = _a.disabled, clearable = _a.clearable, className = _a.className, onChange = _a.onChange, onSearch = _a.onSearch, multiple = _a.multiple, borderMode = _a.borderMode, useMobileUI = _a.useMobileUI, popOverContainer = _a.popOverContainer;
        var _b = this.state, inputValue = _b.inputValue, searchResult = _b.searchResult;
        var mobileUI = useMobileUI && (0, helper_1.isMobile)();
        return (react_1.default.createElement(PopOverContainer_1.default, { useMobileUI: useMobileUI, popOverContainer: popOverContainer, popOverClassName: cx('TransferDropDown-popover'), popOverRender: function (_a) {
                var onClose = _a.onClose;
                return (react_1.default.createElement("div", { className: cx('TransferDropDown-content', {
                        'is-mobile': mobileUI
                    }) },
                    onSearch ? (react_1.default.createElement("div", { className: cx('Transfer-search') },
                        react_1.default.createElement(InputBox_1.default, { value: inputValue, onChange: _this.handleSearch, placeholder: __('Transfer.searchKeyword'), clearable: false, onKeyDown: _this.handleSearchKeyDown }, searchResult !== null ? (react_1.default.createElement("a", { onClick: _this.handleSeachCancel },
                            react_1.default.createElement(icons_1.Icon, { icon: "close", className: "icon" }))) : (react_1.default.createElement(icons_1.Icon, { icon: "search", className: "icon" }))))) : null,
                    searchResult !== null
                        ? _this.renderSearchResult((0, tslib_1.__assign)((0, tslib_1.__assign)({}, _this.props), { value: value, onChange: multiple
                                ? onChange
                                : function (value) {
                                    onClose();
                                    onChange === null || onChange === void 0 ? void 0 : onChange(value);
                                }, multiple: multiple }))
                        : _this.renderOptions((0, tslib_1.__assign)((0, tslib_1.__assign)({}, _this.props), { value: value, onChange: multiple
                                ? onChange
                                : function (value) {
                                    onClose();
                                    onChange === null || onChange === void 0 ? void 0 : onChange(value);
                                }, multiple: multiple }))));
            } }, function (_a) {
            var onClick = _a.onClick, isOpened = _a.isOpened, ref = _a.ref;
            return (react_1.default.createElement(ResultBox_1.default, { className: cx('TransferDropDown', className, isOpened ? 'is-active' : ''), borderMode: borderMode, allowInput: false, result: multiple ? value : (value === null || value === void 0 ? void 0 : value[0]) ? value === null || value === void 0 ? void 0 : value[0] : null, onResultChange: onChange, onResultClick: onClick, placeholder: __('Select.placeholder'), disabled: disabled, clearable: clearable, ref: ref, itemRender: itemRender, useMobileUI: useMobileUI }, !mobileUI ? (react_1.default.createElement("span", { className: cx('TransferDropDown-icon') },
                react_1.default.createElement(icons_1.Icon, { icon: "caret", className: "icon" }))) : (react_1.default.createElement(react_1.default.Fragment, null))));
        }));
    };
    return TransferDropDown;
}(Transfer_1.Transfer));
exports.TransferDropDown = TransferDropDown;
exports.default = (0, theme_1.themeable)((0, locale_1.localeable)((0, uncontrollable_1.uncontrollable)(TransferDropDown, {
    value: 'onChange'
})));
//# sourceMappingURL=./components/TransferDropDown.js.map
