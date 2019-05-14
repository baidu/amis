import {
    types,
    getParent,
    SnapshotIn,
    flow,
    getEnv,
    getRoot,
    IAnyModelType
} from "mobx-state-tree";
import {
    iRendererStore,
} from './iRenderer';
import { resolveVariable } from "../utils/tpl-builtin";
import isEqual = require('lodash/isEqual');
import find = require('lodash/find');
import { isBreakpoint, createObject, isObject, isVisible } from "../utils/helper";
import { evalExpression } from "../utils/tpl";

export const Column = types
    .model("Column", {
        label: types.optional(types.frozen(), undefined),
        type: types.string,
        name: types.maybe(types.string),
        toggled: false,
        toggable: true,
        searchable: types.maybe(types.frozen()),
        sortable: false,
        filterable: types.optional(types.frozen(), undefined),
        fixed: '',
        index: 0,
        breakpoint: types.optional(types.frozen(), undefined),
        pristine: types.optional(types.frozen(), undefined),
        remark: types.optional(types.frozen(), undefined),
        className: ''
    })
    .actions((self) => ({
        toggleToggle() {
            self.toggled = !self.toggled;
            const table = (getParent(self, 2) as ITableStore);

            if (!table.activeToggaleColumns.length) {
                self.toggled = true;
            }

            table.persistSaveToggledColumns();
        },
        setToggled(value:boolean) {
            self.toggled = value;
        }
    }));

export type IColumn = typeof Column.Type;
export type SColumn = SnapshotIn<typeof Column>;

export const Row = types
    .model("Row", {
        id: types.identifier,
        key: types.string,
        expandable: false,
        pristine: types.frozen({} as any),
        data: types.frozen({} as any),
        rowSpans: types.frozen({} as any),
        index: types.number,
        newIndex: types.number,
        isHover: false,
        children: types.optional(types.array(types.late((): IAnyModelType => Row)), []),
        depth: types.number// 当前children位于第几层，便于使用getParent获取最顶层TableStore
    })
    .views((self) => ({
        get checked() {
            return (getParent(self, self.depth * 2) as ITableStore).isSelected(self as IRow);
        },

        get modified() {
            if (!self.data) {
                return false;
            }

            return Object.keys(self.data).some(key => !isEqual(self.data[key], self.pristine[key]));
        },

        get expanded() {
            return (getParent(self, self.depth * 2) as ITableStore).isExpanded(self as IRow);
        },

        get moved() {
            return self.index !== self.newIndex;
        },

        get locals() {
            return createObject(
                createObject((getParent(self, self.depth * 2) as ITableStore).data, {
                    index: self.index
                }), self.data);
        },

        get checkable() {
            const table = (getParent(self, self.depth * 2) as ITableStore);
            return table && table.itemCheckableOn ? evalExpression(table.itemCheckableOn, (self as IRow).locals) : true;
        },

        get draggable() {
            const table = (getParent(self, self.depth * 2) as ITableStore);
            return table && table.itemDraggableOn ? evalExpression(table.itemDraggableOn, (self as IRow).locals) : true;
        }
    }))
    .actions((self) => ({
        toggle() {
            (getParent(self, self.depth * 2) as ITableStore).toggle(self as IRow);
        },

        toggleExpanded() {
            (getParent(self, self.depth * 2) as ITableStore).toggleExpanded(self as IRow);
        },

        change(values:object, savePristine?:boolean) {
            self.data = {
                ...self.data,
                ...values
            };

            savePristine && (self.pristine = {
                ...self.data
            });
        },

        reset() {
            self.newIndex = self.index;
            self.data = self.pristine;
        },

        setIsHover(value:boolean) {
            self.isHover = value;
        }
    }));

export type IRow = typeof Row.Type;
export type SRow = SnapshotIn<typeof Row>;

