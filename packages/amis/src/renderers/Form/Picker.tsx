import React from 'react';
import {
  OptionsControl,
  OptionsControlProps,
  Option,
  FormOptionsControl
} from 'amis-core';
import cx from 'classnames';

import {SchemaNode, Schema, ActionObject, PlainObject} from 'amis-core';
import find from 'lodash/find';
import {
  anyChanged,
  autobind,
  getVariable,
  noop,
  createObject,
  isObjectShallowModified
} from 'amis-core';
import findIndex from 'lodash/findIndex';
import {Html} from 'amis-ui';
import {filter} from 'amis-core';
import {Icon} from 'amis-ui';
import {dataMapping, isPureVariable, resolveVariableAndFilter} from 'amis-core';
import {FormOptionsSchema, SchemaCollection, SchemaTpl} from '../../Schema';
import {CRUDSchema} from '../CRUD';
import {isApiOutdated, isEffectiveApi} from 'amis-core';

/**
 * Picker
 * 文档：https://baidu.gitee.io/amis/docs/components/form/picker
 */
export interface PickerControlSchema extends FormOptionsSchema {
  type: 'picker';

  /**
   * 可用来生成选中的值的描述文字
   */
  labelTpl?: SchemaTpl;

  /**
   * 建议用 labelTpl
   * 选中一个字段名用来作为值的描述文字
   */
  labelField?: string;

  /**
   * 选一个可以用来作为值的字段。
   */
  valueField?: string;

  /**
   * 弹窗选择框详情。
   */
  pickerSchema?: any; // Omit<CRUDSchema, 'type'>;

  /**
   * 弹窗模式，dialog 或者 drawer
   */
  modalMode?: 'dialog' | 'drawer';

  /**
   * 内嵌模式，也就是说不弹框了。
   */
  embed?: boolean;
}

export interface PickerProps extends OptionsControlProps {
  modalMode: 'dialog' | 'drawer';
  pickerSchema: PlainObject;
  labelField: string;
}

export interface PickerState {
  isOpened: boolean;
  isFocused: boolean;
  schema: SchemaNode;
}

export default class PickerControl extends React.PureComponent<
  PickerProps,
  any
