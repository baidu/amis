import * as React from 'react';
import * as PropTypes from 'prop-types';
import {Renderer, RendererProps} from '../factory';
import {SchemaNode, Schema, Action, Api, ApiObject} from '../types';
import {CRUDStore, ICRUDStore} from '../store/crud';
import {
    createObject,
    extendObject,
    anyChanged,
    isObjectShallowModified,
    noop,
    isVisible,
    getVariable,
} from '../utils/helper';
import {observer} from 'mobx-react';
import partition = require('lodash/partition');
import Scoped, {ScopedContext, IScopedContext} from '../Scoped';
import Button from '../components/Button';
import Select from '../components/Select';
import getExprProperties from '../utils/filter-schema';
import pick = require('lodash/pick');
import * as qs from 'qs';
import {findDOMNode} from 'react-dom';
import {evalExpression, filter} from '../utils/tpl';
import {isValidApi, buildApi} from '../utils/api';
import omit = require('lodash/omit');
import find = require('lodash/find');

interface CRUDProps extends RendererProps {
    api?: Api;
    filter?: Schema;
    store: ICRUDStore;
    defaultParams: object;
    syncLocation?: boolean;
    primaryField?: string;
    mode?: 'table' | 'grid' | 'cards' /* grid 的别名*/ | 'list';
    toolbarInline?: boolean;
    toolbar?: SchemaNode; // 不推荐，但是还是要兼容老用法。
    headerToolbar?: SchemaNode;
    footerToolbar?: SchemaNode;
    bulkActions?: Array<Action>;
    itemActions?: Array<Action>;
    orderField?: string;
    saveOrderApi?: Api;
    quickSaveApi?: Api;
    quickSaveItemApi?: Api;
    initFetch?: boolean;
    perPageAvailable?: Array<number | string>;
    messages: {
        fetchFailed?: string;
        fetchSuccess?: string;
        saveFailed?: string;
        saveSuccess?: string;
    };
    pickerMode?: boolean; // 选择模式，用做表单中的选择操作
    pageField?: string;
    perPageField?: string;
    hideQuickSaveBtn?: boolean;
    autoJumpToTopOnPagerChange?: boolean; // 是否自动跳顶部，当切分页的时候。
    interval?: number;
    silentPolling?: boolean;
    stopAutoRefreshWhen?: string;
    stopAutoRefreshWhenModalIsOpen?: boolean;
    filterTogglable?: boolean;
    filterDefaultVisible?: boolean;
    syncResponse2Query?: boolean;
    keepItemSelectionOnPageChange?: boolean;
    loadDataOnce?: boolean;
    source?: string;
}

export default class CRUD extends React.Component<CRUDProps, any> {
    static propsList: Array<string> = [
        'bulkActions',
        'itemActions',
        'mode',
        'orderField',
        'syncLocation',
        'toolbar',
        'toolbarInline',
        'messages',
        'value',
        'options',
        'multiple',
        'valueField',
        'defaultParams',
        'bodyClassName',
        'perPageAvailable',
        'pageField',
        'perPageField',
        'hideQuickSaveBtn',
        'autoJumpToTopOnPagerChange',
        'interval',
        'silentPolling',
        'stopAutoRefreshWhen',
        'stopAutoRefreshWhenModalIsOpen',
        'api',
        'affixHeader',
        'columnsTogglable',
        'placeholder',
        'tableClassName',
        'headerClassName',
        'footerClassName',
        'toolbarClassName',
        'headerToolbar',
        'footerToolbar',
        'filterTogglable',
        'filterDefaultVisible',
        'syncResponse2Query',
        'keepItemSelectionOnPageChange',
        'labelTpl',
        'labelField',
        'loadDataOnce',
        'source'
    ];
    static defaultProps: Partial<CRUDProps> = {
        toolbarInline: true,
        headerToolbar: ['bulkActions', 'pagination'],
        footerToolbar: ['statistics', 'pagination'],
        primaryField: 'id',
        syncLocation: true,
        pageField: 'page',
        perPageField: 'perPage',
        hideQuickSaveBtn: false,
        autoJumpToTopOnPagerChange: true,
        silentPolling: false,
        filterTogglable: false,
        filterDefaultVisible: true,
        loadDataOnce: false,
    };

    control: any;
    lastQuery: any;
    dataInvalid: boolean = false;
    timer: number;
    mounted: boolean;
    constructor(props: CRUDProps) {
        super(props);

        this.controlRef = this.controlRef.bind(this);
        this.handleFilterReset = this.handleFilterReset.bind(this);
        this.handleFilterSubmit = this.handleFilterSubmit.bind(this);
        this.handleFilterInit = this.handleFilterInit.bind(this);
        this.handleAction = this.handleAction.bind(this);
        this.handleBulkAction = this.handleBulkAction.bind(this);
        this.handleChangePage = this.handleChangePage.bind(this);
        this.handleBulkGo = this.handleBulkGo.bind(this);
        this.handleDialogConfirm = this.handleDialogConfirm.bind(this);
        this.handleDialogClose = this.handleDialogClose.bind(this);
        this.handleSave = this.handleSave.bind(this);
        this.handleSaveOrder = this.handleSaveOrder.bind(this);
        this.handleSelect = this.handleSelect.bind(this);
        this.handleChildPopOverOpen = this.handleChildPopOverOpen.bind(this);
        this.handleChildPopOverClose = this.handleChildPopOverClose.bind(this);
        this.search = this.search.bind(this);
        this.silentSearch = this.silentSearch.bind(this);
        this.handlQuery = this.handlQuery.bind(this);
        this.renderHeaderToolbar = this.renderHeaderToolbar.bind(this);
        this.renderFooterToolbar = this.renderFooterToolbar.bind(this);
        this.clearSelection = this.clearSelection.bind(this);
    }

