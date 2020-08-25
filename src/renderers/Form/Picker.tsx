import React from 'react';
import {OptionsControl, OptionsControlProps, Option} from './Options';
import cx from 'classnames';
import Button from '../../components/Button';
import {SchemaNode, Schema, Action} from '../../types';
import find from 'lodash/find';
import {
  anyChanged,
  autobind,
  getVariable,
  noop,
  createObject,
  isObjectShallowModified
} from '../../utils/helper';
import findIndex from 'lodash/findIndex';
import Html from '../../components/Html';
import {filter} from '../../utils/tpl';
import {Icon} from '../../components/icons';
import {isEmpty} from '../../utils/helper';
import {dataMapping} from '../../utils/tpl-builtin';

export interface PickerProps extends OptionsControlProps {
  modalMode: 'dialog' | 'drawer';
  pickerSchema: object;
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
    'placeholder'
  ];
  static defaultProps: Partial<PickerProps> = {
    modalMode: 'dialog',
    multiple: false,
    placeholder: '请点击按钮选择',
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

  componentWillReceiveProps(nextProps: PickerProps) {
    const props = this.props;

    if (anyChanged(['pickerSchema', 'multiple', 'source'], props, nextProps)) {
      this.setState({
        schema: this.buildSchema(nextProps)
      });
    }
  }

  componentDidUpdate(prevProps: PickerProps) {
    const props = this.props;

    if (JSON.stringify(props.value) !== JSON.stringify(prevProps.value)) {
      this.fetchOptions();
    }
  }

  fetchOptions() {
    const {value, formItem, valueField, labelField, source, data} = this.props;
    let selectedOptions: any;

    if (
      !source ||
      !formItem ||
      ((selectedOptions = formItem.getSelectedOptions(value)) &&
        (!selectedOptions.length ||
          selectedOptions[0][valueField || 'value'] !==
            selectedOptions[0][labelField || 'label']))
    ) {
      return;
    }

    formItem.loadOptions(
      source,
      createObject(data, {
        value: value,
        op: 'loadOptions'
      }),
      {
        autoAppend: true
      }
    );
  }

  buildSchema(props: PickerProps) {
    return {
      ...props.pickerSchema,
      type: 'crud',
      pickerMode: true,
      syncLocation: false,
      api: props.source,
      keepItemSelectionOnPageChange: true,
      valueField: props.valueField,
      labelField: props.labelField,
      checkOnItemClick: true,

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
    action: Action,
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
  handleChange(items: Array<any>) {
    const {
      joinValues,
      valueField,
      delimiter,
      extractValue,
      multiple,
      options,
      setOptions,
      onChange,
      autoFill,
      onBulkChange
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
    const sendTo =
      !multiple &&
      autoFill &&
      !isEmpty(autoFill) &&
      dataMapping(autoFill, value as Option);
    sendTo && onBulkChange(sendTo);
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
              data-tooltip="删除"
              data-position="bottom"
              className={`${ns}Picker-valueIcon`}
              onClick={this.removeItem.bind(this, index)}
            >
              ×
            </span>
            <span className={`${ns}Picker-valueLabel`}>
              {labelTpl ? (
                <Html html={filter(labelTpl, item)} />
              ) : (
                getVariable(item, labelField || 'label') ||
                getVariable(item, 'id')
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
      embed
    } = this.props;

    return render('modal-body', this.state.schema, {
      value: selectedOptions,
      valueField,
      primaryField: valueField,
      options: options,
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
                  <Icon icon="close" className="icon" />
                </a>
              ) : null}

              <span onClick={this.open} className={cx('Picker-btn')}>
                <Icon icon="window-restore" className="icon" />
              </span>
            </div>

            {render(
              'modal',
              {
                title: __('请选择'),
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
          // <div className={`${ns}Picker`}>
          //         {this.renderValues()}

          //         <Button
          //             classPrefix={ns}
          //             className={`${ns}Picker-pickBtn`}
          //             tooltip="点击选择"
          //             tooltipContainer={env && env.getModalContainer ? env.getModalContainer : undefined}
          //             level="info"
          //             size="sm"
          //             disabled={disabled}
          //             onClick={this.open}
          //             iconOnly
          //         >
          //         选定
          //         </Button>

          //         {render('modal', {
          //             title: '请选择',
          //             size: size,
          //             type: modalMode,
          //             body: {
          //                 children: this.renderBody
          //             }
          //         }, {
          //             key: 'modal',
          //             lazyRender: !!source,
          //             onConfirm: this.handleModalConfirm,
          //             onClose: this.close,
          //             show: this.state.isOpened
          //         })}
          //     </div>
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
