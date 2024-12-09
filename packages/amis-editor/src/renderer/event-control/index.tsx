import React from 'react';
import {findDOMNode} from 'react-dom';
import cx from 'classnames';
import Sortable from 'sortablejs';
import {
  DataSchema,
  FormItem,
  Icon,
  TooltipWrapper,
  render as amisRender,
  Tooltip,
  PopOverContainer,
  Tree,
  Button
} from 'amis';
import cloneDeep from 'lodash/cloneDeep';
import groupBy from 'lodash/groupBy';
import {
  FormControlProps,
  JSONTraverse,
  JSONValueMap,
  Schema,
  autobind,
  findTree,
  getRendererByName,
  guid
} from 'amis-core';
import ActionDialog from './action-config-dialog';
import {
  getEventDesc,
  getEventStrongDesc,
  getEventLabel,
  updateCommonUseActions,
  getActionsByRendererName
} from './helper';
import {
  findActionNode,
  findSubActionNode,
  getActionType,
  getPropOfAcion
} from './eventControlConfigHelper';
import {SELECT_PROPS_CONTAINER} from './constants';
import {
  ActionConfig,
  ActionEventConfig,
  ComponentInfo,
  ContextVariables
} from './types';
import {
  EditorManager,
  PluginActions,
  PluginEvents,
  RendererPluginAction,
  RendererPluginEvent,
  SubRendererPluginAction,
  IGlobalEvent
} from 'amis-editor-core';
export * from './helper';
import {i18n as _i18n} from 'i18n-runtime';
import {reaction} from 'mobx';
import {updateComponentContext} from 'amis-editor-core';
import type {VariableItem} from 'amis-ui';

interface EventControlProps extends FormControlProps {
  manager: EditorManager;
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
  getComponents: (action: any) => ComponentInfo[]; // 当前页面组件树
  getContextSchemas?: (id?: string, withoutSuper?: boolean) => DataSchema; // 获取上下文
  actionConfigInitFormatter?: (actionConfig: ActionConfig) => ActionConfig; // 动作配置初始化时格式化
  actionConfigSubmitFormatter?: (
    actionConfig: ActionConfig,
    type?: string,
    actionData?: ActionData,
    schema?: Schema
  ) => ActionConfig; // 动作配置提交时格式化
  owner?: string; // 组件标识

  // 监听面板提交事件
  // 更改后写入 store 前触发
  subscribeSchemaSubmit: (
    fn: (schema: any, value: any, id: string, diff?: any) => any,
    once?: boolean
  ) => () => void;
}

interface EventDialogData {
  eventName: string;
  eventLabel: string;
  isBroadcast: boolean;
  debounceConfig?: {
    open: boolean;
    wait?: number;
  };
  trackConfig?: {
    open: boolean;
    id: string;
    name: string;
  };
  [propName: string]: any;
}

export interface ActionData {
  eventKey: string;
  actionIndex?: number;
  action?: ActionConfig;
  variables?: ContextVariables[];
  pluginActions: PluginActions;
  getContextSchemas?: (id?: string, withoutSuper?: boolean) => DataSchema;
  groupType?: string;
  __actionDesc?: string;
  __cmptTreeSource?: ComponentInfo[];
  __superCmptTreeSource?: ComponentInfo[];
  __actionSchema?: any;
  __subActions?: SubRendererPluginAction[];
  __setValueDs?: any[];
  [propName: string]: any;
}

interface EventControlState {
  onEvent: ActionEventConfig;
  events: RendererPluginEvent[];
  eventPanelActive: {
    [prop: string]: boolean;
  };
  showAcionDialog: boolean;
  showEventDialog: boolean;
  eventDialogData?: EventDialogData;
  actionData: ActionData | undefined;
  type: 'update' | 'add';
  appLocaleState?: number;
  actionRelations: any;
  globalEvents: IGlobalEvent[];
}

const dialogObjMap = {
  dialog: 'dialog',
  drawer: 'drawer',
  confirmDialog: ['dialog', 'args']
};

export class EventControl extends React.Component<
  EventControlProps,
  EventControlState
