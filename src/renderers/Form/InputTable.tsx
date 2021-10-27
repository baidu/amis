import React from 'react';
import {FormItem, FormControlProps, FormBaseControl} from './Item';
import Button from '../../components/Button';
import {
  createObject,
  getTree,
  getVariable,
  setVariable,
  spliceTree
} from '../../utils/helper';
import {RendererData, Action, Api, Payload, ApiObject} from '../../types';
import {isEffectiveApi} from '../../utils/api';
import {filter} from '../../utils/tpl';
import omit from 'lodash/omit';
import {dataMapping} from '../../utils/tpl-builtin';
import findIndex from 'lodash/findIndex';
import {SimpleMap} from '../../utils/SimpleMap';
import {Icon} from '../../components/icons';
import {TableSchema} from '../Table';
import {SchemaApi} from '../../Schema';
import find from 'lodash/find';

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
   * 显示新增按钮
   */
  showAddBtn?: boolean;

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
}

export interface TableProps
  extends FormControlProps,
    Omit<
      TableControlSchema,
      'type' | 'className' | 'descriptionClassName' | 'inputClassName'
    > {}

export interface TableState {
  items: Array<any>;
  raw?: any;
  columns: Array<any>;
  editIndex: number;
  isCreateMode?: boolean;
  page?: number;
}

export default class FormTable extends React.Component<TableProps, TableState> {
  static defaultProps = {
    placeholder: '空',
    scaffold: {},
    addBtnIcon: 'plus',
    copyBtnIcon: 'copy',
    editBtnIcon: 'pencil',
    deleteBtnIcon: 'minus',
    confirmBtnIcon: 'check',
    cancelBtnIcon: 'close',
    valueField: ''
  };

