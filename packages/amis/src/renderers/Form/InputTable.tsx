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
  ITableStore,
  generateIcon,
  isPureVariable,
  resolveVariableAndFilter,
  getRendererByName,
  resolveEventData,
  ListenerAction,
  evalExpressionWithConditionBuilder
} from 'amis-core';
import {Button, Icon} from 'amis-ui';
import omit from 'lodash/omit';
import findIndex from 'lodash/findIndex';
import cloneDeep from 'lodash/cloneDeep';
import isEqual from 'lodash/isEqual';
import inRange from 'lodash/inRange';
import {TableSchema} from '../Table';
import {SchemaApi, SchemaCollection} from '../../Schema';
import find from 'lodash/find';
import moment from 'moment';
import merge from 'lodash/merge';
import mergeWith from 'lodash/mergeWith';

import type {SchemaTokenizeableString} from '../../Schema';

export interface TableControlSchema
  extends FormBaseControl,
    Omit<TableSchema, 'type'> {
  type: 'input-table';

  /**
   * 可新增
   */
  addable?: boolean;

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
}

export interface TableProps
  extends FormControlProps,
    Omit<
      TableControlSchema,
      'type' | 'className' | 'descriptionClassName' | 'inputClassName'
    > {}

export interface TableState {
  items: Array<any>;
  columns: Array<any>;
  editIndex: number;
  isCreateMode?: boolean;
  page?: number;
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

export default class FormTable extends React.Component<TableProps, TableState> {
  static defaultProps = {
    placeholder: 'placeholder.empty',
    scaffold: {},
    addBtnIcon: 'plus',
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
    'formStore'
  ];

  entries: SimpleMap<any, number>;
  entityId: number = 1;
  subForms: any = {};
  rowPrinstine: Array<any> = [];
  editting: any = {};
  tableStore?: ITableStore;

  constructor(props: TableProps) {
    super(props);

    this.state = {
      columns: this.buildColumns(props),
      editIndex: -1,
      items: Array.isArray(props.value) ? props.value.concat() : []
    };

    this.entries = new SimpleMap();
    this.buildItemProps = this.buildItemProps.bind(this);
    this.confirmEdit = this.confirmEdit.bind(this);
    this.cancelEdit = this.cancelEdit.bind(this);
    this.handleSaveTableOrder = this.handleSaveTableOrder.bind(this);
    this.handleTableSave = this.handleTableSave.bind(this);
    this.getEntryId = this.getEntryId.bind(this);
    this.subFormRef = this.subFormRef.bind(this);
    this.handlePageChange = this.handlePageChange.bind(this);
    this.emitValue = this.emitValue.bind(this);
  }

  componentDidUpdate(nextProps: TableProps) {
    const props = this.props;
    let toUpdate: any = null;

    // 如果static为true 或 disabled为true，
    // 则删掉正在新增 或 编辑的那一行
    if (
      props.$schema.disabled !== nextProps.$schema.disabled ||
      props.$schema.static !== nextProps.$schema.static
    ) {
      const items = this.state.items.filter(item => !item.__isPlaceholder);
      toUpdate = {
        ...toUpdate,
        items,
        editIndex: -1,
        columns: this.buildColumns(props)
      };
    }

    if (props.columns !== nextProps.columns) {
      toUpdate = {
        ...toUpdate,
        columns: this.buildColumns(props)
      };
    }

    if (props.value !== nextProps.value) {
      toUpdate = {
        ...toUpdate,
        items: Array.isArray(props.value) ? props.value.concat() : [],
        editIndex: -1
      };
    }

    toUpdate && this.setState(toUpdate);
  }

  componentWillUnmount() {
    this.entries.dispose();
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

  async validate(): Promise<string | void> {
    const {value, translate: __, columns} = this.props;
    const minLength = this.resolveVariableProps(this.props, 'minLength');
    const maxLength = this.resolveVariableProps(this.props, 'maxLength');

    // todo: 如果当前正在编辑中，表单提交了，应该先让正在编辑的东西提交然后再做验证。
    if (~this.state.editIndex) {
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

        return msg;
      }
    }

    if (!this.tableStore) return;

    // 校验子项
    const children = this.tableStore.children.filter(
      item => item?.storeType === 'FormItemStore'
    );

    const results = await Promise.all(
      children.map(item => item.validate(this.props.value))
    );
  }

