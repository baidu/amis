"use strict";
/**
 * @file Tree
 * @description 树形组件
 * @author fex
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.TreeSelector = void 0;
var tslib_1 = require("tslib");
var react_1 = (0, tslib_1.__importDefault)(require("react"));
var helper_1 = require("../utils/helper");
var Select_1 = require("./Select");
var theme_1 = require("../theme");
var Options_1 = require("../renderers/Form/Options");
var icons_1 = require("./icons");
var Checkbox_1 = (0, tslib_1.__importDefault)(require("./Checkbox"));
var locale_1 = require("../locale");
var Spinner_1 = (0, tslib_1.__importDefault)(require("./Spinner"));
var TreeSelector = /** @class */ (function (_super) {
    (0, tslib_1.__extends)(TreeSelector, _super);
    function TreeSelector(props) {
        var _this = _super.call(this, props) || this;
        _this.unfolded = new WeakMap();
        _this.startPoint = {
            x: 0,
            y: 0
        };
        _this.root = react_1.default.createRef();
        _this.state = {
            value: (0, Select_1.value2array)(props.value, {
                multiple: props.multiple,
                delimiter: props.delimiter,
                valueField: props.valueField,
                labelField: props.labelField,
                options: props.options,
                pathSeparator: props.pathSeparator
            }, props.enableNodePath),
            inputValue: '',
            addingParent: null,
            isAdding: false,
            isEditing: false,
            editingItem: null,
            dropIndicator: undefined
        };
        _this.syncUnFolded(props);
        return _this;
    }
    TreeSelector.prototype.componentDidMount = function () {
        var _a, _b;
        var enableNodePath = this.props.enableNodePath;
        // onRef只有渲染器的情况才会使用
        (_b = (_a = this.props).onRef) === null || _b === void 0 ? void 0 : _b.call(_a, this);
        enableNodePath && this.expandLazyLoadNodes();
    };
    TreeSelector.prototype.componentDidUpdate = function (prevProps) {
        var props = this.props;
        if (prevProps.options !== props.options) {
            this.syncUnFolded(props);
        }
        if (prevProps.value !== props.value ||
            prevProps.options !== props.options) {
            this.setState({
                value: (0, Select_1.value2array)(props.value, {
                    multiple: props.multiple,
                    delimiter: props.delimiter,
                    valueField: props.valueField,
                    options: props.options
                }, props.enableNodePath)
            });
        }
    };
    /**
     * 展开懒加载节点的父节点
     */
    TreeSelector.prototype.expandLazyLoadNodes = function () {
        var _a = this.props, pathSeparator = _a.pathSeparator, onExpandTree = _a.onExpandTree, _b = _a.nodePath, nodePath = _b === void 0 ? [] : _b;
        var nodePathArr = nodePath.map(function (path) {
            return path ? path.toString().split(pathSeparator) : [];
        });
        onExpandTree === null || onExpandTree === void 0 ? void 0 : onExpandTree(nodePathArr);
    };
    TreeSelector.prototype.syncUnFolded = function (props, unfoldedLevel) {
        // 传入默认展开层级需要重新初始化unfolded
        var initFoldedLevel = typeof unfoldedLevel !== 'undefined';
        var expandLevel = Number(initFoldedLevel ? unfoldedLevel : props.unfoldedLevel) - 1;
        // 初始化树节点的展开状态
        var unfolded = this.unfolded;
        var _a = this.props, foldedField = _a.foldedField, unfoldedField = _a.unfoldedField;
        (0, helper_1.eachTree)(props.options, function (node, index, level) {
            if (unfolded.has(node) && !initFoldedLevel) {
                return;
            }
            if (node.children && node.children.length) {
                var ret = true;
                if (node.defer && node.loaded && !initFoldedLevel) {
                    ret = true;
                }
                else if (unfoldedField &&
                    typeof node[unfoldedField] !== 'undefined') {
                    ret = !!node[unfoldedField];
                }
                else if (foldedField && typeof node[foldedField] !== 'undefined') {
                    ret = !node[foldedField];
                }
                else {
                    ret = !!props.initiallyOpen && !initFoldedLevel;
                    if (!ret && level <= expandLevel) {
                        ret = true;
                    }
                }
                unfolded.set(node, ret);
            }
        });
        initFoldedLevel && this.forceUpdate();
        return unfolded;
    };
    TreeSelector.prototype.toggleUnfolded = function (node) {
        var unfolded = this.unfolded;
        var onDeferLoad = this.props.onDeferLoad;
        if (node.defer && !node.loaded) {
            onDeferLoad === null || onDeferLoad === void 0 ? void 0 : onDeferLoad(node);
            return;
        }
        unfolded.set(node, !unfolded.get(node));
        this.forceUpdate();
    };
    TreeSelector.prototype.isUnfolded = function (node) {
        var unfolded = this.unfolded;
        return unfolded.get(node);
    };
    TreeSelector.prototype.clearSelect = function () {
        var _this = this;
        this.setState({
            value: []
        }, function () {
            var _a = _this.props, joinValues = _a.joinValues, rootValue = _a.rootValue, onChange = _a.onChange;
            onChange(joinValues ? rootValue : []);
        });
    };
    /**
     * enableNodePath为true时，将label和value转换成node path格式
     */
    TreeSelector.prototype.transform2NodePath = function (value) {
        var _a = this.props, multiple = _a.multiple, options = _a.options, valueField = _a.valueField, labelField = _a.labelField, joinValues = _a.joinValues, extractValue = _a.extractValue, pathSeparator = _a.pathSeparator, delimiter = _a.delimiter;
        var nodesValuePath = [];
        var selectedNodes = Array.isArray(value) ? value.concat() : [value];
        var selectedNodesPath = selectedNodes.map(function (node) {
            var _a, _b;
            var _c;
            var nodePath = (_c = (0, helper_1.getTreeAncestors)(options, node, true)) === null || _c === void 0 ? void 0 : _c.reduce(function (acc, node) {
                acc[labelField].push(node[labelField]);
                acc[valueField].push(node[valueField]);
                return acc;
            }, (_a = {}, _a[labelField] = [], _a[valueField] = [], _a));
            var nodeValuePath = nodePath[valueField].join(pathSeparator);
            nodesValuePath.push(nodeValuePath);
            return (0, tslib_1.__assign)((0, tslib_1.__assign)({}, node), (_b = {}, _b[labelField] = nodePath[labelField].join(pathSeparator), _b[valueField] = nodeValuePath, _b));
        });
        if (multiple) {
            return joinValues
                ? nodesValuePath.join(delimiter)
                : extractValue
                    ? nodesValuePath
                    : selectedNodesPath;
        }
        else {
            return joinValues || extractValue
                ? selectedNodesPath[0][valueField]
                : selectedNodesPath[0];
        }
    };
    TreeSelector.prototype.handleSelect = function (node, value) {
        var _this = this;
        var _a = this.props, joinValues = _a.joinValues, valueField = _a.valueField, onChange = _a.onChange, enableNodePath = _a.enableNodePath, onlyLeaf = _a.onlyLeaf;
        if (node[valueField] === undefined) {
            if (node.defer && !node.loaded) {
                this.toggleUnfolded(node);
            }
            return;
        }
        if (onlyLeaf && node.children) {
            return;
        }
        this.setState({
            value: [node]
        }, function () {
            onChange(enableNodePath
                ? _this.transform2NodePath(node)
                : joinValues
                    ? node[valueField]
                    : node);
        });
    };
    TreeSelector.prototype.handleCheck = function (item, checked) {
        var _this = this;
        var props = this.props;
        var value = this.state.value.concat();
        var idx = value.indexOf(item);
        var onlyChildren = props.onlyChildren, withChildren = props.withChildren, cascade = props.cascade, autoCheckChildren = props.autoCheckChildren;
        if (checked) {
            ~idx || value.push(item);
            // cascade 为 true 表示父节点跟子节点没有级联关系。
            if (autoCheckChildren) {
                var children = item.children ? item.children.concat([]) : [];
                if (onlyChildren) {
                    // 父级选中的时候，子节点也都选中，但是自己不选中
                    !~idx && children.length && value.pop();
                    while (children.length) {
                        var child = children.shift();
                        var index = value.indexOf(child);
                        if (child.children && child.children.length) {
                            children.push.apply(children, child.children);
                        }
                        else if (!~index && child.value !== 'undefined') {
                            value.push(child);
                        }
                    }
                }
                else {
                    // 只要父节点选择了,子节点就不需要了,全部去掉勾选.  withChildren时相反
                    while (children.length) {
                        var child = children.shift();
                        var index = value.indexOf(child);
                        if (~index) {
                            value.splice(index, 1);
                        }
                        if (withChildren || cascade) {
                            value.push(child);
                        }
                        if (child.children && child.children.length) {
                            children.push.apply(children, child.children);
                        }
                    }
                    var toCheck = item;
                    while (true) {
                        var parent = (0, helper_1.getTreeParent)(props.options, toCheck);
                        if (parent === null || parent === void 0 ? void 0 : parent.value) {
                            // 如果所有孩子节点都勾选了，应该自动勾选父级。
                            if (parent.children.every(function (child) { return ~value.indexOf(child); })) {
                                if (!cascade && !withChildren) {
                                    parent.children.forEach(function (child) {
                                        var index = value.indexOf(child);
                                        if (~index) {
                                            value.splice(index, 1);
                                        }
                                    });
                                }
                                value.push(parent);
                                toCheck = parent;
                                continue;
                            }
                        }
                        break;
                    }
                }
            }
        }
        else {
            ~idx && value.splice(idx, 1);
            if (autoCheckChildren) {
                if (cascade || withChildren || onlyChildren) {
                    var children = item.children ? item.children.concat([]) : [];
                    while (children.length) {
                        var child = children.shift();
                        var index = value.indexOf(child);
                        if (~index) {
                            value.splice(index, 1);
                        }
                        if (child.children && child.children.length) {
                            children.push.apply(children, child.children);
                        }
                    }
                }
            }
        }
        this.setState({
            value: value
        }, function () {
            var joinValues = props.joinValues, extractValue = props.extractValue, valueField = props.valueField, delimiter = props.delimiter, onChange = props.onChange, enableNodePath = props.enableNodePath;
            onChange(enableNodePath
                ? _this.transform2NodePath(value)
                : joinValues
                    ? value.map(function (item) { return item[valueField]; }).join(delimiter)
                    : extractValue
                        ? value.map(function (item) { return item[valueField]; })
                        : value);
        });
    };
    TreeSelector.prototype.handleAdd = function (parent) {
        if (parent === void 0) { parent = null; }
        var _a = this.props, bultinCUD = _a.bultinCUD, onAdd = _a.onAdd, options = _a.options;
        if (!bultinCUD) {
            var idxes = (0, helper_1.findTreeIndex)(options, function (item) { return item === parent; }) || [];
            return onAdd && onAdd(idxes.concat(0));
        }
        else {
            this.setState({
                isEditing: false,
                isAdding: true,
                addingParent: parent
            });
        }
    };
    TreeSelector.prototype.handleEdit = function (item) {
        var _a = this.props, bultinCUD = _a.bultinCUD, onEdit = _a.onEdit, labelField = _a.labelField, options = _a.options;
        if (!bultinCUD) {
            onEdit === null || onEdit === void 0 ? void 0 : onEdit(item);
        }
        else {
            this.setState({
                isEditing: true,
                isAdding: false,
                editingItem: item,
                inputValue: item[labelField]
            });
        }
    };
    TreeSelector.prototype.handleRemove = function (item) {
        var onDelete = this.props.onDelete;
        onDelete && onDelete(item);
    };
    TreeSelector.prototype.handleInputChange = function (e) {
        this.setState({
            inputValue: e.currentTarget.value
        });
    };
    TreeSelector.prototype.handleConfirm = function () {
        var _a = this.state, value = _a.inputValue, isAdding = _a.isAdding, addingParent = _a.addingParent, editingItem = _a.editingItem, isEditing = _a.isEditing;
        if (!value) {
            return;
        }
        var _b = this.props, labelField = _b.labelField, onAdd = _b.onAdd, options = _b.options, onEdit = _b.onEdit;
        this.setState({
            inputValue: '',
            isAdding: false,
            isEditing: false
        }, function () {
            var _a, _b;
            if (isAdding && onAdd) {
                var idxes = (addingParent &&
                    (0, helper_1.findTreeIndex)(options, function (item) { return item === addingParent; })) ||
                    [];
                onAdd(idxes.concat(0), (_a = {}, _a[labelField] = value, _a), true);
            }
            else if (isEditing && onEdit) {
                onEdit((0, tslib_1.__assign)((0, tslib_1.__assign)({}, editingItem), (_b = {}, _b[labelField] = value, _b)), editingItem, true);
            }
        });
    };
    TreeSelector.prototype.handleCancel = function () {
        this.setState({
            inputValue: '',
            isAdding: false,
            isEditing: false
        });
    };
    TreeSelector.prototype.renderInput = function (prfix) {
        if (prfix === void 0) { prfix = null; }
        var _a = this.props, cx = _a.classnames, __ = _a.translate;
        var inputValue = this.state.inputValue;
        return (react_1.default.createElement("div", { className: cx('Tree-itemLabel') },
            react_1.default.createElement("div", { className: cx('Tree-itemInput') },
                prfix,
                react_1.default.createElement("input", { onChange: this.handleInputChange, value: inputValue, placeholder: __('placeholder.enter') }),
                react_1.default.createElement("a", { "data-tooltip": __('cancel'), onClick: this.handleCancel },
                    react_1.default.createElement(icons_1.Icon, { icon: "close", className: "icon" })),
                react_1.default.createElement("a", { "data-tooltip": __('confirm'), onClick: this.handleConfirm },
                    react_1.default.createElement(icons_1.Icon, { icon: "check", className: "icon" })))));
    };
    TreeSelector.prototype.getOffsetPosition = function (element) {
        var left = 0;
        var top = 0;
        while (element.offsetParent) {
            left += element.offsetLeft;
            top += element.offsetTop;
            element = element.offsetParent;
        }
        return { left: left, top: top };
    };
    TreeSelector.prototype.getDropInfo = function (e, node) {
        var _a;
        var rect = e.currentTarget.getBoundingClientRect();
        var dragNode = this.dragNode;
        var deltaX = Math.min(50, rect.width * 0.3);
        var gap = ((_a = node === null || node === void 0 ? void 0 : node.children) === null || _a === void 0 ? void 0 : _a.length) ? 0 : 16;
        // 计算相对位置
        var offset = this.getOffsetPosition(this.root.current);
        var targetOffset = this.getOffsetPosition(e.currentTarget);
        var left = targetOffset.left - offset.left;
        var top = targetOffset.top - offset.top;
        var clientX = e.clientX, clientY = e.clientY;
        var position = clientY >= rect.top + rect.height / 2 ? 'bottom' : 'top';
        var indicator;
        if (position === 'bottom' && clientX >= this.startPoint.x + deltaX) {
            position = 'self';
            indicator = {
                top: top,
                left: left,
                width: rect.width,
                height: rect.height
            };
        }
        else {
            indicator = {
                top: position === 'bottom' ? top + rect.height : top,
                left: left + gap,
                width: rect.width - gap
            };
        }
        return {
            node: node,
            dragNode: dragNode,
            position: position,
            indicator: indicator
        };
    };
    TreeSelector.prototype.updateDropIndicator = function (e, node) {
        var _a;
        var gap = ((_a = node === null || node === void 0 ? void 0 : node.children) === null || _a === void 0 ? void 0 : _a.length) ? 0 : 16;
        this.dropInfo = this.getDropInfo(e, node);
        var _b = this.dropInfo, dragNode = _b.dragNode, indicator = _b.indicator;
        if (node === dragNode) {
            this.setState({ dropIndicator: undefined });
            return;
        }
        this.setState({
            dropIndicator: indicator
        });
    };
    TreeSelector.prototype.onDragStart = function (node) {
        var _this = this;
        var draggable = this.props.draggable;
        return function (e) {
            var _a;
            if (draggable) {
                e.dataTransfer.effectAllowed = 'copyMove';
                _this.dragNode = node;
                _this.dropInfo = null;
                _this.startPoint = {
                    x: e.clientX,
                    y: e.clientY
                };
                if ((_a = node === null || node === void 0 ? void 0 : node.children) === null || _a === void 0 ? void 0 : _a.length) {
                    _this.unfolded.set(node, false);
                    _this.forceUpdate();
                }
            }
            else {
                _this.dragNode = null;
                _this.dropInfo = null;
            }
            e.stopPropagation();
        };
    };
    TreeSelector.prototype.onDragOver = function (node) {
        var _this = this;
        return function (e) {
            if (!_this.dragNode) {
                return;
            }
            _this.updateDropIndicator(e, node);
            e.preventDefault();
        };
    };
    TreeSelector.prototype.onDragEnd = function (dragNode) {
        var _this = this;
        return function (e) {
            var _a, _b, _c;
            _this.setState({
                dropIndicator: undefined
            });
            var node = (_a = _this.dropInfo) === null || _a === void 0 ? void 0 : _a.node;
            if (!_this.dropInfo || !node || dragNode === node) {
                return;
            }
            (_c = (_b = _this.props).onMove) === null || _c === void 0 ? void 0 : _c.call(_b, _this.dropInfo);
            _this.dragNode = null;
            _this.dropInfo = null;
            e.preventDefault();
        };
    };
    TreeSelector.prototype.renderList = function (list, value, uncheckable) {
        var _this = this;
        var _a = this.props, itemClassName = _a.itemClassName, showIcon = _a.showIcon, showRadio = _a.showRadio, multiple = _a.multiple, disabled = _a.disabled, labelField = _a.labelField, valueField = _a.valueField, iconField = _a.iconField, disabledField = _a.disabledField, autoCheckChildren = _a.autoCheckChildren, cascade = _a.cascade, selfDisabledAffectChildren = _a.selfDisabledAffectChildren, onlyChildren = _a.onlyChildren, cx = _a.classnames, highlightTxt = _a.highlightTxt, options = _a.options, maxLength = _a.maxLength, minLength = _a.minLength, creatable = _a.creatable, editable = _a.editable, removable = _a.removable, createTip = _a.createTip, editTip = _a.editTip, removeTip = _a.removeTip, __ = _a.translate, draggable = _a.draggable;
        var _b = this.state, stateValue = _b.value, isAdding = _b.isAdding, addingParent = _b.addingParent, editingItem = _b.editingItem, isEditing = _b.isEditing;
        var childrenChecked = 0;
        var ret = list.map(function (item, key) {
            if (!(0, helper_1.isVisible)(item, options)) {
                return null;
            }
            var checked = !!~value.indexOf(item);
            var selfDisabled = item[disabledField];
            var selfChecked = !!uncheckable || checked;
            var childrenItems = null;
            var selfChildrenChecked = false;
            if (item.children && item.children.length) {
                childrenItems = _this.renderList(item.children, value, !autoCheckChildren || cascade
                    ? false
                    : uncheckable ||
                        (selfDisabledAffectChildren ? selfDisabled : false) ||
                        (multiple && checked));
                selfChildrenChecked = !!childrenItems.childrenChecked;
                if (!selfChecked &&
                    onlyChildren &&
                    autoCheckChildren &&
                    item.children.length === childrenItems.childrenChecked) {
                    selfChecked = true;
                }
                childrenItems = childrenItems.dom;
            }
            if ((onlyChildren ? selfChecked : selfChildrenChecked) || checked) {
                childrenChecked++;
            }
            var nodeDisabled = !!uncheckable || !!disabled || selfDisabled
                || (multiple && !autoCheckChildren && !item[valueField]);
            if (!nodeDisabled &&
                ((maxLength && !selfChecked && stateValue.length >= maxLength) ||
                    (minLength && selfChecked && stateValue.length <= minLength))) {
                nodeDisabled = true;
            }
            var checkbox = multiple ? (react_1.default.createElement(Checkbox_1.default, { size: "sm", disabled: nodeDisabled, checked: selfChecked || (autoCheckChildren && selfChildrenChecked), partial: !selfChecked, onChange: _this.handleCheck.bind(_this, item, !selfChecked) })) : showRadio ? (react_1.default.createElement(Checkbox_1.default, { size: "sm", disabled: nodeDisabled, checked: checked, onChange: _this.handleSelect.bind(_this, item) })) : null;
            var isLeaf = (!item.children || !item.children.length) && !item.placeholder;
            var iconValue = item[iconField] || (childrenItems ? 'folder' : 'file');
            return (react_1.default.createElement("li", { key: key, className: cx("Tree-item ".concat(itemClassName || ''), {
                    'Tree-item--isLeaf': isLeaf
                }) },
                isEditing && editingItem === item ? (_this.renderInput(checkbox)) : (react_1.default.createElement("div", { className: cx('Tree-itemLabel', {
                        'is-children-checked': multiple && !cascade && selfChildrenChecked && !nodeDisabled,
                        'is-checked': checked,
                        'is-disabled': nodeDisabled
                    }), draggable: draggable, onDragStart: _this.onDragStart(item), onDragOver: _this.onDragOver(item), onDragEnd: _this.onDragEnd(item) },
                    draggable && (react_1.default.createElement("a", { className: cx('Tree-itemDrager drag-bar') },
                        react_1.default.createElement(icons_1.Icon, { icon: "drag-bar", className: "icon" }))),
                    item.loading ? (react_1.default.createElement(Spinner_1.default, { size: "sm", show: true, icon: "reload", spinnerClassName: cx('Tree-spinner') })) : !isLeaf || (item.defer && !item.loaded) ? (react_1.default.createElement("div", { onClick: function () { return _this.toggleUnfolded(item); }, className: cx('Tree-itemArrow', {
                            'is-folded': !_this.isUnfolded(item)
                        }) },
                        react_1.default.createElement(icons_1.Icon, { icon: "right-arrow-bold", className: "icon" }))) : (react_1.default.createElement("span", { className: cx('Tree-itemArrowPlaceholder') })),
                    checkbox,
                    showIcon ? (react_1.default.createElement("i", { className: cx("Tree-itemIcon ".concat(childrenItems ? 'Tree-folderIcon' : 'Tree-leafIcon')), onClick: function () {
                            return !nodeDisabled &&
                                (multiple
                                    ? _this.handleCheck(item, !selfChecked)
                                    : _this.handleSelect(item));
                        } }, (0, icons_1.getIcon)(iconValue) ? (react_1.default.createElement(icons_1.Icon, { icon: iconValue, className: "icon" })) : (react_1.default.createElement("i", { className: iconValue })))) : null,
                    react_1.default.createElement("span", { className: cx('Tree-itemText'), onClick: function () {
                            return !nodeDisabled &&
                                (multiple
                                    ? _this.handleCheck(item, !selfChecked)
                                    : _this.handleSelect(item));
                        } }, highlightTxt
                        ? (0, Options_1.highlight)("".concat(item[labelField]), highlightTxt)
                        : "".concat(item[labelField])),
                    !nodeDisabled &&
                        !isAdding &&
                        !isEditing &&
                        !(item.defer && !item.loaded) ? (react_1.default.createElement("div", { className: cx('Tree-item-icons') },
                        creatable && (0, helper_1.hasAbility)(item, 'creatable') ? (react_1.default.createElement("a", { onClick: _this.handleAdd.bind(_this, item), "data-tooltip": __(createTip), "data-position": "left" },
                            react_1.default.createElement(icons_1.Icon, { icon: "plus", className: "icon" }))) : null,
                        removable && (0, helper_1.hasAbility)(item, 'removable') ? (react_1.default.createElement("a", { onClick: _this.handleRemove.bind(_this, item), "data-tooltip": __(removeTip), "data-position": "left" },
                            react_1.default.createElement(icons_1.Icon, { icon: "minus", className: "icon" }))) : null,
                        editable && (0, helper_1.hasAbility)(item, 'editable') ? (react_1.default.createElement("a", { onClick: _this.handleEdit.bind(_this, item), "data-tooltip": __(editTip), "data-position": "left" },
                            react_1.default.createElement(icons_1.Icon, { icon: "pencil", className: "icon" }))) : null)) : null)),
                (childrenItems && _this.isUnfolded(item)) ||
                    (isAdding && addingParent === item) ? (react_1.default.createElement("ul", { className: cx('Tree-sublist') },
                    isAdding && addingParent === item ? (react_1.default.createElement("li", { className: cx('Tree-item') }, _this.renderInput(checkbox
                        ? react_1.default.cloneElement(checkbox, {
                            checked: false,
                            disabled: true
                        })
                        : null))) : null,
                    childrenItems)) : !childrenItems && item.placeholder && _this.isUnfolded(item) ? (react_1.default.createElement("ul", { className: cx('Tree-sublist') },
                    react_1.default.createElement("li", { className: cx('Tree-item') },
                        react_1.default.createElement("div", { className: cx('Tree-placeholder') }, item.placeholder)))) : null));
        });
        return {
            dom: ret,
            childrenChecked: childrenChecked
        };
    };
    TreeSelector.prototype.render = function () {
        var _a = this.props, className = _a.className, placeholder = _a.placeholder, hideRoot = _a.hideRoot, rootLabel = _a.rootLabel, showOutline = _a.showOutline, showIcon = _a.showIcon, cx = _a.classnames, creatable = _a.creatable, rootCreatable = _a.rootCreatable, rootCreateTip = _a.rootCreateTip, disabled = _a.disabled, draggable = _a.draggable, __ = _a.translate;
        var options = this.props.options;
        var _b = this.state, value = _b.value, isAdding = _b.isAdding, addingParent = _b.addingParent, isEditing = _b.isEditing, inputValue = _b.inputValue, dropIndicator = _b.dropIndicator;
        var addBtn = null;
        if (creatable && rootCreatable !== false && hideRoot) {
            addBtn = (react_1.default.createElement("a", { className: cx('Tree-addTopBtn', {
                    'is-disabled': isAdding || isEditing
                }), onClick: this.handleAdd.bind(this, null) },
                react_1.default.createElement(icons_1.Icon, { icon: "plus", className: "icon" }),
                react_1.default.createElement("span", null, __(rootCreateTip))));
        }
        return (react_1.default.createElement("div", { className: cx("Tree ".concat(className || ''), {
                'Tree--outline': showOutline,
                'is-disabled': disabled,
                'is-draggable': draggable
            }), ref: this.root },
            (options && options.length) || addBtn || hideRoot === false ? (react_1.default.createElement("ul", { className: cx('Tree-list') }, hideRoot ? (react_1.default.createElement(react_1.default.Fragment, null,
                addBtn,
                isAdding && !addingParent ? (react_1.default.createElement("li", { className: cx('Tree-item') }, this.renderInput())) : null,
                this.renderList(options, value, false).dom)) : (react_1.default.createElement("li", { className: cx('Tree-rootItem', {
                    'is-checked': !value || !value.length
                }) },
                react_1.default.createElement("div", { className: cx('Tree-itemLabel') },
                    react_1.default.createElement("span", { className: cx('Tree-itemText'), onClick: this.clearSelect },
                        showIcon ? (react_1.default.createElement("i", { className: cx('Tree-itemIcon Tree-rootIcon') },
                            react_1.default.createElement(icons_1.Icon, { icon: "home", className: "icon" }))) : null,
                        rootLabel),
                    !disabled &&
                        creatable &&
                        rootCreatable !== false &&
                        !isAdding &&
                        !isEditing ? (react_1.default.createElement("div", { className: cx('Tree-item-icons') }, creatable ? (react_1.default.createElement("a", { onClick: this.handleAdd.bind(this, null), "data-tooltip": rootCreateTip, "data-position": "left" },
                        react_1.default.createElement(icons_1.Icon, { icon: "plus", className: "icon" }))) : null)) : null),
                react_1.default.createElement("ul", { className: cx('Tree-sublist') },
                    isAdding && !addingParent ? (react_1.default.createElement("li", { className: cx('Tree-item') }, this.renderInput())) : null,
                    this.renderList(options, value, false).dom))))) : (react_1.default.createElement("div", { className: cx('Tree-placeholder') }, placeholder)),
            dropIndicator && (react_1.default.createElement("div", { className: cx('Tree-dropIndicator', {
                    'Tree-dropIndicator--hover': !!dropIndicator.height
                }), style: dropIndicator }))));
    };
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m;
    TreeSelector.defaultProps = {
        showIcon: true,
        showOutline: false,
        initiallyOpen: true,
        unfoldedLevel: 1,
        showRadio: false,
        multiple: false,
        disabled: false,
        withChildren: false,
        onlyChildren: false,
        labelField: 'label',
        valueField: 'value',
        iconField: 'icon',
        unfoldedField: 'unfolded',
        foldedField: 'foled',
        disabledField: 'disabled',
        joinValues: true,
        extractValue: false,
        delimiter: ',',
        hideRoot: true,
        rootLabel: 'Tree.root',
        rootValue: 0,
        autoCheckChildren: true,
        cascade: false,
        selfDisabledAffectChildren: true,
        rootCreateTip: 'Tree.addRoot',
        createTip: 'Tree.addChild',
        editTip: 'Tree.editNode',
        removeTip: 'Tree.removeNode',
        enableNodePath: false,
        pathSeparator: '/',
        nodePath: []
    };
    (0, tslib_1.__decorate)([
        helper_1.autobind,
        (0, tslib_1.__metadata)("design:type", Function),
        (0, tslib_1.__metadata)("design:paramtypes", [Object]),
        (0, tslib_1.__metadata)("design:returntype", void 0)
    ], TreeSelector.prototype, "toggleUnfolded", null);
    (0, tslib_1.__decorate)([
        helper_1.autobind,
        (0, tslib_1.__metadata)("design:type", Function),
        (0, tslib_1.__metadata)("design:paramtypes", []),
        (0, tslib_1.__metadata)("design:returntype", void 0)
    ], TreeSelector.prototype, "clearSelect", null);
    (0, tslib_1.__decorate)([
        helper_1.autobind,
        (0, tslib_1.__metadata)("design:type", Function),
        (0, tslib_1.__metadata)("design:paramtypes", [Object, Object]),
        (0, tslib_1.__metadata)("design:returntype", void 0)
    ], TreeSelector.prototype, "handleSelect", null);
    (0, tslib_1.__decorate)([
        helper_1.autobind,
        (0, tslib_1.__metadata)("design:type", Function),
        (0, tslib_1.__metadata)("design:paramtypes", [Object, Boolean]),
        (0, tslib_1.__metadata)("design:returntype", void 0)
    ], TreeSelector.prototype, "handleCheck", null);
    (0, tslib_1.__decorate)([
        helper_1.autobind,
        (0, tslib_1.__metadata)("design:type", Function),
        (0, tslib_1.__metadata)("design:paramtypes", [typeof (_a = typeof Select_1.Option !== "undefined" && Select_1.Option) === "function" ? _a : Object]),
        (0, tslib_1.__metadata)("design:returntype", void 0)
    ], TreeSelector.prototype, "handleAdd", null);
    (0, tslib_1.__decorate)([
        helper_1.autobind,
        (0, tslib_1.__metadata)("design:type", Function),
        (0, tslib_1.__metadata)("design:paramtypes", [typeof (_b = typeof Select_1.Option !== "undefined" && Select_1.Option) === "function" ? _b : Object]),
        (0, tslib_1.__metadata)("design:returntype", void 0)
    ], TreeSelector.prototype, "handleEdit", null);
    (0, tslib_1.__decorate)([
        helper_1.autobind,
        (0, tslib_1.__metadata)("design:type", Function),
        (0, tslib_1.__metadata)("design:paramtypes", [typeof (_c = typeof Select_1.Option !== "undefined" && Select_1.Option) === "function" ? _c : Object]),
        (0, tslib_1.__metadata)("design:returntype", void 0)
    ], TreeSelector.prototype, "handleRemove", null);
    (0, tslib_1.__decorate)([
        helper_1.autobind,
        (0, tslib_1.__metadata)("design:type", Function),
        (0, tslib_1.__metadata)("design:paramtypes", [typeof (_d = typeof react_1.default !== "undefined" && react_1.default.ChangeEvent) === "function" ? _d : Object]),
        (0, tslib_1.__metadata)("design:returntype", void 0)
    ], TreeSelector.prototype, "handleInputChange", null);
    (0, tslib_1.__decorate)([
        helper_1.autobind,
        (0, tslib_1.__metadata)("design:type", Function),
        (0, tslib_1.__metadata)("design:paramtypes", []),
        (0, tslib_1.__metadata)("design:returntype", void 0)
    ], TreeSelector.prototype, "handleConfirm", null);
    (0, tslib_1.__decorate)([
        helper_1.autobind,
        (0, tslib_1.__metadata)("design:type", Function),
        (0, tslib_1.__metadata)("design:paramtypes", []),
        (0, tslib_1.__metadata)("design:returntype", void 0)
    ], TreeSelector.prototype, "handleCancel", null);
    (0, tslib_1.__decorate)([
        helper_1.autobind,
        (0, tslib_1.__metadata)("design:type", Function),
        (0, tslib_1.__metadata)("design:paramtypes", [typeof (_e = typeof react_1.default !== "undefined" && react_1.default.DragEvent) === "function" ? _e : Object, typeof (_f = typeof Select_1.Option !== "undefined" && Select_1.Option) === "function" ? _f : Object]),
        (0, tslib_1.__metadata)("design:returntype", Object)
    ], TreeSelector.prototype, "getDropInfo", null);
    (0, tslib_1.__decorate)([
        helper_1.autobind,
        (0, tslib_1.__metadata)("design:type", Function),
        (0, tslib_1.__metadata)("design:paramtypes", [typeof (_g = typeof react_1.default !== "undefined" && react_1.default.DragEvent) === "function" ? _g : Object, typeof (_h = typeof Select_1.Option !== "undefined" && Select_1.Option) === "function" ? _h : Object]),
        (0, tslib_1.__metadata)("design:returntype", void 0)
    ], TreeSelector.prototype, "updateDropIndicator", null);
    (0, tslib_1.__decorate)([
        helper_1.autobind,
        (0, tslib_1.__metadata)("design:type", Function),
        (0, tslib_1.__metadata)("design:paramtypes", [typeof (_j = typeof Select_1.Option !== "undefined" && Select_1.Option) === "function" ? _j : Object]),
        (0, tslib_1.__metadata)("design:returntype", void 0)
    ], TreeSelector.prototype, "onDragStart", null);
    (0, tslib_1.__decorate)([
        helper_1.autobind,
        (0, tslib_1.__metadata)("design:type", Function),
        (0, tslib_1.__metadata)("design:paramtypes", [typeof (_k = typeof Select_1.Option !== "undefined" && Select_1.Option) === "function" ? _k : Object]),
        (0, tslib_1.__metadata)("design:returntype", void 0)
    ], TreeSelector.prototype, "onDragOver", null);
    (0, tslib_1.__decorate)([
        helper_1.autobind,
        (0, tslib_1.__metadata)("design:type", Function),
        (0, tslib_1.__metadata)("design:paramtypes", [typeof (_l = typeof Select_1.Option !== "undefined" && Select_1.Option) === "function" ? _l : Object]),
        (0, tslib_1.__metadata)("design:returntype", void 0)
    ], TreeSelector.prototype, "onDragEnd", null);
    (0, tslib_1.__decorate)([
        helper_1.autobind,
        (0, tslib_1.__metadata)("design:type", Function),
        (0, tslib_1.__metadata)("design:paramtypes", [typeof (_m = typeof Select_1.Options !== "undefined" && Select_1.Options) === "function" ? _m : Object, Array, Boolean]),
        (0, tslib_1.__metadata)("design:returntype", Object)
    ], TreeSelector.prototype, "renderList", null);
    return TreeSelector;
}(react_1.default.Component));
exports.TreeSelector = TreeSelector;
exports.default = (0, theme_1.themeable)((0, locale_1.localeable)(TreeSelector));
//# sourceMappingURL=./components/Tree.js.map
