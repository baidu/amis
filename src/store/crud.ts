import {
    types,
    getParent,
    flow,
    getEnv,
    getRoot
} from "mobx-state-tree";
import {
    IRendererStore
} from './index';
import { ServiceStore } from './service';
import { extendObject, createObject, isObjectShallowModified } from '../utils/helper';
import {
    Api,
    Payload,
    fetchOptions,
    Action
} from '../types';
import * as qs from 'qs';
import pick = require("lodash/pick");


class ServerError extends Error {
    type = 'ServerError';
}

export const CRUDStore = ServiceStore
    .named('CRUDStore')
    .props({
        pristineQuery: types.optional(types.frozen(), {}),
        query: types.optional(types.frozen(), {}),
        prevPage: 1,
        page: 1,
        pageNum: types.optional(types.union(types.number, types.literal('')), 1),
        perPage: 10,
        total: 1,
        mode: 'normal',
        hasNext: false,
        selectedAction: types.frozen(),
        items: types.optional(types.array(types.frozen()), []),
        selectedItems: types.optional(types.array(types.frozen()), []),
        unSelectedItems: types.optional(types.array(types.frozen()), []),
        filterTogggable: false,
        filterVisible: true,
        hasInnerModalOpen: false,
    })
    .views(self => ({
        get lastPage() {
            return Math.ceil(self.total / (self.perPage < 1 ? 10 : self.perPage));
        },

        get filterData() {
            return createObject(self.data, {
                ...self.query
            });
        },

        get mergedData() {
            return extendObject(self.data, {
                ...self.query,
                ...self.data,
                selectedItems: self.selectedItems,
                unSelectedItems: self.unSelectedItems
            });
        },

        get hasModalOpened() {
            return self.dialogOpen || self.drawerOpen || self.hasInnerModalOpen;
        },

        get selectedItemsAsArray() {
            return self.selectedItems.concat();
        }
    }))
    .actions(self => {
        let fetchCancel:Function | null = null;

        function setPristineQuery() {
            self.pristineQuery = self.query;
        }

        function updateQuery (values:object, updater?: Function, pageField:string = 'page', perPageField: string = 'perPage', replace:boolean = false) {
            const originQuery = self.query;
            self.query = replace ? {
                ...values
            } : {
                ...self.query,
                ...values
            };

            if (self.query[pageField || 'page']) {
                self.page = self.pageNum = parseInt(self.query[pageField || 'page'], 10);
            }

            if (self.query[perPageField || 'perPage']) {
                self.perPage = parseInt(self.query[perPageField || 'perPage'], 10);
            }

            updater && isObjectShallowModified(originQuery, self.query, false) && setTimeout(() => updater(`?${qs.stringify(self.query)}`), 4);
        }

        
        const fetchInitData:(api:Api, data?:object, options?:fetchOptions & {
            loadDataMode?: boolean;
            syncResponse2Query?: boolean;
        }) => Promise<any> = flow(function *getInitData(api:string, data:object, options?:fetchOptions) {
            try {
                if (fetchCancel) {
                    fetchCancel();
                    fetchCancel = null;
                    self.fetching = false;
                }

                options && options.silent || self.markFetching(true);
                const json:Payload = yield (getRoot(self) as IRendererStore).fetcher(api, createObject(self.data, {
                    ...self.query,
                    [options && options.pageField || 'page']: self.page,
                    [options && options.perPageField || 'perPage']: self.perPage,
                    ...data
                }), {
                    ...options,
                    cancelExecutor: (executor:Function) => fetchCancel = executor
                });
                fetchCancel = null;

                if (!json.ok) {
                    self.updateMessage(json.msg || options && options.errorMessage || '获取失败', true);
                    (getRoot(self) as IRendererStore).notify('error', json.msg);
                } else {
                    if (!json.data) {
                        throw new Error('返回数据格式不正确，payload.data 没有数据');
                    }

                    self.updatedAt = Date.now();
                    if (Array.isArray(json.data)) {
                        self.reInitData({
                            ...self.pristine,
                            items: json.data
                        });
                    } else {
                        const {
                            items,
                            rows,
                            total,
                            count,
                            page,
                            hasNext,
                            ...rest
                        } = json.data as any;

                        if (!Array.isArray(items) && !Array.isArray(rows)) {
                            throw new Error('返回数据格式不正确，payload.data.items 必须是数组');
                        }

                        // 点击加载更多数据
                        let rowsData = []
                        if (options && options.loadDataMode && Array.isArray(self.data.items)) {
                            rowsData = self.data.items;
                            rowsData.push(...(items || rows));
                        } else { // 第一次的时候就是直接加载请求的数据
                            rowsData = items || rows;
                        }

                        const data = {
                            ...self.pristine,
                            items: rowsData,
                            count: count,
                            total: total,
                            ...rest
                        };

                        if (Array.isArray(data.items)) {
                            data.items = data.items.map((item:any) => typeof item === 'string' ? {text: item} : item)
                        }

                        self.items.replace(data.items);
                        self.reInitData(data);
                        options && options.syncResponse2Query !== false && updateQuery(pick(rest, Object.keys(self.query)), undefined, options && options.pageField || 'page', options && options.perPageField || 'perPage');

                        self.total = parseInt(total || count, 10) || 0;
                        typeof page !== 'undefined' && (self.page = self.pageNum = parseInt(page, 10));

                        // 分页情况不清楚，只能知道有没有下一页。
                        if (typeof hasNext !== 'undefined') {
                            self.mode = 'simple';
                            self.total = 0;
                            self.hasNext = !!hasNext;
                        }
                    }

                    self.updateMessage(json.msg || options && options.successMessage);

                    // 配置了获取成功提示后提示，默认是空不会提示。
                    if (options && options.successMessage) {
                        (getRoot(self) as IRendererStore).notify('success', self.msg);
                    }
                }

                self.markFetching(false);
                return json;
            } catch(e) {
                const root = getRoot(self) as IRendererStore;

                if (root.storeType !== 'RendererStore') {
                    // 已经销毁了，不管这些数据了。
                    return;
                }

                self.markFetching(false);

                if (root.isCancel(e)) {
                    return;
                }

                console.error(e.stack);
                root.notify('error', e.message);
            }
        });

        function changePage(page:number, perPage?: number) {
            self.page = self.pageNum = page;
            perPage && (self.perPage = perPage);
        }

        function changePageNum(value: number | '') {
            self.pageNum = value;
        }

        function selectAction(action:Action) {
            self.selectedAction = action;
        }

        const saveRemote:(api:Api, data?:object, options?:fetchOptions) => Promise<any> = flow(function *saveRemote(api:string, data:object, options:fetchOptions = {}) {
            try {
                options = {
                    method: 'post', // 默认走 post
                    ...options
                };

                self.markSaving(true);
                const json:Payload = yield (getRoot(self) as IRendererStore).fetcher(api, data, options);
                self.markSaving(false);

                if (!json.ok) {
                    self.updateMessage(json.msg || options && options.errorMessage || '保存失败', true);
                    (getRoot(self) as IRendererStore).notify('error', self.msg);
                    throw new ServerError(self.msg);
                } else {
                    self.updateData(json.data, {
                        __saved: Date.now()
                    });
                    self.updatedAt = Date.now();
                    self.updateMessage(json.msg || options && options.successMessage || '保存成功');
                    (getRoot(self) as IRendererStore).notify('success', self.msg);
                }
                return json.data;
            } catch(e) {
                self.markSaving(false);
                e.type !== 'ServerError' && (getRoot(self) as IRendererStore) && (getRoot(self) as IRendererStore).notify('error', e.message);
                throw e;
            }
        });

        const setFilterTogglable = (toggable:boolean, filterVisible?: boolean) => {
            self.filterTogggable = toggable;

            filterVisible !== void 0 && (self.filterVisible = filterVisible);
        };

        const setFilterVisible = (visible:boolean) => {
            self.filterVisible = visible;
        };

        const setSelectedItems = (items:Array<any>) => {
            self.selectedItems.replace(items);
        }

        const setUnSelectedItems = (items:Array<any>) => {
            self.unSelectedItems.replace(items);
        }

        const setInnerModalOpened = (value:boolean) => {
            self.hasInnerModalOpen = value;
        }

        return {
            setPristineQuery,
            updateQuery,
            fetchInitData,
            changePage,
            changePageNum,
            selectAction,
            saveRemote,
            setFilterTogglable,
            setFilterVisible,
            setSelectedItems,
            setUnSelectedItems,
            setInnerModalOpened
        };
    });

export type ICRUDStore = typeof CRUDStore.Type;
