/**
 * @file 通用数组列表项的可视化编辑控件
 */

import React from 'react';
import {findDomCompat as findDOMNode} from 'amis-core';
import cx from 'classnames';
import get from 'lodash/get';
import Sortable from 'sortablejs';
import {FormItem, Button, Icon, render as amisRender, toast} from 'amis';
import {autobind} from 'amis-editor-core';
import type {Option} from 'amis';
import {createObject, FormControlProps} from 'amis-core';
import type {SchemaApi} from 'amis';
import type {PlainObject} from './style-control/types';

export type valueType = 'text' | 'boolean' | 'number';

export interface PopoverForm {
  optionLabel: string;
  optionValue: any;
  optionValueType: valueType;
}

export interface OptionControlProps extends FormControlProps {
  className?: string;
}

export type SourceType = 'custom' | 'api' | 'apicenter' | 'variable';

export interface OptionControlState {
  items: Array<PlainObject>;
  labelField: string;
  valueField: string;
}

export default class ListItemControl extends React.Component<
  OptionControlProps,
  OptionControlState
> {
  sortable?: Sortable;
  drag?: HTMLElement | null;
  target: HTMLElement | null;

  internalProps = ['checked', 'editing'];

  constructor(props: OptionControlProps) {
    super(props);

    this.state = {
      items: this.transformOptions(props),
      labelField: props.data.labelField || 'title',
      valueField: props.data.valueField
    };
  }

  /**
   * 数据更新
   */
  componentWillReceiveProps(nextProps: OptionControlProps) {
    const items = get(nextProps, 'items')
      ? this.transformOptions(nextProps)
      : [];
    if (
      JSON.stringify(
        this.state.items.map(item => ({
          ...item,
          editing: undefined
        }))
      ) !== JSON.stringify(items)
    ) {
      this.setState({
        items
      });
    }
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

    return Array.isArray(options)
      ? options.map((item: Option) => ({
          ...item,
          ...(item.hidden !== undefined ? {hidden: item.hidden} : {}),
          ...(item.hiddenOn !== undefined ? {hiddenOn: item.hiddenOn} : {})
        }))
      : [];
  }

  /**
   * 更新options字段的统一出口
   */
  onChange() {
    const {onChange} = this.props;
    onChange(this.state.items);
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
          if (e.oldIndex < parent.childNodes.length - 1) {
            parent.insertBefore(
              e.item,
              parent.childNodes[
                e.oldIndex > e.newIndex ? e.oldIndex + 1 : e.oldIndex
              ]
            );
          } else {
            parent.appendChild(e.item);
          }

          const items = this.state.items.concat();

          items[e.oldIndex] = items.splice(e.newIndex, 1, items[e.oldIndex])[0];

          this.setState({items}, () => this.onChange());
        }
      }
    );
  }

  destroyDragging() {
    this.sortable && this.sortable.destroy();
  }

  /**
   * 删除选项
   */
  handleDelete(index: number) {
    const items = this.state.items.concat();
    const minLength = this.props.minLength;

    if (minLength > 0 && items.length <= minLength) {
      toast.warning(`列表项数目不能少于${minLength}`);
      return;
    }

    items.splice(index, 1);
    this.setState({items}, () => this.onChange());
  }

  /**
   * 编辑选项
   */
  toggleEdit(index: number) {
    const {items} = this.state;
    items[index].editing = !items[index].editing;
    this.setState({items});
  }

  editItem(item: PlainObject, index: number) {
    const items = this.state.items.concat();
    if (items[index]) {
      items[index] = item;
    }
    this.setState({items}, () => this.onChange());
  }

  @autobind
  handleEditLabel(index: number, value: string) {
    const items = this.state.items.concat();
    items.splice(index, 1, {...items[index], [this.state.labelField]: value});
    this.setState({items}, () => this.onChange());
  }

  @autobind
  handleAdd() {
    const scaffold = this.props.scaffold;
    const {labelField} = this.state;
    const items = this.state.items.slice();
    items.push(
      scaffold
        ? scaffold
        : {
            [labelField]: '新状态',
            body: {}
          }
    );
    this.setState({items}, () => {
      this.onChange();
    });
  }

  handleValueChange(index: number, value: string) {
    const items = this.state.items.concat();
    items[index].value = value;
    this.setState({items}, () => this.onChange());
  }

  renderHeader() {
    const {render, label, labelRemark, useMobileUI, env, popOverContainer} =
      this.props;
    const classPrefix = env?.theme?.classPrefix;

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
                container: popOverContainer || env.getModalContainer
              })
            : null}
        </label>
      </header>
    );
  }

  renderOption(props: any) {
    const {index, editing} = props;
    const {render, data: ctx, items = []} = this.props;
    const label = this.transformOptionValue(props[this.state.labelField]);

    const editDom = editing ? (
      <div className="ae-OptionControlItem-extendMore">
        {render(
          'item',
          {
            type: 'form',
            title: null,
            className: 'ae-ExtendMore right mb-2 border-none',
            wrapWithPanel: false,
            labelAlign: 'left',
            horizontal: {
              left: 4,
              right: 8
            },
            body: [
              {
                type: 'button',
                className: 'ae-OptionControlItem-closeBtn',
                label: '×',
                level: 'link',
                onClick: () => this.toggleEdit(index)
              },
              ...items
            ],
            onChange: (model: any) => {
              this.editItem(model, index);
            }
          },
          {data: createObject(ctx, props)}
        )}
      </div>
    ) : null;

    const operationBtn = [
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
    ];

    const labelField = this.state.labelField;

    return (
      <li className="ae-OptionControlItem" key={index}>
        <div className="ae-OptionControlItem-Main">
          <a className="ae-OptionControlItem-dragBar">
            <Icon icon="drag-bar" className="icon" />
          </a>
          {amisRender(
            {
              type: 'input-text',
              name: labelField,
              className: 'ae-OptionControlItem-input',
              value: label,
              placeholder: '状态名称',
              clearable: false,
              onChange: (value: string) => {
                this.handleEditLabel(index, value);
              }
            },
            {
              data: {
                [labelField]: label
              }
            }
          )}
          {render(
            'dropdown',
            {
              type: 'dropdown-button',
              className: 'ae-OptionControlItem-dropdown',
              btnClassName: 'px-2',
              icon: 'fa fa-ellipsis-h',
              hideCaret: true,
              closeOnClick: true,
              align: 'right',
              menuClassName: 'ae-OptionControlItem-ulmenu',
              buttons: operationBtn
            },
            {
              popOverContainer: null // amis 渲染挂载节点会使用 this.target
            }
          )}
        </div>
        {editDom}
      </li>
    );
  }

  render() {
    const {items} = this.state;
    const {className, addTip, placeholder} = this.props;

    return (
      <div className={cx('ae-OptionControl', className)}>
        {this.renderHeader()}

        <div className="ae-OptionControl-wrapper">
          {Array.isArray(items) && items.length ? (
            <ul className="ae-OptionControl-content" ref={this.dragRef}>
              {items.map((item, index) => this.renderOption({...item, index}))}
            </ul>
          ) : (
            <div className="ae-OptionControl-placeholder">
              {placeholder || '无数据'}
            </div>
          )}
          <div className="ae-OptionControl-footer">
            <Button
              level="enhance"
              onClick={this.handleAdd}
              ref={this.targetRef}
              className="w-full"
            >
              {addTip || '添加选项'}
            </Button>
          </div>
        </div>
      </div>
    );
  }
}

@FormItem({
  type: 'ae-listItemControl',
  renderLabel: false
})
export class ListItemControlRenderer extends ListItemControl {}