    componentWillMount() {
        const {location, store, pageField, perPageField, syncLocation, loadDataOnce} = this.props;

        this.mounted = true;

        if (syncLocation && location && (location.query || location.search)) {
            store.updateQuery(
                location.query || qs.parse(location.search.substring(1)),
                undefined,
                pageField,
                perPageField
            );
        } else if (syncLocation && !location && window.location.search) {
            store.updateQuery(
                qs.parse(window.location.search.substring(1)) as object,
                undefined,
                pageField,
                perPageField
            );
        }

        this.props.store.setFilterTogglable(!!this.props.filterTogglable, this.props.filterDefaultVisible);
    }

    componentDidMount() {
        const store = this.props.store;

        if (!this.props.filter || (store.filterTogggable && !store.filterVisible)) {
            this.handleFilterInit({});
        }

        if (this.props.pickerMode && this.props.value) {
            store.setSelectedItems(this.props.value);
        }
    }

    componentWillReceiveProps(nextProps: CRUDProps) {
        const props = this.props;
        const store = props.store;

        if (anyChanged(['toolbar', 'headerToolbar', 'footerToolbar', 'bulkActions'], props, nextProps)) {
            // 来点参数变化。
            this.renderHeaderToolbar = this.renderHeaderToolbar.bind(this);
            this.renderFooterToolbar = this.renderFooterToolbar.bind(this);
        }

        if (this.props.filterTogglable !== nextProps.filterTogglable) {
            store.setFilterTogglable(!!nextProps.filterTogglable, nextProps.filterDefaultVisible);
        }

        if (props.syncLocation && props.location && props.location.search !== nextProps.location.search) {
            // 同步地址栏，那么直接检测 query 是否变了，变了就重新拉数据
            store.updateQuery(
                nextProps.location.query || qs.parse(nextProps.location.search.substring(1)),
                undefined,
                nextProps.pageField,
                nextProps.perPageField
            );
            this.dataInvalid = isObjectShallowModified(store.query, this.lastQuery, false);
        } else if (!props.syncLocation && props.api && nextProps.api) {
            // 如果不同步地址栏，则直接看api上是否绑定参数，结果变了就重新刷新。
            let prevApi = buildApi(props.api, props.data as object, {ignoreData: true});
            let nextApi = buildApi(nextProps.api, nextProps.data as object, {ignoreData: true});

            if (
                prevApi.url !== nextApi.url &&
                isValidApi(nextApi.url) &&
                (!nextApi.sendOn || evalExpression(nextApi.sendOn, nextProps.data))
            ) {
                this.dataInvalid = true;
            }
        }
    }

    componentDidUpdate() {
        if (this.dataInvalid) {
            this.dataInvalid = false;
            this.search();
        }
    }

    componentWillUnmount() {
        this.mounted = false;
        clearTimeout(this.timer);
    }

    controlRef(control: any) {
        // 因为 control 有可能被 n 层 hoc 包裹。
        while (control && control.getWrappedInstance) {
            control = control.getWrappedInstance();
        }

        this.control = control;
    }

    handleAction(e: React.UIEvent<any> | undefined, action: Action, ctx: object, delegate?: boolean): any {
        const {onAction, store, messages, pickerMode, env, pageField, stopAutoRefreshWhenModalIsOpen} = this.props;

        delegate || store.setCurrentAction(action);

        if (action.actionType === 'dialog') {
            const idx: number = (ctx as any).index;
            const length = store.data.items.length;
            stopAutoRefreshWhenModalIsOpen && clearTimeout(this.timer);
            store.openDialog(ctx, {
                hasNext: idx < length - 1,
                nextIndex: idx + 1,
                hasPrev: idx > 0,
                prevIndex: idx - 1,
                index: idx,
            });
        } else if (action.actionType === 'ajax') {
            const data = ctx;

            // 由于 ajax 一段时间后再弹出，肯定被浏览器给阻止掉的，所以提前弹。
            action.redirect && action.blank && env.jumpTo(filter(action.redirect, data), action);

            return store
                .saveRemote(action.api as string, data, {
                    successMessage: (action.messages && action.messages.success) || (messages && messages.saveSuccess),
                    errorMessage: (action.messages && action.messages.failed) || (messages && messages.saveFailed),
                })
                .then(async (payload: object) => {
                    const data = createObject(ctx, payload);

                    if (action.feedback && isVisible(action.feedback, data)) {
                        await this.openFeedback(action.feedback, data);
                        stopAutoRefreshWhenModalIsOpen && clearTimeout(this.timer);
                    }

                    action.redirect && !action.blank && env.jumpTo(filter(action.redirect, data), action);
                    action.reload ? this.reloadTarget(action.reload, data) : this.search(undefined, undefined, true);
                })
                .catch(() => {});
        } else if (pickerMode && (action.actionType === 'confirm' || action.actionType === 'submit')) {
            return Promise.resolve({
                items: store.selectedItems.concat(),
            });
        } else {
            onAction(e, action, ctx);
        }
    }

