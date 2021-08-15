import React from 'react';
import {FormItem, FormControlProps, FormBaseControl} from './Item';
import cx from 'classnames';
import Button from '../../components/Button';
import {
  createObject,
  getTree,
  isObjectShallowModified,
  spliceTree
} from '../../utils/helper';
import {RendererData, Action, Api, Payload, ApiObject} from '../../types';
import {isEffectiveApi} from '../../utils/api';
import {filter} from '../../utils/tpl';
import omit from 'lodash/omit';
import {dataMapping} from '../../utils/tpl-builtin';
import findIndex from 'lodash/findIndex';
import memoize from 'lodash/memoize';
import {SimpleMap} from '../../utils/SimpleMap';
import {Icon} from '../../components/icons';
import {TableSchema} from '../Table';
import {SchemaApi} from '../../Schema';

export interface TableControlSchema
  extends FormBaseControl,
    Omit<TableSchema, 'type'> {
  type: 'input-table';

  /**
   * 可新增
   */
  addable?: boolean;

  /**
   * 是否可以拖拽排序
   */
  draggable?: boolean;

  /**
   * 新增 API
   */
  addApi?: SchemaApi;

  /**
   * 新增按钮
   */
  addBtnLabel?: string;

  /**
   * 新增图标
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
  updateBtnLabel?: string;

  /**
   * 更新按钮图标
   */
  updateBtnIcon?: string;

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
  columns: Array<any>;
  editIndex: number;
  buildItemProps: (props: any) => any;
  editting?: any;
  isCreateMode?: boolean;
  page?: number;
}

export default class FormTable extends React.Component<TableProps, TableState> {
  static defaultProps = {
    placeholder: '空',
    scaffold: {},
    addBtnIcon: 'plus',
    updateBtnIcon: 'pencil',
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
    'editable',
    'addApi',
    'updateApi',
    'deleteApi',
    'needConfirm',
    'canAccessSuperData'
  ];

  entries: SimpleMap<any, number>;
  entityId: number = 1;
  subForms: any = {};
  editting: any = {};
  constructor(props: TableProps) {
    super(props);

    this.state = {
      columns: this.buildColumns(props),
      editIndex: -1,
      buildItemProps: this.buildItemProps.bind(this)
    };

    this.entries = new SimpleMap();
    this.buildItemProps = this.buildItemProps.bind(this);
    this.confirmEdit = this.confirmEdit.bind(this);
    this.cancelEdit = this.cancelEdit.bind(this);
    this.handleSaveTableOrder = this.handleSaveTableOrder.bind(this);
    this.handlePristineChange = this.handlePristineChange.bind(this);
    this.handleTableSave = this.handleTableSave.bind(this);
    this.getEntryId = this.getEntryId.bind(this);
    this.subFormRef = this.subFormRef.bind(this);
    this.handlePageChange = this.handlePageChange.bind(this);
  }

  componentDidUpdate(nextProps: TableProps) {
    const props = this.props;

    if (props.columns !== nextProps.columns) {
      this.setState({
        columns: this.buildColumns(props)
      });
    }
  }

  componentWillUnmount() {
    this.entries.dispose();
    this.buildItems.cache.clear?.();
  }

  subFormRef(form: any, x: number, y: number) {
    this.subForms[`${x}-${y}`] = form;
  }

