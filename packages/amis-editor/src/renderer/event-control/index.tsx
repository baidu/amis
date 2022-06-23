import React from 'react';
import {findDOMNode} from 'react-dom';
import cx from 'classnames';
import Sortable from 'sortablejs';
import {DataSchema, FormItem, Icon, TooltipWrapper} from 'amis';
import {FormControlProps, autobind, render as amisRender} from 'amis-core';

import {BASE_ACTION_PROPS} from './comp-action-select';
import ActionConfigPanel from './action-config-panel';
import {
  findActionNode,
  findSubActionNode,
  getEventDesc,
  getEventLabel,
  getPropOfAcion
} from './helper';
import {
  ActionConfig,
  ActionEventConfig,
  ComponentInfo,
  ContextVariables
} from './types';
import {
  PluginActions,
  PluginEvents,
  RendererPluginAction,
  RendererPluginEvent,
  SubRendererPluginAction
} from 'amis-editor-core';

interface EventControlProps extends FormControlProps {
  actions: PluginActions; // 组件的动作列表
  events: PluginEvents; // 组件的事件列表
  actionTree: RendererPluginAction[]; // 动作树
  commonActions?: {[propName: string]: RendererPluginAction}; // 公共动作Map
  value: ActionEventConfig; // 事件动作配置
  onChange: (
    value: any,
    submitOnChange?: boolean,
    changeImmediately?: boolean
  ) => void;
  addBroadcast?: (event: RendererPluginEvent) => void;
  removeBroadcast?: (eventName: string) => void;
  getComponents: (action: RendererPluginAction) => ComponentInfo[]; // 当前页面组件树
  getContextSchemas?: (id?: string, withoutSuper?: boolean) => DataSchema; // 获取上下文
  actionConfigInitFormatter?: (actionConfig: ActionConfig) => ActionConfig; // 动作配置初始化时格式化
  actionConfigSubmitFormatter?: (actionConfig: ActionConfig) => ActionConfig; // 动作配置提交时格式化
  owner?: string; // 组件标识
}

interface EventControlState {
  onEvent: ActionEventConfig;
  events: RendererPluginEvent[];
  eventPanelActive: {
    [prop: string]: boolean;
  };
  showAcionDialog: boolean;
  actionData:
    | {
        eventKey: string;
        actionIndex?: number;
        action?: ActionConfig;
        variables?: ContextVariables[];
        pluginActions: PluginActions;
        getContextSchemas?: (id?: string, withoutSuper?: boolean) => DataSchema;
        rawVariables: ContextVariables[];
        __cmptActionType?: string;
        __actionDesc?: string;
        __cmptTreeSource?: ComponentInfo[],
        __actionSchema?: any;
        __subActions?: SubRendererPluginAction[]
      }
    | undefined;
  type: 'update' | 'add';
  rawVariables: ContextVariables[]; // 外部获取的上下文变量
}

export class EventControl extends React.Component<
  EventControlProps,
  EventControlState