    handleBulkAction(selectedItems: Array<any>, unSelectedItems: Array<any>, e: React.UIEvent<any>, action: Action) {
        const {store, primaryField, onAction, messages, pageField, stopAutoRefreshWhenModalIsOpen} = this.props;

        if (!selectedItems.length) {
            return;
        }

        let ids = selectedItems
            .map(item => (item.hasOwnProperty(primaryField) ? item[primaryField as string] : null))
            .filter(item => item)
            .join(',');

        const ctx = createObject(store.mergedData, {
            ...selectedItems[0],
            rows: selectedItems,
            items: selectedItems,
            unSelectedItems: unSelectedItems,
            ids,
        });

        if (action.actionType === 'dialog') {
            return this.handleAction(
                e,
                {
                    ...action,
                    __from: 'bulkAction',
                },
                ctx
            );
        } else if (action.actionType === 'ajax') {
            store
                .saveRemote(action.api as string, ctx, {
                    successMessage: (action.messages && action.messages.success) || (messages && messages.saveSuccess),
                    errorMessage: (action.messages && action.messages.failed) || (messages && messages.saveFailed),
                })
                .then(async () => {
                    if (action.feedback && isVisible(action.feedback, store.data)) {
                        await this.openFeedback(action.feedback, store.data);
                        stopAutoRefreshWhenModalIsOpen && clearTimeout(this.timer);
                    }

                    action.reload
                        ? this.reloadTarget(action.reload, store.data)
                        : this.search({[pageField || 'page']: 1}, undefined, true);
                })
                .catch(() => null);
        } else if (onAction) {
            onAction(e, action, ctx);
        }
    }

    handleItemAction(action: Action, ctx: any) {
        this.doAction(action, ctx);
    }

    handleFilterInit(values: object) {
        const {defaultParams, data, store} = this.props;

        this.handleFilterSubmit(
            {
                ...defaultParams,
                ...values,
                ...store.query,
            },
            false,
            true,
            this.props.initFetch !== false
        );

        store.setPristineQuery();

        const {pickerMode, options} = this.props;

        pickerMode &&
            store.updateData({
                items: options || [],
            });

        // 只执行一次。
        this.handleFilterInit = noop;
    }

    handleFilterReset(values: object) {
        const {store, syncLocation, env, pageField, perPageField} = this.props;

        store.updateQuery(
            store.pristineQuery,
            syncLocation && env && env.updateLocation ? (location: any) => env.updateLocation(location) : undefined,
            pageField,
            perPageField,
            true
        );
        this.lastQuery = store.query;
        this.search();
    }

    handleFilterSubmit(
        values: object,
        jumpToFirstPage: boolean = true,
        replaceLocation: boolean = false,
        search: boolean = true
    ) {
        const {store, syncLocation, env, pageField, perPageField} = this.props;

        store.updateQuery(
            {
                ...values,
                [pageField || 'page']: jumpToFirstPage ? 1 : store.page,
            },
            syncLocation && env && env.updateLocation
                ? (location: any) => env.updateLocation(location, replaceLocation)
                : undefined,
            pageField,
            perPageField
        );
        this.lastQuery = store.query;
        search && this.search();
    }

    handleBulkGo(selectedItems: Array<any>, unSelectedItems: Array<any>, e: React.MouseEvent<any>) {
        const action = this.props.store.selectedAction;
        const env = this.props.env;

        if (action.confirmText) {
            return env
                .confirm(action.confirmText)
                .then(
                    (confirmed: boolean) =>
                        confirmed && this.handleBulkAction(selectedItems, unSelectedItems, e as any, action)
                );
        }

        return this.handleBulkAction(selectedItems, unSelectedItems, e as any, action);
    }

    handleDialogConfirm(values: object[], action: Action, ctx: any, components: Array<any>) {
        const {store, pageField, stopAutoRefreshWhenModalIsOpen, interval, silentPolling} = this.props;

        store.closeDialog();
        const dialogAction = store.action as Action;

        if (stopAutoRefreshWhenModalIsOpen && interval) {
            this.timer = setTimeout(silentPolling ? this.silentSearch : this.search, Math.max(interval, 3000));
        }

        if (action.actionType === 'next' && typeof ctx.nextIndex === 'number' && store.data.items[ctx.nextIndex]) {
            return this.handleAction(
                undefined,
                {
                    ...dialogAction,
                },
                createObject(store.data.items[ctx.nextIndex], {
                    index: ctx.nextIndex,
                })
            );
        } else if (
            action.actionType === 'prev' &&
            typeof ctx.prevIndex === 'number' &&
            store.data.items[ctx.prevIndex]
        ) {
            return this.handleAction(
                undefined,
                {
                    ...dialogAction,
                },
                createObject(store.data.items[ctx.prevIndex], {
                    index: ctx.prevIndex,
                })
            );
        } else if (values.length) {
            const value = values[0];
            const component = components[0];

            // 提交来自 form
            if (component && component.props.type === 'form') {
                // 数据保存了，说明列表数据已经无效了，重新刷新。
                if (value && (value as any).__saved) {
                    this.search(dialogAction.__from ? {[pageField || 'page']: 1} : undefined, undefined, true);
                } else if (
                    value &&
                    ((value.hasOwnProperty('items') && (value as any).items) || value.hasOwnProperty('ids')) &&
                    this.control.bulkUpdate
                ) {
                    this.control.bulkUpdate(value, (value as any).items);
                }
            }
        }

        if (dialogAction.reload) {
            this.reloadTarget(dialogAction.reload, store.data);
        }
    }

