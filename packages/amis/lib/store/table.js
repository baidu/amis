"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TableStore = exports.Row = exports.Column = void 0;
var tslib_1 = require("tslib");
var mobx_state_tree_1 = require("mobx-state-tree");
var iRenderer_1 = require("./iRenderer");
var tpl_builtin_1 = require("../utils/tpl-builtin");
var isEqual_1 = (0, tslib_1.__importDefault)(require("lodash/isEqual"));
var find_1 = (0, tslib_1.__importDefault)(require("lodash/find"));
var sortBy_1 = (0, tslib_1.__importDefault)(require("lodash/sortBy"));
var helper_1 = require("../utils/helper");
var tpl_1 = require("../utils/tpl");
var manager_1 = require("./manager");
/**
 * 内部列的数量 '__checkme' | '__dragme' | '__expandme'
 */
var PARTITION_INDEX = 3;
exports.Column = mobx_state_tree_1.types
    .model('Column', {
    label: mobx_state_tree_1.types.optional(mobx_state_tree_1.types.frozen(), undefined),
    type: mobx_state_tree_1.types.optional(mobx_state_tree_1.types.string, 'plain'),
    name: mobx_state_tree_1.types.maybe(mobx_state_tree_1.types.string),
    value: mobx_state_tree_1.types.frozen(),
    groupName: '',
    toggled: false,
    toggable: true,
    expandable: false,
    checkdisable: false,
    isPrimary: false,
    searchable: mobx_state_tree_1.types.maybe(mobx_state_tree_1.types.frozen()),
    enableSearch: true,
    sortable: false,
    filterable: mobx_state_tree_1.types.optional(mobx_state_tree_1.types.frozen(), undefined),
    fixed: '',
    index: 0,
    rawIndex: 0,
    breakpoint: mobx_state_tree_1.types.optional(mobx_state_tree_1.types.frozen(), undefined),
    pristine: mobx_state_tree_1.types.optional(mobx_state_tree_1.types.frozen(), undefined),
    remark: mobx_state_tree_1.types.optional(mobx_state_tree_1.types.frozen(), undefined),
    className: mobx_state_tree_1.types.union(mobx_state_tree_1.types.string, mobx_state_tree_1.types.frozen())
})
    .actions(function (self) { return ({
    toggleToggle: function () {
        self.toggled = !self.toggled;
        var table = (0, mobx_state_tree_1.getParent)(self, 2);
        if (!table.activeToggaleColumns.length) {
            self.toggled = true;
        }
        table.persistSaveToggledColumns();
    },
    setToggled: function (value) {
        self.toggled = value;
    },
    setEnableSearch: function (value) {
        self.enableSearch = value;
        var table = (0, mobx_state_tree_1.getParent)(self, 2);
        table.persistSaveToggledColumns();
    }
}); });
exports.Row = mobx_state_tree_1.types
    .model('Row', {
    storeType: 'Row',
    id: mobx_state_tree_1.types.identifier,
    parentId: '',
    key: mobx_state_tree_1.types.string,
    pristine: mobx_state_tree_1.types.frozen({}),
    data: mobx_state_tree_1.types.frozen({}),
    rowSpans: mobx_state_tree_1.types.frozen({}),
    index: mobx_state_tree_1.types.number,
    newIndex: mobx_state_tree_1.types.number,
    path: '',
    expandable: false,
    checkdisable: false,
    isHover: false,
    children: mobx_state_tree_1.types.optional(mobx_state_tree_1.types.array(mobx_state_tree_1.types.late(function () { return exports.Row; })), []),
    depth: mobx_state_tree_1.types.number // 当前children位于第几层，便于使用getParent获取最顶层TableStore
})
    .views(function (self) { return ({
    get checked() {
        return (0, mobx_state_tree_1.getParent)(self, self.depth * 2).isSelected(self);
    },
    get modified() {
        if (!self.data) {
            return false;
        }
        return Object.keys(self.data).some(function (key) { return !(0, isEqual_1.default)(self.data[key], self.pristine[key]); });
    },
    getDataWithModifiedChilden: function () {
        var data = (0, tslib_1.__assign)({}, self.data);
        if (data.children && self.children) {
            data.children = self.children.map(function (item) {
                return item.getDataWithModifiedChilden();
            });
        }
        return data;
    },
    get collapsed() {
        var table = (0, mobx_state_tree_1.getParent)(self, self.depth * 2);
        if (table.dragging) {
            return true;
        }
        var from = self;
        while (from && from !== table) {
            if (!table.isExpanded(from)) {
                return true;
            }
            from = (0, mobx_state_tree_1.getParent)(from, 2);
        }
        return false;
    },
    get expanded() {
        return !this.collapsed;
    },
    get moved() {
        return self.index !== self.newIndex;
    },
    get locals() {
        var children = null;
        if (self.children.length) {
            children = self.children.map(function (item) { return item.locals; });
        }
        var parent = (0, mobx_state_tree_1.getParent)(self, 2);
        return (0, helper_1.createObject)((0, helper_1.extendObject)((0, mobx_state_tree_1.getParent)(self, self.depth * 2).data, {
            index: self.index,
            // todo 以后再支持多层，目前先一层
            parent: parent.storeType === exports.Row.name ? parent.data : undefined
        }), children
            ? (0, tslib_1.__assign)((0, tslib_1.__assign)({}, self.data), { children: children }) : self.data);
    },
    get checkable() {
        var table = (0, mobx_state_tree_1.getParent)(self, self.depth * 2);
        return table && table.itemCheckableOn
            ? (0, tpl_1.evalExpression)(table.itemCheckableOn, self.locals)
            : true;
    },
    get draggable() {
        var table = (0, mobx_state_tree_1.getParent)(self, self.depth * 2);
        return table && table.itemDraggableOn
            ? (0, tpl_1.evalExpression)(table.itemDraggableOn, self.locals)
            : true;
    }
}); })
    .actions(function (self) { return ({
    toggle: function () {
        (0, mobx_state_tree_1.getParent)(self, self.depth * 2).toggle(self);
    },
    toggleExpanded: function () {
        (0, mobx_state_tree_1.getParent)(self, self.depth * 2).toggleExpanded(self);
    },
    change: function (values, savePristine) {
        self.data = (0, helper_1.immutableExtends)(self.data, values);
        savePristine && (self.pristine = self.data);
    },
    reset: function () {
        self.newIndex = self.index;
        self.data = self.pristine;
    },
    setCheckdisable: function (bool) {
        self.checkdisable = bool;
    },
    setIsHover: function (value) {
        self.isHover = value;
    },
    replaceWith: function (data) {
        Object.keys(data).forEach(function (key) {
            if (key !== 'id') {
                self[key] = data[key];
            }
        });
        if (Array.isArray(data.children)) {
            var arr = data.children;
            var pool = arr.concat();
            // 把多的删了先
            if (self.children.length > arr.length) {
                self.children.splice(arr.length, self.children.length - arr.length);
            }
            var index = 0;
            var len = self.children.length;
            while (pool.length) {
                // 因为父级id未更新，所以需要将子级的parentId正确指向父级id
                var item = (0, tslib_1.__assign)((0, tslib_1.__assign)({}, pool.shift()), { parentId: self.id });
                if (index < len) {
                    self.children[index].replaceWith(item);
                }
                else {
                    var row = exports.Row.create(item);
                    self.children.push(row);
                }
                index++;
            }
        }
    }
}); });
exports.TableStore = iRenderer_1.iRendererStore
    .named('TableStore')
    .props({
    columns: mobx_state_tree_1.types.array(exports.Column),
    rows: mobx_state_tree_1.types.array(exports.Row),
    selectedRows: mobx_state_tree_1.types.array(mobx_state_tree_1.types.reference(exports.Row)),
    expandedRows: mobx_state_tree_1.types.array(mobx_state_tree_1.types.string),
    primaryField: 'id',
    orderBy: '',
    orderDir: mobx_state_tree_1.types.optional(mobx_state_tree_1.types.union(mobx_state_tree_1.types.literal('asc'), mobx_state_tree_1.types.literal('desc')), 'asc'),
    draggable: false,
    dragging: false,
    selectable: false,
    multiple: true,
    footable: mobx_state_tree_1.types.frozen(),
    expandConfig: mobx_state_tree_1.types.frozen(),
    isNested: false,
    columnsTogglable: mobx_state_tree_1.types.optional(mobx_state_tree_1.types.union(mobx_state_tree_1.types.boolean, mobx_state_tree_1.types.literal('auto')), 'auto'),
    itemCheckableOn: '',
    itemDraggableOn: '',
    hideCheckToggler: false,
    combineNum: 0,
    combineFromIndex: 0,
    formsRef: mobx_state_tree_1.types.optional(mobx_state_tree_1.types.array(mobx_state_tree_1.types.frozen()), []),
    maxKeepItemSelectionLength: 0,
    keepItemSelectionOnPageChange: false
})
    .views(function (self) {
    function getColumnsExceptBuiltinTypes() {
        return self.columns.filter(function (item) { return !/^__/.test(item.type); });
    }
    function getForms() {
        return self.formsRef.map(function (item) { return ({
            store: (0, manager_1.getStoreById)(item.id),
            rowIndex: item.rowIndex
        }); });
    }
    function getExportedColumns() {
        return self.columns.filter(function (item) {
            return (item &&
                (0, helper_1.isVisible)(item.pristine, (0, helper_1.hasVisibleExpression)(item.pristine) ? self.data : {}) &&
                (item.type === '__checkme'
                    ? self.selectable &&
                        !self.dragging &&
                        !self.hideCheckToggler &&
                        self.rows.length
                    : item.type === '__dragme'
                        ? self.dragging
                        : item.type === '__expandme'
                            ? (getFootableColumns().length || self.isNested) && !self.dragging
                            : item.toggled || !item.toggable));
        });
    }
    function getFilteredColumns() {
        return self.columns.filter(function (item) {
            return item &&
                (0, helper_1.isVisible)(item.pristine, (0, helper_1.hasVisibleExpression)(item.pristine) ? self.data : {}) &&
                (item.type === '__checkme'
                    ? self.selectable &&
                        !self.dragging &&
                        !self.hideCheckToggler &&
                        self.rows.length
                    : item.type === '__dragme'
                        ? self.dragging
                        : item.type === '__expandme'
                            ? (getFootableColumns().length || self.isNested) && !self.dragging
                            : (item.toggled || !item.toggable) &&
                                (!self.footable ||
                                    !item.breakpoint ||
                                    !(0, helper_1.isBreakpoint)(item.breakpoint)));
        });
    }
    function getFootableColumns() {
        return self.columns.filter(function (item) {
            return item.type === '__checkme' ||
                item.type === '__dragme' ||
                item.type === '__expandme'
                ? false
                : (item.toggled || !item.toggable) &&
                    self.footable &&
                    item.breakpoint &&
                    (0, helper_1.isBreakpoint)(item.breakpoint);
        });
    }
    function getLeftFixedColumns() {
        if (self.dragging) {
            return [];
        }
        var columns = getFilteredColumns().filter(function (item) { return item.fixed === 'left'; });
        // 有才带过去，没有就不带了
        if (columns.length) {
            columns = getFilteredColumns().filter(function (item) { return item.fixed === 'left' || /^__/.test(item.type); });
        }
        return columns;
    }
    function getRightFixedColumns() {
        if (self.dragging) {
            return [];
        }
        return getFilteredColumns().filter(function (item) { return item.fixed === 'right'; });
    }
    function isSelected(row) {
        return !!~self.selectedRows.indexOf(row);
    }
    function isExpanded(row) {
        return self.expandedRows.includes(row.id);
    }
    function getTogglable() {
        if (self.columnsTogglable === 'auto') {
            return self.columns.filter(function (item) { return !/^__/.test(item.type); }).length > 5;
        }
        return self.columnsTogglable;
    }
    function getToggableColumns() {
        return self.columns.filter(function (item) { return (0, helper_1.isVisible)(item.pristine, self.data) && item.toggable !== false; });
    }
    function getActiveToggableColumns() {
        return getToggableColumns().filter(function (item) { return item.toggled; });
    }
    function getModifiedRows(rows, modifiedRows) {
        if (rows === void 0) { rows = []; }
        if (modifiedRows === void 0) { modifiedRows = []; }
        rows = rows && rows.length ? rows : self.rows;
        rows.forEach(function (item) {
            if (item.children && item.children.length) {
                getModifiedRows(item.children, modifiedRows);
            }
            var diff = (0, helper_1.difference)(item.data, item.pristine);
            var hasDifference = Object.keys(diff).length;
            if (hasDifference) {
                modifiedRows.push(item);
            }
        });
        return modifiedRows;
    }
    function getModified() {
        return getModifiedRows().length;
    }
    function getMovedRows() {
        return (0, helper_1.flattenTree)(self.rows).filter(function (item) { return item.moved; });
    }
    function getMoved() {
        return getMovedRows().length;
    }
    function getHovedRow() {
        return (0, helper_1.flattenTree)(self.rows).find(function (item) { return item.isHover; });
    }
    function getUnSelectedRows() {
        return (0, helper_1.flattenTree)(self.rows).filter(function (item) { return !item.checked; });
    }
    function getData(superData) {
        return (0, helper_1.createObject)(superData, {
            items: self.rows.map(function (item) { return item.data; }),
            selectedItems: self.selectedRows.map(function (item) { return item.data; }),
            unSelectedItems: getUnSelectedRows().map(function (item) { return item.data; })
        });
    }
    function hasColumnHidden() {
        return self.columns.findIndex(function (column) { return !column.toggled; }) !== -1;
    }
    function getColumnGroup() {
        var columns = getFilteredColumns();
        var len = columns.length;
        if (!len) {
            return [];
        }
        var groups = [
            {
                label: columns[0].groupName,
                colSpan: 1,
                rowSpan: 1,
                index: columns[0].index,
                has: [columns[0]]
            }
        ];
        //  如果是勾选栏，让它和下一列合并。
        if (columns[0].type === '__checkme' && columns[1]) {
            groups[0].label = columns[1].groupName;
        }
        for (var i = 1; i < len; i++) {
            var prev = groups[groups.length - 1];
            var current = columns[i];
            if (current.groupName === prev.label ||
                (0, tpl_builtin_1.resolveVariableAndFilter)(current.groupName, self.data) ===
                    (0, tpl_builtin_1.resolveVariableAndFilter)(prev.label, self.data)) {
                prev.colSpan++;
                prev.has.push(current);
            }
            else {
                groups.push({
                    label: current.groupName || ' ',
                    colSpan: 1,
                    rowSpan: 1,
                    index: current.index,
                    has: [current]
                });
            }
        }
        if (groups.length === 1 && !groups[0].label) {
            groups.pop();
        }
        return groups.map(function (item) {
            var rowSpan = !item.label ||
                (item.has.length === 1 && item.label === item.has[0].label)
                ? 2
                : 1;
            return (0, tslib_1.__assign)((0, tslib_1.__assign)({}, item), { rowSpan: rowSpan, label: rowSpan === 2 ? item.label || item.has[0].label : item.label });
        });
    }
    function getFirstToggledColumnIndex() {
        var column = self.columns.find(function (column) { return !/^__/.test(column.type) && column.toggled; });
        return column == null ? null : column.index;
    }
    function getSearchableColumns() {
        return self.columns.filter(function (column) { return column.searchable; });
    }
    return {
        get columnsData() {
            return getColumnsExceptBuiltinTypes();
        },
        get forms() {
            return getForms();
        },
        get searchableColumns() {
            return getSearchableColumns();
        },
        get activedSearchableColumns() {
            return getSearchableColumns().filter(function (column) { return column.enableSearch; });
        },
        /** 导出excel列（包含breakpoint列） */
        get exportColumns() {
            return getExportedColumns();
        },
        get filteredColumns() {
            return getFilteredColumns();
        },
        get footableColumns() {
            return getFootableColumns();
        },
        get leftFixedColumns() {
            return getLeftFixedColumns();
        },
        get rightFixedColumns() {
            return getRightFixedColumns();
        },
        get toggableColumns() {
            return getToggableColumns();
        },
        get activeToggaleColumns() {
            return getActiveToggableColumns();
        },
        get someChecked() {
            return !!self.selectedRows.length;
        },
        get allChecked() {
            return !!(self.selectedRows.length ===
                self.checkableRows.length &&
                self.checkableRows.length);
        },
        isSelected: isSelected,
        get allExpanded() {
            return !!(self.expandedRows.length === this.expandableRows.length &&
                this.expandableRows.length);
        },
        isExpanded: isExpanded,
        get toggable() {
            return getTogglable();
        },
        get modified() {
            return getModified();
        },
        get modifiedRows() {
            return getModifiedRows();
        },
        get unSelectedRows() {
            return getUnSelectedRows();
        },
        get checkableRows() {
            return (0, helper_1.flattenTree)(self.rows).filter(function (item) { return item.checkable; });
        },
        get expandableRows() {
            return self.rows.filter(function (item) { return item.expandable; });
        },
        get moved() {
            return getMoved();
        },
        get movedRows() {
            return getMovedRows();
        },
        get hoverRow() {
            return getHovedRow();
        },
        get disabledHeadCheckbox() {
            var _a;
            var selectedLength = (_a = self.data) === null || _a === void 0 ? void 0 : _a.selectedItems.length;
            var maxLength = self.maxKeepItemSelectionLength;
            if (!self.data || !self.keepItemSelectionOnPageChange || !maxLength) {
                return false;
            }
            return maxLength === selectedLength;
        },
        get firstToggledColumnIndex() {
            return getFirstToggledColumnIndex();
        },
        getData: getData,
        get columnGroup() {
            return getColumnGroup();
        },
        getRowById: function (id) {
            return (0, helper_1.findTree)(self.rows, function (item) { return item.id === id; });
        },
        getItemsByName: function (name) {
            return this.forms
                .filter(function (form) { return form.rowIndex === parseInt(name, 10); })
                .map(function (item) { return item.store; });
        },
        // 是否隐藏了某列
        hasColumnHidden: function () {
            return hasColumnHidden();
        },
        getExpandedRows: function () {
            var list = [];
            (0, helper_1.eachTree)(self.rows, function (i) {
                if (self.expandedRows.includes(i.id)) {
                    list.push(i);
                }
            });
            return list;
        }
    };
})
    .actions(function (self) {
    function update(config) {
        config.primaryField !== void 0 &&
            (self.primaryField = config.primaryField);
        config.selectable !== void 0 && (self.selectable = config.selectable);
        config.columnsTogglable !== void 0 &&
            (self.columnsTogglable = config.columnsTogglable);
        config.draggable !== void 0 && (self.draggable = config.draggable);
        if (typeof config.orderBy === 'string') {
            setOrderByInfo(config.orderBy, config.orderDir === 'desc' ? 'desc' : 'asc');
        }
        config.multiple !== void 0 && (self.multiple = config.multiple);
        config.footable !== void 0 && (self.footable = config.footable);
        config.expandConfig !== void 0 &&
            (self.expandConfig = config.expandConfig);
        config.itemCheckableOn !== void 0 &&
            (self.itemCheckableOn = config.itemCheckableOn);
        config.itemDraggableOn !== void 0 &&
            (self.itemDraggableOn = config.itemDraggableOn);
        config.hideCheckToggler !== void 0 &&
            (self.hideCheckToggler = !!config.hideCheckToggler);
        config.combineNum !== void 0 &&
            (self.combineNum = parseInt(config.combineNum, 10) || 0);
        config.combineFromIndex !== void 0 &&
            (self.combineFromIndex =
                parseInt(config.combineFromIndex, 10) || 0);
        config.maxKeepItemSelectionLength !== void 0 &&
            (self.maxKeepItemSelectionLength = config.maxKeepItemSelectionLength);
        config.keepItemSelectionOnPageChange !== void 0 &&
            (self.keepItemSelectionOnPageChange =
                config.keepItemSelectionOnPageChange);
        if (config.columns && Array.isArray(config.columns)) {
            var columns = config.columns
                .filter(function (column) { return column; })
                .concat();
            if (!columns.length) {
                columns.push({
                    type: 'text',
                    label: '空'
                });
            }
            // 更新列顺序，afterCreate生命周期中更新columns不会触发组件的render
            var key = getPersistDataKey(columns);
            var data = localStorage.getItem(key);
            var tableMetaData = null;
            if (data) {
                try {
                    tableMetaData = JSON.parse(data);
                }
                catch (error) { }
                var order_1 = tableMetaData === null || tableMetaData === void 0 ? void 0 : tableMetaData.columnOrder;
                if (Array.isArray(order_1) && order_1.length != 0) {
                    columns = (0, sortBy_1.default)(columns, function (item, index) {
                        return order_1.indexOf(item.name || item.label || index);
                    });
                }
            }
            columns.unshift({
                type: '__expandme',
                toggable: false,
                className: 'Table-expandCell'
            });
            columns.unshift({
                type: '__checkme',
                fixed: 'left',
                toggable: false,
                className: 'Table-checkCell'
            });
            columns.unshift({
                type: '__dragme',
                toggable: false,
                className: 'Table-dragCell'
            });
            columns = columns.map(function (item, index) { return ((0, tslib_1.__assign)((0, tslib_1.__assign)({}, item), { index: index, rawIndex: index - PARTITION_INDEX, type: item.type || 'plain', pristine: item, toggled: item.toggled !== false, breakpoint: item.breakpoint, isPrimary: index === PARTITION_INDEX, className: item.className || '' })); });
            self.columns.replace(columns);
        }
    }
    function updateColumns(columns) {
        if (columns && Array.isArray(columns)) {
            columns = columns.filter(function (column) { return column; }).concat();
            if (!columns.length) {
                columns.push({
                    type: 'text',
                    label: '空'
                });
            }
            columns.unshift({
                type: '__expandme',
                toggable: false,
                className: 'Table-expandCell'
            });
            columns.unshift({
                type: '__checkme',
                fixed: 'left',
                toggable: false,
                className: 'Table-checkCell'
            });
            columns.unshift({
                type: '__dragme',
                toggable: false,
                className: 'Table-dragCell'
            });
            columns = columns.map(function (item, index) { return ((0, tslib_1.__assign)((0, tslib_1.__assign)({}, item), { index: index, rawIndex: index - PARTITION_INDEX, type: item.type || 'plain', pristine: item.pristine || item, toggled: item.toggled !== false, breakpoint: item.breakpoint, isPrimary: index === PARTITION_INDEX })); });
            self.columns.replace(columns);
            persistSaveToggledColumns();
        }
    }
    function combineCell(arr, keys) {
        if (!keys.length || !arr.length) {
            return arr;
        }
        var key = keys.shift();
        var rowIndex = 0;
        var row = arr[rowIndex];
        row.rowSpans[key] = 1;
        var value = (0, tpl_builtin_1.resolveVariable)(key, row.data);
        for (var i = 1, len = arr.length; i < len; i++) {
            var current = arr[i];
            if ((0, isEqual_1.default)((0, tpl_builtin_1.resolveVariable)(key, current.data), value)) {
                row.rowSpans[key] += 1;
                current.rowSpans[key] = 0;
            }
            else {
                if (row.rowSpans[key] > 1) {
                    combineCell(arr.slice(rowIndex, i), keys.concat());
                }
                rowIndex = i;
                row = current;
                row.rowSpans[key] = 1;
                value = (0, tpl_builtin_1.resolveVariable)(key, row.data);
            }
        }
        if (row.rowSpans[key] > 1 && keys.length) {
            combineCell(arr.slice(rowIndex, arr.length), keys.concat());
        }
        return arr;
    }
    function autoCombineCell(arr, columns, maxCount, fromIndex) {
        if (fromIndex === void 0) { fromIndex = 0; }
        if (!columns.length || !maxCount || !arr.length) {
            return arr;
        }
        // 如果是嵌套模式，通常第一列都是存在差异的，所以从第二列开始。
        fromIndex =
            fromIndex ||
                (arr.some(function (item) { return Array.isArray(item.children) && item.children.length; })
                    ? 1
                    : 0);
        var keys = [];
        var len = columns.length;
        for (var i = 0; i < len; i++) {
            var column = columns[i];
            // maxCount 可能比实际配置的 columns 还有多。
            if (!column) {
                break;
            }
            if ('__' === column.type.substring(0, 2)) {
                maxCount++;
                continue;
            }
            var key = column.name;
            if (!key) {
                break;
            }
            keys.push(key);
        }
        while (fromIndex--) {
            keys.shift();
        }
        while (keys.length > maxCount) {
            keys.pop();
        }
        return combineCell(arr, keys);
    }
    function initChildren(children, depth, pindex, parentId, path) {
        if (path === void 0) { path = ''; }
        depth += 1;
        return children.map(function (item, index) {
            var _a;
            item = (0, helper_1.isObject)(item)
                ? item
                : {
                    item: item
                };
            var id = (_a = item.__id) !== null && _a !== void 0 ? _a : (0, helper_1.guid)();
            return {
                // id: String(item && (item as any)[self.primaryField] || `${pindex}-${depth}-${key}`),
                id: String(id),
                parentId: String(parentId),
                key: String("".concat(pindex, "-").concat(depth, "-").concat(index)),
                path: "".concat(path).concat(index),
                depth: depth,
                index: index,
                newIndex: index,
                pristine: item,
                data: item,
                rowSpans: {},
                children: item && Array.isArray(item.children)
                    ? initChildren(item.children, depth, index, id, "".concat(path).concat(index, "."))
                    : [],
                expandable: !!((item && Array.isArray(item.children) && item.children.length) ||
                    (self.footable && self.footableColumns.length))
            };
        });
    }
    function initRows(rows, getEntryId, reUseRow) {
        self.selectedRows.clear();
        // self.expandedRows.clear();
        var arr = rows.map(function (item, index) {
            var _a;
            if (!(0, helper_1.isObject)(item)) {
                item = {
                    item: item
                };
            }
            var id = String(getEntryId ? getEntryId(item, index) : (_a = item.__id) !== null && _a !== void 0 ? _a : (0, helper_1.guid)());
            return {
                // id: getEntryId ? getEntryId(item, key) : String(item && (item as any)[self.primaryField] || `${key}-1-${key}`),
                id: id,
                key: String("".concat(index, "-1-").concat(index)),
                depth: 1,
                index: index,
                newIndex: index,
                pristine: item,
                path: "".concat(index),
                data: item,
                rowSpans: {},
                children: item && Array.isArray(item.children)
                    ? initChildren(item.children, 1, index, id, "".concat(index, "."))
                    : [],
                expandable: !!((item && Array.isArray(item.children) && item.children.length) ||
                    (self.footable && self.footableColumns.length))
            };
        });
        if (self.combineNum) {
            arr = autoCombineCell(arr, self.columns, self.combineNum, self.combineFromIndex);
        }
        replaceRow(arr, reUseRow);
        self.isNested = self.rows.some(function (item) { return item.children.length; });
        var expand = self.footable && self.footable.expand;
        if (expand === 'first' ||
            (self.expandConfig && self.expandConfig.expand === 'first')) {
            self.rows.length && self.expandedRows.push(self.rows[0].id);
        }
        else if ((expand === 'all' && !self.footable.accordion) ||
            (self.expandConfig &&
                self.expandConfig.expand === 'all' &&
                !self.expandConfig.accordion)) {
            self.expandedRows.replace(self.rows.map(function (item) { return item.id; }));
        }
        self.dragging = false;
    }
    // 尽可能的复用 row
    function replaceRow(arr, reUseRow) {
        if (reUseRow === false) {
            self.rows.replace(arr.map(function (item) { return exports.Row.create(item); }));
            return;
        }
        var pool = arr.concat();
        // 把多的删了先
        if (self.rows.length > arr.length) {
            self.rows.splice(arr.length, self.rows.length - arr.length);
        }
        var index = 0;
        var len = self.rows.length;
        while (pool.length) {
            var item = pool.shift();
            if (index < len) {
                self.rows[index].replaceWith(item);
            }
            else {
                var row = exports.Row.create(item);
                self.rows.push(row);
            }
            index++;
        }
    }
    function updateSelected(selected, valueField) {
        self.selectedRows.clear();
        (0, helper_1.eachTree)(self.rows, function (item) {
            if (~selected.indexOf(item.pristine)) {
                self.selectedRows.push(item.id);
            }
            else if ((0, find_1.default)(selected, function (a) {
                return a[valueField || 'value'] &&
                    a[valueField || 'value'] == item.pristine[valueField || 'value'];
            })) {
                self.selectedRows.push(item.id);
            }
        });
        updateCheckDisable();
    }
    function toggleAll() {
        var _a;
        var maxLength = self.maxKeepItemSelectionLength;
        var keep = self.keepItemSelectionOnPageChange;
        if (self.allChecked) {
            self.selectedRows.clear();
        }
        else {
            var selectedItems_1 = (_a = self.data) === null || _a === void 0 ? void 0 : _a.selectedItems;
            if (keep &&
                maxLength &&
                selectedItems_1 &&
                maxLength >= selectedItems_1.length) {
                var restCheckableRows = self.checkableRows.filter(function (item) { return !item.checked; });
                var checkableRows = restCheckableRows.filter(function (item, i) { return i < maxLength - selectedItems_1.length; });
                self.selectedRows.replace((0, tslib_1.__spreadArray)((0, tslib_1.__spreadArray)([], self.selectedRows, true), checkableRows, true));
            }
            else {
                self.selectedRows.replace(self.checkableRows);
            }
        }
    }
    // 记录最近一次点击的多选框，主要用于 shift 多选时判断上一个选的是什么
    var lastCheckedRow = null;
    function toggle(row) {
        if (!row.checkable) {
            return;
        }
        lastCheckedRow = row;
        var idx = self.selectedRows.indexOf(row);
        if (self.multiple) {
            ~idx ? self.selectedRows.splice(idx, 1) : self.selectedRows.push(row);
        }
        else {
            ~idx
                ? self.selectedRows.splice(idx, 1)
                : self.selectedRows.replace([row]);
        }
    }
    // 按住 shift 的时候点击选项
    function toggleShift(row) {
        // 如果是同一个或非 multiple 模式下就和不用 shift 一样
        if (!lastCheckedRow || row === lastCheckedRow || !self.multiple) {
            toggle(row);
            return;
        }
        var maxLength = self.maxKeepItemSelectionLength;
        var checkableRows = self.checkableRows;
        var lastCheckedRowIndex = checkableRows.findIndex(function (row) { return row === lastCheckedRow; });
        var rowIndex = checkableRows.findIndex(function (rowItem) { return row === rowItem; });
        var minIndex = lastCheckedRowIndex > rowIndex ? rowIndex : lastCheckedRowIndex;
        var maxIndex = lastCheckedRowIndex > rowIndex ? lastCheckedRowIndex : rowIndex;
        var rows = checkableRows.slice(minIndex, maxIndex);
        rows.push(row); // 将当前行也加入进行判断
        for (var _i = 0, rows_1 = rows; _i < rows_1.length; _i++) {
            var rowItem = rows_1[_i];
            var idx = self.selectedRows.indexOf(rowItem);
            if (idx === -1) {
                // 如果上一个是选中状态，则将之间的所有 check 都变成可选
                if (lastCheckedRow.checked) {
                    if (maxLength) {
                        if (self.selectedRows.length < maxLength) {
                            self.selectedRows.push(rowItem);
                        }
                    }
                    else {
                        self.selectedRows.push(rowItem);
                    }
                }
            }
            else {
                if (!lastCheckedRow.checked) {
                    self.selectedRows.splice(idx, 1);
                }
            }
        }
        lastCheckedRow = row;
    }
    function updateCheckDisable() {
        if (!self.data) {
            return;
        }
        var maxLength = self.maxKeepItemSelectionLength;
        var selectedItems = self.data.selectedItems;
        self.selectedRows.map(function (item) { return item.setCheckdisable(false); });
        if (maxLength && maxLength <= selectedItems.length) {
            self.unSelectedRows.map(function (item) { return !item.checked && item.setCheckdisable(true); });
        }
        else {
            self.unSelectedRows.map(function (item) { return item.checkdisable && item.setCheckdisable(false); });
        }
    }
    function clear() {
        self.selectedRows.clear();
    }
    function toggleExpandAll() {
        if (self.allExpanded) {
            self.expandedRows.clear();
        }
        else {
            self.expandedRows.replace(self.rows.filter(function (item) { return item.expandable; }).map(function (item) { return item.id; }));
        }
    }
    function toggleExpanded(row) {
        var idx = self.expandedRows.indexOf(row.id);
        if (~idx) {
            self.expandedRows.splice(idx, 1);
        }
        else if (self.footable && self.footable.accordion) {
            self.expandedRows.replace([row.id]);
        }
        else if (self.expandConfig && self.expandConfig.accordion) {
            var rows = self
                .getExpandedRows()
                .filter(function (item) { return item.depth !== row.depth; });
            rows.push(row);
            self.expandedRows.replace(rows.map(function (item) { return item.id; }));
        }
        else {
            self.expandedRows.push(row.id);
        }
    }
    function collapseAllAtDepth(depth) {
        var rows = self.getExpandedRows().filter(function (item) { return item.depth !== depth; });
        self.expandedRows.replace(rows.map(function (item) { return item.id; }));
    }
    function setOrderByInfo(key, direction) {
        self.orderBy = key;
        self.orderDir = direction;
    }
    function reset() {
        self.rows.forEach(function (item) { return item.reset(); });
        var rows = self.rows.concat();
        (0, helper_1.eachTree)(rows, function (item) {
            if (item.children) {
                var rows_2 = item.children.concat().sort(function (a, b) { return a.index - b.index; });
                rows_2.forEach(function (item) { return item.reset(); });
                item.children.replace(rows_2);
            }
        });
        rows.forEach(function (item) { return item.reset(); });
        rows = rows.sort(function (a, b) { return a.index - b.index; });
        self.rows.replace(rows);
        self.dragging = false;
    }
    function toggleDragging() {
        self.dragging = !self.dragging;
    }
    function stopDragging() {
        self.dragging = false;
    }
    function exchange(fromIndex, toIndex, item) {
        item = item || self.rows[fromIndex];
        if (item.parentId) {
            var parent = self.getRowById(item.parentId);
            var offset = parent.children.indexOf(item) - fromIndex;
            toIndex += offset;
            fromIndex += offset;
            var newRows_1 = parent.children.concat();
            newRows_1.splice(fromIndex, 1);
            newRows_1.splice(toIndex, 0, item);
            newRows_1.forEach(function (item, index) { return (item.newIndex = index); });
            parent.children.replace(newRows_1);
            return;
        }
        var newRows = self.rows.concat();
        newRows.splice(fromIndex, 1);
        newRows.splice(toIndex, 0, item);
        newRows.forEach(function (item, index) { return (item.newIndex = index); });
        self.rows.replace(newRows);
    }
    /**
     * 前端持久化记录列排序，查询字段，显示列信息
     */
    function persistSaveToggledColumns() {
        var key = getPersistDataKey(self.columnsData);
        localStorage.setItem(key, JSON.stringify({
            // 可显示列index
            toggledColumnIndex: self.activeToggaleColumns.map(function (item) { return item.index; }),
            // 列排序，name，label可能不存在
            columnOrder: self.columnsData.map(function (item) { return item.name || item.label || item.rawIndex; }),
            // 已激活的可查询列
            enabledSearchableColumn: self.activedSearchableColumns.map(function (item) { return item.name; })
        }));
    }
    function addForm(form, rowIndex) {
        self.formsRef.push({
            id: form.id,
            rowIndex: rowIndex
        });
    }
    function toggleAllColumns() {
        if (self.activeToggaleColumns.length) {
            if (self.activeToggaleColumns.length === self.toggableColumns.length) {
                self.toggableColumns.map(function (column) { return column.setToggled(false); });
            }
            else {
                self.toggableColumns.map(function (column) { return column.setToggled(true); });
            }
        }
        else {
            // 如果没有一个激活的，那就改成全选
            self.toggableColumns.map(function (column) { return column.setToggled(true); });
        }
        persistSaveToggledColumns();
    }
    function getPersistDataKey(columns) {
        // 这里的columns使用除了__开头的所有列
        // sort保证存储和读取的key值保持一致
        return (location.pathname +
            self.path +
            (0, sortBy_1.default)(columns.map(function (item, index) { return item.name || item.label || index; })).join('-'));
    }
    return {
        update: update,
        updateColumns: updateColumns,
        initRows: initRows,
        updateSelected: updateSelected,
        toggleAll: toggleAll,
        toggle: toggle,
        toggleShift: toggleShift,
        toggleExpandAll: toggleExpandAll,
        toggleExpanded: toggleExpanded,
        collapseAllAtDepth: collapseAllAtDepth,
        clear: clear,
        setOrderByInfo: setOrderByInfo,
        reset: reset,
        toggleDragging: toggleDragging,
        stopDragging: stopDragging,
        exchange: exchange,
        addForm: addForm,
        toggleAllColumns: toggleAllColumns,
        persistSaveToggledColumns: persistSaveToggledColumns,
        // events
        afterCreate: function () {
            setTimeout(function () {
                if (!(0, mobx_state_tree_1.isAlive)(self)) {
                    return;
                }
                var key = getPersistDataKey(self.columnsData);
                var data = localStorage.getItem(key);
                if (data) {
                    var tableMetaData_1 = JSON.parse(data);
                    var toggledColumns_1 = (0, helper_1.isObject)(tableMetaData_1)
                        ? tableMetaData_1 === null || tableMetaData_1 === void 0 ? void 0 : tableMetaData_1.toggledColumnIndex
                        : tableMetaData_1; // 兼容之前的类型
                    self.toggableColumns.forEach(function (item) {
                        return item.setToggled(!!~toggledColumns_1.indexOf(item.index));
                    });
                    self.searchableColumns.forEach(function (item) {
                        var _a;
                        item.setEnableSearch(!!~((_a = tableMetaData_1 === null || tableMetaData_1 === void 0 ? void 0 : tableMetaData_1.enabledSearchableColumn) !== null && _a !== void 0 ? _a : []).indexOf(item.name));
                    });
                }
            }, 200);
        }
    };
});
//# sourceMappingURL=./store/table.js.map
