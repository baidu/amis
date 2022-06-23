/**
 * @file Timeline组件节点的可视化编辑控件
 */
import React from 'react';
import {findDOMNode} from 'react-dom';
import cx from 'classnames';
import uniqBy from 'lodash/uniqBy';
import Sortable from 'sortablejs';
import {
  render as amisRender,
  FormItem,
  Icon,
  InputBox
} from 'amis';
import {tipedLabel} from '../component/BaseControl';
import {autobind} from 'amis-editor-core';
import {getSchemaTpl} from 'amis-editor-core';
import type {FormControlProps} from 'amis-core';
import {SchemaApi} from 'amis/lib/Schema';
import { isObject } from 'lodash';

type TimelineItem = {
  title: string;
  time: string;
  detail?: string;
  otherConfig?: boolean;
  detailCollapsedText?: string;
  detailExpandedText?: string;
  color?: string | 'info' | 'success' | 'warning' | 'danger';
  icon?: string;
}
export interface TimelineItemProps extends FormControlProps {
  className?: string;
}

export interface TimelineItemState {
  items: Array<Partial<TimelineItem>>;
  source: 'custom' | 'api';
  api: SchemaApi;
  labelField: string;
  valueField: string;
}

export default class TimelineItemControl extends React.Component<
  TimelineItemProps,
  TimelineItemState
