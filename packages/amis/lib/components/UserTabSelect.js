"use strict";
/**
 * @file 移动端人员、部门、角色、岗位选择
 * @author fex
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserTabSelect = void 0;
var tslib_1 = require("tslib");
var react_1 = (0, tslib_1.__importDefault)(require("react"));
var theme_1 = require("../theme");
var locale_1 = require("../locale");
var components_1 = require("../components");
var UserSelect_1 = (0, tslib_1.__importDefault)(require("./UserSelect"));
var PopUp_1 = (0, tslib_1.__importDefault)(require("../components/PopUp"));
var icons_1 = require("../components/icons");
var helper_1 = require("../utils/helper");
var Tabs_1 = tslib_1.__importStar(require("./Tabs"));
var tpl_builtin_1 = require("../utils/tpl-builtin");
var UserTabSelect = /** @class */ (function (_super) {
    (0, tslib_1.__extends)(UserTabSelect, _super);
    function UserTabSelect(props) {
        var _this = _super.call(this, props) || this;
        _this.unmounted = false;
        _this.state = {
            isOpened: false,
            isSelectOpened: false,
            inputValue: '',
            options: [],
            breadList: [],
            searchList: [],
            tempSelection: [],
            selection: props.selection ? props.selection : [],
            isSearch: false,
            searchLoading: false,
            isEdit: false,
            activeKey: 0
        };
        return _this;
    }
    UserTabSelect.prototype.componentDidMount = function () { };
    UserTabSelect.prototype.componentDidUpdate = function (prevProps) { };
    UserTabSelect.prototype.componentWillUnmount = function () {
        this.unmounted = true;
    };
    UserTabSelect.prototype.onClose = function () {
        this.setState({
            isOpened: false,
            isSearch: false,
            inputValue: '',
            searchList: [],
            searchLoading: false,
            activeKey: 0
        });
    };
    UserTabSelect.prototype.onOpen = function () {
        var selection = this.state.selection;
        this.setState({
            isOpened: true,
            tempSelection: selection.slice()
        });
    };
    UserTabSelect.prototype.handleBack = function () {
        this.onClose();
        var onChange = this.props.onChange;
        onChange(this.state.selection);
    };
    UserTabSelect.prototype.handleSelectChange = function (option, isReplace) {
        var _a = this.props, multiple = _a.multiple, _b = _a.valueField, valueField = _b === void 0 ? 'value' : _b;
        var selection = this.state.selection.slice();
        var selectionVals = selection.map(function (option) { return option[valueField]; });
        if (isReplace && Array.isArray(option)) {
            selection = option.slice();
        }
        else if (!Array.isArray(option)) {
            var pos = selectionVals.indexOf(option[valueField]);
            if (pos !== -1) {
                selection.splice(selection.indexOf(option), 1);
            }
            else {
                if (multiple) {
                    selection.push(option);
                }
                else {
                    selection = [option];
                }
            }
        }
        this.setState({
            selection: selection
        });
        return false;
    };
    UserTabSelect.prototype.handleTabChange = function (key) {
        this.setState({
            activeKey: key
        });
    };
    UserTabSelect.prototype.render = function () {
        var _this = this;
        var _a = this.props, cx = _a.classnames, __ = _a.translate, onChange = _a.onChange, _b = _a.placeholder, placeholder = _b === void 0 ? '请选择' : _b, tabOptions = _a.tabOptions, onSearch = _a.onSearch, deferLoad = _a.deferLoad, data = _a.data;
        var _c = this.state, activeKey = _c.activeKey, isOpened = _c.isOpened, selection = _c.selection;
        return (react_1.default.createElement("div", { className: cx('UserTabSelect') },
            react_1.default.createElement(components_1.ResultBox, { className: cx('UserTabSelect-input', isOpened ? 'is-active' : ''), allowInput: false, result: selection, onResultChange: function (value) { return _this.handleSelectChange(value, true); }, onResultClick: this.onOpen, placeholder: placeholder, useMobileUI: true }),
            react_1.default.createElement(PopUp_1.default, { isShow: isOpened, className: cx("UserTabSelect-popup"), onHide: this.onClose, showClose: false },
                react_1.default.createElement("div", { className: cx('UserTabSelect-wrap') },
                    react_1.default.createElement("div", { className: cx('UserSelect-navbar') },
                        react_1.default.createElement("span", { className: "left-arrow-box", onClick: this.handleBack },
                            react_1.default.createElement(icons_1.Icon, { icon: "left-arrow", className: "icon" })),
                        react_1.default.createElement("div", { className: cx('UserSelect-navbar-title') }, "\u4EBA\u5458\u9009\u62E9")),
                    react_1.default.createElement(Tabs_1.default, { mode: "tiled", className: cx('UserTabSelect-tabs'), onSelect: this.handleTabChange, activeKey: activeKey }, tabOptions === null || tabOptions === void 0 ? void 0 : tabOptions.map(function (item, index) {
                        return (react_1.default.createElement(Tabs_1.Tab, (0, tslib_1.__assign)({}, _this.props, { eventKey: index, key: index, title: item.title, className: "TabsTransfer-tab" }),
                            react_1.default.createElement(UserSelect_1.default, (0, tslib_1.__assign)({ selection: selection, showResultBox: false }, item, { options: typeof item.options === 'string' && data
                                    ? (0, tpl_builtin_1.resolveVariableAndFilter)(item.options, data, '| raw')
                                    : item.options, multiple: true, controlled: true, onChange: _this.handleSelectChange, onSearch: function (input, cancelExecutor) {
                                    return item.searchable && onSearch
                                        ? onSearch(input, cancelExecutor, {
                                            searchApi: item.searchApi,
                                            searchParam: item.searchParam,
                                            searchTerm: item.searchTerm
                                        })
                                        : undefined;
                                }, deferLoad: function (data, isRef, param) {
                                    return deferLoad(data, isRef, (0, tslib_1.__assign)({ deferApi: item.deferApi }, (param || {})));
                                } }))));
                    }))))));
    };
    var _a, _b;
    UserTabSelect.defaultProps = {};
    (0, tslib_1.__decorate)([
        helper_1.autobind,
        (0, tslib_1.__metadata)("design:type", Function),
        (0, tslib_1.__metadata)("design:paramtypes", []),
        (0, tslib_1.__metadata)("design:returntype", void 0)
    ], UserTabSelect.prototype, "onClose", null);
    (0, tslib_1.__decorate)([
        helper_1.autobind,
        (0, tslib_1.__metadata)("design:type", Function),
        (0, tslib_1.__metadata)("design:paramtypes", []),
        (0, tslib_1.__metadata)("design:returntype", void 0)
    ], UserTabSelect.prototype, "onOpen", null);
    (0, tslib_1.__decorate)([
        helper_1.autobind,
        (0, tslib_1.__metadata)("design:type", Function),
        (0, tslib_1.__metadata)("design:paramtypes", []),
        (0, tslib_1.__metadata)("design:returntype", void 0)
    ], UserTabSelect.prototype, "handleBack", null);
    (0, tslib_1.__decorate)([
        helper_1.autobind,
        (0, tslib_1.__metadata)("design:type", Function),
        (0, tslib_1.__metadata)("design:paramtypes", [Object, Boolean]),
        (0, tslib_1.__metadata)("design:returntype", void 0)
    ], UserTabSelect.prototype, "handleSelectChange", null);
    (0, tslib_1.__decorate)([
        helper_1.autobind,
        (0, tslib_1.__metadata)("design:type", Function),
        (0, tslib_1.__metadata)("design:paramtypes", [Number]),
        (0, tslib_1.__metadata)("design:returntype", void 0)
    ], UserTabSelect.prototype, "handleTabChange", null);
    return UserTabSelect;
}(react_1.default.Component));
exports.UserTabSelect = UserTabSelect;
exports.default = (0, theme_1.themeable)((0, locale_1.localeable)(UserTabSelect));
//# sourceMappingURL=./components/UserTabSelect.js.map
