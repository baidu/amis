/**
 * @file Tabs组件关联数据的可视化编辑控件
 */
import React from 'react';
import {findDOMNode} from 'react-dom';
import cx from 'classnames';
import cloneDeep from 'lodash/cloneDeep';
import Sortable from 'sortablejs';
import {
  render as amisRender,
  BaseSchema,
  Button,
  FormItem,
  Icon,
  SchemaCollection,
  SchemaObject
} from 'amis';
import {
  BaseEventContext,
  diff,
  getI18nEnabled,
  tipedLabel,
  autobind,
  getSchemaTpl,
  anyChanged
} from 'amis-editor-core';
import type {FormControlProps} from 'amis-core';
import {schemaArrayFormat, schemaToArray} from '../util';

type TabProp = {
  title: string | SchemaObject;
  body: SchemaCollection;
};
export interface TabsControlProps extends FormControlProps {}

export interface TabsState {
  tabs: Array<TabProp>;
  srcType: 'custom' | 'variable';
  source?: string;
  titleSchema?: SchemaCollection;
  tabSchema?: SchemaCollection;
}

export default class TabsControl extends React.Component<
  TabsControlProps,
  TabsState
> {
  sortable?: Sortable;
  drag?: HTMLElement | null;
  target: HTMLElement | null;

  constructor(props: TabsControlProps) {
    super(props);
    this.state = {
      tabs: props.data.tabs,
      srcType: props.data.source ? 'variable' : 'custom',
      source: props.data.source,
      titleSchema: props.data.titleSchema,
      tabSchema: props.data.tabSchema
    };
  }

  componentDidUpdate(prevProps: any, preState: any) {
    const props = this.props;

    // json更新tabs代码，更新右侧配置面板
    if (anyChanged(['tabs'], prevProps?.data ?? {}, props?.data ?? {})) {
      this.setState({tabs: props?.data?.tabs});
    }
  }
  /**
   * 切换选项来源类型
   */
  @autobind
  handleSourceChange(srcType: 'custom' | 'variable') {
    this.setState({srcType: srcType}, this.handleChange);
  }

  /**
   * 更改source绑定的上下文变量
   * @param source 绑定的上下文变量
   */
  @autobind
  handleVariableChange(source: string) {
    this.setState({source}, this.handleChange);
  }

  handleChange() {
    const {srcType, source, tabs, titleSchema, tabSchema} = this.state;
    const {onBulkChange} = this.props;
    const data: Partial<TabsControlProps> = {
      srcType: undefined,
      tabs: undefined,
      titleSchema: undefined,
      tabSchema: undefined,
      source: undefined
    };
    const defaultTabs = [
      {
        title: '选项卡1',
        body: '内容1'
      },
      {
        title: '选项卡2',
        body: '内容2'
      }
    ];

    if (srcType === 'custom') {
      data.tabs = (tabs || defaultTabs).map(item => ({...item}));
    }
    if (srcType === 'variable') {
      if (!source?.length && tabs) {
        data.tabs = tabs?.map(item => ({...item}));
      }
      data.source = source;
      data.titleSchema = titleSchema;
      data.tabSchema = tabSchema;
    }
    onBulkChange && onBulkChange(data);
  }

  // 删除tab
  handleDelete(index: number) {
    const tabs = this.state.tabs.concat();
    tabs.splice(index, 1);
    this.setState({tabs}, this.handleChange);
  }

  // 处理标题
  handleTitleChange(index: number, value?: string) {
    const {manager, context} = this.props;
    const tabs = this.state.tabs.concat();
    // 输入字符串
    if (typeof value === 'string') {
      // 上下文配置模板
      if (index === -1) {
        return this.setState({titleSchema: value}, () => this.handleChange());
      }

      tabs.splice(index, 1, {...tabs[index], title: value});
      return this.setState({tabs}, () => this.handleChange());
    }

    const store = manager.store;
    // 获取tabs组件id
    const tabsNode = store.getNodeById(store?.activeId);
    // 配置处理单个tab页，使其选中对应选项卡
    if (index !== -1) {
      const control = tabsNode.getComponent();
      if (control?.switchTo) {
        control.switchTo(index);
      }
      return;
    }

    // 配置schema
    const prevValue = store.getValueOf(store?.activeId);

    const defaultItemSchema = tabs[index]?.title ?? {
      type: 'tpl',
      tpl: '请编辑内容'
    };

    tabsNode &&
      prevValue &&
      manager.openSubEditor({
        title: '配置标签页标题',
        value: schemaToArray(defaultItemSchema),
        slot: {
          type: 'container',
          body: '$$'
        },
        onChange: (newValue: BaseSchema) => {
          const newTabsValue = cloneDeep(prevValue);

          if (index === -1) {
            newTabsValue.titleSchema = newValue;
          } else {
            newTabsValue.tabs[index].title = schemaArrayFormat(newValue);
          }

          manager.panelChangeValue(newValue, diff(prevValue, newTabsValue));
        }
      });
  }

  // 编辑tab内容模板
  editTabSchema(field: 'title' | 'tab') {
    const {manager} = this.props;
    const store = manager.store;
    const node = store.getNodeById(store?.activeId);
    const prevValue = store.getValueOf(store?.activeId);

    const text = field === 'title' ? '标题' : '内容';
    const prevScema =
      field === 'title' ? prevValue.titleSchema : prevValue.tabSchema;
    const defaultItemSchema = prevScema
      ? typeof prevScema === 'string'
        ? {
            type: 'tpl',
            tpl: prevScema
          }
        : prevScema
      : {
          type: 'tpl',
          tpl: '请编辑内容'
        };

    node &&
      prevValue &&
      manager.openSubEditor({
        title: `配置标签页${text}`,
        value: schemaToArray(defaultItemSchema),
        slot: {
          type: 'container',
          body: '$$'
        },
        onChange: (newValue: BaseSchema) => {
          const newTabsValue = cloneDeep(prevValue);

          field === 'title'
            ? (newTabsValue.titleSchema = newValue)
            : (newTabsValue.tabSchema = newValue);

          manager.panelChangeValue(newValue, diff(prevValue, newTabsValue));
        }
      });
  }

  @autobind
  handleAdd() {
    var {tabs} = this.state;
    const defaultTab: TabProp = {
      title: `选项卡${tabs?.length + 1 || 1}`,
      body: [
        {
          type: 'tpl',
          tpl: `内容${tabs?.length + 1 || 1}`
        }
      ]
    };
    const newTabs = Array.isArray(tabs)
      ? tabs.concat(defaultTab)
      : [defaultTab];
    this.setState({tabs: newTabs}, this.handleChange);
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
      dom.querySelector('.ae-TabsControl-content') as HTMLElement,
      {
        group: 'TabsControlGroup',
        animation: 150,
        handle: '.ae-TabsControlItem-dragBar',
        ghostClass: 'ae-TabsControlItem--dragging',
        onEnd: (e: any) => {
          // 没有移动
          if (e.newIndex === e.oldIndex) {
            return;
          }
          // 交换后的list
          const parent = e.to as HTMLElement;
          if (
            e.newIndex < e.oldIndex &&
            e.oldIndex < parent.childNodes.length - 1
          ) {
            // 前移
            parent.insertBefore(e.item, parent.childNodes[e.oldIndex + 1]);
          } else if (e.oldIndex < parent.childNodes.length - 1) {
            // 后移
            parent.insertBefore(e.item, parent.childNodes[e.oldIndex]);
          } else {
            parent.appendChild(e.item);
          }

          const tabs = this.state.tabs.concat();
          tabs.splice(e.newIndex, 0, tabs.splice(e.oldIndex, 1)[0]);
          this.setState({tabs}, () => this.handleChange());
        }
      }
    );
  }

  destroyDragging() {
    this.sortable && this.sortable.destroy();
  }

  renderHeader() {
    const {render, label, useMobileUI, env, popOverContainer, classPrefix} =
      this.props;
    const {srcType} = this.state;
    const optionSourceList = (
      [
        {
          label: '自定义选项',
          value: 'custom'
        },
        {
          label: '上下文变量',
          value: 'variable'
        }
      ] as Array<{
        label: string;
        value: 'custom' | 'variable';
      }>
    ).map(item => ({
      ...item,
      onClick: () => this.handleSourceChange(item.value)
    }));

    return (
      <header className="ae-TabsControl-header">
        <label className={cx(`${classPrefix}Form-label`)}>
          {label || ''}
          {render('label-remark', {
            type: 'remark',
            tooltip: '切换后将会清空原先数据源配置',
            className: cx(`Form-lableRemark`),
            useMobileUI,
            container: popOverContainer || env.getModalContainer
          })}
        </label>
        <div>
          {render(
            'tabs-source',
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
                selected: optionSourceList.find(item => item.value === srcType)!
                  .label
              }
            }
          )}
        </div>
      </header>
    );
  }

  // 每个选项卡
  renderOption(props: TabProp & {index: number}) {
    const {title, index} = props;
    const {render} = this.props;
    const delDisabled = this.state.tabs?.length <= 1;
    const i18nEnabled = getI18nEnabled();
    return (
      <li className="ae-TabsControlItem" key={index}>
        <div className="ae-TabsControlItem-Main">
          <a className="ae-TabsControlItem-dragBar">
            <Icon icon="drag-bar" className="icon" />
          </a>
          {render('ae-TabsControlItem-title', {
            type: i18nEnabled ? 'input-text-i18n' : 'input-text',
            className: 'ae-TabsControlItem-input',
            value: title,
            label: '',
            placeholder: '请输入标题',
            clearable: false,
            onChange: (value: string) => this.handleTitleChange(index, value)
          })}
          <Button
            className="ae-TabsControlItem-redirectButton"
            size="sm"
            tooltip={{
              enterable: false,
              content: '编辑器选中当前标签页',
              tooltipTheme: 'dark',
              placement: 'left',
              mouseLeaveDelay: 0
            }}
            level="link"
            onClick={this.handleTitleChange.bind(this, index)}
          >
            选中
          </Button>
          {!delDisabled ? (
            <Button
              className="ae-TabsControlItem-delButton "
              size="sm"
              level="link"
              onClick={this.handleDelete.bind(this, index)}
            >
              <Icon
                icon="status-close"
                className={cx(
                  'ae-config-schema-icon',
                  'icon-config-schema',
                  'icon'
                )}
              />
            </Button>
          ) : null}
        </div>
      </li>
    );
  }

  render() {
    const {srcType, tabs} = this.state;
    const i18nEnabled = getI18nEnabled();
    const {render, className} = this.props;
    return (
      <div className={cx('ae-TabsControl', className)}>
        {this.renderHeader()}
        {srcType === 'custom' ? (
          <div className="ae-TabsControl-wrapper">
            {Array.isArray(tabs) && tabs.length ? (
              <ul className="ae-TabsControl-content" ref={this.dragRef}>
                {tabs.map((item: TabProp, index: number) =>
                  this.renderOption({...item, index})
                )}
              </ul>
            ) : (
              <div className="ae-TabsControl-placeholder">无选项卡</div>
            )}

            <div className="ae-TabsControl-footer">
              {render('ae-TabsControl-footer', {
                type: 'button',
                level: 'enhance',
                size: 'sm',
                block: true,
                onClick: this.handleAdd.bind(this),
                label: '新增'
              })}
            </div>
          </div>
        ) : null}

        {srcType === 'variable' ? (
          <div>
            {render(
              'variable',
              getSchemaTpl('sourceBindControl', {
                label: tipedLabel(
                  '关联数据',
                  '根据该数据来动态重复渲染所配置的选项卡'
                )
              }),
              {
                onChange: this.handleVariableChange
              }
            )}
            {render('titleSchema', {
              title: '基本',
              label: '点击配置标签页标题模板',
              type: 'button',
              level: 'enhance',
              size: 'sm',
              name: 'titleSchema',
              block: true,
              onClick: this.editTabSchema.bind(this, 'title')
            })}
            {render('tabSchema', {
              title: '基本',
              label: '点击配置标签页内容模板',
              type: 'button',
              level: 'enhance',
              size: 'sm',
              block: true,
              name: 'tabSchema',
              onClick: this.editTabSchema.bind(this, 'tab')
            })}
          </div>
        ) : null}
      </div>
    );
  }
}

@FormItem({type: 'ae-tabsControl', renderLabel: false})
export class TabsControlRenderer extends React.Component<TabsControlProps> {
  render() {
    return <TabsControl {...this.props} />;
  }
}