    handleDialogClose() {
        const {store, stopAutoRefreshWhenModalIsOpen, silentPolling, interval} = this.props;
        store.closeDialog();

        if (stopAutoRefreshWhenModalIsOpen && interval) {
            this.timer = setTimeout(silentPolling ? this.silentSearch : this.search, Math.max(interval, 3000));
        }
    }

    openFeedback(dialog: any, ctx: any) {
        return new Promise(resolve => {
            const {store} = this.props;
            store.setCurrentAction({
                type: 'button',
                actionType: 'dialog',
                dialog: dialog,
            });
            store.openDialog(ctx, undefined, confirmed => {
                resolve(confirmed);
            });
        });
    }

    search(values?: any, silent?: boolean, clearSelection?: boolean, forceReload = true) {
        const {
            store,
            api,
            messages,
            pageField,
            perPageField,
            interval,
            stopAutoRefreshWhen,
            stopAutoRefreshWhenModalIsOpen,
            silentPolling,
            syncLocation,
            syncResponse2Query,
            keepItemSelectionOnPageChange,
            pickerMode,
            env,
            loadDataOnce,
            source
        } = this.props;

        // reload 需要清空用户选择。
        if (keepItemSelectionOnPageChange && clearSelection && !pickerMode) {
            store.setSelectedItems([]);
            store.setUnSelectedItems([]);
        }

        let loadDataMode = '';
        if (values && typeof values.loadDataMode === 'string') {
            loadDataMode = 'load-more';
            delete values.loadDataMode;
        }

        clearTimeout(this.timer);
        values &&
            store.updateQuery(
                values,
                !loadDataMode && syncLocation && env && env.updateLocation ? env.updateLocation : undefined,
                pageField,
                perPageField
            );
        this.lastQuery = store.query;
        const data = createObject(store.data, store.query);
        api &&
            (!(api as ApiObject).sendOn || evalExpression((api as ApiObject).sendOn as string, data)) &&
            store
                .fetchInitData(api, data, {
                    successMessage: messages && messages.fetchSuccess,
                    errorMessage: messages && messages.fetchFailed,
                    autoAppend: true,
                    forceReload,
                    loadDataOnce,
                    source,
                    silent,
                    pageField,
                    perPageField,
                    loadDataMode,
                    syncResponse2Query,
                })
                .then(value => {
                    interval &&
                        this.mounted &&
                        (!stopAutoRefreshWhen ||
                            !(
                                (stopAutoRefreshWhenModalIsOpen && store.hasModalOpened) ||
                                evalExpression(stopAutoRefreshWhen, data)
                            )) &&
                        (this.timer = setTimeout(
                            silentPolling ? this.silentSearch : this.search,
                            Math.max(interval, 3000)
                        ));
                    return value;
                });
    }

    silentSearch(values?: object) {
        return this.search(values, true);
    }

    handleChangePage(page: number, perPage?: number) {
        const {store, syncLocation, env, pageField, perPageField, autoJumpToTopOnPagerChange} = this.props;

        let query: any = {
            [pageField || 'page']: page,
        };

        if (perPage) {
            query[perPageField || 'perPage'] = perPage;
        }

        store.updateQuery(
            query,
            syncLocation && env && env.updateLocation ? env.updateLocation : undefined,
            pageField,
            perPageField
        );
        this.search(undefined, undefined, undefined, false);

        if (autoJumpToTopOnPagerChange && this.control) {
            (findDOMNode(this.control) as HTMLElement).scrollIntoView();
            const scrolledY = window.scrollY;
            scrolledY && window.scroll(0, scrolledY - 50);
        }
    }

    handleSave(
        rows: Array<object> | object,
        diff: Array<object> | object,
        indexes: Array<number>,
        unModifiedItems?: Array<any>
    ) {
        const {store, quickSaveApi, quickSaveItemApi, primaryField, env, messages} = this.props;

        if (Array.isArray(rows)) {
            if (!quickSaveApi) {
                env && env.alert('CRUD quickSaveApi is required!');
                return;
            }

            const data: any = createObject(store.data, {
                rows,
                rowsDiff: diff,
                indexes: indexes,
            });

            if (rows.length && rows[0].hasOwnProperty(primaryField || 'id')) {
                data.ids = rows.map(item => (item as any)[primaryField || 'id']).join(',');
            }

            if (unModifiedItems) {
                data.unModifiedItems = unModifiedItems;
            }

            store
                .saveRemote(quickSaveApi, data, {
                    successMessage: messages && messages.saveFailed,
                    errorMessage: messages && messages.saveSuccess,
                })
                .then(() => {
                    if ((quickSaveApi as ApiObject).reload) {
                        this.reloadTarget((quickSaveApi as ApiObject).reload as string, data);
                    }
                    this.search();
                })
                .catch(() => {});
        } else {
            if (!quickSaveItemApi) {
                env && env.alert('CRUD quickSaveItemApi is required!');
                return;
            }

            const data = createObject(store.data, {
                item: rows,
                modified: diff,
            });

            store
                .saveRemote(quickSaveItemApi, createObject(data, rows))
                .then(() => {
                    if ((quickSaveItemApi as ApiObject).reload) {
                        this.reloadTarget((quickSaveItemApi as ApiObject).reload as string, data);
                    }
                    this.search();
                })
                .catch(() => {});
        }
    }

