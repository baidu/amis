/**
 * @file Transfer的表格对应选项
 */

import React from 'react';
import {render as amisRender, FormItem} from 'amis';
import {omit} from 'lodash';
import {SchemaApi} from 'amis/lib/Schema';
import {autobind, getSchemaTpl} from 'amis-editor-core';
import cx from 'classnames';
import {tipedLabel} from 'amis-editor-core';

import type {FormControlProps} from 'amis-core';
import type {Option} from 'amis';

interface OptionControlProps extends FormControlProps {
  className?: string;
}

interface OptionControlState {
  api: SchemaApi;
  labelField: string;
  valueField: string;
  source: 'custom' | 'api' | 'form';
}

function BaseOptionControl(Cmpt: React.JSXElementConstructor<any>) {
  return class extends React.Component<OptionControlProps, OptionControlState> {
    $comp: string; // 记录一下路径，不再从外部同步内部，只从内部同步外部

    internalProps = ['checked', 'editing'];

    constructor(props: OptionControlProps) {
      super(props);

      this.state = {
        api: props.data.source,
        labelField: props.data.labelField,
        valueField: props.data.valueField,
        source: props.data.source ? 'api' : 'custom'
      };

      this.handleSourceChange = this.handleSourceChange.bind(this);
      this.handleAPIChange = this.handleAPIChange.bind(this);
      this.handleLableFieldChange = this.handleLableFieldChange.bind(this);
      this.handleValueFieldChange = this.handleValueFieldChange.bind(this);
      this.onChange = this.onChange.bind(this);
    }

    /**
     * 更新options字段的统一出口
     */
    onChange() {
      const {source} = this.state;
      const {onBulkChange} = this.props;

      const data: Partial<OptionControlProps> = {
        source: undefined,
        options: undefined,
        labelField: undefined,
        valueField: undefined
      };

      if (source === 'api') {
        const {api, labelField, valueField} = this.state;
        data.source = api;
        data.labelField = labelField;
        data.valueField = valueField;
      }

      onBulkChange && onBulkChange(data);
      return;
    }

    /**
     * 切换选项类型
     */
    handleSourceChange(source: 'custom' | 'api' | 'form') {
      this.setState({source: source}, this.onChange);
    }

    handleAPIChange(source: SchemaApi) {
      this.setState({api: source}, this.onChange);
    }

    handleLableFieldChange(labelField: string) {
      this.setState({labelField}, this.onChange);
    }

    handleValueFieldChange(valueField: string) {
      this.setState({valueField}, this.onChange);
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
                  tpl: '每个选项单列一行，将所有值不重复的项加为新的选项;<br/>每行可通过空格来分别设置label和value,例："张三 zhangsan"'
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

    renderHeader() {
      const {render, label, labelRemark, useMobileUI, env, popOverContainer} =
        this.props;
      const classPrefix = env?.theme?.classPrefix;
      const {source} = this.state;
      const optionSourceList = (
        [
          {
            label: '自定义选项',
            value: 'custom'
          },
          {
            label: '接口获取',
            value: 'api'
          }
        ] as Array<{
          label: string;
          value: 'custom' | 'api' | 'form';
        }>
      ).map(item => ({
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
                  selected: optionSourceList.find(
                    item => item.value === source
                  )!.label
                }
              }
            )}
          </div>
        </header>
      );
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
      const {source, api, labelField, valueField} = this.state;
      const {className} = this.props;
      const cmptProps = {
        ...this.props,
        data: {
          api,
          labelField,
          valueField,
          ...this.props?.data
        }
      };

      return (
        <div className={cx('ae-OptionControl', className)}>
          {this.renderHeader()}

          {source === 'custom' ? <Cmpt {...cmptProps} /> : null}

          {this.renderApiPanel()}
        </div>
      );
    }
  };
}

const renderInput = (
  name: string,
  placeholder: string,
  required: boolean = true,
  unique: boolean = false
) => {
  return {
    type: 'input-text',
    name,
    placeholder: placeholder,
    required,
    unique
  };
};

