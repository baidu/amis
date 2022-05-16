"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HeadCellSearchDropDown = void 0;
var tslib_1 = require("tslib");
var react_1 = (0, tslib_1.__importDefault)(require("react"));
var icons_1 = require("../../components/icons");
var Overlay_1 = (0, tslib_1.__importDefault)(require("../../components/Overlay"));
var react_dom_1 = require("react-dom");
var PopOver_1 = (0, tslib_1.__importDefault)(require("../../components/PopOver"));
var helper_1 = require("../../utils/helper");
var HeadCellSearchDropDown = /** @class */ (function (_super) {
    (0, tslib_1.__extends)(HeadCellSearchDropDown, _super);
    function HeadCellSearchDropDown(props) {
        var _this = _super.call(this, props) || this;
        _this.state = {
            isOpened: false
        };
        _this.formItems = [];
        _this.open = _this.open.bind(_this);
        _this.close = _this.close.bind(_this);
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
                name: 'orderDir',
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
                    item.name !== 'orderDir' &&
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
    HeadCellSearchDropDown.prototype.handleClickOutside = function () {
        this.close();
    };
    HeadCellSearchDropDown.prototype.open = function () {
        this.setState({
            isOpened: true
        });
    };
    HeadCellSearchDropDown.prototype.close = function () {
        this.setState({
            isOpened: false
        });
    };
    HeadCellSearchDropDown.prototype.handleAction = function (e, action, ctx) {
        var onAction = this.props.onAction;
        if (action.actionType === 'cancel' || action.actionType === 'close') {
            this.close();
            return;
        }
        if (action.actionType === 'reset') {
            this.close();
            this.handleReset();
            return;
        }
        onAction && onAction(e, action, ctx);
    };
    HeadCellSearchDropDown.prototype.handleReset = function () {
        var _a = this.props, onQuery = _a.onQuery, data = _a.data, name = _a.name;
        var values = (0, tslib_1.__assign)({}, data);
        this.formItems.forEach(function (key) { return (0, helper_1.setVariable)(values, key, undefined); });
        if (values.orderBy === name) {
            values.orderBy = '';
            values.orderDir = 'asc';
        }
        onQuery(values);
    };
    HeadCellSearchDropDown.prototype.handleSubmit = function (values) {
        var _a = this.props, onQuery = _a.onQuery, name = _a.name;
        this.close();
        if (values.orderDir) {
            values = (0, tslib_1.__assign)((0, tslib_1.__assign)({}, values), { orderBy: name });
        }
        onQuery(values);
    };
    HeadCellSearchDropDown.prototype.isActive = function () {
        var _a = this.props, data = _a.data, name = _a.name, orderBy = _a.orderBy;
        return orderBy === name || this.formItems.some(function (key) { return data === null || data === void 0 ? void 0 : data[key]; });
    };
    HeadCellSearchDropDown.prototype.render = function () {
        var _this = this;
        var _a = this.props, render = _a.render, name = _a.name, data = _a.data, searchable = _a.searchable, store = _a.store, orderBy = _a.orderBy, popOverContainer = _a.popOverContainer, ns = _a.classPrefix, cx = _a.classnames;
        var formSchema = this.buildSchema();
        var isActive = this.isActive();
        return (react_1.default.createElement("span", { className: cx("".concat(ns, "TableCell-searchBtn"), isActive ? 'is-active' : '') },
            react_1.default.createElement("span", { onClick: this.open },
                react_1.default.createElement(icons_1.Icon, { icon: "search", className: "icon" })),
            this.state.isOpened ? (react_1.default.createElement(Overlay_1.default, { container: popOverContainer || (function () { return (0, react_dom_1.findDOMNode)(_this); }), placement: "left-bottom-left-top right-bottom-right-top", target: popOverContainer ? function () { return (0, react_dom_1.findDOMNode)(_this).parentNode; } : null, show: true },
                react_1.default.createElement(PopOver_1.default, { classPrefix: ns, onHide: this.close, className: cx("".concat(ns, "TableCell-searchPopOver"), searchable.className), overlay: true }, render('quick-search-form', formSchema, {
                    data: (0, tslib_1.__assign)((0, tslib_1.__assign)({}, data), { orderBy: orderBy, orderDir: orderBy === name ? store.orderDir : '' }),
                    onSubmit: this.handleSubmit,
                    onAction: this.handleAction
                })))) : null));
    };
    return HeadCellSearchDropDown;
}(react_1.default.Component));
exports.HeadCellSearchDropDown = HeadCellSearchDropDown;
//# sourceMappingURL=./renderers/Table/HeadCellSearchDropdown.js.map
