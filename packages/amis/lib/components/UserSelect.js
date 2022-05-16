"use strict";
/**
 * @file 移动端人员、部门、角色、岗位选择
 * @author fex
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserSelect = void 0;
var tslib_1 = require("tslib");
var react_1 = (0, tslib_1.__importDefault)(require("react"));
var theme_1 = require("../theme");
var locale_1 = require("../locale");
var components_1 = require("../components");
var Options_1 = require("../renderers/Form/Options");
var sortablejs_1 = (0, tslib_1.__importDefault)(require("sortablejs"));
var PopUp_1 = (0, tslib_1.__importDefault)(require("../components/PopUp"));
var InputBox_1 = (0, tslib_1.__importDefault)(require("../components/InputBox"));
var icons_1 = require("../components/icons");
var debounce_1 = (0, tslib_1.__importDefault)(require("lodash/debounce"));
var helper_1 = require("../utils/helper");
var Checkbox_1 = (0, tslib_1.__importDefault)(require("../components/Checkbox"));
var Select_1 = require("./Select");
var Spinner_1 = (0, tslib_1.__importDefault)(require("../components/Spinner"));
var flatten_1 = (0, tslib_1.__importDefault)(require("lodash/flatten"));
var UserSelect = /** @class */ (function (_super) {
    (0, tslib_1.__extends)(UserSelect, _super);
    function UserSelect(props) {
        var _this = _super.call(this, props) || this;
        _this.unmounted = false;
        _this.lazySearch = (0, debounce_1.default)(function (text) {
            (function (text) { return (0, tslib_1.__awaiter)(_this, void 0, void 0, function () {
                var onSearch, result;
                var _this = this;
                return (0, tslib_1.__generator)(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            onSearch = this.props.onSearch;
                            return [4 /*yield*/, onSearch(text, function (cancelExecutor) { return (_this.cancelSearch = cancelExecutor); })];
                        case 1:
                            result = _a.sent();
                            if (this.unmounted) {
                                return [2 /*return*/];
                            }
                            if (!Array.isArray(result)) {
                                throw new Error('onSearch 需要返回数组');
                            }
                            this.setState({
                                searchList: result,
                                searchLoading: false
                            });
                            return [2 /*return*/];
                    }
                });
            }); })(text).catch(function (e) {
                _this.setState({ searchLoading: false });
                console.error(e);
            });
        }, 250, {
            trailing: true,
            leading: false
        });
        _this.state = {
            isOpened: false,
            isSelectOpened: false,
            inputValue: '',
            options: _this.props.options || [],
            breadList: [],
            searchList: [],
            tempSelection: [],
            selection: props.selection || [],
            isSearch: false,
            searchLoading: false,
            isEdit: false
        };
        return _this;
    }
    UserSelect.prototype.componentDidMount = function () { };
    UserSelect.prototype.componentDidUpdate = function (prevProps) {
        var _a = this.props, options = _a.options, value = _a.value;
        if (prevProps.options !== options) {
            if (options &&
                options.length === 1 &&
                options[0].leftOptions &&
                Array.isArray(options[0].children)) {
                var leftOptions = options[0].leftOptions;
                this.setState({
                    options: leftOptions
                });
            }
            else {
                // 部门选择
                this.setState({
                    options: options
                });
            }
        }
        if (JSON.stringify(value) !== JSON.stringify(prevProps.value) ||
            JSON.stringify(options) !== JSON.stringify(prevProps.options)) {
            var selection = (0, Select_1.value2array)(value, this.props);
            this.setState({
                selection: selection
            });
        }
    };
    UserSelect.prototype.componentWillUnmount = function () {
        this.unmounted = true;
    };
    UserSelect.prototype.onClose = function () {
        this.setState({
            isOpened: false,
            isSearch: false,
            inputValue: '',
            searchList: [],
            searchLoading: false
        });
    };
    UserSelect.prototype.handleSearch = function (text) {
        var _this = this;
        if (text) {
            this.setState({
                isSearch: true,
                searchLoading: true,
                inputValue: text
            }, function () {
                // 如果有取消搜索，先取消掉。
                _this.cancelSearch && _this.cancelSearch();
                _this.lazySearch(text);
            });
        }
        else {
            this.handleSeachCancel();
        }
    };
    UserSelect.prototype.handleSeachCancel = function () {
        this.setState({
            isSearch: false,
            searchLoading: false,
            inputValue: ''
        });
    };
    UserSelect.prototype.swapSelectPosition = function (oldIndex, newIndex) {
        var tempSelection = this.state.tempSelection;
        tempSelection.splice(newIndex, 0, tempSelection.splice(oldIndex, 1)[0]);
        this.setState({ tempSelection: tempSelection });
    };
    UserSelect.prototype.dragRef = function (ref) {
        if (ref) {
            this.initDragging();
        }
    };
    UserSelect.prototype.initDragging = function () {
        var _this = this;
        var ns = this.props.classPrefix;
        this.sortable = new sortablejs_1.default(document.querySelector(".".concat(ns, "UserSelect-checkContent")), {
            group: "UserSelect-checkContent",
            animation: 150,
            handle: ".".concat(ns, "UserSelect-dragBar"),
            ghostClass: "".concat(ns, "UserSelect--dragging"),
            onEnd: function (e) {
                if (!_this.state.isEdit || e.newIndex === e.oldIndex) {
                    return;
                }
                var parent = e.to;
                if (e.oldIndex < parent.childNodes.length - 1) {
                    parent.insertBefore(e.item, parent.childNodes[e.oldIndex]);
                }
                else {
                    parent.appendChild(e.item);
                }
                _this.swapSelectPosition(e.oldIndex, e.newIndex);
            }
        });
    };
    UserSelect.prototype.destroyDragging = function () {
        this.sortable && this.sortable.destroy();
    };
    UserSelect.prototype.onOpen = function () {
        var selection = this.state.selection;
        this.setState({
            isOpened: true,
            tempSelection: selection.slice()
        });
    };
    UserSelect.prototype.handleBack = function () {
        this.setState({
            isOpened: false,
            inputValue: '',
            isSearch: false,
            searchList: [],
            breadList: []
        });
    };
    UserSelect.prototype.handleExpand = function (option) {
        var _a;
        return (0, tslib_1.__awaiter)(this, void 0, void 0, function () {
            var _b, deferLoad, isRef, isDep, deferParam, res, res, breadList;
            return (0, tslib_1.__generator)(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        _b = this.props, deferLoad = _b.deferLoad, isRef = _b.isRef, isDep = _b.isDep;
                        if (!(!option.isLoaded || (!isRef && isDep && !((_a = option.children) === null || _a === void 0 ? void 0 : _a.length)))) return [3 /*break*/, 4];
                        option.isLoaded = true;
                        deferParam = option.deferApi ? { deferApi: option.deferApi } : {};
                        if (!isRef) return [3 /*break*/, 2];
                        return [4 /*yield*/, Promise.all([
                                deferLoad(option, false, deferParam),
                                deferLoad((0, tslib_1.__assign)((0, tslib_1.__assign)({}, option), { ref: option.value }), true, deferParam)
                            ])];
                    case 1:
                        res = _c.sent();
                        option.children = (0, flatten_1.default)(res);
                        return [3 /*break*/, 4];
                    case 2: return [4 /*yield*/, deferLoad(option, false, deferParam)];
                    case 3:
                        res = _c.sent();
                        option.children = res || [];
                        _c.label = 4;
                    case 4:
                        breadList = this.state.breadList;
                        breadList.push(option);
                        this.setState({
                            breadList: breadList
                        });
                        return [2 /*return*/];
                }
            });
        });
    };
    UserSelect.prototype.handleSelectChange = function (option, isReplace) {
        var _a = this.props, multiple = _a.multiple, onChange = _a.onChange, _b = _a.valueField, valueField = _b === void 0 ? 'value' : _b, controlled = _a.controlled;
        if (controlled) {
            onChange(option);
            return;
        }
        var selection = this.state.selection.slice();
        // 直接替换的option 肯定是数组
        if (isReplace) {
            selection = option;
        }
        else {
            var selectionVals = selection.map(function (option) { return option[valueField]; });
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
        onChange(multiple ? selection : selection === null || selection === void 0 ? void 0 : selection[0]);
        this.setState({
            selection: selection
        });
        return false;
    };
    UserSelect.prototype.onDelete = function (option, isTemp) {
        if (isTemp === void 0) { isTemp = false; }
        var _a = this.props.valueField, valueField = _a === void 0 ? 'value' : _a;
        var _b = this.state, tempSelection = _b.tempSelection, selection = _b.selection;
        var _selection = isTemp ? tempSelection : selection;
        _selection = _selection.filter(function (item) { return item[valueField] !== option[valueField]; });
        if (isTemp) {
            this.setState({ tempSelection: _selection });
        }
        else {
            this.setState({ selection: _selection });
        }
    };
    UserSelect.prototype.handleBreadChange = function (option, index) {
        var breadList = this.state.breadList.slice(0, index);
        this.setState({
            breadList: breadList
        });
    };
    UserSelect.prototype.handleEdit = function () {
        var _a = this.props, multiple = _a.multiple, onChange = _a.onChange, controlled = _a.controlled;
        var _b = this.state, isEdit = _b.isEdit, tempSelection = _b.tempSelection;
        if (isEdit) {
            if (controlled) {
                onChange(multiple ? tempSelection : tempSelection === null || tempSelection === void 0 ? void 0 : tempSelection[0], true);
                this.setState({
                    isSelectOpened: false,
                    isEdit: false
                });
                return;
            }
            else {
                this.setState({
                    isSelectOpened: false,
                    isEdit: false,
                    selection: tempSelection
                });
            }
        }
        else {
            this.setState({
                isEdit: true
            });
        }
    };
    UserSelect.prototype.renderIcon = function (option, isSelect) {
        var _a = this.props, _b = _a.labelField, labelField = _b === void 0 ? 'label' : _b, cx = _a.classnames, isRef = _a.isRef;
        var isSearch = this.state.isSearch;
        if (!option.icon) {
            if (option.isRef || ((isSearch || isSelect) && isRef)) {
                return (react_1.default.createElement("span", { className: cx('UserSelect-text-userPic') }, option[labelField].slice(0, 1)));
            }
            else {
                // 没有icon默认返回部门图标
                return (react_1.default.createElement("span", { className: cx('icon', 'UserSelect-icon-box', 'department') },
                    react_1.default.createElement(icons_1.Icon, { icon: "department", className: "icon" })));
            }
        }
        // 支持角色、岗位等图标配置
        var IconHtml;
        switch (option.icon) {
            case 'user-default-department':
                IconHtml = (react_1.default.createElement("span", { className: cx('icon', 'UserSelect-icon-box', 'department') },
                    react_1.default.createElement(icons_1.Icon, { icon: "department", className: "icon" })));
                break;
            case 'user-default-role':
                IconHtml = (react_1.default.createElement("span", { className: cx('icon', 'UserSelect-icon-box', 'role') },
                    react_1.default.createElement(icons_1.Icon, { icon: "role", className: "icon" })));
                break;
            case 'user-default-post':
                IconHtml = (react_1.default.createElement("span", { className: cx('icon', 'UserSelect-icon-box', 'post') },
                    react_1.default.createElement(icons_1.Icon, { icon: "post", className: "icon" })));
                break;
            case '':
                IconHtml = (react_1.default.createElement("span", { className: cx('UserSelect-text-userPic') }, option[labelField].slice(0, 1)));
                break;
            default:
                IconHtml = (react_1.default.createElement("img", { src: option.icon, className: cx('UserSelect-userPic') }));
        }
        return IconHtml;
    };
    UserSelect.prototype.renderList = function (options, key, isSearch) {
        var _this = this;
        if (options === void 0) { options = []; }
        var _a = this.props, cx = _a.classnames, _b = _a.valueField, valueField = _b === void 0 ? 'value' : _b, _c = _a.labelField, labelField = _c === void 0 ? 'label' : _c, isDep = _a.isDep, isRef = _a.isRef, __ = _a.translate, controlled = _a.controlled;
        var selection = controlled
            ? this.props.selection || []
            : this.state.selection;
        var checkValues = selection.map(function (item) { return item[valueField]; });
        return options.length ? (react_1.default.createElement("div", { className: cx('UserSelect-memberList-box'), key: key },
            react_1.default.createElement("ul", { className: cx("UserSelect-memberList"), key: key }, options.map(function (option, index) {
                var _a;
                var hasChildren = (isRef && !option.isRef) ||
                    (isDep && (option.defer || ((_a = option.children) === null || _a === void 0 ? void 0 : _a.length)));
                var checkVisible = (isDep && isRef) ||
                    (isRef && option.isRef) ||
                    (isDep && !isRef) ||
                    isSearch;
                var userIcon = _this.renderIcon(option);
                return (react_1.default.createElement("li", { key: index },
                    checkVisible ? (react_1.default.createElement(Checkbox_1.default, { size: "sm", checked: checkValues.includes(option[valueField]), label: '', onChange: function () { return _this.handleSelectChange(option); } })) : null,
                    react_1.default.createElement("span", { className: cx('UserSelect-memberName'), onClick: function () {
                            return checkVisible
                                ? _this.handleSelectChange(option)
                                : hasChildren && _this.handleExpand(option);
                        } },
                        userIcon ? (react_1.default.createElement("span", { className: cx('UserSelect-userPic-box') }, userIcon)) : null,
                        react_1.default.createElement("span", { className: cx('UserSelect-label') }, option[labelField])),
                    !isSearch && hasChildren ? (react_1.default.createElement("span", { className: cx("UserSelect-more"), onClick: function () { return _this.handleExpand(option); } },
                        react_1.default.createElement(icons_1.Icon, { icon: "caret", className: "icon" }))) : null));
            })))) : (react_1.default.createElement("div", { className: cx("UserSelect-noRecord") },
            __('placeholder.noOption'),
            "~"));
    };
    UserSelect.prototype.renderselectList = function (options) {
        var _this = this;
        if (options === void 0) { options = []; }
        var _a = this.props, cx = _a.classnames, _b = _a.labelField, labelField = _b === void 0 ? 'label' : _b, _c = _a.valueField, valueField = _c === void 0 ? 'value' : _c, __ = _a.translate;
        var isEdit = this.state.isEdit;
        return options.length ? (react_1.default.createElement("div", { className: cx('UserSelect-selection-wrap') },
            react_1.default.createElement("ul", { className: cx("UserSelect-selection", "UserSelect-checkContent"), ref: this.dragRef }, options.map(function (option, index) {
                var userIcon = _this.renderIcon(option, true);
                var options = _this.state.options;
                var originOption = (0, helper_1.findTree)(options, function (item) { return item[valueField] === option[valueField]; });
                return (react_1.default.createElement("li", { key: index },
                    isEdit ? (react_1.default.createElement("span", { className: cx("UserSelect-del"), onClick: function () { return _this.onDelete(option, true); } },
                        react_1.default.createElement(icons_1.Icon, { icon: "user-remove", className: "icon" }))) : null,
                    react_1.default.createElement("span", { className: cx("UserSelect-memberName") },
                        userIcon ? (react_1.default.createElement("span", { className: cx('UserSelect-userPic-box') }, userIcon)) : null,
                        react_1.default.createElement("span", { className: cx('UserSelect-label') }, originOption
                            ? originOption[labelField]
                            : option[labelField])),
                    isEdit ? (react_1.default.createElement("a", { className: cx('UserSelect-dragBar') },
                        react_1.default.createElement(icons_1.Icon, { icon: "drag-bar", className: cx('icon') }))) : null));
            })))) : (react_1.default.createElement("div", { className: cx("UserSelect-noRecord") },
            __('placeholder.noOption'),
            "~"));
    };
    UserSelect.prototype.renderContent = function () {
        var _this = this;
        var _a = this.props, navTitle = _a.navTitle, showNav = _a.showNav, searchable = _a.searchable, searchPlaceholder = _a.searchPlaceholder, controlled = _a.controlled, _b = _a.labelField, labelField = _b === void 0 ? 'label' : _b, _c = _a.valueField, valueField = _c === void 0 ? 'value' : _c, cx = _a.classnames, __ = _a.translate;
        var _d = this.state, breadList = _d.breadList, options = _d.options, isSearch = _d.isSearch, searchList = _d.searchList, searchLoading = _d.searchLoading;
        var selection = controlled
            ? this.props.selection || []
            : this.state.selection;
        return (react_1.default.createElement("div", { className: cx("UserSelect-wrap") },
            showNav ? (react_1.default.createElement("div", { className: cx('UserSelect-navbar') },
                react_1.default.createElement("span", { className: "left-arrow-box", onClick: this.handleBack },
                    react_1.default.createElement(icons_1.Icon, { icon: "left-arrow", className: "icon" })),
                react_1.default.createElement("div", { className: cx('UserSelect-navbar-title') }, navTitle))) : null,
            searchable ? (react_1.default.createElement("div", { className: cx('UserSelect-searchBox') },
                react_1.default.createElement(InputBox_1.default, { className: cx("UserSelect-search"), value: this.state.inputValue, onChange: this.handleSearch, placeholder: searchPlaceholder, clearable: false }, this.state.isSearch ? (react_1.default.createElement("a", { onClick: this.handleSeachCancel },
                    react_1.default.createElement(icons_1.Icon, { icon: "close", className: "icon" }))) : (react_1.default.createElement(icons_1.Icon, { icon: "search", className: "icon" }))))) : null,
            breadList.length ? (react_1.default.createElement("div", { className: cx('UserSelect-breadcrumb') }, breadList
                .map(function (item, index) { return (react_1.default.createElement("span", { className: cx('UserSelect-breadcrumb-item'), key: index, onClick: function () { return _this.handleBreadChange(item, index); } }, item[labelField])); })
                .reduce(function (prev, curr, index) { return [
                prev,
                react_1.default.createElement(icons_1.Icon, { icon: "caret", className: cx('UserSelect-breadcrumb-separator', 'icon'), key: "separator-".concat(index) }),
                curr
            ]; }))) : null,
            (selection === null || selection === void 0 ? void 0 : selection.length) ? (react_1.default.createElement("div", { className: cx("UserSelect-resultBox") },
                react_1.default.createElement("ul", { className: cx("UserSelect-selectList") }, selection.map(function (item, index) {
                    var originOption = (0, helper_1.findTree)(options, function (op) { return op[valueField] === item[valueField]; });
                    return (react_1.default.createElement("li", { key: index, className: cx('UserSelect-selectList-item') },
                        react_1.default.createElement("span", null, originOption
                            ? originOption[labelField]
                            : item[labelField]),
                        react_1.default.createElement("span", { className: cx('UserSelect-selectList-item-closeBox'), onClick: function () { return _this.onDelete(item); } },
                            react_1.default.createElement(icons_1.Icon, { icon: "close", className: "icon" }))));
                })),
                react_1.default.createElement("span", { className: cx('UserSelect-selectSort-box'), onClick: function () {
                        return _this.setState({
                            isSelectOpened: true,
                            tempSelection: selection.slice()
                        });
                    } },
                    react_1.default.createElement(icons_1.Icon, { icon: "menu", className: cx('UserSelect-selectSort', 'icon') })))) : null,
            isSearch ? (searchLoading ? (react_1.default.createElement("div", { className: cx("UserSelect-searchLoadingBox") },
                react_1.default.createElement(Spinner_1.default, null))) : (react_1.default.createElement("div", { className: cx('UserSelect-searchResult') }, this.renderList(searchList, -1, true)))) : (react_1.default.createElement("div", { className: cx("UserSelect-contentBox") },
                react_1.default.createElement("div", { className: cx("UserSelect-scroll"), style: {
                        width: 100 * (breadList.length + 1) + 'vw',
                        left: -breadList.length * 100 + 'vw'
                    } },
                    this.renderList(options),
                    breadList.map(function (option, index) {
                        var treeOption = (0, helper_1.findTree)(options, (0, Select_1.optionValueCompare)(option[valueField], valueField || 'value'));
                        var children = treeOption.children;
                        var hasChildren = Array.isArray(children) && children;
                        return hasChildren ? (_this.renderList(children, option[valueField])) : (react_1.default.createElement("div", { className: cx("UserSelect-spinnerBox"), key: index },
                            react_1.default.createElement(Spinner_1.default, null)));
                    }))))));
    };
    UserSelect.prototype.render = function () {
        var _this = this;
        var _a = this.props, cx = _a.classnames, __ = _a.translate, _b = _a.placeholder, placeholder = _b === void 0 ? '请选择' : _b, showResultBox = _a.showResultBox, controlled = _a.controlled, onChange = _a.onChange;
        var _c = this.state, isOpened = _c.isOpened, tempSelection = _c.tempSelection, isSelectOpened = _c.isSelectOpened, isEdit = _c.isEdit;
        var selection = controlled ? this.props.selection : this.state.selection;
        return (react_1.default.createElement("div", { className: cx('UserSelect') },
            showResultBox ? (react_1.default.createElement(components_1.ResultBox, { className: cx('UserSelect-input', isOpened ? 'is-active' : ''), allowInput: false, result: selection, onResultChange: function (value) { return _this.handleSelectChange(value, true); }, onResultClick: this.onOpen, placeholder: placeholder, useMobileUI: true })) : null,
            showResultBox ? (react_1.default.createElement(PopUp_1.default, { isShow: isOpened, className: cx("UserSelect-popup"), onHide: this.onClose, showClose: false }, this.renderContent())) : (this.renderContent()),
            react_1.default.createElement(PopUp_1.default, { isShow: isSelectOpened, className: cx("UserSelect-selectPopup"), onHide: function () {
                    return _this.setState({
                        isSelectOpened: false,
                        isEdit: false
                    });
                }, showClose: false },
                react_1.default.createElement("div", { className: cx('UserSelect-selectBody') },
                    react_1.default.createElement("div", { className: cx('UserSelect-navbar') },
                        react_1.default.createElement("span", { className: "left-arrow-box", onClick: function () {
                                return _this.setState({
                                    isSelectOpened: false,
                                    isEdit: false
                                });
                            } },
                            react_1.default.createElement(icons_1.Icon, { icon: "left-arrow", className: "icon" })),
                        react_1.default.createElement("div", { className: cx('UserSelect-navbar-title') }, __('UserSelect.resultSort')),
                        react_1.default.createElement("span", { className: cx('UserSelect-navbar-btnEdit'), onClick: this.handleEdit }, isEdit ? __('UserSelect.save') : __('UserSelect.edit'))),
                    react_1.default.createElement("div", { className: cx('UserSelect-selectList-box') },
                        react_1.default.createElement("div", { className: cx('UserSelect-select-head') },
                            react_1.default.createElement("span", { className: cx('UserSelect-select-head-text') }, __('UserSelect.selected')),
                            isEdit ? (react_1.default.createElement("span", { className: cx('UserSelect-select-head-btnClear'), onClick: function () { return _this.setState({ tempSelection: [] }); } }, __('UserSelect.clear'))) : null),
                        this.renderselectList(tempSelection))))));
    };
    var _a, _b, _c, _d;
    UserSelect.defaultProps = {
        showResultBox: true,
        labelField: 'label',
        valueField: 'value'
    };
    (0, tslib_1.__decorate)([
        helper_1.autobind,
        (0, tslib_1.__metadata)("design:type", Function),
        (0, tslib_1.__metadata)("design:paramtypes", []),
        (0, tslib_1.__metadata)("design:returntype", void 0)
    ], UserSelect.prototype, "onClose", null);
    (0, tslib_1.__decorate)([
        helper_1.autobind,
        (0, tslib_1.__metadata)("design:type", Function),
        (0, tslib_1.__metadata)("design:paramtypes", [String]),
        (0, tslib_1.__metadata)("design:returntype", void 0)
    ], UserSelect.prototype, "handleSearch", null);
    (0, tslib_1.__decorate)([
        helper_1.autobind,
        (0, tslib_1.__metadata)("design:type", Function),
        (0, tslib_1.__metadata)("design:paramtypes", []),
        (0, tslib_1.__metadata)("design:returntype", void 0)
    ], UserSelect.prototype, "handleSeachCancel", null);
    (0, tslib_1.__decorate)([
        helper_1.autobind,
        (0, tslib_1.__metadata)("design:type", Function),
        (0, tslib_1.__metadata)("design:paramtypes", [Object]),
        (0, tslib_1.__metadata)("design:returntype", void 0)
    ], UserSelect.prototype, "dragRef", null);
    (0, tslib_1.__decorate)([
        helper_1.autobind,
        (0, tslib_1.__metadata)("design:type", Function),
        (0, tslib_1.__metadata)("design:paramtypes", []),
        (0, tslib_1.__metadata)("design:returntype", void 0)
    ], UserSelect.prototype, "onOpen", null);
    (0, tslib_1.__decorate)([
        helper_1.autobind,
        (0, tslib_1.__metadata)("design:type", Function),
        (0, tslib_1.__metadata)("design:paramtypes", []),
        (0, tslib_1.__metadata)("design:returntype", void 0)
    ], UserSelect.prototype, "handleBack", null);
    (0, tslib_1.__decorate)([
        helper_1.autobind,
        (0, tslib_1.__metadata)("design:type", Function),
        (0, tslib_1.__metadata)("design:paramtypes", [typeof (_a = typeof Options_1.Option !== "undefined" && Options_1.Option) === "function" ? _a : Object]),
        (0, tslib_1.__metadata)("design:returntype", Promise)
    ], UserSelect.prototype, "handleExpand", null);
    (0, tslib_1.__decorate)([
        helper_1.autobind,
        (0, tslib_1.__metadata)("design:type", Function),
        (0, tslib_1.__metadata)("design:paramtypes", [typeof (_b = typeof Options_1.Option !== "undefined" && Options_1.Option) === "function" ? _b : Object, Boolean]),
        (0, tslib_1.__metadata)("design:returntype", void 0)
    ], UserSelect.prototype, "handleSelectChange", null);
    (0, tslib_1.__decorate)([
        helper_1.autobind,
        (0, tslib_1.__metadata)("design:type", Function),
        (0, tslib_1.__metadata)("design:paramtypes", [typeof (_c = typeof Options_1.Option !== "undefined" && Options_1.Option) === "function" ? _c : Object, Boolean]),
        (0, tslib_1.__metadata)("design:returntype", void 0)
    ], UserSelect.prototype, "onDelete", null);
    (0, tslib_1.__decorate)([
        helper_1.autobind,
        (0, tslib_1.__metadata)("design:type", Function),
        (0, tslib_1.__metadata)("design:paramtypes", [typeof (_d = typeof Options_1.Option !== "undefined" && Options_1.Option) === "function" ? _d : Object, Number]),
        (0, tslib_1.__metadata)("design:returntype", void 0)
    ], UserSelect.prototype, "handleBreadChange", null);
    (0, tslib_1.__decorate)([
        helper_1.autobind,
        (0, tslib_1.__metadata)("design:type", Function),
        (0, tslib_1.__metadata)("design:paramtypes", []),
        (0, tslib_1.__metadata)("design:returntype", void 0)
    ], UserSelect.prototype, "handleEdit", null);
    return UserSelect;
}(react_1.default.Component));
exports.UserSelect = UserSelect;
exports.default = (0, theme_1.themeable)((0, locale_1.localeable)(UserSelect));
//# sourceMappingURL=./components/UserSelect.js.map