export default class TransferTableOption extends React.Component<
  OptionControlProps,
  {}
> {
  addColumns() {
    const {columns = [{type: 'text'}]} = this.props.data;
    return {
      type: 'action',
      actionType: 'dialog',
      label: '添加表格列',
      level: 'enhance',
      dialog: {
        title: '设置表格列选项',
        headerClassName: 'font-bold',
        closeOnEsc: true,
        closeOnOutside: false,
        showCloseButton: true,
        onConfirm: (...args: Array<any>) =>
          this.handleChange(args[2].columns, 'columns'),
        body: [
          {
            name: 'columns',
            type: 'combo',
            multiple: true,
            label: false,
            strictMode: false,
            addButtonText: '新增一列',
            draggable: false,
            value: columns,
            items: [
              {
                type: 'input-text',
                name: 'label',
                placeholder: '标题'
              },
              {
                type: 'input-text',
                name: 'name',
                placeholder: '绑定字段名'
              },
              {
                type: 'select',
                name: 'type',
                placeholder: '类型',
                value: 'text',
                options: [
                  {
                    value: 'text',
                    label: '纯文本'
                  },
                  {
                    value: 'tpl',
                    label: '模板'
                  },
                  {
                    value: 'image',
                    label: '图片'
                  },
                  {
                    value: 'date',
                    label: '日期'
                  },
                  {
                    value: 'progress',
                    label: '进度'
                  },
                  {
                    value: 'status',
                    label: '状态'
                  },
                  {
                    value: 'mapping',
                    label: '映射'
                  },
                  {
                    value: 'operation',
                    label: '操作栏'
                  }
                ]
              }
            ]
          }
        ]
      }
    };
  }

  addRows() {
    const {columns = [], options = [{}]} = this.props.data;
    return {
      type: 'tooltip-wrapper',
      tooltip: '需设置表格列后，才能设置表格行',
      tooltipTheme: 'dark',
      placement: 'top',
      tooltipStyle: {
        fontSize: '12px'
      },
      className: 'ae-formItemControl-label-tip',
      body: [
        {
          type: 'action',
          actionType: 'dialog',
          label: '添加表格行',
          level: 'enhance',
          disabled: columns && columns.length === 0,
          block: true,
          dialog: {
            title: '设置表格行选项',
            headerClassName: 'font-bold',
            closeOnEsc: true,
            closeOnOutside: false,
            showCloseButton: true,
            size: columns.length >= 6 ? 'md' : '',
            onConfirm: (...args: Array<any>) =>
              this.handleChange(args[2].options, 'options'),
            body: [
              {
                type: 'form',
                wrapWithPanel: false,
                mode: 'normal',
                body: [
                  {
                    name: 'options',
                    type: 'combo',
                    multiple: true,
                    draggable: true,
                    addButtonText: '新增',
                    value: options,
                    items: [
                      ...columns.map((item: Option) =>
                        renderInput(item.name, item.label ?? '', false)
                      ),
                      renderInput('value', '值', true, true)
                    ]
                  }
                ]
              }
            ]
          }
        }
      ]
    };
  }

  @autobind
  handleChange(value: Array<Option>, type: 'options' | 'columns') {
    const {data} = this.props;
    const {onBulkChange, onValueChange} = this.props;
    data[type] = value;
    if (type === 'columns') {
      const keys = value.map(item => item.name);
      data.options = data.options.map((item: Option) => {
        return {
          ...keys.reduce(
            (pv, cv) => {
              pv[cv] = item[cv];
              return pv;
            },
            {value: item.value}
          )
        };
      });
    }
    onValueChange && onValueChange(type, data, onBulkChange);
  }

  render() {
    return (
      <div className="ae-OptionControl-footer">
        {amisRender(this.addColumns())}
        {amisRender(this.addRows())}
      </div>
    );
  }
}

const TransferTableControl = BaseOptionControl(TransferTableOption);

@FormItem({
  type: 'ae-transferTableControl',
  renderLabel: false
})
export class TransferTableControlRenderer extends TransferTableControl {}