  validate(): any {
    const {value, minLength, maxLength, translate: __} = this.props;

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
        return Promise.all(subForms.map(item => item.validate())).then(
          values => {
            if (~values.indexOf(false)) {
              return __('Form.validateFailed');
            }

            return;
          }
        );
      }
    }
  }

  async doAction(action: Action, ctx: RendererData, ...rest: Array<any>) {
    const {
      onAction,
      value,
      valueField,
      env,
      onChange,
      editable,
      addApi,
      translate: __
    } = this.props;

    if (action.actionType === 'add') {
      const rows = Array.isArray(value) ? value.concat() : [];

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
          const idx = findIndex(
            rows,
            item => item[valueField as string] == toAdd[valueField as string]
          );
          // 应该只有配置了 valueField 的时候，才去删重复项
          if (~idx && valueField) {
            rows.splice(idx, 1);
          }
          rows.push(toAdd);
        });

        onChange(rows);

        if (editable) {
          this.startEdit(rows.length - 1, rows[rows.length - 1], true);
        }

        return;
      } else {
        return this.addItem(rows.length - 1);
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

      const rows = Array.isArray(value) ? value.concat() : [];
      let toRemove: any = dataMapping(action.payload, ctx);
      toRemove = Array.isArray(toRemove) ? toRemove : [toRemove];

      toRemove.forEach((toRemove: any) => {
        const idx = findIndex(
          rows,
          item => item[valueField as string] == toRemove[valueField as string]
        );
        if (~idx) {
          rows.splice(idx, 1);
        }
      });

      onChange(rows);
      // todo 如果配置删除 Api 怎么办？
      return;
    }

    return onAction && onAction(action, ctx, ...rest);
  }

  addItem(index: number, payload: any = this.props.scaffold) {
    const {value, onChange, needConfirm} = this.props;
    let newValue = Array.isArray(value) ? value.concat() : [];
    newValue.splice(index + 1, 0, {
      ...payload
    });
    onChange(newValue);
    index = Math.min(index + 1, newValue.length - 1);

    if (needConfirm === false) {
      onChange(newValue);
    } else {
      this.startEdit(index, newValue[index], true);
    }
  }

  startEdit(index: number, editting?: any, isCreate: boolean = false) {
    const value = this.props.value;
    const scaffold = this.props.scaffold;
    this.setState({
      editIndex: index,
      buildItemProps: this.buildItemProps.bind(this),
      editting: (this.editting =
        editting || (value && value[index]) || scaffold || {}),
      isCreateMode: isCreate,
      columns:
        this.state.isCreateMode === isCreate
          ? this.state.columns.concat()
          : this.buildColumns(this.props, isCreate)
    });
  }

  async confirmEdit() {
    const {
      value,
      onChange,
      scaffold,
      addApi,
      updateApi,
      data,
      env,
      translate: __
    } = this.props;

    // form 是 lazyChange 的，先让他们 flush, 即把未提交的数据提交。
    const subForms: Array<any> = [];
    Object.keys(this.subForms).forEach(
      key => this.subForms[key] && subForms.push(this.subForms[key])
    );
    subForms.forEach(form => form.flush());

    let newValue = Array.isArray(value) ? value.concat() : [];
    let item = {
      ...this.editting
    };

    const origin = newValue[this.state.editIndex];
    const isNew = !isObjectShallowModified(scaffold, origin, false);

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

    newValue.splice(this.state.editIndex, 1, item);

    this.setState({
      editIndex: -1,
      columns: this.state.columns.concat(),
      buildItemProps: this.buildItemProps.bind(this),
      editting: null
    });
    onChange(newValue);
  }

  cancelEdit() {
    const {value, onChange} = this.props;

    if (this.state.isCreateMode) {
      let newValue = Array.isArray(value) ? value.concat() : [];
      newValue.splice(this.state.editIndex, 1);
      onChange(newValue);
    }

    this.setState({
      editIndex: -1,
      columns: this.state.columns.concat(),
      buildItemProps: this.buildItemProps.bind(this)
    });
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
    if (!this.props.editable) {
      return null;
    }

    return {
      quickEditEnabled: this.state.editIndex === index
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
        children: ({key, rowIndex}: {key: any; rowIndex: number}) =>
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
              onClick={this.addItem.bind(this, rowIndex, undefined)}
            >
              {props.addBtnLabel ? <span>{props.addBtnLabel}</span> : null}
              {props.addBtnIcon ? (
                <Icon icon={props.addBtnIcon} className="icon" />
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
                type: 'input-text',
                ...quickEdit,
                saveImmediately: true,
                mode: 'inline'
              }
            };
      });
    } else if (props.addable || props.editable) {
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
                type: 'input-text',
                ...quickEdit,
                saveImmediately: true,
                mode: 'inline'
              }
            };
      });

      btns.push({
        children: ({
          key,
          rowIndex,
          data
        }: {
          key: any;
          rowIndex: number;
          data: any;
        }) =>
          ~this.state.editIndex || (data && data.__isPlaceholder) ? null : (
            <Button
              classPrefix={ns}
              size="sm"
              key={key}
              level="link"
              tooltip={__('Table.editRow')}
              tooltipContainer={
                env && env.getModalContainer ? env.getModalContainer : undefined
              }
              onClick={() => this.startEdit(rowIndex)}
            >
              {props.updateBtnLabel ? (
                <span>{props.updateBtnLabel}</span>
              ) : null}
              {props.updateBtnIcon ? (
                <Icon icon={props.updateBtnIcon} className="icon" />
              ) : null}
            </Button>
          )
      });

      btns.push({
        children: ({key, rowIndex}: {key: any; rowIndex: number}) =>
          this.state.editIndex === rowIndex ? (
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
        children: ({key, rowIndex}: {key: any; rowIndex: number}) =>
          this.state.editIndex === rowIndex ? (
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
          data
        }: {
          key: any;
          rowIndex: number;
          data: any;
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
              onClick={this.removeItem.bind(this, rowIndex)}
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
      columns.push({
        type: 'operation',
        buttons: btns,
        label: __('Table.operation'),
        className: 'v-middle nowrap',
        fixed: 'right',
        width: '1%',
        innerClassName: 'm-n'
      });
    }

    if (showIndex) {
      columns.unshift({
        label: __('Table.index'),
        type: 'tpl',
        tpl: '${index|plus}'
      });
    }

    return columns;
  }

  handlePristineChange(pristine: object, rowIndexe: string) {
    const {setPrinstineValue, value} = this.props;
    let newValue = Array.isArray(value) ? value.concat() : [];

    const indexes = (rowIndexe as string)
      .split('.')
      .map(item => parseInt(item, 10));
    const origin = getTree(newValue, indexes);
    const data = {
      ...origin,
      ...pristine
    };
    delete data.__isPlaceholder;

    newValue = spliceTree(newValue, indexes, 1, data);
    this.entries.set(data, this.entries.get(origin) || this.entityId++);
    setPrinstineValue(newValue);
  }

  handleTableSave(
    rows: Array<object> | object,
    diff: Array<object> | object,
    rowIndexes: Array<string> | string
  ) {
    const {onChange, value, needConfirm} = this.props;

    let newValue = Array.isArray(value) ? value.concat() : [];

    if (~this.state.editIndex) {
      this.setState({
        editting: (this.editting = {
          ...rows
        })
      });
      return;
    } else if (Array.isArray(rows)) {
      (rowIndexes as Array<string>).forEach((rowIndex, index) => {
        const indexes = rowIndex.split('.').map(item => parseInt(item, 10));
        const origin = getTree(newValue, indexes);

        const data = {
          ...origin,
          ...(diff as Array<object>)[index]
        };

        newValue = spliceTree(newValue, indexes, 1, data);
      });
    } else {
      const indexes = (rowIndexes as string)
        .split('.')
        .map(item => parseInt(item, 10));
      const origin = getTree(newValue, indexes);
      const data = {
        ...origin,
        ...diff
      };

      newValue = spliceTree(newValue, indexes, 1, data);
      this.entries.set(data, this.entries.get(origin) || this.entityId++);
      // this.entries.delete(origin); // 反正最后都会清理的，先不删了吧。
    }

    onChange(newValue);
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
    if (entry === this.state.editting) {
      return 'editting';
    } else if (!this.entries.has(entry)) {
      this.entries.set(entry, this.entityId++);
    }

    return String(this.entries.get(entry));
  }

  buildItems = memoize(
    (value: Array<any>, editIndex: number) => {
      return value.map((value: any, index: number) =>
        index === editIndex ? this.state.editting : value
      );
    },
    (...args: Array<any>) => JSON.stringify(args)
  );

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
      perPage
    } = this.props;

    if (formInited === false) {
      return null;
    }

    let items = this.buildItems(
      Array.isArray(value) && value.length
        ? value
        : addable && showAddBtn !== false
        ? [{__isPlaceholder: true}]
        : [],
      this.state.editIndex
    );

    let showPager = false;
    const page = this.state.page || 1;
    let lastPage = 1;
    if (typeof perPage === 'number' && perPage && items.length > perPage) {
      lastPage = Math.ceil(items.length / perPage);
      items = items.slice((page - 1) * perPage, page * perPage);
      showPager = true;
    }

    return (
      <div className={cx('form-control-table', className)}>
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
            onPristineChange: this.handlePristineChange,
            onSaveOrder: this.handleSaveTableOrder,
            buildItemProps: this.state.buildItemProps,
            quickEditFormRef: this.subFormRef,
            columnsTogglable: columnsTogglable,
            combineNum: combineNum,
            combineFromIndex: combineFromIndex,
            expandConfig,
            canAccessSuperData
          }
        )}
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
                className: 'Tables-pager'
              }
            )
          : null}
      </div>
    );
  }
}

@FormItem({
  type: 'input-table'
})
export class TableControlRenderer extends FormTable {}
