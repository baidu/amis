/**
 * @file 组件选项组件的可视化编辑控件
 */

import React from 'react';
import {findDOMNode} from 'react-dom';
import cx from 'classnames';
import uniqBy from 'lodash/uniqBy';
import omit from 'lodash/omit';
import Sortable from 'sortablejs';
import {
  render as amisRender,
  FormItem,
  Button,
  Checkbox,
  Icon,
  InputBox
} from 'amis';
import {value2array} from 'amis-ui/lib/components/Select';

import {autobind} from 'amis-editor-core';
import {getSchemaTpl} from 'amis-editor-core';
import {tipedLabel} from '../component/BaseControl';

import type {Option} from 'amis';
import type {FormControlProps} from 'amis-core';
import type {TextControlSchema} from 'amis/lib/renderers/Form/inputText';
import type {OptionValue} from 'amis-core';
import {SchemaApi} from 'amis/lib/Schema';

export type valueType = 'text' | 'boolean' | 'number';

export interface PopoverForm {
  optionLabel: string;
  optionValue: any;
  optionValueType: valueType;
}

export type OptionControlItem = Option & {checked: boolean};

export interface OptionControlProps extends FormControlProps {
  className?: string;
}

export interface OptionControlState {
  options: Array<OptionControlItem>;
  api: SchemaApi;
  labelField: string;
  valueField: string;
  source: 'custom' | 'api' | 'form';
}

export default class OptionControl extends React.Component<
  OptionControlProps,
  OptionControlState
