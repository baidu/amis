"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TreeSelection = void 0;
var tslib_1 = require("tslib");
var Selection_1 = require("./Selection");
var theme_1 = require("../theme");
var react_1 = (0, tslib_1.__importDefault)(require("react"));
var uncontrollable_1 = require("uncontrollable");
var Checkbox_1 = (0, tslib_1.__importDefault)(require("./Checkbox"));
var helper_1 = require("../utils/helper");
var Spinner_1 = (0, tslib_1.__importDefault)(require("./Spinner"));
var locale_1 = require("../locale");
var icons_1 = require("./icons");
var TreeSelection = /** @class */ (function (_super) {
    (0, tslib_1.__extends)(TreeSelection, _super);
    function TreeSelection() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.state = {
            expanded: []
        };
        return _this;
    }
    TreeSelection.prototype.componentDidMount = function () {
        this.syncExpanded();
    };
    TreeSelection.prototype.componentDidUpdate = function (prevProps) {
        var props = this.props;
        if (!this.state.expanded.length &&
            (props.expand !== prevProps.expand || props.options !== prevProps.options)) {
            this.syncExpanded();
        }
    };
    TreeSelection.prototype.syncExpanded = function () {
        var options = this.props.options;
        var mode = this.props.expand;
        var expanded = [];
        if (!Array.isArray(options)) {
            return;
        }
        if (mode === 'first' || mode === 'root') {
            options.every(function (option, index) {
                if (Array.isArray(option.children)) {
                    expanded.push("".concat(index));
                    return mode === 'root';
                }
                return true;
            });
        }
        else if (mode === 'all') {
            (0, helper_1.everyTree)(options, function (option, index, level, paths, indexes) {
                if (Array.isArray(option.children)) {
                    expanded.push("".concat(indexes.concat(index).join('-')));
                }
                return true;
            });
        }
        this.setState({ expanded: expanded });
    };
    TreeSelection.prototype.toggleOption = function (option) {
        var _a = this.props, value = _a.value, onChange = _a.onChange, option2value = _a.option2value, options = _a.options, onDeferLoad = _a.onDeferLoad, disabled = _a.disabled, multiple = _a.multiple, clearable = _a.clearable;
        if (disabled || option.disabled) {
            return;
        }
        else if (option.defer && !option.loaded) {
            onDeferLoad === null || onDeferLoad === void 0 ? void 0 : onDeferLoad(option);
            return;
        }
        var valueArray = Selection_1.BaseSelection.value2array(value, options, option2value);
        if (option.value === void 0 &&
            Array.isArray(option.children) &&
            option.children.length &&
            multiple) {
            var someCheckedFn_1 = function (child) {
                return (Array.isArray(child.children) && child.children.length
                    ? child.children.some(someCheckedFn_1)
                    : false) ||
                    (child.value !== void 0 && ~valueArray.indexOf(child));
            };
            var someChecked_1 = option.children.some(someCheckedFn_1);
            var eachFn_1 = function (child) {
                if (Array.isArray(child.children) && child.children.length) {
                    child.children.forEach(eachFn_1);
                }
                if (child.value !== void 0) {
                    var idx = valueArray.indexOf(child);
                    ~idx && valueArray.splice(idx, 1);
                    if (!someChecked_1) {
                        valueArray.push(child);
                    }
                }
            };
            option.children.forEach(eachFn_1);
        }
        else {
            var idx = valueArray.indexOf(option);
            if (~idx && (multiple || clearable)) {
                valueArray.splice(idx, 1);
            }
            else if (multiple) {
                valueArray.push(option);
            }
            else {
                valueArray = [option];
            }
        }
        var newValue = option2value
            ? valueArray.map(function (item) { return option2value(item); })
            : valueArray;
        onChange && onChange(multiple ? newValue : newValue[0]);
    };
    TreeSelection.prototype.toggleCollapsed = function (option, index) {
        var onDeferLoad = this.props.onDeferLoad;
        var expanded = this.state.expanded.concat();
        var idx = expanded.indexOf(index);
        if (~idx) {
            expanded.splice(idx, 1);
        }
        else {
            expanded.push(index);
        }
        this.setState({
            expanded: expanded
        }, option.defer && onDeferLoad ? function () { return onDeferLoad(option); } : undefined);
    };
    TreeSelection.prototype.renderItem = function (option, index, indexes) {
        var _this = this;
        if (indexes === void 0) { indexes = []; }
        var _a = this.props, labelClassName = _a.labelClassName, disabled = _a.disabled, cx = _a.classnames, itemClassName = _a.itemClassName, itemRender = _a.itemRender, multiple = _a.multiple;
        var id = indexes.join('-');
        var valueArray = this.valueArray;
        var partial = false;
        var checked = false;
        var hasChildren = Array.isArray(option.children) && option.children.length;
        if (option.value === void 0 && hasChildren) {
            var allchecked_1 = true;
            var partialChecked_1 = false;
            var eachFn_2 = function (child) {
                if (Array.isArray(child.children) && child.children.length) {
                    child.children.forEach(eachFn_2);
                }
                if (child.value !== void 0) {
                    var isIn = !!~valueArray.indexOf(child);
                    if (isIn && !partialChecked_1) {
                        partialChecked_1 = true;
                    }
                    else if (!isIn && allchecked_1) {
                        allchecked_1 = false;
                    }
                    checked = partialChecked_1;
                    partial = partialChecked_1 && !allchecked_1;
                }
            };
            option.children.forEach(eachFn_2);
        }
        else {
            checked = !!~valueArray.indexOf(option);
        }
        var expaned = !!~this.state.expanded.indexOf(id);
        return (react_1.default.createElement("div", { key: index, className: cx('TreeSelection-item', disabled || option.disabled || (option.defer && option.loading)
                ? 'is-disabled'
                : '', expaned ? 'is-expanded' : '') },
            react_1.default.createElement("div", { className: cx('TreeSelection-itemInner', itemClassName, option.className, checked ? 'is-active' : ''), onClick: function () { return _this.toggleOption(option); } },
                hasChildren || option.defer ? (react_1.default.createElement("a", { onClick: function (e) {
                        e.stopPropagation();
                        _this.toggleCollapsed(option, id);
                    }, className: cx('Table-expandBtn', expaned ? 'is-active' : '') },
                    react_1.default.createElement(icons_1.Icon, { icon: "right-arrow-bold", className: "icon" }))) : null,
                option.defer && option.loading ? react_1.default.createElement(Spinner_1.default, { show: true, size: "sm" }) : null,
                multiple && (!option.defer || option.loaded) ? (react_1.default.createElement(Checkbox_1.default, { size: "sm", checked: checked, partial: partial, disabled: disabled || option.disabled, labelClassName: labelClassName, description: option.description })) : null,
                react_1.default.createElement("div", { className: cx('TreeSelection-itemLabel') }, itemRender(option, {
                    index: index,
                    multiple: multiple,
                    checked: checked,
                    onChange: function () { return _this.toggleOption(option); },
                    disabled: disabled || option.disabled
                })),
                option.defer && option.loading ? react_1.default.createElement(Spinner_1.default, { show: true, size: "sm" }) : null),
            hasChildren ? (react_1.default.createElement("div", { className: cx('TreeSelection-sublist') }, option.children.map(function (option, key) {
                return _this.renderItem(option, key, indexes.concat(key));
            }))) : null));
    };
    TreeSelection.prototype.render = function () {
        var _this = this;
        var _a = this.props, value = _a.value, options = _a.options, className = _a.className, placeholder = _a.placeholder, cx = _a.classnames, option2value = _a.option2value, __ = _a.translate;
        this.valueArray = Selection_1.BaseSelection.value2array(value, options, option2value);
        var body = [];
        if (Array.isArray(options) && options.length) {
            body = options.map(function (option, key) { return _this.renderItem(option, key, [key]); });
        }
        return (react_1.default.createElement("div", { className: cx('TreeSelection', className) }, body && body.length ? (body) : (react_1.default.createElement("div", { className: cx('TreeSelection-placeholder') }, __(placeholder)))));
    };
    TreeSelection.defaultProps = (0, tslib_1.__assign)((0, tslib_1.__assign)({}, Selection_1.BaseSelection.defaultProps), { expand: 'first' });
    return TreeSelection;
}(Selection_1.BaseSelection));
exports.TreeSelection = TreeSelection;
exports.default = (0, theme_1.themeable)((0, locale_1.localeable)((0, uncontrollable_1.uncontrollable)(TreeSelection, {
    value: 'onChange'
})));
//# sourceMappingURL=./components/TreeSelection.js.map