> {
  static propsList: Array<string> = [
    'modalMode',
    'pickerSchema',
    'labelField',
    'onChange',
    'options',
    'value',
    'inline',
    'multiple',
    'embed',
    'resetValue',
    'placeholder',
    'onQuery' // 防止 Form 的 onQuery 事件透传下去，不然会导致 table 先后触发 Form 和 Crud 的 onQuery
  ];
  static defaultProps: Partial<PickerProps> = {
    modalMode: 'dialog',
    multiple: false,
    placeholder: 'Picker.placeholder',
    labelField: 'label',
    valueField: 'value',
    pickerSchema: {
      mode: 'list',
      listItem: {
        title: '${label|raw}'
      }
    },
    embed: false
  };

  state: PickerState = {
    isOpened: false,
    schema: this.buildSchema(this.props),
    isFocused: false
  };

  input: React.RefObject<HTMLInputElement> = React.createRef();

  componentDidMount() {
    this.fetchOptions();
  }

  componentDidUpdate(prevProps: PickerProps) {
    const props = this.props;

    if (anyChanged(['pickerSchema', 'multiple', 'source'], prevProps, props)) {
      this.setState({
        schema: this.buildSchema(props)
      });
    } else if (
      JSON.stringify(props.value) !== JSON.stringify(prevProps.value)
    ) {
      this.fetchOptions();
    } else if (
      isApiOutdated(prevProps.source, props.source, prevProps.data, props.data)
    ) {
      this.fetchOptions();
    }
  }

  fetchOptions() {
    const {value, formItem, valueField, labelField, source, data} = this.props;
    let selectedOptions: any;

    if (
      !source ||
      !formItem ||
      (valueField || 'value') === (labelField || 'label') ||
      ((selectedOptions = formItem.getSelectedOptions(value)) &&
        (!selectedOptions.length ||
          selectedOptions[0][valueField || 'value'] !==
            selectedOptions[0][labelField || 'label']))
    ) {
      return;
    }

    const ctx = createObject(data, {
      value: value,
      op: 'loadOptions'
    });

    if (isPureVariable(source)) {
      formItem.setOptions(resolveVariableAndFilter(source, data, '| raw'));
    } else if (isEffectiveApi(source, ctx)) {
      formItem.loadOptions(source, ctx, {
        autoAppend: true
      });
    }
  }

  buildSchema(props: PickerProps) {
    const isScopeData = isPureVariable(props.source);

    return {
      checkOnItemClick: true,
      ...props.pickerSchema,
      labelTpl: props.pickerSchema?.labelTpl ?? props.labelTpl,
      type: 'crud',
      pickerMode: true,
      syncLocation: false,
      api: isScopeData ? null : props.source,
      source: isScopeData ? props.source : null,
      keepItemSelectionOnPageChange: true,
      valueField: props.valueField,
      labelField: props.labelField,

      // 不支持批量操作，会乱套
      bulkActions: props.multiple
        ? (props.pickerSchema as Schema).bulkActions
        : []
    };
  }

  crud: any;

  @autobind
  crudRef(ref: any) {
    while (ref && ref.getWrappedInstance) {
      ref = ref.getWrappedInstance();
    }
    this.crud = ref;
  }

  reload() {
    if (this.crud) {
      this.crud.search();
    } else {
      const reload = this.props.reloadOptions;
      reload && reload();
    }
  }

  @autobind
  open() {
    this.setState({
      isOpened: true
    });
  }

  @autobind
  close() {
    this.setState({
      isOpened: false
    });
  }

  @autobind
  handleModalConfirm(
    values: Array<any>,
    action: ActionObject,
    ctx: any,
    components: Array<any>
  ) {
    const idx = findIndex(
      components,
      (item: any) => item.props.type === 'crud'
    );
    this.handleChange(values[idx].items);
    this.close();
  }

  @autobind
  async handleChange(items: Array<any>) {
    const {
      joinValues,
      valueField,
      delimiter,
      extractValue,
      multiple,
      options,
      data,
      dispatchEvent,
      setOptions,
      onChange
    } = this.props;

    let value: any = items;

    if (joinValues) {
      value = items
        .map((item: any) => item[valueField || 'value'])
        .join(delimiter || ',');
    } else if (extractValue) {
      value = multiple
        ? items.map((item: any) => item[valueField || 'value'])
        : (items[0] && items[0][valueField || 'value']) || '';
    } else {
      value = multiple ? items : items[0];
    }

    let additionalOptions: Array<any> = [];
    items.forEach(item => {
      if (
        !find(
          options,
          option => item[valueField || 'value'] == option[valueField || 'value']
        )
      ) {
        additionalOptions.push(item);
      }
    });

    additionalOptions.length && setOptions(options.concat(additionalOptions));
    const rendererEvent = await dispatchEvent(
      'change',
      createObject(data, {value, option: items[0]})
    );
    if (rendererEvent?.prevented) {
      return;
    }

    onChange(value);
  }

  removeItem(index: number) {
    const {
      selectedOptions,
      joinValues,
      extractValue,
      delimiter,
      valueField,
      onChange,
      multiple
    } = this.props;
    const items = selectedOptions.concat();
    items.splice(index, 1);

    let value: any = items;

    if (joinValues) {
      value = items
        .map((item: any) => item[valueField || 'value'])
        .join(delimiter || ',');
    } else if (extractValue) {
      value = multiple
        ? items.map((item: any) => item[valueField || 'value'])
        : (items[0] && items[0][valueField || 'value']) || '';
    } else {
      value = multiple ? items : items[0];
    }

    onChange(value);
  }

  @autobind
  handleKeyDown(e: React.KeyboardEvent) {
    const selectedOptions = this.props.selectedOptions;

    if (e.key === ' ') {
      this.open();
      e.preventDefault();
    } else if (selectedOptions.length && e.key == 'Backspace') {
      this.removeItem(selectedOptions.length - 1);
    }
  }

  @autobind
  handleFocus() {
    this.setState({
      isFocused: true
    });
  }

  @autobind
  handleBlur() {
    this.setState({
      isFocused: false
    });
  }

  @autobind
  handleClick() {
    this.input.current && this.input.current.focus();
    this.open();
  }

  @autobind
  clearValue() {
    const {onChange, resetValue} = this.props;

    onChange(resetValue !== void 0 ? resetValue : '');
  }

  renderValues() {
    const {
      classPrefix: ns,
      selectedOptions,
      labelField,
      labelTpl,
      translate: __,
      disabled
    } = this.props;

    return (
      <div className={`${ns}Picker-values`}>
        {selectedOptions.map((item, index) => (
          <div
            key={index}
            className={cx(`${ns}Picker-value`, {
              'is-disabled': disabled
            })}
          >
            <span
              data-tooltip={__('delete')}
              data-position="bottom"
              className={`${ns}Picker-valueIcon`}
              onClick={e => {
                e.stopPropagation();
                this.removeItem(index);
              }}
            >
              ×
            </span>
            <span className={`${ns}Picker-valueLabel`}>
              {labelTpl ? (
                <Html html={filter(labelTpl, item)} />
              ) : (
                `${
                  getVariable(item, labelField || 'label') ||
                  getVariable(item, 'id')
                }`
              )}
            </span>
          </div>
        ))}
      </div>
    );
  }

  @autobind
  renderBody({popOverContainer}: any = {}) {
    const {
      render,
      selectedOptions,
      options,
      multiple,
      valueField,
      embed,
      source
    } = this.props;

    return render('modal-body', this.state.schema, {
      value: selectedOptions,
      valueField,
      primaryField: valueField,
      options: source ? [] : options,
      multiple,
      onSelect: embed ? this.handleChange : undefined,
      ref: this.crudRef,
      popOverContainer
    }) as JSX.Element;
  }

  render() {
    const {
      className,
      classnames: cx,
      disabled,
      render,
      modalMode,
      source,
      size,
      env,
      clearable,
      multiple,
      placeholder,
      embed,
      value,
      selectedOptions,
      translate: __,
      popOverContainer
    } = this.props;
    return (
      <div className={cx(`PickerControl`, className)}>
        {embed ? (
          <div className={cx('Picker')}>
            {this.renderBody({popOverContainer})}
          </div>
        ) : (
          <div
            className={cx(`Picker`, {
              'Picker--single': !multiple,
              'Picker--multi': multiple,
              'is-focused': this.state.isFocused,
              'is-disabled': disabled
            })}
          >
            <div onClick={this.handleClick} className={cx('Picker-input')}>
              {!selectedOptions.length && placeholder ? (
                <div className={cx('Picker-placeholder')}>
                  {__(placeholder)}
                </div>
              ) : null}

              <div className={cx('Picker-valueWrap')}>
                {this.renderValues()}

                <input
                  onChange={noop}
                  value={''}
                  ref={this.input}
                  onKeyDown={this.handleKeyDown}
                  onFocus={this.handleFocus}
                  onBlur={this.handleBlur}
                />
              </div>

              {clearable && !disabled && selectedOptions.length ? (
                <a onClick={this.clearValue} className={cx('Picker-clear')}>
                  <Icon icon="input-clear" className="icon" />
                </a>
              ) : null}

              <span onClick={this.open} className={cx('Picker-btn')}>
                <Icon icon="window-restore" className="icon" />
              </span>
            </div>

            {render(
              'modal',
              {
                title: __('Select.placeholder'),
                size: size,
                type: modalMode,
                body: {
                  children: this.renderBody
                }
              },
              {
                key: 'modal',
                lazyRender: !!source,
                onConfirm: this.handleModalConfirm,
                onClose: this.close,
                show: this.state.isOpened
              }
            )}
          </div>
        )}
      </div>
    );
  }
}

@OptionsControl({
  type: 'picker',
  autoLoadOptionsFromSource: false,
  sizeMutable: false
})
export class PickerControlRenderer extends PickerControl {}
