"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HeadCellSearchDropDown = void 0;
var tslib_1 = require("tslib");
var react_1 = (0, tslib_1.__importDefault)(require("react"));
var react_dom_1 = require("react-dom");
var icons_1 = require("../../components/icons");
var helper_1 = require("../../utils/helper");
var HeadCellDropDown_1 = (0, tslib_1.__importDefault)(require("../../components/table/HeadCellDropDown"));
var HeadCellSearchDropDown = /** @class */ (function (_super) {
    (0, tslib_1.__extends)(HeadCellSearchDropDown, _super);
    function HeadCellSearchDropDown(props) {
        var _this = _super.call(this, props) || this;
        _this.formItems = [];
        _this.handleSubmit = _this.handleSubmit.bind(_this);
        _this.handleAction = _this.handleAction.bind(_this);
        return _this;
    }
    HeadCellSearchDropDown.prototype.buildSchema = function () {
        var _a;
        var _b = this.props, searchable = _b.searchable, sortable = _b.sortable, name = _b.name, label = _b.label, __ = _b.translate;
        var schema;
        if (searchable === true) {
            schema = {
                title: '',
                controls: [
                    {
                        type: 'text',
                        name: name,
                        placeholder: label,
                        clearable: true
                    }
                ]
            };
        }
        else if (searchable) {
            if (searchable.controls || searchable.tabs || searchable.fieldSet) {
                schema = (0, tslib_1.__assign)((0, tslib_1.__assign)({ title: '' }, searchable), { controls: Array.isArray(searchable.controls)
                        ? searchable.controls.concat()
                        : undefined });
            }
            else {
                schema = {
                    title: '',
                    className: searchable.formClassName,
                    controls: [
                        (0, tslib_1.__assign)({ type: searchable.type || 'text', name: searchable.name || name, placeholder: label }, searchable)
                    ]
                };
            }
        }
        if (schema && schema.controls && sortable) {
            schema.controls.unshift({
                type: 'hidden',
                name: 'orderBy',
                value: name
            }, {
                type: 'button-group',
                name: 'order',
                label: __('sort'),
                options: [
                    {
                        label: __('asc'),
                        value: 'asc'
                    },
                    {
                        label: __('desc'),
                        value: 'desc'
                    }
                ]
            });
        }
        if (schema) {
            var formItems_1 = [];
            (_a = schema.controls) === null || _a === void 0 ? void 0 : _a.forEach(function (item) {
                return item.name &&
                    item.name !== 'orderBy' &&
                    item.name !== 'order' &&
                    formItems_1.push(item.name);
            });
            this.formItems = formItems_1;
            schema = (0, tslib_1.__assign)((0, tslib_1.__assign)({}, schema), { type: 'form', wrapperComponent: 'div', actions: [
                    {
                        type: 'button',
                        label: __('reset'),
                        actionType: 'clear-and-submit'
                    },
                    {
                        type: 'button',
                        label: __('cancel'),
                        actionType: 'cancel'
                    },
                    {
                        label: __('search'),
                        type: 'submit',
                        primary: true
                    }
                ] });
        }
        return schema || 'error';
    };
    HeadCellSearchDropDown.prototype.handleAction = function (e, action, ctx, confirm) {
        var onAction = this.props.onAction;
        if (action.actionType === 'cancel' || action.actionType === 'close') {
            confirm();
            return;
        }
        if (action.actionType === 'reset') {
            confirm();
            this.handleReset();
            return;
        }
        onAction && onAction(e, action, ctx);
    };
    HeadCellSearchDropDown.prototype.handleReset = function () {
        return (0, tslib_1.__awaiter)(this, void 0, void 0, function () {
            var _a, onSearch, data, name, store, dispatchEvent, values, rendererEvent;
            return (0, tslib_1.__generator)(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = this.props, onSearch = _a.onSearch, data = _a.data, name = _a.name, store = _a.store, dispatchEvent = _a.dispatchEvent;
                        values = (0, tslib_1.__assign)({}, data);
                        return [4 /*yield*/, dispatchEvent('columnSearch', (0, helper_1.createObject)(data, (0, tslib_1.__assign)({}, values)))];
                    case 1:
                        rendererEvent = _b.sent();
                        if (rendererEvent === null || rendererEvent === void 0 ? void 0 : rendererEvent.prevented) {
                            return [2 /*return*/];
                        }
                        this.formItems.forEach(function (key) { return (0, helper_1.setVariable)(values, key, undefined); });
                        if (values.orderBy === name) {
                            values.orderBy = '';
                            values.order = 'asc';
                        }
                        store.updateQuery(values);
                        onSearch && onSearch(values);
                        return [2 /*return*/];
                }
            });
        });
    };
    HeadCellSearchDropDown.prototype.handleSubmit = function (values, confirm) {
        return (0, tslib_1.__awaiter)(this, void 0, void 0, function () {
            var _a, onSearch, name, store, dispatchEvent, data, rendererEvent;
            return (0, tslib_1.__generator)(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = this.props, onSearch = _a.onSearch, name = _a.name, store = _a.store, dispatchEvent = _a.dispatchEvent, data = _a.data;
                        if (values.order) {
                            values = (0, tslib_1.__assign)((0, tslib_1.__assign)({}, values), { orderBy: name });
                        }
                        return [4 /*yield*/, dispatchEvent('columnSearch', (0, helper_1.createObject)(data, (0, tslib_1.__assign)({}, values)))];
                    case 1:
                        rendererEvent = _b.sent();
                        if (rendererEvent === null || rendererEvent === void 0 ? void 0 : rendererEvent.prevented) {
                            return [2 /*return*/];
                        }
                        store.updateQuery(values);
                        onSearch && onSearch(values);
                        confirm();
                        return [2 /*return*/];
                }
            });
        });
    };
    HeadCellSearchDropDown.prototype.isActive = function () {
        var _a = this.props, data = _a.data, name = _a.name, orderBy = _a.orderBy;
        return ((orderBy && orderBy === name) || this.formItems.some(function (key) { return data === null || data === void 0 ? void 0 : data[key]; }));
    };
    HeadCellSearchDropDown.prototype.render = function () {
        var _this = this;
        var _a = this.props, render = _a.render, name = _a.name, data = _a.data, searchable = _a.searchable, store = _a.store, orderBy = _a.orderBy, popOverContainer = _a.popOverContainer, ns = _a.classPrefix, cx = _a.classnames;
        var formSchema = this.buildSchema();
        var isActive = this.isActive();
        return (react_1.default.createElement(HeadCellDropDown_1.default, { className: "".concat(ns, "TableCell-searchBtn"), layerClassName: cx("".concat(ns, "TableCell-searchPopOver"), searchable.className), active: isActive, filterIcon: react_1.default.createElement(icons_1.Icon, { icon: "search", className: "icon" }), popOverContainer: popOverContainer ? popOverContainer : function () { return (0, react_dom_1.findDOMNode)(_this); }, filterDropdown: function (_a) {
                var setSelectedKeys = _a.setSelectedKeys, selectedKeys = _a.selectedKeys, confirm = _a.confirm, clearFilters = _a.clearFilters;
                return render('quick-search-form', formSchema, {
                    data: (0, tslib_1.__assign)((0, tslib_1.__assign)({}, data), { orderBy: orderBy, order: orderBy && orderBy === name ? store.order : '' }),
                    onSubmit: function (values) { return _this.handleSubmit(values, confirm); },
                    onAction: function (e, action, ctx) {
                        _this.handleAction(e, action, ctx, confirm);
                    }
                });
            } }));
    };
    return HeadCellSearchDropDown;
}(react_1.default.Component));
exports.HeadCellSearchDropDown = HeadCellSearchDropDown;
//# sourceMappingURL=./renderers/Table-v2/HeadCellSearchDropdown.js.map
