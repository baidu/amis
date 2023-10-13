import React from 'react';
import {findDOMNode} from 'react-dom';
import cloneDeep from 'lodash/cloneDeep';
import {
  FormItem,
  FormControlProps,
  FormBaseControl,
  resolveEventData,
  ApiObject,
  FormHorizontal,
  evalExpressionWithConditionBuilder
} from 'amis-core';
import {ActionObject, Api} from 'amis-core';
import {ComboStore, IComboStore} from 'amis-core';
import {Tabs as CTabs, Tab, Button} from 'amis-ui';

import {
  guid,
  anyChanged,
  isObject,
  createObject,
  extendObject,
  autobind,
  isObjectShallowModified
} from 'amis-core';
import Sortable from 'sortablejs';
import {
  evalExpression,
  filter,
  isPureVariable,
  resolveVariableAndFilter
} from 'amis-core';
import find from 'lodash/find';
import {Select} from 'amis-ui';
import {dataMapping, resolveVariable} from 'amis-core';
import {isEffectiveApi, str2AsyncFunction} from 'amis-core';
import {Alert2} from 'amis-ui';
import memoize from 'lodash/memoize';
import {Icon} from 'amis-ui';
import {isAlive} from 'mobx-state-tree';
import {
  FormBaseControlSchema,
  SchemaApi,
  SchemaClassName,
  SchemaObject,
  SchemaTpl
} from '../../Schema';
import {ListenerAction} from 'amis-core';
import type {SchemaTokenizeableString} from '../../Schema';
import isPlainObject from 'lodash/isPlainObject';
import {isMobile} from 'amis-core';

export type ComboCondition = {
  test: string;
  items: Array<ComboSubControl>;
  label: string;
  scaffold?: any;
  mode?: string;
};

export type ComboSubControl = SchemaObject & {
  /**
   * 是否唯一, 只有在 combo 里面才有用
   */
  unique?: boolean;

  /**
   * 列类名，可以用来修改这类宽度。
   */
  columnClassName?: SchemaClassName;
};

/**
 * Combo 组合输入框类型
 * 文档：https://aisuda.bce.baidu.com/amis/zh-CN/components/form/combo
 */
export interface ComboControlSchema extends FormBaseControlSchema {
  /**
   * 指定为组合输入框类型
   */
  type: 'combo';

  /**
   * 单组表单项初始值。默认为 `{}`
   *
   * @default {}
   */
  scaffold?: any;

  /**
   * 是否含有边框
   */
  noBorder?: boolean;

  /**
   * 确认删除时的提示
   */
  deleteConfirmText?: string;

  /**
   * 删除时调用的api
   */
  deleteApi?: SchemaApi;

  /**
   * 是否可切换条件，配合`conditions`使用
   */
  typeSwitchable?: boolean;

  /**
   * 符合某类条件后才渲染的schema
   */
  conditions?: Array<ComboCondition>;

  /**
   * 内部单组表单项的类名
   */
  formClassName?: SchemaClassName;

  /**
   * 新增按钮CSS类名
   */
  addButtonClassName?: SchemaClassName;

  /**
   * 新增按钮文字
   * @default 新增
   */
  addButtonText?: string;

  /**
   * 是否可新增
   */
  addable?: boolean;

  /**
   * Add at top
   */
  addattop?: boolean;

  /**
   * 数组输入框的子项
   */
  items?: Array<ComboSubControl>;

  /**
   * 是否可拖拽排序
   */
  draggable?: boolean;

  /**
   * 可拖拽排序的提示信息。
   *
   * @default 可拖拽排序
   */
  draggableTip?: string;

  /**
   * 是否将结果扁平化(去掉name),只有当controls的length为1且multiple为true的时候才有效
   */
  flat?: boolean;

  /**
   * 当扁平化开启并且joinValues为true时，用什么分隔符
   *
   * @deprecated
   */
  delimiter?: string;

  /**
   * 当扁平化开启的时候，是否用分隔符的形式发送给后端，否则采用array的方式
   * @deprecated
   */
  joinValues?: boolean;

  /**
   * 限制最大个数
   */
  maxLength?: number | SchemaTokenizeableString;

  /**
   * 限制最小个数
   */
  minLength?: number | SchemaTokenizeableString;

  /**
   * 是否多行模式，默认一行展示完
   */
  multiLine?: boolean;

  /**
   * 是否可多选
   */
  multiple?: boolean;

  /**
   * 是否可删除
   */
  removable?: boolean;

  /**
   * 子表单的模式。
   */
  subFormMode?: 'normal' | 'horizontal' | 'inline';

  /**
   * 如果是水平排版，这个属性可以细化水平排版的左右宽度占比。
   */
  subFormHorizontal?: FormHorizontal;

  /**
   * 没有成员时显示。
   * @default empty
   */
  placeholder?: string;

  /**
   * 是否可以访问父级数据，正常 combo 已经关联到数组成员，是不能访问父级数据的。
   */
  canAccessSuperData?: boolean;

  /**
   * 采用 Tabs 展示方式？
   */
  tabsMode?: boolean;

  /**
   * Tabs 的展示模式。
   */
  tabsStyle?: '' | 'line' | 'card' | 'radio';

  /**
   * 选项卡标题的生成模板。
   */
  tabsLabelTpl?: SchemaTpl;

  /**
   * 数据比较多，比较卡时，可以试试开启。
   */
  lazyLoad?: boolean;

  /**
   * 严格模式，为了性能默认不开的。
   */
  strictMode?: boolean;

  /**
   * 配置同步字段。只有 `strictMode` 为 `false` 时有效。
   * 如果 Combo 层级比较深，底层的获取外层的数据可能不同步。
   * 但是给 combo 配置这个属性就能同步下来。输入格式：`["os"]`
   */
  syncFields?: string[];