> {
  sortable?: Sortable;
  drag?: HTMLElement | null;
  target: HTMLElement | null;
  $comp: string; // 记录一下路径，不再从外部同步内部，只从内部同步外部

  internalProps = ['checked', 'editing'];

  constructor(props: OptionControlProps) {
    super(props);

    this.state = {
      options: this.transformOptions(props),
      api: props.data.source,
      labelField: props.data.labelField,
      valueField: props.data.valueField,
      source: props.data.source ? 'api' : 'custom'
    };
  }

  /**
   * 获取当前选项值的类型
   */
  getOptionValueType(value: any): valueType {
    if (typeof value === 'string') {
      return 'text';
    }
    if (typeof value === 'boolean') {
      return 'boolean';
    }
    if (typeof value === 'number') {
      return 'number';
    }
    return 'text';
  }

  /**
   * 将当前选项值转换为选择的类型
   */
  normalizeOptionValue(value: any, valueType: valueType) {
    if (valueType === 'text') {
      return String(value);
    }
    if (valueType === 'number') {
      const convertTo = Number(value);
      if (isNaN(convertTo)) {
        return 0;
      }
      return convertTo;
    }
    if (valueType === 'boolean') {
      return !value || value === 'false' ? false : true;
    }
    return '';
  }

  /**
   * 处理填入输入框的值
   */
  transformOptionValue(value: any) {
    return typeof value === 'undefined' || value === null
      ? ''
      : typeof value === 'string'
      ? value
      : JSON.stringify(value);
  }

  transformOptions(props: OptionControlProps) {
    const {data: ctx, value: options} = props;
    let defaultValue: Array<OptionValue> | OptionValue = ctx.value;

    const valueArray = value2array(defaultValue, ctx as any).map(
      (item: Option) => item[ctx?.valueField ?? 'value']
    );

    return Array.isArray(options)
      ? options.map((item: Option) => ({
          label: item.label,
          // 为了使用户编写label时同时生效到value
          value: item.label === item.value ? null : item.value,
          checked: !!~valueArray.indexOf(item[ctx?.valueField ?? 'value'])
        }))
      : [];
  }

  /**
   * 处理当前组件的默认值
   */
  normalizeValue() {
    const {data: ctx = {}, multiple: multipleProps} = this.props;
    const {
      joinValues = true,
      extractValue,
      multiple,
      delimiter,
      valueField
    } = ctx;
    const checkedOptions = this.state.options
      .filter(item => item.checked)
      .map(item => omit(item, this.internalProps));
    let value: Array<OptionValue> | OptionValue;

    if (!checkedOptions.length) {
      return '';
    }

    if (multiple || multipleProps) {
      value = checkedOptions;

      if (joinValues) {
        value = checkedOptions
          .map(
            (item: any) =>
              item[valueField || 'value'] || item[valueField || 'label']
          )
          .join(delimiter || ',');
      } else if (extractValue) {
        value = checkedOptions.map(
          (item: Option) =>
            item[valueField || 'value'] || item[valueField || 'label']
        );
      }
    } else {
      value = checkedOptions[0];

      if (joinValues || extractValue) {
        value = value[valueField || 'value'] || value[valueField || 'label'];
      }
    }

    return value;
  }

  /**
   * 更新options字段的统一出口
   */
  onChange() {
    const {source} = this.state;
    const {onBulkChange} = this.props;
    const defaultValue = this.normalizeValue();
    const data: Partial<OptionControlProps> = {
      source: undefined,
      options: undefined,
      labelField: undefined,
      valueField: undefined
    };

    if (source === 'custom') {
      const {options} = this.state;
      data.options = options.map(item => ({
        label: item.label,
        value: item.value == null || item.value === '' ? item.label : item.value
      }));
      data.value = defaultValue || undefined;
    }

    if (source === 'api') {
      const {api, labelField, valueField} = this.state;
      data.source = api;
      data.labelField = labelField;
      data.valueField = valueField;
    }

    onBulkChange && onBulkChange(data);
    return;
  }

  @autobind
  targetRef(ref: any) {
    this.target = ref ? (findDOMNode(ref) as HTMLElement) : null;
  }

  @autobind
  dragRef(ref: any) {
    if (!this.drag && ref) {
      this.initDragging();
    } else if (this.drag && !ref) {
      this.destroyDragging();
    }

    this.drag = ref;
  }

  initDragging() {
    const dom = findDOMNode(this) as HTMLElement;

    this.sortable = new Sortable(
      dom.querySelector('.ae-OptionControl-content') as HTMLElement,
      {
        group: 'OptionControlGroup',
        animation: 150,
        handle: '.ae-OptionControlItem-dragBar',
        ghostClass: 'ae-OptionControlItem--dragging',
        onEnd: (e: any) => {
          // 没有移动
          if (e.newIndex === e.oldIndex) {
            return;
          }

          // 换回来
          const parent = e.to as HTMLElement;
          if (
            e.newIndex < e.oldIndex &&
            e.oldIndex < parent.childNodes.length - 1
          ) {
            parent.insertBefore(e.item, parent.childNodes[e.oldIndex + 1]);
          } else if (e.oldIndex < parent.childNodes.length - 1) {
            parent.insertBefore(e.item, parent.childNodes[e.oldIndex]);
          } else {
            parent.appendChild(e.item);
          }

          const options = this.state.options.concat();

          options[e.oldIndex] = options.splice(
            e.newIndex,
            1,
            options[e.oldIndex]
          )[0];

          this.setState({options}, () => this.onChange());
        }
      }
    );
  }

  destroyDragging() {
    this.sortable && this.sortable.destroy();
  }

  scroll2Bottom() {
    this.drag &&
      this.drag?.lastElementChild?.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'start'
      });
  }

  /**
   * 切换选项类型
   */
  @autobind
  handleSourceChange(source: 'custom' | 'api' | 'form') {
    this.setState({source: source}, this.onChange);
  }

  /**
   * 删除选项
   */
  handleDelete(index: number) {
    const options = this.state.options.concat();

    options.splice(index, 1);
    this.setState({options}, () => this.onChange());
  }

  /**
   * 设置默认选项
   */
  handleToggleDefaultValue(index: number, checked: any, shift?: boolean) {
    let options = this.state.options.concat();
    const isMultiple = this.props?.data?.multiple || this.props?.multiple;

    if (isMultiple) {
      options.splice(index, 1, {...options[index], checked});
    } else {
      options = options.map((item, itemIndex) => ({
        ...item,
        checked: itemIndex === index
      }));
    }

    this.setState({options}, () => this.onChange());
  }

  /**
   * 编辑选项
   */
  toggleEdit(index: number) {
    const {options} = this.state;
    options[index].editing = !options[index].editing;
    this.setState({options});
  }

  @autobind
  handleEditLabel(index: number, value: string) {
    const options = this.state.options.concat();

    options.splice(index, 1, {...options[index], label: value});
    this.setState({options}, () => this.onChange());
  }

  @autobind
  handleAdd() {
    const {options} = this.state;
    options.push({
      label: '',
      value: null,
      checked: false
    });
    this.setState({options}, () => {
      this.onChange();
    });
  }

  handleValueTypeChange(index: number, type: valueType) {
    const options = this.state.options.concat();
    options[index].value = this.normalizeOptionValue(
      options[index].value,
      type
    );

    this.setState({options}, () => this.onChange());
  }

  handleValueChange(index: number, value: string) {
    const options = this.state.options.concat();
    const type = this.getOptionValueType(options[index].value);
    options[index].value = this.normalizeOptionValue(value, type);

    this.setState({options}, () => this.onChange());
  }

  @autobind
  handleBatchAdd(values: {batchOption: string}, action: any) {
    const options = this.state.options.concat();
    const addedOptions: Array<OptionControlItem> = values.batchOption
      .split('\n')
      .map(option => {
        const item = option.trim();
        if (~item.indexOf(' ')) {
          let [label, value] = item.split(' ');
          return {label: label.trim(), value: value.trim(), checked: false};
        }
        return {label: item, value: item, checked: false};
      });
    const newOptions = uniqBy([...options, ...addedOptions], 'value');

    this.setState({options: newOptions}, () => this.onChange());
  }

  renderHeader() {
    const {
      render,
      label,
      labelRemark,
      useMobileUI,
      env,
      popOverContainer
    } = this.props;
    const classPrefix = env?.theme?.classPrefix;
    const {source} = this.state;
    const optionSourceList = ([
      {
        label: '自定义选项',
        value: 'custom'
      },
      {
        label: '接口获取',
        value: 'api'
      }
      // {
      //   label: '表单实体',
      //   value: 'form'
      // }
    ] as Array<{
      label: string;
      value: 'custom' | 'api' | 'form';
    }>).map(item => ({
      ...item,
      onClick: () => this.handleSourceChange(item.value)
    }));

    return (
      <header className="ae-OptionControl-header">
        <label className={cx(`${classPrefix}Form-label`)}>
          {label || ''}
          {labelRemark
            ? render('label-remark', {
                type: 'remark',
                icon: labelRemark.icon || 'warning-mark',
                tooltip: labelRemark,
                className: cx(`Form-lableRemark`, labelRemark?.className),
                useMobileUI,
                container: popOverContainer
                  ? popOverContainer
                  : env && env.getModalContainer
                  ? env.getModalContainer
                  : undefined
              })
            : null}
        </label>
        <div>
          {render(
            'validation-control-addBtn',
            {
              type: 'dropdown-button',
              level: 'link',
              size: 'sm',
              label: '${selected}',
              align: 'right',
              closeOnClick: true,
              closeOnOutside: true,
              buttons: optionSourceList
            },
            {
              popOverContainer: null,
              data: {
                selected: optionSourceList.find(item => item.value === source)!
                  .label
              }
            }
          )}
        </div>
      </header>
    );
  }

  renderOption(props: any) {
    const {checked, index, editing, multipleProps} = props;
    const ctx: Partial<TextControlSchema> = this.props.data;
    const isMultiple = ctx?.multiple === true || multipleProps;

    const label = this.transformOptionValue(props.label);
    const value = this.transformOptionValue(props.value);
    const valueType = this.getOptionValueType(props.value);

    const editDom = editing ? (
      <div className="ae-OptionControlItem-extendMore">
        {amisRender({
          type: 'container',
          className: 'ae-ExtendMore right mb-2',
          body: [
            {
              type: 'button',
              className: 'ae-OptionControlItem-closeBtn',
              label: '×',
              level: 'link',
              onClick: () => this.toggleEdit(index)
            },
            {
              type: 'input-text',
              name: 'label',
              placeholder: '请输入显示文本',
              label: '文本',
              mode: 'horizontal',
              value: label,
              labelClassName: 'ae-OptionControlItem-EditLabel',
              valueClassName: 'ae-OptionControlItem-EditValue',
              onChange: (v: string) => this.handleEditLabel(index, v)
            },
            {
              type: 'input-group',
              name: 'input-group',
              label: '值',
              labelClassName: 'ae-OptionControlItem-EditLabel',
              valueClassName: 'ae-OptionControlItem-EditValue',
              mode: 'horizontal',
              body: [
                {
                  type: 'select',
                  name: 'valueType',
                  value: valueType,
                  options: [
                    {
                      label: '文本',
                      value: 'text'
                    },
                    {
                      label: '数字',
                      value: 'number'
                    },
                    {
                      label: '布尔',
                      value: 'boolean'
                    }
                  ],
                  checkAll: false,
                  onChange: (v: valueType) =>
                    this.handleValueTypeChange(index, v)
                },
                {
                  type: 'input-text',
                  placeholder: '默认与文本一致',
                  name: 'value',
                  value,
                  visibleOn: "this.optionValueType !== 'boolean'",
                  onChange: (v: string) => this.handleValueChange(index, v)
                },
                {
                  type: 'input-text',
                  placeholder: '默认与文本一致',
                  name: 'value',
                  value,
                  visibleOn: "this.optionValueType === 'boolean'",
                  onChange: (v: string) => this.handleValueChange(index, v),
                  options: [
                    {label: 'true', value: true},
                    {label: 'false', value: false}
                  ]
                }
              ]
            }
          ]
        })}
      </div>
    ) : null;

    return (
      <li className="ae-OptionControlItem" key={index}>
        <div className="ae-OptionControlItem-Main">
          <a className="ae-OptionControlItem-dragBar">
            <Icon icon="drag-bar" className="icon" />
          </a>
          {!this.props.closeDefaultCheck &&
            this.props.data.defaultCheckAll !== true && (
              <span className="inline-flex" data-tooltip="默认选中此项">
                <Checkbox
                  className="ae-OptionControlItem-checkbox"
                  checked={checked}
                  type={isMultiple ? 'checkbox' : 'radio'}
                  onChange={(checked: any, shift?: boolean) =>
                    this.handleToggleDefaultValue(index, checked, shift)
                  }
                />
              </span>
            )}
          <InputBox
            className="ae-OptionControlItem-input"
            value={label}
            placeholder="请输入显示文本"
            clearable={false}
            onChange={value => this.handleEditLabel(index, value)}
          />
          {amisRender({
            type: 'dropdown-button',
            className: 'ae-OptionControlItem-dropdown',
            btnClassName: 'px-2',
            icon: 'fa fa-ellipsis-h',
            hideCaret: true,
            closeOnClick: true,
            align: 'right',
            menuClassName: 'ae-OptionControlItem-ulmenu',
            buttons: [
              {
                type: 'button',
                className: 'ae-OptionControlItem-action',
                label: '编辑',
                onClick: () => this.toggleEdit(index)
              },
              {
                type: 'button',
                className: 'ae-OptionControlItem-action',
                label: '删除',
                onClick: () => this.handleDelete(index)
              }
            ]
          })}
        </div>
        {editDom}
      </li>
    );
  }

  buildBatchAddSchema() {
    return {
      type: 'action',
      actionType: 'dialog',
      label: '批量添加',
      dialog: {
        title: '批量添加选项',
        headerClassName: 'font-bold',
        closeOnEsc: true,
        closeOnOutside: false,
        showCloseButton: true,
        body: [
          {
            type: 'alert',
            level: 'warning',
            body: [
              {
                type: 'tpl',
                tpl:
                  '每个选项单列一行，将所有值不重复的项加为新的选项;<br/>每行可通过空格来分别设置label和value,例："张三 zhangsan"'
              }
            ],
            showIcon: true,
            className: 'mb-2.5'
          },
          {
            type: 'form',
            wrapWithPanel: false,
            mode: 'normal',
            wrapperComponent: 'div',
            resetAfterSubmit: true,
            autoFocus: true,
            preventEnterSubmit: true,
            horizontal: {
              left: 0,
              right: 12
            },
            body: [
              {
                name: 'batchOption',
                type: 'textarea',
                label: '',
                placeholder: '请输入选项内容',
                trimContents: true,
                minRows: 10,
                maxRows: 50,
                required: true
              }
            ]
          }
        ]
      }
    };
  }

  @autobind
  handleAPIChange(source: SchemaApi) {
    this.setState({api: source}, this.onChange);
  }

  @autobind
  handleLableFieldChange(labelField: string) {
    this.setState({labelField}, this.onChange);
  }

  @autobind
  handleValueFieldChange(valueField: string) {
    this.setState({valueField}, this.onChange);
  }

  renderApiPanel() {
    const {render} = this.props;
    const {source, api, labelField, valueField} = this.state;
    if (source !== 'api') {
      return null;
    }

    return render(
      'api',
      getSchemaTpl('apiControl', {
        label: '接口',
        name: 'source',
        className: 'ae-ExtendMore',
        visibleOn: 'data.autoComplete !== false',
        value: api,
        onChange: this.handleAPIChange,
        footer: [
          {
            label: tipedLabel(
              '显示字段',
              '选项文本对应的数据字段，多字段合并请通过模板配置'
            ),
            type: 'input-text',
            name: 'labelField',
            value: labelField,
            placeholder: '选项文本对应的字段',
            onChange: this.handleLableFieldChange
          },
          {
            label: '值字段',
            type: 'input-text',
            name: 'valueField',
            value: valueField,
            placeholder: '值对应的字段',
            onChange: this.handleValueFieldChange
          }
        ]
      })
    );
  }

  render() {
    const {options, source} = this.state;
    const {render, className, multiple: multipleProps} = this.props;

    return (
      <div className={cx('ae-OptionControl', className)}>
        {this.renderHeader()}

        {source === 'custom' ? (
          <div className="ae-OptionControl-wrapper">
            {Array.isArray(options) && options.length ? (
              <ul className="ae-OptionControl-content" ref={this.dragRef}>
                {options.map((option, index) =>
                  this.renderOption({...option, index, multipleProps})
                )}
              </ul>
            ) : (
              <div className="ae-OptionControl-placeholder">无选项</div>
            )}
            <div className="ae-OptionControl-footer">
              <Button
                level="enhance"
                onClick={this.handleAdd}
                ref={this.targetRef}
              >
                添加选项
              </Button>
              {/* {render('option-control-batchAdd', this.buildBatchAddSchema())} */}
              {amisRender(this.buildBatchAddSchema(), {
                onSubmit: this.handleBatchAdd
              })}
            </div>

            {/* {this.renderPopover()} */}
          </div>
        ) : null}

        {this.renderApiPanel()}
      </div>
    );
  }
}

@FormItem({
  type: 'ae-optionControl',
  renderLabel: false
})
export class OptionControlRenderer extends OptionControl {}
