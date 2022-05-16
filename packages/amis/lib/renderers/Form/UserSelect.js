"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserSelectControlRenderer = void 0;
var tslib_1 = require("tslib");
var react_1 = (0, tslib_1.__importDefault)(require("react"));
var classnames_1 = (0, tslib_1.__importDefault)(require("classnames"));
var Options_1 = require("./Options");
var UserSelect_1 = (0, tslib_1.__importDefault)(require("../../components/UserSelect"));
var UserTabSelect_1 = (0, tslib_1.__importDefault)(require("../../components/UserTabSelect"));
var api_1 = require("../../utils/api");
var find_1 = (0, tslib_1.__importDefault)(require("lodash/find"));
var helper_1 = require("../../utils/helper");
var types_1 = require("../../types");
var UserSelectControl = /** @class */ (function (_super) {
    (0, tslib_1.__extends)(UserSelectControl, _super);
    function UserSelectControl(props) {
        return _super.call(this, props) || this;
    }
    UserSelectControl.prototype.componentWillUnmount = function () {
        this.unHook && this.unHook();
    };
    UserSelectControl.prototype.onSearch = function (input, cancelExecutor, param) {
        return (0, tslib_1.__awaiter)(this, void 0, void 0, function () {
            var _a, searchApi, setLoading, env, searchTerm, searchObj, ctx, ret, options;
            var _b;
            return (0, tslib_1.__generator)(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        _a = this.props, searchApi = _a.searchApi, setLoading = _a.setLoading, env = _a.env;
                        searchApi = (param === null || param === void 0 ? void 0 : param.searchApi) || searchApi;
                        searchTerm = (param === null || param === void 0 ? void 0 : param.searchTerm) || this.props.searchTerm || 'term';
                        searchObj = (param === null || param === void 0 ? void 0 : param.searchParam) || this.props.searchParam || {};
                        ctx = (0, tslib_1.__assign)((_b = {}, _b[searchTerm] = input, _b), searchObj);
                        if (!(0, api_1.isEffectiveApi)(searchApi, ctx)) {
                            return [2 /*return*/, Promise.resolve([])];
                        }
                        setLoading(true);
                        _c.label = 1;
                    case 1:
                        _c.trys.push([1, , 3, 4]);
                        return [4 /*yield*/, env.fetcher(searchApi, ctx, {
                                cancelExecutor: cancelExecutor,
                                autoAppend: true
                            })];
                    case 2:
                        ret = _c.sent();
                        options = (ret.data && ret.data.options) || ret.data || [];
                        return [2 /*return*/, options];
                    case 3:
                        setLoading(false);
                        return [7 /*endfinally*/];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    UserSelectControl.prototype.deferLoad = function (data, isRef, param) {
        return (0, tslib_1.__awaiter)(this, void 0, void 0, function () {
            var _a, env, deferApi, setLoading, formInited, addHook, ctx, ret, options;
            return (0, tslib_1.__generator)(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = this.props, env = _a.env, deferApi = _a.deferApi, setLoading = _a.setLoading, formInited = _a.formInited, addHook = _a.addHook;
                        deferApi = (param === null || param === void 0 ? void 0 : param.deferApi) || deferApi;
                        if (!env || !env.fetcher) {
                            throw new Error('fetcher is required');
                        }
                        ctx = (0, helper_1.createObject)(data, {});
                        if (!(0, api_1.isEffectiveApi)(deferApi, ctx)) {
                            return [2 /*return*/, Promise.resolve([])];
                        }
                        _b.label = 1;
                    case 1:
                        _b.trys.push([1, , 3, 4]);
                        return [4 /*yield*/, env.fetcher(deferApi, ctx)];
                    case 2:
                        ret = _b.sent();
                        options = (ret.data && ret.data.options) || ret.data || [];
                        if (isRef) {
                            options.forEach(function (option) {
                                option.isRef = true;
                            });
                        }
                        return [2 /*return*/, options];
                    case 3:
                        setLoading(false);
                        return [7 /*endfinally*/];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    UserSelectControl.prototype.changeValue = function (value) {
        return (0, tslib_1.__awaiter)(this, void 0, void 0, function () {
            var _a, joinValues, extractValue, delimiter, multiple, valueField, onChange, options, setOptions, data, dispatchEvent, newValue, additonalOptions, rendererEvent;
            return (0, tslib_1.__generator)(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = this.props, joinValues = _a.joinValues, extractValue = _a.extractValue, delimiter = _a.delimiter, multiple = _a.multiple, valueField = _a.valueField, onChange = _a.onChange, options = _a.options, setOptions = _a.setOptions, data = _a.data, dispatchEvent = _a.dispatchEvent;
                        newValue = value;
                        additonalOptions = [];
                        (Array.isArray(value) ? value : value ? [value] : []).forEach(function (option) {
                            var resolved = (0, find_1.default)(options, function (item) {
                                return item[valueField || 'value'] == option[valueField || 'value'];
                            });
                            resolved || additonalOptions.push(option);
                        });
                        if (joinValues) {
                            if (multiple) {
                                newValue = Array.isArray(value)
                                    ? value
                                        .map(function (item) { return item[valueField || 'value']; })
                                        .join(delimiter)
                                    : value
                                        ? value[valueField || 'value']
                                        : '';
                            }
                            else {
                                newValue = newValue ? newValue[valueField || 'value'] : '';
                            }
                        }
                        else if (extractValue) {
                            if (multiple) {
                                newValue = Array.isArray(value)
                                    ? value.map(function (item) { return item[valueField || 'value']; })
                                    : value
                                        ? [value[valueField || 'value']]
                                        : [];
                            }
                            else {
                                newValue = newValue ? newValue[valueField || 'value'] : '';
                            }
                        }
                        return [4 /*yield*/, dispatchEvent('change', (0, helper_1.createObject)(data, {
                                value: newValue,
                                options: options
                            }))];
                    case 1:
                        rendererEvent = _b.sent();
                        if (rendererEvent === null || rendererEvent === void 0 ? void 0 : rendererEvent.prevented) {
                            return [2 /*return*/];
                        }
                        onChange(newValue);
                        return [2 /*return*/];
                }
            });
        });
    };
    UserSelectControl.prototype.render = function () {
        var _this = this;
        var _a = this.props, showNav = _a.showNav, navTitle = _a.navTitle, searchable = _a.searchable, options = _a.options, className = _a.className, selectedOptions = _a.selectedOptions, tabOptions = _a.tabOptions, multi = _a.multi, multiple = _a.multiple, isDep = _a.isDep, isRef = _a.isRef, placeholder = _a.placeholder, searchPlaceholder = _a.searchPlaceholder, tabMode = _a.tabMode, data = _a.data;
        tabOptions === null || tabOptions === void 0 ? void 0 : tabOptions.forEach(function (item) {
            item.deferLoad = _this.deferLoad;
            item.onChange = _this.changeValue;
            item.onSearch = _this.onSearch;
        });
        return (react_1.default.createElement("div", { className: (0, classnames_1.default)("UserSelectControl", className) }, tabMode ? (react_1.default.createElement(UserTabSelect_1.default, { selection: selectedOptions, tabOptions: tabOptions, multiple: multiple, onChange: this.changeValue, onSearch: this.onSearch, deferLoad: this.deferLoad, data: data })) : (react_1.default.createElement(UserSelect_1.default, { showNav: showNav, navTitle: navTitle, selection: selectedOptions, options: options, multi: multi, multiple: multiple, searchable: searchable, placeholder: placeholder, searchPlaceholder: searchPlaceholder, deferLoad: this.deferLoad, onChange: this.changeValue, onSearch: this.onSearch, isDep: isDep, isRef: isRef }))));
    };
    var _a, _b, _c, _d, _e, _f;
    UserSelectControl.defaultProps = {
        showNav: true
    };
    (0, tslib_1.__decorate)([
        helper_1.autobind,
        (0, tslib_1.__metadata)("design:type", Function),
        (0, tslib_1.__metadata)("design:paramtypes", [String, typeof (_a = typeof Function !== "undefined" && Function) === "function" ? _a : Object, typeof (_b = typeof types_1.PlainObject !== "undefined" && types_1.PlainObject) === "function" ? _b : Object]),
        (0, tslib_1.__metadata)("design:returntype", Promise)
    ], UserSelectControl.prototype, "onSearch", null);
    (0, tslib_1.__decorate)([
        helper_1.autobind,
        (0, tslib_1.__metadata)("design:type", Function),
        (0, tslib_1.__metadata)("design:paramtypes", [typeof (_c = typeof Object !== "undefined" && Object) === "function" ? _c : Object, Boolean, typeof (_d = typeof types_1.PlainObject !== "undefined" && types_1.PlainObject) === "function" ? _d : Object]),
        (0, tslib_1.__metadata)("design:returntype", Promise)
    ], UserSelectControl.prototype, "deferLoad", null);
    (0, tslib_1.__decorate)([
        helper_1.autobind,
        (0, tslib_1.__metadata)("design:type", Function),
        (0, tslib_1.__metadata)("design:paramtypes", [Object]),
        (0, tslib_1.__metadata)("design:returntype", Promise)
    ], UserSelectControl.prototype, "changeValue", null);
    return UserSelectControl;
}(react_1.default.Component));
exports.default = UserSelectControl;
var UserSelectControlRenderer = /** @class */ (function (_super) {
    (0, tslib_1.__extends)(UserSelectControlRenderer, _super);
    function UserSelectControlRenderer() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    UserSelectControlRenderer = (0, tslib_1.__decorate)([
        (0, Options_1.OptionsControl)({
            type: 'users-select'
        })
    ], UserSelectControlRenderer);
    return UserSelectControlRenderer;
}(UserSelectControl));
exports.UserSelectControlRenderer = UserSelectControlRenderer;
//# sourceMappingURL=./renderers/Form/UserSelect.js.map