  /**
   * 允许为空，如果子表单项里面配置验证器，且又是单条模式。可以允许用户选择清空（不填）。
   */
  nullable?: boolean;

  /**
   * 提示信息
   */
  messages?: {
    /**
     * 验证错误提示
     */
    validateFailed?: string;

    /**
     * 最小值验证错误提示
     */
    minLengthValidateFailed?: string;

    /**
     * 最大值验证错误提示
     */
    maxLengthValidateFailed?: string;
  };
  updatePristineAfterStoreDataReInit?: boolean;
}

export type ComboRendererEvent = 'add' | 'delete' | 'tabsChange';

function pickVars(vars: any, fields: Array<string>) {
  return fields.reduce((data: any, key: string) => {
    data[key] = resolveVariable(key, vars);
    return data;
  }, {});
}

export interface ComboProps
  extends FormControlProps,
    Omit<
      ComboControlSchema,
      'type' | 'className' | 'descriptionClassName' | 'inputClassName'
    > {
  store: IComboStore;
  changeImmediately?: boolean;
}

export default class ComboControl extends React.Component<ComboProps> {
  static defaultProps: Pick<
    ComboProps,
    | 'minLength'
    | 'maxLength'
    | 'multiple'
    | 'multiLine'
    | 'addButtonClassName'
    | 'formClassName'
    | 'subFormMode'
    | 'draggableTip'
    | 'addButtonText'
    | 'canAccessSuperData'
    | 'addIcon'
    | 'dragIcon'
    | 'deleteIcon'
    | 'tabsMode'
    | 'tabsStyle'
    | 'placeholder'
    | 'itemClassName'
    | 'itemsWrapperClassName'
  > = {
    minLength: 0,
    maxLength: Infinity,
    multiple: false,
    multiLine: false,
    addButtonClassName: '',
    formClassName: '',
    subFormMode: 'normal',
    draggableTip: '',
    addButtonText: 'add',
    canAccessSuperData: false,
    addIcon: true,
    dragIcon: '',
    deleteIcon: '',
    tabsMode: false,
    tabsStyle: '',
    placeholder: 'placeholder.empty',
    itemClassName: '',
    itemsWrapperClassName: ''
  };
  static propsList: Array<string> = [
    'minLength',
    'maxLength',
    'multiple',
    'multiLine',
    'addButtonClassName',
    'subFormMode',
    'draggableTip',
    'addButtonText',
    'draggable',
    'scaffold',
    'canAccessSuperData',
    'addIcon',
    'dragIcon',
    'deleteIcon',
    'noBorder',
    'conditions',
    'tabsMode',
    'tabsStyle',
    'lazyLoad',
    'changeImmediately',
    'strictMode',
    'items',
    'conditions',
    'messages',
    'formStore',
    'itemClassName',
    'itemsWrapperClassName'
  ];

  subForms: Array<any> = [];
  subFormDefaultValues: Array<{
    index: number;
    values: any;
    setted: boolean;
  }> = [];

  keys: Array<string> = [];
  dragTip?: HTMLElement;
  sortable?: Sortable;
  defaultValue?: any;
  toDispose: Array<Function> = [];
  id: string = guid();
  constructor(props: ComboProps) {
    super(props);

    this.handleChange = this.handleChange.bind(this);
    this.handleRadioChange = this.handleRadioChange.bind(this);
    this.handleSingleFormChange = this.handleSingleFormChange.bind(this);
    this.handleSingleFormInit = this.handleSingleFormInit.bind(this);
    this.handleFormInit = this.handleFormInit.bind(this);
    this.handleAction = this.handleAction.bind(this);
    this.addItem = this.addItem.bind(this);
    this.deleteItem = this.deleteItem.bind(this);
    this.dragTipRef = this.dragTipRef.bind(this);
    this.flush = this.flush.bind(this);
    this.handleComboTypeChange = this.handleComboTypeChange.bind(this);
    this.defaultValue = {
      ...props.scaffold
    };

    const {store, value, multiple, formItem, addHook} = props;

    store.config({
      multiple,
      minLength: this.resolveVariableProps(props, 'minLength'),
      maxLength: this.resolveVariableProps(props, 'maxLength'),
      length: this.getValueAsArray(props).length
    });

    formItem && isAlive(formItem) && formItem.setSubStore(store);
    addHook && this.toDispose.push(addHook(this.flush, 'flush'));
  }

  componentDidUpdate(prevProps: ComboProps) {
    const props = this.props;

    if (
      anyChanged(['minLength', 'maxLength', 'value'], prevProps, props) ||
      this.resolveVariableProps(prevProps, 'minLength') !==
        this.resolveVariableProps(props, 'minLength') ||
      this.resolveVariableProps(prevProps, 'maxLength') !==
        this.resolveVariableProps(props, 'maxLength')
    ) {
      const {store, multiple} = props;
      const values = this.getValueAsArray(props);

      store.config({
        multiple,
        minLength: this.resolveVariableProps(props, 'minLength'),
        maxLength: this.resolveVariableProps(props, 'maxLength'),
        length: values.length
      });

      if (store.activeKey >= values.length) {
        store.setActiveKey(Math.max(0, values.length - 1));
      }

      // combo 进来了新的值，且这次 form 初始化时带来的新值变化，但是之前的值已经 onInit 过了
      // 所以，之前 onInit 设置进去的初始值是过时了的。这个时候修复一下。
      if (
        props.value !== prevProps.value &&
        !prevProps.formInited &&
        this.subFormDefaultValues.length
      ) {
        this.subFormDefaultValues = this.subFormDefaultValues.map(
          (item, index) => {
            return {
              ...item,
              values: values[index]
            };
          }
        );
      }
    }
  }

