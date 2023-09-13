/**
 * @file Timeline组件节点的可视化编辑控件
 */
import React from 'react';
import {findDOMNode} from 'react-dom';
import cx from 'classnames';
import uniqBy from 'lodash/uniqBy';
import Sortable from 'sortablejs';
import {render as amisRender, FormItem, Icon} from 'amis';
import {getI18nEnabled} from 'amis-editor-core';
import {autobind} from 'amis-editor-core';
import {getSchemaTpl} from 'amis-editor-core';
import type {FormControlProps} from 'amis-core';
import type {SchemaApi} from 'amis';

type TimelineItem = {
  title: string;
  time: string;
  detail?: string;
  otherConfig?: boolean;
  detailCollapsedText?: string;
  detailExpandedText?: string;
  color?: string | 'info' | 'success' | 'warning' | 'danger';
  icon?: string;
};
export interface TimelineItemProps extends FormControlProps {
  className?: string;
}

export interface TimelineItemState {
  items: Array<Partial<TimelineItem>>;
  source: 'custom' | 'api' | 'variable';
  api: SchemaApi;
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
      source: props.data.source ? 'api' : 'custom'
    };
  }
  /**
   * 切换选项类型
   */
  @autobind
  handleSourceChange(source: 'custom' | 'api' | 'variable') {
    this.setState({source: source}, this.onChange);
  }

  @autobind
  handleAPIChange(source: SchemaApi) {
    this.setState({api: source}, this.onChange);
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
      data.items = items.map(item => ({...item}));
    }
    if (source === 'api') {
      const {items, api} = this.state;
      data.items = items.map(item => ({...item}));
      data.source = api;
    }
    if (source === 'variable') {
      const {items, api} = this.state;
      data.items = items.map(item => ({...item}));
      data.source = api;
    }
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
    const i18nEnabled = getI18nEnabled();
    return [
      {
        type: i18nEnabled ? 'input-text-i18n' : 'input-text',
        name: 'time',
        required: true,
        placeholder: '请输入时间',
        label: '时间',
        value: props?.['time']
      },
      {
        type: i18nEnabled ? 'input-text-i18n' : 'input-text',
        name: 'title',
        required: true,
        placeholder: '请输入标题',
        label: '标题',
        value: props?.['title']
      },
      {
        type: 'input-color',
        name: 'color',
        value: props?.['color'],
        placeholder: '请输入',
        label: '颜色'
      },
      getSchemaTpl('icon', {
        value: props?.['icon'],
        placeholder: '请输入',
        clearable: true,
        description: '',
        className: 'fix-icon-picker-overflow',
        pipeIn: (value: any) => value?.icon,
        pipeOut: (value: any) => {
          if (value) {
            return {
              type: 'icon',
              vendor: '',
              icon: value
            };
          }
          return undefined;
        }
      })
    ];
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
        ]
      }
    };
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

          items[e.oldIndex] = items.splice(e.newIndex, 1, items[e.oldIndex])[0];

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
        },
        {
          label: '上下文变量',
          value: 'variable'
        }
      ] as Array<{
        label: string;
        value: 'custom' | 'api' | 'variable';
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
                container: popOverContainer || env.getModalContainer
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
    const delDisabled = !(this.state.items.length > 2);
    const i18nEnabled = getI18nEnabled();
    return (
      <li className="ae-TimelineItemControlItem" key={index}>
        <div className="ae-TimelineItemControlItem-Main">
          <a className="ae-TimelineItemControlItem-dragBar">
            <Icon icon="drag-bar" className="icon" />
          </a>
          {/* <InputBox
            className="ae-TimelineItemControlItem-input"
            value={time}
            placeholder="请输入显示时间"
            clearable={false}
            onChange={(value: string) =>
              this.handleEditLabel(index, value, 'time')
            }
          /> */}
          {amisRender({
            type: i18nEnabled ? 'input-text-i18n' : 'input-text',
            className: 'ae-TimelineItemControlItem-input',
            value: time,
            placeholder: '请输入显示时间',
            clearable: false,
            onChange: (value: string) =>
              this.handleEditLabel(index, value, 'time')
          })}
          {/* {amisRender(
            {
              type: "input-date",
              name: "time",
              value: time,
              className: "ae-TimelineItemControlItem-inputDate",
              label: ""
            }
          )} */}

          {amisRender(
            {
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
                      }
                    ]
                  }
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
                  disabled: delDisabled,
                  onClick: () => this.toggleDelete(index)
                }
              ]
            },
            {
              popOverContainer: null // amis 渲染挂载节点会使用 this.target
            }
          )}
        </div>
        <div className="ae-TimelineItemControlItem-Main">
          {/* <InputBox
            className="ae-TimelineItemControlItem-input-title"
            value={title}
            clearable={false}
            placeholder="请输入标题"
            onChange={(value: string) =>
              this.handleEditLabel(index, value, 'title')
            }
          /> */}
          {amisRender({
            type: i18nEnabled ? 'input-text-i18n' : 'input-text',
            className: 'ae-TimelineItemControlItem-input-title',
            value: title,
            clearable: false,
            placeholder: '请输入标题',
            onChange: (value: string) =>
              this.handleEditLabel(index, value, 'title')
          })}
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

        {source === 'custom' ? (
          <div className="ae-TimelineItemControl-wrapper">
            {Array.isArray(items) && items.length ? (
              <ul className="ae-TimelineItemControl-content" ref={this.dragRef}>
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
        ) : null}

        {source === 'variable'
          ? render(
              'variable',
              getSchemaTpl('sourceBindControl', {
                label: false,
                className: 'ae-ExtendMore'
              }),
              {
                onChange: this.handleAPIChange
              }
            )
          : null}
        {this.renderApiPanel()}
      </div>
    );
  }
}

@FormItem({type: 'ae-timelineItemControl', renderLabel: false})
export class TimelineItemControlRenderer extends React.Component<TimelineItemProps> {
  render() {
    return <TimelineItemControl {...this.props} />;
  }
}
