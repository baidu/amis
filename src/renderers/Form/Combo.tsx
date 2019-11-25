import React from 'react';
import {findDOMNode} from 'react-dom';
import {FormItem, FormControlProps} from './Item';
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
import Sortable = require('sortablejs');
import {evalExpression, filter} from '../../utils/tpl';
import find = require('lodash/find');
import Select from '../../components/Select';
import {dataMapping} from '../../utils/tpl-builtin';
import {isEffectiveApi} from '../../utils/api';
import {Alert2} from '../../components';

export interface Condition {
  test: string;
  controls: Array<Schema>;
  label: string;
  scaffold?: any;
  mode?: string;
}

export interface ComboProps extends FormControlProps {
  placeholder?: string;
  flat?: boolean; // 是否把值打平，即原来是对象现在只有对象中的值。
  draggable?: boolean; // 是否可拖拽
  controls?: Array<Schema>;
  conditions?: Array<Condition>;
  multiple?: boolean;
  multiLine?: boolean;
  minLength?: number;
  maxLength?: number;
  scaffold?: any;
  addButtonClassName?: string;
  formClassName?: string;
  addButtonText?: string;
  addable?: boolean;
  typeSwitchable?: boolean;
  removable?: boolean;
  deleteApi?: Api;
  deleteConfirmText?: string;
  canAccessSuperData?: boolean;
  subFormMode?: 'normal' | 'inline' | 'horizontal';
  noBorder?: boolean;
  joinValues?: boolean;
  delimiter?: string;
  dragIcon: string;
  deleteIcon: string;
  store: IComboStore;
  tabsMode: boolean;
  tabsStyle: '' | 'line' | 'card' | 'radio';
  tabsLabelTpl?: string;
  messages?: {
    validateFailed?: string;
    minLengthValidateFailed?: string;
    maxLengthValidateFailed?: string;
  };
}

export default class ComboControl extends React.Component<ComboProps> {
  static defaultProps = {
    minLength: 0,
    maxLength: 0,
    multiple: false,
    multiLine: false,
    addButtonClassName: '',
    formClassName: '',
    subFormMode: 'normal',
    draggableTip: '可拖拽排序',
    addButtonText: '新增',
    canAccessSuperData: false,
    addIcon: 'fa fa-plus',
    dragIcon: 'glyphicon glyphicon-sort',
    deleteIcon: 'glyphicon glyphicon-remove',
    tabsMode: false,
    tabsStyle: ''
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
    'tabsStyle'
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
    this.handleComboTypeChange = this.handleComboTypeChange.bind(this);
    this.defaultValue = {
      ...props.scaffold
    };
  }

  componentWillMount() {
    const {store, value, minLength, maxLength, formItem} = this.props;

    store.config({
      minLength,
      maxLength,
      length: this.getValueAsArray().length
    });

    formItem && formItem.setSubStore(store);
  }

  componentWillReceiveProps(nextProps: ComboProps) {
    const props = this.props;

    if (anyChanged(['minLength', 'maxLength', 'value'], props, nextProps)) {
      const {store, minLength, maxLength} = nextProps;
      const values = this.getValueAsArray(nextProps);

      store.config({
        minLength,
        maxLength,
        length: values.length
      });

      if (store.activeKey >= values.length) {
        store.setActiveKey(Math.max(0, values.length - 1));
      }
    }
  }