  static propsList: Array<string> = [
    'onChange',
    'name',
    'columns',
    'label',
    'scaffold',
    'showAddBtn',
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
        editIndex: -1,
        raw: undefined
      };
    }

    toUpdate && this.setState(toUpdate);
  }

  componentWillUnmount() {
    this.entries.dispose();
  }

  subFormRef(form: any, x: number, y: number) {
    this.subForms[`${x}-${y}`] = form;
  }

  async validate(): Promise<string | void> {
    const {value, minLength, maxLength, translate: __, columns} = this.props;

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
  }

  emitValue() {
    const items = this.state.items.filter(item => !item.__isPlaceholder);
    const {onChange} = this.props;
    onChange?.(items);
  }

  async doAction(action: Action, ctx: RendererData, ...rest: Array<any>) {
    const {
      onAction,
      valueField,
      env,
      onChange,
      editable,
      needConfirm,
      addable,
      addApi,
      translate: __
    } = this.props;

    if (action.actionType === 'add') {
      if (addable === false) {
        return;
      }

      const items = this.state.items.concat();

      if (addApi || action.payload) {
        let toAdd = null;

        if (isEffectiveApi(addApi, ctx)) {
          const payload = await env.fetcher(addApi, ctx);
          if (payload && !payload.ok) {
            env.notify('error', payload.msg || __('fetchFailed'));
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
            this.emitValue();

            if (toAdd.length === 1 && needConfirm !== false) {
              this.startEdit(items.length - 1, true);
            }
          }
        );

        return;
      } else {
        return this.addItem(items.length - 1);
      }
    } else if (
      action.actionType === 'remove' ||
      action.actionType === 'delete'
    ) {
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
        () => this.emitValue()
      );

      // todo 如果配置删除 Api 怎么办？
      return;
    }

    return onAction && onAction(action, ctx, ...rest);
  }

  copyItem(index: number) {
    const {needConfirm} = this.props;
    const items = this.state.items.concat();

    items.splice(index + 1, 0, items[index]);
    index = Math.min(index + 1, items.length - 1);
    this.setState(
      {
        items
      },
      () => {
        if (needConfirm === false) {
          this.emitValue();
        } else {
          this.startEdit(index, true);
        }
      }
    );
  }

  addItem(index: number) {
    const {needConfirm, scaffold, columns} = this.props;
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
          setVariable(value, column.name, column.value);
        }
      });
    }

    value = {
      ...value,
      ...scaffold
    };

    if (needConfirm === false) {
      delete value.__isPlaceholder;
    }

    items.splice(index + 1, 0, value);
    index = Math.min(index + 1, items.length - 1);

    this.setState(
      {
        items
      },
      () => {
        if (needConfirm === false) {
          this.emitValue();
        } else {
          this.startEdit(index, true);
        }
      }
    );
  }

  startEdit(index: number, isCreate: boolean = false) {
    this.setState({
      editIndex: index,
      isCreateMode: isCreate,
      raw: this.state.items[index],

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

    const items = this.state.items.concat();
    let item = {
      ...items[this.state.editIndex]
    };
    const isNew = item.__isPlaceholder;

    let remote: Payload | null = null;
    if (isNew && isEffectiveApi(addApi, createObject(data, item))) {
      remote = await env.fetcher(addApi, createObject(data, item));
    } else if (isEffectiveApi(updateApi, createObject(data, item))) {
      remote = await env.fetcher(updateApi, createObject(data, item));
    }

    if (remote && !remote.ok) {
      env.notify('error', remote.msg || __('saveFailed'));
      return;
    } else if (remote && remote.ok) {
      item = {
        ...(((isNew ? addApi : updateApi) as ApiObject).replaceData
          ? {}
          : item),
        ...remote.data
      };
    }

    delete item.__isPlaceholder;
    items.splice(this.state.editIndex, 1, item);

    this.setState(
      {
        editIndex: -1,
        items: items,
        raw: undefined
      },
      this.emitValue
    );
  }

  cancelEdit() {
    let items = this.state.items.concat();

    if (this.state.isCreateMode) {
      items = items.filter(item => !item.__isPlaceholder);
    } else if (this.state.raw) {
      items.splice(this.state.editIndex, 1, this.state.raw);
    }

    this.setState(
      {
        editIndex: -1,
        raw: undefined,
        items: items
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
        env.notify('error', __('deleteFailed'));
        return;
      }
    }

    this.removeEntry(item);
    newValue.splice(index, 1);
    onChange(newValue);
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

    let btns = [];
    if (props.addable && props.showAddBtn !== false) {
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
              tooltip={__('Table.addRow')}
              tooltipContainer={
                env && env.getModalContainer ? env.getModalContainer : undefined
              }
              onClick={this.addItem.bind(this, rowIndex + offset, undefined)}
            >
              {props.addBtnLabel ? <span>{props.addBtnLabel}</span> : null}
              {props.addBtnIcon ? (
                <Icon icon={props.addBtnIcon} className="icon" />
              ) : null}
            </Button>
          )
      });
    }

    if (props.copyable && props.showCopyBtn !== false) {
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
              onClick={this.copyItem.bind(this, rowIndex + offset, undefined)}
            >
              {props.copyBtnLabel ? <span>{props.copyBtnLabel}</span> : null}
              {props.copyBtnIcon ? (
                <Icon icon={props.copyBtnIcon} className="icon" />
              ) : null}
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
              quickEdit: {
                ...this.columnToQuickEdit(column),
                ...quickEdit,
                saveImmediately: true,
                mode: 'inline'
              }
            };
      });
    } else if (props.addable || props.editable || isCreateMode) {
      columns = columns.map(column => {
        const quickEdit =
          !isCreateMode && column.hasOwnProperty('quickEditOnUpdate')
            ? column.quickEditOnUpdate
            : column.quickEdit;

        return quickEdit === false
          ? omit(column, ['quickEdit'])
          : {
              ...column,
              quickEdit: {
                ...this.columnToQuickEdit(column),
                ...quickEdit,
                saveImmediately: true,
                mode: 'inline'
              }
            };
      });

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
                onClick={() => this.startEdit(rowIndex + offset)}
              >
                {props.updateBtnLabel || props.editBtnLabel ? (
                  <span>{props.updateBtnLabel || props.editBtnLabel}</span>
                ) : null}
                {/* 兼容之前的写法 */}
                {typeof props.updateBtnIcon !== 'undefined' ? (
                  props.updateBtnIcon ? (
                    <Icon icon={props.updateBtnIcon} className="icon" />
                  ) : null
                ) : props.editBtnIcon ? (
                  <Icon icon={props.editBtnIcon} className="icon" />
                ) : null}
              </Button>
            )
        });

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
                env && env.getModalContainer ? env.getModalContainer : undefined
              }
              onClick={this.confirmEdit}
            >
              {props.confirmBtnLabel ? (
                <span>{props.confirmBtnLabel}</span>
              ) : null}
              {props.confirmBtnIcon ? (
                <Icon icon={props.confirmBtnIcon} className="icon" />
              ) : null}
            </Button>
          ) : null
      });

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
                env && env.getModalContainer ? env.getModalContainer : undefined
              }
              onClick={this.cancelEdit}
            >
              {props.cancelBtnLabel ? (
                <span>{props.cancelBtnLabel}</span>
              ) : null}
              {props.cancelBtnIcon ? (
                <Icon icon={props.cancelBtnIcon} className="icon" />
              ) : null}
            </Button>
          ) : null
      });
    }

    if (props.removable) {
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
          (~this.state.editIndex || (data && data.__isPlaceholder)) &&
          needConfirm !== false ? null : (
            <Button
              classPrefix={ns}
              size="sm"
              key={key}
              level="link"
              tooltip={__('Table.deleteRow')}
              tooltipContainer={
                env && env.getModalContainer ? env.getModalContainer : undefined
              }
              onClick={this.removeItem.bind(this, rowIndex + offset)}
            >
              {props.deleteBtnLabel ? (
                <span>{props.deleteBtnLabel}</span>
              ) : null}
              {props.deleteBtnIcon ? (
                <Icon icon={props.deleteBtnIcon} className="icon" />
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

        const data = {
          ...origin,
          ...(diff as Array<object>)[index]
        };

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
      const data = {
        ...origin,
        ...diff
      };

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

  render() {
    const {
      className,
      value,
      showAddBtn,
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
      classnames: cx
    } = this.props;

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

    return (
      <div className={cx('InputTable', className)}>
        {render(
          'body',
          {
            type: 'table',
            placeholder: __(placeholder),
            columns: this.state.columns,
            affixHeader: false,
            prefixRow,
            affixRow
          },
          {
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
            offset
          }
        )}
        {(addable && showAddBtn !== false) || showPager ? (
          <div className={cx('InputTable-toolbar')}>
            {addable && showAddBtn !== false ? (
              <Button
                disabled={disabled}
                size="sm"
                onClick={() => this.addItem(this.state.items.length)}
              >
                <Icon icon="plus" className="icon" />
                <span>{__('Combo.add')}</span>
              </Button>
            ) : null}

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
export class TableControlRenderer extends FormTable {}
