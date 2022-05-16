"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TableControlRenderer = void 0;
var tslib_1 = require("tslib");
var react_1 = (0, tslib_1.__importDefault)(require("react"));
var Item_1 = require("./Item");
var Button_1 = (0, tslib_1.__importDefault)(require("../../components/Button"));
var helper_1 = require("../../utils/helper");
var api_1 = require("../../utils/api");
var tpl_1 = require("../../utils/tpl");
var omit_1 = (0, tslib_1.__importDefault)(require("lodash/omit"));
var tpl_builtin_1 = require("../../utils/tpl-builtin");
var findIndex_1 = (0, tslib_1.__importDefault)(require("lodash/findIndex"));
var SimpleMap_1 = require("../../utils/SimpleMap");
var icons_1 = require("../../components/icons");
var find_1 = (0, tslib_1.__importDefault)(require("lodash/find"));
var FormTable = /** @class */ (function (_super) {
    (0, tslib_1.__extends)(FormTable, _super);
    function FormTable(props) {
        var _this = _super.call(this, props) || this;
        _this.entityId = 1;
        _this.subForms = {};
        _this.rowPrinstine = [];
        _this.editting = {};
        _this.state = {
            columns: _this.buildColumns(props),
            editIndex: -1,
            items: Array.isArray(props.value) ? props.value.concat() : []
        };
        _this.entries = new SimpleMap_1.SimpleMap();
        _this.buildItemProps = _this.buildItemProps.bind(_this);
        _this.confirmEdit = _this.confirmEdit.bind(_this);
        _this.cancelEdit = _this.cancelEdit.bind(_this);
        _this.handleSaveTableOrder = _this.handleSaveTableOrder.bind(_this);
        _this.handleTableSave = _this.handleTableSave.bind(_this);
        _this.getEntryId = _this.getEntryId.bind(_this);
        _this.subFormRef = _this.subFormRef.bind(_this);
        _this.handlePageChange = _this.handlePageChange.bind(_this);
        _this.emitValue = _this.emitValue.bind(_this);
        return _this;
    }
    FormTable.prototype.componentDidUpdate = function (nextProps) {
        var props = this.props;
        var toUpdate = null;
        if (props.columns !== nextProps.columns) {
            toUpdate = (0, tslib_1.__assign)((0, tslib_1.__assign)({}, toUpdate), { columns: this.buildColumns(props) });
        }
        if (props.value !== nextProps.value) {
            toUpdate = (0, tslib_1.__assign)((0, tslib_1.__assign)({}, toUpdate), { items: Array.isArray(props.value) ? props.value.concat() : [], editIndex: -1, raw: undefined });
        }
        toUpdate && this.setState(toUpdate);
    };
    FormTable.prototype.componentWillUnmount = function () {
        this.entries.dispose();
    };
    FormTable.prototype.subFormRef = function (form, x, y) {
        this.subForms["".concat(x, "-").concat(y)] = form;
    };
    FormTable.prototype.validate = function () {
        return (0, tslib_1.__awaiter)(this, void 0, Promise, function () {
            var _a, value, minLength, maxLength, __, columns, subForms_1, results, msg, uniqueColumn_1;
            var _this = this;
            return (0, tslib_1.__generator)(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = this.props, value = _a.value, minLength = _a.minLength, maxLength = _a.maxLength, __ = _a.translate, columns = _a.columns;
                        // todo: 如果当前正在编辑中，表单提交了，应该先让正在编辑的东西提交然后再做验证。
                        if (~this.state.editIndex) {
                            return [2 /*return*/, __('Table.editing')];
                        }
                        if (!(minLength && (!Array.isArray(value) || value.length < minLength))) return [3 /*break*/, 1];
                        return [2 /*return*/, __('Combo.minLength', { minLength: minLength })];
                    case 1:
                        if (!(maxLength && Array.isArray(value) && value.length > maxLength)) return [3 /*break*/, 2];
                        return [2 /*return*/, __('Combo.maxLength', { maxLength: maxLength })];
                    case 2:
                        subForms_1 = [];
                        Object.keys(this.subForms).forEach(function (key) { return _this.subForms[key] && subForms_1.push(_this.subForms[key]); });
                        if (!subForms_1.length) return [3 /*break*/, 4];
                        return [4 /*yield*/, Promise.all(subForms_1.map(function (item) { return item.validate(); }))];
                    case 3:
                        results = _b.sent();
                        msg = ~results.indexOf(false) ? __('Form.validateFailed') : '';
                        uniqueColumn_1 = '';
                        if (!msg &&
                            Array.isArray(columns) &&
                            Array.isArray(value) &&
                            columns.some(function (item) {
                                if (item.unique && item.name) {
                                    var exists_1 = [];
                                    return value.some(function (obj) {
                                        var value = (0, helper_1.getVariable)(obj, item.name);
                                        if (~exists_1.indexOf(value)) {
                                            uniqueColumn_1 = "".concat(item.label || item.name);
                                            return true;
                                        }
                                        exists_1.push(value);
                                        return false;
                                    });
                                }
                                return false;
                            })) {
                            msg = __('InputTable.uniqueError', {
                                label: uniqueColumn_1
                            });
                        }
                        return [2 /*return*/, msg];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    FormTable.prototype.emitValue = function () {
        var items = this.state.items.filter(function (item) { return !item.__isPlaceholder; });
        var onChange = this.props.onChange;
        onChange === null || onChange === void 0 ? void 0 : onChange(items);
    };
    FormTable.prototype.doAction = function (action, ctx) {
        var rest = [];
        for (var _i = 2; _i < arguments.length; _i++) {
            rest[_i - 2] = arguments[_i];
        }
        return (0, tslib_1.__awaiter)(this, void 0, void 0, function () {
            var _a, onAction, valueField, env, onChange, editable, needConfirm, addable, addApi, __, items_1, toAdd_1, payload, items_2, toRemove;
            var _this = this;
            return (0, tslib_1.__generator)(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = this.props, onAction = _a.onAction, valueField = _a.valueField, env = _a.env, onChange = _a.onChange, editable = _a.editable, needConfirm = _a.needConfirm, addable = _a.addable, addApi = _a.addApi, __ = _a.translate;
                        if (!(action.actionType === 'add')) return [3 /*break*/, 6];
                        if (addable === false) {
                            return [2 /*return*/];
                        }
                        items_1 = this.state.items.concat();
                        if (!(addApi || action.payload)) return [3 /*break*/, 4];
                        toAdd_1 = null;
                        if (!(0, api_1.isEffectiveApi)(addApi, ctx)) return [3 /*break*/, 2];
                        return [4 /*yield*/, env.fetcher(addApi, ctx)];
                    case 1:
                        payload = _b.sent();
                        if (payload && !payload.ok) {
                            env.notify('error', payload.msg || __('fetchFailed'));
                            return [2 /*return*/];
                        }
                        else if (payload && payload.ok) {
                            toAdd_1 = payload.data;
                        }
                        return [3 /*break*/, 3];
                    case 2:
                        toAdd_1 = (0, tpl_builtin_1.dataMapping)(action.payload, ctx);
                        _b.label = 3;
                    case 3:
                        toAdd_1 = Array.isArray(toAdd_1) ? toAdd_1 : [toAdd_1];
                        toAdd_1.forEach(function (toAdd) {
                            if (!valueField ||
                                !(0, find_1.default)(items_1, function (item) { return item[valueField] == toAdd[valueField]; })) {
                                // 不要重复加入
                                items_1.push(toAdd);
                            }
                        });
                        this.setState({
                            items: items_1
                        }, function () {
                            _this.emitValue();
                            if (toAdd_1.length === 1 && needConfirm !== false) {
                                _this.startEdit(items_1.length - 1, true);
                            }
                        });
                        return [2 /*return*/];
                    case 4: return [2 /*return*/, this.addItem(items_1.length - 1)];
                    case 5: return [3 /*break*/, 7];
                    case 6:
                        if (action.actionType === 'remove' ||
                            action.actionType === 'delete') {
                            if (!valueField) {
                                return [2 /*return*/, env.alert(__('Table.valueField'))];
                            }
                            else if (!action.payload) {
                                return [2 /*return*/, env.alert(__('Table.playload'))];
                            }
                            items_2 = this.state.items.concat();
                            toRemove = (0, tpl_builtin_1.dataMapping)(action.payload, ctx);
                            toRemove = Array.isArray(toRemove) ? toRemove : [toRemove];
                            toRemove.forEach(function (toRemove) {
                                var idx = (0, findIndex_1.default)(items_2, function (item) { return item[valueField] == toRemove[valueField]; });
                                if (~idx) {
                                    items_2.splice(idx, 1);
                                }
                            });
                            this.setState({
                                items: items_2
                            }, function () { return _this.emitValue(); });
                            // todo 如果配置删除 Api 怎么办？
                            return [2 /*return*/];
                        }
                        _b.label = 7;
                    case 7: return [2 /*return*/, onAction && onAction.apply(void 0, (0, tslib_1.__spreadArray)([action, ctx], rest, false))];
                }
            });
        });
    };
    FormTable.prototype.copyItem = function (index) {
        var _this = this;
        var needConfirm = this.props.needConfirm;
        var items = this.state.items.concat();
        items.splice(index + 1, 0, items[index]);
        index = Math.min(index + 1, items.length - 1);
        this.setState({
            items: items
        }, function () {
            if (needConfirm === false) {
                _this.emitValue();
            }
            else {
                _this.startEdit(index, true);
            }
        });
    };
    FormTable.prototype.addItem = function (index) {
        var _this = this;
        var _a = this.props, needConfirm = _a.needConfirm, scaffold = _a.scaffold, columns = _a.columns;
        var items = this.state.items.concat();
        var value = {
            __isPlaceholder: true
        };
        if (Array.isArray(columns)) {
            columns.forEach(function (column) {
                if (typeof column.value !== 'undefined' &&
                    typeof column.name === 'string') {
                    (0, helper_1.setVariable)(value, column.name, column.value);
                }
            });
        }
        value = (0, tslib_1.__assign)((0, tslib_1.__assign)({}, value), scaffold);
        if (needConfirm === false) {
            delete value.__isPlaceholder;
        }
        items.splice(index + 1, 0, value);
        index = Math.min(index + 1, items.length - 1);
        this.setState({
            items: items
        }, function () {
            if (needConfirm === false) {
                _this.emitValue();
            }
            else {
                _this.startEdit(index, true);
            }
        });
    };
    FormTable.prototype.startEdit = function (index, isCreate) {
        if (isCreate === void 0) { isCreate = false; }
        this.setState({
            editIndex: index,
            isCreateMode: isCreate,
            raw: this.state.items[index],
            columns: this.buildColumns(this.props, isCreate)
        });
    };
    FormTable.prototype.confirmEdit = function () {
        return (0, tslib_1.__awaiter)(this, void 0, void 0, function () {
            var _a, addApi, updateApi, data, env, __, subForms, items, item, isNew, remote;
            var _this = this;
            return (0, tslib_1.__generator)(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = this.props, addApi = _a.addApi, updateApi = _a.updateApi, data = _a.data, env = _a.env, __ = _a.translate;
                        subForms = [];
                        Object.keys(this.subForms).forEach(function (key) { return _this.subForms[key] && subForms.push(_this.subForms[key]); });
                        subForms.forEach(function (form) { return form.flush(); });
                        items = this.state.items.concat();
                        item = (0, tslib_1.__assign)({}, items[this.state.editIndex]);
                        isNew = item.__isPlaceholder;
                        remote = null;
                        if (!(isNew && (0, api_1.isEffectiveApi)(addApi, (0, helper_1.createObject)(data, item)))) return [3 /*break*/, 2];
                        return [4 /*yield*/, env.fetcher(addApi, (0, helper_1.createObject)(data, item))];
                    case 1:
                        remote = _b.sent();
                        return [3 /*break*/, 4];
                    case 2:
                        if (!(0, api_1.isEffectiveApi)(updateApi, (0, helper_1.createObject)(data, item))) return [3 /*break*/, 4];
                        return [4 /*yield*/, env.fetcher(updateApi, (0, helper_1.createObject)(data, item))];
                    case 3:
                        remote = _b.sent();
                        _b.label = 4;
                    case 4:
                        if (remote && !remote.ok) {
                            env.notify('error', remote.msg || __('saveFailed'));
                            return [2 /*return*/];
                        }
                        else if (remote && remote.ok) {
                            item = (0, tslib_1.__assign)((0, tslib_1.__assign)({}, ((isNew ? addApi : updateApi).replaceData
                                ? {}
                                : item)), remote.data);
                        }
                        delete item.__isPlaceholder;
                        items.splice(this.state.editIndex, 1, item);
                        this.setState({
                            editIndex: -1,
                            items: items,
                            raw: undefined
                        }, this.emitValue);
                        return [2 /*return*/];
                }
            });
        });
    };
    FormTable.prototype.cancelEdit = function () {
        var items = this.state.items.concat();
        if (this.state.isCreateMode) {
            items = items.filter(function (item) { return !item.__isPlaceholder; });
        }
        else if (this.state.raw) {
            items.splice(this.state.editIndex, 1, this.state.raw);
        }
        this.setState({
            editIndex: -1,
            raw: undefined,
            items: items
        }, this.emitValue);
    };
    FormTable.prototype.removeItem = function (index) {
        return (0, tslib_1.__awaiter)(this, void 0, void 0, function () {
            var _a, value, onChange, deleteApi, deleteConfirmText, env, data, __, newValue, item, ctx, confirmed, result;
            return (0, tslib_1.__generator)(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = this.props, value = _a.value, onChange = _a.onChange, deleteApi = _a.deleteApi, deleteConfirmText = _a.deleteConfirmText, env = _a.env, data = _a.data, __ = _a.translate;
                        newValue = Array.isArray(value) ? value.concat() : [];
                        item = newValue[index];
                        if (!item) {
                            return [2 /*return*/];
                        }
                        ctx = (0, helper_1.createObject)(data, item);
                        if (!(0, api_1.isEffectiveApi)(deleteApi, ctx)) return [3 /*break*/, 3];
                        return [4 /*yield*/, env.confirm(deleteConfirmText ? (0, tpl_1.filter)(deleteConfirmText, ctx) : __('deleteConfirm'))];
                    case 1:
                        confirmed = _b.sent();
                        if (!confirmed) {
                            // 如果不确认，则跳过！
                            return [2 /*return*/];
                        }
                        return [4 /*yield*/, env.fetcher(deleteApi, ctx)];
                    case 2:
                        result = _b.sent();
                        if (!result.ok) {
                            env.notify('error', __('deleteFailed'));
                            return [2 /*return*/];
                        }
                        _b.label = 3;
                    case 3:
                        this.removeEntry(item);
                        newValue.splice(index, 1);
                        onChange(newValue);
                        return [2 /*return*/];
                }
            });
        });
    };
    FormTable.prototype.buildItemProps = function (item, index) {
        if (this.props.needConfirm === false) {
            return {
                quickEditEnabled: true
            };
        }
        else if (!this.props.editable &&
            !this.props.addable &&
            !this.state.isCreateMode) {
            return null;
        }
        var perPage = this.props.perPage;
        var page = this.state.page || 1;
        var offset = 0;
        if (typeof perPage === 'number' && perPage) {
            offset = (page - 1) * perPage;
        }
        return {
            quickEditEnabled: this.state.editIndex === index + offset
        };
    };
    FormTable.prototype.buildColumns = function (props, isCreateMode) {
        var _this = this;
        if (isCreateMode === void 0) { isCreateMode = false; }
        var env = this.props.env;
        var columns = Array.isArray(props.columns)
            ? props.columns.concat()
            : [];
        var ns = this.props.classPrefix;
        var __ = this.props.translate;
        var needConfirm = this.props.needConfirm;
        var showIndex = this.props.showIndex;
        var btns = [];
        if (props.addable && props.showAddBtn !== false) {
            btns.push({
                children: function (_a) {
                    var key = _a.key, rowIndex = _a.rowIndex, offset = _a.offset;
                    return ~_this.state.editIndex && needConfirm !== false ? null : (react_1.default.createElement(Button_1.default, { classPrefix: ns, size: "sm", key: key, level: "link", tooltip: __('Table.addRow'), tooltipContainer: env && env.getModalContainer ? env.getModalContainer : undefined, onClick: _this.addItem.bind(_this, rowIndex + offset, undefined) },
                        props.addBtnLabel ? react_1.default.createElement("span", null, props.addBtnLabel) : null,
                        props.addBtnIcon ? (react_1.default.createElement(icons_1.Icon, { icon: props.addBtnIcon, className: "icon" })) : null));
                }
            });
        }
        if (props.copyable && props.showCopyBtn !== false) {
            btns.push({
                children: function (_a) {
                    var key = _a.key, rowIndex = _a.rowIndex, offset = _a.offset;
                    return ~_this.state.editIndex && needConfirm !== false ? null : (react_1.default.createElement(Button_1.default, { classPrefix: ns, size: "sm", key: key, level: "link", tooltip: __('Table.copyRow'), tooltipContainer: env && env.getModalContainer ? env.getModalContainer : undefined, onClick: _this.copyItem.bind(_this, rowIndex + offset, undefined) },
                        props.copyBtnLabel ? react_1.default.createElement("span", null, props.copyBtnLabel) : null,
                        props.copyBtnIcon ? (react_1.default.createElement(icons_1.Icon, { icon: props.copyBtnIcon, className: "icon" })) : null));
                }
            });
        }
        if (props.needConfirm === false) {
            columns = columns.map(function (column) {
                var quickEdit = column.quickEdit;
                return quickEdit === false
                    ? (0, omit_1.default)(column, ['quickEdit'])
                    : (0, tslib_1.__assign)((0, tslib_1.__assign)({}, column), { quickEdit: (0, tslib_1.__assign)((0, tslib_1.__assign)((0, tslib_1.__assign)({}, _this.columnToQuickEdit(column)), quickEdit), { saveImmediately: true, mode: 'inline' }) });
            });
        }
        else if (props.addable || props.editable || isCreateMode) {
            columns = columns.map(function (column) {
                var quickEdit = !isCreateMode && column.hasOwnProperty('quickEditOnUpdate')
                    ? column.quickEditOnUpdate
                    : column.quickEdit;
                return quickEdit === false
                    ? (0, omit_1.default)(column, ['quickEdit'])
                    : (0, tslib_1.__assign)((0, tslib_1.__assign)({}, column), { quickEdit: (0, tslib_1.__assign)((0, tslib_1.__assign)((0, tslib_1.__assign)({}, _this.columnToQuickEdit(column)), quickEdit), { saveImmediately: true, mode: 'inline' }) });
            });
            props.editable &&
                btns.push({
                    children: function (_a) {
                        var key = _a.key, rowIndex = _a.rowIndex, data = _a.data, offset = _a.offset;
                        return ~_this.state.editIndex || (data && data.__isPlaceholder) ? null : (react_1.default.createElement(Button_1.default, { classPrefix: ns, size: "sm", key: key, level: "link", tooltip: __('Table.editRow'), tooltipContainer: env && env.getModalContainer
                                ? env.getModalContainer
                                : undefined, onClick: function () { return _this.startEdit(rowIndex + offset); } },
                            props.updateBtnLabel || props.editBtnLabel ? (react_1.default.createElement("span", null, props.updateBtnLabel || props.editBtnLabel)) : null,
                            typeof props.updateBtnIcon !== 'undefined' ? (props.updateBtnIcon ? (react_1.default.createElement(icons_1.Icon, { icon: props.updateBtnIcon, className: "icon" })) : null) : props.editBtnIcon ? (react_1.default.createElement(icons_1.Icon, { icon: props.editBtnIcon, className: "icon" })) : null));
                    }
                });
            btns.push({
                children: function (_a) {
                    var key = _a.key, rowIndex = _a.rowIndex, offset = _a.offset;
                    return _this.state.editIndex === rowIndex + offset ? (react_1.default.createElement(Button_1.default, { classPrefix: ns, size: "sm", key: key, level: "link", tooltip: __('save'), tooltipContainer: env && env.getModalContainer ? env.getModalContainer : undefined, onClick: _this.confirmEdit },
                        props.confirmBtnLabel ? (react_1.default.createElement("span", null, props.confirmBtnLabel)) : null,
                        props.confirmBtnIcon ? (react_1.default.createElement(icons_1.Icon, { icon: props.confirmBtnIcon, className: "icon" })) : null)) : null;
                }
            });
            btns.push({
                children: function (_a) {
                    var key = _a.key, rowIndex = _a.rowIndex, offset = _a.offset;
                    return _this.state.editIndex === rowIndex + offset ? (react_1.default.createElement(Button_1.default, { classPrefix: ns, size: "sm", key: key, level: "link", tooltip: __('cancel'), tooltipContainer: env && env.getModalContainer ? env.getModalContainer : undefined, onClick: _this.cancelEdit },
                        props.cancelBtnLabel ? (react_1.default.createElement("span", null, props.cancelBtnLabel)) : null,
                        props.cancelBtnIcon ? (react_1.default.createElement(icons_1.Icon, { icon: props.cancelBtnIcon, className: "icon" })) : null)) : null;
                }
            });
        }
        if (props.removable) {
            btns.push({
                children: function (_a) {
                    var key = _a.key, rowIndex = _a.rowIndex, data = _a.data, offset = _a.offset;
                    return (~_this.state.editIndex || (data && data.__isPlaceholder)) &&
                        needConfirm !== false ? null : (react_1.default.createElement(Button_1.default, { classPrefix: ns, size: "sm", key: key, level: "link", tooltip: __('Table.deleteRow'), tooltipContainer: env && env.getModalContainer ? env.getModalContainer : undefined, onClick: _this.removeItem.bind(_this, rowIndex + offset) },
                        props.deleteBtnLabel ? (react_1.default.createElement("span", null, props.deleteBtnLabel)) : null,
                        props.deleteBtnIcon ? (react_1.default.createElement(icons_1.Icon, { icon: props.deleteBtnIcon, className: "icon" })) : null));
                }
            });
        }
        if (btns.length) {
            var operation = columns.find(function (item) { return item.type === 'operation'; });
            if (!operation) {
                operation = {
                    type: 'operation',
                    buttons: [],
                    label: __('Table.operation'),
                    className: 'v-middle nowrap',
                    fixed: 'right',
                    width: '1%',
                    innerClassName: 'm-n'
                };
                columns.push(operation);
            }
            operation.buttons = Array.isArray(operation.buttons)
                ? operation.buttons.concat()
                : [];
            operation.buttons.unshift.apply(operation.buttons, btns);
        }
        if (showIndex) {
            columns.unshift({
                label: __('Table.index'),
                width: '1%',
                children: function (props) {
                    return react_1.default.createElement("td", null, props.offset + props.data.index + 1);
                }
            });
        }
        return columns;
    };
    FormTable.prototype.columnToQuickEdit = function (column) {
        var quickEdit = {
            type: 'input-text'
        };
        if ((column.type &&
            /^input\-|(?:select|picker|checkbox|checkboxes|editor|transfer|radios)$/i.test(column.type)) ||
            ~['textarea', 'combo', 'condition-builder', 'group'].indexOf(column.type)) {
            return (0, tslib_1.__assign)((0, tslib_1.__assign)({}, column), { label: '' });
        }
        return quickEdit;
    };
    FormTable.prototype.handleTableSave = function (rows, diff, rowIndexes) {
        var perPage = this.props.perPage;
        if (~this.state.editIndex) {
            var items_3 = this.state.items.concat();
            var origin = items_3[this.state.editIndex];
            if (!origin) {
                return;
            }
            var value = (0, tslib_1.__assign)({}, rows);
            this.entries.set(value, this.entries.get(origin) || this.entityId++);
            this.entries.delete(origin);
            items_3.splice(this.state.editIndex, 1, value);
            this.setState({
                items: items_3
            });
            return;
        }
        var page = this.state.page;
        var items = this.state.items.concat();
        if (Array.isArray(rows)) {
            rowIndexes.forEach(function (rowIndex, index) {
                var indexes = rowIndex.split('.').map(function (item) { return parseInt(item, 10); });
                if (page && page > 1 && typeof perPage === 'number') {
                    indexes[0] += (page - 1) * perPage;
                }
                var origin = (0, helper_1.getTree)(items, indexes);
                var data = (0, tslib_1.__assign)((0, tslib_1.__assign)({}, origin), diff[index]);
                items = (0, helper_1.spliceTree)(items, indexes, 1, data);
            });
        }
        else {
            var indexes = rowIndexes
                .split('.')
                .map(function (item) { return parseInt(item, 10); });
            if (page && page > 1 && typeof perPage === 'number') {
                indexes[0] += (page - 1) * perPage;
            }
            var origin = (0, helper_1.getTree)(items, indexes);
            var data = (0, tslib_1.__assign)((0, tslib_1.__assign)({}, origin), diff);
            items = (0, helper_1.spliceTree)(items, indexes, 1, data);
            this.entries.set(data, this.entries.get(origin) || this.entityId++);
            // this.entries.delete(origin); // 反正最后都会清理的，先不删了吧。
        }
        this.setState({
            items: items
        }, this.emitValue);
    };
    FormTable.prototype.handleSaveTableOrder = function (moved, rows) {
        var onChange = this.props.onChange;
        onChange(rows.map(function (item) { return ((0, tslib_1.__assign)({}, item)); }));
    };
    FormTable.prototype.handlePageChange = function (page) {
        this.setState({ page: page });
    };
    FormTable.prototype.removeEntry = function (entry) {
        if (this.entries.has(entry)) {
            this.entries.delete(entry);
        }
    };
    FormTable.prototype.getEntryId = function (entry) {
        if (!this.entries.has(entry)) {
            this.entries.set(entry, this.entityId++);
        }
        return String(this.entries.get(entry));
    };
    FormTable.prototype.render = function () {
        var _this = this;
        var _a = this.props, className = _a.className, value = _a.value, showAddBtn = _a.showAddBtn, disabled = _a.disabled, render = _a.render, placeholder = _a.placeholder, draggable = _a.draggable, addable = _a.addable, columnsTogglable = _a.columnsTogglable, combineNum = _a.combineNum, combineFromIndex = _a.combineFromIndex, __ = _a.translate, canAccessSuperData = _a.canAccessSuperData, expandConfig = _a.expandConfig, affixRow = _a.affixRow, prefixRow = _a.prefixRow, formInited = _a.formInited, perPage = _a.perPage, cx = _a.classnames, rowClassName = _a.rowClassName, rowClassNameExpr = _a.rowClassNameExpr;
        if (formInited === false) {
            return null;
        }
        var items = this.state.items;
        var showPager = false;
        var page = this.state.page || 1;
        var offset = 0;
        var lastPage = 1;
        if (typeof perPage === 'number' && perPage && items.length > perPage) {
            lastPage = Math.ceil(items.length / perPage);
            items = items.slice((page - 1) * perPage, page * perPage);
            showPager = true;
            offset = (page - 1) * perPage;
        }
        return (react_1.default.createElement("div", { className: cx('InputTable', className) },
            render('body', {
                type: 'table',
                placeholder: __(placeholder),
                columns: this.state.columns,
                affixHeader: false,
                prefixRow: prefixRow,
                affixRow: affixRow
            }, {
                value: undefined,
                saveImmediately: true,
                disabled: disabled,
                draggable: draggable && !~this.state.editIndex,
                items: items,
                getEntryId: this.getEntryId,
                onSave: this.handleTableSave,
                onSaveOrder: this.handleSaveTableOrder,
                buildItemProps: this.buildItemProps,
                quickEditFormRef: this.subFormRef,
                columnsTogglable: columnsTogglable,
                combineNum: combineNum,
                combineFromIndex: combineFromIndex,
                expandConfig: expandConfig,
                canAccessSuperData: canAccessSuperData,
                reUseRow: false,
                offset: offset,
                rowClassName: rowClassName,
                rowClassNameExpr: rowClassNameExpr
            }),
            (addable && showAddBtn !== false) || showPager ? (react_1.default.createElement("div", { className: cx('InputTable-toolbar') },
                addable && showAddBtn !== false ? (react_1.default.createElement(Button_1.default, { disabled: disabled, size: "sm", onClick: function () { return _this.addItem(_this.state.items.length); } },
                    react_1.default.createElement(icons_1.Icon, { icon: "plus", className: "icon" }),
                    react_1.default.createElement("span", null, __('add')))) : null,
                showPager
                    ? render('pager', {
                        type: 'pagination'
                    }, {
                        activePage: page,
                        lastPage: lastPage,
                        onPageChange: this.handlePageChange,
                        className: 'InputTable-pager'
                    })
                    : null)) : null));
    };
    FormTable.defaultProps = {
        placeholder: 'placeholder.empty',
        scaffold: {},
        addBtnIcon: 'plus',
        copyBtnIcon: 'copy',
        editBtnIcon: 'pencil',
        deleteBtnIcon: 'minus',
        confirmBtnIcon: 'check',
        cancelBtnIcon: 'close',
        valueField: ''
    };
    FormTable.propsList = [
        'onChange',
        'name',
        'columns',
        'label',
        'scaffold',
        'showAddBtn',
        'addable',
        'removable',
        'copyable',
        'editable',
        'addApi',
        'updateApi',
        'deleteApi',
        'needConfirm',
        'canAccessSuperData',
        'formStore'
    ];
    return FormTable;
}(react_1.default.Component));
exports.default = FormTable;
var TableControlRenderer = /** @class */ (function (_super) {
    (0, tslib_1.__extends)(TableControlRenderer, _super);
    function TableControlRenderer() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    TableControlRenderer = (0, tslib_1.__decorate)([
        (0, Item_1.FormItem)({
            type: 'input-table'
        })
    ], TableControlRenderer);
    return TableControlRenderer;
}(FormTable));
exports.TableControlRenderer = TableControlRenderer;
//# sourceMappingURL=./renderers/Form/InputTable.js.map
