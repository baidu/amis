"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CRUDStore = void 0;
var tslib_1 = require("tslib");
var file_saver_1 = require("file-saver");
var mobx_state_tree_1 = require("mobx-state-tree");
var service_1 = require("./service");
var helper_1 = require("../utils/helper");
var pick_1 = (0, tslib_1.__importDefault)(require("lodash/pick"));
var tpl_builtin_1 = require("../utils/tpl-builtin");
var api_1 = require("../utils/api");
var match_sorter_1 = require("match-sorter");
var ServerError = /** @class */ (function (_super) {
    (0, tslib_1.__extends)(ServerError, _super);
    function ServerError() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.type = 'ServerError';
        return _this;
    }
    return ServerError;
}(Error));
exports.CRUDStore = service_1.ServiceStore.named('CRUDStore')
    .props({
    pristineQuery: mobx_state_tree_1.types.optional(mobx_state_tree_1.types.frozen(), {}),
    query: mobx_state_tree_1.types.optional(mobx_state_tree_1.types.frozen(), {}),
    prevPage: 1,
    page: 1,
    perPage: 10,
    total: 0,
    mode: 'normal',
    hasNext: false,
    selectedAction: mobx_state_tree_1.types.frozen(),
    columns: mobx_state_tree_1.types.frozen(),
    items: mobx_state_tree_1.types.optional(mobx_state_tree_1.types.array(mobx_state_tree_1.types.frozen()), []),
    selectedItems: mobx_state_tree_1.types.optional(mobx_state_tree_1.types.array(mobx_state_tree_1.types.frozen()), []),
    unSelectedItems: mobx_state_tree_1.types.optional(mobx_state_tree_1.types.array(mobx_state_tree_1.types.frozen()), []),
    filterTogggable: false,
    filterVisible: true,
    hasInnerModalOpen: false
})
    .views(function (self) { return ({
    get lastPage() {
        return Math.max(Math.ceil(self.total / (self.perPage < 1 ? 10 : self.perPage)), 1);
    },
    get filterData() {
        return (0, helper_1.createObject)(self.data, (0, tslib_1.__assign)({}, self.query));
    },
    get mergedData() {
        return (0, helper_1.extendObject)(self.data, (0, tslib_1.__assign)((0, tslib_1.__assign)((0, tslib_1.__assign)({}, self.query), self.data), { selectedItems: self.selectedItems, unSelectedItems: self.unSelectedItems }));
    },
    get hasModalOpened() {
        return self.dialogOpen || self.drawerOpen || self.hasInnerModalOpen;
    },
    get selectedItemsAsArray() {
        return self.selectedItems.concat();
    },
    fetchCtxOf: function (data, options) {
        var _a;
        return (0, helper_1.createObject)(data, (0, tslib_1.__assign)((0, tslib_1.__assign)((0, tslib_1.__assign)({}, self.query), (_a = {}, _a[options.pageField || 'page'] = self.page, _a[options.perPageField || 'perPage'] = self.perPage, _a)), data));
    }
}); })
    .actions(function (self) {
    var fetchCancel = null;
    function setPristineQuery() {
        self.pristineQuery = self.query;
    }
    function updateQuery(values, updater, pageField, perPageField, replace) {
        if (pageField === void 0) { pageField = 'page'; }
        if (perPageField === void 0) { perPageField = 'perPage'; }
        if (replace === void 0) { replace = false; }
        var originQuery = self.query;
        self.query = replace
            ? (0, tslib_1.__assign)({}, values) : (0, tslib_1.__assign)((0, tslib_1.__assign)({}, self.query), values);
        if (self.query[pageField || 'page']) {
            self.page = parseInt(self.query[pageField || 'page'], 10);
        }
        if (self.query[perPageField || 'perPage']) {
            self.perPage = parseInt(self.query[perPageField || 'perPage'], 10);
        }
        updater &&
            (0, helper_1.isObjectShallowModified)(originQuery, self.query, false) &&
            setTimeout(updater.bind(null, "?".concat((0, helper_1.qsstringify)(self.query))), 4);
    }
    var fetchInitData = (0, mobx_state_tree_1.flow)(function getInitData(api, data, options) {
        var items_1, dir, data_1, ctx, json, result, total, count, page, hasNext, oItems, oRows, columns, rest, items, _i, _a, key, rowsData, data_2, filteredItems_1, dir, e_1, env;
        var _b;
        var _c, _d, _e, _f, _g;
        if (options === void 0) { options = {}; }
        return (0, tslib_1.__generator)(this, function (_h) {
            switch (_h.label) {
                case 0:
                    _h.trys.push([0, 2, , 3]);
                    if (!options.forceReload && options.loadDataOnce && self.total) {
                        items_1 = options.source
                            ? (0, tpl_builtin_1.resolveVariableAndFilter)(options.source, (0, helper_1.createObject)(self.mergedData, {
                                items: self.data.itemsRaw,
                                rows: self.data.itemsRaw
                            }), '| raw')
                            : self.items.concat();
                        if (Array.isArray(options.columns)) {
                            options.columns.forEach(function (column) {
                                var value;
                                if (column.searchable &&
                                    column.name &&
                                    (value = (0, helper_1.getVariable)(self.query, column.name))) {
                                    items_1 = (0, match_sorter_1.matchSorter)(items_1, value, {
                                        keys: [column.name]
                                    });
                                }
                            });
                        }
                        if (self.query.orderBy) {
                            dir = /desc/i.test(self.query.orderDir) ? -1 : 1;
                            items_1 = (0, helper_1.sortArray)(items_1, self.query.orderBy, dir);
                        }
                        data_1 = (0, tslib_1.__assign)((0, tslib_1.__assign)({}, self.data), { total: items_1.length, items: items_1.slice((self.page - 1) * self.perPage, self.page * self.perPage) });
                        self.total = parseInt((_c = data_1.total) !== null && _c !== void 0 ? _c : data_1.count, 10) || 0;
                        self.reInitData(data_1);
                        return [2 /*return*/];
                    }
                    if (fetchCancel) {
                        fetchCancel();
                        fetchCancel = null;
                        self.fetching = false;
                    }
                    options.silent || self.markFetching(true);
                    ctx = (0, helper_1.createObject)(self.data, (0, tslib_1.__assign)((0, tslib_1.__assign)((0, tslib_1.__assign)({}, self.query), data), (_b = {}, _b[options.pageField || 'page'] = self.page, _b[options.perPageField || 'perPage'] = self.perPage, _b)));
                    // 一次性加载不要发送 perPage 属性
                    if (options.loadDataOnce) {
                        delete ctx[options.perPageField || 'perPage'];
                    }
                    return [4 /*yield*/, (0, mobx_state_tree_1.getEnv)(self).fetcher(api, ctx, (0, tslib_1.__assign)((0, tslib_1.__assign)({}, options), { cancelExecutor: function (executor) { return (fetchCancel = executor); } }))];
                case 1:
                    json = _h.sent();
                    fetchCancel = null;
                    if (!json.ok) {
                        self.updateMessage((_e = (_d = json.msg) !== null && _d !== void 0 ? _d : options.errorMessage) !== null && _e !== void 0 ? _e : self.__('CRUD.fetchFailed'), true);
                        (0, mobx_state_tree_1.getEnv)(self).notify('error', json.msg, json.msgTimeout !== undefined
                            ? {
                                closeButton: true,
                                timeout: json.msgTimeout
                            }
                            : undefined);
                    }
                    else {
                        if (!json.data) {
                            throw new Error(self.__('CRUD.invalidData'));
                        }
                        self.updatedAt = Date.now();
                        result = (0, api_1.normalizeApiResponseData)(json.data);
                        total = result.total, count = result.count, page = result.page, hasNext = result.hasNext, oItems = result.items, oRows = result.rows, columns = result.columns, rest = (0, tslib_1.__rest)(result, ["total", "count", "page", "hasNext", "items", "rows", "columns"]);
                        items = void 0;
                        if (options.source) {
                            items = (0, tpl_builtin_1.resolveVariableAndFilter)(options.source, (0, helper_1.createObject)(self.filterData, result), '| raw');
                        }
                        else {
                            items = result.items || result.rows;
                        }
                        // 如果不按照 items 格式返回，就拿第一个数组当成 items
                        if (!Array.isArray(items)) {
                            for (_i = 0, _a = Object.keys(result); _i < _a.length; _i++) {
                                key = _a[_i];
                                if (result.hasOwnProperty(key) && Array.isArray(result[key])) {
                                    items = result[key];
                                    break;
                                }
                            }
                        }
                        if (!Array.isArray(items)) {
                            throw new Error(self.__('CRUD.invalidArray'));
                        }
                        else {
                            // 确保成员是对象。
                            items.map(function (item) {
                                return typeof item === 'string' ? { text: item } : item;
                            });
                        }
                        rowsData = [];
                        if (options.loadDataMode && Array.isArray(self.data.items)) {
                            rowsData = self.data.items.concat(items);
                        }
                        else {
                            // 第一次的时候就是直接加载请求的数据
                            rowsData = items;
                        }
                        data_2 = (0, tslib_1.__assign)((0, tslib_1.__assign)((0, tslib_1.__assign)({}, (api.replaceData ? {} : self.pristine)), { items: rowsData, count: count, total: total }), rest);
                        if (options.loadDataOnce) {
                            // 记录原始集合，后续可能基于原始数据做排序查找。
                            data_2.itemsRaw = oItems || oRows;
                            filteredItems_1 = rowsData.concat();
                            if (Array.isArray(options.columns)) {
                                options.columns.forEach(function (column) {
                                    var value;
                                    if (column.searchable &&
                                        column.name &&
                                        (value = (0, helper_1.getVariable)(self.query, column.name))) {
                                        filteredItems_1 = (0, match_sorter_1.matchSorter)(filteredItems_1, value, {
                                            keys: [column.name]
                                        });
                                    }
                                });
                            }
                            if (self.query.orderBy) {
                                dir = /desc/i.test(self.query.orderDir) ? -1 : 1;
                                filteredItems_1 = (0, helper_1.sortArray)(filteredItems_1, self.query.orderBy, dir);
                            }
                            data_2.items = filteredItems_1.slice((self.page - 1) * self.perPage, self.page * self.perPage);
                            data_2.count = data_2.total = filteredItems_1.length;
                        }
                        if (Array.isArray(columns)) {
                            self.columns = columns.concat();
                        }
                        else {
                            self.columns = undefined;
                        }
                        self.items.replace(rowsData);
                        self.reInitData(data_2, !!api.replaceData);
                        options.syncResponse2Query !== false &&
                            updateQuery((0, pick_1.default)(rest, Object.keys(self.query)), undefined, options.pageField || 'page', options.perPageField || 'perPage');
                        self.total = parseInt((_f = data_2.total) !== null && _f !== void 0 ? _f : data_2.count, 10) || 0;
                        typeof page !== 'undefined' && (self.page = parseInt(page, 10));
                        // 分页情况不清楚，只能知道有没有下一页。
                        if (typeof hasNext !== 'undefined') {
                            self.mode = 'simple';
                            self.total = 0;
                            self.hasNext = !!hasNext;
                        }
                        self.updateMessage((_g = json.msg) !== null && _g !== void 0 ? _g : options.successMessage);
                        // 配置了获取成功提示后提示，默认是空不会提示。
                        options &&
                            options.successMessage &&
                            (0, mobx_state_tree_1.getEnv)(self).notify('success', self.msg);
                    }
                    self.markFetching(false);
                    return [2 /*return*/, json];
                case 2:
                    e_1 = _h.sent();
                    env = (0, mobx_state_tree_1.getEnv)(self);
                    if (!(0, mobx_state_tree_1.isAlive)(self) || self.disposed) {
                        return [2 /*return*/];
                    }
                    self.markFetching(false);
                    if (env.isCancel(e_1)) {
                        return [2 /*return*/];
                    }
                    console.error(e_1.stack);
                    env.notify('error', e_1.message);
                    return [2 /*return*/];
                case 3: return [2 /*return*/];
            }
        });
    });
    function changePage(page, perPage) {
        self.page = page;
        perPage && (self.perPage = parseInt(perPage, 10));
    }
    function selectAction(action) {
        self.selectedAction = action;
    }
    var saveRemote = (0, mobx_state_tree_1.flow)(function saveRemote(api, data, options) {
        var json, e_2;
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
                    e_2 = _d.sent();
                    self.markSaving(false);
                    if (!(0, mobx_state_tree_1.isAlive)(self) || self.disposed) {
                        return [2 /*return*/];
                    }
                    e_2.type !== 'ServerError' && (0, mobx_state_tree_1.getEnv)(self).notify('error', e_2.message);
                    throw e_2;
                case 3: return [2 /*return*/];
            }
        });
    });
    var setFilterTogglable = function (toggable, filterVisible) {
        self.filterTogggable = toggable;
        filterVisible !== void 0 && (self.filterVisible = filterVisible);
    };
    var setFilterVisible = function (visible) {
        self.filterVisible = visible;
    };
    var setSelectedItems = function (items) {
        self.selectedItems.replace(items);
    };
    var setUnSelectedItems = function (items) {
        self.unSelectedItems.replace(items);
    };
    var setInnerModalOpened = function (value) {
        self.hasInnerModalOpen = value;
    };
    var initFromScope = function (scope, source) {
        var rowsData = (0, tpl_builtin_1.resolveVariableAndFilter)(source, scope, '| raw');
        if (!Array.isArray(rowsData) && !self.items.length) {
            return;
        }
        rowsData = Array.isArray(rowsData) ? rowsData : [];
        var data = (0, tslib_1.__assign)((0, tslib_1.__assign)({}, self.pristine), { items: rowsData, count: 0, total: 0 });
        self.items.replace(rowsData);
        self.reInitData(data);
    };
    var exportAsCSV = function (options) {
        if (options === void 0) { options = {}; }
        return (0, tslib_1.__awaiter)(void 0, void 0, void 0, function () {
            var items, env, res;
            return (0, tslib_1.__generator)(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        items = options.loadDataOnce ? self.data.itemsRaw : self.data.items;
                        if (!options.api) return [3 /*break*/, 2];
                        env = (0, mobx_state_tree_1.getEnv)(self);
                        return [4 /*yield*/, env.fetcher(options.api, options.data)];
                    case 1:
                        res = _a.sent();
                        if (!res.data) {
                            return [2 /*return*/];
                        }
                        if (Array.isArray(res.data)) {
                            items = res.data;
                        }
                        else {
                            items = res.data.rows || res.data.items;
                        }
                        _a.label = 2;
                    case 2:
                        Promise.resolve().then(function () { return new Promise(function(resolve){require(['papaparse'], function(ret) {resolve(tslib_1.__importStar(ret));})}); }).then(function (papaparse) {
                            var csvText = papaparse.unparse(items);
                            if (csvText) {
                                var blob = new Blob(
                                // 加上 BOM 这样 Excel 打开的时候就不会乱码
                                [new Uint8Array([0xef, 0xbb, 0xbf]), csvText], {
                                    type: 'text/plain;charset=utf-8'
                                });
                                (0, file_saver_1.saveAs)(blob, 'data.csv');
                            }
                        });
                        return [2 /*return*/];
                }
            });
        });
    };
    return {
        setPristineQuery: setPristineQuery,
        updateQuery: updateQuery,
        fetchInitData: fetchInitData,
        changePage: changePage,
        selectAction: selectAction,
        saveRemote: saveRemote,
        setFilterTogglable: setFilterTogglable,
        setFilterVisible: setFilterVisible,
        setSelectedItems: setSelectedItems,
        setUnSelectedItems: setUnSelectedItems,
        setInnerModalOpened: setInnerModalOpened,
        initFromScope: initFromScope,
        exportAsCSV: exportAsCSV
    };
});
//# sourceMappingURL=./store/crud.js.map
