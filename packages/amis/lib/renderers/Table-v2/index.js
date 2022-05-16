"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var react_1 = (0, tslib_1.__importDefault)(require("react"));
var react_dom_1 = require("react-dom");
var mobx_state_tree_1 = require("mobx-state-tree");
var cloneDeep_1 = (0, tslib_1.__importDefault)(require("lodash/cloneDeep"));
var isEqual_1 = (0, tslib_1.__importDefault)(require("lodash/isEqual"));
var Scoped_1 = require("../../Scoped");
var factory_1 = require("../../factory");
var table_1 = tslib_1.__importStar(require("../../components/table"));
var helper_1 = require("../../utils/helper");
var tpl_builtin_1 = require("../../utils/tpl-builtin");
var tpl_1 = require("../../utils/tpl");
var api_1 = require("../../utils/api");
var Checkbox_1 = (0, tslib_1.__importDefault)(require("../../components/Checkbox"));
var table_v2_1 = require("../../store/table-v2");
var HeadCellSearchDropdown_1 = require("./HeadCellSearchDropdown");
require("./TableCell");
require("./ColumnToggler");
var TableRenderer = /** @class */ (function (_super) {
    (0, tslib_1.__extends)(TableRenderer, _super);
    function TableRenderer(props, context) {
        var _this = _super.call(this, props) || this;
        _this.renderedToolbars = [];
        var scoped = context;
        scoped.registerComponent(_this);
        _this.handleColumnToggle = _this.handleColumnToggle.bind(_this);
        _this.getPopOverContainer = _this.getPopOverContainer.bind(_this);
        _this.handleAction = _this.handleAction.bind(_this);
        _this.handleQuickChange = _this.handleQuickChange.bind(_this);
        _this.handleSave = _this.handleSave.bind(_this);
        _this.controlRef = _this.controlRef.bind(_this);
        var store = props.store, columnsTogglable = props.columnsTogglable, columns = props.columns;
        store.update({ columnsTogglable: columnsTogglable, columns: columns });
        TableRenderer_1.syncRows(store, props, undefined) && _this.syncSelected();
        return _this;
    }
    TableRenderer_1 = TableRenderer;
    TableRenderer.prototype.componentWillUnmount = function () {
        var scoped = this.context;
        scoped.unRegisterComponent(this);
    };
    TableRenderer.prototype.controlRef = function (control) {
        // 因为 control 有可能被 n 层 hoc 包裹。
        while (control && control.getWrappedInstance) {
            control = control.getWrappedInstance();
        }
        this.control = control;
    };
    TableRenderer.prototype.syncSelected = function () {
        var _a = this.props, store = _a.store, onSelect = _a.onSelect;
        onSelect &&
            onSelect(null, false, store.selectedRowKeys.map(function (item) { return item; }), store.selectedRows.map(function (item) { return item.data; }));
    };
    TableRenderer.syncRows = function (store, props, prevProps) {
        var source = props.source;
        var value = props.value || props.items;
        var rows = [];
        var updateRows = false;
        if (Array.isArray(value) &&
            (!prevProps || (prevProps.value || prevProps.items) !== value)) {
            updateRows = true;
            rows = value;
        }
        else if (typeof source === 'string') {
            var resolved = (0, tpl_builtin_1.resolveVariableAndFilter)(source, props.data, '| raw');
            var prev = prevProps
                ? (0, tpl_builtin_1.resolveVariableAndFilter)(source, prevProps.data, '| raw')
                : null;
            if (prev && prev === resolved) {
                updateRows = false;
            }
            else if (Array.isArray(resolved)) {
                updateRows = true;
                rows = resolved;
            }
        }
        updateRows &&
            store.initRows(rows, props.getEntryId, props.reUseRow, props.childrenColumnName);
        var selectedRowKeys = [];
        // selectedRowKeysExpr比selectedRowKeys优先级高
        if (props.rowSelection && props.rowSelection.selectedRowKeysExpr) {
            rows.forEach(function (row, index) {
                var _a;
                var flag = (0, tpl_1.filter)(props.rowSelection.selectedRowKeysExpr, {
                    record: row,
                    rowIndex: index
                });
                if (flag === 'true') {
                    selectedRowKeys.push(row[((_a = props === null || props === void 0 ? void 0 : props.rowSelection) === null || _a === void 0 ? void 0 : _a.keyField) || 'key']);
                }
            });
        }
        else if (props.rowSelection && props.rowSelection.selectedRowKeys) {
            selectedRowKeys = (0, tslib_1.__spreadArray)([], props.rowSelection.selectedRowKeys, true);
        }
        if (updateRows && selectedRowKeys.length > 0) {
            store.updateSelected(selectedRowKeys, props.rowSelection.keyField);
        }
        var expandedRowKeys = [];
        if (props.expandable && props.expandable.expandedRowKeysExpr) {
            rows.forEach(function (row, index) {
                var _a;
                var flag = (0, tpl_1.filter)(props.expandable.expandedRowKeysExpr, {
                    record: row,
                    rowIndex: index
                });
                if (flag === 'true') {
                    expandedRowKeys.push(row[((_a = props === null || props === void 0 ? void 0 : props.expandable) === null || _a === void 0 ? void 0 : _a.keyField) || 'key']);
                }
            });
        }
        else if (props.expandable && props.expandable.expandedRowKeys) {
            expandedRowKeys = (0, tslib_1.__spreadArray)([], props.expandable.expandedRowKeys, true);
        }
        if (updateRows && expandedRowKeys.length > 0) {
            store.updateExpanded(expandedRowKeys, props.expandable.keyField);
        }
        return updateRows;
    };
    TableRenderer.prototype.componentDidUpdate = function (prevProps) {
        var props = this.props;
        var store = props.store;
        if ((0, helper_1.anyChanged)(['columnsTogglable'], prevProps, props)) {
            store.update({
                columnsTogglable: props.columnsTogglable
            });
        }
        if ((0, helper_1.anyChanged)(['source', 'value', 'items'], prevProps, props) ||
            (!props.value &&
                !props.items &&
                (props.data !== prevProps.data ||
                    (typeof props.source === 'string' && (0, tpl_builtin_1.isPureVariable)(props.source))))) {
            TableRenderer_1.syncRows(store, props, prevProps) && this.syncSelected();
        }
        if (!(0, isEqual_1.default)(prevProps.columns, props.columns)) {
            store.update({
                columns: props.columns
            });
        }
    };
    TableRenderer.prototype.getPopOverContainer = function () {
        return (0, react_dom_1.findDOMNode)(this);
    };
    TableRenderer.prototype.renderCellSchema = function (schema, props) {
        var render = this.props.render;
        // Table Cell SchemaObject转化成ReactNode
        if (schema && (0, helper_1.isObject)(schema)) {
            // 在TableCell里会根据width设置div的width
            // 原来的table td/th是最外层标签 设置width没问题
            // v2的拆开了 就不需要再设置div的width了
            // 否则加上padding 就超出单元格的区域了
            // children属性在schema里是一个关键字 在渲染器schema中 自定义的children没有用 去掉
            var width = schema.width, children = schema.children, rest = (0, tslib_1.__rest)(schema, ["width", "children"]);
            return render('cell-field', (0, tslib_1.__assign)((0, tslib_1.__assign)({}, rest), { type: 'cell-field', column: rest, data: props.data, name: schema.key }), props);
        }
        return schema;
    };
    TableRenderer.prototype.renderSchema = function (key, schema, props) {
        var render = this.props.render;
        // Header、Footer等SchemaObject转化成ReactNode
        if (schema && (0, helper_1.isObject)(schema)) {
            return render(key || 'field', (0, tslib_1.__assign)((0, tslib_1.__assign)({}, schema), { data: props.data }), props);
        }
        else if (Array.isArray(schema)) {
            var renderers_1 = [];
            schema.forEach(function (s, i) {
                return renderers_1.push(render(key || 'field', (0, tslib_1.__assign)((0, tslib_1.__assign)({}, s), { data: props.data }), (0, tslib_1.__assign)((0, tslib_1.__assign)({}, props), { key: i })));
            });
            return renderers_1;
        }
        return schema;
    };
    // editor传来的处理过的column 还可能包含其他字段
    TableRenderer.prototype.buildColumns = function (columns) {
        var _this = this;
        var _a = this.props, env = _a.env, render = _a.render, store = _a.store, popOverContainer = _a.popOverContainer, canAccessSuperData = _a.canAccessSuperData, showBadge = _a.showBadge, itemBadge = _a.itemBadge, cx = _a.classnames;
        var cols = [];
        var rowSpans = [];
        var colSpans = [];
        Array.isArray(columns) &&
            columns.forEach(function (column, col) {
                var clone = (0, tslib_1.__assign)({}, column);
                var titleSchema = null;
                var titleProps = {
                    popOverContainer: popOverContainer || _this.getPopOverContainer,
                    value: column.title
                };
                if ((0, helper_1.isObject)(column.title)) {
                    titleSchema = (0, cloneDeep_1.default)(column.title);
                }
                else if (typeof column.title === 'string') {
                    titleSchema = { type: 'plain' };
                }
                var titleRender = function (children) {
                    var _a;
                    var content = _this.renderCellSchema(titleSchema, titleProps);
                    var remark = null;
                    if (column.remark) {
                        remark = render('remark', {
                            type: 'remark',
                            tooltip: column.remark,
                            container: env && env.getModalContainer ? env.getModalContainer : undefined
                        });
                    }
                    return (react_1.default.createElement("div", { key: col, className: cx('Table-head-cell-wrapper', (_a = {},
                            _a["".concat(column.className)] = !!column.className,
                            _a["".concat(column.titleClassName)] = !!column.titleClassName,
                            _a)) },
                        content,
                        remark,
                        children));
                };
                Object.assign(clone, {
                    title: titleRender
                });
                // 设置了type值 就完全按渲染器处理了
                if (column.type) {
                    Object.assign(clone, {
                        render: function (text, record, rowIndex, colIndex) {
                            var props = {};
                            var item = store.getRowByIndex(rowIndex);
                            var obj = {
                                children: _this.renderCellSchema(column, {
                                    data: item.locals,
                                    value: column.key
                                        ? (0, tpl_builtin_1.resolveVariable)(column.key, canAccessSuperData ? item.locals : item.data)
                                        : column.key,
                                    popOverContainer: popOverContainer || _this.getPopOverContainer,
                                    onQuickChange: function (values, saveImmediately, savePristine, resetOnFailed) {
                                        _this.handleQuickChange(item, values, saveImmediately, savePristine, resetOnFailed);
                                    },
                                    row: item,
                                    showBadge: showBadge,
                                    itemBadge: itemBadge
                                }),
                                props: props
                            };
                            if (column.rowSpanExpr) {
                                var rowSpan = +(0, tpl_1.filter)(column.rowSpanExpr, {
                                    record: record,
                                    rowIndex: rowIndex,
                                    colIndex: colIndex
                                });
                                if (rowSpan) {
                                    obj.props.rowSpan = rowSpan;
                                    rowSpans.push({ colIndex: colIndex, rowIndex: rowIndex, rowSpan: rowSpan });
                                }
                            }
                            if (column.colSpanExpr) {
                                var colSpan = +(0, tpl_1.filter)(column.colSpanExpr, {
                                    record: record,
                                    rowIndex: rowIndex,
                                    colIndex: colIndex
                                });
                                if (colSpan) {
                                    obj.props.colSpan = colSpan;
                                    colSpans.push({ colIndex: colIndex, rowIndex: rowIndex, colSpan: colSpan });
                                }
                            }
                            rowSpans.forEach(function (item) {
                                if (colIndex === item.colIndex &&
                                    rowIndex > item.rowIndex &&
                                    rowIndex < item.rowIndex + (item.rowSpan || 0)) {
                                    obj.props.rowSpan = 0;
                                }
                            });
                            colSpans.forEach(function (item) {
                                if (rowIndex === item.rowIndex &&
                                    colIndex > item.colIndex &&
                                    colIndex < item.colIndex + (item.colSpan || 0)) {
                                    obj.props.colSpan = 0;
                                }
                            });
                            return obj;
                        }
                    });
                }
                // 设置了单元格样式
                if (column.classNameExpr) {
                    clone.className = function (record, rowIndex) {
                        var className = (0, tpl_1.filter)(column.classNameExpr, { record: record, rowIndex: rowIndex });
                        return "".concat(className).concat(column.className ? " ".concat(column.className) : '');
                    };
                }
                // 设置了列搜索
                if (column.searchable) {
                    clone.filterDropdown = (react_1.default.createElement(HeadCellSearchDropdown_1.HeadCellSearchDropDown, (0, tslib_1.__assign)({}, _this.props, { popOverContainer: _this.getPopOverContainer, name: column.key, searchable: column.searchable, orderBy: store.orderBy, orderDir: store.order, data: store.query, key: 'th-search-' + col, store: store })));
                }
                if (column.children) {
                    clone.children = _this.buildColumns(column.children);
                }
                cols.push(clone);
            });
        return cols;
    };
    TableRenderer.prototype.buildSummary = function (key, summary) {
        var _this = this;
        var result = [];
        if (Array.isArray(summary)) {
            summary.forEach(function (s, index) {
                if ((0, helper_1.isObject)(s)) {
                    result.push({
                        colSpan: s.colSpan,
                        fixed: s.fixed,
                        render: function (dataSouce) {
                            return _this.renderSchema(key, s, {
                                data: dataSouce
                            });
                        }
                    });
                }
                else if (Array.isArray(s)) {
                    if (!result[index]) {
                        result.push([]);
                    }
                    s.forEach(function (d) {
                        result[index].push({
                            colSpan: d.colSpan,
                            fixed: d.fixed,
                            render: function (dataSouce) {
                                return _this.renderSchema(key, d, {
                                    data: dataSouce
                                });
                            }
                        });
                    });
                }
            });
        }
        return result.length ? result : null;
    };
    TableRenderer.prototype.reloadTarget = function (target, data) {
        var scoped = this.context;
        scoped.reload(target, data);
    };
    TableRenderer.prototype.handleSave = function (rows, diff, indexes, unModifiedItems, rowsOrigin, resetOnFailed) {
        var _this = this;
        var _a = this.props, store = _a.store, quickSaveApi = _a.quickSaveApi, quickSaveItemApi = _a.quickSaveItemApi, primaryField = _a.primaryField, env = _a.env, messages = _a.messages, reload = _a.reload;
        if (Array.isArray(rows)) {
            if (!(0, api_1.isEffectiveApi)(quickSaveApi)) {
                env && env.alert('TableV2 quickSaveApi is required');
                return;
            }
            var data_1 = (0, helper_1.createObject)(store.data, {
                rows: rows,
                rowsDiff: diff,
                indexes: indexes,
                rowsOrigin: rowsOrigin
            });
            if (rows.length && rows[0].hasOwnProperty(primaryField || 'id')) {
                data_1.ids = rows
                    .map(function (item) { return item[primaryField || 'id']; })
                    .join(',');
            }
            if (unModifiedItems) {
                data_1.unModifiedItems = unModifiedItems;
            }
            store
                .saveRemote(quickSaveApi, data_1, {
                successMessage: messages && messages.saveFailed,
                errorMessage: messages && messages.saveSuccess
            })
                .then(function () {
                reload && _this.reloadTarget(reload, data_1);
            })
                .catch(function () { });
        }
        else {
            if (!(0, api_1.isEffectiveApi)(quickSaveItemApi)) {
                env && env.alert('TableV2 quickSaveItemApi is required!');
                return;
            }
            var data_2 = (0, helper_1.createObject)(store.data, {
                item: rows,
                modified: diff,
                origin: rowsOrigin
            });
            var sendData = (0, helper_1.createObject)(data_2, rows);
            store
                .saveRemote(quickSaveItemApi, sendData)
                .then(function () {
                reload && _this.reloadTarget(reload, data_2);
            })
                .catch(function () {
                resetOnFailed && _this.control.reset();
            });
        }
    };
    TableRenderer.prototype.handleQuickChange = function (item, values, saveImmediately, savePristine, resetOnFailed) {
        if (!(0, mobx_state_tree_1.isAlive)(item)) {
            return;
        }
        var _a = this.props, onSave = _a.onSave, onPristineChange = _a.onPristineChange, primaryField = _a.primaryField, quickSaveItemApi = _a.quickSaveItemApi;
        item.change(values, savePristine);
        // 值发生变化了，需要通过 onSelect 通知到外面，否则会出现数据不同步的问题
        item.modified && this.syncSelected();
        if (savePristine) {
            onPristineChange === null || onPristineChange === void 0 ? void 0 : onPristineChange(item.data, item.path);
            return;
        }
        if (saveImmediately && saveImmediately.api) {
            this.props.onAction(null, {
                actionType: 'ajax',
                api: saveImmediately.api
            }, values);
            return;
        }
        onSave
            ? onSave(item.data, (0, helper_1.difference)(item.data, item.pristine, ['id', primaryField]), item.path, undefined, item.pristine, resetOnFailed)
            : this.handleSave(quickSaveItemApi ? item.data : [item.data], (0, helper_1.difference)(item.data, item.pristine, ['id', primaryField]), [item.path], undefined, item.pristine, resetOnFailed);
    };
    TableRenderer.prototype.handleColumnToggle = function (columns) {
        return (0, tslib_1.__awaiter)(this, void 0, void 0, function () {
            var _a, dispatchEvent, data, store, rendererEvent;
            return (0, tslib_1.__generator)(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = this.props, dispatchEvent = _a.dispatchEvent, data = _a.data, store = _a.store;
                        return [4 /*yield*/, dispatchEvent('columnToggled', (0, helper_1.createObject)(data, {
                                columns: columns
                            }))];
                    case 1:
                        rendererEvent = _b.sent();
                        if (rendererEvent === null || rendererEvent === void 0 ? void 0 : rendererEvent.prevented) {
                            return [2 /*return*/];
                        }
                        store.update({ columns: columns });
                        return [2 /*return*/];
                }
            });
        });
    };
    TableRenderer.prototype.renderColumnsToggler = function () {
        var _a = this.props, className = _a.className, store = _a.store, render = _a.render, ns = _a.classPrefix, cx = _a.classnames, rest = (0, tslib_1.__rest)(_a, ["className", "store", "render", "classPrefix", "classnames"]);
        var __ = rest.translate;
        var env = rest.env;
        if (!store.toggable) {
            return null;
        }
        var children = store.toggableColumns.map(function (column, index) { return (react_1.default.createElement("li", { className: cx('ColumnToggler-menuItem'), key: 'toggable-li-' + index, onClick: column.toggleToggle },
            react_1.default.createElement(Checkbox_1.default, { key: 'toggable-select' + index, size: "sm", classPrefix: ns, checked: column.toggled }, column.title ? render('tpl', column.title) : null))); });
        return render('column-toggler', {
            type: 'column-toggler'
        }, {
            isActived: store.hasColumnHidden(),
            columns: store.columnsData,
            onColumnToggle: this.handleColumnToggle,
            children: children
        });
    };
    TableRenderer.prototype.handleAction = function (e, action, ctx) {
        var onAction = this.props.onAction;
        // todo
        onAction(e, action, ctx);
    };
    TableRenderer.prototype.renderActions = function (region) {
        var _this = this;
        var _a = this.props, actions = _a.actions, render = _a.render, store = _a.store, cx = _a.classnames, data = _a.data;
        actions = Array.isArray(actions) ? actions.concat() : [];
        if (store.toggable &&
            region === 'header' &&
            !~this.renderedToolbars.indexOf('columns-toggler')) {
            actions.push({
                type: 'button',
                children: this.renderColumnsToggler()
            });
        }
        return Array.isArray(actions) && actions.length ? (react_1.default.createElement("div", { className: cx('Table-toolbar') }, actions.map(function (action, key) {
            return render("action/".concat(key), (0, tslib_1.__assign)({ type: 'button' }, action), {
                onAction: _this.handleAction,
                key: key,
                btnDisabled: store.dragging,
                data: store.getData(data)
            });
        }))) : null;
    };
    TableRenderer.prototype.handleSelected = function (record, value, selectedRows, selectedRowKeys) {
        return (0, tslib_1.__awaiter)(this, void 0, void 0, function () {
            var _a, dispatchEvent, data, rowSelection, onSelect, store, rendererEvent;
            return (0, tslib_1.__generator)(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = this.props, dispatchEvent = _a.dispatchEvent, data = _a.data, rowSelection = _a.rowSelection, onSelect = _a.onSelect, store = _a.store;
                        return [4 /*yield*/, dispatchEvent('selected', (0, helper_1.createObject)(data, {
                                record: record,
                                value: value,
                                selectedRows: selectedRows,
                                selectedRowKeys: selectedRowKeys
                            }))];
                    case 1:
                        rendererEvent = _b.sent();
                        if (rendererEvent === null || rendererEvent === void 0 ? void 0 : rendererEvent.prevented) {
                            return [2 /*return*/, rendererEvent === null || rendererEvent === void 0 ? void 0 : rendererEvent.prevented];
                        }
                        store.updateSelected(selectedRowKeys, rowSelection.keyField);
                        onSelect && onSelect(record, value, selectedRows, selectedRowKeys);
                        return [2 /*return*/];
                }
            });
        });
    };
    TableRenderer.prototype.handleSelectedAll = function (value, selectedRowKeys, selectedRows, changeRows) {
        return (0, tslib_1.__awaiter)(this, void 0, void 0, function () {
            var _a, dispatchEvent, data, rowSelection, onSelectAll, store, rendererEvent;
            return (0, tslib_1.__generator)(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = this.props, dispatchEvent = _a.dispatchEvent, data = _a.data, rowSelection = _a.rowSelection, onSelectAll = _a.onSelectAll, store = _a.store;
                        return [4 /*yield*/, dispatchEvent('selectedAll', (0, helper_1.createObject)(data, {
                                value: value,
                                selectedRowKeys: selectedRowKeys,
                                selectedRows: selectedRows,
                                changeRows: changeRows
                            }))];
                    case 1:
                        rendererEvent = _b.sent();
                        if (rendererEvent === null || rendererEvent === void 0 ? void 0 : rendererEvent.prevented) {
                            return [2 /*return*/, rendererEvent === null || rendererEvent === void 0 ? void 0 : rendererEvent.prevented];
                        }
                        store.updateSelected(selectedRowKeys, rowSelection.keyField);
                        onSelectAll &&
                            onSelectAll(value, selectedRowKeys, selectedRows, selectedRowKeys);
                        return [2 /*return*/];
                }
            });
        });
    };
    TableRenderer.prototype.handleSort = function (payload) {
        return (0, tslib_1.__awaiter)(this, void 0, void 0, function () {
            var _a, dispatchEvent, data, onSort, rendererEvent;
            return (0, tslib_1.__generator)(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = this.props, dispatchEvent = _a.dispatchEvent, data = _a.data, onSort = _a.onSort;
                        return [4 /*yield*/, dispatchEvent('columnSort', (0, helper_1.createObject)(data, (0, tslib_1.__assign)({}, payload)))];
                    case 1:
                        rendererEvent = _b.sent();
                        if (rendererEvent === null || rendererEvent === void 0 ? void 0 : rendererEvent.prevented) {
                            return [2 /*return*/, rendererEvent === null || rendererEvent === void 0 ? void 0 : rendererEvent.prevented];
                        }
                        onSort && onSort(payload);
                        return [2 /*return*/];
                }
            });
        });
    };
    TableRenderer.prototype.handleFilter = function (payload) {
        return (0, tslib_1.__awaiter)(this, void 0, void 0, function () {
            var _a, dispatchEvent, data, onFilter, rendererEvent;
            return (0, tslib_1.__generator)(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = this.props, dispatchEvent = _a.dispatchEvent, data = _a.data, onFilter = _a.onFilter;
                        return [4 /*yield*/, dispatchEvent('columnFilter', (0, helper_1.createObject)(data, {
                                payload: payload
                            }))];
                    case 1:
                        rendererEvent = _b.sent();
                        if (rendererEvent === null || rendererEvent === void 0 ? void 0 : rendererEvent.prevented) {
                            return [2 /*return*/, rendererEvent === null || rendererEvent === void 0 ? void 0 : rendererEvent.prevented];
                        }
                        onFilter && onFilter(payload);
                        return [2 /*return*/];
                }
            });
        });
    };
    TableRenderer.prototype.handleDragOver = function (dataSource) {
        return (0, tslib_1.__awaiter)(this, void 0, void 0, function () {
            var _a, dispatchEvent, data, onDrag, rendererEvent;
            return (0, tslib_1.__generator)(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = this.props, dispatchEvent = _a.dispatchEvent, data = _a.data, onDrag = _a.onDrag;
                        return [4 /*yield*/, dispatchEvent('dragOver', (0, helper_1.createObject)(data, {
                                dataSource: dataSource
                            }))];
                    case 1:
                        rendererEvent = _b.sent();
                        if (rendererEvent === null || rendererEvent === void 0 ? void 0 : rendererEvent.prevented) {
                            return [2 /*return*/, rendererEvent === null || rendererEvent === void 0 ? void 0 : rendererEvent.prevented];
                        }
                        onDrag && onDrag(dataSource);
                        return [2 /*return*/];
                }
            });
        });
    };
    TableRenderer.prototype.doAction = function (action, args, throwErrors) {
        var _a = this.props, store = _a.store, rowSelection = _a.rowSelection;
        var actionType = action === null || action === void 0 ? void 0 : action.actionType;
        var keyField = rowSelection === null || rowSelection === void 0 ? void 0 : rowSelection.keyField;
        switch (actionType) {
            case 'selectAll':
                store.updateSelectedAll(keyField);
                break;
            case 'clearAll':
                store.updateSelected([], keyField);
                break;
            case 'select':
                store.updateSelected(args === null || args === void 0 ? void 0 : args.selectedRowKeys, keyField);
                break;
            default:
                break;
        }
    };
    TableRenderer.prototype.renderTable = function () {
        var _this = this;
        var _a = this.props, render = _a.render, title = _a.title, footer = _a.footer, rowSelection = _a.rowSelection, columns = _a.columns, expandable = _a.expandable, expandableBody = _a.expandableBody, footSummary = _a.footSummary, headSummary = _a.headSummary, loading = _a.loading, cx = _a.classnames, placeholder = _a.placeholder, rowClassNameExpr = _a.rowClassNameExpr, itemActions = _a.itemActions, store = _a.store, rest = (0, tslib_1.__rest)(_a, ["render", "title", "footer", "rowSelection", "columns", "expandable", "expandableBody", "footSummary", "headSummary", "loading", "classnames", "placeholder", "rowClassNameExpr", "itemActions", "store"]);
        var expandableConfig = null;
        if (expandable) {
            var expandedRowKeys = expandable.expandedRowKeys, rest_1 = (0, tslib_1.__rest)(expandable, ["expandedRowKeys"]);
            expandableConfig = (0, tslib_1.__assign)({ expandedRowKeys: store.currentExpandedKeys }, rest_1);
            if (expandable.expandableOn) {
                expandableConfig.rowExpandable = function (record, rowIndex) {
                    return (0, tpl_1.evalExpression)(expandable.expandableOn, { record: record, rowIndex: rowIndex });
                };
                delete expandableConfig.expandableOn;
            }
            if (expandableBody && expandableBody.length > 0) {
                expandableConfig.expandedRowRender = function (record, rowIndex) {
                    return _this.renderSchema('expandableBody', expandableBody, { data: record });
                };
            }
            if (expandable.expandedRowClassNameExpr) {
                expandableConfig.expandedRowClassName = function (record, rowIndex) { return (0, tpl_1.filter)(expandable.expandedRowClassNameExpr, { record: record, rowIndex: rowIndex }); };
                delete expandableConfig.expandedRowClassNameExpr;
            }
        }
        var rowSelectionConfig = null;
        if (rowSelection) {
            var selectedRowKeys = rowSelection.selectedRowKeys, selections = rowSelection.selections, rest_2 = (0, tslib_1.__rest)(rowSelection, ["selectedRowKeys", "selections"]);
            rowSelectionConfig = (0, tslib_1.__assign)({ selectedRowKeys: store.currentSelectedRowKeys }, rest_2);
            if (rowSelection.disableOn) {
                var disableOn_1 = rowSelection.disableOn;
                rowSelectionConfig.getCheckboxProps = function (record, rowIndex) { return ({
                    disabled: (0, tpl_1.evalExpression)(disableOn_1, { record: record, rowIndex: rowIndex })
                }); };
                delete rowSelectionConfig.disableOn;
            }
            if (selections && Array.isArray(selections)) {
                rowSelectionConfig.selections = [];
                selections.forEach(function (item) {
                    rowSelectionConfig.selections.push({
                        key: item.key,
                        text: item.text,
                        onSelect: function (changableRowKeys) {
                            var newSelectedRowKeys = [];
                            newSelectedRowKeys = changableRowKeys.filter(function (key, index) {
                                if (item.key === 'all') {
                                    return true;
                                }
                                if (item.key === 'none') {
                                    return false;
                                }
                                if (item.key === 'invert') {
                                    return !store.currentSelectedRowKeys.includes(key);
                                }
                                // 奇数行
                                if (item.key === 'odd') {
                                    if (index % 2 !== 0) {
                                        return false;
                                    }
                                    return true;
                                }
                                // 偶数行
                                if (item.key === 'even') {
                                    if (index % 2 !== 0) {
                                        return true;
                                    }
                                    return false;
                                }
                                return true;
                            });
                            store.updateSelected(newSelectedRowKeys, rowSelection.keyField);
                        }
                    });
                });
            }
        }
        var rowClassName = undefined;
        // 设置了行样式
        if (rowClassNameExpr) {
            rowClassName = function (record, rowIndex) {
                return (0, tpl_1.filter)(rowClassNameExpr, { record: record, rowIndex: rowIndex });
            };
        }
        var itemActionsConfig = undefined;
        if (itemActions) {
            var finalActions_1 = Array.isArray(itemActions)
                ? itemActions.filter(function (action) { return !action.hiddenOnHover; })
                : [];
            if (!finalActions_1.length) {
                return null;
            }
            itemActionsConfig = function (record, rowIndex) {
                return (react_1.default.createElement("div", { className: cx('Table-itemActions') }, finalActions_1.map(function (action, index) {
                    return render("itemAction/".concat(index), (0, tslib_1.__assign)((0, tslib_1.__assign)({}, action), { isMenuItem: true }), {
                        key: index,
                        item: record,
                        data: record,
                        rowIndex: rowIndex
                    });
                })));
            };
        }
        return (react_1.default.createElement(table_1.default, (0, tslib_1.__assign)({}, rest, { title: this.renderSchema('title', title, { data: this.props.data }), footer: this.renderSchema('footer', footer, { data: this.props.data }), columns: this.buildColumns(store.filteredColumns), dataSource: store.dataSource, rowSelection: rowSelectionConfig, rowClassName: rowClassName, expandable: expandableConfig, footSummary: this.buildSummary('footSummary', footSummary), headSummary: this.buildSummary('headSummary', headSummary), loading: this.renderSchema('loading', loading), placeholder: this.renderSchema('placeholder', placeholder), onSelect: this.handleSelected, onSelectAll: this.handleSelectedAll, onSort: this.handleSort, onFilter: this.handleFilter, onDrag: this.handleDragOver, itemActions: itemActionsConfig })));
    };
    TableRenderer.prototype.render = function () {
        var cx = this.props.classnames;
        this.renderedToolbars = []; // 用来记录哪些 toolbar 已经渲染了
        return (react_1.default.createElement("div", { className: cx('Table-render-wrapper') },
            this.renderActions('header'),
            this.renderTable()));
    };
    var TableRenderer_1, _a, _b, _c, _d, _e, _f, _g, _h;
    TableRenderer.contextType = Scoped_1.ScopedContext;
    (0, tslib_1.__decorate)([
        helper_1.autobind,
        (0, tslib_1.__metadata)("design:type", Function),
        (0, tslib_1.__metadata)("design:paramtypes", [Object, Boolean, typeof (_a = typeof Array !== "undefined" && Array) === "function" ? _a : Object, typeof (_b = typeof Array !== "undefined" && Array) === "function" ? _b : Object]),
        (0, tslib_1.__metadata)("design:returntype", Promise)
    ], TableRenderer.prototype, "handleSelected", null);
    (0, tslib_1.__decorate)([
        helper_1.autobind,
        (0, tslib_1.__metadata)("design:type", Function),
        (0, tslib_1.__metadata)("design:paramtypes", [Boolean, typeof (_c = typeof Array !== "undefined" && Array) === "function" ? _c : Object, typeof (_d = typeof Array !== "undefined" && Array) === "function" ? _d : Object, typeof (_e = typeof Array !== "undefined" && Array) === "function" ? _e : Object]),
        (0, tslib_1.__metadata)("design:returntype", Promise)
    ], TableRenderer.prototype, "handleSelectedAll", null);
    (0, tslib_1.__decorate)([
        helper_1.autobind,
        (0, tslib_1.__metadata)("design:type", Function),
        (0, tslib_1.__metadata)("design:paramtypes", [typeof (_f = typeof table_1.SortProps !== "undefined" && table_1.SortProps) === "function" ? _f : Object]),
        (0, tslib_1.__metadata)("design:returntype", Promise)
    ], TableRenderer.prototype, "handleSort", null);
    (0, tslib_1.__decorate)([
        helper_1.autobind,
        (0, tslib_1.__metadata)("design:type", Function),
        (0, tslib_1.__metadata)("design:paramtypes", [Object]),
        (0, tslib_1.__metadata)("design:returntype", Promise)
    ], TableRenderer.prototype, "handleFilter", null);
    (0, tslib_1.__decorate)([
        helper_1.autobind,
        (0, tslib_1.__metadata)("design:type", Function),
        (0, tslib_1.__metadata)("design:paramtypes", [typeof (_g = typeof Array !== "undefined" && Array) === "function" ? _g : Object]),
        (0, tslib_1.__metadata)("design:returntype", Promise)
    ], TableRenderer.prototype, "handleDragOver", null);
    TableRenderer = TableRenderer_1 = (0, tslib_1.__decorate)([
        (0, factory_1.Renderer)({
            type: 'table-v2',
            storeType: table_v2_1.TableStoreV2.name,
            name: 'table-v2',
            isolateScope: true
        }),
        (0, tslib_1.__metadata)("design:paramtypes", [Object, typeof (_h = typeof Scoped_1.IScopedContext !== "undefined" && Scoped_1.IScopedContext) === "function" ? _h : Object])
    ], TableRenderer);
    return TableRenderer;
}(react_1.default.Component));
exports.default = TableRenderer;
//# sourceMappingURL=./renderers/Table-v2/index.js.map
