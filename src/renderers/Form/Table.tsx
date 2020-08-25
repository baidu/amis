import React from 'react';
import {FormItem, FormControlProps} from './Item';
import cx from 'classnames';
import Button from '../../components/Button';
import {createObject, isObjectShallowModified} from '../../utils/helper';
import {RendererData, Action, Api, Payload, ApiObject} from '../../types';
import {isEffectiveApi} from '../../utils/api';
import {filter} from '../../utils/tpl';
import omit from 'lodash/omit';
import {dataMapping} from '../../utils/tpl-builtin';
import findIndex from 'lodash/findIndex';
import memoize from 'lodash/memoize';
import {SimpleMap} from '../../utils/SimpleMap';
import {Icon} from '../../components/icons';

export interface TableProps extends FormControlProps {
  placeholder?: string;
  columns?: Array<any>;
  addable?: boolean;
  addApi?: Api;
  addBtnLabel?: string;
  addBtnIcon?: string;
  showAddBtn?: boolean;
  removable?: boolean;
  deleteApi?: Api;
  editable?: boolean;
  updateBtnLabel?: string;
  updateBtnIcon?: string;
  confirmBtnLabel?: string;
  confirmBtnIcon?: string;
  cancelBtnLabel?: string;
  cancelBtnIcon?: string;
  deleteBtnLabel?: string;
  deleteBtnIcon?: string;
  updateApi?: Api;
  scaffold?: any;
  deleteConfirmText?: string;
  valueField?: string;
  needConfirm?: boolean;
}

export interface TableState {
  columns: Array<any>;
  editIndex: number;
  editting?: any;
  isCreateMode?: boolean;
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
    'needConfirm'
  ];

  entries: SimpleMap<any, number>;
  entityId: number = 1;
  subForms: any = {};
  editting: any = {};
  constructor(props: TableProps) {
    super(props);

    this.state = {
      columns: this.buildColumns(props),
      editIndex: -1
    };

    this.entries = new SimpleMap();
    this.buildItemProps = this.buildItemProps.bind(this);
    this.confirmEdit = this.confirmEdit.bind(this);
    this.cancelEdit = this.cancelEdit.bind(this);
    this.handleSaveTableOrder = this.handleSaveTableOrder.bind(this);
    this.handleTableSave = this.handleTableSave.bind(this);
    this.getEntryId = this.getEntryId.bind(this);
    this.subFormRef = this.subFormRef.bind(this);
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

    if (minLength && (!Array.isArray(value) || value.length < minLength)) {
      return __(
        '组合表单成员数量不够，低于设定的最小{{minLength}}个，请添加更多的成员。',
        {minLength}
      );
    } else if (maxLength && Array.isArray(value) && value.length > maxLength) {
      return __(
        '组合表单成员数量超出，超出设定的最大{{maxLength}}个，请删除多余的成员。',
        {maxLength}
      );
    } else {
      const subForms: Array<any> = [];
      Object.keys(this.subForms).forEach(
        key => this.subForms[key] && subForms.push(this.subForms[key])
      );
      if (subForms.length) {
        return Promise.all(subForms.map(item => item.validate())).then(
          values => {
            if (~values.indexOf(false)) {
              return __('内部表单验证失败');
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
            env.notify('error', payload.msg || __('请求失败'));
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
        return env.alert(__('请配置 valueField'));
      } else if (!action.payload) {
        return env.alert(__('action 上请配置 payload, 否则不清楚要删除哪个'));
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
      editting: this.editting =
        editting || (value && value[index]) || scaffold || {},
      isCreateMode: isCreate,
      columns:
        this.state.isCreateMode === isCreate
          ? this.state.columns
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
      env.notify('error', remote.msg || __('保存失败'));
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
      editIndex: -1
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
        deleteConfirmText ? filter(deleteConfirmText, ctx) : __('确认要删除？')
      );
      if (!confirmed) {
        // 如果不确认，则跳过！
        return;
      }

      const result = await env.fetcher(deleteApi, ctx);

      if (!result.ok) {
        env.notify('error', __('删除失败'));
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
              tooltip={__('新增一行')}
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
                type: 'text',
                ...quickEdit,
                saveImmediately: true,
                mode: 'inline'
              }
            };
      });
    } else if (props.editable) {
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
                type: 'text',
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
              tooltip={__('编辑当前行')}
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
              tooltip={__('保存')}
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
              tooltip={__('取消')}
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
              tooltip={__('删除当前行')}
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
        label: __('操作'),
        className: 'v-middle nowrap',
        fixed: 'right',
        width: '1%',
        innerClassName: 'm-n'
      });
    }

    return columns;
  }

  handleTableSave(
    rows: Array<object> | object,
    diff: Array<object> | object,
    rowIndexes: Array<number> | number
  ) {
    const {onChange, value, needConfirm} = this.props;

    const newValue = Array.isArray(value) ? value.concat() : [];

    if (~this.state.editIndex) {
      this.setState({
        editting: this.editting = {
          ...rows
        }
      });
      return;
    } else if (Array.isArray(rows)) {
      (rowIndexes as Array<number>).forEach((rowIndex, index) => {
        const data = {
          ...newValue.splice(rowIndex, 1)[0],
          ...(diff as Array<object>)[index]
        };

        newValue.splice(rowIndex, 0, data);
      });
    } else {
      const idx = rowIndexes as number;
      const origin = newValue[idx];
      const data = {
        ...newValue.splice(idx, 1)[0],
        ...diff
      };

      newValue.splice(rowIndexes as number, 0, data);
      this.entries.set(data, this.entries.get(origin) || this.entityId++);
      // this.entries.delete(origin); // 反正最后都会清理的，先不删了吧。
    }

    onChange(newValue);
  }

  handleSaveTableOrder(moved: Array<object>, rows: Array<object>) {
    const {onChange} = this.props;

    onChange(rows.map((item: object) => ({...item})));
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
      translate: __
    } = this.props;

    return (
      <div className={cx('form-control-table', className)}>
        {render(
          'body',
          {
            type: 'table',
            placeholder: __(placeholder),
            columns: this.state.columns,
            affixHeader: false
          },
          {
            value: undefined,
            saveImmediately: true,
            disabled,
            draggable: draggable && !~this.state.editIndex,
            items: this.buildItems(
              Array.isArray(value) && value.length
                ? value
                : addable && showAddBtn !== false
                ? [{__isPlaceholder: true}]
                : [],
              this.state.editIndex
            ),
            getEntryId: this.getEntryId,
            onSave: this.handleTableSave,
            onSaveOrder: this.handleSaveTableOrder,
            buildItemProps: this.buildItemProps,
            quickEditFormRef: this.subFormRef,
            columnsTogglable: columnsTogglable,
            combineNum: combineNum
          }
        )}
      </div>
    );
  }
}

@FormItem({
  test: /(^|\/)form(?:\/.+)?\/control\/table$/,
  name: 'table-control'
})
export class TableControlRenderer extends FormTable {}