    handleSaveOrder(moved: Array<object>, rows: Array<object>) {
        const {store, saveOrderApi, orderField, primaryField, env} = this.props;

        if (!saveOrderApi) {
            env && env.alert('CRUD saveOrderApi is required!');
            return;
        }

        const model: {
            insertAfter?: any;
            insertBefore?: any;
            idMap?: any;
            rows?: any;
            ids?: any;
            order?: any;
        } = createObject(store.data);

        let insertAfter: any;
        let insertBefore: any;
        const holding: Array<object> = [];
        const hasIdField = primaryField && rows[0] && (rows[0] as object).hasOwnProperty(primaryField);

        hasIdField || (model.idMap = {});

        model.insertAfter = {};
        rows.forEach((item: any) => {
            if (~moved.indexOf(item)) {
                if (insertAfter) {
                    let insertAfterId = hasIdField
                        ? (insertAfter as any)[primaryField as string]
                        : rows.indexOf(insertAfter);
                    model.insertAfter[insertAfterId] = (model as any).insertAfter[insertAfterId] || [];

                    hasIdField || (model.idMap[insertAfterId] = insertAfter);
                    model.insertAfter[insertAfterId].push(hasIdField ? item[primaryField as string] : item);
                } else {
                    holding.push(item);
                }
            } else {
                insertAfter = item;
                insertBefore = insertBefore || item;
            }
        });

        if (insertBefore && holding.length) {
            let insertBeforeId = hasIdField ? insertBefore[primaryField as string] : rows.indexOf(insertBefore);
            hasIdField || (model.idMap[insertBeforeId] = insertBefore);
            model.insertBefore = {};
            model.insertBefore[insertBeforeId] = holding.map((item: any) =>
                hasIdField ? item[primaryField as string] : item
            );
        } else if (holding.length) {
            const first: any = holding[0];
            const firstId = hasIdField ? first[primaryField as string] : rows.indexOf(first);

            hasIdField || (model.idMap[firstId] = first);
            model.insertAfter[firstId] = holding
                .slice(1)
                .map((item: any) => (hasIdField ? item[primaryField as string] : item));
        }

        if (orderField) {
            const start = (store.page - 1) * store.perPage || 0;
            rows = rows.map((item, key) =>
                extendObject(item, {
                    [orderField]: start + key + 1,
                })
            );
        }

        model.rows = rows.concat();
        hasIdField && (model.ids = rows.map((item: any) => item[primaryField as string]).join(','));
        hasIdField && orderField && (model.order = rows.map(item => pick(item, [primaryField as string, orderField])));

        store
            .saveRemote(saveOrderApi, model)
            .then(() => {
                if ((saveOrderApi as ApiObject).reload) {
                    this.reloadTarget((saveOrderApi as ApiObject).reload as string, model);
                }

                this.search();
            })
            .catch(() => {});
    }

    handleSelect(items: Array<any>, unSelectedItems: Array<any>) {
        const {store, keepItemSelectionOnPageChange, primaryField, multiple, pickerMode} = this.props;

        let newItems = items;
        let newUnSelectedItems = unSelectedItems;

        if (keepItemSelectionOnPageChange && store.selectedItems.length) {
            const thisBatch = items.concat(unSelectedItems);
            let notInThisBatch = (item: any) =>
                !find(thisBatch, a => a[primaryField || 'id'] == item[primaryField || 'id']);

            newItems = store.selectedItems.filter(notInThisBatch);
            newUnSelectedItems = store.unSelectedItems.filter(notInThisBatch);

            newItems.push(...items);
            newUnSelectedItems.push(...unSelectedItems);
        }

        if (pickerMode && !multiple && newItems.length > 1) {
            newUnSelectedItems.push(...newItems.splice(0, newItems.length - 1));
        }

        store.setSelectedItems(newItems);
        store.setUnSelectedItems(newUnSelectedItems);
    }

    handleChildPopOverOpen(popOver: any) {
        if (this.props.interval && popOver && ~['dialog', 'drawer'].indexOf(popOver.mode)) {
            clearTimeout(this.timer);
            this.props.store.setInnerModalOpened(true);
        }
    }

    handleChildPopOverClose(popOver: any) {
        const {stopAutoRefreshWhenModalIsOpen, silentPolling, interval} = this.props;

        if (popOver && ~['dialog', 'drawer'].indexOf(popOver.mode)) {
            this.props.store.setInnerModalOpened(false);

            if (stopAutoRefreshWhenModalIsOpen && interval) {
                this.timer = setTimeout(silentPolling ? this.silentSearch : this.search, Math.max(interval, 3000));
            }
        }
    }

    handlQuery(values: object) {
        const {store, syncLocation, env, pageField, perPageField} = this.props;

        store.updateQuery(
            {
                ...values,
                [pageField || 'page']: 1,
            },
            syncLocation && env && env.updateLocation ? env.updateLocation : undefined,
            pageField,
            perPageField
        );
        this.search(undefined, undefined, undefined, false);
    }

    reload(subpath?: string, query?: any) {
        if (query) {
            return this.receive(query);
        } else {
            this.search(undefined, undefined, true);
        }
    }

