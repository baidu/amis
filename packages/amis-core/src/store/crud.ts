import {saveAs} from 'file-saver';
import {types, flow, getEnv, isAlive, Instance} from 'mobx-state-tree';
import {IRendererStore} from './index';
import {ServiceStore} from './service';
import {
  extendObject,
  createObject,
  isObjectShallowModified,
  sortArray,
  isEmpty,
  qsstringify,
  getVariable
} from '../utils/helper';
import {Api, Payload, fetchOptions, ActionObject, ApiObject} from '../types';
import pick from 'lodash/pick';
import {resolveVariableAndFilter} from '../utils/tpl-builtin';
import {normalizeApiResponseData} from '../utils/api';
import {matchSorter} from 'match-sorter';

class ServerError extends Error {
  type = 'ServerError';
}

export const CRUDStore = ServiceStore.named('CRUDStore')
  .props({
    pristineQuery: types.optional(types.frozen(), {}),
    query: types.optional(types.frozen(), {}),
    prevPage: 1,
    page: 1,
    perPage: 10,
    total: 0,
    mode: 'normal',
    hasNext: false,
    selectedAction: types.frozen(),
    columns: types.frozen(),
    items: types.optional(types.array(types.frozen()), []),
    selectedItems: types.optional(types.array(types.frozen()), []),
    unSelectedItems: types.optional(types.array(types.frozen()), []),
    filterTogggable: false,
    filterVisible: true,
    hasInnerModalOpen: false
  })
  .views(self => ({
    get lastPage() {
      return Math.max(
        Math.ceil(self.total / (self.perPage < 1 ? 10 : self.perPage)),
        1
      );
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
    },

    fetchCtxOf(
      data: any,
      options: {
        pageField?: string;
        perPageField?: string;
      }
    ) {
      return createObject(data, {
        ...self.query,
        [options.pageField || 'page']: self.page,
        [options.perPageField || 'perPage']: self.perPage,
        ...data
      });
    }
  }))
  .actions(self => {
    let fetchCancel: Function | null = null;

    function setPristineQuery() {
      self.pristineQuery = self.query;
    }

    function updateQuery(
      values: object,
      updater?: Function,
      pageField: string = 'page',
      perPageField: string = 'perPage',
      replace: boolean = false
    ) {
      const originQuery = self.query;
      self.query = replace
        ? {
            ...values
          }
        : {
            ...self.query,
            ...values
          };

      if (self.query[pageField || 'page']) {
        self.page = parseInt(self.query[pageField || 'page'], 10);
      }

      if (self.query[perPageField || 'perPage']) {
        self.perPage = parseInt(self.query[perPageField || 'perPage'], 10);
      }

      updater &&
        isObjectShallowModified(originQuery, self.query, false) &&
        setTimeout(updater.bind(null, `?${qsstringify(self.query)}`), 4);
    }

    const fetchInitData: (
      api: Api,
      data?: object,
      options?: fetchOptions & {
        forceReload?: boolean;
        loadDataOnce?: boolean; // 配置数据是否一次性加载，如果是这样，由前端来完成分页，排序等功能。
        loadDataOnceFetchOnFilter?: boolean; // 在开启loadDataOnce时，filter时是否去重新请求api
        source?: string; // 支持自定义属于映射，默认不配置，读取 rows 或者 items
        loadDataMode?: boolean;
        syncResponse2Query?: boolean;
        columns?: Array<any>;
        isTable2?: Boolean; // 是否是 CRUD2
      }
    ) => Promise<any> = flow(function* getInitData(
      api: Api,
      data: object,
      options: fetchOptions & {
        forceReload?: boolean;
        loadDataOnce?: boolean; // 配置数据是否一次性加载，如果是这样，由前端来完成分页，排序等功能。
        loadDataOnceFetchOnFilter?: boolean; // 在开启loadDataOnce时，filter时是否去重新请求api
        source?: string; // 支持自定义属于映射，默认不配置，读取 rows 或者 items
        loadDataMode?: boolean;
        syncResponse2Query?: boolean;
        columns?: Array<any>;
      } = {}
    ) {
      try {
        if (!options.forceReload && options.loadDataOnce && self.total) {
          let items = options.source
            ? resolveVariableAndFilter(
                options.source,
                createObject(self.mergedData, {
                  items: self.data.itemsRaw,
                  rows: self.data.itemsRaw
                }),
                '| raw'
              )
            : self.items.concat();

          if (Array.isArray(options.columns)) {
            options.columns.forEach((column: any) => {
              let value: any;
              const key = column.name;
              if (
                column.searchable &&
                key &&
                (value = getVariable(self.query, key))
              ) {
                items = matchSorter(items, value, {
                  keys: [key]
                });
              }
            });
          }

          if (self.query.orderBy) {
            const dir = /desc/i.test(self.query.orderDir) ? -1 : 1;
            items = sortArray(items, self.query.orderBy, dir);
          }

          const data = {
            ...self.data,
            total: items.length,
            items: items.slice(
              (self.page - 1) * self.perPage,
              self.page * self.perPage
            )
          };
          self.total = parseInt(data.total ?? data.count, 10) || 0;
          self.reInitData(data);
          return;
        }

        if (fetchCancel) {
          fetchCancel();
          fetchCancel = null;
          self.fetching = false;
        }

        options.silent || self.markFetching(true);
        const ctx: any = createObject(self.data, {
          ...self.query,
          ...data,
          [options.pageField || 'page']: self.page,
          [options.perPageField || 'perPage']: self.perPage
        });

        // 一次性加载不要发送 perPage 属性
        if (options.loadDataOnce) {
          delete ctx[options.perPageField || 'perPage'];
        }

        const json: Payload = yield getEnv(self).fetcher(api, ctx, {
          ...options,
          cancelExecutor: (executor: Function) => (fetchCancel = executor)
        });
        fetchCancel = null;

        if (!json.ok) {
          self.updateMessage(
            json.msg ?? options.errorMessage ?? self.__('CRUD.fetchFailed'),
            true
          );
          getEnv(self).notify(
            'error',
            json.msg,
            json.msgTimeout !== undefined
              ? {
                  closeButton: true,
                  timeout: json.msgTimeout
                }
              : undefined
          );
        } else {
          if (!json.data) {
            throw new Error(self.__('CRUD.invalidData'));
          }

          self.updatedAt = Date.now();
          let result = normalizeApiResponseData(json.data);

          const {
            total,
            count,
            page,
            hasNext,
            items: oItems,
            rows: oRows,
            columns,
            ...rest
          } = result;

          let items: Array<any>;
          if (options.source) {
            items = resolveVariableAndFilter(
              options.source,
              createObject(self.filterData, result),
              '| raw'
            );
          } else {
            items = result.items || result.rows;
          }

          // 如果不按照 items 格式返回，就拿第一个数组当成 items
          if (!Array.isArray(items)) {
            for (const key of Object.keys(result)) {
              if (result.hasOwnProperty(key) && Array.isArray(result[key])) {
                items = result[key];
                break;
              }
            }
          }

          if (!Array.isArray(items)) {
            throw new Error(self.__('CRUD.invalidArray'));
          } else {
            // 确保成员是对象。
            items.map((item: any) =>
              typeof item === 'string' ? {text: item} : item
            );
          }

          // 点击加载更多数据
          let rowsData: Array<any> = [];
          if (options.loadDataMode && Array.isArray(self.data.items)) {
            rowsData = self.data.items.concat(items);
          } else {
            // 第一次的时候就是直接加载请求的数据
            rowsData = items;
          }

          const data = {
            ...((api as ApiObject).replaceData ? {} : self.pristine),
            items: rowsData,
            count: count,
            total: total,
            ...rest
          };

          if (options.loadDataOnce) {
            // 记录原始集合，后续可能基于原始数据做排序查找。
            data.itemsRaw = oItems || oRows;
            let filteredItems = rowsData.concat();

            if (Array.isArray(options.columns)) {
              options.columns.forEach((column: any) => {
                let value: any;
                const key = column.name;
                if (
                  column.searchable &&
                  key &&
                  (value = getVariable(self.query, key))
                ) {
                  filteredItems = matchSorter(filteredItems, value, {
                    keys: [key]
                  });
                }
              });
            }

            if (self.query.orderBy) {
              const dir = /desc/i.test(self.query.orderDir) ? -1 : 1;
              filteredItems = sortArray(filteredItems, self.query.orderBy, dir);
            }
            data.items = filteredItems.slice(
              (self.page - 1) * self.perPage,
              self.page * self.perPage
            );
            data.count = data.total = filteredItems.length;
          }

          if (Array.isArray(columns)) {
            self.columns = columns.concat();
          } else if (rest.isTable2) {
            self.columns = options.columns;
          }

          self.items.replace(rowsData);
          self.reInitData(data, !!(api as ApiObject).replaceData);
          options.syncResponse2Query !== false &&
            updateQuery(
              pick(rest, Object.keys(self.query)),
              undefined,
              options.pageField || 'page',
              options.perPageField || 'perPage'
            );

          self.total = parseInt(data.total ?? data.count, 10) || 0;
          typeof page !== 'undefined' && (self.page = parseInt(page, 10));

          // 分页情况不清楚，只能知道有没有下一页。
          if (typeof hasNext !== 'undefined') {
            self.mode = 'simple';
            self.total = 0;
            self.hasNext = !!hasNext;
          }

          self.updateMessage(
            json.msg ?? options.successMessage ?? json.defaultMsg
          );

          // 配置了获取成功提示后提示，默认是空不会提示。
          options &&
            options.successMessage &&
            getEnv(self).notify('success', self.msg);
        }

        self.markFetching(false);
        return json;
      } catch (e) {
        const env = getEnv(self) as IRendererStore;

        if (!isAlive(self) || self.disposed) {
          return;
        }

        self.markFetching(false);

        if (env.isCancel(e)) {
          return;
        }

        console.error(e);
        env.notify('error', e.message);
        return;
      }
    });

    function changePage(page: number, perPage?: number | string) {
      self.page = page;
      perPage && (self.perPage = parseInt(perPage as string, 10));
    }

    function selectAction(action: ActionObject) {
      self.selectedAction = action;
    }

    const saveRemote: (
      api: Api,
      data?: object,
      options?: fetchOptions
    ) => Promise<any> = flow(function* saveRemote(
      api: Api,
      data: object,
      options: fetchOptions = {}
    ) {
      try {
        options = {
          method: 'post', // 默认走 post
          ...options
        };

        self.markSaving(true);
        const json: Payload = yield getEnv(self).fetcher(api, data, options);
        self.markSaving(false);

        if (!isEmpty(json.data) || json.ok) {
          self.updateData(
            normalizeApiResponseData(json.data),
            {
              __saved: Date.now()
            },
            !!api && (api as ApiObject).replaceData
          );
          self.updatedAt = Date.now();
        }

        if (!json.ok) {
          self.updateMessage(
            json.msg ?? options.errorMessage ?? self.__('saveFailed'),
            true
          );
          getEnv(self).notify(
            'error',
            self.msg,
            json.msgTimeout !== undefined
              ? {
                  closeButton: true,
                  timeout: json.msgTimeout
                }
              : undefined
          );
          throw new ServerError(self.msg);
        } else {
          self.updateMessage(
            json.msg ?? options.successMessage ?? json.defaultMsg
          );
          self.msg &&
            getEnv(self).notify(
              'success',
              self.msg,
              json.msgTimeout !== undefined
                ? {
                    closeButton: true,
                    timeout: json.msgTimeout
                  }
                : undefined
            );
        }
        return json.data;
      } catch (e) {
        self.markSaving(false);

        if (!isAlive(self) || self.disposed) {
          return;
        }

        e.type !== 'ServerError' && getEnv(self).notify('error', e.message);
        throw e;
      }
    });

    const setFilterTogglable = (toggable: boolean, filterVisible?: boolean) => {
      self.filterTogggable = toggable;

      filterVisible !== void 0 && (self.filterVisible = filterVisible);
    };

    const setFilterVisible = (visible: boolean) => {
      self.filterVisible = visible;
    };

    const setSelectedItems = (items: Array<any>) => {
      self.selectedItems.replace(items);
    };

    const setUnSelectedItems = (items: Array<any>) => {
      self.unSelectedItems.replace(items);
    };

    const updateSelectData = (selected: Array<any>, unSelected: Array<any>) => {
      self.selectedItems.replace(selected);
      self.unSelectedItems.replace(unSelected);
      // 同步到data中，使filter等部分也能拿到
      self.reInitData({
        selectedItems: selected,
        unSelectedItems: unSelected
      });
    };

    const setInnerModalOpened = (value: boolean) => {
      self.hasInnerModalOpen = value;
    };

    const initFromScope = function (scope: any, source: string) {
      let rowsData: Array<any> = resolveVariableAndFilter(
        source,
        scope,
        '| raw'
      );

      if (!Array.isArray(rowsData) && !self.items.length) {
        return;
      }

      rowsData = Array.isArray(rowsData) ? rowsData : [];

      const data = {
        ...self.pristine,
        items: rowsData,
        count: 0,
        total: rowsData.length
      };

      self.items.replace(rowsData);
      self.reInitData(data);
    };

    const exportAsCSV = async (
      options: {loadDataOnce?: boolean; api?: Api; data?: any} = {}
    ) => {
      let items = options.loadDataOnce ? self.data.itemsRaw : self.data.items;

      if (options.api) {
        const env = getEnv(self);
        const res = await env.fetcher(options.api, options.data);
        if (!res.data) {
          return;
        }
        if (Array.isArray(res.data)) {
          items = res.data;
        } else {
          items = res.data.rows || res.data.items;
        }
      }

      import('papaparse').then((papaparse: any) => {
        // 将数据里的对象转成 json 字符串，不然输出的 csv 没法显示
        const csvData = [];
        for (const row of items) {
          const rowData = {} as {[key: string]: any};
          for (const key in row) {
            const value = row[key];
            if (typeof value === 'object') {
              rowData[key] = JSON.stringify(value);
            } else {
              rowData[key] = value;
            }
          }
          csvData.push(rowData);
        }
        const csvText = papaparse.unparse(csvData);
        if (csvText) {
          const blob = new Blob(
            // 加上 BOM 这样 Excel 打开的时候就不会乱码
            [new Uint8Array([0xef, 0xbb, 0xbf]), csvText],
            {
              type: 'text/plain;charset=utf-8'
            }
          );
          saveAs(blob, 'data.csv');
        }
      });
    };

    const getData = (superData: any): any => {
      return createObject(superData, {
        total: self.total,
        page: self.page,
        items: self.items.concat(),
        selectedItems: self.selectedItems.concat(),
        unSelectedItems: self.unSelectedItems.concat()
      });
    };

    const updateColumns = (columns: Array<any>) => {
      self.columns = columns;
    };

    return {
      getData,
      updateSelectData,
      setPristineQuery,
      updateQuery,
      fetchInitData,
      changePage,
      selectAction,
      saveRemote,
      setFilterTogglable,
      setFilterVisible,
      setSelectedItems,
      setUnSelectedItems,
      setInnerModalOpened,
      initFromScope,
      exportAsCSV,
      updateColumns
    };
  });

export type ICRUDStore = Instance<typeof CRUDStore>;
