"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CheckboxesControlRenderer = void 0;
var tslib_1 = require("tslib");
var react_1 = (0, tslib_1.__importDefault)(require("react"));
var Options_1 = require("./Options");
var Checkbox_1 = (0, tslib_1.__importDefault)(require("../../components/Checkbox"));
var icons_1 = require("../../components/icons");
var helper_1 = require("../../utils/helper");
var columnsSplit_1 = require("../../utils/columnsSplit");
var CheckboxesControl = /** @class */ (function (_super) {
    (0, tslib_1.__extends)(CheckboxesControl, _super);
    function CheckboxesControl() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    CheckboxesControl.prototype.doAction = function (action, data, throwErrors) {
        var _a = this.props, resetValue = _a.resetValue, onChange = _a.onChange;
        var actionType = action === null || action === void 0 ? void 0 : action.actionType;
        if (actionType === 'clear') {
            onChange('');
        }
        else if (actionType === 'reset') {
            onChange(resetValue !== null && resetValue !== void 0 ? resetValue : '');
        }
    };
    CheckboxesControl.prototype.reload = function () {
        var reload = this.props.reloadOptions;
        reload && reload();
    };
    CheckboxesControl.prototype.handleAddClick = function () {
        var onAdd = this.props.onAdd;
        onAdd && onAdd();
    };
    CheckboxesControl.prototype.handleEditClick = function (e, item) {
        var onEdit = this.props.onEdit;
        e.preventDefault();
        e.stopPropagation();
        onEdit && onEdit(item);
    };
    CheckboxesControl.prototype.handleDeleteClick = function (e, item) {
        var onDelete = this.props.onDelete;
        e.preventDefault();
        e.stopPropagation();
        onDelete && onDelete(item);
    };
    CheckboxesControl.prototype.componentDidMount = function () {
        this.updateBorderStyle();
        window.addEventListener('resize', this.updateBorderStyle);
    };
    CheckboxesControl.prototype.componentWillMount = function () {
        window.removeEventListener('resize', this.updateBorderStyle);
    };
    CheckboxesControl.prototype.updateBorderStyle = function () {
        if (this.props.optionType !== 'button') {
            return;
        }
        var wrapDom = this.refs.checkboxRef;
        var wrapWidth = wrapDom.clientWidth;
        var childs = Array.from(wrapDom.children);
        childs.forEach(function (child) {
            child.style.borderRadius = '0';
            child.style.borderLeftWidth = '1px';
            child.style.borderTopWidth = '1px';
        });
        var childTotalWidth = childs.reduce(function (pre, next) { return pre + next.clientWidth; }, 0);
        if (childTotalWidth <= wrapWidth) {
            if (childs.length === 1) {
                childs[0].style.borderRadius = '4px';
            }
            else {
                childs[0].style.borderRadius = '4px 0 0 4px';
                childs[childs.length - 1].style.borderRadius = '0 4px 4px 0';
                childs.forEach(function (child, idx) {
                    idx !== 0 && (child.style.borderLeftWidth = '0');
                });
            }
        }
        else {
            var curRowWidth_1 = 0;
            var curRow_1 = 0;
            var rowNum_1 = Math.floor(childTotalWidth / wrapWidth);
            var rowColArr_1 = [];
            for (var i = 0; i <= rowNum_1; i++) {
                var arr = [];
                rowColArr_1[i] = arr;
            }
            childs.forEach(function (child, idx) {
                curRowWidth_1 += child.clientWidth;
                if (curRowWidth_1 > wrapWidth) {
                    curRowWidth_1 = child.clientWidth;
                    curRow_1++;
                }
                if (curRow_1 > rowNum_1) {
                    return;
                }
                rowColArr_1[curRow_1].push(child);
            });
            rowColArr_1.forEach(function (row, rowIdx) {
                if (rowIdx === 0) {
                    row.forEach(function (r, colIdx) {
                        r.style.borderRadius = '0';
                        colIdx !== 0 && (r.style.borderLeftWidth = '0');
                        row.length > rowColArr_1[rowIdx + 1].length &&
                            (row[row.length - 1].style.borderBottomRightRadius = '4px');
                    });
                    row[0].style.borderTopLeftRadius = '4px';
                    row[row.length - 1].style.borderTopRightRadius = '4px';
                }
                else if (rowIdx === rowNum_1) {
                    row.forEach(function (r, colIdx) {
                        r.style.borderRadius = '0';
                        colIdx !== 0 && (r.style.borderLeftWidth = '0');
                        r.style.borderTopWidth = '0';
                        row[0].style.borderBottomLeftRadius = '4px';
                        row[row.length - 1].style.borderBottomRightRadius = '4px';
                    });
                }
                else {
                    row.forEach(function (r, colIdx) {
                        r.style.borderRadius = '0';
                        colIdx !== 0 && (r.style.borderLeftWidth = '0');
                        r.style.borderTopWidth = '0';
                        row.length > rowColArr_1[rowIdx + 1].length &&
                            (row[row.length - 1].style.borderBottomRightRadius = '4px');
                    });
                }
            });
        }
    };
    CheckboxesControl.prototype.renderGroup = function (option, index) {
        var _this = this;
        var _a;
        var _b = this.props, cx = _b.classnames, labelField = _b.labelField;
        if (!((_a = option.children) === null || _a === void 0 ? void 0 : _a.length)) {
            return null;
        }
        return (react_1.default.createElement("div", { key: index, className: cx('CheckboxesControl-group', option.className) },
            react_1.default.createElement("label", { className: cx('CheckboxesControl-groupLabel', option.labelClassName) }, option[labelField || 'label']),
            option.children.map(function (option, index) { return _this.renderItem(option, index); })));
    };
    CheckboxesControl.prototype.renderItem = function (option, index) {
        var _this = this;
        if (option.children) {
            return this.renderGroup(option, index);
        }
        var _a = this.props, itemClassName = _a.itemClassName, onToggle = _a.onToggle, selectedOptions = _a.selectedOptions, disabled = _a.disabled, inline = _a.inline, labelClassName = _a.labelClassName, labelField = _a.labelField, removable = _a.removable, editable = _a.editable, __ = _a.translate, optionType = _a.optionType;
        return (react_1.default.createElement(Checkbox_1.default, { className: itemClassName, key: index, onChange: function () { return onToggle(option); }, checked: !!~selectedOptions.indexOf(option), disabled: disabled || option.disabled, inline: inline, labelClassName: labelClassName, description: option.description, optionType: optionType },
            String(option[labelField || 'label']),
            removable && (0, helper_1.hasAbility)(option, 'removable') ? (react_1.default.createElement("a", { "data-tooltip": __('Select.clear'), "data-position": "left" },
                react_1.default.createElement(icons_1.Icon, { icon: "minus", className: "icon", onClick: function (e) { return _this.handleDeleteClick(e, option); } }))) : null,
            editable && (0, helper_1.hasAbility)(option, 'editable') ? (react_1.default.createElement("a", { "data-tooltip": "\u7F16\u8F91", "data-position": "left" },
                react_1.default.createElement(icons_1.Icon, { icon: "pencil", className: "icon", onClick: function (e) { return _this.handleEditClick(e, option); } }))) : null));
    };
    CheckboxesControl.prototype.render = function () {
        var _this = this;
        var _a = this.props, className = _a.className, disabled = _a.disabled, placeholder = _a.placeholder, options = _a.options, inline = _a.inline, columnsCount = _a.columnsCount, selectedOptions = _a.selectedOptions, onToggle = _a.onToggle, onToggleAll = _a.onToggleAll, checkAll = _a.checkAll, cx = _a.classnames, itemClassName = _a.itemClassName, labelClassName = _a.labelClassName, creatable = _a.creatable, addApi = _a.addApi, createBtnLabel = _a.createBtnLabel, __ = _a.translate, optionType = _a.optionType;
        var body = [];
        if (options && options.length) {
            body = options.map(function (option, key) { return _this.renderItem(option, key); });
        }
        if (checkAll && body.length && optionType === 'default') {
            body.unshift(react_1.default.createElement(Checkbox_1.default, { key: "checkall", className: itemClassName, onChange: onToggleAll, checked: !!selectedOptions.length, partial: !!(selectedOptions.length &&
                    selectedOptions.length !== options.length), disabled: disabled, inline: inline, labelClassName: labelClassName }, __('Checkboxes.selectAll')));
        }
        body = (0, columnsSplit_1.columnsSplit)(body, cx, columnsCount);
        return (react_1.default.createElement("div", { className: cx("CheckboxesControl", className), ref: "checkboxRef" },
            body && body.length ? (body) : (react_1.default.createElement("span", { className: "Form-placeholder" }, __(placeholder))),
            (creatable || addApi) && !disabled ? (react_1.default.createElement("a", { className: cx('Checkboxes-addBtn'), onClick: this.handleAddClick },
                react_1.default.createElement(icons_1.Icon, { icon: "plus", className: "icon" }),
                __(createBtnLabel))) : null));
    };
    var _a, _b;
    CheckboxesControl.defaultProps = {
        columnsCount: 1,
        multiple: true,
        placeholder: 'placeholder.noOption',
        creatable: false,
        inline: true,
        createBtnLabel: 'Select.createLabel',
        optionType: 'default'
    };
    (0, tslib_1.__decorate)([
        helper_1.autobind,
        (0, tslib_1.__metadata)("design:type", Function),
        (0, tslib_1.__metadata)("design:paramtypes", []),
        (0, tslib_1.__metadata)("design:returntype", void 0)
    ], CheckboxesControl.prototype, "handleAddClick", null);
    (0, tslib_1.__decorate)([
        helper_1.autobind,
        (0, tslib_1.__metadata)("design:type", Function),
        (0, tslib_1.__metadata)("design:paramtypes", [typeof (_a = typeof Event !== "undefined" && Event) === "function" ? _a : Object, Object]),
        (0, tslib_1.__metadata)("design:returntype", void 0)
    ], CheckboxesControl.prototype, "handleEditClick", null);
    (0, tslib_1.__decorate)([
        helper_1.autobind,
        (0, tslib_1.__metadata)("design:type", Function),
        (0, tslib_1.__metadata)("design:paramtypes", [typeof (_b = typeof Event !== "undefined" && Event) === "function" ? _b : Object, Object]),
        (0, tslib_1.__metadata)("design:returntype", void 0)
    ], CheckboxesControl.prototype, "handleDeleteClick", null);
    (0, tslib_1.__decorate)([
        helper_1.autobind,
        (0, tslib_1.__metadata)("design:type", Function),
        (0, tslib_1.__metadata)("design:paramtypes", []),
        (0, tslib_1.__metadata)("design:returntype", void 0)
    ], CheckboxesControl.prototype, "updateBorderStyle", null);
    return CheckboxesControl;
}(react_1.default.Component));
exports.default = CheckboxesControl;
var CheckboxesControlRenderer = /** @class */ (function (_super) {
    (0, tslib_1.__extends)(CheckboxesControlRenderer, _super);
    function CheckboxesControlRenderer() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    CheckboxesControlRenderer = (0, tslib_1.__decorate)([
        (0, Options_1.OptionsControl)({
            type: 'checkboxes',
            sizeMutable: false
        })
    ], CheckboxesControlRenderer);
    return CheckboxesControlRenderer;
}(CheckboxesControl));
exports.CheckboxesControlRenderer = CheckboxesControlRenderer;
//# sourceMappingURL=./renderers/Form/Checkboxes.js.map