    receive(values: object) {
        this.handlQuery(values);
    }

    reloadTarget(target: string, data: any) {
        // implement this.
    }

    doAction(action: Action, data: object, throwErrors: boolean = false) {
        return this.handleAction(undefined, action, data, throwErrors);
    }

    unSelectItem(item: any, index: number) {
        const {store} = this.props;
        const selected = store.selectedItems.concat();
        const unSelected = store.unSelectedItems.concat();

        const idx = selected.indexOf(item);
        ~idx && unSelected.push(...selected.splice(idx, 1));

        store.setSelectedItems(selected);
        store.setUnSelectedItems(unSelected);
    }

    clearSelection() {
        const {store} = this.props;
        const selected = store.selectedItems.concat();
        const unSelected = store.unSelectedItems.concat();

        store.setSelectedItems([]);
        store.setUnSelectedItems(unSelected.concat(selected));
    }

    hasBulkActionsToolbar() {
        const {headerToolbar, footerToolbar} = this.props;

        const isBulkActions = (item: any) => ~['bulkActions', 'bulk-actions'].indexOf(item.type || item);
        return (
            (Array.isArray(headerToolbar) && find(headerToolbar, isBulkActions)) ||
            (Array.isArray(footerToolbar) && find(footerToolbar, isBulkActions))
        );
    }

    hasBulkActions() {
        const {bulkActions, itemActions, store} = this.props;

        if ((!bulkActions || !bulkActions.length) && (!itemActions || !itemActions.length)) {
            return false;
        }

        let bulkBtns: Array<Action> = [];
        let itemBtns: Array<Action> = [];
        const ctx = store.mergedData;

        if (bulkActions && bulkActions.length) {
            bulkBtns = bulkActions
                .map(item => ({
                    ...item,
                    ...getExprProperties(item as Schema, ctx),
                }))
                .filter(item => !item.hidden && item.visible !== false);
        }

        const itemData = createObject(store.data, store.selectedItems.length ? store.selectedItems[0] : {});

        if (itemActions && itemActions.length) {
            itemBtns = itemActions
                .map(item => ({
                    ...item,
                    ...getExprProperties(item as Schema, itemData),
                }))
                .filter(item => !item.hidden && item.visible !== false);
        }

        return bulkBtns.length || itemBtns.length;
    }

    renderBulkActions(childProps: any) {
        let {bulkActions, itemActions, store, render, classnames: cx} = this.props;

        const items = childProps.items;

        if (!items.length || ((!bulkActions || !bulkActions.length) && (!itemActions || !itemActions.length))) {
            return null;
        }

        const selectedItems = store.selectedItems;
        const unSelectedItems = store.unSelectedItems;

        let bulkBtns: Array<Action> = [];
        let itemBtns: Array<Action> = [];

        const ctx = store.mergedData;

        // const ctx = createObject(store.data, {
        //     ...store.query,
        //     items: childProps.items,
        //     selectedItems: childProps.selectedItems,
        //     unSelectedItems: childProps.unSelectedItems
        // });

        if (bulkActions && bulkActions.length && (!itemActions || !itemActions.length || selectedItems.length > 1)) {
            bulkBtns = bulkActions
                .map(item => ({
                    ...item,
                    ...getExprProperties(item as Schema, ctx),
                }))
                .filter(item => !item.hidden && item.visible !== false);
        }

        const itemData = createObject(store.data, selectedItems.length ? selectedItems[0] : {});

        if (itemActions && selectedItems.length === 1) {
            itemBtns = itemActions
                .map(item => ({
                    ...item,
                    ...getExprProperties(item as Schema, itemData),
                }))
                .filter(item => !item.hidden && item.visible !== false);
        }

        return (
            <div className={cx('Crud-actions')}>
                {bulkBtns.map((btn, index) =>
                    render(
                        `bulk-action/${index}`,
                        {
                            size: 'sm',
                            ...omit(btn, ['visibileOn', 'hiddenOn', 'disabledOn']),
                            type: 'button',
                        },
                        {
                            key: `bulk-${index}`,
                            data: ctx,
                            disabled: btn.disabled || !selectedItems.length,
                            onAction: this.handleBulkAction.bind(
                                this,
                                selectedItems.concat(),
                                unSelectedItems.concat()
                            ),
                        }
                    )
                )}

                {itemBtns.map((btn, index) =>
                    render(
                        `bulk-action/${index}`,
                        {
                            size: 'sm',
                            ...omit(btn, ['visibileOn', 'hiddenOn', 'disabledOn']),
                            type: 'button',
                        },
                        {
                            key: `item-${index}`,
                            data: itemData,
                            disabled: btn.disabled,
                            onAction: this.handleItemAction.bind(this, btn, itemData),
                        }
                    )
                )}
            </div>
        );
    }

    renderPagination() {
        const {store, render, classnames: cx} = this.props;

        const {page, lastPage} = store;

        if (store.mode !== 'simple' && store.lastPage < 2) {
            return null;
        }

        return (
            <div className={cx('Crud-pager')}>
                {render(
                    'pagination',
                    {
                        type: 'pagination',
                    },
                    {
                        activePage: page,
                        items: lastPage,
                        hasNext: store.hasNext,
                        mode: store.mode,
                        onPageChange: this.handleChangePage
                    }
                )}
            </div>
        );
    }

