import React from 'react';
import {
  FormItem,
  FormControlProps,
  FormBaseControl,
  createObject,
  getTree,
  getVariable,
  setVariable,
  spliceTree,
  filterDate,
  isEffectiveApi,
  filter,
  dataMapping,
  SimpleMap,
  RendererData,
  ActionObject,
  Payload,
  ApiObject,
  autobind,
  isExpression,
  isPureVariable,
  resolveVariableAndFilter,
  getRendererByName,
  resolveEventData,
  ListenerAction,
  evalExpressionWithConditionBuilderAsync,
  mapTree,
  isObject,
  eachTree,
  everyTree,
  findTreeIndex,
  applyFilters
} from 'amis-core';
import {Button, Icon} from 'amis-ui';
import omit from 'lodash/omit';
import findIndex from 'lodash/findIndex';
import {TableSchema} from '../Table';
import {SchemaApi, SchemaCollection, SchemaClassName} from '../../Schema';
import find from 'lodash/find';
import debounce from 'lodash/debounce';
import moment from 'moment';
import {sortArray, str2function} from 'amis-core';

import type {SchemaTokenizeableString} from '../../Schema';

// 占位符定义为常量
const PLACE_HOLDER = '__isPlaceholder';
export type TableDataItem = {
  [PLACE_HOLDER]?: boolean;
  [x: string | number]: any;
};

export interface TableControlSchema
  extends FormBaseControl,
    Omit<TableSchema, 'type'> {
  type: 'input-table';

  /**
   * 可新增
   */
  addable?: boolean;

  /**
   * 是否可以新增子项
   */
  childrenAddable?: boolean;

  /**
   * 可复制新增
   */
  copyable?: boolean;

  /**
   * 复制按钮文字
   */
  copyBtnLabel?: string;

  /**
   * 复制按钮图标
   */
  copyBtnIcon?: string;

  /**
   * 是否显示复制按钮
   */
  copyAddBtn?: boolean;

  /**
   * 复制的时候用来配置复制映射的数据。默认值是 {&:$$}，相当与复制整个行数据
   * 通常有时候需要用来标记是复制过来的，也可能需要删掉一下主键字段。
   */
  copyData?: Record<string, any>;

  /**
   * 是否可以拖拽排序
   */
  draggable?: boolean;

  /**
   * 新增 API
   */
  addApi?: SchemaApi;

  /**
   * 新增按钮文字
   */
  addBtnLabel?: string;

  /**
   * 新增按钮图标
   */
  addBtnIcon?: string;

  /**
   * 孩子新增按钮文字
   */
  subAddBtnLabel?: string;

  /**
   * 孩子新增按钮图标
   */
  subAddBtnIcon?: string;

  /**
   * 可否删除
   */
  removable?: boolean;

  /**
   * 删除的 API
   */
  deleteApi?: SchemaApi;

  /**
   * 可否编辑
   */
  editable?: boolean;

  /**
   * 更新按钮名称
   */
  editBtnLabel?: string;

  /**
   * 更新按钮图标
   */
  editBtnIcon?: string;

  /**
   * 确认按钮文字
   */
  confirmBtnLabel?: string;

  /**
   * 确认按钮图标
   */
  confirmBtnIcon?: string;

  /**
   * 取消按钮文字
   */
  cancelBtnLabel?: string;

  /**
   * 取消按钮图标
   */
  cancelBtnIcon?: string;

  /**
   * 删除按钮文字
   */
  deleteBtnLabel?: string;

  /**
   * 删除按钮图标
   */
  deleteBtnIcon?: string;

  /**
   * 更新 API
   */
  updateApi?: SchemaApi;

  /**
   * 初始值，新增的时候
   */
  scaffold?: any;

  /**
   * 删除确认文字
   */
  deleteConfirmText?: string;

  /**
   * 值字段
   */
  valueField?: string;

  /**
   * 是否为确认的编辑模式。
   */
  needConfirm?: boolean;

  /**
   * 是否可以访问父级数据，正常 combo 已经关联到数组成员，是不能访问父级数据的。
   */
  canAccessSuperData?: boolean;

  /**
   * 是否显示序号
   */
  showIndex?: boolean;

  /**
   * 分页个数，默认不分页
   */
  perPage?: number;

  /**
   * 限制最大个数
   */
  maxLength?: number | SchemaTokenizeableString;

  /**
   * 限制最小个数
   */
  minLength?: number | SchemaTokenizeableString;

  /**
   * 是否显示底部新增按钮
   */
  showFooterAddBtn?: boolean;

  /**
   * 是否显示表格操作栏新增按钮
   */
  showTableAddBtn?: boolean;

  /**
   * 底部新增按钮配置
   */
  footerAddBtn?: SchemaCollection;

  /**
   * 是否开启 static 状态切换
   */
  enableStaticTransform?: boolean;

  /**
   * 底部工具栏CSS样式类
   */
  toolbarClassName?: SchemaClassName;

  /**
   * 自定义搜索匹配函数，当存在列的 searchable 为 true 时，会基于该函数计算的匹配结果进行过滤，主要用于处理列字段类型较为复杂或者字段值格式和后端返回不一致的场景
   *
   * 参数说明
   *
   *  * `items` 当前表格数据
   *  * `itemsRaw` 当前表格数据（未处理）
   *  * `options` 配置
   *  * `options.query` 查询条件
   *  * `options.columns` 列配置
   *  * `options.matchSorter` 系统默认的排序方法
   * @since 6.10.0
   */
  matchFunc?: string | any;
}

export interface TableProps
  extends FormControlProps,
    Omit<
      TableControlSchema,
      'type' | 'className' | 'descriptionClassName' | 'inputClassName'
    > {}

export interface TableState {
  items: Array<TableDataItem>;
  filteredItems: Array<TableDataItem>;
  columns: Array<any>;
  editIndex: string;
  rowIndex?: string;
  isCreateMode?: boolean;
  page?: number;
  total?: number;
  query?: any;
  lastModifiedRow?: {
    index: string;
    data: Record<string, any>;
  };
}

export type FormTableRendererEvent =
  | 'add'
  | 'addConfirm'
  | 'addSuccess'
  | 'addFail'
  | 'edit'
  | 'editConfirm'
  | 'editSuccess'
  | 'editFail'
  | 'delete'
  | 'deleteSuccess'
  | 'deleteFail';

export type FormTableRendererAction = 'add' | 'delete' | 'reset' | 'clear';

export default class FormTable<
  T extends TableProps = TableProps
