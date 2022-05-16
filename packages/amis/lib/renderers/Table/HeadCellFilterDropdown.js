"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HeadCellFilterDropDown = void 0;
var tslib_1 = require("tslib");
var react_1 = (0, tslib_1.__importDefault)(require("react"));
var api_1 = require("../../utils/api");
var icons_1 = require("../../components/icons");
var Overlay_1 = (0, tslib_1.__importDefault)(require("../../components/Overlay"));
var PopOver_1 = (0, tslib_1.__importDefault)(require("../../components/PopOver"));
var react_dom_1 = require("react-dom");
var Checkbox_1 = (0, tslib_1.__importDefault)(require("../../components/Checkbox"));
var xor_1 = (0, tslib_1.__importDefault)(require("lodash/xor"));
var Select_1 = require("../../components/Select");
var helper_1 = require("../../utils/helper");
var HeadCellFilterDropDown = /** @class */ (function (_super) {
    (0, tslib_1.__extends)(HeadCellFilterDropDown, _super);
    function HeadCellFilterDropDown(props) {
        var _this = _super.call(this, props) || this;
        _this.state = {
            isOpened: false,
            filterOptions: []
        };
        _this.sourceInvalid = false;
        _this.open = _this.open.bind(_this);
        _this.close = _this.close.bind(_this);
        _this.handleClick = _this.handleClick.bind(_this);
        _this.handleCheck = _this.handleCheck.bind(_this);
        return _this;
    }
    HeadCellFilterDropDown.prototype.componentDidMount = function () {
        var _a;
        var _b = this.props, filterable = _b.filterable, name = _b.name, store = _b.store;
        if (filterable.source) {
            this.fetchOptions();
        }
        else if (((_a = filterable.options) === null || _a === void 0 ? void 0 : _a.length) > 0) {
            this.setState({
                filterOptions: this.alterOptions(filterable.options)
            });
        }
    };
    HeadCellFilterDropDown.prototype.componentDidUpdate = function (prevProps, prevState) {
        var _a, _b, _c, _d;
        var name = this.props.name;
        var props = this.props;
        if (prevProps.name !== props.name ||
            prevProps.filterable !== props.filterable ||
            prevProps.data !== props.data) {
            if (props.filterable.source) {
                this.sourceInvalid = (0, api_1.isApiOutdated)(prevProps.filterable.source, props.filterable.source, prevProps.data, props.data);
            }
            else if (props.filterable.options) {
                this.setState({
                    filterOptions: this.alterOptions(props.filterable.options || [])
                });
            }
            else if (name &&
                !this.state.filterOptions.length &&
                (Array.isArray((_a = props.store) === null || _a === void 0 ? void 0 : _a.data.itemsRaw) ||
                    Array.isArray((_b = props.store) === null || _b === void 0 ? void 0 : _b.data.items))) {
                var itemsRaw = ((_c = props.store) === null || _c === void 0 ? void 0 : _c.data.itemsRaw) || ((_d = props.store) === null || _d === void 0 ? void 0 : _d.data.items);
                var values_1 = [];
                itemsRaw.forEach(function (item) {
                    var value = (0, helper_1.getVariable)(item, name);
                    if (!~values_1.indexOf(value)) {
                        values_1.push(value);
                    }
                });
                if (values_1.length) {
                    this.setState({
                        filterOptions: this.alterOptions(values_1)
                    });
                }
            }
        }
        if (this.props.data[name] !== prevProps.data[name] &&
            this.state.filterOptions.length &&
            prevState.filterOptions !== this.props.filterOptions) {
            this.setState({
                filterOptions: this.alterOptions(this.state.filterOptions)
            });
        }
        this.sourceInvalid && this.fetchOptions();
    };
    HeadCellFilterDropDown.prototype.fetchOptions = function () {
        var _this = this;
        var _a = this.props, env = _a.env, filterable = _a.filterable, data = _a.data;
        if (!(0, api_1.isEffectiveApi)(filterable.source, data)) {
            return;
        }
        var api = (0, api_1.normalizeApi)(filterable.source);
        api.cache = 3000; // 开启 3s 缓存，因为固顶位置渲染1次会额外多次请求。
        env.fetcher(api, data).then(function (ret) {
            var options = (ret.data && ret.data.options) || [];
            _this.setState({
                filterOptions: ret && ret.data && _this.alterOptions(options)
            });
        });
    };
    HeadCellFilterDropDown.prototype.alterOptions = function (options) {
        var _a = this.props, data = _a.data, filterable = _a.filterable, name = _a.name;
        var filterValue = data && typeof data[name] !== 'undefined' ? data[name] : '';
        options = (0, Select_1.normalizeOptions)(options);
        if (filterable.multiple) {
            options = options.map(function (option) { return ((0, tslib_1.__assign)((0, tslib_1.__assign)({}, option), { selected: filterValue.split(',').indexOf(option.value) > -1 })); });
        }
        else {
            options = options.map(function (option) { return ((0, tslib_1.__assign)((0, tslib_1.__assign)({}, option), { selected: option.value == filterValue })); });
        }
        return options;
    };
    HeadCellFilterDropDown.prototype.handleClickOutside = function () {
        this.close();
    };
    HeadCellFilterDropDown.prototype.open = function () {
        this.setState({
            isOpened: true
        });
    };
    HeadCellFilterDropDown.prototype.close = function () {
        this.setState({
            isOpened: false
        });
    };
    HeadCellFilterDropDown.prototype.handleClick = function (value) {
        var _a;
        var _b = this.props, onQuery = _b.onQuery, name = _b.name;
        onQuery((_a = {},
            _a[name] = value,
            _a));
        this.close();
    };
    HeadCellFilterDropDown.prototype.handleCheck = function (value) {
        var _a;
        var _b = this.props, data = _b.data, name = _b.name, onQuery = _b.onQuery;
        var query;
        if (data[name] && data[name] === value) {
            query = '';
        }
        else {
            query =
                (data[name] && (0, xor_1.default)(data[name].split(','), [value]).join(',')) || value;
        }
        onQuery((_a = {},
            _a[name] = query,
            _a));
    };
    HeadCellFilterDropDown.prototype.handleReset = function () {
        var _a;
        var _b = this.props, name = _b.name, onQuery = _b.onQuery;
        onQuery((_a = {},
            _a[name] = undefined,
            _a));
        this.close();
    };
    HeadCellFilterDropDown.prototype.render = function () {
        var _this = this;
        var _a = this.state, isOpened = _a.isOpened, filterOptions = _a.filterOptions;
        var _b = this.props, data = _b.data, name = _b.name, filterable = _b.filterable, popOverContainer = _b.popOverContainer, ns = _b.classPrefix, cx = _b.classnames, __ = _b.translate;
        return (react_1.default.createElement("span", { className: cx("".concat(ns, "TableCell-filterBtn"), typeof data[name] !== 'undefined' ? 'is-active' : '') },
            react_1.default.createElement("span", { onClick: this.open },
                react_1.default.createElement(icons_1.Icon, { icon: "column-filter", className: "icon" })),
            isOpened ? (react_1.default.createElement(Overlay_1.default, { container: popOverContainer || (function () { return (0, react_dom_1.findDOMNode)(_this); }), placement: "left-bottom-left-top right-bottom-right-top", target: popOverContainer ? function () { return (0, react_dom_1.findDOMNode)(_this).parentNode; } : null, show: true },
                react_1.default.createElement(PopOver_1.default, { classPrefix: ns, onHide: this.close, className: cx("".concat(ns, "TableCell-filterPopOver"), filterable.className), overlay: true }, filterOptions && filterOptions.length > 0 ? (react_1.default.createElement("ul", { className: cx('DropDown-menu') },
                    !filterable.multiple
                        ? filterOptions.map(function (option, index) { return (react_1.default.createElement("li", { key: index, className: cx({
                                'is-active': option.selected
                            }), onClick: _this.handleClick.bind(_this, option.value) }, option.label)); })
                        : filterOptions.map(function (option, index) { return (react_1.default.createElement("li", { key: index },
                            react_1.default.createElement(Checkbox_1.default, { classPrefix: ns, onChange: _this.handleCheck.bind(_this, option.value), checked: option.selected }, option.label))); }),
                    filterOptions.some(function (item) { return item.selected; }) ? (react_1.default.createElement("li", { key: "DropDown-menu-reset", onClick: this.handleReset.bind(this) }, __('reset'))) : null)) : null))) : null));
    };
    return HeadCellFilterDropDown;
}(react_1.default.Component));
exports.HeadCellFilterDropDown = HeadCellFilterDropDown;
//# sourceMappingURL=./renderers/Table/HeadCellFilterDropdown.js.map