  componentWillUnmount() {
    const {formItem} = this.props;

    formItem && isAlive(formItem) && formItem.setSubStore(null);

    this.toDispose.forEach(fn => fn());
    this.toDispose = [];
    this.memoizedFormatValue.cache.clear?.();
    this.makeFormRef.cache.clear?.();
  }

  /** 解析props中的变量，目前支持'minLength' | 'maxLength' */
  resolveVariableProps(props: ComboProps, key: 'minLength' | 'maxLength') {
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

  doAction(action: ListenerAction, args: any) {
    const actionType = action?.actionType as string;
    const {onChange, resetValue} = this.props;

    if (actionType === 'addItem') {
      this.addItemValue(args?.item ?? {});
    } else if (actionType === 'clear') {
      onChange('');
    } else if (actionType === 'reset') {
      onChange(resetValue ?? '');
    }
  }

  addItemValue(itemValue: any) {
    const {flat, joinValues, addattop, delimiter, disabled, submitOnChange} =
      this.props;

    if (disabled) {
      return;
    }

    let value = this.getValueAsArray();

    if (addattop === true) {
      this.keys.unshift(guid());
      value.unshift(itemValue);
    } else {
      value.push(itemValue);
      this.keys.push(guid());
    }

    if (flat && joinValues) {
      value = value.join(delimiter || ',');
    }

    this.props.onChange(value, submitOnChange, true);
  }

  getValueAsArray(props = this.props) {
    const {flat, joinValues, delimiter, type} = props;
    let value = props.value;

    if (joinValues && flat && typeof value === 'string') {
      value = value.split(delimiter || ',');
    } else if (!Array.isArray(value)) {
      value = [];
    } else {
      value = value.concat();
    }
    return value;
  }

  addItemWith(condition: ComboCondition) {
    const {
      flat,
      joinValues,
      addattop,
      delimiter,
      scaffold,
      disabled,
      submitOnChange
    } = this.props;

    if (disabled) {
      return;
    }

    let value = this.getValueAsArray();

    value.push(
      flat
        ? condition.scaffold ?? scaffold ?? ''
        : {
            ...(condition.scaffold || scaffold)
          }
    );
    this.keys.push(guid());

    if (flat && joinValues) {
      value = value.join(delimiter || ',');
    }

    if (addattop === true) {
      this.keys.unshift(this.keys.pop()!);
      value.unshift(value.pop());
    }

    this.props.onChange(value, submitOnChange, true);
  }

  async addItem() {
    const {
      flat,
      joinValues,
      addattop,
      delimiter,
      scaffold,
      disabled,
      submitOnChange,
      dispatchEvent
    } = this.props;

    if (disabled) {
      return;
    }

    let value = this.getValueAsArray();

    // todo:这里的数据结构与表单项最终类型不一致，需要区分是否多选、是否未input-kv or input-kvs
    const rendererEvent = await dispatchEvent(
      'add',
      resolveEventData(this.props, {
        value:
          flat && joinValues ? value.join(delimiter || ',') : cloneDeep(value)
      })
    );

    if (rendererEvent?.prevented) {
      return;
    }

    value.push(
      flat
        ? scaffold ?? ''
        : {
            ...scaffold
          }
    );
    this.keys.push(guid());

    if (flat && joinValues) {
      value = value.join(delimiter || ',');
    }

    if (addattop === true) {
      this.keys.unshift(this.keys.pop()!);
      value.unshift(value.pop());
    }

    this.props.onChange(value, submitOnChange, true);
  }

  async deleteItem(key: number) {
    const {
      flat,
      joinValues,
      delimiter,
      disabled,
      deleteApi,
      deleteConfirmText,
      data,
      env,
      translate: __,
      dispatchEvent,
      submitOnChange
    } = this.props;

    if (disabled) {
      return;
    }

    let value = this.getValueAsArray();
    const ctx = createObject(data, value[key]);

    // todo:这里的数据结构与表单项最终类型不一致，需要区分是否多选、是否未input-kv or input-kvs
    const rendererEvent = await dispatchEvent(
      'delete',
      resolveEventData(this.props, {
        key,
        value:
          flat && joinValues ? value.join(delimiter || ',') : cloneDeep(value),
        item: value[key]
      })
    );

    if (rendererEvent?.prevented) {
      return;
    }

    if (isEffectiveApi(deleteApi, ctx)) {
      const confirmed = await env.confirm(
        deleteConfirmText ? filter(deleteConfirmText, ctx) : __('deleteConfirm')
      );
      if (!confirmed) {
        // 如果不确认，则跳过！
        return;
      }

      const result = await env.fetcher(deleteApi as Api, ctx);

      if (!result.ok) {
        !(deleteApi as ApiObject)?.silent &&
          env.notify(
            'error',
            (deleteApi as ApiObject)?.messages?.failed ?? __('deleteFailed')
          );
        return;
      }
    }

    this.keys.splice(key, 1);
    value.splice(key, 1);

    if (flat && joinValues) {
      value = value.join(delimiter || ',');
    }

    this.props.onChange(value, submitOnChange, true);
  }

  handleChange(values: any, diff: any, {index}: any) {
    const {flat, store, joinValues, delimiter, disabled, submitOnChange, type} =
      this.props;

    if (disabled) {
      return;
    }

    let value = this.getValueAsArray();
    value[index] = flat ? values.flat : {...values};

    if (flat && joinValues) {
      value = value.join(delimiter || ',');
    }

    if (type === 'input-kv') {
      let hasDuplicateKey = false;
      const keys: {[key: string]: boolean} = {};
      for (const item of value) {
        if (keys[item.key]) {
          hasDuplicateKey = true;
        } else {
          keys[item.key] = true;
        }
      }
      // 有重复值就不触发修改，因为 KV 模式下无法支持重复值
      if (!hasDuplicateKey) {
        this.props.onChange(value, submitOnChange, true);
      }
    } else if (type === 'input-kvs') {
      // input-kvs 为了避免冲突 key 改成了 _key
      let hasDuplicateKey = false;
      const keys: {[key: string]: boolean} = {};
      for (const item of value) {
        if ('_key' in item) {
          if (keys[item._key]) {
            hasDuplicateKey = true;
          } else {
            keys[item._key] = true;
          }
        }
      }
      // 有重复值就不触发修改，因为 KV 模式下无法支持重复值
      if (!hasDuplicateKey) {
        this.props.onChange(value, submitOnChange, true);
      }
    } else {
      this.props.onChange(value, submitOnChange, true);
    }

    store.forms.forEach(
      form =>
        isAlive(form) &&
        form.items.forEach(
          item => item.unique && item.syncOptions(undefined, form.data)
        )
    );
  }

  handleRadioChange(
    ctx: any,
    {index, name, trueValue = true, falseValue = false}: any
  ) {
    const {onChange, submitOnChange, multiple, disabled} = this.props;
    if (!multiple || disabled || !name) {
      return;
    }

    let value = this.getValueAsArray();
    if (!Array.isArray(value) || value.length < 2 || !isPlainObject(value[0])) {
      return;
    }
    value = value.map((item, i) => ({
      ...item,
      [name]: i === index ? trueValue : falseValue
    }));

    onChange(value, submitOnChange, true);

    return false;
  }

  handleSingleFormChange(values: object) {
    this.props.onChange(
      {
        ...values
      },
      this.props.submitOnChange,
      true
    );
  }

  handleFormInit(values: any, {index}: any) {
    const {
      syncDefaultValue,
      flat,
      joinValues,
      delimiter,
      formInited,
      onChange,
      submitOnChange,
      setPrinstineValue
    } = this.props;

    this.subFormDefaultValues.push({
      index,
      values,
      setted: false
    });

    if (
      syncDefaultValue === false ||
      this.subFormDefaultValues.length !==
        this.subForms.filter(item => item !== undefined).length
    ) {
      return;
    }

    let value = this.getValueAsArray();
    let isModified = false;
    this.subFormDefaultValues = this.subFormDefaultValues.map(
      ({index, values, setted}) => {
        const newValue = flat ? values.flat : {...values};

        if (!setted && isObjectShallowModified(value[index], newValue)) {
          value[index] = flat ? values.flat : {...values};
          isModified = true;
        }

        return {
          index,
          values,
          setted: true
        };
      }
    );

    if (!isModified) {
      return;
    }

    if (flat && joinValues) {
      value = value.join(delimiter || ',');
    }

    formInited
      ? onChange(value, submitOnChange, true)
      : setPrinstineValue(value);
  }

  handleSingleFormInit(values: any) {
    const {syncDefaultValue, setPrinstineValue, value, nullable} = this.props;

    if (
      syncDefaultValue !== false &&
      !nullable &&
      isObjectShallowModified(value, values)
    ) {
      setPrinstineValue({
        ...values
      });
    }
  }

  handleAction(e: React.UIEvent<any> | undefined, action: ActionObject): any {
    const {onAction} = this.props;

    if (action.actionType === 'delete') {
      action.index !== void 0 && this.deleteItem(action.index);
      return;
    }

    onAction && onAction.apply(null, arguments);
  }

  validate(): any {
    const {messages, nullable, translate: __} = this.props;
    const value = this.getValueAsArray();
    const minLength = this.resolveVariableProps(this.props, 'minLength');
    const maxLength = this.resolveVariableProps(this.props, 'maxLength');

    if (minLength && (!Array.isArray(value) || value.length < minLength)) {
      return __(
        (messages && messages.minLengthValidateFailed) || 'Combo.minLength',
        {minLength}
      );
    } else if (maxLength && Array.isArray(value) && value.length > maxLength) {
      return __(
        (messages && messages.maxLengthValidateFailed) || 'Combo.maxLength',
        {maxLength}
      );
    } else if (this.subForms.length && (!nullable || value)) {
      return Promise.all(this.subForms.map(item => item.validate())).then(
        values => {
          if (~values.indexOf(false)) {
            return __(
              (messages && messages.validateFailed) || 'validateFailed'
            );
          }

          return;
        }
      );
    }
  }

  flush() {
    this.subForms.forEach(form => form.flush());
  }

  dragTipRef(ref: any) {
    if (!this.dragTip && ref) {
      this.initDragging();
    } else if (this.dragTip && !ref) {
      this.destroyDragging();
    }

    this.dragTip = ref;
  }

  initDragging() {
    const ns = this.props.classPrefix;
    const submitOnChange = this.props.submitOnChange;
    const dom = findDOMNode(this) as HTMLElement;
    this.sortable = new Sortable(
      dom.querySelector(`.${ns}Combo-items`) as HTMLElement,
      {
        group: `combo-${this.id}`,
        animation: 150,
        handle: `.${ns}Combo-itemDrager`,
        ghostClass: `${ns}Combo-item--dragging`,
        onEnd: (e: any) => {
          // 没有移动
          if (e.newIndex === e.oldIndex) {
            return;
          }

          // 换回来
          const parent = e.to as HTMLElement;
          if (e.oldIndex < parent.childNodes.length - 1) {
            parent.insertBefore(e.item, parent.childNodes[e.oldIndex]);
          } else {
            parent.appendChild(e.item);
          }

          const value = this.props.value;
          if (!Array.isArray(value)) {
            return;
          }
          const newValue = value.concat();
          newValue.splice(e.newIndex, 0, newValue.splice(e.oldIndex, 1)[0]);
          this.keys.splice(e.newIndex, 0, this.keys.splice(e.oldIndex, 1)[0]);
          this.props.onChange(newValue, submitOnChange, true);
        }
      }
    );
  }

  destroyDragging() {
    this.sortable && this.sortable.destroy();
  }

  refsMap: {
    [propName: number]: any;
  } = {};

  makeFormRef = memoize(
    (index: number) => (ref: any) => this.formRef(ref, index)
  );

  formRef(ref: any, index: number = 0) {
    if (ref) {
      while (ref && ref.getWrappedInstance) {
        ref = ref.getWrappedInstance();
      }
      this.subForms[index] = ref;
      this.refsMap[index] = ref;
    } else {
      const form = this.refsMap[index];
      this.subForms = this.subForms.filter(item => item !== form);
      this.subFormDefaultValues = this.subFormDefaultValues.filter(
        ({index: dIndex}) => dIndex !== index
      );
      delete this.refsMap[index];
    }
  }

  memoizedFormatValue = memoize(
    (
      strictMode: boolean,
      syncFields: Array<string> | void,
      value: any,
      index: number,
      data: any
    ) => {
      return createObject(
        extendObject(data, {index, __index: index, ...data}),
        {
          ...value,
          ...(Array.isArray(syncFields) ? pickVars(data, syncFields!) : null)
        }
      );
    },
    (
      strictMode: boolean,
      syncFields: Array<string> | void,
      value: any,
      index: number,
      data: any
    ) =>
      Array.isArray(syncFields)
        ? JSON.stringify([value, index, data, pickVars(data, syncFields)])
        : strictMode
        ? JSON.stringify([value, index])
        : JSON.stringify([value, index, data])
  );

  formatValue(value: any, index: number = -1) {
    const {flat, data, strictMode, syncFields} = this.props;

    if (flat) {
      value = {
        flat: value
      };
    }

    value = value || this.defaultValue;

    return this.memoizedFormatValue(
      strictMode !== false,
      syncFields,
      value,
      index,
      data
    );
  }

  pickCondition(value: any): ComboCondition | null {
    const conditions: Array<ComboCondition> = this.props.conditions!;
    return find(
      conditions,
      item => item.test && evalExpression(item.test, value)
    ) as ComboCondition | null;
  }

  handleComboTypeChange(index: number, selection: any) {
    const {multiple, onChange, value, flat, submitOnChange} = this.props;

    const conditions: Array<ComboCondition> = this.props
      .conditions as Array<ComboCondition>;
    const condition = find(conditions, item => item.label === selection.label);

    if (!condition) {
      return;
    }

    if (multiple) {
      const newValue = this.getValueAsArray();
      newValue.splice(index, 1, {
        ...dataMapping(condition.scaffold || {}, newValue[index])
      });

      // todo 支持 flat
      onChange(newValue, submitOnChange, true);
    } else {
      onChange(
        {
          ...dataMapping(condition.scaffold || {}, value)
        },
        submitOnChange,
        true
      );
    }
  }

  @autobind
  async handleTabSelect(key: number) {
    const {store, data, name, value, dispatchEvent} = this.props;
    const eventData = {
      key,
      item: value[key]
    };
    const rendererEvent = await dispatchEvent(
      'tabsChange',
      createObject(
        data,
        name
          ? {
              ...eventData,
              [name]: value
            }
          : eventData
      )
    );

    if (rendererEvent?.prevented) {
      return;
    }

    store.setActiveKey(key);
  }

  @autobind
  setNull(e: React.MouseEvent) {
    e.preventDefault();
    const {onChange} = this.props;
    onChange(null);

    Array.isArray(this.subForms) &&
      this.subForms.forEach(subForm => {
        subForm.clearErrors();
      });
  }

  renderPlaceholder() {
    const {placeholder, translate: __} = this.props;
    return (
      <span className="text-muted">
        {__(placeholder || 'placeholder.noData')}
      </span>
    );
  }

  renderTabsMode() {
    const {
      classPrefix: ns,
      classnames: cx,
      tabsStyle,
      formClassName,
      render,
      disabled,
      store,
      flat,
      subFormMode,
      addButtonText,
      addable,
      removable,
      typeSwitchable,
      itemRemovableOn,
      delimiter,
      canAccessSuperData,
      addIcon,
      deleteIcon,
      tabsLabelTpl,
      conditions,
      changeImmediately,
      addBtnText,
      static: isStatic,
      translate: __
    } = this.props;

    let items = this.props.items;
    let value = this.props.value;

    if (flat && typeof value === 'string') {
      value = value.split(delimiter || ',');
    }

    const finnalRemovable =
      store.removable !== false && // minLength ?
      !disabled && // 控件自身是否禁用
      removable !== false; // 是否可以删除

    if (!Array.isArray(value)) {
      value = []; // 让 tabs 输出，否则会没有新增按钮。
    }

    // todo 支持拖拽排序。

    return (
      <CTabs
        addBtnText={__(addBtnText || 'add')}
        className={'ComboTabs'}
        mode={tabsStyle}
        activeKey={store.activeKey}
        onSelect={this.handleTabSelect}
        additionBtns={
          !disabled && addable !== false && store.addable ? (
            <li className={cx(`Tabs-link ComboTabs-addLink`)}>
              {this.renderAddBtn()}
            </li>
          ) : null
        }
      >
        {value.map((value: any, index: number) => {
          const data = this.formatValue(value, index);
          let condition: ComboCondition | null | undefined = null;
          let toolbar = undefined;
          if (
            finnalRemovable && // 表达式判断单条是否可删除
            (!itemRemovableOn ||
              evalExpression(itemRemovableOn, value) !== false)
          ) {
            toolbar = (
              <div
                onClick={this.deleteItem.bind(this, index)}
                key="delete"
                className={cx(
                  `Combo-tab-delBtn ${!store.removable ? 'is-disabled' : ''}`
                )}
                data-tooltip={__('delete')}
                data-position="bottom"
              >
                {deleteIcon ? (
                  <i className={deleteIcon} />
                ) : (
                  <Icon icon="status-close" className="icon" />
                )}
              </div>
            );
          }

          if (Array.isArray(conditions) && conditions.length) {
            condition = this.pickCondition(data);
            items = condition ? condition.items : undefined;
          }

          let finnalControls =
            flat && items
              ? [
                  {
                    ...(items && items[0]),
                    name: 'flat'
                  }
                ]
              : items;

          const hasUnique =
            Array.isArray(finnalControls) &&
            finnalControls.some((item: any) => item.unique);

          if (!this.keys[index]) {
            this.keys.splice(index, 0, guid());
          }

          return (
            <Tab
              title={filter(
                tabsLabelTpl ||
                  __('{{index}}', {index: (data as any).index + 1}),
                data
              )}
              key={this.keys[index]}
              toolbar={toolbar}
              eventKey={index}
              // 不能按需渲染，因为 unique 会失效。
              mountOnEnter={!hasUnique}
              unmountOnExit={false}
            >
              {condition && typeSwitchable !== false ? (
                <div className={cx('Combo-itemTag')}>
                  <label>{__('Combo.type')}</label>
                  <Select
                    onChange={this.handleComboTypeChange.bind(this, index)}
                    options={(conditions as Array<ComboCondition>).map(
                      item => ({
                        label: item.label,
                        value: item.label
                      })
                    )}
                    value={condition.label}
                    clearable={false}
                  />
                </div>
              ) : null}
              <div className={cx(`Combo-itemInner`)}>
                {finnalControls ? (
                  this.renderItems(finnalControls, data, index)
                ) : (
                  <Alert2 level="warning" className="m-b-none">
                    {__('Combo.invalidData')}
                  </Alert2>
                )}
              </div>
            </Tab>
          );
        })}
      </CTabs>
    );
  }

  renderDelBtn(value: any, index: number) {
    if (this.props.static) {
      return null;
    }

    const {
      classPrefix: ns,
      classnames: cx,
      render,
      store,
      deleteIcon,
      translate: __,
      itemRemovableOn,
      disabled,
      removable,
      deleteBtn,
      mobileUI,
      data
    } = this.props;

    const finnalRemovable =
      store.removable !== false && // minLength ?
      !disabled && // 控件自身是否禁用
      removable !== false; // 是否可以删除

    if (
      !(
        finnalRemovable && // 表达式判断单条是否可删除
        (!itemRemovableOn || evalExpression(itemRemovableOn, value) !== false)
      )
    ) {
      // 不符合删除条件，则不渲染删除按钮
      return null;
    }

    // deleteBtn是对象，则根据自定义配置渲染按钮
    if (isObject(deleteBtn)) {
      return render(
        'delete-btn',
        {
          ...deleteBtn,
          type: 'button',
          className: cx(
            'Combo-delController',
            deleteBtn ? deleteBtn.className : ''
          ),
          onClick: (e: any) => {
            if (!deleteBtn.onClick) {
              this.deleteItem(index);
              return;
            }

            let originClickHandler = deleteBtn.onClick;
            if (typeof originClickHandler === 'string') {
              originClickHandler = str2AsyncFunction(
                deleteBtn.onClick,
                'e',
                'index',
                'props'
              );
            }
            const result = originClickHandler(e, index, this.props);
            if (result && result.then) {
              result.then(() => {
                this.deleteItem(index);
              });
            } else {
              this.deleteItem(index);
            }
          }
        },
        {
          data: extendObject(data, {index})
        }
      );
    }

    // deleteBtn是string，则渲染按钮文本
    if (typeof deleteBtn === 'string') {
      return render('delete-btn', {
        type: 'button',
        className: cx('Combo-delController'),
        label: deleteBtn,
        onClick: this.deleteItem.bind(this, index)
      });
    }

    // 如果上述按钮不满足，则渲染默认按钮
    return (
      <a
        onClick={this.deleteItem.bind(this, index)}
        key="delete"
        className={cx(`Combo-delBtn ${!store.removable ? 'is-disabled' : ''}`)}
        data-tooltip={!mobileUI ? __('delete') : null}
        data-position="bottom"
      >
        {deleteIcon ? (
          <i className={deleteIcon} />
        ) : (
          <Icon icon="status-close" className="icon" />
        )}
      </a>
    );
  }

  renderAddBtn() {
    if (this.props.static) {
      return null;
    }

    const {
      classPrefix: ns,
      classnames: cx,
      render,
      addButtonClassName,
      store,
      addButtonText,
      addBtn,
      addable,
      addIcon,
      conditions,
      translate: __,
      tabsMode
    } = this.props;

    const hasConditions = Array.isArray(conditions) && conditions.length;
    return (
      <>
        {store.addable &&
          addable !== false &&
          (hasConditions ? (
            render(
              'add-button',
              {
                type: 'dropdown-button',
                icon: addIcon ? <Icon icon="plus-fine" className="icon" /> : '',
                label: __(addButtonText || 'add'),
                level: 'info',
                size: 'sm',
                closeOnClick: true,
                btnClassName: addButtonClassName
              },
              {
                buttons: conditions?.map(item => ({
                  label: item.label,
                  onClick: (e: any) => {
                    this.addItemWith(item);
                    return false;
                  }
                }))
              }
            )
          ) : tabsMode ? (
            <a onClick={this.addItem}>
              {addIcon ? <Icon icon="plus-fine" className="icon" /> : null}
              <span>{__(addButtonText || 'add')}</span>
            </a>
          ) : isObject(addBtn) ? (
            render('add-button', {
              ...addBtn,
              type: 'button',
              onClick: () => this.addItem()
            })
          ) : (
            <Button
              className={cx(`Combo-addBtn`, addButtonClassName)}
              onClick={this.addItem}
            >
              {addIcon ? <Icon icon="plus-fine" className="icon" /> : null}
              <span>{__(addButtonText || 'add')}</span>
            </Button>
          ))}
      </>
    );
  }

  renderMultipe() {
    if (this.props.tabsMode) {
      return this.renderTabsMode();
    }

    const {
      classPrefix: ns,
      classnames: cx,
      multiLine,
      disabled,
      flat,
      draggable,
      draggableTip,
      typeSwitchable,
      delimiter,
      dragIcon,
      noBorder,
      conditions,
      placeholder,
      translate: __,
      itemClassName,
      itemsWrapperClassName,
      static: isStatic,
      mobileUI
    } = this.props;

    let items = this.props.items;
    let value = this.props.value;

    if (flat && typeof value === 'string') {
      value = value.split(delimiter || ',');
    }

    return (
      <div
        className={cx(
          `Combo Combo--multi`,
          {
            'is-mobile': mobileUI
          },
          multiLine ? `Combo--ver` : `Combo--hor`,
          noBorder ? `Combo--noBorder` : '',
          disabled ? 'is-disabled' : '',
          !isStatic &&
            !disabled &&
            draggable &&
            Array.isArray(value) &&
            value.length > 1
            ? 'is-draggable'
            : ''
        )}
      >
        <div className={cx(`Combo-items`, itemsWrapperClassName)}>
          {Array.isArray(value) && value.length ? (
            value.map((value, index, thelist) => {
              let delBtn: any = this.renderDelBtn(value, index);

              const data = this.formatValue(value, index);
              let condition: ComboCondition | null = null;

              if (Array.isArray(conditions) && conditions.length) {
                condition = this.pickCondition(data);
                items = condition ? condition.items : undefined;
              }

              let finnalControls =
                flat && items
                  ? [
                      {
                        ...(items && items[0]),
                        name: 'flat'
                      }
                    ]
                  : items;

              if (!this.keys[index]) {
                this.keys.splice(index, 1, guid());
              }

              return (
                <div
                  className={cx(`Combo-item`, itemClassName)}
                  key={this.keys[index]}
                >
                  {!isStatic && !disabled && draggable && thelist.length > 1 ? (
                    <div className={cx('Combo-itemDrager')}>
                      <a
                        key="drag"
                        data-tooltip={__('Combo.dragDropSort')}
                        data-position="bottom"
                      >
                        {dragIcon ? (
                          <i className={dragIcon} />
                        ) : (
                          <Icon icon="drag-bar" className="icon" />
                        )}
                      </a>
                    </div>
                  ) : null}
                  {condition && typeSwitchable !== false ? (
                    <div className={cx('Combo-itemTag')}>
                      <label>{__('Combo.type')}</label>
                      <Select
                        onChange={this.handleComboTypeChange.bind(this, index)}
                        options={(conditions as Array<ComboCondition>).map(
                          item => ({
                            label: item.label,
                            value: item.label
                          })
                        )}
                        value={condition.label}
                        clearable={false}
                      />
                    </div>
                  ) : null}
                  <div className={cx(`Combo-itemInner`)}>
                    {finnalControls ? (
                      this.renderItems(finnalControls, data, index)
                    ) : (
                      <Alert2 level="warning" className="m-b-none">
                        {__('Combo.invalidData')}
                      </Alert2>
                    )}
                  </div>
                  {delBtn}
                </div>
              );
            })
          ) : placeholder ? (
            <div className={cx(`Combo-placeholder`)}>{__(placeholder)}</div>
          ) : null}
        </div>
        {!isStatic && !disabled ? (
          <div className={cx(`Combo-toolbar`)}>
            {this.renderAddBtn()}
            {draggable ? (
              <span className={cx(`Combo-dragableTip`)} ref={this.dragTipRef}>
                {Array.isArray(value) && value.length > 1
                  ? __(draggableTip)
                  : ''}
              </span>
            ) : null}
          </div>
        ) : null}
      </div>
    );
  }

  renderSingle() {
    const {
      conditions,
      classnames: cx,
      value,
      multiLine,
      noBorder,
      disabled,
      typeSwitchable,
      nullable,
      translate: __,
      itemClassName,
      mobileUI
    } = this.props;

    let items = this.props.items;
    const data = isObject(value) ? this.formatValue(value) : this.defaultValue;
    let condition: ComboCondition | null = null;

    if (Array.isArray(conditions) && conditions.length) {
      condition = this.pickCondition(data);
      items = condition ? condition.items : undefined;
    }

    return (
      <div
        className={cx(
          `Combo Combo--single`,
          {
            'is-mobile': mobileUI
          },
          multiLine ? `Combo--ver` : `Combo--hor`,
          noBorder ? `Combo--noBorder` : '',
          disabled ? 'is-disabled' : ''
        )}
      >
        <div className={cx(`Combo-item`, itemClassName)}>
          {condition && typeSwitchable !== false ? (
            <div className={cx('Combo-itemTag')}>
              <label>{__('Combo.type')}</label>
              <Select
                onChange={this.handleComboTypeChange.bind(this, 0)}
                options={(conditions as Array<ComboCondition>).map(item => ({
                  label: item.label,
                  value: item.label
                }))}
                value={condition.label}
                clearable={false}
              />
            </div>
          ) : null}

          <div className={cx(`Combo-itemInner`)}>
            {items ? (
              this.renderItems(items, data)
            ) : (
              <Alert2 level="warning" className="m-b-none">
                {__('Combo.invalidData')}
              </Alert2>
            )}
          </div>
        </div>
        {value && nullable ? (
          <a className={cx('Combo-setNullBtn')} href="#" onClick={this.setNull}>
            {__('clear')}
          </a>
        ) : null}
      </div>
    );
  }

  // 为了给 editor 重写使用
  renderItems(finnalControls: ComboSubControl[], data: object, index?: number) {
    const {
      classnames: cx,
      formClassName,
      render,
      multiLine,
      disabled,
      canAccessSuperData,
      multiple,
      tabsMode,
      subFormMode,
      subFormHorizontal,
      changeImmediately,
      lazyLoad,
      translate: __,
      static: isStatic,
      updatePristineAfterStoreDataReInit
    } = this.props;

    // 单个
    if (!multiple) {
      return render(
        'single',
        {
          type: 'form',
          body: finnalControls,
          wrapperComponent: 'div',
          wrapWithPanel: false,
          mode: multiLine ? subFormMode || 'normal' : 'row',
          horizontal: subFormHorizontal,
          className: cx(`Combo-form`, formClassName)
        },
        {
          disabled: disabled,
          static: isStatic,
          data,
          onChange: this.handleSingleFormChange,
          ref: this.makeFormRef(0),
          onInit: this.handleSingleFormInit,
          canAccessSuperData,
          formStore: undefined,
          updatePristineAfterStoreDataReInit:
            updatePristineAfterStoreDataReInit ?? false
        }
      );
    } else if (multiple && index !== undefined && index >= 0) {
      return render(
        `multiple/${index}`,
        {
          type: 'form',
          body: finnalControls,
          wrapperComponent: 'div',
          wrapWithPanel: false,
          mode: tabsMode ? subFormMode : multiLine ? subFormMode : 'row',
          horizontal: subFormHorizontal,
          className: cx(`Combo-form`, formClassName)
        },
        {
          index,
          disabled,
          static: isStatic,
          data,
          onChange: this.handleChange,
          onInit: this.handleFormInit,
          onAction: this.handleAction,
          onRadioChange: this.handleRadioChange,
          ref: this.makeFormRef(index),
          canAccessSuperData,
          lazyChange: changeImmediately ? false : true,
          formLazyChange: false,
          value: undefined,
          formItemValue: undefined,
          formStore: undefined,
          ...(tabsMode ? {} : {lazyLoad}),
          updatePristineAfterStoreDataReInit:
            updatePristineAfterStoreDataReInit ?? false
        }
      );
    }
    return <></>;
  }

  renderStatic(displayValue = '-') {
    // 如有 staticSchema 会被拦截渲染schema, 不会走到这里
    return this.props.render(
      'static-input-kv',
      {
        type: 'json'
      },
      this.props
    );
  }

  render() {
    const {
      type,
      formInited,
      multiple,
      className,
      style,
      classPrefix: ns,
      classnames: cx,
      static: isStatic,
      staticSchema
    } = this.props;

    // 静态展示时
    // 当有staticSchema 或 type = input-kv | input-kvs
    // 才拦截处理，其他情况交给子表单项处理即可
    if (
      isStatic &&
      (staticSchema || ['input-kv', 'input-kvs'].includes(type))
    ) {
      return this.renderStatic();
    }

    return formInited || typeof formInited === 'undefined' ? (
      <div className={cx(`ComboControl`, className)}>
        {multiple ? this.renderMultipe() : this.renderSingle()}
      </div>
    ) : null;
  }
}

@FormItem({
  type: 'combo',
  storeType: ComboStore.name,
  extendsData: false,
  shouldComponentUpdate: (props: any, prevProps: any) =>
    (isPureVariable(props.maxLength) &&
      resolveVariableAndFilter(prevProps.maxLength, prevProps.data) !==
        resolveVariableAndFilter(props.maxLength, props.data)) ||
    (isPureVariable(props.minLength) &&
      resolveVariableAndFilter(prevProps.minLength, prevProps.data) !==
        resolveVariableAndFilter(props.minLength, props.data))
})
export class ComboControlRenderer extends ComboControl {
  // 支持更新指定索引的值
  async setData(
    value: any,
    replace?: boolean,
    index?: number | string,
    condition?: any
  ) {
    const {multiple, onChange, submitOnChange} = this.props;
    if (multiple) {
      let items = [...this.getValueAsArray()];
      const len = items.length;
      if (index !== undefined) {
        const indexs = String(index).split(',');
        indexs.forEach(i => {
          const intIndex = Number(i);
          items.splice(intIndex, 1, {...items[intIndex], ...value}); // 默认merge
        });
        onChange?.(items, submitOnChange, true);
      } else if (condition !== undefined) {
        for (let i = 0; i < len; i++) {
          const item = items[i];
          const isUpdate = await evalExpressionWithConditionBuilder(
            condition,
            item
          );

          if (isUpdate) {
            items.splice(i, 1, {...items[i], ...value}); // 默认merge
          }
        }

        onChange?.(items, submitOnChange, true);
      } else {
        onChange?.(value, submitOnChange, true);
      }
    } else {
      onChange?.(value, submitOnChange, true);
    }
  }
}

@FormItem({
  type: 'input-kv',
  storeType: ComboStore.name,
  extendsData: false
})
export class KVControlRenderer extends ComboControl {}

@FormItem({
  type: 'input-kvs',
  storeType: ComboStore.name,
  extendsData: false
})
export class KVSControlRenderer extends ComboControl {}
