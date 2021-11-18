import React from 'react';
import {findDOMNode} from 'react-dom';
import {
  FormItem,
  FormControlProps,
  FormBaseControl,
  FormControlSchemaAlias
} from './Item';
import {Schema, Action, Api} from '../../types';
import {ComboStore, IComboStore} from '../../store/combo';
import {default as CTabs, Tab} from '../../components/Tabs';

import {
  guid,
  anyChanged,
  isObject,
  createObject,
  extendObject,
  autobind,
  isObjectShallowModified
} from '../../utils/helper';
import Sortable from 'sortablejs';
import {evalExpression, filter} from '../../utils/tpl';
import find from 'lodash/find';
import Select from '../../components/Select';
import {dataMapping, resolveVariable} from '../../utils/tpl-builtin';
import {isEffectiveApi} from '../../utils/api';
import {Alert2} from '../../components';
import memoize from 'lodash/memoize';
import {Icon} from '../../components/icons';
import {isAlive} from 'mobx-state-tree';
import {
  SchemaApi,
  SchemaClassName,
  SchemaCollection,
  SchemaIcon,
  SchemaObject,
  SchemaTpl
} from '../../Schema';

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
 * 文档：https://baidu.gitee.io/amis/docs/components/form/combo
 */
export interface ComboControlSchema extends FormBaseControl {
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
  maxLength?: number;