> extends React.Component<T, TableState> {
  static defaultProps = {
    placeholder: 'placeholder.empty',
    scaffold: {},
    addBtnIcon: 'plus',
    subAddBtnIcon: 'sub-plus',
    copyBtnIcon: 'copy',
    editBtnIcon: 'pencil',
    deleteBtnIcon: 'minus',
    confirmBtnIcon: 'check',
    cancelBtnIcon: 'close',
    valueField: '',
    minLength: 0,
    maxLength: Infinity,
    showFooterAddBtn: true,
    showTableAddBtn: true
  };

  static propsList: Array<string> = [
    'onChange',
    'name',
    'columns',
    'label',
    'scaffold',
    'showTableAddBtn',
    'addable',
    'removable',
    'copyable',
    'editable',
    'addApi',
    'updateApi',
    'deleteApi',
    'needConfirm',
    'canAccessSuperData',
    'formStore',
    'footerActions',
    'toolbarClassName'
  ];

  entries: SimpleMap<any, number>;
  entityId: number = 1;
  subForms: any = {};
  subFormItems: any = {};
  rowPrinstine: Array<any> = [];
  editting: any = {};
  table: any;
  toDispose: Array<() => void> = [];

  lazyEmitValue = debounce(this.emitValue.bind(this), 50, {
    trailing: true,
    leading: false
  });

  constructor(props: T) {
    super(props);
    const {addHook} = props;
    const items = Array.isArray(props.value) ? props.value.concat() : [];

    this.state = {
      columns: this.buildColumns(props),
      editIndex: '',
      items: items,
      ...this.transformState(items)
    };

    this.entries = new SimpleMap();
    this.buildItemProps = this.buildItemProps.bind(this);
    this.confirmEdit = this.confirmEdit.bind(this);
    this.cancelEdit = this.cancelEdit.bind(this);
    this.handleSaveTableOrder = this.handleSaveTableOrder.bind(this);
    this.handleTableSave = this.handleTableSave.bind(this);
    this.handleRadioChange = this.handleRadioChange.bind(this);
    this.getEntryId = this.getEntryId.bind(this);
    this.subFormRef = this.subFormRef.bind(this);
    this.subFormItemRef = this.subFormItemRef.bind(this);
    this.handlePageChange = this.handlePageChange.bind(this);
    this.handleTableQuery = this.handleTableQuery.bind(this);
    this.emitValue = this.emitValue.bind(this);
    this.tableRef = this.tableRef.bind(this);
    this.flush = this.flush.bind(this);
    this.filterItemIndex = this.filterItemIndex.bind(this);

    if (addHook) {
      this.toDispose.push(addHook(this.flush, 'flush'));
    }
  }

  componentDidUpdate(prevProps: TableProps, prevState: TableState) {
    const props = this.props;
    let toUpdate: any = null;

    // 如果static为true 或 disabled为true，
    // 则删掉正在新增 或 编辑的那一行
    // Form会向FormItem下发disabled属性，disbaled 属性值也需要同步到
    if (
      prevProps.disabled !== props.disabled ||
      prevProps.static !== props.static ||
      props.$schema.disabled !== prevProps.$schema.disabled ||
      props.$schema.static !== prevProps.$schema.static
    ) {
      const items = this.state.items.filter(
        item => !item.hasOwnProperty(PLACE_HOLDER)
      );
      toUpdate = {
        ...toUpdate,
        items,
        ...this.transformState(items),
        editIndex: '',
        columns: this.buildColumns(props)
      };
    }

    if (props.columns !== prevProps.columns) {
      toUpdate = {
        ...toUpdate,
        columns: this.buildColumns(props)
      };
    }

    if (props.value !== prevProps.value && props.value !== this.emittedValue) {
      const items = Array.isArray(props.value) ? props.value.concat() : [];
      toUpdate = {
        ...toUpdate,
        items: items,
        ...this.transformState(items),
        editIndex: ''
      };
    }

    toUpdate && this.setState(toUpdate);
  }

  componentWillUnmount() {
    this.entries.dispose();
    this.lazyEmitValue.cancel();
    this.toDispose.forEach(fn => fn());
    this.toDispose = [];
  }

  transformState(
    items: Array<TableDataItem>,
    state?: Partial<TableState>,
    activeRow?: TableDataItem
  ): Pick<TableState, 'filteredItems' | 'total' | 'page'> {
    const {perPage, matchFunc} = this.props;
    let {query, page} = {...this.state, ...state};
    const {orderBy, orderDir, ...rest} = query ?? {};

    const fields = Object.keys(rest);
    if (fields.length) {
      // apply filters
      items = applyFilters(items, {
        query: rest,
        columns: this.state.columns,
        matchFunc:
          typeof matchFunc === 'string' && matchFunc
            ? str2function(matchFunc, 'items', 'itemsRaw', 'options')
            : typeof matchFunc === 'function'
            ? matchFunc
            : undefined
      });
    }

    if (orderBy) {
      items = sortArray(
        items.concat(),
        orderBy,
        typeof orderDir === 'string' && /desc/i.test(orderDir) ? -1 : 1
      );
    }

    let total = items.length;

    page = Math.min(
      page ?? 1,
      typeof perPage === 'number' ? Math.max(1, Math.ceil(total / perPage)) : 1
    );

    if (activeRow) {
      const index = items.indexOf(activeRow);
      if (~index) {
        page = Math.ceil((index + 1) / perPage!);
      }
    }

    if (typeof perPage === 'number' && perPage && items.length > perPage) {
      items = items.slice((page - 1) * perPage, page * perPage);
    }

    return {
      filteredItems: items,
      page,
      total
    };
  }

  async flush() {
    const subForms: Array<any> = [];
    Object.keys(this.subForms).forEach(
      key => this.subForms[key] && subForms.push(this.subForms[key])
    );
    await Promise.all(subForms.map(item => item.flush()));

    const subFormItems: Array<any> = [];
    Object.keys(this.subFormItems).forEach(
      key => this.subFormItems[key] && subFormItems.push(this.subFormItems[key])
    );
    await Promise.all(subFormItems.map(item => item.props.onFlushChange?.()));

    await this.lazyEmitValue.flush();
  }

  resolveVariableProps(props: TableProps, key: 'minLength' | 'maxLength') {
    const defaultMap = {
      minLength: 0,
      maxLength: Infinity
    };
    let value = props[key];

    if (!value) {
      return defaultMap[key];
    }

    if (typeof value === 'string') {
      if (isPureVariable(value)) {
        const resolved = resolveVariableAndFilter(value, props.data, '| raw');
        value = (
          typeof resolved === 'number' && resolved >= 0
            ? resolved
            : defaultMap[key]
        ) as number;
      } else {
        const parsed = parseInt(value, 10);
        value = (isNaN(parsed) ? defaultMap[key] : parsed) as number;
      }
    }

    return value;
  }

  subFormRef(form: any, x: number, y: number) {
    this.subForms[`${x}-${y}`] = form;
  }

  subFormItemRef(form: any, x: number, y: number) {
    this.subFormItems[`${x}-${y}`] = form;
  }

  async validate(): Promise<string | void> {
    const {value, translate: __, columns} = this.props;
    const minLength = this.resolveVariableProps(this.props, 'minLength');
    const maxLength = this.resolveVariableProps(this.props, 'maxLength');

    // todo: 如果当前正在编辑中，表单提交了，应该先让正在编辑的东西提交然后再做验证。
    if (this.state.editIndex) {
      return __('Table.editing');
    }

    if (minLength && (!Array.isArray(value) || value.length < minLength)) {
      return __('Combo.minLength', {minLength});
    } else if (maxLength && Array.isArray(value) && value.length > maxLength) {
      return __('Combo.maxLength', {maxLength});
    } else {
      const subForms: Array<any> = [];
      Object.keys(this.subForms).forEach(
        key => this.subForms[key] && subForms.push(this.subForms[key])
      );
      if (subForms.length) {
        const results = await Promise.all(
          subForms.map(item => item.validate())
        );

        let msg = ~results.indexOf(false) ? __('Form.validateFailed') : '';
        let uniqueColumn = '';

        if (
          !msg &&
          Array.isArray(columns) &&
          Array.isArray(value) &&
          columns.some(item => {
            if (item.unique && item.name) {
              let exists: Array<any> = [];

              return value.some((obj: any) => {
                const value = getVariable(obj, item.name);

                if (~exists.indexOf(value)) {
                  uniqueColumn = `${item.label || item.name}`;
                  return true;
                }

                exists.push(value);
                return false;
              });
            }

            return false;
          })
        ) {
          msg = __('InputTable.uniqueError', {
            label: uniqueColumn
          });
        }

        if (msg) {
          return msg;
        }
      }
    }

    // 校验子项
    const subFormItemss: Array<any> = [];
    Object.keys(this.subFormItems).forEach(
      key =>
        this.subFormItems[key] && subFormItemss.push(this.subFormItems[key])
    );

    const results = await Promise.all(
      subFormItemss.map(item => item.props.onValidate())
    );
    let msg = ~results.indexOf(false) ? __('Form.validateFailed') : '';
    return msg;
  }

  emittedValue: any = null;
  async emitValue(value?: any[]) {
    const items =
      value ??
      this.state.items.filter(item => !item.hasOwnProperty(PLACE_HOLDER));
    const {onChange} = this.props;
    const isPrevented = await this.dispatchEvent('change');
    if (!isPrevented) {
      this.emittedValue = items;
      onChange?.(items);
    }

    return isPrevented;
  }

  async doAction(action: ActionObject, ctx: RendererData, ...rest: Array<any>) {
    const {
      onAction,
      valueField,
      env,
      needConfirm,
      addable,
      addApi,
      translate: __,
      onChange
    } = this.props;

    const actionType = action.actionType as string;

    if (actionType === 'add') {
      if (addable === false) {
        return;
      }

      const items = this.state.items.concat();

      if (addApi || action.payload) {
        let toAdd = null;

        if (isEffectiveApi(addApi, ctx)) {
          const payload = await env.fetcher(addApi, ctx);
          if (payload && !payload.ok) {
            !(addApi as ApiObject)?.silent &&
              env.notify(
                'error',
                (addApi as ApiObject)?.messages?.failed ??
                  (payload.msg || __('fetchFailed'))
              );
            return;
          } else if (payload && payload.ok) {
            toAdd = payload.data;
          }
        } else {
          toAdd = dataMapping(action.payload, ctx);
        }

        toAdd = Array.isArray(toAdd) ? toAdd : [toAdd];
        toAdd.forEach((toAdd: any) => {
          if (
            !valueField ||
            !find(
              items,
              item => item[valueField as string] == toAdd[valueField as string]
            )
          ) {
            // 不要重复加入
            items.push(toAdd);

            // 加入与addItem同样属性标记为新增项
            if (needConfirm !== false) {
              Reflect.set(toAdd, PLACE_HOLDER, true);
            }
          }
        });

        this.setState(
          {
            items,
            ...this.transformState(items)
          },
          () => {
            if (toAdd.length === 1 && needConfirm !== false) {
              this.startEdit(`${items.length - 1}`, true);
            } else {
              onChange?.(items);
            }
          }
        );

        return;
      } else {
        return this.addItem(`${items.length - 1}`, false);
      }
    } else if (actionType === 'remove' || actionType === 'delete') {
      if (!valueField) {
        return env.alert(__('Table.valueField'));
      } else if (!action.payload) {
        return env.alert(__('Table.playload'));
      }

      let items = this.state.items.concat();
      let toRemove: any = dataMapping(action.payload, ctx);
      toRemove = Array.isArray(toRemove) ? toRemove : [toRemove];

      toRemove.forEach((toRemove: any) => {
        const idex = findTreeIndex(
          items,
          item => item[valueField as string] == toRemove[valueField as string]
        );

        if (idex?.length) {
          items = spliceTree(items, idex, 1);
        }
      });

      this.setState(
        {
          items,
          ...this.transformState(items)
        },
        () => {
          onChange?.(items);
        }
      );

      return;
    } else if (actionType === 'initDrag') {
      this.table.doAction(action, ctx, ...rest);
    } else if (actionType === 'cancelDrag') {
      this.table.doAction(action, ctx, ...rest);
    }
    return onAction && onAction(action, ctx, ...rest);
  }

  async copyItem(index: string) {
    const {needConfirm, data, copyData = {'&': '$$'}} = this.props;
    let items = this.state.items.concat();
    const indexes = index.split('.').map(item => parseInt(item, 10));
    const next = indexes.concat();
    next[next.length - 1] += 1;

    const originItems = items;
    const src = getTree(items, indexes);
    const item = dataMapping(copyData, createObject(data, src));
    if (needConfirm === false) {
      items = spliceTree(items, next, 0, item);
    } else {
      // 复制相当于新增一行
      // 需要同addItem一致添加__placeholder属性
      items = spliceTree(items, next, 0, {
        ...item,
        [PLACE_HOLDER]: true
      });
    }
    this.reUseRowId(items, originItems, next);
    const newRow = items[next[0]];
    const toUpdate = {
      ...this.transformState(items),
      items
    };

    if (!toUpdate.filteredItems.includes(newRow)) {
      // 如果新插入的待编辑的行不在过滤后的列表中，则需要更新过滤后的列表
      const insertAfter = items[indexes[0]];
      const idx = toUpdate.filteredItems.findIndex(
        (a: any) => a === insertAfter
      );
      toUpdate.filteredItems.splice(idx + 1, 0, newRow);
    }

    this.setState(toUpdate, async () => {
      // 派发add事件
      const isPrevented = await this.dispatchEvent('add', {
        index: next[next.length - 1],
        indexPath: next.join('.'),
        item: item
      });
      if (isPrevented) {
        return;
      }
      if (needConfirm === false) {
        this.emitValue();
      } else {
        this.startEdit(next.join('.'), true);
      }
    });
  }

  async addItem(
    index?: string,
    isDispatch: boolean = true,
    callback?: () => void
  ) {
    index = index || `${this.state.items.length - 1}`;
    const {needConfirm, scaffold, columns, data, perPage} = this.props;
    let items = this.state.items.concat();
    let value: TableDataItem = {
      [PLACE_HOLDER]: true
    };

    if (Array.isArray(columns)) {
      columns.forEach(column => {
        if (
          typeof column.value !== 'undefined' &&
          typeof column.name === 'string'
        ) {
          if (
            'type' in column &&
            (column.type === 'input-date' ||
              column.type === 'input-datetime' ||
              column.type === 'input-time' ||
              column.type === 'input-month' ||
              column.type === 'input-quarter' ||
              column.type === 'input-year')
          ) {
            if (
              !(typeof column.value === 'string' && column.value.trim() === '')
            ) {
              const date = filterDate(column.value, data, column.format || 'X');
              setVariable(
                value,
                column.name,
                (column.utc ? moment.utc(date) : date).format(
                  column.format || 'X'
                )
              );
            }
          } else {
            /** 如果value值设置为表达式，则忽略 */
            if (!isExpression(column.value)) {
              setVariable(value, column.name, column.value);
            }
          }
        }
      });
    }

    value = {
      ...value,
      ...scaffold
    };

    if (needConfirm === false) {
      Reflect.deleteProperty(value, PLACE_HOLDER);
    }

    const indexes = index.split('.').map(item => parseInt(item, 10));
    const next = indexes.concat();
    next[next.length - 1] += 1;

    let originHost = items;
    items = spliceTree(items, next, 0, value);
    this.reUseRowId(items, originHost, next);
    const newRow = items[next[0]];

    const toUpdate = {
      items,
      ...this.transformState(items, undefined, newRow),
      // 需要一起修改，state 不能分批次 setState
      // 因为第一步添加成员，单元格的表单项如果有默认值就会触发 onChange
      // 然后 handleTableSave 里面就会执行，因为没有 editIndex 会以为是批量更新 state 后 emitValue
      // 而 emitValue 又会干掉 __isPlaceholder 后 onChange 出去一个新数组，空数组
      // 然后 didUpdate 里面检测到上层 value 变化了，又重置 state，导致新增无效
      // 所以这里直接让 items 和 editIndex 一起调整，这样 handleTableSave 发现有 editIndex 会走不同逻辑，不会触发 emitValue
      ...((needConfirm === false
        ? {}
        : {
            editIndex: next.join('.'),
            isCreateMode: true,
            columns: this.buildColumns(this.props, true, `${index}`)
          }) as any)
    };

    if (!toUpdate.filteredItems.includes(newRow)) {
      // 如果新插入的待编辑的行不在过滤后的列表中，则需要更新过滤后的列表
      const insertAfter = items[indexes[0]];
      const idx = toUpdate.filteredItems.findIndex(
        (a: any) => a === insertAfter
      );
      toUpdate.filteredItems.splice(idx + 1, 0, newRow);
    }

    this.setState(toUpdate, async () => {
      if (isDispatch) {
        // todo: add 无法阻止, state 状态也要还原
        await this.dispatchEvent('add', {
          index: next[next.length - 1],
          indexPath: next.join('.'),
          item: value
        });
      }
      if (needConfirm === false) {
        this.emitValue();
      }

      callback?.();
    });

    // 阻止触发 onAction 动作
    // 因为 footerAddButton 的 onClick 也绑定了这个
    // Action 会先触发 onClick，没被组织就会 onAction
    // 而执行 onAction 的话，dialog 会监控所有的 onAction
    // onAction 过程中会下发 disabled: true
    // 所以重新构建 buildColumns 的结果就是表单项都不可点了
    return false;
  }

  async subAddItem(index?: string, isDispatch: boolean = true, item?: any) {
    return this.addItem(index + '.-1', isDispatch, () => {
      item?.setExpanded(true);
    });
  }

  /**
   * 点击“编辑”按钮
   * @param index 编辑的行索引
   */
  async editItem(index: string) {
    const {items} = this.state;
    const indexes = index.split('.').map(item => parseInt(item, 10));
    const item = getTree(items, indexes);
    const isPrevented = await this.dispatchEvent('edit', {
      index: indexes[indexes.length - 1],
      indexPath: indexes.join('.'),
      item
    });
    !isPrevented && this.startEdit(index, true);
  }

  /**
   * 派发事件
   * @param eventName 事件名称
   * @param eventData 事件数据
   * @returns
   */
  async dispatchEvent(eventName: string, eventData: any = {}) {
    const {dispatchEvent} = this.props;
    const {items, rowIndex} = this.state;
    const rendererEvent = await dispatchEvent(
      eventName,
      resolveEventData(this.props, {
        value: [...items],
        rowIndex,
        ...eventData
      })
    );

    return !!rendererEvent?.prevented;
  }

  startEdit(index: string, isCreate: boolean = false) {
    this.setState({
      editIndex: index,
      isCreateMode: isCreate,
      columns: this.buildColumns(this.props, isCreate, index)
    });
  }

  async confirmEdit() {
    const {addApi, updateApi, data, env, translate: __} = this.props;

    // form 是 lazyChange 的，先让他们 flush, 即把未提交的数据提交。
    const subForms: Array<any> = [];
    Object.keys(this.subForms).forEach(
      key => this.subForms[key] && subForms.push(this.subForms[key])
    );
    subForms.forEach(form => form.flush());

    const subFormItems: Array<any> = [];
    Object.keys(this.subFormItems).forEach(
      key => this.subFormItems[key] && subFormItems.push(this.subFormItems[key])
    );
    subFormItems.forEach(item => item.props.onFlushChange?.());

    const validateForms: Array<any> = subForms;

    const results = await Promise.all(
      validateForms
        .map(item => item.validate())
        .concat(subFormItems.map(item => item.props.onValidate()))
    );

    // 有校验不通过的
    if (~results.indexOf(false)) {
      return;
    }

    let items = this.state.items.concat();
    const indexes = this.state.editIndex
      .split('.')
      .map(item => parseInt(item, 10));

    let item = {
      ...getTree(items, indexes)
    };
    const isNew = item.hasOwnProperty(PLACE_HOLDER);
    const confirmEventName = isNew ? 'addConfirm' : 'editConfirm';
    let isPrevented = await this.dispatchEvent(confirmEventName, {
      index: indexes[indexes.length - 1],
      indexPath: indexes.join('.'),
      item
    });
    if (isPrevented) {
      return;
    }

    let remote: Payload | null = null;
    let apiMsg = undefined;
    if (isNew && isEffectiveApi(addApi, createObject(data, item))) {
      remote = await env.fetcher(addApi, createObject(data, item));
      apiMsg = (addApi as ApiObject)?.messages?.failed;
    } else if (!isNew && isEffectiveApi(updateApi, createObject(data, item))) {
      remote = await env.fetcher(updateApi, createObject(data, item));
      apiMsg = (updateApi as ApiObject)?.messages?.failed;
    }

    if (remote && !remote.ok) {
      !((isNew ? addApi : updateApi) as ApiObject)?.silent &&
        env.notify('error', apiMsg ?? (remote.msg || __('saveFailed')));
      const failEventName = isNew ? 'addFail' : 'editFail';
      this.dispatchEvent(failEventName, {
        index: indexes[indexes.length - 1],
        indexPath: indexes.join('.'),
        item,
        error: remote
      });
      return;
    } else if (remote && remote.ok) {
      item = {
        ...(((isNew ? addApi : updateApi) as ApiObject).replaceData
          ? {}
          : item),
        ...remote.data
      };
    }

    Reflect.deleteProperty(item, PLACE_HOLDER);

    const originItems = items;
    items = spliceTree(items, indexes, 1, item);
    this.reUseRowId(items, originItems, indexes);

    this.setState(
      {
        editIndex: '',
        items: items,
        ...this.transformState(items),
        columns: this.buildColumns(this.props)
      },
      async () => {
        const isPrevented = await this.emitValue();
        if (isPrevented) {
          return;
        }
        const successEventName = isNew ? 'addSuccess' : 'editSuccess';
        this.dispatchEvent(successEventName, {
          index: indexes[indexes.length - 1],
          indexPath: indexes.join('.'),
          item
        });
      }
    );
  }

  cancelEdit() {
    let items = this.state.items.concat();
    const lastModifiedRow = this.state.lastModifiedRow;
    const indexes = this.state.editIndex
      .split('.')
      .map(item => parseInt(item, 10));

    let item = {
      ...getTree(items, indexes)
    };
    const isNew = item.hasOwnProperty(PLACE_HOLDER);

    const originItems = items;
    if (isNew) {
      items = spliceTree(items, indexes, 1);
    } else {
      /** 恢复编辑前的值 */
      if (
        lastModifiedRow &&
        ~lastModifiedRow?.index &&
        isObject(lastModifiedRow?.data)
      ) {
        items = spliceTree(items, indexes, 1, {
          ...item,
          ...lastModifiedRow.data
        });
      }
    }
    this.reUseRowId(items, originItems, indexes);

    this.setState(
      {
        editIndex: '',
        items: items,
        ...this.transformState(items),
        columns: this.buildColumns(this.props),
        lastModifiedRow: undefined
      },
      this.emitValue
    );
  }

  async removeItem(index: string) {
    const {
      value,
      onChange,
      deleteApi,
      deleteConfirmText,
      env,
      data,
      translate: __
    } = this.props;

    let newValue = Array.isArray(value) ? value.concat() : [];
    const indexes = index.split('.').map(item => parseInt(item, 10));
    const item = getTree(newValue, indexes);

    if (!item) {
      return;
    }

    let isPrevented = await this.dispatchEvent('delete', {
      index: indexes[indexes.length - 1],
      indexPath: indexes.join('.'),
      item
    });
    if (isPrevented) {
      return;
    }

    const ctx = createObject(data, item);
    if (isEffectiveApi(deleteApi, ctx)) {
      const confirmed = await env.confirm(
        deleteConfirmText ? filter(deleteConfirmText, ctx) : __('deleteConfirm')
      );
      if (!confirmed) {
        // 如果不确认，则跳过！
        return;
      }

      const result = await env.fetcher(deleteApi, ctx);

      if (!result.ok) {
        !(deleteApi as ApiObject)?.silent &&
          env.notify(
            'error',
            (deleteApi as ApiObject)?.messages?.failed ??
              (result.msg || __('deleteFailed'))
          );
        this.dispatchEvent('deleteFail', {
          index: indexes[indexes.length - 1],
          indexPath: indexes.join('.'),
          item,
          error: result
        });
        return;
      }
    }

    this.removeEntry(item);
    const originItems = newValue;
    newValue = spliceTree(newValue, indexes, 1);
    this.reUseRowId(newValue, originItems, indexes);

    this.setState(
      {
        items: newValue,
        ...this.transformState(newValue)
      },
      async () => {
        // change value
        const prevented = await this.emitValue(newValue);
        if (prevented) {
          return;
        }

        this.dispatchEvent('deleteSuccess', {
          value: newValue,
          index: indexes[indexes.length - 1],
          indexPath: indexes.join('.'),
          item
        });
      }
    );
  }

  convertToRawPath(path: string, state?: Partial<TableState>) {
    const {filteredItems, items} = {...this.state, ...state};
    const list = `${path}`.split('.').map((item: any) => parseInt(item, 10));
    const firstRow = filteredItems[list[0]];
    list[0] = items.findIndex(item => item === firstRow);
    if (list[0] === -1) {
      return path;
    }
    return list.join('.');
  }

  reUseRowId(
    items: Array<any>,
    originItems: Array<any>,
    indexes: Array<number>
  ) {
    //  row 不能换 id，否则会重新渲染，导致编辑状态丢失
    // 展开状态也会丢失
    let originHost = originItems;
    let host = items;
    for (let i = 0, len = indexes.length; i < len; i++) {
      const idx = indexes[i];
      if (!originHost?.[idx] || !host?.[idx]) {
        break;
      }
      this.entries.set(
        host[idx],
        this.entries.get(originHost[idx]) || this.entityId++
      );
      this.entries.delete(originHost[idx]);
      host = host[idx].children;
      originHost = originHost[idx].children;
    }
  }

  buildItemProps(item: any, index: number) {
    const rowProps: any = {};

    const minLength = this.resolveVariableProps(this.props, 'minLength');
    const maxLength = this.resolveVariableProps(this.props, 'maxLength');

    rowProps.inputTableCanAddItem = maxLength
      ? maxLength > this.state.items.length
      : true;
    rowProps.inputTableCanRemoveItem = minLength
      ? minLength < this.state.items.length
      : true;

    if (this.props.needConfirm === false) {
      rowProps.quickEditEnabled = true;
      return rowProps;
    } else if (
      !this.props.static &&
      !this.props.editable &&
      !this.props.addable &&
      !this.state.isCreateMode
    ) {
      return rowProps;
    }

    rowProps.quickEditEnabled =
      this.state.editIndex === this.convertToRawPath(item.path);

    /**
     * 非编辑态使用静态展示
     * 编辑态仅当前编辑行使用静态展示
     */
    if (this.props.enableStaticTransform && this.props.needConfirm !== false) {
      rowProps.static = !rowProps.quickEditEnabled;
    }

    return rowProps;
  }

  buildColumns(
    props: TableProps,
    isCreateMode = false,
    editRowIndex?: string
  ): Array<any> {
    const {env, mobileUI, testIdBuilder} = this.props;
    let columns: Array<any> = Array.isArray(props.columns)
      ? props.columns.concat()
      : [];
    const ns = this.props.classPrefix;
    const __ = this.props.translate;
    const needConfirm = this.props.needConfirm;
    const isStatic = this.props.static;
    const disabled = this.props.disabled;

    let btns = [];
    if (!isStatic && props.addable && props.showTableAddBtn !== false) {
      btns.push({
        children: ({
          key,
          rowIndexPath,
          inputTableCanAddItem
        }: {
          key: any;
          rowIndexPath: string;
          inputTableCanAddItem: boolean;
          inputTableCanRemoveItem: boolean;
        }) =>
          (this.state.editIndex && needConfirm !== false) ||
          !inputTableCanAddItem ? null : (
            <Button
              classPrefix={ns}
              size="sm"
              key={key}
              level="link"
              tooltip={__('Table.addRow')}
              tooltipContainer={props.popOverContainer || env.getModalContainer}
              disabled={disabled}
              onClick={this.addItem.bind(
                this,
                this.convertToRawPath(rowIndexPath),
                undefined,
                undefined
              )}
              testIdBuilder={testIdBuilder?.getChild(
                `addRow-${this.convertToRawPath(rowIndexPath)}`
              )}
            >
              {props.addBtnIcon ? (
                <Icon
                  cx={props.classnames}
                  icon={props.addBtnIcon}
                  className="icon"
                />
              ) : null}
              {props.addBtnLabel ? <span>{props.addBtnLabel}</span> : null}
            </Button>
          )
      });
    }

    if (!isStatic && props.childrenAddable && props.showTableAddBtn !== false) {
      btns.push({
        children: ({
          key,
          rowIndexPath,
          row
        }: {
          key: any;
          rowIndexPath: string;
          row: any;
        }) =>
          this.state.editIndex && needConfirm !== false ? null : (
            <Button
              classPrefix={ns}
              size="sm"
              key={key}
              level="link"
              tooltip={__('Table.subAddRow')}
              tooltipContainer={props.popOverContainer || env.getModalContainer}
              disabled={disabled}
              onClick={this.subAddItem.bind(
                this,
                this.convertToRawPath(rowIndexPath),
                undefined,
                row
              )}
              testIdBuilder={testIdBuilder?.getChild(
                `subAddRow-${this.convertToRawPath(rowIndexPath)}`
              )}
            >
              {props.subAddBtnIcon ? (
                <Icon
                  cx={props.classnames}
                  icon={props.subAddBtnIcon}
                  className="icon"
                />
              ) : null}
              {props.subAddBtnLabel ? (
                <span>{props.subAddBtnLabel}</span>
              ) : null}
            </Button>
          )
      });
    }

    if (!isStatic && props.copyable && props.showCopyBtn !== false) {
      btns.push({
        children: ({key, rowIndexPath}: {key: any; rowIndexPath: string}) =>
          this.state.editIndex && needConfirm !== false ? null : (
            <Button
              classPrefix={ns}
              size="sm"
              key={key}
              level="link"
              tooltip={__('Table.copyRow')}
              tooltipContainer={props.popOverContainer || env.getModalContainer}
              disabled={disabled}
              onClick={this.copyItem.bind(
                this,
                this.convertToRawPath(rowIndexPath),
                undefined
              )}
              testIdBuilder={testIdBuilder?.getChild(
                `copyRow-${this.convertToRawPath(rowIndexPath)}`
              )}
            >
              {props.copyBtnIcon ? (
                <Icon
                  cx={props.classnames}
                  icon={props.copyBtnIcon}
                  className="icon"
                />
              ) : null}
              {props.copyBtnLabel ? <span>{props.copyBtnLabel}</span> : null}
            </Button>
          )
      });
    }

    if (props.needConfirm === false) {
      columns = columns.map(column => {
        const quickEdit = column.quickEdit;

        return quickEdit === false
          ? omit(column, ['quickEdit'])
          : {
              ...column,
              ...(column.type === 'operation'
                ? {}
                : {
                    quickEdit: {
                      ...this.columnToQuickEdit(column),
                      ...quickEdit,
                      // 因为列本身已经做过显隐判断了，单元格不应该再处理
                      visibleOn: '',
                      hiddenOn: '',
                      visible: true,
                      hidden: false,
                      saveImmediately: true,
                      mode: 'inline',
                      disabled,
                      static: isStatic || column.static
                    }
                  })
            };
      });
    } else if (
      isStatic !== true &&
      (props.addable || props.editable || isCreateMode)
    ) {
      columns = columns.map((column, index) => {
        const quickEdit =
          !isCreateMode && column.hasOwnProperty('quickEditOnUpdate')
            ? column.quickEditOnUpdate
            : column.quickEdit;

        const render = getRendererByName(column?.type);

        return {
          ...(quickEdit === false
            ? omit(column, ['quickEdit'])
            : {
                ...column,
                quickEdit: {
                  ...this.columnToQuickEdit(column),
                  ...quickEdit,
                  // 因为列本身已经做过显隐判断了，单元格不应该再处理
                  visibleOn: '',
                  hiddenOn: '',
                  visible: true,
                  hidden: false,
                  isQuickEditFormMode: !!render?.isFormItem,
                  saveImmediately: true,
                  mode: 'inline',
                  disabled
                }
              })
        };
      });

      !isStatic &&
        props.editable &&
        btns.push({
          children: ({
            key,
            rowIndexPath,
            data
          }: {
            key: any;
            rowIndexPath: string;
            data: any;
          }) =>
            this.state.editIndex ||
            (data && data.hasOwnProperty(PLACE_HOLDER)) ? null : (
              <Button
                classPrefix={ns}
                size="sm"
                key={key}
                level="link"
                tooltip={__('Table.editRow')}
                tooltipContainer={
                  props.popOverContainer || env.getModalContainer
                }
                disabled={disabled}
                onClick={() =>
                  this.editItem(this.convertToRawPath(rowIndexPath))
                }
                testIdBuilder={testIdBuilder?.getChild(
                  `editRow-${this.convertToRawPath(rowIndexPath)}`
                )}
              >
                {/* 兼容之前的写法 */}
                {typeof props.updateBtnIcon !== 'undefined' ? (
                  props.updateBtnIcon ? (
                    <Icon
                      cx={props.classnames}
                      icon={props.updateBtnIcon}
                      className="icon"
                    />
                  ) : null
                ) : props.editBtnIcon ? (
                  <Icon
                    cx={props.classnames}
                    icon={props.editBtnIcon}
                    className="icon"
                  />
                ) : null}
                {props.updateBtnLabel || props.editBtnLabel ? (
                  <span>{props.updateBtnLabel || props.editBtnLabel}</span>
                ) : null}
              </Button>
            )
        });

      !isStatic &&
        btns.push({
          children: ({key, rowIndexPath}: {key: any; rowIndexPath: string}) =>
            this.state.editIndex === this.convertToRawPath(rowIndexPath) ? (
              <Button
                classPrefix={ns}
                size="sm"
                key={key}
                level="link"
                tooltip={__('save')}
                tooltipContainer={
                  props.popOverContainer || env.getModalContainer
                }
                onClick={this.confirmEdit}
                testIdBuilder={testIdBuilder?.getChild(
                  `confirmRow-${this.convertToRawPath(rowIndexPath)}`
                )}
              >
                {props.confirmBtnIcon ? (
                  <Icon
                    cx={props.classnames}
                    icon={props.confirmBtnIcon}
                    className="icon"
                  />
                ) : null}
                {props.confirmBtnLabel ? (
                  <span>{props.confirmBtnLabel}</span>
                ) : null}
              </Button>
            ) : null
        });

      !isStatic &&
        btns.push({
          children: ({key, rowIndexPath}: {key: any; rowIndexPath: string}) =>
            this.state.editIndex === this.convertToRawPath(rowIndexPath) ? (
              <Button
                classPrefix={ns}
                size="sm"
                key={key}
                level="link"
                tooltip={__('cancel')}
                tooltipContainer={
                  props.popOverContainer || env.getModalContainer
                }
                onClick={this.cancelEdit}
                testIdBuilder={testIdBuilder?.getChild(
                  `cancelRow-${this.convertToRawPath(rowIndexPath)}`
                )}
              >
                {props.cancelBtnIcon ? (
                  <Icon
                    cx={props.classnames}
                    icon={props.cancelBtnIcon}
                    className="icon"
                  />
                ) : null}
                {props.cancelBtnLabel ? (
                  <span>{props.cancelBtnLabel}</span>
                ) : null}
              </Button>
            ) : null
        });
    } else {
      columns = columns.map(column => {
        const render = getRendererByName(column?.type);
        if (!!render?.isFormItem) {
          return {
            ...column,
            quickEdit: {
              ...column,
              // 因为列本身已经做过显隐判断了，单元格不应该再处理
              visibleOn: '',
              hiddenOn: '',
              visible: true,
              hidden: false,
              isFormMode: true
            }
          };
        }
        return column;
      });
    }

    if (!isStatic && props.removable) {
      btns.push({
        children: ({
          key,
          rowIndexPath,
          data,
          inputTableCanRemoveItem
        }: {
          key: any;
          rowIndexPath: string;
          data: any;
          inputTableCanRemoveItem: boolean;
        }) =>
          ((this.state.editIndex ||
            (data && data.hasOwnProperty(PLACE_HOLDER))) &&
            needConfirm !== false) ||
          !inputTableCanRemoveItem ? null : (
            <Button
              classPrefix={ns}
              size="sm"
              key={key}
              level="link"
              tooltip={__('Table.deleteRow')}
              tooltipContainer={props.popOverContainer || env.getModalContainer}
              disabled={disabled}
              onClick={this.removeItem.bind(
                this,
                this.convertToRawPath(rowIndexPath)
              )}
              testIdBuilder={testIdBuilder?.getChild(
                `delRow-${this.convertToRawPath(rowIndexPath)}`
              )}
            >
              {props.deleteBtnIcon ? (
                <Icon
                  cx={props.classnames}
                  icon={props.deleteBtnIcon}
                  className="icon"
                />
              ) : null}
              {props.deleteBtnLabel ? (
                <span>{props.deleteBtnLabel}</span>
              ) : null}
            </Button>
          )
      });
    }

    if (btns.length) {
      let idx = columns.findIndex(item => item.type === 'operation');
      let operation = columns[idx];

      if (idx === -1) {
        operation = {
          type: 'operation',
          buttons: [],
          label: __('Table.operation'),
          className: 'v-middle nowrap',
          fixed: mobileUI ? '' : 'right', // 移动端不开启固定列
          width: 150,
          innerClassName: 'm-n'
        };
        columns.push(operation);
      } else {
        operation = {
          ...operation
        };
        columns.splice(idx, 1, operation);
      }

      operation.buttons = Array.isArray(operation.buttons)
        ? operation.buttons.concat()
        : [];
      operation.buttons.unshift.apply(operation.buttons, btns);

      if (operation.hasOwnProperty('quickEdit')) {
        delete operation.quickEdit;
      }
    }

    return columns;
  }

  columnToQuickEdit(column: any) {
    const quickEdit: any = {
      type: 'input-text'
    };

    if (
      getRendererByName(column?.type)?.isFormItem ||
      ~['group'].indexOf(column.type)
    ) {
      return {
        ...column,
        label: ''
      };
    }

    return quickEdit;
  }

  handleTableSave(
    rows: Array<object> | object,
    diff: Array<object> | object,
    rowIndexes: Array<string> | string
  ) {
    let callback: any;
    // 这里有可能执行频率非常高，上次的变更还没结束就会再次进来，会拿不到最新的数据
    // https://legacy.reactjs.org/docs/state-and-lifecycle.html#state-updates-may-be-asynchronous
    this.setState(
      (state, props) => {
        const newState = {};
        const editIndex = state.editIndex;
        const lastModifiedRow = state.lastModifiedRow;
        let items = state.items.concat();

        if (Array.isArray(rows)) {
          (rowIndexes as Array<string>).forEach((rowIndex, index) => {
            rowIndex = this.convertToRawPath(rowIndex, state);
            const indexes = rowIndex.split('.').map(item => parseInt(item, 10));
            // const origin = getTree(items, indexes);
            const data = {
              ...getTree(rows, indexes)
            };

            items = spliceTree(items, indexes, 1, data);
          });
        } else {
          rowIndexes = this.convertToRawPath(rowIndexes as string, state);

          // 修改当前正在编辑的行
          if (editIndex && rowIndexes === editIndex) {
            const indexes = editIndex
              .split('.')
              .map(item => parseInt(item, 10));
            let items = state.items.concat();
            const origin = getTree(items, indexes);

            if (!origin) {
              return newState;
            }

            const value: any = {
              ...rows
            };
            const originItems = items;
            items = spliceTree(items, indexes, 1, value);
            this.reUseRowId(items, originItems, indexes);

            Object.assign(newState, {
              items,
              filteredItems: state.filteredItems.map(a =>
                a === origin ? value : a
              ),
              rowIndex: editIndex,
              /** 记录最近一次编辑记录，用于取消编辑数据回溯， */
              ...(lastModifiedRow?.index === editIndex
                ? {}
                : {
                    lastModifiedRow: origin.hasOwnProperty(PLACE_HOLDER)
                      ? undefined
                      : {index: editIndex, data: {...origin}}
                  })
            });
            return newState;
          }

          const indexes = (rowIndexes as string)
            .split('.')
            .map(item => parseInt(item, 10));

          // const origin = getTree(items, indexes);

          const data = {...rows};

          const originItems = items;
          items = spliceTree(items, indexes, 1, data);
          this.reUseRowId(items, originItems, indexes);
        }

        Object.assign(newState, {
          items,
          rowIndex: rowIndexes as string,
          ...this.transformState(items, state)
        });
        callback = this.lazyEmitValue;

        return newState;
      },
      () => {
        callback && callback();
      }
    );
  }

  handleRadioChange(
    cxt: any,
    {name, row, trueValue = true, falseValue = false}: any
  ) {
    let callback: any;

    // 这里有可能执行频率非常高，上次的变更还没结束就会再次进来，会拿不到最新的数据
    // https://legacy.reactjs.org/docs/state-and-lifecycle.html#state-updates-may-be-asynchronous
    this.setState(
      (state, props) => {
        const path: string = row.path;
        const items = mapTree(
          state.items,
          (item: any, index, level, paths, indexes) => ({
            ...item,
            [name]: path === indexes.join('.') ? trueValue : falseValue
          })
        );
        callback = state.editIndex == row.path ? undefined : this.lazyEmitValue;
        return {
          items,
          ...this.transformState(items)
        };
      },
      () => {
        callback?.();
      }
    );

    return false;
  }

  handleSaveTableOrder(moved: Array<object>, rows: Array<object>) {
    const {onChange} = this.props;

    onChange(rows.map((item: object) => ({...item})));
  }

  handlePageChange(page: number) {
    this.setState({
      ...this.transformState(this.state.items, {page})
    });
  }

  handleTableQuery(query: any): any {
    query = {...this.state.query, ...query};
    this.setState({
      query,
      ...this.transformState(this.state.items, {query})
    });
  }

  /**
   * Table Row中数据更新到InputTable中
   * 解决columns形如[{name: 'a'}, {name: 'c', value: '${a}'}]时，使用默认值的列数据无法更新到数据域的问题
   *
   * @param data 行数据
   * @param rowIndex 行索引值
   */
  @autobind
  handlePristineChange(data: Record<string, any>, rowIndex: string) {
    const {needConfirm} = this.props;
    const indexes = rowIndex.split('.').map(item => parseInt(item, 10));

    this.setState(
      prevState => {
        let items = prevState.items.concat();
        const origin = getTree(items, indexes);
        const value = {
          ...origin,
          ...data
        };

        const originItems = items;
        items = spliceTree(items, indexes, 1, value);
        this.reUseRowId(items, originItems, indexes);

        return {
          items,
          ...this.transformState(items)
        };
      },
      () => {
        if (needConfirm === false) {
          this.emitValue();
        }
      }
    );
  }

  removeEntry(entry: any) {
    if (this.entries.has(entry)) {
      this.entries.delete(entry);
    }
  }

  getEntryId(entry: any) {
    if (!this.entries.has(entry)) {
      this.entries.set(entry, this.entityId++);
    }

    return String(this.entries.get(entry));
  }

  tableRef(ref: any) {
    while (ref && ref.getWrappedInstance) {
      ref = ref.getWrappedInstance();
    }
    this.table = ref;
  }

  computedAddBtnDisabled() {
    const {disabled} = this.props;
    return disabled || !!this.state.editIndex;
  }

  filterItemIndex(index: number | string) {
    return this.convertToRawPath(index as string);
  }

  render() {
    const {
      className,
      style,
      value,
      disabled,
      render,
      placeholder,
      draggable,
      addable,
      columnsTogglable,
      combineNum,
      combineFromIndex,
      translate: __,
      canAccessSuperData,
      expandConfig,
      affixRow,
      prefixRow,
      formInited,
      perPage,
      classnames: cx,
      rowClassName,
      rowClassNameExpr,
      affixHeader = false,
      autoFillHeight = false,
      tableContentClassName,
      static: isStatic,
      showFooterAddBtn,
      footerAddBtn,
      toolbarClassName,
      onEvent,
      testIdBuilder,
      showIndex
    } = this.props;
    const maxLength = this.resolveVariableProps(this.props, 'maxLength');

    if (formInited === false) {
      return null;
    }

    const query = this.state.query;
    const filteredItems = this.state.filteredItems;
    const items = this.state.items;
    let showPager = typeof perPage === 'number';
    let page = this.state.page || 1;

    // 底部新增按钮是否显示
    const footerAddBtnVisible =
      !isStatic &&
      addable &&
      showFooterAddBtn !== false &&
      (!maxLength || maxLength > this.state.items.length);

    return (
      <div className={cx('InputTable', className)}>
        {render(
          'body',
          {
            type: 'table',
            placeholder: __(placeholder),
            columns: this.state.columns,
            affixHeader,
            prefixRow,
            affixRow,
            autoFillHeight,
            tableContentClassName,
            onEvent,
            showIndex
          },
          {
            ref: this.tableRef,
            value: undefined,
            saveImmediately: true,
            disabled,
            draggable: draggable && !this.state.editIndex,
            items: filteredItems,
            getEntryId: this.getEntryId,
            reUseRow: 'match', // 寻找 id 相同的行，更新数据
            onSave: this.handleTableSave,
            onRadioChange: this.handleRadioChange,
            onSaveOrder: this.handleSaveTableOrder,
            buildItemProps: this.buildItemProps,
            quickEditFormRef: this.subFormRef,
            quickEditFormItemRef: this.subFormItemRef,
            columnsTogglable: columnsTogglable,
            combineNum: this.state.editIndex ? 0 : combineNum,
            combineFromIndex: combineFromIndex,
            expandConfig,
            canAccessSuperData,
            rowClassName,
            rowClassNameExpr,
            onPristineChange: this.handlePristineChange,
            testIdBuilder: testIdBuilder?.getChild('table'),
            onQuery: this.handleTableQuery,
            query: query,
            orderBy: query?.orderBy,
            orderDir: query?.orderDir,
            filterItemIndex: this.filterItemIndex
          }
        )}
        {footerAddBtnVisible || showPager ? (
          <div className={cx('InputTable-toolbar', toolbarClassName)}>
            {footerAddBtnVisible
              ? render(
                  'button',
                  {
                    type: 'button',
                    level: 'primary',
                    size: 'sm',
                    label: __('Table.add'),
                    icon: 'fa fa-plus',
                    disabledTip: __('Table.addButtonDisabledTip'),
                    ...((footerAddBtn as any) || {})
                  },
                  {
                    disabled: this.computedAddBtnDisabled(),
                    onClick: () => this.addItem(),
                    testIdBuilder: testIdBuilder?.getChild('add')
                  }
                )
              : null}

            {showPager
              ? render(
                  'pager',
                  {
                    type: 'pagination'
                  },
                  {
                    activePage: page,
                    perPage,
                    total: this.state.total,
                    onPageChange: this.handlePageChange,
                    className: 'InputTable-pager',
                    testIdBuilder: testIdBuilder?.getChild('page'),
                    disabled: !!this.state.editIndex
                  }
                )
              : null}
          </div>
        ) : null}
      </div>
    );
  }
}

