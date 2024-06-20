import React from 'react';
import cx from 'classnames';
import omit from 'lodash/omit';
import find from 'lodash/find';
import isEqual from 'lodash/isEqual';
import findIndex from 'lodash/findIndex';
import merge from 'lodash/merge';
import {
  OptionsControl,
  OptionsControlProps,
  SchemaNode,
  Schema,
  ActionObject,
  PlainObject,
  autobind,
  getVariable,
  noop,
  createObject,
  filter,
  isPureVariable,
  resolveVariableAndFilter,
  isApiOutdated,
  isEffectiveApi,
  resolveEventData,
  CustomStyle,
  isIntegerInRange,
  setThemeClassName
} from 'amis-core';
import {Html, Icon, TooltipWrapper} from 'amis-ui';
import {FormOptionsSchema, SchemaTpl} from '../../Schema';
import intersectionWith from 'lodash/intersectionWith';
import type {TooltipWrapperSchema} from '../TooltipWrapper';
import type {Option} from 'amis-core';
import {supportStatic} from './StaticHoc';
import {reaction} from 'mobx';

/**
 * Picker
 * 文档：https://aisuda.bce.baidu.com/amis/zh-CN/components/form/picker
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
   * 弹窗的标题，默认为情选择
   */
  modalTitle?: string;

  /**
   * 内嵌模式，也就是说不弹框了。
   */
  embed?: boolean;

  /**
   * 开启最大标签展示数量的相关配置
   */
  overflowConfig: {
    /**
     * 标签的最大展示数量，超出数量后以收纳浮层的方式展示，仅在多选模式开启后生效
     */
    maxTagCount?: number;

    /**
     * 开启最大标签展示数量后，收纳标签生效的位置，未开启内嵌模式默认为选择器, 开启后默认为选择器 + 模态框，可选值为'select'(选择器)、'crud'(增删改查)
     */
    displayPosition?: ('select' | 'crud')[];

    /**
     * 开启最大标签展示数量后，选择器内收纳标签的Popover配置
     */
    overflowTagPopover?: TooltipWrapperSchema;

    /**
     * 开启最大标签展示数量后，CRUD顶部内收纳标签的Popover配置
     */
    overflowTagPopoverInCRUD?: TooltipWrapperSchema;
  };
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
    'modalTitle',
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
      mode: 'list'
    },
    embed: false,
    overflowConfig: {
      /** 默认值为-1，不开启 */
      maxTagCount: -1,
      displayPosition: ['select', 'crud'],
      overflowTagPopover: {
        placement: 'top',
        trigger: 'hover',
        showArrow: false,
        offset: [0, -10]
      },
      overflowTagPopoverInCRUD: {
        placement: 'bottom',
        trigger: 'hover',
        showArrow: false,
        offset: [0, 10]
      }
    }
  };

  state: PickerState = {
    isOpened: false,
    schema: this.buildSchema(this.props),
    isFocused: false
  };

  input: React.RefObject<HTMLInputElement> = React.createRef();
  toDispose: Array<() => void> = [];
  mounted = false;

  constructor(props: PickerProps) {
    super(props);

    const {formInited, addHook, formItem} = props;

    const onIninted = async () => {
      await this.fetchOptions();

      this.mounted &&
        this.toDispose.push(
          reaction(
            () => JSON.stringify(formItem?.tmpValue),
            () => this.fetchOptions()
          )
        );
    };

    formItem &&
      this.toDispose.push(
        formInited || !addHook
          ? formItem.addInitHook(onIninted)
          : addHook(onIninted, 'init')
      );
  }

  componentDidMount(): void {
    this.mounted = true;
  }

  componentDidUpdate(prevProps: PickerProps) {
    const props = this.props;
    const detectedProps = ['multiple', 'source', 'pickerSchema'];

    if (detectedProps.some(key => !isEqual(prevProps[key], props[key]))) {
      this.setState({
        schema: this.buildSchema(props)
      });
    } else if (
      isApiOutdated(prevProps.source, props.source, prevProps.data, props.data)
    ) {
      props.formItem?.inited && this.fetchOptions();
    }
  }

  componentWillUnmount(): void {
    this.toDispose.forEach(fn => fn());
    this.toDispose = [];
    this.mounted = false;
  }

  @autobind
  fetchOptions(): any {
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
      [valueField || 'value']: value,
      op: 'loadOptions'
    });

    if (isPureVariable(source)) {
      formItem.setOptions(resolveVariableAndFilter(source, data, '| raw'));
    } else if (isEffectiveApi(source, ctx)) {
      return formItem.loadOptions(source, ctx, {
        autoAppend: true
      });
    }
  }

  buildSchema(props: PickerProps) {
    const isScopeData = isPureVariable(props.source);

    return {
      checkOnItemClick: true,
      listItem: {
        title: `\${${props.labelField || 'label'}|raw}`
      },
      ...props.pickerSchema,
      labelTpl: props.pickerSchema?.labelTpl ?? props.labelTpl,
      type: 'crud',
      pickerMode: true,
      syncLocation: false,
      filterCanAccessSuperData: false,
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
  async handleModalConfirm(
    values: Array<any>,
    action: ActionObject,
    ctx: any,
    components: Array<any>
  ) {
    const idx = findIndex(
      components,
      (item: any) => item.props.type === 'crud'
    );

    await this.handleChange(values[idx].items);
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
      selectedOptions,
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
    const option = multiple ? items : items[0];
    const rendererEvent = await dispatchEvent(
      'change',
      resolveEventData(this.props, {value, option, selectedItems: option})
    );
    if (rendererEvent?.prevented) {
      return;
    }

    onChange(value);
  }

  @autobind
  async handleItemClick(item: any) {
    const {data, dispatchEvent} = this.props;

    const rendererEvent = await dispatchEvent(
      'itemClick',
      createObject(data, {item})
    );

    if (rendererEvent?.prevented) {
      return;
    }
  }

  async removeItem(index: number) {
    const {
      selectedOptions,
      joinValues,
      extractValue,
      delimiter,
      valueField,
      onChange,
      multiple,
      dispatchEvent
    } = this.props;
    const items = selectedOptions.concat();
    const [option] = items.splice(index, 1);

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

    const rendererEvent = await dispatchEvent(
      'change',
      resolveEventData(this.props, {value, option, selectedItems: option})
    );
    if (rendererEvent?.prevented) {
      return;
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

  getOverflowConfig() {
    const {overflowConfig} = this.props;

    return merge(PickerControl.defaultProps.overflowConfig, overflowConfig);
  }

  @autobind
  handleSelect(selectedItems: Array<any>, unSelectedItems: Array<any>) {
    const {selectedOptions, valueField} = this.props;
    // 选择行后，crud 会给出连续多次事件，且selectedItems会变化，会导致初始化和点击无效
    // 过滤掉一些无用事件，否则会导致 value 错误
    if (
      !Array.isArray(selectedItems) ||
      !Array.isArray(unSelectedItems) ||
      (!selectedItems.length && !unSelectedItems.length)
    ) {
      return;
    }

    // 取交集，判断是否是无效事件，需要考虑顺序问题
    const intersections = intersectionWith(
      selectedItems,
      selectedOptions,
      (a: any, b: any) => {
        // 需要考虑没有配置 valueField，而且值里面又没有 value 字段的情况
        const aValue = a[valueField || 'value'];
        const bValue = b[valueField || 'value'];
        return aValue || bValue
          ? aValue === bValue
          : // selectedOptions 中有 Options 自动添加的 value 字段，所以去掉后才能比较
            isEqual(omit(a, 'value'), omit(b, 'value'));
      }
    );
    if (
      // 前后数量都一样说明是重复事件
      intersections.length === selectedItems.length &&
      intersections.length === selectedOptions.length
    ) {
      return;
    }

    this.handleChange(selectedItems);
  }

  renderTag(item: Option, index: number) {
    const {
      classPrefix: ns,
      classnames: cx,
      labelField,
      labelTpl,
      translate: __,
      disabled,
      env,
      id,
      themeCss,
      css
    } = this.props;

    return (
      <div
        key={index}
        className={cx(
          `${ns}Picker-value`,
          setThemeClassName({
            ...this.props,
            name: 'pickValueWrapClassName',
            id,
            themeCss: themeCss || css
          }),
          {
            'is-disabled': disabled
          }
        )}
      >
        <span
          className={cx(
            `${ns}Picker-valueIcon`,
            setThemeClassName({
              ...this.props,
              name: 'pickValueIconClassName',
              id,
              themeCss: themeCss || css
            })
          )}
          onClick={e => {
            e.stopPropagation();
            this.removeItem(index);
          }}
        >
          ×
        </span>
        <span
          className={cx(
            `${ns}Picker-valueLabel`,
            setThemeClassName({
              ...this.props,
              name: 'pickFontClassName',
              id,
              themeCss: themeCss || css
            })
          )}
          onClick={e => {
            e.stopPropagation();
            this.handleItemClick(item);
          }}
        >
          {labelTpl ? (
            <Html html={filter(labelTpl, item)} filterHtml={env.filterHtml} />
          ) : (
            `${
              getVariable(item, labelField || 'label') ||
              getVariable(item, 'id')
            }`
          )}
        </span>
      </div>
    );
  }

  renderValues() {
    const {
      classPrefix: ns,
      selectedOptions,
      translate: __,
      disabled,
      multiple,
      popOverContainer,
      id,
      themeCss,
      css
    } = this.props;
    const {maxTagCount, overflowTagPopover} = this.getOverflowConfig();
    const totalCount = selectedOptions.length;
    let tags = selectedOptions;
    const enableOverflow =
      multiple !== false &&
      isIntegerInRange(maxTagCount, {
        start: 0,
        end: totalCount,
        left: 'inclusive',
        right: 'exclusive'
      });

    /** 多选且开启限制标签数量 */
    if (enableOverflow) {
      tags = [
        ...selectedOptions.slice(0, maxTagCount),
        {label: `+ ${totalCount - maxTagCount} ...`, value: '__overflow_tag__'}
      ];
    }

    return (
      <div className={`${ns}Picker-values`}>
        {tags.map((item, index) => {
          if (enableOverflow && index === maxTagCount) {
            return (
              <TooltipWrapper
                key={index}
                container={popOverContainer}
                tooltip={{
                  tooltipClassName: cx(
                    'Picker-overflow',
                    overflowTagPopover?.tooltipClassName
                  ),
                  title: __('已选项'),
                  ...omit(overflowTagPopover, [
                    'children',
                    'content',
                    'tooltipClassName'
                  ]),
                  children: () => {
                    return (
                      <div className={cx(`${ns}Picker-overflow-wrapper`)}>
                        {selectedOptions
                          .slice(maxTagCount, totalCount)
                          .map((overflowItem, rawIndex) => {
                            const key = rawIndex + maxTagCount;

                            return this.renderTag(overflowItem, key);
                          })}
                      </div>
                    );
                  }
                }}
              >
                <div
                  key={index}
                  className={cx(`${ns}Picker-value`, {
                    'is-disabled': disabled
                  })}
                >
                  <span
                    className={`${ns}Picker-valueLabel ${setThemeClassName({
                      ...this.props,
                      name: 'pickFontClassName',
                      id,
                      themeCss: themeCss || css
                    })}`}
                  >
                    {item.label}
                  </span>
                </div>
              </TooltipWrapper>
            );
          }

          return this.renderTag(item, index);
        })}
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
      source,
      strictMode,
      testIdBuilder
    } = this.props;
    const {maxTagCount, overflowTagPopoverInCRUD, displayPosition} =
      this.getOverflowConfig();

    return render('modal-body', this.state.schema, {
      value: selectedOptions,
      valueField,
      primaryField: valueField,
      options: source ? [] : options,
      multiple,
      strictMode,
      onSelect: embed ? this.handleSelect : undefined,
      testIdBuilder: testIdBuilder?.getChild('body-schema'),
      ref: this.crudRef,
      popOverContainer,
      ...(embed ||
      (Array.isArray(displayPosition) && displayPosition.includes('crud'))
        ? {maxTagCount, overflowTagPopover: overflowTagPopoverInCRUD}
        : {})
    }) as JSX.Element;
  }
  @supportStatic()
  render() {
    const {
      className,
      style,
      modalClassName,
      classnames: cx,
      disabled,
      render,
      modalMode,
      source,
      size,
      clearable,
      multiple,
      placeholder,
      embed,
      selectedOptions,
      translate: __,
      popOverContainer,
      modalTitle,
      data,
      mobileUI,
      env,
      themeCss,
      css,
      id,
      classPrefix: ns,
      testIdBuilder
    } = this.props;
    return (
      <div className={cx(`PickerControl`, {'is-mobile': mobileUI}, className)}>
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
            <div
              onClick={this.handleClick}
              className={cx(
                'Picker-input',
                setThemeClassName({
                  ...this.props,
                  name: 'pickControlClassName',
                  id,
                  themeCss: themeCss || css
                }),
                setThemeClassName({
                  ...this.props,
                  name: 'pickControlDisabledClassName',
                  id,
                  themeCss: themeCss || css
                })
              )}
            >
              {!selectedOptions.length && placeholder ? (
                <div className={cx('Picker-placeholder')}>
                  {__(placeholder)}
                </div>
              ) : null}

              <div
                className={cx('Picker-valueWrap')}
                {...testIdBuilder?.getTestId()}
              >
                {this.renderValues()}

                <input
                  onChange={noop}
                  value={''}
                  ref={this.input}
                  onKeyDown={this.handleKeyDown}
                  onFocus={this.handleFocus}
                  onBlur={this.handleBlur}
                  readOnly={mobileUI}
                />
              </div>

              {clearable && !disabled && selectedOptions.length ? (
                <a onClick={this.clearValue} className={cx('Picker-clear')}>
                  <Icon icon="input-clear" className="icon" />
                </a>
              ) : null}

              <span
                onClick={this.open}
                className={cx('Picker-btn')}
                {...testIdBuilder?.getChild('picker-open-btn').getTestId()}
              >
                <Icon
                  icon="window-restore"
                  className={cx(
                    'icon',
                    setThemeClassName({
                      ...this.props,
                      name: 'pickIconClassName',
                      id,
                      themeCss: themeCss || css
                    })
                  )}
                  iconContent="Picker-icon"
                />
              </span>
            </div>

            {render(
              'modal',
              {
                title:
                  modalTitle && typeof modalTitle === 'string'
                    ? filter(modalTitle, data)
                    : __('Select.placeholder'),
                size: size,
                type: modalMode,
                className: modalClassName,
                body: {
                  children: this.renderBody
                },
                testIdBuilder: testIdBuilder?.getChild('modal')
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
        <CustomStyle
          {...this.props}
          config={{
            themeCss: themeCss || css,
            classNames: [
              {
                key: 'pickControlClassName',
                weights: {
                  default: {
                    important: true
                  },
                  hover: {
                    important: true
                  },
                  active: {
                    important: true
                  },
                  disabled: {
                    important: true
                  }
                }
              },
              {
                key: 'pickControlDisabledClassName',
                weights: {
                  default: {
                    pre: `${ns}Picker.is-disabled> .${setThemeClassName({
                      ...this.props,
                      name: 'pickControlDisabledClassName',
                      id,
                      themeCss: themeCss || css
                    })}, `
                  }
                }
              },
              {
                key: 'pickFontClassName'
              },
              {
                key: 'pickValueWrapClassName',
                weights: {
                  default: {
                    important: true
                  }
                }
              },
              {
                key: 'pickValueIconClassName',
                weights: {
                  default: {
                    important: true
                  },
                  hover: {
                    important: true
                  }
                }
              },
              {
                key: 'pickIconClassName',
                weights: {
                  default: {
                    suf: ' svg'
                  }
                }
              }
            ],
            id: id
          }}
          env={env}
        />
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