> {
  sortable?: Sortable;
  drag?: HTMLElement | null;
  target: HTMLElement | null;

  constructor(props: TimelineItemProps) {
    super(props);

    this.state = {
      items: props.value,
      api: props.data.source,
      labelField: props.data.labelField,
      valueField: props.data.valueField,
      source: props.data.source ? 'api' : 'custom'
    }
  }
  /**
   * 切换选项类型
   */
  @autobind
  handleSourceChange(source: 'custom' | 'api') {
    this.setState({source: source}, this.onChange);
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

  onChange() {
    const {source} = this.state;
    const {onBulkChange} = this.props;
    const data: Partial<TimelineItemProps> = {
      source: undefined,
      items: undefined
    };

    if (source === 'custom') {
      const {items} = this.state;
      data.items = items.map(item => ({...item}))
    }
    if (source === 'api') {}
    onBulkChange && onBulkChange(data);
  }

  @autobind
  toggleEdit(values: TimelineItem, index: number) {
    const items = this.state.items.concat();
    items[index] = values;

    this.setState({items}, this.onChange);
  }

  toggleCopy(index: number) {
    const {items} = this.state;
    const res = items.concat(items[index]);
    this.setState({items: res}, this.onChange);
  }

  toggleDelete(index: number) {
    const items = this.state.items.concat();
    items.splice(index, 1);
    this.setState({items}, this.onChange);
  }

  handleEditLabel(index: number, value: string, attr: 'time' | 'title') {
    const items = this.state.items.concat();

    items.splice(index, 1, {...items[index], [attr]: value});
    this.setState({items}, () => this.onChange());
  }

  @autobind
  handleBatchAdd(values: {batchItems: string}, action: any) {
    const items = this.state.items.concat();

    const addedOptions: Array<Partial<TimelineItem>> = values.batchItems
      .split('\n')
      .map(option => {
        const item = option.trim();
        if (~item.indexOf(' ')) {
          let [time, title] = item.split(' ');
          return {time: time.trim(), title: title.trim()};
        }
        return {label: item, value: item};
      });
    const newOptions = uniqBy([...items, ...addedOptions], 'time');

    this.setState({items: newOptions}, () => this.onChange());
  }

  @autobind
  handleAdd(values: TimelineItem) {
    var {items} = this.state;

    const itemsTemp = items.concat({...values});
    this.setState({items: itemsTemp}, this.onChange);
  }

  buildAddOrEditSchema(props?: Partial<TimelineItem>) {
    return [
      {
        type: 'input-text',
        name: 'time',
        required: true,
        placeholder: '请输入时间',
        label: '时间',
        value: props?.['time']
      },
      {
        type: 'input-text',
        name: 'title',
        required: true,
        placeholder: '请输入标题',
        label: '标题',
        value: props?.['title']
      },
      {
        type: 'textarea',
        maxRows: 2,
        label: '描述',
        name: 'detail',
        value: props?.['detail'],
        placeholder: '请输入内容'
      },
      {
        type: 'input-text',
        name: 'detailCollapsedText',
        value: props?.['detailCollapsedText'],
        placeholder: '请输入',
        label: tipedLabel(
          '折叠前文案',
          '无配置情况，默认显示标题'
        ),
      },
      {
        type: 'input-text',
        name: 'detailExpandedText',
        value: props?.['detailExpandedText'],
        placeholder: '请输入',
        label: tipedLabel(
          '折叠后文案',
          '无配置情况，默认显示标题'
        )
      },
      {
        type: 'input-color',
        name: 'color',
        value: props?.['color'],
        placeholder: '请输入',
        label: '颜色'
      },
      {
        type: 'icon-picker',
        name: 'icon',
        value: props?.['icon'],
        placeholder: '请输入',
        label: '图标',
        className: 'fix-icon-picker-overflow',
        pipeIn: (value: any) => value?.icon,
        pipeOut: (value: any) => {
          if (value) {
            return {
              type: 'icon',
              vendor: '',
              icon: value
            }
          }
          return undefined;
        }
      }
    ]
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
                tpl: '每个选项单列一行，将所有值不重复的项加为新的选项;<br/>每行可通过空格来分别设置time和title,例："2022-06-23 期末补考"'
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
                name: 'batchItems',
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

  buildAddSchema() {
    return {
      type: 'action',
      actionType: 'dialog',
      label: '添加选项',
      active: true,
      dialog: {
        title: '节点配置',
        headerClassName: 'font-bold',
        closeOnEsc: true,
        closeOnOutside: false,
        showCloseButton: true,
        body: [
          {
            type: 'form',
            wrapWithPanel: false,
            wrapperComponent: 'div',
            resetAfterSubmit: true,
            autoFocus: true,
            preventEnterSubmit: true,
            horizontal: {
              justify: true,
              left: 3,
              right: 9
            },
            body: this.buildAddOrEditSchema()
          }
        ],
      },
    }
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
      dom.querySelector('.ae-TimelineItemControl-content') as HTMLElement,
      {
        group: 'TimelineItemControlGroup',
        animation: 150,
        handle: '.ae-TimelineItemControlItem-dragBar',
        ghostClass: 'ae-TimelineItemControlItem--dragging',
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

          const items = this.state.items.concat();

          items[e.oldIndex] = items.splice(
            e.newIndex,
            1,
            items[e.oldIndex]
          )[0];

          this.setState({items}, () => this.onChange());
        }
      }
    );
  }

  destroyDragging() {
    this.sortable && this.sortable.destroy();
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
        value: 'custom' | 'api';
      }>
    ).map(item => ({
      ...item,
      onClick: () => this.handleSourceChange(item.value)
    }));

    return (
      <header className="ae-TimelineItemControl-header">
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

  renderOption(props: TimelineItem & {index: number}) {
    const {time, title, index} = props;
    return (
      <li className="ae-TimelineItemControlItem" key={index}>
        <div className="ae-TimelineItemControlItem-Main">
          <a className="ae-TimelineItemControlItem-dragBar">
            <Icon icon="drag-bar" className="icon" />
          </a>
          <InputBox
            className="ae-TimelineItemControlItem-input"
            value={time}
            placeholder="请输入显示时间"
            clearable={false}
            onChange={(value: string) => this.handleEditLabel(index, value, 'time')}
          />
          {/* {amisRender(
            {
              type: "input-date",
              name: "time",
              value: time,
              className: "ae-TimelineItemControlItem-inputDate",
              label: ""
            }
          )} */}

          {amisRender({
            type: 'dropdown-button',
            className: 'ae-TimelineItemControlItem-dropdown',
            btnClassName: 'px-2',
            icon: 'fa fa-ellipsis-h',
            hideCaret: true,
            closeOnClick: true,
            align: 'right',
            menuClassName: 'ae-TimelineItemControlItem-ulmenu',
            buttons: [
              {
                type: 'action',
                className: 'ae-TimelineItemControlItem-action',
                label: '编辑',
                actionType: 'dialog',
                dialog: {
                  title: '节点配置',
                  headerClassName: 'font-bold',
                  closeOnEsc: true,
                  closeOnOutside: false,
                  showCloseButton: true,
                  body: [
                    {
                      type: 'form',
                      wrapWithPanel: false,
                      wrapperComponent: 'div',
                      resetAfterSubmit: true,
                      autoFocus: true,
                      preventEnterSubmit: true,
                      horizontal: {
                        justify: true,
                        left: 3,
                        right: 9
                      },
                      body: this.buildAddOrEditSchema(props),
                      onSubmit: (e: any) => this.toggleEdit(e, index)
                    },
                  ],

                },
              },
              {
                type: 'button',
                className: 'ae-TimelineItemControlItem-action',
                label: '复制',
                onClick: () => this.toggleCopy(index)
              },
              {
                type: 'button',
                className: 'ae-TimelineItemControlItem-action',
                label: '删除',
                onClick: () => this.toggleDelete(index)
              }
            ]
          })}
        </div>
        <div className="ae-TimelineItemControlItem-Main">
          <InputBox
            className="ae-TimelineItemControlItem-input-title"
            value={title}
            clearable={false}
            placeholder="请输入标题"
            onChange={(value: string) => this.handleEditLabel(index, value, 'title')}
          />
        </div>
      </li>
    );
  }

  renderApiPanel() {
    const {render} = this.props;
    const {source, api} = this.state;
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
        onChange: this.handleAPIChange
      })
    );
  }

  render() {
    const {source, items} = this.state;
    const {render, className} = this.props;
    return (
        <div className={cx('ae-TimelineItemControl', className)}>
          {this.renderHeader()}

          {source === 'custom'
            ? <div className="ae-TimelineItemControl-wrapper">
                {Array.isArray(items) && items.length ? (
                  <ul className="ae-TimelineItemControl-content" ref={this.dragRef} >
                    {items.map((item: TimelineItem, index: number) =>
                      this.renderOption({...item, index})
                    )}
                  </ul>
                ) : (
                  <div className="ae-TimelineItemControl-placeholder">无选项</div>
                )}

                <div className="ae-TimelineItemControl-footer">
                  {amisRender(this.buildAddSchema(), {
                    onSubmit: this.handleAdd
                  })}
                  {amisRender(this.buildBatchAddSchema(), {
                    onSubmit: this.handleBatchAdd
                  })}
                </div>
              </div>
            : null}
          {this.renderApiPanel()}

          <div className='ae-TimelineItemControl-border'></div>
        </div>
    )
  }
}

@FormItem({type: 'ae-timelineItemControl', renderLabel: false})
export class TimelineItemControlRenderer extends React.Component<TimelineItemProps> {
  render() {
    return <TimelineItemControl {...this.props} />
  }
}