  async emitValue() {
    const items = this.state.items.filter(item => !item.__isPlaceholder);
    const {onChange} = this.props;
    const isPrevented = await this.dispatchEvent('change');
    isPrevented || onChange?.(items);
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
          }
        });

        this.setState(
          {
            items
          },
          () => {
            if (toAdd.length === 1 && needConfirm !== false) {
              this.startEdit(items.length - 1, true);
            } else {
              onChange?.(items);
            }
          }
        );

        return;
      } else {
        return this.addItem(items.length - 1, false);
      }
    } else if (actionType === 'remove' || actionType === 'delete') {
      if (!valueField) {
        return env.alert(__('Table.valueField'));
      } else if (!action.payload) {
        return env.alert(__('Table.playload'));
      }

      const items = this.state.items.concat();
      let toRemove: any = dataMapping(action.payload, ctx);
      toRemove = Array.isArray(toRemove) ? toRemove : [toRemove];

      toRemove.forEach((toRemove: any) => {
        const idx = findIndex(
          items,
          item => item[valueField as string] == toRemove[valueField as string]
        );
        if (~idx) {
          items.splice(idx, 1);
        }
      });

      this.setState(
        {
          items
        },
        () => {
          onChange?.(items);
        }
      );

      return;
    }
    return onAction && onAction(action, ctx, ...rest);
  }

  async copyItem(index: number) {
    const {needConfirm} = this.props;
    const items = this.state.items.concat();

    if (needConfirm === false) {
      items.splice(index + 1, 0, items[index]);
    } else {
      // 复制相当于新增一行
      // 需要同addItem一致添加__placeholder属性
      items.splice(index + 1, 0, {
        ...items[index],
        __isPlaceholder: true
      });
    }
    index = Math.min(index + 1, items.length - 1);
    this.setState(
      {
        items
      },
      async () => {
        // 派发add事件
        const isPrevented = await this.dispatchEvent('add', {index});
        if (isPrevented) {
          return;
        }
        if (needConfirm === false) {
          this.emitValue();
        } else {
          this.startEdit(index, true);
        }
      }
    );
  }

  async addItem(index: number, isDispatch: boolean = true) {
    const {needConfirm, scaffold, columns, data} = this.props;
    const items = this.state.items.concat();
    let value: any = {
      __isPlaceholder: true
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
            const date = filterDate(column.value, data, column.format || 'X');
            setVariable(
              value,
              column.name,
              (column.utc ? moment.utc(date) : date).format(
                column.format || 'X'
              )
            );
          } else {
            /** 如果value值设置为表达式，则忽略 */
            if (!isExpression(column.value)) {
              setVariable(value, column.name, column.value);
            }
          }
        }
      });
    }

    value = merge({}, value, scaffold);

    if (needConfirm === false) {
      delete value.__isPlaceholder;
    }

    items.splice(index + 1, 0, value);
    index = Math.min(index + 1, items.length - 1);

    this.setState(
      {
        items
      },
      async () => {
        if (isDispatch) {
          const isPrevented = await this.dispatchEvent('add', {index});
          if (isPrevented) {
            return;
          }
        }
        if (needConfirm === false) {
          this.emitValue();
        } else {
          this.startEdit(index, true);
        }
      }
    );
  }

  /**
   * 点击“编辑”按钮
   * @param index 编辑的行索引
   */
  async editItem(index: number) {
    const {items} = this.state;
    const item = items[index];
    const isPrevented = await this.dispatchEvent('edit', {index, item});
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
    const {items} = this.state;
    const rendererEvent = await dispatchEvent(
      eventName,
      resolveEventData(this.props, {
        value: [...items],
        ...eventData
      })
    );

    return !!rendererEvent?.prevented;
  }

  startEdit(index: number, isCreate: boolean = false) {
    this.setState({
      editIndex: index,
      isCreateMode: isCreate,
      columns: this.buildColumns(this.props, isCreate)
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

    const validateForms: Array<any> = [];
    Object.keys(this.subForms).forEach(key => {
      const arr = key.split('-');
      const num = +arr[1];
      if (num === this.state.editIndex && this.subForms[key]) {
        validateForms.push(this.subForms[key]);
      }
    });

    const results = await Promise.all(
      validateForms.map(item => item.validate())
    );

    // 有校验不通过的
    if (~results.indexOf(false)) {
      return;
    }

    const items = this.state.items.concat();
    let item = {
      ...items[this.state.editIndex]
    };
    const isNew = !!item.__isPlaceholder;
    const confirmEventName = isNew ? 'addConfirm' : 'editConfirm';
    let isPrevented = await this.dispatchEvent(confirmEventName, {
      index: this.state.editIndex,
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
    } else if (isEffectiveApi(updateApi, createObject(data, item))) {
      remote = await env.fetcher(updateApi, createObject(data, item));
      apiMsg = (updateApi as ApiObject)?.messages?.failed;
    }

    if (remote && !remote.ok) {
      env.notify('error', apiMsg ?? (remote.msg || __('saveFailed')));
      const failEventName = isNew ? 'addFail' : 'editFail';
      this.dispatchEvent(failEventName, {
        index: this.state.editIndex,
        item,
        error: remote
      });
      return;
    } else if (remote && remote.ok) {
      item = merge(
        {},
        ((isNew ? addApi : updateApi) as ApiObject).replaceData ? {} : item,
        remote.data
      );
    }

    delete item.__isPlaceholder;
    items.splice(this.state.editIndex, 1, item);

    this.setState(
      {
        editIndex: -1,
        items: items,
        columns: this.buildColumns(this.props)
      },
      async () => {
        const isPrevented = await this.emitValue();
        if (isPrevented) {
          return;
        }
        const successEventName = isNew ? 'addSuccess' : 'editSuccess';
        this.dispatchEvent(successEventName, {
          index: this.state.editIndex,
          item
        });
      }
    );
  }

  cancelEdit() {
    let items = this.state.items.concat();
    items.splice(this.state.editIndex, 1);

    this.setState(
      {
        editIndex: -1,
        items: items,
        columns: this.buildColumns(this.props)
      },
      this.emitValue
    );
  }

  async removeItem(index: number) {
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
    const item = newValue[index];

    if (!item) {
      return;
    }

    let isPrevented = await this.dispatchEvent('delete', {index, item});
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
        env.notify(
          'error',
          (deleteApi as ApiObject)?.messages?.failed ?? __('deleteFailed')
        );
        this.dispatchEvent('deleteFail', {index, item, error: result});
        return;
      }
    }

    this.removeEntry(item);
    newValue.splice(index, 1);
    onChange(newValue);
    this.dispatchEvent('deleteSuccess', {value: newValue, index, item});
  }

  buildItemProps(item: any, index: number) {
    if (this.props.needConfirm === false) {
      return {
        quickEditEnabled: true
      };
    } else if (
      !this.props.editable &&
      !this.props.addable &&
      !this.state.isCreateMode
    ) {
      return null;
    }

    const perPage = this.props.perPage;
    const page = this.state.page || 1;
    let offset = 0;
    if (typeof perPage === 'number' && perPage) {
      offset = (page - 1) * perPage;
    }

    return {
      quickEditEnabled: this.state.editIndex === index + offset
    };
  }

  buildColumns(props: TableProps, isCreateMode = false): Array<any> {
    const env = this.props.env;
    let columns: Array<any> = Array.isArray(props.columns)
      ? props.columns.concat()
      : [];
    const ns = this.props.classPrefix;
    const __ = this.props.translate;
    const needConfirm = this.props.needConfirm;
    const showIndex = this.props.showIndex;
    const minLength = this.resolveVariableProps(this.props, 'minLength');
    const maxLength = this.resolveVariableProps(this.props, 'maxLength');
    const isStatic = this.props.static;
    const disabled = this.props.disabled;

    let btns = [];
    if (!isStatic && props.addable && props.showTableAddBtn !== false) {
      btns.push({
        children: ({
          key,
          rowIndex,
          offset
        }: {
          key: any;
          rowIndex: number;
          offset: number;
        }) =>
          (~this.state.editIndex && needConfirm !== false) ||
          maxLength <= this.state.items.length ? null : (
            <Button
              classPrefix={ns}
              size="sm"
              key={key}
              level="link"
              tooltip={__('Table.addRow')}
              tooltipContainer={
                env && env.getModalContainer ? env.getModalContainer : undefined
              }
              disabled={disabled}
              onClick={this.addItem.bind(this, rowIndex + offset, undefined)}
            >
              {props.addBtnIcon ? (
                typeof props.addBtnIcon === 'string' ? (
                  <Icon icon={props.addBtnIcon} className="icon" />
                ) : (
                  generateIcon(props.classnames, props.addBtnIcon)
                )
              ) : null}
              {props.addBtnLabel ? <span>{props.addBtnLabel}</span> : null}
            </Button>
          )
      });
    }

    if (!isStatic && props.copyable && props.showCopyBtn !== false) {
      btns.push({
        children: ({
          key,
          rowIndex,
          offset
        }: {
          key: any;
          rowIndex: number;
          offset: number;
        }) =>
          ~this.state.editIndex && needConfirm !== false ? null : (
            <Button
              classPrefix={ns}
              size="sm"
              key={key}
              level="link"
              tooltip={__('Table.copyRow')}
              tooltipContainer={
                env && env.getModalContainer ? env.getModalContainer : undefined
              }
              disabled={disabled}
              onClick={this.copyItem.bind(this, rowIndex + offset, undefined)}
            >
              {props.copyBtnIcon ? (
                typeof props.copyBtnIcon === 'string' ? (
                  <Icon icon={props.copyBtnIcon} className="icon" />
                ) : (
                  generateIcon(props.classnames, props.copyBtnIcon)
                )
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
                      saveImmediately: true,
                      mode: 'inline',
                      disabled,
                      static: isStatic
                    }
                  })
            };
      });
    } else if (
      isStatic !== true &&
      (props.addable || props.editable || isCreateMode)
    ) {
      columns = columns.map(column => {
        const quickEdit =
          !isCreateMode && column.hasOwnProperty('quickEditOnUpdate')
            ? column.quickEditOnUpdate
            : column.quickEdit;

        const render = getRendererByName(column?.type);

        return quickEdit === false
          ? omit(column, ['quickEdit'])
          : {
              ...column,
              quickEdit: {
                ...this.columnToQuickEdit(column),
                ...quickEdit,
                isQuickEditFormMode: !!render?.isFormItem,
                saveImmediately: true,
                mode: 'inline',
                disabled
              }
            };
      });

      !isStatic &&
        props.editable &&
        btns.push({
          children: ({
            key,
            rowIndex,
            data,
            offset
          }: {
            key: any;
            rowIndex: number;
            data: any;
            offset: number;
          }) =>
            ~this.state.editIndex || (data && data.__isPlaceholder) ? null : (
              <Button
                classPrefix={ns}
                size="sm"
                key={key}
                level="link"
                tooltip={__('Table.editRow')}
                tooltipContainer={
                  env && env.getModalContainer
                    ? env.getModalContainer
                    : undefined
                }
                disabled={disabled}
                onClick={() => this.editItem(rowIndex + offset)}
              >
                {/* 兼容之前的写法 */}
                {typeof props.updateBtnIcon !== 'undefined' ? (
                  props.updateBtnIcon ? (
                    typeof props.updateBtnIcon === 'string' ? (
                      <Icon icon={props.updateBtnIcon} className="icon" />
                    ) : (
                      generateIcon(props.classnames, props.updateBtnIcon)
                    )
                  ) : null
                ) : props.editBtnIcon ? (
                  typeof props.editBtnIcon === 'string' ? (
                    <Icon icon={props.editBtnIcon} className="icon" />
                  ) : (
                    generateIcon(props.classnames, props.editBtnIcon)
                  )
                ) : null}
                {props.updateBtnLabel || props.editBtnLabel ? (
                  <span>{props.updateBtnLabel || props.editBtnLabel}</span>
                ) : null}
              </Button>
            )
        });

      !isStatic &&
        btns.push({
          children: ({
            key,
            rowIndex,
            offset
          }: {
            key: any;
            rowIndex: number;
            offset: number;
          }) =>
            this.state.editIndex === rowIndex + offset ? (
              <Button
                classPrefix={ns}
                size="sm"
                key={key}
                level="link"
                tooltip={__('save')}
                tooltipContainer={
                  env && env.getModalContainer
                    ? env.getModalContainer
                    : undefined
                }
                onClick={this.confirmEdit}
              >
                {props.confirmBtnIcon ? (
                  typeof props.confirmBtnIcon === 'string' ? (
                    <Icon icon={props.confirmBtnIcon} className="icon" />
                  ) : (
                    generateIcon(props.classnames, props.confirmBtnIcon)
                  )
                ) : null}
                {props.confirmBtnLabel ? (
                  <span>{props.confirmBtnLabel}</span>
                ) : null}
              </Button>
            ) : null
        });

      !isStatic &&
        btns.push({
          children: ({
            key,
            rowIndex,
            offset
          }: {
            key: any;
            rowIndex: number;
            offset: number;
          }) =>
            this.state.editIndex === rowIndex + offset ? (
              <Button
                classPrefix={ns}
                size="sm"
                key={key}
                level="link"
                tooltip={__('cancel')}
                tooltipContainer={
                  env && env.getModalContainer
                    ? env.getModalContainer
                    : undefined
                }
                onClick={this.cancelEdit}
              >
                {props.cancelBtnIcon ? (
                  typeof props.cancelBtnIcon === 'string' ? (
                    <Icon icon={props.cancelBtnIcon} className="icon" />
                  ) : (
                    generateIcon(props.classnames, props.cancelBtnIcon)
                  )
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
          rowIndex,
          data,
          offset
        }: {
          key: any;
          rowIndex: number;
          data: any;
          offset: number;
        }) =>
          ((~this.state.editIndex || (data && data.__isPlaceholder)) &&
            needConfirm !== false) ||
          minLength >= this.state.items.length ? null : (
            <Button
              classPrefix={ns}
              size="sm"
              key={key}
              level="link"
              tooltip={__('Table.deleteRow')}
              tooltipContainer={
                env && env.getModalContainer ? env.getModalContainer : undefined
              }
              disabled={disabled}
              onClick={this.removeItem.bind(this, rowIndex + offset)}
            >
              {props.deleteBtnIcon ? (
                typeof props.deleteBtnIcon === 'string' ? (
                  <Icon icon={props.deleteBtnIcon} className="icon" />
                ) : (
                  generateIcon(props.classnames, props.deleteBtnIcon)
                )
              ) : null}
              {props.deleteBtnLabel ? (
                <span>{props.deleteBtnLabel}</span>
              ) : null}
            </Button>
          )
      });
    }

    if (btns.length) {
      let operation = columns.find(item => item.type === 'operation');

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

      if (operation.hasOwnProperty('quickEdit')) {
        delete operation.quickEdit;
      }
    }

    if (showIndex) {
      columns.unshift({
        label: __('Table.index'),
        width: '1%',
        children: (props: any) => {
          return <td>{props.offset + props.data.index + 1}</td>;
        }
      });
    }

    return columns;
  }

  columnToQuickEdit(column: any) {
    const quickEdit: any = {
      type: 'input-text'
    };

    if (
      (column.type &&
        /^input\-|(?:select|picker|checkbox|checkboxes|editor|transfer|radios)$/i.test(
          column.type
        )) ||
      ~['textarea', 'combo', 'condition-builder', 'group'].indexOf(column.type)
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
    const {perPage} = this.props;

    if (~this.state.editIndex) {
      const items = this.state.items.concat();
      const origin = items[this.state.editIndex];

      if (!origin) {
        return;
      }

      const value: any = {
        ...rows
      };
      this.entries.set(value, this.entries.get(origin) || this.entityId++);
      this.entries.delete(origin);
      items.splice(this.state.editIndex, 1, value);

      this.setState({
        items
      });
      return;
    }

    const page = this.state.page;
    let items = this.state.items.concat();

    if (Array.isArray(rows)) {
      (rowIndexes as Array<string>).forEach((rowIndex, index) => {
        const indexes = rowIndex.split('.').map(item => parseInt(item, 10));

        if (page && page > 1 && typeof perPage === 'number') {
          indexes[0] += (page - 1) * perPage;
        }
        const origin = getTree(items, indexes);
        const data = merge({}, origin, (diff as Array<object>)[index]);

        items = spliceTree(items, indexes, 1, data);
      });
    } else {
      const indexes = (rowIndexes as string)
        .split('.')
        .map(item => parseInt(item, 10));

      if (page && page > 1 && typeof perPage === 'number') {
        indexes[0] += (page - 1) * perPage;
      }

      const origin = getTree(items, indexes);

      const comboNames: Array<string> = [];
      (this.props.$schema.columns ?? []).forEach((e: any) => {
        if (e.type === 'combo' && !Array.isArray(diff)) {
          comboNames.push(e.name);
        }
      });

      const data = mergeWith(
        {},
        origin,
        diff,
        (
          objValue: any,
          srcValue: any,
          key: string,
          object: any,
          source: any,
          stack: any
        ) => {
          // 只对第一层做处理，如果不是combo，并且是数组，直接采用diff的值
          if (
            stack.size === 0 &&
            comboNames.indexOf(key) === -1 &&
            Array.isArray(objValue) &&
            Array.isArray(srcValue)
          ) {
            return srcValue;
          }
          // 直接return，默认走的mergeWith自身的merge
          return;
        }
      );

      items = spliceTree(items, indexes, 1, data);
      this.entries.set(data, this.entries.get(origin) || this.entityId++);
      // this.entries.delete(origin); // 反正最后都会清理的，先不删了吧。
    }

    this.setState(
      {
        items
      },
      this.emitValue
    );
  }

  handleSaveTableOrder(moved: Array<object>, rows: Array<object>) {
    const {onChange} = this.props;

    onChange(rows.map((item: object) => ({...item})));
  }

  handlePageChange(page: number) {
    this.setState({page});
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
    const index = Number(rowIndex);

    this.setState(
      prevState => {
        const items = cloneDeep(prevState.items);

        if (
          Number.isInteger(index) &&
          inRange(index, 0, items.length) &&
          !isEqual(items[index], data)
        ) {
          items.splice(index, 1, data);

          return {items};
        }
        return null;
      },
      () => {
        if (needConfirm === false) {
          this.emitValue();
        } else {
          Number.isInteger(index) && this.startEdit(index, true);
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
    this.tableStore = ref?.props?.store;
  }

  computedAddBtnDisabled() {
    const {disabled} = this.props;
    if (disabled !== undefined) {
      return disabled;
    }
    return !!~this.state.editIndex;
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
      footerAddBtn
    } = this.props;
    const maxLength = this.resolveVariableProps(this.props, 'maxLength');

    if (formInited === false) {
      return null;
    }

    let items = this.state.items;
    let showPager = false;
    const page = this.state.page || 1;
    let offset = 0;
    let lastPage = 1;
    if (typeof perPage === 'number' && perPage && items.length > perPage) {
      lastPage = Math.ceil(items.length / perPage);
      items = items.slice((page - 1) * perPage, page * perPage);
      showPager = true;
      offset = (page - 1) * perPage;
    }

    const footerAddBtnDisabled = this.computedAddBtnDisabled();

    let footerAddBtnSchema = {
      type: 'button',
      level: 'primary',
      size: 'sm',
      label: __('Table.add'),
      icon: 'fa fa-plus',
      disabled: footerAddBtnDisabled,
      ...(footerAddBtnDisabled
        ? {disabledTip: __('Table.addButtonDisabledTip')}
        : {})
    };

    if (footerAddBtn !== undefined) {
      footerAddBtnSchema = Object.assign(footerAddBtnSchema, footerAddBtn);
    }

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
            affixOffsetTop:
              this.props.affixOffsetTop ?? this.props.env.affixOffsetTop ?? 0,
            autoFillHeight,
            tableContentClassName
          },
          {
            ref: this.tableRef.bind(this),
            value: undefined,
            saveImmediately: true,
            disabled,
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
            expandConfig,
            canAccessSuperData,
            reUseRow: false,
            offset,
            rowClassName,
            rowClassNameExpr
            // TODO: 这里是为了处理columns里使用value变量添加的，目前会影响初始化数据加载后的组件行为，先回滚
            // onPristineChange: this.handlePristineChange
          }
        )}
        {(!isStatic &&
          addable &&
          showFooterAddBtn !== false &&
          (!maxLength || maxLength > items.length)) ||
        showPager ? (
          <div className={cx('InputTable-toolbar')}>
            {addable && showFooterAddBtn !== false
              ? render('button', footerAddBtnSchema, {
                  onClick: () => this.addItem(this.state.items.length)
                })
              : null}

            {showPager
              ? render(
                  'pager',
                  {
                    type: 'pagination'
                  },
                  {
                    activePage: page,
                    lastPage: lastPage,
                    onPageChange: this.handlePageChange,
                    className: 'InputTable-pager'
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
  setData(value: any, replace?: boolean, index?: number) {
    if (index !== undefined && ~index) {
      // 如果setValue动作传入了index，更新指定索引的值
      const items = [...this.state.items];
      items.splice(index, 1, value);
      this.setState({items}, () => {
        this.emitValue();
      });
    } else {
      // 如果setValue动作没有传入index，则直接替换组件数据
      this.setState(
        {
          items: [...value]
        },
        () => {
          this.emitValue();
        }
      );
    }
  }

  async doAction(
    action: ListenerAction | ActionObject,
    args: any,
    ...rest: Array<any>
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
      onChange
    } = this.props;

    const actionType = action.actionType as string;
    const ctx = this.props.store?.data || {}; // 获取当前上下文数据

    if (actionType === 'addItem') {
      if (addable === false) {
        return;
      }

      const items = this.state.items.concat();

      if (addApi || args) {
        let toAdd: any = null;

        if (isEffectiveApi(addApi, ctx)) {
          const payload = await env.fetcher(addApi, ctx);
          if (payload && !payload.ok) {
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

        toAdd = Array.isArray(toAdd) ? toAdd : [toAdd];
        // 如果没指定插入的位置（args.index），则默认在头部插入
        const pushIndex = args.index || 0;
        // 从右往左插入
        for (let i = toAdd.length; i >= 1; i--) {
          if (
            !valueField ||
            !find(
              items,
              item =>
                item[valueField as string] == toAdd[i - 1][valueField as string]
            )
          ) {
            items.splice(pushIndex, 0, toAdd[i - 1]);
          }
        }

        this.setState(
          {
            items
          },
          () => {
            if (toAdd.length === 1 && needConfirm !== false) {
              this.startEdit(items.length - 1, true);
            } else {
              onChange?.(items);
            }
          }
        );
        return;
      } else {
        return this.addItem(items.length - 1, false);
      }
    } else if (actionType === 'deleteItem') {
      const items = [...this.state.items];
      let rawItems: any = [];
      const deletedItems: any = [];

      if (args.index) {
        items[args.index] && deletedItems.push(items[args.index]);
        rawItems = [...items];
        rawItems.splice(args.index, 1);
      } else if (args.condition) {
        const itemsLength = items.length;
        for (let i = 0; i < itemsLength; i++) {
          const flag = await evalExpressionWithConditionBuilder(
            args?.condition,
            {...items[i], rowIndex: i}
          );
          if (!flag) {
            rawItems.push(items[i]);
          } else {
            deletedItems.push(items[i]);
          }
        }
      }
      // 删除api
      if (isEffectiveApi(deleteApi, createObject(ctx, {deletedItems}))) {
        const payload = await env.fetcher(
          deleteApi,
          createObject(ctx, {deletedItems})
        );
        if (payload && !payload.ok) {
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
          items: rawItems
        },
        () => {
          onChange?.(rawItems);
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
      const newItems = Array.isArray(resetValue) ? resetValue : [];
      this.setState(
        {
          items: newItems
        },
        () => {
          onChange?.(newItems);
        }
      );
      return;
    }
    return super.doAction(action as ActionObject, ctx, ...rest);
  }
}