export const TableStore = iRendererStore
    .named('TableStore')
    .props({
        columns: types.array(Column),
        rows: types.array(Row),
        selectedRows: types.array(types.reference(Row)),
        expandedRows: types.array(types.reference(Row)),
        primaryField: 'id',
        orderBy: '',
        orderDir: types.optional(types.union(types.literal('asc'), types.literal('desc')), 'asc'),
        draggable: false,
        dragging: false,
        selectable: false,
        multiple: true,
        footable: types.frozen(),
        isNested: false,
        columnsTogglable: types.optional(types.union(types.boolean, types.literal('auto')), 'auto'),
        itemCheckableOn: '',
        itemDraggableOn: '',
        hideCheckToggler: false,
        combineNum: 0
    })
    .views(self => {
        function getFilteredColumns() {
            return self
                .columns
                .filter(item => isVisible(item.pristine, self.data) && (
                    item.type === '__checkme' ? self.selectable && !self.dragging && !self.hideCheckToggler && self.rows.length
                    : item.type === '__dragme' ? self.dragging
                    : item.type === '__expandme' ? (getFootableColumns().length || self.isNested) && !self.dragging
                    : (item.toggled || !item.toggable) && (!self.footable || !item.breakpoint || !isBreakpoint(item.breakpoint))
                ));
        }

        function getFootableColumns() {
            return self
                .columns
                .filter(item =>
                    item.type === '__checkme' || item.type === '__dragme' || item.type === '__expandme' ? false
                    : (item.toggled || !item.toggable) && (self.footable && item.breakpoint && isBreakpoint(item.breakpoint))
                );
        }

        function getLeftFixedColumns() {
            if (self.dragging) {
                return [];
            }

            return getFilteredColumns().filter(item => item.fixed === 'left');
        }

        function getRightFixedColumns() {
            if (self.dragging) {
                return [];
            }

            return getFilteredColumns().filter(item => item.fixed === 'right');
        }

        function isSelected(row:IRow):boolean {
            return !!~self.selectedRows.indexOf(row);
        }

        function isExpanded(row:IRow):boolean {
            return !!~self.expandedRows.indexOf(row);
        }

        function getTogglable() {
            if (self.columnsTogglable === 'auto') {
                return self.columns.filter(item => !/^__/.test(item.type)).length > 5;
            }

            return self.columnsTogglable;
        }

        function getToggableColumns() {
            return self.columns.filter(item => isVisible(item.pristine, self.data) && item.toggable !== false);
        }

        function getActiveToggableColumns() {
            return getToggableColumns().filter(item => item.toggled);
        }

        function getModifiedRows() {
            return self.rows.filter(item => item.modified);
        }

        function getModified() {
            return getModifiedRows().length;
        }

        function getMovedRows() {
            return self.rows.filter(item => item.moved);
        }

        function getMovied() {
            return getMovedRows().length;
        }

        function getHoverIndex():number {
            return self.rows.findIndex(item => item.isHover);
        }

        function getUnSelectedRows() {
            return self.rows.filter(item => !item.checked);
        }

        function getData(superData:any):any {
            return createObject(superData, {
                items: self.rows.map(item => item.data),
                selectedItems: self.selectedRows.map(item => item.data),
                unSeelctedItems: getUnSelectedRows().map(item => item.data),
            });
        }

        return {
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
                return !!(self.selectedRows.length === (self as ITableStore).checkableRows.length 
                    && (self as ITableStore).checkableRows.length);
            },

            isSelected,

            get allExpanded() {
                return !!(self.expandedRows.length === self.rows.length && self.rows.length);
            },

            isExpanded,

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
                return self.rows.filter(item => item.checkable);
            },

            get moved() {
                return getMovied();
            },

            get movedRows() {
                return getMovedRows();
            },

            get hoverIndex() {
                return getHoverIndex();
            },

            getData
        };
    })
    .actions(self => {
        function update(config:Partial<STableStore>) {
            config.primaryField !== void 0 && (self.primaryField = config.primaryField);
            config.selectable !== void 0 && (self.selectable = config.selectable);
            config.columnsTogglable !== void 0 && (self.columnsTogglable = config.columnsTogglable);
            config.draggable !== void 0 && (self.draggable = config.draggable);

            if (typeof config.orderBy === 'string') {
                setOrderByInfo(config.orderBy, config.orderDir === 'desc' ? 'desc' : 'asc');
            }

            config.multiple !== void 0 && (self.multiple = config.multiple);
            config.footable !== void 0 && (self.footable = config.footable);
            config.itemCheckableOn !== void 0 && (self.itemCheckableOn = config.itemCheckableOn);
            config.itemDraggableOn !== void 0 && (self.itemDraggableOn = config.itemDraggableOn);
            config.hideCheckToggler !== void 0 && (self.hideCheckToggler = !!config.hideCheckToggler);

            config.combineNum !== void 0 && (self.combineNum = parseInt(config.combineNum as any, 10) || 0)

            if (config.columns && Array.isArray(config.columns)) {
                let columns:Array<SColumn> = config.columns.concat();

                columns.unshift({
                    type: '__expandme',
                    toggable: false,
                    fixed: 'left',
                    className: 'Table-expandCell'
                });

                columns.unshift({
                    type: '__checkme',
                    toggable: false,
                    fixed: 'left',
                    className: 'Table-checkCell'
                });

                columns.unshift({
                    type: '__dragme',
                    toggable: false,
                    className: 'Table-dragCell'
                });

                columns = columns.map((item, index) => ({
                    ...item,
                    index,
                    type: item.type || 'plain',
                    pristine: item,
                    toggled: item.toggled !== false,
                    breakpoint: item.breakpoint
                }));

                self.columns.replace(columns as any);
            }
        }

        function combineCell(arr: Array<SRow>, keys:Array<string>): Array<SRow> {
            if (!keys.length || !arr.length) {
                return arr;
            }

            const key:string = keys.shift() as string;
            let rowIndex = 0;
            let row = arr[rowIndex];
            row.rowSpans[key] = 1;
            let value = resolveVariable(key, row.data);
            for (let i = 1, len = arr.length; i < len; i++) {
                const current = arr[i];
                if (resolveVariable(key, current.data) == value) {
                    row.rowSpans[key] += 1;
                    current.rowSpans[key] = 0;
                } else {
                    if (row.rowSpans[key] > 1) {
                        combineCell(arr.slice(rowIndex, i), keys.concat());
                    }

                    rowIndex = i;
                    row = current;
                    row.rowSpans[key] = 1;
                    value = resolveVariable(key, row.data);
                }
            }

            if (row.rowSpans[key] > 1 && keys.length) {
                combineCell(arr.slice(rowIndex, arr.length), keys.concat());
            }

            return arr;
        }

        function autoCombineCell(arr: Array<SRow>, columns: Array<IColumn>,  maxCount:number): Array<SRow> {
            if (!columns.length || !maxCount || !arr.length) {
                return arr;
            }

            const keys:Array<string> = [];
            for (let i = 0; i < maxCount; i++) {
                const column = columns[i];

                // maxCount 可能比实际配置的 columns 还有多。
                if (!column) {
                    break;
                }

                if ('__' === column.type.substring(0, 2)) {
                    maxCount++;
                    continue;
                }

                const key = column.name;
                if (!key) {
                    break;
                }
                keys.push(key);
            }

            return combineCell(arr, keys);
        }

        function initChildren(children: Array<any>, depth: number, pindex: number): any {
            depth += 1;
            return children.map((item, key) => {
                item = isObject(item) ? item : {
                    item
                };

                return {
                    id: String(item && (item as any)[self.primaryField] || `${pindex}-${depth}-${key}`),
                    key: String(`${pindex}-${depth}-${key}`),
                    depth: depth,
                    index: key,
                    newIndex: key,
                    pristine: item,
                    data: item,
                    rowSpans: {},
                    modified: false,
                    children: (item && Array.isArray(item.children)) ? initChildren(item.children, depth, key) : [],
                    expandable: !!(item && Array.isArray(item.children) || self.footable && self.footableColumns.length),
                };
            });
        }

        function initRows(rows: Array<any>, getEntryId?: (entry: any, index: number) => string) {
            self.selectedRows.clear();
            self.expandedRows.clear();

            let arr:Array<SRow> = rows.map((item, key) => ({
                id: getEntryId ? getEntryId(item, key) : String(item && (item as any)[self.primaryField] || `${key}-1-${key}`),
                key: String(`${key}-1-${key}`),
                depth: 1,// 最大父节点默认为第一层，逐层叠加
                index: key,
                newIndex: key,
                pristine: item,
                data: item,
                rowSpans: {},
                modified: false,
                children: (item && Array.isArray(item.children)) ? initChildren(item.children, 1, key) : [],
                expandable: !!(item && Array.isArray(item.children) || self.footable && self.footableColumns.length),
            }));
            
            if (self.combineNum) {
                arr = autoCombineCell(arr, self.columns, self.combineNum);
            }

            self.rows.replace(arr as Array<IRow>);
            self.isNested = self.rows.some(item => item.expandable);

            const expand = self.footable && self.footable.expand;
            if (expand === 'first') {
                self.rows.length && self.expandedRows.push(self.rows[0]);
            } else if (expand === 'all') {
                self.expandedRows.replace(self.rows);
            }

            self.dragging = false;
        }

        function updateSelected(selected:Array<any>, valueField?: string) {
            self.selectedRows.clear();
            self.rows.forEach(item => {
                if (~selected.indexOf(item.pristine)) {
                    self.selectedRows.push(item);
                } else if (find(selected, (a) => a[valueField || 'value'] == item.pristine[valueField || 'value'])) {
                    self.selectedRows.push(item);
                }
            });
        }

        function toggleAll() {
            if (self.allChecked) {
                self.selectedRows.clear();
            } else {
                self.selectedRows.replace(self.checkableRows);
            }
        }

        function toggle(row:IRow) {
            if (!row.checkable) {
                return;
            }

            const idx = self.selectedRows.indexOf(row);

            if (self.multiple) {
                ~idx ? self.selectedRows.splice(idx, 1) : self.selectedRows.push(row);
            } else {
                ~idx ? self.selectedRows.splice(idx, 1) : self.selectedRows.replace([row]);
            }

        }

        function clear() {
            self.selectedRows.clear();
        }

        function toggleExpandAll() {
            if (self.allExpanded) {
                self.expandedRows.clear();
            } else {
                self.expandedRows.replace(self.rows);
            }
        }

        function toggleExpanded(row:IRow) {
            const idx = self.expandedRows.indexOf(row);
            ~idx ? self.expandedRows.splice(idx, 1) : self.expandedRows.push(row);
        }

        function setOrderByInfo(key:string, direction: 'asc' | 'desc') {
            self.orderBy = key;
            self.orderDir = direction;
        }

        function reset() {
            self.rows.forEach(item => item.reset());
            const rows = self.rows.slice().sort((a, b) => a.newIndex - b.newIndex);
            self.rows.replace(rows);
            self.dragging = false;
        }

        function toggleDragging() {
            self.dragging = !self.dragging;
        }

        function stopDragging() {
            self.dragging = false;
        }

        function exchange(fromIndex:number, toIndex:number) {
            const item:IRow = self.rows[fromIndex];
            item.newIndex = toIndex;

            const newRows = self.rows.slice();
            newRows.splice(fromIndex, 1);
            newRows.splice(toIndex, 0, item);

            self.rows.replace(newRows);
        }

        function persistSaveToggledColumns() {
            const key = location.pathname + self.path + self.toggableColumns.map(item => item.name || item.index).join('-');
            localStorage.setItem(key, JSON.stringify(self.activeToggaleColumns.map(item => item.index)));
        }

        return {
            update,
            initRows,
            updateSelected,
            toggleAll,
            toggle,
            toggleExpandAll,
            toggleExpanded,
            clear,
            setOrderByInfo,
            reset,
            toggleDragging,
            stopDragging,
            exchange,

            persistSaveToggledColumns,

            // events
            afterAttach() {
                setTimeout(() => {
                    const key = location.pathname + self.path + self.toggableColumns.map(item => item.name || item.index).join('-');
                    const data = localStorage.getItem(key);

                    if (data) {
                        const selectedColumns = JSON.parse(data);
                        self.toggableColumns.forEach(item => item.setToggled(!!~selectedColumns.indexOf(item.index)));
                    }
                }, 200);
            }
        };
    });

export type ITableStore = typeof TableStore.Type;
export type STableStore = SnapshotIn<typeof TableStore>;