> {
  target: HTMLElement | null;
  eventPanelSortMap: {
    [prop: string]: Sortable;
  } = {};
  drag?: HTMLElement | null;
  unReaction: any;
  unEventReaction: any;
  submitSubscribers: Array<(value: any) => any> = [];

  constructor(props: EventControlProps) {
    super(props);
    const {events, value, data, rawType} = props;
    const editorStore = props.manager.store;
    const globalEvents = editorStore.globalEvents;
    const eventPanelActive: {
      [prop: string]: boolean;
    } = {};

    const tmpEvents =
      events[
        rawType || (!data.type || data.type === 'text' ? 'plain' : data.type)
      ] || [];
    const pluginEvents =
      typeof tmpEvents === 'function' ? tmpEvents(data) : [...tmpEvents];

    pluginEvents.forEach((event: RendererPluginEvent) => {
      eventPanelActive[event.eventName] = true;
    });

    const actionRelations = this.getActionRelations();
    globalEvents?.forEach(event => {
      eventPanelActive[event.name] = true;
    });

    this.state = {
      onEvent: value ?? this.generateEmptyDefault(pluginEvents),
      events: pluginEvents,
      eventPanelActive,
      showAcionDialog: false,
      showEventDialog: false,
      actionData: undefined,
      type: 'add',
      appLocaleState: 0,
      actionRelations: actionRelations ?? [],
      globalEvents: globalEvents
    };
  }

  componentDidMount(): void {
    const editorStore = this.props.manager.store;
    this.unReaction = reaction(
      () => editorStore?.appLocaleState,
      () => {
        this.setState({
          appLocaleState: editorStore?.appLocaleState
        });
      }
    );
    this.unEventReaction = reaction(
      () => editorStore.globalEvents,
      () => {
        this.setState({
          globalEvents: editorStore.globalEvents
        });
      }
    );
  }

  componentWillUnmount() {
    this.unReaction?.();
    this.unEventReaction?.();
    this.submitSubscribers = [];
  }

  componentDidUpdate(
    prevProps: EventControlProps,
    prevState: EventControlState
  ) {
    const {value, data, events, rawType} = this.props;

    if (value !== prevProps.value) {
      this.setState({onEvent: value});
    }

    if (
      data?.type !== prevProps.data?.type ||
      data?.onEvent !== prevProps.data?.onEvent
    ) {
      const tmpEvents =
        events[
          rawType || (!data.type || data.type === 'text' ? 'plain' : data.type)
        ] || [];
      const pluginEvents =
        typeof tmpEvents === 'function' ? tmpEvents(data) : [...tmpEvents];
      const actionRelations = this.getActionRelations();

      this.setState({
        events: pluginEvents,
        actionRelations: actionRelations
      });
    }
  }

  @autobind
  subscribeSubmit(subscriber: (value: any) => any) {
    const fn = (value: any) => subscriber?.(value) || value;
    this.submitSubscribers.push(fn);
    return () => {
      const idx = this.submitSubscribers.indexOf(fn);
      this.submitSubscribers.splice(idx, 1);
    };
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

  addEvent(event: RendererPluginEvent, disabled: boolean) {
    const {onChange} = this.props;
    let onEvent = {
      ...this.state.onEvent
    };
    if (disabled) {
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

  addGlobalEvent(event: IGlobalEvent, disabled: boolean) {
    const {onChange} = this.props;
    let onEvent = {
      ...this.state.onEvent
    };
    if (disabled) {
      return;
    }
    onEvent[`${event.name}`] = {
      weight: 0,
      actions: []
    };
    this.setState({
      onEvent: onEvent
    });

    onChange && onChange(onEvent);
  }

  activeEventDialog(eventInfo: EventDialogData) {
    eventInfo = cloneDeep(eventInfo);
    if (!eventInfo.debounce) {
      // 防抖配置的默认值
      eventInfo.debounce = {
        open: false,
        wait: 100
      };
    } else {
      eventInfo.debounce = {
        open: true,
        ...eventInfo.debounce
      };
    }
    if (!eventInfo.track) {
      eventInfo.track = {
        open: false
      };
    } else {
      eventInfo.track = {
        open: true,
        ...eventInfo.track
      };
    }
    this.setState({
      eventDialogData: eventInfo,
      showEventDialog: true
    });
  }

  eventDialogSubmit(formData: any) {
    const {onChange} = this.props;
    const {eventName, debounce = {}, track = {}} = formData;
    let onEvent = {
      ...this.state.onEvent
    };
    let eventConfig = {...onEvent[`${eventName}`]};
    if (!debounce.open) {
      delete eventConfig.debounce;
    } else {
      eventConfig = {
        ...eventConfig,
        debounce: {
          wait: debounce.wait
        }
      };
    }
    if (!track.open) {
      delete eventConfig.track;
    } else {
      eventConfig = {
        ...eventConfig,
        track: {
          id: track.id,
          name: track.name
        }
      };
    }

    onEvent[`${eventName}`] = {
      ...eventConfig
    };
    this.setState({
      onEvent,
      showEventDialog: false
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
    if (config.actionType) {
      onEventConfig[event] = {
        ...onEventConfig[event],
        actions: (onEventConfig[event]?.actions || []).concat(
          // 临时处理，后面干掉这么多交互属性
          Object.defineProperties(config, {
            __cmptTreeSource: {
              enumerable: false
            },
            __nodeSchema: {
              enumerable: false
            },
            __subActions: {
              enumerable: false
            }
          })
        )
      };
    }

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
      ...onEventConfig[event],
      actions: onEventConfig[event].actions.filter(
        (item, actionIndex) => index !== actionIndex
      )
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
  async updateValue(event: string, index: number, config: any) {
    const {onEvent} = this.state;
    let emptyEventAcion = {...onEvent};
    let onEventConfig = {...onEvent};

    emptyEventAcion[event] = {
      actions: onEvent[event].actions.map((item, actionIndex) => {
        return actionIndex === index ? {actionType: ''} : item;
      }),
      weight: onEvent[event].weight
    };
    onEventConfig[event] = {
      ...onEvent[event],
      actions: onEvent[event].actions.map((item, actionIndex) => {
        return actionIndex === index
          ? typeof config === 'string'
            ? {
                ...item,
                actionType: config
              }
            : Object.defineProperties(config, {
                __cmptTreeSource: {
                  enumerable: false
                },
                __nodeSchema: {
                  enumerable: false
                },
                __subActions: {
                  enumerable: false
                }
              })
          : item;
      })
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
        return onEvent[key]?.actions?.length && eventPanelActive[key];
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
        let onEventConfig = cloneDeep(this.state.onEvent);
        const newEvent = onEventConfig[eventKey];
        let options = newEvent?.actions.concat();
        // 从后往前移
        options.splice(e.newIndex, 0, options.splice(e.oldIndex, 1)[0]);
        onEventConfig[eventKey] = {
          ...onEventConfig[eventKey],
          actions: options
        };
        this.setState({
          onEvent: onEventConfig
        });
        this.props.onChange && this.props.onChange(onEventConfig);
      }
    });
  }

  destroyDragging() {
    Object.keys(this.eventPanelSortMap).forEach((key: string) => {
      this.eventPanelSortMap[key]?.el && this.eventPanelSortMap[key]?.destroy();
    });
  }

  buildEventDataSchema(data: any, manager: EditorManager) {
    const {
      actionTree,
      actions: pluginActions,
      commonActions,
      allComponents
    } = this.props;
    const {events, onEvent, globalEvents} = this.state;
    const eventConfig = events.find(
      item => item.eventName === data.actionData!.eventKey
    );
    const globalEventConfig = globalEvents?.find(
      item => item.name === data.actionData!.eventKey
    );
    // 收集当前事件动作出参
    let actions = onEvent[data.actionData!.eventKey]?.actions;

    // 编辑的时候只能拿到当前动作前面动作的事件变量以及当前动作事件
    if (data.type === 'update') {
      actions = actions.slice(
        0,
        data.actionData!.actionIndex !== undefined
          ? data.actionData!.actionIndex + 1
          : 0
      );
    }

    let jsonSchema: any = {};

    if (globalEventConfig) {
      jsonSchema = {
        type: 'object',
        properties: {
          data: {
            type: 'object',
            title: '数据',
            properties: (globalEventConfig.mapping || []).reduce(
              (acc: any, item) => {
                acc[item.key] = {
                  type: item.type,
                  title: `${item.key}(全局事件参数)`
                };
                return acc;
              },
              {}
            )
          }
        }
      };
    } else {
      // 动态构建事件参数
      if (typeof eventConfig?.dataSchema === 'function') {
        jsonSchema = eventConfig.dataSchema(manager)?.[0];
      } else {
        jsonSchema = {...(eventConfig?.dataSchema?.[0] ?? {})};
      }
    }

    actions
      ?.filter(item => item.outputVar)
      ?.forEach((action: ActionConfig, index: number) => {
        if (
          manager.dataSchema.getScope(
            `action-output-${action.actionType}_ ${index}`
          )
        ) {
          return;
        }

        const actionLabel = getPropOfAcion(
          action,
          'actionLabel',
          actionTree,
          pluginActions,
          commonActions,
          allComponents
        );
        const actionSchema = getPropOfAcion(
          action,
          'outputVarDataSchema',
          actionTree,
          pluginActions,
          commonActions,
          allComponents
        );

        jsonSchema = {
          ...jsonSchema,
          properties: {
            ...jsonSchema.properties,
            data: {
              type: 'object',
              title: '数据',
              ...jsonSchema.properties?.data,
              properties: {
                ...jsonSchema.properties?.data?.properties,
                [action.outputVar!]: {
                  ...(Array.isArray(actionSchema) && (actionSchema[0] || {})),
                  title: `${action.outputVar}(${actionLabel}动作出参)`
                }
              }
            }
          }
        };
      });

    if (manager.dataSchema.getScope('event-variable')) {
      manager.dataSchema.removeScope('event-variable');
    }

    manager.dataSchema.addScope(
      {
        type: 'object',
        properties: {
          event: {
            ...jsonSchema,
            title: '事件动作'
          }
        }
      },
      'event-variable'
    );
  }

  async buildContextSchema(data: any) {
    const {manager, node: currentNode} = this.props;
    let variables = [];

    // 获取上下文
    await manager.getContextSchemas(currentNode.id);
    // 追加事件相关
    // this.buildActionDataSchema(data, manager);
    this.buildEventDataSchema(data, manager);
    (manager.dataSchema as DataSchema).switchTo('event-variable');
    variables = (manager.dataSchema as DataSchema).getDataPropsAsOptions();

    // 插入应用变量
    const appVariables =
      manager?.variableManager?.getVariableFormulaOptions() || [];
    appVariables.forEach(item => {
      if (Array.isArray(item?.children) && item.children.length) {
        variables.push(item);
      }
    });

    return updateComponentContext(variables);
  }

  // 唤起动作配置弹窗
  async activeActionDialog(
    data: Pick<EventControlState, 'showAcionDialog' | 'type' | 'actionData'>
  ) {
    const {
      actions: pluginActions,
      getContextSchemas,
      actionConfigInitFormatter,
      getComponents,
      actionTree,
      allComponents,
      manager,
      node: currentNode
    } = this.props;

    // 构建上下文变量schema
    const variables = await this.buildContextSchema(data);

    // 编辑操作，需要格式化动作配置
    if (data.type === 'update') {
      const action = data.actionData!.action!;
      const actionConfig = await actionConfigInitFormatter?.(action);
      const actionNode = findActionNode(actionTree, actionConfig?.actionType!);
      const hasSubActionNode = findSubActionNode(actionTree, action.actionType);
      const supportComponents = getComponents(actionNode!);
      const node = findTree(
        supportComponents,
        item => item.value === action.componentId
      );

      // 获取被赋值组件的变量字段
      let setValueDs: any = null;
      if (
        actionConfig?.actionType === 'setValue' &&
        node?.id &&
        SELECT_PROPS_CONTAINER.includes(node?.type || '')
      ) {
        // 获取目标组件数据域
        const contextSchema: any = await manager.getContextSchemas(
          node.id,
          true
        );
        const dataSchema = new DataSchema(contextSchema || []);
        const targetVariables = dataSchema?.getDataPropsAsOptions() || [];

        setValueDs = targetVariables?.filter(
          (item: ContextVariables) => item.value !== '$$id'
        );
      }

      const actionGroupType = actionConfig?.__actionType || action.actionType;

      data.actionData = {
        eventKey: data.actionData!.eventKey,
        actionIndex: data.actionData!.actionIndex,
        variables,
        pluginActions,
        getContextSchemas,
        ...actionConfig,
        groupType: actionGroupType,
        __actionDesc: actionNode?.description ?? '', // 树节点描述
        __actionSchema: actionNode!.schema, // 树节点schema
        __subActions: hasSubActionNode?.actions, // 树节点子动作
        __cmptTreeSource: supportComponents ?? [],
        // __dialogActions: manager.store.modalOptions,
        __superCmptTreeSource: allComponents,
        // __supersCmptTreeSource: '',
        __setValueDs: setValueDs
        // broadcastId: action.actionType === 'broadcast' ? action.eventName : ''
      };

      // 选中项自动滚动至可见位置
      setTimeout(
        () =>
          document
            .querySelector('.action-tree li .is-checked')
            ?.scrollIntoView(),
        0
      );
    } else {
      data.actionData = {
        eventKey: data.actionData!.eventKey,
        variables,
        pluginActions,
        getContextSchemas,
        __superCmptTreeSource: allComponents,
        __dialogActions: manager.store.modalOptions
      };
    }
    this.setState(data);
  }

  // 渲染描述信息
  renderDesc(action: ActionConfig, actionIndex: number, eventKey: string) {
    const {
      actions: pluginActions,
      actionTree,
      commonActions,
      getComponents,
      allComponents
    } = this.props;
    const desc = getPropOfAcion(
      action,
      'descDetail',
      actionTree,
      pluginActions,
      commonActions,
      allComponents
    );
    let info = {...action};
    // 根据子动作类型获取动作树节点的配置
    const hasSubActionNode = findSubActionNode(actionTree, action.actionType);
    const actionType = getActionType(action, hasSubActionNode);
    const actionNode = actionType && findActionNode(actionTree, actionType);

    if (action.componentId && actionNode) {
      const supportComponents = getComponents(actionNode);
      const node = findTree(
        supportComponents,
        item => item.value === action.componentId
      );
      if (node) {
        info = {
          ...info,
          rendererLabel: node.label
        };
      }
    }

    return typeof desc === 'function' ? (
      <div className="action-control-content">
        {desc?.(
          info,
          {
            actionIndex,
            eventKey
          },
          this.props
        ) || '-'}
      </div>
    ) : null;
  }

  @autobind
  onSubmit(type: string, config: any) {
    const {actionConfigSubmitFormatter, manager} = this.props;
    const {actionData} = this.state;
    const store = manager.store;

    let action =
      actionConfigSubmitFormatter?.(config, type, actionData, store.schema) ??
      config;

    action = this.submitSubscribers.reduce(
      (action, fn) => fn(action) || action,
      action
    );

    delete action.__actionSchema;
    if (type === 'add') {
      this.addAction?.(config.eventKey, action);
    } else if (type === 'update') {
      this.updateAction?.(config.eventKey, config.actionIndex, action);
    }

    updateCommonUseActions({
      label: action.__title,
      value: config.actionType,
      use: 1
    });

    this.removeDataSchema();
    this.setState({showAcionDialog: false});
    this.setState({actionData: undefined});
  }

  @autobind
  onClose() {
    this.removeDataSchema();
    this.setState({showAcionDialog: false});
    this.unSubscribeSchemaSubmit?.();
    delete this.unSubscribeSchemaSubmit;
  }

  unSubscribeSchemaSubmit?: () => void;
  @autobind
  subscribeSchemaSubmit(
    fn: (schema: any, value: any, id: string, diff?: any) => any,
    once?: boolean
  ) {
    this.unSubscribeSchemaSubmit = this.props.subscribeSchemaSubmit(fn, once);
    return this.unSubscribeSchemaSubmit;
  }

  removeDataSchema() {
    const {manager} = this.props;

    // 删除事件
    if (manager.dataSchema.getScope('event-variable')) {
      manager.dataSchema.removeScope('event-variable');
    }
  }

  renderActionType(action: any, actionIndex: number, eventKey: string) {
    const {
      actionTree,
      actions: pluginActions,
      commonActions,
      allComponents,
      node,
      manager
    } = this.props;

    return (
      <span>
        {getPropOfAcion(
          action,
          'actionLabel',
          actionTree,
          pluginActions,
          commonActions,
          allComponents
        ) || action.actionType}
      </span>
    );
  }

  getActionRelations() {
    const {actions: pluginActions, data, manager} = this.props;
    const actions = getActionsByRendererName(pluginActions, data?.type);
    const schema = manager.store.schema;
    let prevs: any[] = [];

    JSONValueMap(schema, (value: any, key: string, host: any) => {
      if (key === 'onEvent') {
        const hostName =
          host.title ?? host.label ?? host.name ?? host.type ?? host.id;
        const hostId = host.$$id;

        Object.keys(value)?.forEach(eventKey => {
          if (eventKey !== '$$id') {
            value[eventKey]?.actions?.forEach((ac: any) => {
              const matchAction = actions?.find(
                item => item.actionType === ac.actionType
              );
              if (matchAction && ac.componentId === data.id) {
                // 如果存在不同事件调用同组件同动作，则不记录
                const isHas = prevs?.find(
                  item =>
                    item.hostId === hostId && item.actionType === ac.actionType
                );
                if (!isHas) {
                  prevs.push({
                    actionType: matchAction.actionType,
                    actionLabel: matchAction.actionLabel,
                    hostName,
                    hostId
                  });
                }
              }
            });
          }
        });
      }
      return value;
    });

    const prevsGroup = groupBy(prevs, item => item.actionLabel);
    let actionRelations: any = [];
    Object.keys(prevsGroup)?.forEach(key => {
      actionRelations.push({
        label: key,
        value: key,
        icon: 'fa fa-bolt',
        children: prevsGroup[key]?.map(item => ({
          label: item.hostName,
          value: item.hostId,
          icon: ''
        }))
      });
    });

    return actionRelations;
  }

  @autobind
  handleRelationComponentActive(componentId: string) {
    const {manager} = this.props;
    manager.store.setActiveId(componentId);
  }

  render() {
    const {
      actionTree,
      actions: pluginActions,
      commonActions,
      getComponents,
      render
    } = this.props;
    const {
      onEvent,
      events: itemEvents,
      globalEvents,
      eventPanelActive,
      showAcionDialog,
      showEventDialog,
      type,
      actionData,
      eventDialogData
    } = this.state;
    const eventSnapshot = {...onEvent};
    const {showOldEntry} = this.props;
    const eventKeys = Object.keys(eventSnapshot);

    let commonEvents: RendererPluginEvent[] = [];
    if (getRendererByName(this.props?.data?.type)?.isFormItem) {
      commonEvents = [
        {
          eventName: 'formItemValidateSucc',
          eventLabel: '校验成功',
          description: '表单项校验成功后触发',
          dataSchema: [
            {
              type: 'object',
              properties: {
                data: {
                  type: 'object',
                  title: '数据',
                  description: '当前表单数据，可以通过.字段名读取对应的值'
                }
              }
            }
          ]
        },
        {
          eventName: 'formItemValidateError',
          eventLabel: '校验失败',
          description: '表单项校验失败后触发',
          dataSchema: [
            {
              type: 'object',
              properties: {
                data: {
                  type: 'object',
                  title: '数据',
                  description: '当前表单数据，可以通过.字段名读取对应的值'
                }
              }
            }
          ]
        }
      ];
    }
    const events = [...itemEvents, ...commonEvents];

    return (
      <div className="ae-event-control">
        <header
          className={cx({
            'ae-event-control-header': true,
            'ae-event-control-header-m':
              this.props.data.type === 'button' && showOldEntry,
            'no-bd-btm': !eventKeys.length
          })}
        >
          {this.state.actionRelations?.length ? (
            <PopOverContainer
              popOverContainer={() => document.body}
              popOverRender={({onClose}) => (
                <div className="ae-action-relation-panel">
                  <Tree
                    options={this.state.actionRelations}
                    className="variables-select-panel-tree"
                    onChange={this.handleRelationComponentActive}
                    onlyChildren={true}
                    value=""
                  />
                </div>
              )}
            >
              {({onClick, ref, isOpened}) => {
                return (
                  <TooltipWrapper
                    tooltipClassName="ae-event-item-header-tip"
                    trigger="hover"
                    placement="top"
                    tooltip="可查看哪些组件会调用当前组件的哪些动作"
                  >
                    <Button className="block w-full mb-2" onClick={onClick}>
                      查看调用关系
                    </Button>
                  </TooltipWrapper>
                );
              }}
            </PopOverContainer>
          ) : null}
          {render(
            'dropdown',
            {
              type: 'dropdown-button',
              level: 'enhance',
              label: '添加事件',
              disabled: false,
              className: 'block w-full add-event-dropdown',
              closeOnClick: true,
              buttons: [
                ...events.map(item => ({
                  type: 'button',
                  disabledTip: '您已添加该事件',
                  tooltipPlacement: 'left',
                  disabled: Object.keys(onEvent).includes(item.eventName),
                  actionType: '',
                  label: item.eventLabel,
                  onClick: this.addEvent.bind(
                    this,
                    item,
                    Object.keys(onEvent).includes(item.eventName)
                  )
                })),
                ...globalEvents.map(item => ({
                  type: 'button',
                  disabledTip: '您已添加该全局事件',
                  tooltipPlacement: 'left',
                  disabled: Object.keys(onEvent).includes(item.name),
                  actionType: '',
                  className: 'add-event-dropdown-global-event',
                  label: item.label,
                  onClick: this.addGlobalEvent.bind(
                    this,
                    item,
                    Object.keys(onEvent).includes(item.name)
                  )
                }))
              ]
            },
            {
              popOverContainer: null // amis 渲染挂载节点会使用 this.target
            }
          )}
        </header>
        <ul
          className={cx({
            'ae-event-control-content': true,
            'ae-event-control-content-m':
              (this.props.data.type === 'button' && showOldEntry) ||
              this.state.actionRelations?.length,
            'ae-event-control-content-l':
              this.props.data.type === 'button' &&
              showOldEntry &&
              !!this.state.actionRelations?.length
          })}
          ref={this.dragRef}
        >
          {eventKeys.length ? (
            eventKeys.map((eventKey, eventIndex) => {
              const globalEvent = globalEvents.find(i => i.name === eventKey);
              return (
                <li className="event-item" key={`content_${eventIndex}`}>
                  <div
                    className={cx({
                      'event-item-header': true,
                      'no-bd-btm':
                        !(
                          eventSnapshot[eventKey]?.actions?.length &&
                          eventPanelActive[eventKey]
                        ) && !getEventStrongDesc(events, eventKey)
                    })}
                  >
                    <TooltipWrapper
                      tooltipClassName="ae-event-item-header-tip"
                      trigger="hover"
                      placement="top"
                      tooltip={{
                        children: () => (
                          <div>
                            {getEventDesc(events, eventKey) ||
                              getEventStrongDesc(events, eventKey) ||
                              eventKey}
                          </div>
                        )
                      }}
                    >
                      {!globalEvent ? (
                        <div>{getEventLabel(events, eventKey) || eventKey}</div>
                      ) : (
                        <div className="event-label">
                          <span className="global-event-tip">
                            <span>全局事件</span>
                          </span>
                          <span className="event-label-key">
                            {globalEvent.label || eventKey}
                          </span>
                        </div>
                      )}
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
                        onClick={this.activeEventDialog.bind(this, {
                          eventName: eventKey,
                          eventLabel:
                            getEventLabel(events, eventKey) || eventKey,
                          ...eventSnapshot[eventKey]
                        })}
                      >
                        <Icon className="icon" icon="event-setting" />
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
                  {getEventStrongDesc(events, eventKey)
                    ? render('alert', {
                        type: 'alert',
                        body:
                          '温馨提示：' + getEventStrongDesc(events, eventKey),
                        level: 'info',
                        showCloseButton: true,
                        showIcon: true,
                        className: 'event-item-desc'
                      })
                    : null}
                  {eventSnapshot[eventKey]?.actions?.length &&
                  eventPanelActive[eventKey] ? (
                    <ul className="item-content">
                      {eventSnapshot[eventKey]?.actions?.map(
                        (action, actionIndex) => {
                          return (
                            <li
                              className="ae-option-control-item"
                              key={`item-content_${actionIndex}`}
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
                                    {this.renderActionType(
                                      action,
                                      actionIndex,
                                      eventKey
                                    )}
                                  </div>
                                  {action.description && (
                                    <TooltipWrapper
                                      trigger="hover"
                                      placement="top"
                                      tooltip={action.description}
                                    >
                                      <Icon
                                        icon="far fa-question-circle"
                                        className="flex justify-center items-center icon ml-0.5"
                                      />
                                    </TooltipWrapper>
                                  )}
                                </div>
                                <div className="action-control-header-right">
                                  <div
                                    onClick={this.activeActionDialog.bind(
                                      this,
                                      {
                                        showAcionDialog: true,
                                        type: 'update',
                                        actionData: {
                                          action,
                                          eventKey,
                                          actionIndex
                                        }
                                      }
                                    )}
                                  >
                                    <Icon className="icon" icon="setting" />
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
                              {this.renderDesc(action, actionIndex, eventKey)}
                            </li>
                          );
                        }
                      )}
                    </ul>
                  ) : null}
                </li>
              );
            })
          ) : (
            <div className="ae-event-control-placeholder">
              {/* 翻译未生效，临时方案 */}
              {_i18n('快去添加事件，让你的产品动起来吧')}
            </div>
          )}
        </ul>
        {amisRender(
          {
            type: 'dialog',
            title: `${eventDialogData?.eventLabel}-事件配置`,
            showCloseButton: false,
            body: [
              {
                type: 'form',
                title: '表单',
                data: {
                  '&': '$$'
                },
                mode: 'horizontal',
                horizontal: {
                  left: 3,
                  right: 9
                },
                body: [
                  {
                    label: '事件防重',
                    type: 'switch',
                    name: 'debounce.open',
                    description:
                      '开启事件防重后，防重时间内多次触发事件只会执行最后一次'
                  },
                  {
                    label: '防重时间',
                    required: true,
                    hiddenOn: '!debounce.open',
                    name: 'debounce.wait',
                    suffix: 'ms',
                    max: 10000,
                    min: 0,
                    type: 'input-number'
                  },
                  {
                    label: '事件埋点',
                    type: 'switch',
                    name: 'track.open',
                    description:
                      '开启事件埋点后，每次事件触发都会发送埋点数据到后台'
                  },
                  {
                    label: 'track-id',
                    required: true,
                    hiddenOn: '!track.open',
                    name: 'track.id',
                    type: 'input-text'
                  },
                  {
                    label: 'track-name',
                    required: true,
                    hiddenOn: '!track.open',
                    name: 'track.name',
                    type: 'input-text'
                  }
                ],
                onSubmit: this.eventDialogSubmit.bind(this)
              }
            ],
            actions: [
              {
                type: 'button',
                label: '取消',
                onEvent: {
                  click: {
                    actions: [
                      {
                        actionType: 'custom',
                        script: () => {
                          this.setState({
                            showEventDialog: false
                          });
                        }
                      }
                    ]
                  }
                }
              },
              {
                type: 'button',
                actionType: 'confirm',
                label: '确认',
                primary: true
              }
            ]
          },
          {
            data: eventDialogData,
            show: showEventDialog
          }
        )}
        <ActionDialog
          closeOnEsc={false}
          show={showAcionDialog}
          type={type}
          actionTree={actionTree}
          pluginActions={pluginActions}
          commonActions={commonActions}
          getComponents={getComponents}
          data={actionData}
          onSubmit={this.onSubmit}
          onClose={this.onClose}
          render={this.props.render}
          subscribeSchemaSubmit={this.subscribeSchemaSubmit}
          subscribeActionSubmit={this.subscribeSubmit}
        />
      </div>
    );
  }
}

@FormItem({
  type: 'ae-eventControl'
})
export class EventControlRenderer extends EventControl {}
