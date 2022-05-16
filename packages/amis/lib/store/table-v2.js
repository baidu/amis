"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TableStoreV2 = exports.Row = exports.Column = void 0;
var tslib_1 = require("tslib");
var mobx_state_tree_1 = require("mobx-state-tree");
var find_1 = (0, tslib_1.__importDefault)(require("lodash/find"));
var isEqual_1 = (0, tslib_1.__importDefault)(require("lodash/isEqual"));
var helper_1 = require("../utils/helper");
var api_1 = require("../utils/api");
var service_1 = require("./service");
var ServerError = /** @class */ (function (_super) {
    (0, tslib_1.__extends)(ServerError, _super);
    function ServerError() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.type = 'ServerError';
        return _this;
    }
    return ServerError;
}(Error));
exports.Column = mobx_state_tree_1.types
    .model('Column', {
    title: mobx_state_tree_1.types.optional(mobx_state_tree_1.types.frozen(), undefined),
    key: '',
    toggled: false,
    breakpoint: mobx_state_tree_1.types.optional(mobx_state_tree_1.types.frozen(), undefined),
    pristine: mobx_state_tree_1.types.optional(mobx_state_tree_1.types.frozen(), undefined),
    toggable: true,
    index: 0,
    type: '',
    children: mobx_state_tree_1.types.optional(mobx_state_tree_1.types.array(mobx_state_tree_1.types.late(function () { return exports.Column; })), [])
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
    }
}); });
exports.Row = mobx_state_tree_1.types
    .model('Row', {
    storeType: 'Row',
    id: mobx_state_tree_1.types.identifier,
    key: mobx_state_tree_1.types.string,
    pristine: mobx_state_tree_1.types.frozen({}),
    data: mobx_state_tree_1.types.frozen({}),
    index: mobx_state_tree_1.types.number,
    newIndex: mobx_state_tree_1.types.number,
    depth: mobx_state_tree_1.types.number,
    children: mobx_state_tree_1.types.optional(mobx_state_tree_1.types.array(mobx_state_tree_1.types.late(function () { return exports.Row; })), []),
    path: '' // 行数据的位置
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
    }
}); })
    .actions(function (self) { return ({
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
    },
    change: function (values, savePristine) {
        self.data = (0, helper_1.immutableExtends)(self.data, values);
        savePristine && (self.pristine = self.data);
    }
}); });
exports.TableStoreV2 = service_1.ServiceStore.named('TableStoreV2')
    .props({
    columns: mobx_state_tree_1.types.array(exports.Column),
    rows: mobx_state_tree_1.types.array(exports.Row),
    selectedRowKeys: mobx_state_tree_1.types.array(mobx_state_tree_1.types.frozen()),
    selectedRows: mobx_state_tree_1.types.array(mobx_state_tree_1.types.reference(exports.Row)),
    expandedRowKeys: mobx_state_tree_1.types.array(mobx_state_tree_1.types.frozen()),
    columnsTogglable: mobx_state_tree_1.types.optional(mobx_state_tree_1.types.union(mobx_state_tree_1.types.boolean, mobx_state_tree_1.types.literal('auto')), 'auto'),
    orderBy: '',
    order: mobx_state_tree_1.types.optional(mobx_state_tree_1.types.union(mobx_state_tree_1.types.literal('asc'), mobx_state_tree_1.types.literal('desc')), 'asc'),
    query: mobx_state_tree_1.types.optional(mobx_state_tree_1.types.frozen(), {}),
    pageNo: 1,
    pageSize: 10,
    dragging: false
})
    .views(function (self) {
    function getToggable() {
        if (self.columnsTogglable === 'auto') {
            return self.columns.filter.length > 10;
        }
        return self.columnsTogglable;
    }
    function hasColumnHidden() {
        return self.columns.findIndex(function (column) { return !column.toggled; }) !== -1;
    }
    function getToggableColumns() {
        return self.columns.filter(function (item) { return (0, helper_1.isVisible)(item.pristine, self.data) && item.toggable !== false; });
    }
    function getActiveToggableColumns() {
        return getToggableColumns().filter(function (item) { return item.toggled; });
    }
    function getAllFilteredColumns(columns) {
        if (columns) {
            return columns
                .filter(function (item) {
                return item &&
                    (0, helper_1.isVisible)(item.pristine, (0, helper_1.hasVisibleExpression)(item.pristine) ? self.data : {}) &&
                    (item.toggled || !item.toggable);
            })
                .map(function (item) { return ((0, tslib_1.__assign)((0, tslib_1.__assign)({}, item.pristine), { type: item.type, children: item.children
                    ? getAllFilteredColumns(item.children)
                    : undefined })); });
        }
        return [];
    }
    function getFilteredColumns() {
        return getAllFilteredColumns(self.columns);
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
    function isSelected(row) {
        return !!~self.selectedRows.indexOf(row);
    }
    return {
        get toggable() {
            return getToggable();
        },
        get columnsData() {
            return self.columns;
        },
        get toggableColumns() {
            return getToggableColumns();
        },
        get filteredColumns() {
            return getFilteredColumns();
        },
        get activeToggaleColumns() {
            return getActiveToggableColumns();
        },
        get dataSource() {
            return self.rows.map(function (item) { return item.data; });
        },
        get currentSelectedRowKeys() {
            return self.selectedRowKeys.map(function (item) { return item; });
        },
        get currentExpandedKeys() {
            return self.expandedRowKeys.map(function (item) { return item; });
        },
        // 是否隐藏了某列
        hasColumnHidden: function () {
            return hasColumnHidden();
        },
        getData: getData,
        isSelected: isSelected
    };
})
    .actions(function (self) {
    function updateColumns(columns) {
        if (columns && Array.isArray(columns)) {
            var cols = columns.filter(function (column) { return column; }).concat();
            cols = cols.map(function (item, index) { return ((0, tslib_1.__assign)((0, tslib_1.__assign)({}, item), { index: index, type: item.type || 'plain', pristine: item, toggled: item.toggled !== false, breakpoint: item.breakpoint, children: item.children ? updateColumns(item.children) : [] })); });
            return cols;
        }
        return;
    }
    function update(config) {
        config.columnsTogglable !== void 0 &&
            (self.columnsTogglable = config.columnsTogglable);
        if (typeof config.orderBy === 'string') {
            setOrderByInfo(config.orderBy, config.order === 'desc' ? 'desc' : 'asc');
        }
        if (config.columns && Array.isArray(config.columns)) {
            self.columns.replace(updateColumns(config.columns));
        }
    }
    function persistSaveToggledColumns() {
        var key = location.pathname +
            self.path +
            self.toggableColumns.map(function (item) { return item.key || item.index; }).join('-');
        localStorage.setItem(key, JSON.stringify(self.activeToggaleColumns.map(function (item) { return item.index; })));
    }
    function setOrderByInfo(key, direction) {
        self.orderBy = key;
        self.order = direction;
    }
    function updateQuery(values, updater, pageNoField, pageSizeField, replace) {
        if (pageNoField === void 0) { pageNoField = 'pageNo'; }
        if (pageSizeField === void 0) { pageSizeField = 'pageSize'; }
        if (replace === void 0) { replace = false; }
        var originQuery = self.query;
        self.query = replace
            ? (0, tslib_1.__assign)({}, values) : (0, tslib_1.__assign)((0, tslib_1.__assign)({}, self.query), values);
        if (self.query[pageNoField || 'pageNo']) {
            self.pageNo = parseInt(self.query[pageNoField || 'pageNo'], 10);
        }
        if (self.query[pageSizeField || 'pageSize']) {
            self.pageSize = parseInt(self.query[pageSizeField || 'pageSize'], 10);
        }
        updater &&
            (0, helper_1.isObjectShallowModified)(originQuery, self.query, false) &&
            setTimeout(updater.bind(null, "?".concat((0, helper_1.qsstringify)(self.query))), 4);
    }
    function updateSelectedRows(rows, selectedKeys, keyField) {
        (0, helper_1.eachTree)(rows, function (item) {
            if (~selectedKeys.indexOf(item.pristine[keyField || 'key'])) {
                self.selectedRows.push(item.id);
                self.selectedRowKeys.push(item.pristine[keyField || 'key']);
            }
            else if ((0, find_1.default)(selectedKeys, function (a) { return a && a == item.pristine[keyField || 'key']; })) {
                self.selectedRows.push(item.id);
                self.selectedRowKeys.push(item.pristine[keyField || 'key']);
            }
            else if (item.children) {
                updateSelectedRows(item.children, selectedKeys, keyField);
            }
        });
    }
    function updateSelected(selectedKeys, keyField) {
        self.selectedRows.clear();
        self.selectedRowKeys.clear();
        updateSelectedRows(self.rows, selectedKeys, keyField);
    }
    function updateSelectedAll(keyField) {
        var selectedKeys = [];
        (0, helper_1.eachTree)(self.rows, function (item) {
            return selectedKeys.push(item.pristine[keyField || 'key']);
        });
        updateSelectedRows(self.rows, selectedKeys, keyField);
    }
    function updateExpanded(expandedRowKeys, keyField) {
        self.expandedRowKeys.clear();
        (0, helper_1.eachTree)(self.rows, function (item) {
            if (~expandedRowKeys.indexOf(item.pristine[keyField || 'key'])) {
                self.expandedRowKeys.push(item.pristine[keyField || 'key']);
            }
            else if ((0, find_1.default)(expandedRowKeys, function (a) { return a && a == item.pristine[keyField || 'key']; })) {
                self.expandedRowKeys.push(item.pristine[keyField || 'key']);
            }
        });
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
    function initChildren(children, depth, pindex, parentId, path, keyField) {
        if (path === void 0) { path = ''; }
        var key = keyField || 'children';
        depth += 1;
        return children.map(function (item, index) {
            item = (0, helper_1.isObject)(item)
                ? item
                : {
                    item: item
                };
            var id = (0, helper_1.guid)();
            return {
                id: id,
                parentId: parentId,
                key: String("".concat(pindex, "-").concat(depth, "-").concat(index)),
                path: "".concat(path).concat(index),
                depth: depth,
                index: index,
                newIndex: index,
                pristine: item,
                data: item,
                rowSpans: {},
                children: item && Array.isArray(item[key])
                    ? initChildren(item[key], depth, index, id, "".concat(path).concat(index, "."))
                    : []
            };
        });
    }
    function initRows(rows, getEntryId, reUseRow, keyField) {
        self.selectedRows.clear();
        var key = keyField || 'children';
        var arr = rows.map(function (item, index) {
            var id = getEntryId ? getEntryId(item, index) : (0, helper_1.guid)();
            return {
                id: id,
                key: String("".concat(index, "-1-").concat(index)),
                index: index,
                newIndex: index,
                pristine: item,
                path: "".concat(index),
                data: item,
                depth: 1,
                children: item && Array.isArray(item[key])
                    ? initChildren(item[key], 1, index, id, "".concat(index, "."), key)
                    : []
            };
        });
        replaceRow(arr, reUseRow);
    }
    var saveRemote = (0, mobx_state_tree_1.flow)(function saveRemote(api, data, options) {
        var json, e_1;
        var _a, _b, _c;
        if (options === void 0) { options = {}; }
        return (0, tslib_1.__generator)(this, function (_d) {
            switch (_d.label) {
                case 0:
                    _d.trys.push([0, 2, , 3]);
                    options = (0, tslib_1.__assign)({ method: 'post' }, options);
                    self.markSaving(true);
                    return [4 /*yield*/, (0, mobx_state_tree_1.getEnv)(self).fetcher(api, data, options)];
                case 1:
                    json = _d.sent();
                    self.markSaving(false);
                    if (!(0, helper_1.isEmpty)(json.data) || json.ok) {
                        self.updateData((0, api_1.normalizeApiResponseData)(json.data), {
                            __saved: Date.now()
                        }, !!api && api.replaceData);
                        self.updatedAt = Date.now();
                    }
                    if (!json.ok) {
                        self.updateMessage((_b = (_a = json.msg) !== null && _a !== void 0 ? _a : options.errorMessage) !== null && _b !== void 0 ? _b : self.__('saveFailed'), true);
                        (0, mobx_state_tree_1.getEnv)(self).notify('error', self.msg, json.msgTimeout !== undefined
                            ? {
                                closeButton: true,
                                timeout: json.msgTimeout
                            }
                            : undefined);
                        throw new ServerError(self.msg);
                    }
                    else {
                        self.updateMessage((_c = json.msg) !== null && _c !== void 0 ? _c : options.successMessage);
                        self.msg &&
                            (0, mobx_state_tree_1.getEnv)(self).notify('success', self.msg, json.msgTimeout !== undefined
                                ? {
                                    closeButton: true,
                                    timeout: json.msgTimeout
                                }
                                : undefined);
                    }
                    return [2 /*return*/, json.data];
                case 2:
                    e_1 = _d.sent();
                    self.markSaving(false);
                    if (!(0, mobx_state_tree_1.isAlive)(self) || self.disposed) {
                        return [2 /*return*/];
                    }
                    e_1.type !== 'ServerError' && (0, mobx_state_tree_1.getEnv)(self).notify('error', e_1.message);
                    throw e_1;
                case 3: return [2 /*return*/];
            }
        });
    });
    return {
        update: update,
        persistSaveToggledColumns: persistSaveToggledColumns,
        setOrderByInfo: setOrderByInfo,
        updateQuery: updateQuery,
        initRows: initRows,
        updateSelected: updateSelected,
        updateSelectedAll: updateSelectedAll,
        updateExpanded: updateExpanded,
        // events
        afterCreate: function () {
            setTimeout(function () {
                if (!(0, mobx_state_tree_1.isAlive)(self)) {
                    return;
                }
                var key = location.pathname +
                    self.path +
                    self.toggableColumns.map(function (item) { return item.key || item.index; }).join('-');
                var data = localStorage.getItem(key);
                if (data) {
                    var selectedColumns_1 = JSON.parse(data);
                    self.toggableColumns.forEach(function (item) {
                        return item.setToggled(!!~selectedColumns_1.indexOf(item.index));
                    });
                }
            }, 200);
        },
        saveRemote: saveRemote,
        getRowByIndex: function (rowIndex) {
            return self.rows[rowIndex];
        }
    };
});
//# sourceMappingURL=./store/table-v2.js.map