    renderStatistics() {
        const {store, classnames: cx} = this.props;

        if (store.lastPage <= 1) {
            return null;
        }

        return (
            <div className={cx('Crud-statistics')}>{`${store.page + '/' + store.lastPage}总共${store.total}项。`}</div>
        );
    }

    renderSwitchPerPage(childProps: any) {
        const {store, perPageAvailable, classnames: cx, classPrefix: ns} = this.props;

        const items = childProps.items;

        if (!items.length) {
            return null;
        }

        const perPages = (perPageAvailable || [5, 10, 20, 50, 100]).map((item: any) => ({
            label: item,
            value: item + '',
        }));

        return (
            <div className={cx('Crud-pageSwitch')}>
                每页显示
                <Select
                    classPrefix={ns}
                    searchable={false}
                    placeholder="请选择.."
                    options={perPages}
                    value={store.perPage + ''}
                    onChange={(value: any) => this.handleChangePage(1, value.value)}
                    clearable={false}
                />
            </div>
        );
    }

    renderLoadMore() {
        const {store, classPrefix: ns, classnames: cx} = this.props;
        const {page, lastPage} = store;

        return page < lastPage ? (
            <div className={cx('Crud-loadMore')}>
                <Button
                    classPrefix={ns}
                    onClick={() => this.search({page: page + 1, loadDataMode: 'load-more'})}
                    size="sm"
                    className="btn-primary"
                >
                    加载更多
                </Button>
            </div>
        ) : (
            ''
        );
    }

    renderFilterToggler() {
        const {store, classnames: cx} = this.props;

        if (!store.filterTogggable) {
            return null;
        }

        return (
            <button
                onClick={() => store.setFilterVisible(!store.filterVisible)}
                className={cx('Button Button--sm Button--default', {'is-active': store.filterVisible})}
            >
                <i className="fa fa-sliders m-r-sm" />
                筛选
            </button>
        );
    }

    renderToolbar(
        toolbar?: SchemaNode,
        index: number = 0,
        childProps: any = {},
        toolbarRenderer?: (toolbar: SchemaNode, index: number) => React.ReactNode
    ) {
        if (!toolbar) {
            return null;
        }

        const type = (toolbar as Schema).type || toolbar;

        if (type === 'bulkActions' || type === 'bulk-actions') {
            return this.renderBulkActions(childProps);
        } else if (type === 'pagination') {
            return this.renderPagination();
        } else if (type === 'statistics') {
            return this.renderStatistics();
        } else if (type === 'switch-per-page') {
            return this.renderSwitchPerPage(childProps);
        } else if (type === 'load-more') {
            return this.renderLoadMore();
        } else if (type === 'filter-toggler') {
            return this.renderFilterToggler();
        } else if (Array.isArray(toolbar)) {
            const children: Array<any> = toolbar
                .map((toolbar, index) => ({
                    dom: this.renderToolbar(toolbar, index, childProps, toolbarRenderer),
                    toolbar,
                }))
                .filter(item => item.dom);
            const len = children.length;
            const cx = this.props.classnames;
            if (len) {
                return (
                    <div className={cx('Crud-toolbar')} key={index}>
                        {children.map(({toolbar, dom: child}, index) => {
                            const type = (toolbar as Schema).type || toolbar;
                            let align =
                                toolbar.align ||
                                (type === 'pagination' || (index === len - 1 && index > 0)
                                    ? 'right'
                                    : index < len - 1
                                    ? 'left'
                                    : '');

                            return (
                                <div
                                    key={index}
                                    className={cx(
                                        'Crud-toolbar-item',
                                        align ? `Crud-toolbar-item--${align}` : '',
                                        toolbar.className
                                    )}
                                >
                                    {child}
                                </div>
                            );
                        })}
                    </div>
                );
            }
            return null;
        }

        const result = toolbarRenderer ? toolbarRenderer(toolbar, index) : undefined;

        if (result !== void 0) {
            return result;
        }

        const {render, store} = this.props;
        const $$editable = childProps.$$editable;

        return render(`toolbar/${index}`, toolbar, {
            // 包两层，主要是为了处理以下 case
            // 里面放了个 form，form 提交过来的时候不希望把 items 这些发送过来。
            // 因为会把数据呈现在地址栏上。
            data: createObject(
                createObject(store.data, {
                    items: childProps.items,
                    selectedItems: childProps.selectedItems,
                    unSelectedItems: childProps.unSelectedItems,
                }),
                {}
            ),
            page: store.page,
            lastPage: store.lastPage,
            perPage: store.perPage,
            total: store.total,
            onAction: this.handleAction,
            onChangePage: this.handleChangePage,
            onBulkAction: this.handleBulkAction,
            $$editable,
        });
    }

    renderHeaderToolbar(childProps: any, toolbarRenderer?: (toolbar: SchemaNode, index: number) => React.ReactNode) {
        let {toolbar, toolbarInline, headerToolbar} = this.props;

        if (toolbar) {
            if (Array.isArray(headerToolbar)) {
                headerToolbar = toolbarInline ? headerToolbar.concat(toolbar) : [headerToolbar, toolbar];
            } else if (headerToolbar) {
                headerToolbar = [headerToolbar, toolbar];
            } else {
                headerToolbar = toolbar;
            }
        }

        return this.renderToolbar(headerToolbar, 0, childProps, toolbarRenderer);
    }

