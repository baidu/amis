"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TreeSelectControlRenderer = void 0;
var tslib_1 = require("tslib");
var react_1 = (0, tslib_1.__importDefault)(require("react"));
var Overlay_1 = (0, tslib_1.__importDefault)(require("../../components/Overlay"));
var PopOver_1 = (0, tslib_1.__importDefault)(require("../../components/PopOver"));
var PopUp_1 = (0, tslib_1.__importDefault)(require("../../components/PopUp"));
var Options_1 = require("./Options");
var Tree_1 = (0, tslib_1.__importDefault)(require("../../components/Tree"));
var match_sorter_1 = require("match-sorter");
var debounce_1 = (0, tslib_1.__importDefault)(require("lodash/debounce"));
var find_1 = (0, tslib_1.__importDefault)(require("lodash/find"));
var api_1 = require("../../utils/api");
var Spinner_1 = (0, tslib_1.__importDefault)(require("../../components/Spinner"));
var ResultBox_1 = (0, tslib_1.__importDefault)(require("../../components/ResultBox"));
var helper_1 = require("../../utils/helper");
var react_dom_1 = require("react-dom");
var Select_1 = require("../../components/Select");
var TreeSelectControl = /** @class */ (function (_super) {
    (0, tslib_1.__extends)(TreeSelectControl, _super);
    function TreeSelectControl(props) {
        var _this = _super.call(this, props) || this;
        _this.container = react_1.default.createRef();
        _this.input = react_1.default.createRef();
        _this.cache = {};
        _this.targetRef = function (ref) {
            return (_this.target = ref ? (0, react_dom_1.findDOMNode)(ref) : null);
        };
        _this.state = {
            inputValue: '',
            isOpened: false,
            isFocused: false
        };
        _this.open = _this.open.bind(_this);
        _this.close = _this.close.bind(_this);
        _this.handleChange = _this.handleChange.bind(_this);
        _this.clearValue = _this.clearValue.bind(_this);
        _this.handleFocus = _this.handleFocus.bind(_this);
        _this.handleBlur = _this.handleBlur.bind(_this);
        _this.handleKeyPress = _this.handleKeyPress.bind(_this);
        _this.handleInputChange = _this.handleInputChange.bind(_this);
        _this.handleInputKeyDown = _this.handleInputKeyDown.bind(_this);
        _this.loadRemote = (0, debounce_1.default)(_this.loadRemote.bind(_this), 250, {
            trailing: true,
            leading: false
        });
        return _this;
    }
    TreeSelectControl.prototype.componentDidMount = function () {
        this.loadRemote('');
    };
    TreeSelectControl.prototype.open = function (fn) {
        if (this.props.disabled) {
            return;
        }
        this.setState({
            isOpened: true
        }, fn);
    };
    TreeSelectControl.prototype.close = function () {
        var _this = this;
        this.setState({
            isOpened: false,
            inputValue: this.props.multiple ? this.state.inputValue : ''
        }, function () { return _this.loadRemote(_this.state.inputValue); });
    };
    TreeSelectControl.prototype.handleFocus = function (e) {
        var _a = this.props, dispatchEvent = _a.dispatchEvent, value = _a.value, data = _a.data;
        this.setState({
            isFocused: true
        });
        dispatchEvent('focus', (0, helper_1.createObject)(data, {
            value: value
        }));
    };
    TreeSelectControl.prototype.handleBlur = function (e) {
        var _a = this.props, dispatchEvent = _a.dispatchEvent, value = _a.value, data = _a.data;
        this.setState({
            isFocused: false
        });
        dispatchEvent('blur', (0, helper_1.createObject)(data, {
            value: value
        }));
    };
    TreeSelectControl.prototype.handleKeyPress = function (e) {
        if (e.key === ' ') {
            this.handleOutClick(e);
            e.preventDefault();
        }
    };
    TreeSelectControl.prototype.validate = function () {
        var _a = this.props, value = _a.value, minLength = _a.minLength, maxLength = _a.maxLength, delimiter = _a.delimiter, __ = _a.translate;
        var curValue = Array.isArray(value)
            ? value
            : (value ? String(value) : '').split(delimiter || ',');
        if (minLength && curValue.length < minLength) {
            return __('已选择数量低于设定的最小个数${minLength}，请选择更多的选项。', { minLength: minLength });
        }
        else if (maxLength && curValue.length > maxLength) {
            return __('已选择数量超出设定的最大个数{{maxLength}}，请取消选择超出的选项。', { maxLength: maxLength });
        }
    };
    TreeSelectControl.prototype.removeItem = function (index, e) {
        var _a = this.props, selectedOptions = _a.selectedOptions, joinValues = _a.joinValues, extractValue = _a.extractValue, delimiter = _a.delimiter, valueField = _a.valueField, onChange = _a.onChange, disabled = _a.disabled;
        e && e.stopPropagation();
        if (disabled) {
            return;
        }
        var items = selectedOptions.concat();
        items.splice(index, 1);
        var value = items;
        if (joinValues) {
            value = items
                .map(function (item) { return item[valueField || 'value']; })
                .join(delimiter || ',');
        }
        else if (extractValue) {
            value = items.map(function (item) { return item[valueField || 'value']; });
        }
        onChange(value);
    };
    TreeSelectControl.prototype.handleChange = function (value) {
        var _this = this;
        var multiple = this.props.multiple;
        if (!multiple) {
            this.close();
        }
        multiple || !this.state.inputValue
            ? this.resultChangeEvent(value)
            : this.setState({
                inputValue: ''
            }, function () { return _this.resultChangeEvent(value); });
    };
    TreeSelectControl.prototype.handleInputChange = function (value) {
        var _this = this;
        var _a = this.props, autoComplete = _a.autoComplete, data = _a.data;
        this.setState({
            inputValue: value
        }, (0, api_1.isEffectiveApi)(autoComplete, data)
            ? function () { return _this.loadRemote(_this.state.inputValue); }
            : undefined);
    };
    TreeSelectControl.prototype.handleInputKeyDown = function (event) {
        var inputValue = this.state.inputValue;
        var _a = this.props, multiple = _a.multiple, selectedOptions = _a.selectedOptions;
        if (event.key === 'Backspace' &&
            !inputValue &&
            selectedOptions.length &&
            multiple) {
            this.removeItem(selectedOptions.length - 1);
        }
    };
    TreeSelectControl.prototype.clearValue = function () {
        var _a = this.props, onChange = _a.onChange, resetValue = _a.resetValue;
        onChange(typeof resetValue === 'undefined' ? '' : resetValue);
    };
    TreeSelectControl.prototype.filterOptions = function (options, keywords) {
        var _this = this;
        var _a = this.props, labelField = _a.labelField, valueField = _a.valueField;
        return options.map(function (option) {
            option = (0, tslib_1.__assign)({}, option);
            option.visible = !!(0, match_sorter_1.matchSorter)([option], keywords, {
                keys: [labelField || 'label', valueField || 'value']
            }).length;
            if (!option.visible && option.children) {
                option.children = _this.filterOptions(option.children, keywords);
                var visibleCount = option.children.filter(function (item) { return item.visible; }).length;
                option.visible = !!visibleCount;
            }
            option.visible && (option.collapsed = false);
            return option;
        });
    };
    TreeSelectControl.prototype.loadRemote = function (input) {
        return (0, tslib_1.__awaiter)(this, void 0, void 0, function () {
            var _a, autoComplete, env, data, setOptions, setLoading, options, combinedOptions, ret, options, combinedOptions;
            return (0, tslib_1.__generator)(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = this.props, autoComplete = _a.autoComplete, env = _a.env, data = _a.data, setOptions = _a.setOptions, setLoading = _a.setLoading;
                        if (!(0, api_1.isEffectiveApi)(autoComplete, data)) {
                            return [2 /*return*/];
                        }
                        else if (!env || !env.fetcher) {
                            throw new Error('fetcher is required');
                        }
                        if (this.cache[input] || ~input.indexOf("'") /*中文没输完 233*/) {
                            options = this.cache[input] || [];
                            combinedOptions = this.mergeOptions(options);
                            setOptions(combinedOptions);
                            return [2 /*return*/, Promise.resolve({
                                    options: combinedOptions
                                })];
                        }
                        setLoading(true);
                        _b.label = 1;
                    case 1:
                        _b.trys.push([1, , 3, 4]);
                        return [4 /*yield*/, env.fetcher(autoComplete, (0, tslib_1.__assign)((0, tslib_1.__assign)({}, data), { term: input, value: input }))];
                    case 2:
                        ret = _b.sent();
                        options = (ret.data && ret.data.options) || ret.data || [];
                        this.cache[input] = options;
                        combinedOptions = this.mergeOptions(options);
                        setOptions(combinedOptions);
                        return [2 /*return*/, {
                                options: combinedOptions
                            }];
                    case 3:
                        setLoading(false);
                        return [7 /*endfinally*/];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    TreeSelectControl.prototype.mergeOptions = function (options) {
        var selectedOptions = this.props.selectedOptions;
        var combinedOptions = (0, Select_1.normalizeOptions)(options).concat();
        if (Array.isArray(selectedOptions) && selectedOptions.length) {
            selectedOptions.forEach(function (option) {
                if (!(0, find_1.default)(combinedOptions, function (item) { return item.value == option.value; })) {
                    combinedOptions.push((0, tslib_1.__assign)((0, tslib_1.__assign)({}, option), { visible: false }));
                }
            });
        }
        return combinedOptions;
    };
    TreeSelectControl.prototype.reload = function () {
        var reload = this.props.reloadOptions;
        reload && reload();
    };
    TreeSelectControl.prototype.handleOutClick = function (e) {
        e.defaultPrevented ||
            this.setState({
                isOpened: true
            });
    };
    TreeSelectControl.prototype.handleResultChange = function (value) {
        var _a = this.props, joinValues = _a.joinValues, extractValue = _a.extractValue, delimiter = _a.delimiter, valueField = _a.valueField, multiple = _a.multiple;
        var newValue = Array.isArray(value) ? value.concat() : [];
        if (!multiple && !newValue.length) {
            this.resultChangeEvent('');
            return;
        }
        if (joinValues || extractValue) {
            newValue = value.map(function (item) { return item[valueField || 'value']; });
        }
        if (joinValues) {
            newValue = newValue.join(delimiter || ',');
        }
        this.resultChangeEvent(newValue);
    };
    TreeSelectControl.prototype.doAction = function (action, data, throwErrors) {
        if (action.actionType && ['clear', 'reset'].includes(action.actionType)) {
            this.clearValue();
        }
    };
    TreeSelectControl.prototype.resultChangeEvent = function (value) {
        return (0, tslib_1.__awaiter)(this, void 0, void 0, function () {
            var _a, onChange, dispatchEvent, data, rendererEvent;
            return (0, tslib_1.__generator)(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = this.props, onChange = _a.onChange, dispatchEvent = _a.dispatchEvent, data = _a.data;
                        return [4 /*yield*/, dispatchEvent('change', (0, helper_1.createObject)(data, {
                                value: value
                            }))];
                    case 1:
                        rendererEvent = _b.sent();
                        if (rendererEvent === null || rendererEvent === void 0 ? void 0 : rendererEvent.prevented) {
                            return [2 /*return*/];
                        }
                        onChange && onChange(value);
                        return [2 /*return*/];
                }
            });
        });
    };
    TreeSelectControl.prototype.renderItem = function (item) {
        var _a = this.props, labelField = _a.labelField, options = _a.options, hideNodePathLabel = _a.hideNodePathLabel;
        if (hideNodePathLabel) {
            return item[labelField || 'label'];
        }
        // 将所有祖先节点也展现出来
        var ancestors = (0, helper_1.getTreeAncestors)(options, item, true);
        return "".concat(ancestors
            ? ancestors.map(function (item) { return "".concat(item[labelField || 'label']); }).join(' / ')
            : item[labelField || 'label']);
    };
    TreeSelectControl.prototype.domRef = function (ref) {
        this.treeRef = ref;
    };
    TreeSelectControl.prototype.renderOuter = function () {
        var _a = this.props, value = _a.value, enableNodePath = _a.enableNodePath, _b = _a.pathSeparator, pathSeparator = _b === void 0 ? '/' : _b, disabled = _a.disabled, joinValues = _a.joinValues, extractValue = _a.extractValue, delimiter = _a.delimiter, placeholder = _a.placeholder, options = _a.options, multiple = _a.multiple, valueField = _a.valueField, initiallyOpen = _a.initiallyOpen, unfoldedLevel = _a.unfoldedLevel, withChildren = _a.withChildren, rootLabel = _a.rootLabel, cascade = _a.cascade, rootValue = _a.rootValue, showIcon = _a.showIcon, showRadio = _a.showRadio, popOverContainer = _a.popOverContainer, onlyChildren = _a.onlyChildren, onlyLeaf = _a.onlyLeaf, ns = _a.classPrefix, optionsPlaceholder = _a.optionsPlaceholder, searchable = _a.searchable, autoComplete = _a.autoComplete, maxLength = _a.maxLength, minLength = _a.minLength, labelField = _a.labelField, nodePath = _a.nodePath, onAdd = _a.onAdd, creatable = _a.creatable, createTip = _a.createTip, addControls = _a.addControls, onEdit = _a.onEdit, editable = _a.editable, editTip = _a.editTip, editControls = _a.editControls, removable = _a.removable, removeTip = _a.removeTip, onDelete = _a.onDelete, rootCreatable = _a.rootCreatable, rootCreateTip = _a.rootCreateTip, __ = _a.translate, deferLoad = _a.deferLoad, expandTreeOptions = _a.expandTreeOptions, selfDisabledAffectChildren = _a.selfDisabledAffectChildren, showOutline = _a.showOutline, autoCheckChildren = _a.autoCheckChildren;
        var filtedOptions = !(0, api_1.isEffectiveApi)(autoComplete) && searchable && this.state.inputValue
            ? this.filterOptions(options, this.state.inputValue)
            : options;
        return (react_1.default.createElement(Tree_1.default, { classPrefix: ns, onRef: this.domRef, onlyChildren: onlyChildren, onlyLeaf: onlyLeaf, labelField: labelField, valueField: valueField, disabled: disabled, onChange: this.handleChange, joinValues: joinValues, extractValue: extractValue, delimiter: delimiter, placeholder: __(optionsPlaceholder), options: filtedOptions, highlightTxt: this.state.inputValue, multiple: multiple, initiallyOpen: initiallyOpen, unfoldedLevel: unfoldedLevel, withChildren: withChildren, autoCheckChildren: autoCheckChildren, rootLabel: __(rootLabel), rootValue: rootValue, showIcon: showIcon, showRadio: showRadio, showOutline: showOutline, cascade: cascade, foldedField: "collapsed", hideRoot: true, value: value || '', nodePath: nodePath, enableNodePath: enableNodePath, pathSeparator: pathSeparator, maxLength: maxLength, minLength: minLength, onAdd: onAdd, creatable: creatable, createTip: createTip, rootCreatable: rootCreatable, rootCreateTip: rootCreateTip, onEdit: onEdit, editable: editable, editTip: editTip, removable: removable, removeTip: removeTip, onDelete: onDelete, bultinCUD: !addControls && !editControls, onDeferLoad: deferLoad, onExpandTree: expandTreeOptions, selfDisabledAffectChildren: selfDisabledAffectChildren }));
    };
    TreeSelectControl.prototype.render = function () {
        var _this = this;
        var _a = this.props, className = _a.className, disabled = _a.disabled, inline = _a.inline, loading = _a.loading, multiple = _a.multiple, value = _a.value, clearable = _a.clearable, ns = _a.classPrefix, cx = _a.classnames, searchable = _a.searchable, autoComplete = _a.autoComplete, selectedOptions = _a.selectedOptions, placeholder = _a.placeholder, popOverContainer = _a.popOverContainer, useMobileUI = _a.useMobileUI, __ = _a.translate, env = _a.env;
        var isOpened = this.state.isOpened;
        var mobileUI = useMobileUI && (0, helper_1.isMobile)();
        return (react_1.default.createElement("div", { ref: this.container, className: cx("TreeSelectControl", className) },
            react_1.default.createElement(ResultBox_1.default, { disabled: disabled, ref: this.targetRef, placeholder: __(placeholder || 'placeholder.empty'), className: cx("TreeSelect", {
                    'TreeSelect--inline': inline,
                    'TreeSelect--single': !multiple,
                    'TreeSelect--multi': multiple,
                    'TreeSelect--searchable': searchable || (0, api_1.isEffectiveApi)(autoComplete),
                    'is-opened': this.state.isOpened,
                    'is-focused': this.state.isFocused,
                    'is-disabled': disabled
                }), result: multiple
                    ? selectedOptions
                    : selectedOptions.length
                        ? this.renderItem(selectedOptions[0])
                        : '', onResultClick: this.handleOutClick, value: this.state.inputValue, onChange: this.handleInputChange, onResultChange: this.handleResultChange, itemRender: this.renderItem, onKeyPress: this.handleKeyPress, onFocus: this.handleFocus, onBlur: this.handleBlur, onKeyDown: this.handleInputKeyDown, clearable: clearable, allowInput: searchable || (0, api_1.isEffectiveApi)(autoComplete), inputPlaceholder: '' }, loading ? react_1.default.createElement(Spinner_1.default, { size: "sm" }) : undefined),
            !mobileUI && isOpened ? (react_1.default.createElement(Overlay_1.default, { container: popOverContainer || (function () { return _this.container.current; }), target: function () { return _this.target; }, show: true },
                react_1.default.createElement(PopOver_1.default, { classPrefix: ns, className: "".concat(ns, "TreeSelect-popover"), style: {
                        minWidth: this.target ? this.target.offsetWidth : undefined
                    }, onHide: this.close, overlay: true }, this.renderOuter()))) : null,
            mobileUI ? (react_1.default.createElement(PopUp_1.default, { container: env && env.getModalContainer ? env.getModalContainer : undefined, className: cx("".concat(ns, "TreeSelect-popup")), isShow: isOpened, onHide: this.close }, this.renderOuter())) : null));
    };
    var _a, _b, _c;
    TreeSelectControl.defaultProps = {
        placeholder: 'Select.placeholder',
        optionsPlaceholder: 'placeholder.noData',
        multiple: false,
        clearable: true,
        rootLabel: 'Tree.root',
        rootValue: '',
        showIcon: true,
        joinValues: true,
        extractValue: false,
        delimiter: ',',
        resetValue: '',
        hideNodePathLabel: false,
        enableNodePath: false,
        pathSeparator: '/',
        selfDisabledAffectChildren: true
    };
    (0, tslib_1.__decorate)([
        helper_1.autobind,
        (0, tslib_1.__metadata)("design:type", Function),
        (0, tslib_1.__metadata)("design:paramtypes", [typeof (_a = typeof react_1.default !== "undefined" && react_1.default.MouseEvent) === "function" ? _a : Object]),
        (0, tslib_1.__metadata)("design:returntype", void 0)
    ], TreeSelectControl.prototype, "handleOutClick", null);
    (0, tslib_1.__decorate)([
        helper_1.autobind,
        (0, tslib_1.__metadata)("design:type", Function),
        (0, tslib_1.__metadata)("design:paramtypes", [typeof (_b = typeof Array !== "undefined" && Array) === "function" ? _b : Object]),
        (0, tslib_1.__metadata)("design:returntype", void 0)
    ], TreeSelectControl.prototype, "handleResultChange", null);
    (0, tslib_1.__decorate)([
        helper_1.autobind,
        (0, tslib_1.__metadata)("design:type", Function),
        (0, tslib_1.__metadata)("design:paramtypes", [Object]),
        (0, tslib_1.__metadata)("design:returntype", Promise)
    ], TreeSelectControl.prototype, "resultChangeEvent", null);
    (0, tslib_1.__decorate)([
        helper_1.autobind,
        (0, tslib_1.__metadata)("design:type", Function),
        (0, tslib_1.__metadata)("design:paramtypes", [typeof (_c = typeof Options_1.Option !== "undefined" && Options_1.Option) === "function" ? _c : Object]),
        (0, tslib_1.__metadata)("design:returntype", void 0)
    ], TreeSelectControl.prototype, "renderItem", null);
    (0, tslib_1.__decorate)([
        helper_1.autobind,
        (0, tslib_1.__metadata)("design:type", Function),
        (0, tslib_1.__metadata)("design:paramtypes", [Object]),
        (0, tslib_1.__metadata)("design:returntype", void 0)
    ], TreeSelectControl.prototype, "domRef", null);
    return TreeSelectControl;
}(react_1.default.Component));
exports.default = TreeSelectControl;
var TreeSelectControlRenderer = /** @class */ (function (_super) {
    (0, tslib_1.__extends)(TreeSelectControlRenderer, _super);
    function TreeSelectControlRenderer() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    TreeSelectControlRenderer = (0, tslib_1.__decorate)([
        (0, Options_1.OptionsControl)({
            type: 'tree-select'
        })
    ], TreeSelectControlRenderer);
    return TreeSelectControlRenderer;
}(TreeSelectControl));
exports.TreeSelectControlRenderer = TreeSelectControlRenderer;
//# sourceMappingURL=./renderers/Form/TreeSelect.js.map
