"use strict";
/**
 * @file Cascader
 * @author fex
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.Cascader = void 0;
var tslib_1 = require("tslib");
var react_1 = (0, tslib_1.__importDefault)(require("react"));
var helper_1 = require("../utils/helper");
var theme_1 = require("../theme");
var Select_1 = require("./Select");
var intersectionBy_1 = (0, tslib_1.__importDefault)(require("lodash/intersectionBy"));
var compact_1 = (0, tslib_1.__importDefault)(require("lodash/compact"));
var find_1 = (0, tslib_1.__importDefault)(require("lodash/find"));
var uniqBy_1 = (0, tslib_1.__importDefault)(require("lodash/uniqBy"));
var Button_1 = (0, tslib_1.__importDefault)(require("./Button"));
var helper_2 = require("../utils/helper");
var Cascader = /** @class */ (function (_super) {
    (0, tslib_1.__extends)(Cascader, _super);
    function Cascader(props) {
        var _this = _super.call(this, props) || this;
        _this.tabsRef = react_1.default.createRef();
        _this.tabRef = react_1.default.createRef();
        _this.getParentTree = function (option, arr) {
            var parentOption = _this.getOptionParent(option);
            if (parentOption) {
                arr.push(parentOption);
                return _this.getParentTree(parentOption, arr);
            }
            return arr;
        };
        _this.state = {
            selectedOptions: _this.props.selectedOptions || [],
            activeTab: 0,
            tabs: [
                {
                    options: _this.props.options.slice() || []
                }
            ],
            disableConfirm: false
        };
        return _this;
    }
    Cascader.prototype.componentDidMount = function () {
        var _a = this.props, multiple = _a.multiple, options = _a.options, _b = _a.valueField, valueField = _b === void 0 ? 'value' : _b, cascade = _a.cascade;
        var selectedOptions = this.props.selectedOptions.slice();
        var parentsCount = 0;
        var parentTree = [];
        selectedOptions.forEach(function (item) {
            var parents = (0, helper_1.getTreeAncestors)(options, item);
            // 获取最长路径
            if (parents && (parents === null || parents === void 0 ? void 0 : parents.length) > parentsCount) {
                parentTree = parents;
                parentsCount = parentTree.length;
            }
        });
        var selectedValues = selectedOptions.map(function (option) { return option[valueField]; });
        var tabs = parentTree.map(function (option) {
            var _a;
            if (multiple && !cascade) {
                if (selectedValues.includes(option[valueField]) &&
                    ((_a = option === null || option === void 0 ? void 0 : option.children) === null || _a === void 0 ? void 0 : _a.length)) {
                    option.children.forEach(function (option) { return (option.disabled = true); });
                }
            }
            return multiple
                ? {
                    options: (0, tslib_1.__spreadArray)([
                        (0, tslib_1.__assign)((0, tslib_1.__assign)({}, option), { isCheckAll: true })
                    ], (option.children ? option.children : []), true)
                }
                : {
                    options: option.children ? option.children : []
                };
        });
        this.setState({
            selectedOptions: selectedOptions,
            tabs: (0, tslib_1.__spreadArray)((0, tslib_1.__spreadArray)([], this.state.tabs, true), tabs, true)
        });
    };
    Cascader.prototype.handleTabSelect = function (index) {
        var tabs = this.state.tabs.slice(0, index + 1);
        this.setState({
            activeTab: index,
            tabs: tabs
        });
    };
    Cascader.prototype.getOptionParent = function (option) {
        var _a = this.props, options = _a.options, _b = _a.valueField, valueField = _b === void 0 ? 'value' : _b;
        var ancestors = [];
        (0, helper_2.findTree)(options, function (item, index, level, paths) {
            if (item[valueField] === option[valueField]) {
                ancestors = paths;
                return true;
            }
            return false;
        });
        return ancestors.length ? ancestors[ancestors.length - 1] : null;
    };
    Cascader.prototype.dealParentSelect = function (option, selectedOptions) {
        var _a;
        var _b = this.props.valueField, valueField = _b === void 0 ? 'value' : _b;
        var parentOption = this.getOptionParent(option);
        if (parentOption) {
            var parentChildren = parentOption === null || parentOption === void 0 ? void 0 : parentOption.children;
            var equalOption = (0, intersectionBy_1.default)(selectedOptions, parentChildren, valueField);
            // 包含则选中父节点
            var isParentSelected = (0, find_1.default)(selectedOptions, (_a = {},
                _a[valueField] = parentOption[valueField],
                _a));
            if (equalOption.length === (parentChildren === null || parentChildren === void 0 ? void 0 : parentChildren.length) && !isParentSelected) {
                selectedOptions.push(parentOption);
            }
            if (equalOption.length !== (parentChildren === null || parentChildren === void 0 ? void 0 : parentChildren.length) && isParentSelected) {
                var index = selectedOptions.findIndex(function (item) { return item[valueField] === parentOption[valueField]; });
                selectedOptions.splice(index, 1);
            }
            return this.dealParentSelect(parentOption, selectedOptions);
        }
        else {
            return selectedOptions;
        }
    };
    Cascader.prototype.flattenTreeWithLeafNodes = function (option) {
        return (0, compact_1.default)((0, helper_2.flattenTree)(Array.isArray(option) ? option : [option], function (node) { return node; }));
    };
    Cascader.prototype.adjustOptionSelect = function (option) {
        var _a = this.props.valueField, valueField = _a === void 0 ? 'value' : _a;
        var selectedOptions = this.state.selectedOptions;
        function loop(arr) {
            if (!arr.length) {
                return false;
            }
            return arr.some(function (item) { return item[valueField] === option[valueField]; });
        }
        return loop(selectedOptions);
    };
    Cascader.prototype.getSelectedChildNum = function (option) {
        var _this = this;
        var count = 0;
        var loop = function (arr) {
            if (!arr || !arr.length) {
                return;
            }
            for (var _i = 0, arr_1 = arr; _i < arr_1.length; _i++) {
                var item = arr_1[_i];
                if (item.children) {
                    loop(item.children || []);
                }
                else {
                    if (_this.adjustOptionSelect(item)) {
                        count++;
                    }
                }
            }
        };
        loop(option.children || []);
        return count;
    };
    Cascader.prototype.dealOptionDisable = function (selectedOptions) {
        var _a = this.props, _b = _a.valueField, valueField = _b === void 0 ? 'value' : _b, options = _a.options, cascade = _a.cascade, multiple = _a.multiple, onlyChildren = _a.onlyChildren // 子节点可点击
        ;
        if (!multiple || cascade || onlyChildren) {
            return;
        }
        var selectedValues = selectedOptions.map(function (option) { return option[valueField]; });
        var loop = function (option) {
            if (!option.children) {
                return;
            }
            option.children &&
                option.children.forEach(function (childOption) {
                    if (!selectedValues.includes(option[valueField]) &&
                        !option.disabled) {
                        childOption.disabled = false;
                    }
                    if (selectedValues.includes(option[valueField]) || option.disabled) {
                        childOption.disabled = true;
                    }
                    loop(childOption);
                });
        };
        options.forEach(function (option) { return loop(option); });
    };
    Cascader.prototype.dealChildrenSelect = function (option, selectedOptions) {
        var _a = this.props.valueField, valueField = _a === void 0 ? 'value' : _a;
        var index = selectedOptions.findIndex(function (item) { return item[valueField] === option[valueField]; });
        if (index !== -1) {
            selectedOptions.splice(index, 1);
        }
        else {
            selectedOptions.push(option);
        }
        function loop(option) {
            if (!option.children) {
                return;
            }
            option.children.forEach(function (item) {
                if (index !== -1) {
                    // 删除选中节点及其子节点
                    selectedOptions = selectedOptions.filter(function (sItem) { return sItem[valueField] !== item[valueField]; });
                }
                else {
                    // 添加节点及其子节点
                    selectedOptions.push(item);
                }
                loop(item);
            });
        }
        loop(option);
        return selectedOptions;
    };
    Cascader.prototype.onSelect = function (option, tabIndex) {
        var _this = this;
        var _a = this.props, multiple = _a.multiple, _b = _a.valueField, valueField = _b === void 0 ? 'value' : _b, cascade = _a.cascade, onlyLeaf = _a.onlyLeaf;
        var tabs = this.state.tabs.slice();
        var activeTab = this.state.activeTab;
        var selectedOptions = this.state.selectedOptions;
        var isDisable = option.disabled;
        if (!isDisable) {
            if (multiple) {
                // 父子级分离
                if (cascade) {
                    if (option.isCheckAll ||
                        !option.children ||
                        !option.children.length) {
                        var index = selectedOptions.findIndex(function (item) { return item[valueField] === option[valueField]; });
                        if (index !== -1) {
                            selectedOptions.splice(index, 1);
                        }
                        else {
                            selectedOptions.push(option);
                        }
                    }
                }
                else {
                    if (option.isCheckAll ||
                        !option.children ||
                        !option.children.length) {
                        selectedOptions = this.dealChildrenSelect(option, selectedOptions);
                        selectedOptions = this.dealParentSelect(option, selectedOptions);
                    }
                }
            }
            else {
                // 单选
                selectedOptions = this.getParentTree(option, [option]);
            }
        }
        this.dealOptionDisable(selectedOptions);
        if (tabs.length > tabIndex + 1) {
            tabs = tabs.slice(0, tabIndex + 1);
        }
        requestAnimationFrame(function () {
            var _a, _b;
            var tabWidth = ((_a = _this.tabRef.current) === null || _a === void 0 ? void 0 : _a.offsetWidth) || 1;
            var parentTree = _this.getParentTree(option, [option]);
            var scrollLeft = (parentTree.length - 2) * tabWidth;
            if (scrollLeft !== 0) {
                (_b = _this.tabsRef.current) === null || _b === void 0 ? void 0 : _b.scrollTo(scrollLeft, 0);
            }
        });
        if ((option === null || option === void 0 ? void 0 : option.children) && !option.isCheckAll) {
            var nextTab = multiple
                ? {
                    options: (0, tslib_1.__spreadArray)([
                        (0, tslib_1.__assign)((0, tslib_1.__assign)({}, option), { isCheckAll: true })
                    ], option.children, true)
                }
                : {
                    options: option.children
                };
            if (tabs[tabIndex + 1]) {
                tabs[tabIndex + 1] = nextTab;
            }
            else {
                tabs.push(nextTab);
            }
            activeTab += 1;
        }
        var disableConfirm = false;
        if (onlyLeaf && selectedOptions.length && selectedOptions[0].children) {
            disableConfirm = true;
        }
        this.setState({
            tabs: tabs,
            activeTab: activeTab,
            selectedOptions: selectedOptions,
            disableConfirm: disableConfirm
        });
    };
    Cascader.prototype.onNextClick = function (option, tabIndex) {
        var activeTab = this.state.activeTab;
        var tabs = this.state.tabs.slice();
        if (option.c)
            if (option === null || option === void 0 ? void 0 : option.children) {
                var nextTab = {
                    options: option.children
                };
                if (tabs[tabIndex + 1]) {
                    tabs[tabIndex + 1] = nextTab;
                }
                else {
                    tabs.push(nextTab);
                }
                activeTab += 1;
            }
        this.setState({
            tabs: tabs,
            activeTab: activeTab
        });
    };
    Cascader.prototype.getSubmitOptions = function (selectedOptions) {
        var _selectedOptions = [];
        var _a = this.props, multiple = _a.multiple, options = _a.options, _b = _a.valueField, valueField = _b === void 0 ? 'value' : _b, cascade = _a.cascade, onlyChildren = _a.onlyChildren, withChildren = _a.withChildren;
        if (cascade || onlyChildren || withChildren || !multiple) {
            return selectedOptions;
        }
        var selectedValues = selectedOptions.map(function (option) { return option[valueField]; });
        function loop(options) {
            if (!options || !options.length) {
                return;
            }
            options.forEach(function (option) {
                if (selectedValues.includes(option[valueField])) {
                    _selectedOptions.push(option);
                }
                else {
                    loop(option.children ? option.children : []);
                }
            });
        }
        loop(options);
        return _selectedOptions;
    };
    Cascader.prototype.confirm = function () {
        var _a = this.props, onChange = _a.onChange, joinValues = _a.joinValues, delimiter = _a.delimiter, extractValue = _a.extractValue, valueField = _a.valueField, onClose = _a.onClose, onlyLeaf = _a.onlyLeaf;
        var selectedOptions = this.getSelectedOptions();
        if (onlyLeaf && selectedOptions.length && selectedOptions[0].children) {
            return;
        }
        onChange(joinValues
            ? selectedOptions
                .map(function (item) { return item[valueField]; })
                .join(delimiter)
            : extractValue
                ? selectedOptions.map(function (item) { return item[valueField]; })
                : selectedOptions);
        onClose && onClose();
    };
    Cascader.prototype.getSelectedOptions = function () {
        return (0, uniqBy_1.default)(this.getSubmitOptions(this.state.selectedOptions), this.props.valueField);
    };
    Cascader.prototype.renderOption = function (option, tabIndex) {
        var _this = this;
        var _a = this.props, activeColor = _a.activeColor, optionRender = _a.optionRender, labelField = _a.labelField, _b = _a.valueField, valueField = _b === void 0 ? 'value' : _b, cx = _a.classnames, cascade = _a.cascade, multiple = _a.multiple;
        var selectedOptions = this.state.selectedOptions;
        var selectedValueArr = selectedOptions.map(function (item) { return item[valueField]; });
        var selfChecked = selectedValueArr.includes(option[valueField]);
        var color = option.color || (selfChecked ? activeColor : undefined);
        var Text = optionRender ? (optionRender({ option: option, selected: selfChecked })) : (react_1.default.createElement("span", null, option[labelField]));
        return (react_1.default.createElement("li", { className: cx('Cascader-option', {
                selected: selfChecked,
                disabled: option.disabled
            }, option.className), style: { color: color }, onClick: function () { return _this.onSelect(option, tabIndex); }, key: tabIndex + '-' + option[valueField] },
            react_1.default.createElement("span", { className: cx('Cascader-option--text') }, Text)));
    };
    Cascader.prototype.renderOptions = function (options, tabIndex) {
        var _this = this;
        var cx = this.props.classnames;
        return (react_1.default.createElement("ul", { key: tabIndex, className: cx('Cascader-options') }, options.map(function (option) { return _this.renderOption(option, tabIndex); })));
    };
    Cascader.prototype.renderTabs = function () {
        var _this = this;
        var _a = this.props, cx = _a.classnames, options = _a.options;
        var tabs = this.state.tabs;
        var depth = (0, helper_2.getTreeDepth)(options);
        return (react_1.default.createElement("div", { className: cx("Cascader-tabs", depth > 3 ? 'scrollable' : ''), ref: this.tabsRef },
            tabs.map(function (tab, tabIndex) {
                var options = tab.options;
                return (react_1.default.createElement("div", { className: cx("Cascader-tab"), ref: _this.tabRef, key: tabIndex }, _this.renderOptions(options, tabIndex)));
            }),
            depth <= 3 && options.length
                ? Array((0, helper_2.getTreeDepth)(options) - tabs.length)
                    .fill(1)
                    .map(function (item, index) { return (react_1.default.createElement("div", { className: cx("Cascader-tab"), key: index })); })
                : null));
    };
    Cascader.prototype.render = function () {
        var _a = this.props, ns = _a.classPrefix, cx = _a.classnames, className = _a.className, onClose = _a.onClose, valueField = _a.valueField, __ = _a.translate;
        return (react_1.default.createElement("div", { className: cx("Cascader", className) },
            react_1.default.createElement("div", { className: cx("Cascader-btnGroup") },
                react_1.default.createElement(Button_1.default, { className: cx("Cascader-btnCancel"), level: "text", onClick: onClose }, __('cancel')),
                react_1.default.createElement(Button_1.default, { className: cx("Cascader-btnConfirm"), level: "text", onClick: this.confirm, disabled: this.state.disableConfirm }, __('confirm'))),
            this.renderTabs()));
    };
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o;
    Cascader.defaultProps = {
        labelField: 'label',
        valueField: 'value'
    };
    (0, tslib_1.__decorate)([
        helper_1.autobind,
        (0, tslib_1.__metadata)("design:type", Function),
        (0, tslib_1.__metadata)("design:paramtypes", [Number]),
        (0, tslib_1.__metadata)("design:returntype", void 0)
    ], Cascader.prototype, "handleTabSelect", null);
    (0, tslib_1.__decorate)([
        helper_1.autobind,
        (0, tslib_1.__metadata)("design:type", Function),
        (0, tslib_1.__metadata)("design:paramtypes", [typeof (_a = typeof Select_1.Option !== "undefined" && Select_1.Option) === "function" ? _a : Object]),
        (0, tslib_1.__metadata)("design:returntype", void 0)
    ], Cascader.prototype, "getOptionParent", null);
    (0, tslib_1.__decorate)([
        helper_1.autobind,
        (0, tslib_1.__metadata)("design:type", Function),
        (0, tslib_1.__metadata)("design:paramtypes", [typeof (_b = typeof Select_1.Option !== "undefined" && Select_1.Option) === "function" ? _b : Object, typeof (_c = typeof Select_1.Options !== "undefined" && Select_1.Options) === "function" ? _c : Object]),
        (0, tslib_1.__metadata)("design:returntype", typeof (_d = typeof Select_1.Options !== "undefined" && Select_1.Options) === "function" ? _d : Object)
    ], Cascader.prototype, "dealParentSelect", null);
    (0, tslib_1.__decorate)([
        helper_1.autobind,
        (0, tslib_1.__metadata)("design:type", Function),
        (0, tslib_1.__metadata)("design:paramtypes", [typeof (_e = typeof Select_1.Option !== "undefined" && Select_1.Option) === "function" ? _e : Object]),
        (0, tslib_1.__metadata)("design:returntype", void 0)
    ], Cascader.prototype, "flattenTreeWithLeafNodes", null);
    (0, tslib_1.__decorate)([
        helper_1.autobind,
        (0, tslib_1.__metadata)("design:type", Function),
        (0, tslib_1.__metadata)("design:paramtypes", [typeof (_f = typeof Select_1.Option !== "undefined" && Select_1.Option) === "function" ? _f : Object]),
        (0, tslib_1.__metadata)("design:returntype", Boolean)
    ], Cascader.prototype, "adjustOptionSelect", null);
    (0, tslib_1.__decorate)([
        helper_1.autobind,
        (0, tslib_1.__metadata)("design:type", Function),
        (0, tslib_1.__metadata)("design:paramtypes", [typeof (_g = typeof Select_1.Option !== "undefined" && Select_1.Option) === "function" ? _g : Object]),
        (0, tslib_1.__metadata)("design:returntype", Number)
    ], Cascader.prototype, "getSelectedChildNum", null);
    (0, tslib_1.__decorate)([
        helper_1.autobind,
        (0, tslib_1.__metadata)("design:type", Function),
        (0, tslib_1.__metadata)("design:paramtypes", [typeof (_h = typeof Select_1.Options !== "undefined" && Select_1.Options) === "function" ? _h : Object]),
        (0, tslib_1.__metadata)("design:returntype", void 0)
    ], Cascader.prototype, "dealOptionDisable", null);
    (0, tslib_1.__decorate)([
        helper_1.autobind,
        (0, tslib_1.__metadata)("design:type", Function),
        (0, tslib_1.__metadata)("design:paramtypes", [typeof (_j = typeof Select_1.Option !== "undefined" && Select_1.Option) === "function" ? _j : Object, typeof (_k = typeof Select_1.Options !== "undefined" && Select_1.Options) === "function" ? _k : Object]),
        (0, tslib_1.__metadata)("design:returntype", void 0)
    ], Cascader.prototype, "dealChildrenSelect", null);
    (0, tslib_1.__decorate)([
        helper_1.autobind,
        (0, tslib_1.__metadata)("design:type", Function),
        (0, tslib_1.__metadata)("design:paramtypes", [Object, Number]),
        (0, tslib_1.__metadata)("design:returntype", void 0)
    ], Cascader.prototype, "onSelect", null);
    (0, tslib_1.__decorate)([
        helper_1.autobind,
        (0, tslib_1.__metadata)("design:type", Function),
        (0, tslib_1.__metadata)("design:paramtypes", [Object, Number]),
        (0, tslib_1.__metadata)("design:returntype", void 0)
    ], Cascader.prototype, "onNextClick", null);
    (0, tslib_1.__decorate)([
        helper_1.autobind,
        (0, tslib_1.__metadata)("design:type", Function),
        (0, tslib_1.__metadata)("design:paramtypes", [typeof (_l = typeof Select_1.Options !== "undefined" && Select_1.Options) === "function" ? _l : Object]),
        (0, tslib_1.__metadata)("design:returntype", typeof (_m = typeof Select_1.Options !== "undefined" && Select_1.Options) === "function" ? _m : Object)
    ], Cascader.prototype, "getSubmitOptions", null);
    (0, tslib_1.__decorate)([
        helper_1.autobind,
        (0, tslib_1.__metadata)("design:type", Function),
        (0, tslib_1.__metadata)("design:paramtypes", []),
        (0, tslib_1.__metadata)("design:returntype", void 0)
    ], Cascader.prototype, "confirm", null);
    (0, tslib_1.__decorate)([
        helper_1.autobind,
        (0, tslib_1.__metadata)("design:type", Function),
        (0, tslib_1.__metadata)("design:paramtypes", []),
        (0, tslib_1.__metadata)("design:returntype", void 0)
    ], Cascader.prototype, "getSelectedOptions", null);
    (0, tslib_1.__decorate)([
        helper_1.autobind,
        (0, tslib_1.__metadata)("design:type", Function),
        (0, tslib_1.__metadata)("design:paramtypes", [Object, Number]),
        (0, tslib_1.__metadata)("design:returntype", void 0)
    ], Cascader.prototype, "renderOption", null);
    (0, tslib_1.__decorate)([
        helper_1.autobind,
        (0, tslib_1.__metadata)("design:type", Function),
        (0, tslib_1.__metadata)("design:paramtypes", [typeof (_o = typeof Select_1.Options !== "undefined" && Select_1.Options) === "function" ? _o : Object, Number]),
        (0, tslib_1.__metadata)("design:returntype", void 0)
    ], Cascader.prototype, "renderOptions", null);
    (0, tslib_1.__decorate)([
        helper_1.autobind,
        (0, tslib_1.__metadata)("design:type", Function),
        (0, tslib_1.__metadata)("design:paramtypes", []),
        (0, tslib_1.__metadata)("design:returntype", void 0)
    ], Cascader.prototype, "renderTabs", null);
    return Cascader;
}(react_1.default.Component));
exports.Cascader = Cascader;
exports.default = (0, theme_1.themeable)(Cascader);
//# sourceMappingURL=./components/Cascader.js.map