    renderFooterToolbar(childProps: any, toolbarRenderer?: (toolbar: SchemaNode, index: number) => React.ReactNode) {
        let {toolbar, toolbarInline, footerToolbar} = this.props;

        if (toolbar) {
            if (Array.isArray(footerToolbar)) {
                footerToolbar = toolbarInline ? footerToolbar.concat(toolbar) : [footerToolbar, toolbar];
            } else if (footerToolbar) {
                footerToolbar = [footerToolbar, toolbar];
            } else {
                footerToolbar = toolbar;
            }
        }

        return this.renderToolbar(footerToolbar, 0, childProps, toolbarRenderer);
    }

    renderSelection(): React.ReactNode {
        const {store, classnames: cx, labelField, labelTpl, primaryField} = this.props;

        if (!store.selectedItems.length) {
            return null;
        }

        return (
            <div className={cx('Crud-selection')}>
                <div className={cx('Crud-selectionLabel')}>已选条目：</div>
                {store.selectedItems.map((item, index) => (
                    <div key={index} className={cx(`Crud-value`)}>
                        <span
                            data-tooltip="删除"
                            data-position="bottom"
                            className={cx('Crud-valueIcon')}
                            onClick={this.unSelectItem.bind(this, item, index)}
                        >
                            ×
                        </span>
                        <span className={cx('Crud-valueLabel')}>
                            {labelTpl
                                ? filter(labelTpl, item)
                                : getVariable(item, labelField || 'label') || getVariable(item, primaryField || 'id')}
                        </span>
                    </div>
                ))}
                <a onClick={this.clearSelection} className={cx('Crud-selectionClear')}>
                    清空
                </a>
            </div>
        );
    }

    render() {
        const {
            className,
            bodyClassName,
            filter,
            render,
            store,
            mode,
            syncLocation,
            children,
            bulkActions,
            pickerMode,
            multiple,
            valueField,
            primaryField,
            value,
            hideQuickSaveBtn,
            itemActions,
            classnames: cx,
            keepItemSelectionOnPageChange,
            ...rest
        } = this.props;

        return (
            <div
                className={cx('Crud', className, {
                    'is-loading': store.loading,
                })}
            >
                {filter && (!store.filterTogggable || store.filterVisible)
                    ? render(
                          'filter',
                          {
                              title: '条件过滤',
                              mode: 'inline',
                              submitText: '搜索',
                              ...filter,
                              type: 'form',
                              api: null,
                          },
                          {
                              key: 'filter',
                              data: store.filterData,
                              onReset: this.handleFilterReset,
                              onSubmit: this.handleFilterSubmit,
                              onInit: this.handleFilterInit,
                          }
                      )
                    : null}

                {keepItemSelectionOnPageChange ? this.renderSelection() : null}

                {render(
                    'body',
                    {
                        ...rest,
                        type: mode || 'table',
                    },
                    {
                        key: 'body',
                        className: cx('Crud-body', bodyClassName),
                        ref: this.controlRef,
                        selectable: !!((this.hasBulkActionsToolbar() && this.hasBulkActions()) || pickerMode),
                        itemActions,
                        multiple:
                            multiple === void 0 ? (bulkActions && bulkActions.length > 0 ? true : false) : multiple,
                        selected: pickerMode || keepItemSelectionOnPageChange ? store.selectedItemsAsArray : undefined,
                        valueField: valueField || primaryField,
                        hideQuickSaveBtn,
                        items: store.data.items,
                        query: store.query,
                        orderBy: store.query.orderBy,
                        orderDir: store.query.orderDir,
                        onAction: this.handleAction,
                        onSave: this.handleSave,
                        onSaveOrder: this.handleSaveOrder,
                        onQuery: this.handlQuery,
                        onSelect: this.handleSelect,
                        onPopOverOpen: this.handleChildPopOverOpen,
                        onPopOverClose: this.handleChildPopOverClose,
                        headerToolbarRender: this.renderHeaderToolbar,
                        footerToolbarRender: this.renderFooterToolbar,
                        data: store.mergedData,
                    }
                )}

                {store.loading
                    ? render(
                          'info',
                          {
                              type: 'spinner',
                              overlay: true,
                          },
                          {
                              size: 'lg',
                              key: 'info',
                          }
                      )
                    : null}

                {render(
                    'dialog',
                    {
                        ...((store.action as Action) && ((store.action as Action).dialog as object)),
                        type: 'dialog',
                    },
                    {
                        key: 'dialog',
                        data: store.dialogData,
                        onConfirm: this.handleDialogConfirm,
                        onClose: this.handleDialogClose,
                        show: store.dialogOpen,
                    }
                )}
            </div>
        );
    }
}

@Renderer({
    test: /(^|\/)crud$/,
    storeType: CRUDStore.name,
    name: 'crud',
})
export class CRUDRenderer extends CRUD {
    static contextType = ScopedContext;

    componentWillMount() {
        super.componentWillMount();

        const scoped = this.context as IScopedContext;
        scoped.registerComponent(this);
    }

    componentWillUnmount() {
        super.componentWillUnmount();
        const scoped = this.context as IScopedContext;
        scoped.unRegisterComponent(this);
    }

    reloadTarget(target: string, data: any) {
        const scoped = this.context as IScopedContext;
        scoped.reload(target, data);
    }
}