@FormItem({
  type: 'input-table'
})
export class TableControlRenderer extends FormTable {
  async setData(
    value: any,
    replace?: boolean,
    index?: number | string,
    condition?: any
  ) {
    if (index !== undefined) {
      let items = [...this.state.items];
      const indexs = String(index).split(',');
      indexs.forEach(i => {
        const indexes = i.split('.').map(item => parseInt(item, 10));

        const originItems = items;
        items = spliceTree(
          items,
          indexes,
          1,
          replace ? value : {...getTree(items, indexes), ...value}
        );
        this.reUseRowId(items, originItems, indexes);
      });
      this.setState({items, ...this.transformState(items)}, () => {
        this.emitValue();
      });
    } else if (condition !== undefined) {
      let items = [...this.state.items];

      const promises: Array<() => Promise<any>> = [];
      everyTree(items, (item, index, level, paths, indexes) => {
        promises.unshift(async () => {
          const isUpdate = await evalExpressionWithConditionBuilderAsync(
            condition,
            item
          );

          if (isUpdate) {
            const originItems = items;
            items = spliceTree(
              items,
              [...indexes, index],
              1,
              replace
                ? value
                : {...getTree(items, [...indexes, index]), ...value}
            );
            this.reUseRowId(items, originItems, [...indexes, index]);
          }
        });

        return true;
      });
      await Promise.all(promises.map(fn => fn()));

      this.setState({items, ...this.transformState(items)}, () => {
        this.emitValue();
      });
    } else {
      // 如果setValue动作没有传入index，则直接替换组件数据
      const items = [...value];
      this.setState(
        {
          items: items,
          ...this.transformState(items)
        },
        () => {
          this.emitValue();
        }
      );
    }
  }