  /**
   * 限制最小个数
   */
  minLength?: number;

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
}

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
  > = {
    minLength: 0,
    maxLength: 0,
    multiple: false,
    multiLine: false,
    addButtonClassName: '',
    formClassName: '',
    subFormMode: 'normal',
    draggableTip: '',
    addButtonText: 'Combo.add',
    canAccessSuperData: false,
    addIcon: true,
    dragIcon: '',
    deleteIcon: '',
    tabsMode: false,
    tabsStyle: '',
    placeholder: 'placeholder.empty'
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
    'formStore'
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
    this.handleSingleFormChange = this.handleSingleFormChange.bind(this);
    this.handleSingleFormInit = this.handleSingleFormInit.bind(this);
    this.handleFormInit = this.handleFormInit.bind(this);
    this.handleAction = this.handleAction.bind(this);
    this.addItem = this.addItem.bind(this);
    this.removeItem = this.removeItem.bind(this);
    this.dragTipRef = this.dragTipRef.bind(this);
    this.flush = this.flush.bind(this);
    this.handleComboTypeChange = this.handleComboTypeChange.bind(this);
    this.defaultValue = {
      ...props.scaffold
    };

    const {store, value, multiple, minLength, maxLength, formItem, addHook} =
      props;

    store.config({
      multiple,
      minLength,
      maxLength,
      length: this.getValueAsArray(props).length
    });

    formItem && isAlive(formItem) && formItem.setSubStore(store);
    addHook && this.toDispose.push(addHook(this.flush, 'flush'));
  }

  componentDidUpdate(prevProps: ComboProps) {
    const props = this.props;

    if (anyChanged(['minLength', 'maxLength', 'value'], prevProps, props)) {
      const {store, minLength, maxLength, multiple} = props;
      const values = this.getValueAsArray(props);

      store.config({
        multiple,
        minLength,
        maxLength,
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

  getValueAsArray(props = this.props) {
    const {flat, joinValues, delimiter} = props;
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
    const {flat, joinValues, delimiter, scaffold, disabled, submitOnChange} =
      this.props;

    if (disabled) {
      return;
    }

    let value = this.getValueAsArray();

    value.push(
      flat
        ? condition.scaffold || scaffold || ''
        : {
            ...(condition.scaffold || scaffold)
          }
    );
    this.keys.push(guid());

    if (flat && joinValues) {
      value = value.join(delimiter || ',');
    }

    this.props.onChange(value, submitOnChange, true);
  }

  addItem() {
    const {flat, joinValues, delimiter, scaffold, disabled, submitOnChange} =
      this.props;

    if (disabled) {
      return;
    }

    let value = this.getValueAsArray();

    value.push(
      flat
        ? scaffold || ''
        : {
            ...scaffold
          }
    );
    this.keys.push(guid());

    if (flat && joinValues) {
      value = value.join(delimiter || ',');
    }

    this.props.onChange(value, submitOnChange, true);
  }

  async removeItem(key: number) {
    const {
      flat,
      joinValues,
      delimiter,
      disabled,
      deleteApi,
      deleteConfirmText,
      data,
      env,
      translate: __
    } = this.props;

    if (disabled) {
      return;
    }

    let value = this.getValueAsArray();
    const ctx = createObject(data, value[key]);

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
        env.notify('error', __('deleteFailed'));
        return;
      }
    }

    value.splice(key, 1);
    this.keys.splice(key, 1);

    if (flat && joinValues) {
      value = value.join(delimiter || ',');
    }

    this.props.onChange(value);
  }

  handleChange(values: any, diff: any, {index}: any) {
    const {flat, store, joinValues, delimiter, disabled, submitOnChange} =
      this.props;

    if (disabled) {
      return;
    }

    let value = this.getValueAsArray();
    value[index] = flat ? values.flat : {...values};

    if (flat && joinValues) {
      value = value.join(delimiter || ',');
    }

    this.props.onChange(value, submitOnChange, true);

    store.forms.forEach(
      form =>
        isAlive(form) &&
        form.items.forEach(
          item => item.unique && item.syncOptions(undefined, form.data)
        )
    );
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
      this.subFormDefaultValues.length !== this.subForms.length
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
      isObjectShallowModified(value, values) &&
      setPrinstineValue
    ) {
      setPrinstineValue({
        ...values
      });
    }
  }

  handleAction(action: Action): any {
    const {onAction} = this.props;

    if (action.actionType === 'delete') {
      action.index !== void 0 && this.removeItem(action.index);
      return;
    }

    onAction && onAction.apply(null, arguments);
  }

  validate(): any {
    const {
      value,
      minLength,
      maxLength,
      messages,
      nullable,
      translate: __
    } = this.props;

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
  handleTabSelect(key: number) {
    const {store} = this.props;

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
      return this.renderPlaceholder();
    }

    // todo 支持拖拽排序。

    return (
      <CTabs
        className={'ComboTabs'}
        mode={tabsStyle}
        activeKey={store.activeKey}
        onSelect={this.handleTabSelect}
        additionBtns={
          !disabled ? (
            <li className={cx(`Tabs-link ComboTabs-addLink`)}>
              {store.addable && addable !== false ? (
                Array.isArray(conditions) && conditions.length ? (
                  render(
                    'add-button',
                    {
                      type: 'dropdown-button',
                      icon: addIcon ? (
                        <Icon icon="plus" className="icon" />
                      ) : (
                        ''
                      ),
                      label: __(addButtonText || 'Combo.add'),
                      level: 'info',
                      size: 'sm',
                      closeOnClick: true
                    },
                    {
                      buttons: conditions.map(item => ({
                        label: item.label,
                        onClick: (e: any) => {
                          this.addItemWith(item);
                          return false;
                        }
                      }))
                    }
                  )
                ) : (
                  <a
                    onClick={this.addItem}
                    data-position="left"
                    data-tooltip={__('Combo.add')}
                  >
                    {addIcon ? <Icon icon="plus" className="icon" /> : null}
                    <span>{__(addButtonText || 'Combo.add')}</span>
                  </a>
                )
              ) : null}
            </li>
          ) : null
        }
      >
        {value.map((value, index) => {
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
                onClick={this.removeItem.bind(this, index)}
                key="remove"
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

          return (
            <Tab
              title={filter(
                tabsLabelTpl ||
                  __('{{index}}', {index: (data as any).index + 1}),
                data
              )}
              key={this.keys[index] || (this.keys[index] = guid())}
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
                  render(
                    `multiple/${index}`,
                    {
                      type: 'form',
                      body: finnalControls,
                      wrapperComponent: 'div',
                      wrapWithPanel: false,
                      mode: subFormMode,
                      className: cx(`Combo-form`, formClassName)
                    },
                    {
                      index,
                      disabled,
                      data,
                      onChange: this.handleChange,
                      onInit: this.handleFormInit,
                      onAction: this.handleAction,
                      ref: this.makeFormRef(index),
                      canAccessSuperData,
                      lazyChange: changeImmediately ? false : true,
                      formLazyChange: false,
                      value: undefined,
                      formItemValue: undefined,
                      formStore: undefined
                    }
                  )
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

  renderMultipe() {
    if (this.props.tabsMode) {
      return this.renderTabsMode();
    }

    const {
      classPrefix: ns,
      classnames: cx,
      formClassName,
      render,
      multiLine,
      addButtonClassName,
      disabled,
      store,
      flat,
      subFormMode,
      draggable,
      draggableTip,
      addButtonText,
      addable,
      removable,
      typeSwitchable,
      itemRemovableOn,
      delimiter,
      canAccessSuperData,
      addIcon,
      dragIcon,
      deleteIcon,
      noBorder,
      conditions,
      lazyLoad,
      changeImmediately,
      placeholder,
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

    return (
      <div
        className={cx(
          `Combo Combo--multi`,
          multiLine ? `Combo--ver` : `Combo--hor`,
          noBorder ? `Combo--noBorder` : '',
          disabled ? 'is-disabled' : '',
          !disabled && draggable && Array.isArray(value) && value.length > 1
            ? 'is-draggable'
            : ''
        )}
      >
        <div className={cx(`Combo-items`)}>
          {Array.isArray(value) && value.length ? (
            value.map((value, index, thelist) => {
              let delBtn: any = null;

              if (
                finnalRemovable && // 表达式判断单条是否可删除
                (!itemRemovableOn ||
                  evalExpression(itemRemovableOn, value) !== false)
              ) {
                delBtn = (
                  <a
                    onClick={this.removeItem.bind(this, index)}
                    key="remove"
                    className={cx(
                      `Combo-delBtn ${!store.removable ? 'is-disabled' : ''}`
                    )}
                    data-tooltip={__('delete')}
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

              return (
                <div
                  className={cx(`Combo-item`)}
                  key={this.keys[index] || (this.keys[index] = guid())}
                >
                  {!disabled && draggable && thelist.length > 1 ? (
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
                      render(
                        `multiple/${index}`,
                        {
                          type: 'form',
                          body: finnalControls,
                          wrapperComponent: 'div',
                          wrapWithPanel: false,
                          mode: multiLine ? subFormMode : 'row',
                          className: cx(`Combo-form`, formClassName)
                        },
                        {
                          index,
                          disabled,
                          data,
                          onChange: this.handleChange,
                          onInit: this.handleFormInit,
                          onAction: this.handleAction,
                          ref: this.makeFormRef(index),
                          lazyChange: changeImmediately ? false : true,
                          formLazyChange: false,
                          lazyLoad,
                          canAccessSuperData,
                          value: undefined,
                          formItemValue: undefined,
                          formStore: undefined
                        }
                      )
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
        {!disabled ? (
          <div className={cx(`Combo-toolbar`)}>
            {store.addable && addable !== false ? (
              Array.isArray(conditions) && conditions.length ? (
                render(
                  'add-button',
                  {
                    type: 'dropdown-button',
                    label: __(addButtonText || 'Combo.add'),
                    level: 'info',
                    size: 'sm',
                    closeOnClick: true
                  },
                  {
                    buttons: conditions.map(item => ({
                      label: item.label,
                      onClick: (e: any) => {
                        this.addItemWith(item);
                        return false;
                      }
                    }))
                  }
                )
              ) : (
                <button
                  type="button"
                  onClick={this.addItem}
                  className={cx(`Button Combo-addBtn`, addButtonClassName)}
                  data-tooltip={__('Combo.add')}
                >
                  {addIcon ? <Icon icon="plus" className="icon" /> : null}
                  <span>{__(addButtonText || 'Combo.add')}</span>
                </button>
              )
            ) : null}
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
      render,
      value,
      multiLine,
      formClassName,
      canAccessSuperData,
      noBorder,
      disabled,
      typeSwitchable,
      nullable,
      translate: __
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
          multiLine ? `Combo--ver` : `Combo--hor`,
          noBorder ? `Combo--noBorder` : '',
          disabled ? 'is-disabled' : ''
        )}
      >
        <div className={cx(`Combo-item`)}>
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
              render(
                'single',
                {
                  type: 'form',
                  body: items,
                  wrapperComponent: 'div',
                  wrapWithPanel: false,
                  mode: multiLine ? 'normal' : 'row',
                  className: cx(`Combo-form`, formClassName)
                },
                {
                  disabled: disabled,
                  data: data,
                  onChange: this.handleSingleFormChange,
                  ref: this.makeFormRef(0),
                  onInit: this.handleSingleFormInit,
                  canAccessSuperData,
                  formStore: undefined
                }
              )
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

  render() {
    const {
      formInited,
      multiple,
      className,
      classPrefix: ns,
      classnames: cx,
      disabled
    } = this.props;

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
  extendsData: false
})
export class ComboControlRenderer extends ComboControl {}

@FormItem({
  type: 'input-kv',
  storeType: ComboStore.name,
  extendsData: false
})
export class KVControlRenderer extends ComboControl {}