  componentWillUnmount() {
    const {formItem} = this.props;

    formItem && formItem.setSubStore(null);
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

  addItemWith(condition: Condition) {
    const {
      flat,
      joinValues,
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
    const {
      flat,
      joinValues,
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
      env
    } = this.props;

    if (disabled) {
      return;
    }

    let value = this.getValueAsArray();
    const ctx = createObject(data, value[key]);

    if (isEffectiveApi(deleteApi, ctx)) {
      const confirmed = await env.confirm(
        deleteConfirmText ? filter(deleteConfirmText, ctx) : '确认要删除？'
      );
      if (!confirmed) {
        // 如果不确认，则跳过！
        return;
      }

      const result = await env.fetcher(deleteApi as Api, ctx);

      if (!result.ok) {
        env.notify('error', '删除失败');
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
    const {
      formItem,
      flat,
      store,
      joinValues,
      delimiter,
      disabled,
      validateOnChange,
      submitOnChange
    } = this.props;

    if (disabled) {
      return;
    }

    let value = this.getValueAsArray();
    value[index] = flat ? values.flat : {...values};

    if (flat && joinValues) {
      value = value.join(delimiter || ',');
    }

    this.props.onChange(value, submitOnChange, true);

    if (validateOnChange !== false && formItem && formItem.validated) {
      this.subForms.forEach(item => item.validate());
    }

    store.forms.forEach(item =>
      item.items.forEach(item => item.unique && item.syncOptions())
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
      disabled,
      flat,
      joinValues,
      delimiter,
      formInited,
      onChange,
      submitOnChange,
      setPrinstineValue
    } = this.props;

    if (syncDefaultValue === false || disabled) {
      return;
    }

    this.subFormDefaultValues.push({
      index,
      values,
      setted: false
    });

    if (this.subFormDefaultValues.length !== this.subForms.length) {
      return;
    }

    let value = this.getValueAsArray();
    this.subFormDefaultValues = this.subFormDefaultValues.map(
      ({index, values, setted}) => {
        const newValue = flat ? values.flat : {...values};

        if (!setted && isObjectShallowModified(value[index], newValue)) {
          value[index] = flat ? values.flat : {...values};
        }

        return {
          index,
          values,
          setted: true
        };
      }
    );

    if (flat && joinValues) {
      value = value.join(delimiter || ',');
    }

    formInited
      ? onChange(value, submitOnChange, true)
      : setPrinstineValue(value);
  }

  handleSingleFormInit(values: any) {
    this.props.syncDefaultValue !== false &&
      this.props.setPrinstineValue &&
      this.props.setPrinstineValue({
        ...values
      });
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
    const {value, minLength, maxLength, messages} = this.props;

    if (minLength && (!Array.isArray(value) || value.length < minLength)) {
      return (
        (messages && messages.minLengthValidateFailed) ||
        `组合表单成员数量不够，低于设定的最小${minLength}个，请添加更多的成员。`
      );
    } else if (maxLength && Array.isArray(value) && value.length > maxLength) {
      return (
        (messages && messages.maxLengthValidateFailed) ||
        `组合表单成员数量超出，超出设定的最大${maxLength}个，请删除多余的成员。`
      );
    } else if (this.subForms.length) {
      return Promise.all(this.subForms.map(item => item.validate())).then(
        values => {
          if (~values.indexOf(false)) {
            return (
              (messages && messages.validateFailed) ||
              '子表单验证失败，请仔细检查'
            );
          }

          return;
        }
      );
    }
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
        group: 'combo',
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

  formRef(ref: any, index: number = 0) {
    if (ref) {
      while (ref && ref.getWrappedInstance) {
        ref = ref.getWrappedInstance();
      }
      this.subForms[index] = ref;
    } else {
      this.subForms.splice(index, 1);
      this.subFormDefaultValues.splice(index, 1);
    }
  }

  formatValue(value: any, index: number) {
    const {flat, data} = this.props;

    if (flat) {
      value = {
        flat: value
      };
    }

    value = value || this.defaultValue;
    return createObject(
      extendObject(data, {index, __index: index, ...data}),
      value
    );
  }

  pickCondition(value: any): Condition | null {
    const conditions: Array<Condition> = this.props.conditions!;
    return find(
      conditions,
      item => item.test && evalExpression(item.test, value)
    ) as Condition | null;
  }

  handleComboTypeChange(index: number, selection: any) {
    const {multiple, onChange, value, flat, submitOnChange} = this.props;

    const conditions: Array<Condition> = this.props.conditions as Array<
      Condition
    >;
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

  renderPlaceholder() {
    return (
      <span className="text-muted">{this.props.placeholder || '没有数据'}</span>
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
      conditions
    } = this.props;

    let controls = this.props.controls;
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
        mode={tabsStyle}
        activeKey={store.activeKey}
        onSelect={this.handleTabSelect}
        additionBtns={
          !disabled ? (
            <li className={cx(`Tabs-link`)}>
              {store.addable && addable !== false ? (
                Array.isArray(conditions) && conditions.length ? (
                  render(
                    'add-button',
                    {
                      type: 'dropdown-button',
                      icon: addIcon,
                      label: addButtonText || '新增',
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
                  <a onClick={this.addItem} data-tooltip="新增一条数据">
                    {addIcon ? <i className={cx('m-r-xs', addIcon)} /> : null}
                    <span>{addButtonText || '新增'}</span>
                  </a>
                )
              ) : null}
            </li>
          ) : null
        }
      >
        {value.map((value, index) => {
          const data = this.formatValue(value, index);
          let condition: Condition | null | undefined = null;
          let toolbar = undefined;
          if (
            finnalRemovable && // 表达式判断单条是否可删除
            (!itemRemovableOn ||
              evalExpression(itemRemovableOn, value) !== false)
          ) {
            toolbar = (
              <a
                onClick={this.removeItem.bind(this, index)}
                key="remove"
                className={cx(
                  `Combo-toolbarBtn ${!store.removable ? 'is-disabled' : ''}`
                )}
                data-tooltip="删除"
                data-position="bottom"
              >
                <i className={deleteIcon} />
              </a>
            );
          }

          if (Array.isArray(conditions) && conditions.length) {
            condition = this.pickCondition(data);
            controls = condition ? condition.controls : undefined;
          }

          let finnalControls =
            flat && controls
              ? [
                  {
                    ...(controls && controls[0]),
                    name: 'flat'
                  }
                ]
              : controls;

          return (
            <Tab
              title={filter(tabsLabelTpl || '成员${index|plus}', data)}
              key={this.keys[index] || (this.keys[index] = guid())}
              toolbar={toolbar}
              eventKey={index}
              mountOnEnter={true}
              unmountOnExit={false}
            >
              {condition && typeSwitchable !== false ? (
                <div className={cx('Combo-itemTag')}>
                  <label>类型</label>
                  <Select
                    onChange={this.handleComboTypeChange.bind(this, index)}
                    options={(conditions as Array<Condition>).map(item => ({
                      label: item.label,
                      value: item.label
                    }))}
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
                      controls: finnalControls,
                      wrapperComponent: 'div',
                      wrapWithPanel: false,
                      mode: subFormMode,
                      className: cx(`Combo-form`, formClassName),
                      lazyOnChange: false
                    },
                    {
                      index,
                      disabled,
                      data,
                      onChange: this.handleChange,
                      onInit: this.handleFormInit,
                      onAction: this.handleAction,
                      ref: (ref: any) => this.formRef(ref, index),
                      canAccessSuperData,
                      value: undefined,
                      formItemValue: undefined
                    }
                  )
                ) : (
                  <Alert2 level="warning" className="m-b-none">
                    数据非法，或者数据已失效，请移除
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
      conditions
    } = this.props;

    let controls = this.props.controls;
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
          noBorder ? `Combo--noBorder` : ''
        )}
      >
        <div className={cx(`Combo-items`)}>
          {Array.isArray(value)
            ? value.map((value, index, thelist) => {
                const toolbar: Array<any> = [];

                if (!disabled && draggable && thelist.length > 1) {
                  toolbar.push(
                    <a
                      key="drag"
                      className={cx(`Combo-toolbarBtn Combo-itemDrager`)}
                      data-tooltip="拖拽排序"
                      data-position="bottom"
                    >
                      <i className={dragIcon} />
                    </a>
                  );
                }

                if (
                  finnalRemovable && // 表达式判断单条是否可删除
                  (!itemRemovableOn ||
                    evalExpression(itemRemovableOn, value) !== false)
                ) {
                  toolbar.push(
                    <a
                      onClick={this.removeItem.bind(this, index)}
                      key="remove"
                      className={cx(
                        `Combo-toolbarBtn ${
                          !store.removable ? 'is-disabled' : ''
                        }`
                      )}
                      data-tooltip="删除"
                      data-position="bottom"
                    >
                      <i className={deleteIcon} />
                    </a>
                  );
                }

                const data = this.formatValue(value, index);
                let condition: Condition | null = null;

                if (Array.isArray(conditions) && conditions.length) {
                  condition = this.pickCondition(data);
                  controls = condition ? condition.controls : undefined;
                }

                let finnalControls =
                  flat && controls
                    ? [
                        {
                          ...(controls && controls[0]),
                          name: 'flat'
                        }
                      ]
                    : controls;

                return (
                  <div
                    className={cx(`Combo-item`)}
                    key={this.keys[index] || (this.keys[index] = guid())}
                  >
                    {condition && typeSwitchable !== false ? (
                      <div className={cx('Combo-itemTag')}>
                        <label>类型</label>
                        <Select
                          onChange={this.handleComboTypeChange.bind(
                            this,
                            index
                          )}
                          options={(conditions as Array<Condition>).map(
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
                            controls: finnalControls,
                            wrapperComponent: 'div',
                            wrapWithPanel: false,
                            mode: multiLine ? subFormMode : 'row',
                            className: cx(`Combo-form`, formClassName),
                            lazyOnChange: false
                          },
                          {
                            index,
                            disabled,
                            data,
                            onChange: this.handleChange,
                            onInit: this.handleFormInit,
                            onAction: this.handleAction,
                            ref: (ref: any) => this.formRef(ref, index),
                            canAccessSuperData,
                            value: undefined,
                            formItemValue: undefined
                          }
                        )
                      ) : (
                        <Alert2 level="warning" className="m-b-none">
                          数据非法，或者数据已失效，请移除
                        </Alert2>
                      )}
                    </div>
                    {toolbar.length ? (
                      <div className={cx(`Combo-itemToolbar`)}>{toolbar}</div>
                    ) : null}
                  </div>
                );
              })
            : null}
        </div>
        {!disabled ? (
          <div className={cx(`Combo-toolbar`)}>
            {store.addable && addable !== false ? (
              Array.isArray(conditions) && conditions.length ? (
                render(
                  'add-button',
                  {
                    type: 'dropdown-button',
                    icon: addIcon,
                    label: addButtonText || '新增',
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
                  data-tooltip="新增一条数据"
                >
                  {addIcon ? (
                    <i className={cx('Button-icon', addIcon)} />
                  ) : null}
                  <span>{addButtonText || '新增'}</span>
                </button>
              )
            ) : null}
            {draggable ? (
              <span className={cx(`Combo-dragableTip`)} ref={this.dragTipRef}>
                {Array.isArray(value) && value.length > 1 ? draggableTip : ''}
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
      typeSwitchable
    } = this.props;

    let controls = this.props.controls;
    const data = isObject(value) ? value : this.defaultValue;
    let condition: Condition | null = null;

    if (Array.isArray(conditions) && conditions.length) {
      condition = this.pickCondition(data);
      controls = condition ? condition.controls : undefined;
    }

    return (
      <div
        className={cx(
          `Combo Combo--single`,
          multiLine ? `Combo--ver` : `Combo--hor`,
          noBorder ? `Combo--noBorder` : ''
        )}
      >
        <div className={cx(`Combo-item`)}>
          {condition && typeSwitchable !== false ? (
            <div className={cx('Combo-itemTag')}>
              <label>类型</label>
              <Select
                onChange={this.handleComboTypeChange.bind(this, 0)}
                options={(conditions as Array<Condition>).map(item => ({
                  label: item.label,
                  value: item.label
                }))}
                value={condition.label}
                clearable={false}
              />
            </div>
          ) : null}

          <div className={cx(`Combo-itemInner`)}>
            {controls ? (
              render(
                'single',
                {
                  type: 'form',
                  controls,
                  wrapperComponent: 'div',
                  wrapWithPanel: false,
                  mode: multiLine ? 'normal' : 'row',
                  className: cx(`Combo-form`, formClassName),
                  lazyOnChange: false
                },
                {
                  disabled: disabled,
                  data: isObject(value) ? value : this.defaultValue,
                  onChange: this.handleSingleFormChange,
                  ref: (ref: any) => this.formRef(ref),
                  onInit: this.handleSingleFormInit,
                  canAccessSuperData
                }
              )
            ) : (
              <Alert2 level="warning" className="m-b-none">
                数据非法，或者数据已失效，请移除
              </Alert2>
            )}
          </div>
        </div>
      </div>
    );
  }

  render() {
    const {multiple, className, classPrefix: ns, classnames: cx} = this.props;

    return (
      <div className={cx(`ComboControl`, className)}>
        {multiple ? this.renderMultipe() : this.renderSingle()}
      </div>
    );
  }
}

@FormItem({
  type: 'combo',
  storeType: ComboStore.name,
  extendsData: false
})
export class ComboControlRenderer extends ComboControl {}