  async doAction(
    action: ListenerAction | ActionObject,
    data: any,
    throwErrors: boolean = false,
    args?: any
  ) {
    const {
      valueField,
      env,
      needConfirm,
      addable,
      addApi,
      deleteApi,
      resetValue,
      translate: __,
      onChange,
      formStore,
      store,
      name
    } = this.props;

    const actionType = action.actionType as string;
    const ctx = this.props.store?.data || {}; // 获取当前上下文数据

    if (actionType === 'addItem') {
      let items = this.state.items.concat();

      if (addApi || args) {
        let toAdd: any = null;

        if (isEffectiveApi(addApi, ctx)) {
          const payload = await env.fetcher(addApi, ctx);
          if (payload && !payload.ok) {
            !(addApi as ApiObject)?.silent &&
              env.notify(
                'error',
                (addApi as ApiObject)?.messages?.failed ??
                  (payload.msg || __('fetchFailed'))
              );
            return;
          } else if (payload && payload.ok) {
            toAdd = payload.data;
          }
        } else {
          toAdd = args.item;
        }

        toAdd = (Array.isArray(toAdd) ? toAdd : [toAdd]).filter(
          a =>
            !valueField ||
            !find(
              items,
              item => item[valueField as string] == a[valueField as string]
            )
        );

        let indexes: Array<number> = [];
        if (
          typeof args.index === 'string' &&
          /^\d+(\.\d+)*$/.test(args.index)
        ) {
          indexes = (args.index as string).split('.').map(i => parseInt(i, 10));
        } else if (typeof args.index === 'number') {
          indexes = [args.index];
        }

        if (indexes.length) {
          items = spliceTree(items, indexes, 0, ...toAdd);
        } else {
          // 没有指定默认插入在最后
          items.push(...toAdd);
        }

        this.setState(
          {
            items,
            ...this.transformState(items)
          },
          () => {
            if (toAdd.length === 1 && needConfirm !== false) {
              const next = indexes.concat();
              next[next.length - 1] += 1;
              this.startEdit(next.join('.'), true);
            } else {
              onChange?.(items);
            }
          }
        );
        return;
      } else {
        return this.addItem(`${items.length - 1}`, false);
      }
    } else if (actionType === 'deleteItem') {
      let items = [...this.state.items];
      const deletedItems: any = [];

      if (args?.index !== undefined) {
        String(args.index)
          .split(',')
          .map(i => i.split('.').map(item => parseInt(item, 10)))
          // 从右向左遍历，这样才不会出现索引失效
          .sort((a, b) => {
            const len = Math.max(a.length, b.length);
            for (let i = 0; i < len; i++) {
              const aVal = a[i] || 0;
              const bVal = b[i] || 0;
              if (aVal !== bVal) {
                return bVal - aVal;
              }
            }
            return 0;
          })
          .forEach(indexes => {
            deletedItems.push(getTree(items, indexes));
            items = spliceTree(items, indexes, 1);
          });
      } else if (args?.condition !== undefined) {
        const promises: Array<() => Promise<any>> = [];
        everyTree(items, (item, index, level, paths, indexes) => {
          // 查看everyTree定义，indexes 是第五个参数才对
          promises.unshift(async () => {
            const result = await evalExpressionWithConditionBuilderAsync(
              args?.condition,
              item
            );

            if (result) {
              deletedItems.push(item);
              // 进行splice时应该把自己这一层的index也传进去
              items = spliceTree(items, [...indexes, index], 1);
            }
          });

          return true;
        });
        await promises.reduce((p, fn) => p.then(fn), Promise.resolve());
      }

      // 删除api
      if (isEffectiveApi(deleteApi, createObject(ctx, {deletedItems}))) {
        const payload = await env.fetcher(
          deleteApi,
          createObject(ctx, {deletedItems})
        );
        if (payload && !payload.ok) {
          !(deleteApi as ApiObject)?.silent &&
            env.notify(
              'error',
              (deleteApi as ApiObject)?.messages?.failed ??
                (payload.msg || __('fetchFailed'))
            );
          return;
        }
      }
      this.setState(
        {
          items: items,
          ...this.transformState(items)
        },
        () => {
          onChange?.(items);
        }
      );
      return;
    } else if (actionType === 'clear') {
      this.setState(
        {
          items: []
        },
        () => {
          onChange?.([]);
        }
      );
      return;
    } else if (actionType === 'reset') {
      const pristineVal =
        getVariable(formStore?.pristine ?? store?.pristine, name) ?? resetValue;
      const newItems = Array.isArray(pristineVal) ? pristineVal : [];
      this.setState(
        {
          items: newItems,
          ...this.transformState(newItems)
        },
        () => {
          onChange?.(newItems);
        }
      );
      return;
    }
    return super.doAction(action as ActionObject, data, throwErrors, ctx);
  }
}