> {
  target: HTMLElement | null;
  eventPanelSortMap: {
    [prop: string]: Sortable;
  } = {};
  drag?: HTMLElement | null;
  isUnmount: boolean;

  constructor(props: EventControlProps) {
    super(props);
    const {events, value, data} = props;

    const eventPanelActive: {
      [prop: string]: boolean;
    } = {};
    const pluginEvents = events[data.type] || [];

    pluginEvents.forEach((event: RendererPluginEvent) => {
      eventPanelActive[event.eventName] = true;
    });

    this.isUnmount = false;

    this.state = {
      onEvent: value ?? this.generateEmptyDefault(pluginEvents),
      events: pluginEvents,
      eventPanelActive,
      showAcionDialog: false,
      actionData: undefined,
      rawVariables: [],
      type: 'add'
    };
  }

  componentDidMount() {
    this.loadContextVariables();
  }

  componentDidUpdate(
    prevProps: EventControlProps,
    prevState: EventControlState
  ) {
    const {value, onChange} = this.props;

    if (value !== prevProps.value) {
      this.setState({onEvent: value});
    }

    if (prevState.onEvent !== this.state.onEvent) {
      onChange && onChange(this.state.onEvent);
    }
  }

  componentWillUnmount() {
    this.isUnmount = true;
  }

  /**
   * 获取上下文变量
   */
  async loadContextVariables() {
    const {getContextSchemas} = this.props;

    // 获取上下文变量
    if (getContextSchemas) {
      const dataSchemaIns = await getContextSchemas();
      const variables = dataSchemaIns?.getDataPropsAsOptions();
      if (!this.isUnmount) {
        this.setState({rawVariables: variables});
      }
    }
  }

  generateEmptyDefault(events: RendererPluginEvent[]) {
    const onEvent: ActionEventConfig = {};
    events.forEach((event: RendererPluginEvent) => {
      if (event.defaultShow) {
        onEvent[`${event.eventName}`] = {
          __isBroadcast: !!event.isBroadcast,
          weight: 0,
          actions: []
        };
      }
    });
    // Object.keys(onEvent).length && props.onChange && props.onChange(onEvent);

    return Object.keys(onEvent).length ? onEvent : {};
  }

  addEvent(event: RendererPluginEvent) {
    const {onChange} = this.props;
    let onEvent = {
      ...this.state.onEvent
    };

    if (onEvent[`${event.eventName}`]) {
      return;
    }
    onEvent[`${event.eventName}`] = {
      __isBroadcast: !!event.isBroadcast,
      weight: 0,
      actions: []
    };

    this.setState({
      onEvent: onEvent
    });

    onChange && onChange(onEvent);
  }

  delEvent(event: string) {
    const {onChange} = this.props;
    let onEvent = {
      ...this.state.onEvent
    };
    delete onEvent[event];
    this.setState({
      onEvent: onEvent
    });

    onChange && onChange(onEvent);
  }

  addAction(event: string, config: any) {
    const {addBroadcast, owner} = this.props;
    const {onEvent, eventPanelActive} = this.state;
    let onEventConfig = {...onEvent};
    let activeConfig = {...eventPanelActive};

    if (config.actionType === 'broadcast') {
      typeof addBroadcast === 'function' &&
        addBroadcast({
          owner: owner, // TODO:标记来源
          isBroadcast: true,
          eventName: config.eventName,
          eventLabel: config.eventLabel,
          description: config.description
        });
    }
    activeConfig[event] = true;
    onEventConfig[event] = {
      actions: onEventConfig[event].actions.concat(config),
      weight: onEvent[event].weight
    };

    this.setState({
      onEvent: onEventConfig,
      eventPanelActive: activeConfig
    });
    this.initDragging();
    this.props.onChange && this.props.onChange(onEventConfig);
  }

  updateAction(event: string, index: number, config: any) {
    this.updateValue(event, index, config);
  }

  delAction(event: string, action: any, index: number) {
    const {onEvent, eventPanelActive} = this.state;
    const {removeBroadcast} = this.props;

    let onEventConfig = {...onEvent};
    let activeConfig = {...eventPanelActive};

    // 删掉对应广播
    if (action.actionType === 'broadcast') {
      typeof removeBroadcast === 'function' &&
        removeBroadcast(action.eventName);
    }

    onEventConfig[event] = {
      actions: onEventConfig[event].actions.filter(
        (item, actionIndex) => index !== actionIndex
      ),
      weight: onEvent[event].weight
    };

    if (onEventConfig[event].actions.length < 1) {
      activeConfig[event] = false;
      this.setState({
        eventPanelActive: activeConfig
      });
      this.eventPanelSortMap[event]?.destroy();
    }

    this.setState({
      onEvent: onEventConfig
    });

    this.props.onChange && this.props.onChange(onEventConfig);
  }

  toggleActivePanel(eventKey: string) {
    const {eventPanelActive} = this.state;
    eventPanelActive[eventKey] = !eventPanelActive[eventKey];
    if (!eventPanelActive[eventKey]) {
      this.eventPanelSortMap[eventKey]?.destroy();
    }
    this.setState({eventPanelActive}, () => {
      this.initDragging();
    });
  }

  updateWeight(event: string, data: any) {
    const {onEvent} = this.state;
    let onEventConfig = {...onEvent};
    onEventConfig[event] = {
      ...onEventConfig[event],
      weight: data.weight || 0
    };

    this.setState({
      onEvent: onEventConfig
    });
  }

  /**
   * 更新事件配置
   *
   * @param {string} event
   * @param {number} actionIndex
   * @param {*} config
   * @memberof EventControl
   */
  updateValue(event: string, index: number, config: any) {
    const {onEvent} = this.state;
    let onEventConfig = {...onEvent};

    onEventConfig[event] = {
      actions: onEvent[event].actions.map((item, actionIndex) => {
        return actionIndex === index
          ? typeof config === 'string'
            ? {
                ...item,
                actionType: config
              }
            : config
          : item;
      }),
      weight: onEvent[event].weight
    };

    this.setState({
      onEvent: onEventConfig
    });

    this.props.onChange && this.props.onChange(onEventConfig);
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
    this.eventPanelSortMap = {};
    const dom = findDOMNode(this) as HTMLElement;
    const {onEvent, eventPanelActive} = this.state;
    const eventPanel: object[] = Array.prototype.slice.call(
      dom.getElementsByClassName('item-content')
    );
    // 找到激活的事件面板
    Object.keys(onEvent)
      .filter((key: string) => {
        return onEvent[key].actions.length && eventPanelActive[key];
      })
      .forEach((key: string, index: number) => {
        if (!this.eventPanelSortMap[key]) {
          this.eventPanelSortMap[key] = this.genSortPanel(
            key,
            eventPanel[index] as HTMLElement
          );
        }
      });
  }

  genSortPanel(eventKey: string, ele: HTMLElement) {
    return new Sortable(ele, {
      group: 'eventControlGroup',
      animation: 150,
      handle: '.ae-option-control-item-dragBar',
      ghostClass: 'ae-option-control-item--dragging',
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
        let onEventConfig = {...this.state.onEvent};
        const newEvent = onEventConfig[eventKey];
        let options = newEvent?.actions.concat();
        // 从后往前移
        if (e.oldIndex > e.newIndex) {
          options = [
            ...options.slice(0, e.newIndex),
            options[e.oldIndex],
            ...options.slice(e.newIndex, e.oldIndex),
            ...options.slice(e.oldIndex + 1, options.length)
          ];
        } else if (e.oldIndex < e.newIndex) {
          // 从前往后
          options = [
            ...(e.oldIndex === 0 ? [] : options.slice(0, e.oldIndex)),
            ...options.slice(e.oldIndex + 1, e.newIndex),
            options[e.oldIndex],
            ...options.slice(e.newIndex, options.length)
          ];
        }
        onEventConfig[eventKey] = {
          ...onEventConfig[eventKey],
          actions: options
        };
        this.setState({
          onEvent: onEventConfig
        });
      }
    });
  }

  destroyDragging() {
    Object.keys(this.eventPanelSortMap).forEach((key: string) => {
      this.eventPanelSortMap[key]?.destroy();
    });
  }

  // 唤起动作配置弹窗
  activeActionDialog(
    data: Pick<EventControlState, 'showAcionDialog' | 'type' | 'actionData'>
  ) {
    const {
      actions: pluginActions,
      getContextSchemas,
      actionConfigInitFormatter,
      getComponents,
      actionTree
    } = this.props;
    const {events, rawVariables} = this.state;

    // 收集事件变量
    let eventVariables: ContextVariables[] = [
      {
        label: '事件变量',
        children: []
      }
    ];
    const eventConfig = events.find(
      item => item.eventName === data.actionData!.eventKey
    );

    eventConfig?.dataSchema?.forEach((ds: any) => {
      const dataSchema = new DataSchema(ds || []);
      eventVariables[0].children = [
        ...eventVariables[0].children!,
        ...dataSchema.getDataPropsAsOptions()
      ];
    });

    const variables = [...eventVariables, ...rawVariables];

    // 编辑操作，需要格式化动作配置
    if (data.type === 'update') {
      const action = data.actionData!.action!;
      const actionConfig = actionConfigInitFormatter?.(action);
      const actionNode = findActionNode(actionTree, actionConfig?.actionType!);
      const hasSubActionNode = findSubActionNode(actionTree, action.actionType);
      data.actionData = {
        eventKey: data.actionData!.eventKey,
        actionIndex: data.actionData!.actionIndex,
        variables,
        pluginActions,
        getContextSchemas,
        rawVariables,
        ...actionConfig,
        __cmptTreeSource: getComponents?.(actionNode!) ?? [],
        __cmptActionType:
          hasSubActionNode || action.componentId ? action.actionType : '',
        __actionDesc: actionNode!.description!, // 树节点描述
        __actionSchema: actionNode!.schema, // 树节点schema
        __subActions: hasSubActionNode?.actions // 树节点子动作
        // broadcastId: action.actionType === 'broadcast' ? action.eventName : ''
      };
    } else {
      data.actionData = {
        eventKey: data.actionData!.eventKey,
        variables,
        pluginActions,
        getContextSchemas,
        rawVariables
      };
    }

    this.setState(data);
  }

  // 渲染描述信息
  renderDesc(action: ActionConfig) {
    const {actions: pluginActions, actionTree, commonActions} = this.props;
    const desc = getPropOfAcion(
      action,
      'descDetail',
      actionTree,
      pluginActions,
      commonActions
    );

    return typeof desc === 'function' ? (
      <div className="action-control-content">{desc?.(action) || '-'}</div>
    ) : null;
  }

  renderConfig(type: string) {
    const {
      actionTree,
      actions: pluginActions,
      commonActions,
      getComponents
    } = this.props;
    return [
      {
        type: 'form',
        title: '',
        mode: 'normal',
        wrapperComponent: 'div',
        submitText: '保存',
        autoFocus: true,
        preventEnterSubmit: true,
        // debug: true,
        onSubmit: this.submitConfig.bind(this, type),
        body: [
          {
            type: 'grid',
            className: 'h-full',
            columns: [
              {
                body: [
                  {
                    type: 'tpl',
                    tpl: '执行动作',
                    className: 'action-panel-title',
                    inline: false
                  },
                  {
                    type: 'input-tree',
                    name: 'actionType',
                    disabled: false,
                    options: actionTree,
                    showIcon: false,
                    className: 'action-tree',
                    mode: 'normal',
                    labelField: 'actionLabel',
                    valueField: 'actionType',
                    inputClassName: 'no-border action-tree-control',
                    onChange: (
                      value: string,
                      oldVal: any,
                      data: any,
                      form: any
                    ) => {
                      // 因为不知道动作都有哪些字段，这里只保留基础配置
                      let removeKeys: {
                        [key: string]: any;
                      } = {};
                      let __cmptActionType = '';

                      Object.keys(form.data).forEach((key: string) => {
                        if (!BASE_ACTION_PROPS.includes(key)) {
                          removeKeys[key] = undefined;
                        }
                      });

                      if (
                        value === 'openDialog' &&
                        !['dialog', 'drawer'].includes(__cmptActionType)
                      ) {
                        __cmptActionType = 'dialog';
                      }

                      if (
                        value === 'closeDialog' &&
                        !['closeDialog', 'closeDrawer'].includes(
                          __cmptActionType
                        )
                      ) {
                        __cmptActionType = 'closeDialog';
                      }

                      if (
                        value === 'visibility' &&
                        !['show', 'hidden'].includes(__cmptActionType)
                      ) {
                        __cmptActionType = 'show';
                      }

                      if (
                        value === 'usability' &&
                        !['enabled', 'disabled'].includes(__cmptActionType)
                      ) {
                        __cmptActionType = 'enabled';
                      }

                      const action = data.selectedOptions[0];

                      form.setValues({
                        ...removeKeys,
                        componentId: form.data.componentId ? '' : undefined,
                        __cmptTreeSource: getComponents?.(action) ?? [],
                        __cmptActionType,
                        __actionDesc: action.description,
                        __actionSchema: action.schema,
                        __subActions: action.actions
                      });
                    }
                  }
                ],
                md: 3,
                columnClassName: 'left-panel'
              },
              {
                body: [
                  {
                    type: 'tpl',
                    tpl: '动作说明',
                    className: 'action-panel-title',
                    visibleOn: 'data.actionType',
                    inline: false
                  },
                  {
                    type: 'tpl',
                    className: 'action-desc',
                    tpl: '${__actionDesc}',
                    visibleOn: 'data.actionType'
                  },
                  {
                    type: 'tpl',
                    tpl: '基础设置',
                    className: 'action-panel-title',
                    visibleOn: 'data.actionType',
                    inline: false
                  },
                  {
                    type: 'container',
                    className: 'right-panel-container',
                    body: [
                      {
                        asFormItem: true,
                        component: ActionConfigPanel,
                        pluginActions,
                        commonActions
                      },
                      {
                        type: 'tpl',
                        tpl: '高级设置',
                        inline: false,
                        className: 'action-panel-title',
                        visibleOn: 'data.actionType'
                      },
                      {
                        name: 'expression',
                        title: '',
                        type: 'input-formula',
                        variableMode: 'tabs',
                        inputMode: 'input-group',
                        variables: '${variables}',
                        className: 'action-exec-on',
                        label: '执行条件',
                        mode: 'horizontal',
                        size: 'lg',
                        placeholder: '不设置条件，默认执行该动作',
                        visibleOn: 'data.actionType'
                      }
                    ]
                  }
                ],
                columnClassName: 'right-panel'
              }
            ]
          }
        ],
        style: {
          borderStyle: 'solid'
        },
        className: 'action-config-panel'
      }
    ];
  }

  submitConfig(type: string, config: any) {
    const {actionConfigSubmitFormatter} = this.props;
    const action = actionConfigSubmitFormatter?.(config) ?? config;

    if (type === 'add') {
      this.addAction(config.eventKey, action);
    } else if (type === 'update') {
      this.updateAction(config.eventKey, config.actionIndex, action);
    }
    this.setState({actionData: undefined});
    this.setState({showAcionDialog: false});
  }

  render() {
    const {actionTree, actions: pluginActions, commonActions} = this.props;
    const {
      onEvent,
      events,
      eventPanelActive,
      showAcionDialog,
      actionData,
      type
    } = this.state;
    const eventKeys = Object.keys(onEvent);

    return (
      <div className="ae-event-control">
        <header
          className={cx({
            'ae-event-control-header': true,
            'no-bd-btm': !eventKeys.length
          })}
        >
          {amisRender({
            type: 'dropdown-button',
            level: 'enhance',
            label: '添加事件',
            disabled: false,
            className: 'block w-full',
            closeOnClick: true,
            buttons: events.map(item => ({
              type: 'button',
              actionType: '',
              label: item.eventLabel,
              onClick: this.addEvent.bind(this, item)
            }))
          })}
        </header>
        <ul className="ae-event-control-content" ref={this.dragRef}>
          {eventKeys.length ? (
            eventKeys.map((eventKey, eventIndex) => {
              return (
                <li className="event-item" key={`content_${eventIndex}`}>
                  <div
                    className={cx({
                      'event-item-header': true,
                      'no-bd-btm': !(
                        onEvent[eventKey].actions?.length &&
                        eventPanelActive[eventKey]
                      )
                    })}
                  >
                    <TooltipWrapper
                      tooltipClassName="event-item-header-tip"
                      trigger="hover"
                      placement="top"
                      tooltip={{
                        children: () => (
                          <div>
                            {getEventDesc(events, eventKey) || eventKey}
                          </div>
                        )
                      }}
                    >
                      <div>{getEventLabel(events, eventKey) || eventKey}</div>
                    </TooltipWrapper>
                    <div className="event-item-header-toolbar">
                      <div
                        onClick={this.activeActionDialog.bind(this, {
                          showAcionDialog: true,
                          type: 'add',
                          actionData: {
                            eventKey
                          }
                        })}
                      >
                        <Icon className="icon" icon="add-btn" />
                      </div>
                      <div onClick={this.delEvent.bind(this, eventKey)}>
                        <Icon className="icon" icon="delete-bold-btn" />
                      </div>
                      <div
                        onClick={this.toggleActivePanel.bind(this, eventKey)}
                      >
                        {eventPanelActive[eventKey] ? (
                          <Icon className="icon" icon="open-btn-r" />
                        ) : (
                          <Icon className="icon" icon="close-btn" />
                        )}
                      </div>
                    </div>
                  </div>
                  {onEvent[eventKey].actions.length &&
                  eventPanelActive[eventKey] ? (
                    <ul className="item-content">
                      {onEvent[eventKey].actions.map((action, actionIndex) => {
                        return (
                          <li
                            className="ae-option-control-item"
                            key={actionIndex}
                          >
                            <div className="action-control-header">
                              <div className="action-control-header-left">
                                <div className="ae-option-control-item-dragBar">
                                  <Icon
                                    icon="drag-six-circle-btn"
                                    className="icon"
                                  />
                                </div>
                                <div className="action-item-actiontype">
                                  {getPropOfAcion(action, 'actionLabel', actionTree, pluginActions, commonActions) || action.actionType}
                                </div>
                              </div>
                              <div className="action-control-header-right">
                                <div
                                  onClick={this.activeActionDialog.bind(this, {
                                    showAcionDialog: true,
                                    type: 'update',
                                    actionData: {
                                      action,
                                      eventKey,
                                      actionIndex
                                    }
                                  })}
                                >
                                  <Icon className="icon" icon="edit-full-btn" />
                                </div>
                                <div
                                  onClick={this.delAction.bind(
                                    this,
                                    eventKey,
                                    action,
                                    actionIndex
                                  )}
                                >
                                  <Icon
                                    className="icon"
                                    icon="delete-easy-btn"
                                  />
                                </div>
                              </div>
                            </div>
                            {this.renderDesc(action)}
                          </li>
                        );
                      })}
                    </ul>
                  ) : null}
                </li>
              );
            })
          ) : (
            <div className="ae-event-control-placeholder">
              快去创建事件，让你的产品动起来吧
            </div>
          )}
        </ul>
        {showAcionDialog
          ? amisRender(
              {
                type: 'dialog',
                title: '动作配置',
                headerClassName: 'font-bold',
                className: 'action-config-dialog',
                closeOnEsc: true,
                closeOnOutside: false,
                showCloseButton: true,
                size: 'lg',
                body: this.renderConfig(type),
                onClose: () => {
                  this.setState({showAcionDialog: false});
                }
              },
              {
                data: actionData // 必须这样，不然变量会被当作数据映射处理掉
              }
            )
          : null}
      </div>
    );
  }
}

@FormItem({
  type: 'ae-eventControl'
})
export class EventControlRenderer extends EventControl {}
