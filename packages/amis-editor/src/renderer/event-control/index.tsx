import React from 'react';
import {findDOMNode} from 'react-dom';
import cx from 'classnames';
import Sortable from 'sortablejs';
import {
  DataSchema,
  FormItem,
  Button,
  Icon,
  TooltipWrapper,
  render as amisRender
} from 'amis';
import cloneDeep from 'lodash/cloneDeep';
import {FormControlProps, Schema, autobind, findTree} from 'amis-core';
import ActionDialog from './action-config-dialog';
import {
  findActionNode,
  findSubActionNode,
  getActionType,
  getEventDesc,
  getEventStrongDesc,
  getEventLabel,
  getPropOfAcion,
  SELECT_PROPS_CONTAINER
} from './helper';
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
  getDialogActions,
  getFixDialogType
} from 'amis-editor-core';
export * from './helper';
import {i18n as _i18n} from 'i18n-runtime';
import type {VariableItem} from 'amis-ui/lib/components/formula/Editor';
import {reaction} from 'mobx';
import {updateComponentContext} from 'amis-editor-core';

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

  constructor(props: EventControlProps) {
    super(props);
    const {events, value, data, rawType} = props;

    const eventPanelActive: {
      [prop: string]: boolean;
    } = {};

    const pluginEvents =
      events[
        rawType || (!data.type || data.type === 'text' ? 'plain' : data.type)
      ] || [];

    pluginEvents.forEach((event: RendererPluginEvent) => {
      eventPanelActive[event.eventName] = true;
    });

    this.state = {
      onEvent: value ?? this.generateEmptyDefault(pluginEvents),
      events: pluginEvents,
      eventPanelActive,
      showAcionDialog: false,
      showEventDialog: false,
      actionData: undefined,
      type: 'add',
      appLocaleState: 0
    };
  }

  componentDidMount(): void {
    const editorStore = (window as any).editorStore;
    this.unReaction = reaction(
      () => editorStore?.appLocaleState,
      () => {
        this.setState({
          appLocaleState: editorStore?.appLocaleState
        });
      }
    );
  }

  componentWillUnmount() {
    this.unReaction?.();
  }

  componentDidUpdate(
    prevProps: EventControlProps,
    prevState: EventControlState
  ) {
    const {value} = this.props;

    if (value !== prevProps.value) {
      this.setState({onEvent: value});
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
        actions: (onEventConfig[event].actions || []).concat(config)
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
            : config
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
        let onEventConfig = cloneDeep(this.state.onEvent);
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
    const {events, onEvent} = this.state;

    const eventConfig = events.find(
      item => item.eventName === data.actionData!.eventKey
    );

    // 收集当前事件动作出参
    let actions = onEvent[data.actionData!.eventKey].actions;

    // 编辑的时候只能拿到当前动作前面动作的事件变量以及当前动作事件
    if (data.type === 'update') {
      actions = actions.slice(
        0,
        data.actionData!.actionIndex !== undefined
          ? data.actionData!.actionIndex + 1
          : 0
      );
    }

    let jsonSchema = {...(eventConfig?.dataSchema?.[0] ?? {})};

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

        // const schema: any = {
        //   type: 'object',
        //   $id: 'outputVar',
        //   properties: {
        //     [action.outputVar!]: {
        //       ...actionSchema[0],
        //       title: `${action.outputVar}(${actionLabel})`
        //     }
        //   }
        // };

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

        // manager.dataSchema.addScope(
        //   schema,
        //   `action-output-${action.actionType}_${index}`
        // );
        // manager.dataSchema.current.group = '动作出参';
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

  // buildActionDataSchema(
  //   activeData: Pick<
  //     EventControlState,
  //     'showAcionDialog' | 'type' | 'actionData'
  //   >,
  //   manager: EditorManager
  // ) {
  //   const {actionTree, pluginActions, commonActions, allComponents} =
  //     this.props;
  //   const {onEvent} = this.state;
  //   // 收集当前事件已有ajax动作的请求返回结果作为事件变量
  //   let oldActions = onEvent[activeData.actionData!.eventKey].actions;

  //   // 编辑的时候只能拿到当前动作前面动作的事件变量
  //   if (activeData.type === 'update') {
  //     oldActions = oldActions.slice(0, activeData.actionData!.actionIndex);
  //   }

  //   oldActions
  //     ?.filter(item => item.outputVar)
  //     ?.forEach((action: ActionConfig, index: number) => {
  //       if (
  //         manager.dataSchema.getScope(
  //           `action-output-${action.actionType}_ ${index}`
  //         )
  //       ) {
  //         return;
  //       }

  //       const actionLabel = getPropOfAcion(
  //         action,
  //         'actionLabel',
  //         actionTree,
  //         pluginActions,
  //         commonActions,
  //         allComponents
  //       );
  //       const actionSchema = getPropOfAcion(
  //         action,
  //         'outputVarDataSchema',
  //         actionTree,
  //         pluginActions,
  //         commonActions,
  //         allComponents
  //       );

  //       const schema: any = {
  //         type: 'object',
  //         properties: {
  //           [`event.data.${action.outputVar}`]: {
  //             ...actionSchema[0],
  //             title: `${action.outputVar}(${actionLabel})`
  //           }
  //         }
  //       };

  //       manager.dataSchema.addScope(
  //         schema,
  //         `action-output-${action.actionType}_${index}`
  //       );
  //       manager.dataSchema.current.group = '动作出参';
  //     });
  // }

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
    const appVariables: VariableItem[] =
      manager?.variableManager?.getVariableFormulaOptions() || [];
    appVariables.forEach(item => {
      if (Array.isArray(item?.children) && item.children.length) {
        variables.push(item);
      }
    });

    return updateComponentContext(variables);
  }

  // 获取现有弹窗列表
  getDialogList(
    manager: EditorManager,
    action?: ActionConfig,
    actionType?: keyof typeof dialogObjMap
  ) {
    if (
      action &&
      actionType &&
      dialogObjMap[actionType] &&
      !action?.args?.fromCurrentDialog
    ) {
      let dialogBodyContent = dialogObjMap[actionType];
      let filterId = Array.isArray(dialogBodyContent)
        ? action[dialogBodyContent[0]].id || action[dialogBodyContent[1]].id
        : action[dialogBodyContent].id;
      return getDialogActions(manager.store.schema, 'source', filterId);
    } else return getDialogActions(manager.store.schema, 'source');
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
        __dialogActions: this.getDialogList(manager, action, actionGroupType),
        __superCmptTreeSource: allComponents,
        // __supersCmptTreeSource: '',
        __setValueDs: setValueDs
        // broadcastId: action.actionType === 'broadcast' ? action.eventName : ''
      };

      // 编辑时准备已选的弹窗来源和标题
      if (actionConfig?.actionType == 'openDialog') {
        const definitions = manager.store.schema.definitions;
        let dialogBody =
          dialogObjMap[actionGroupType as keyof typeof dialogObjMap];
        const dialogObj = Array.isArray(dialogBody)
          ? dialogBody[0] || dialogBody[1]
          : dialogBody;

        const dialogRef = actionConfig?.[dialogObj!]?.$ref;

        if (dialogRef) {
          data.actionData!.__dialogTitle = definitions[dialogRef].title;
        } else {
          data.actionData!.__dialogTitle = actionConfig?.[dialogObj!]?.title;
        }

        if (actionConfig.args?.fromCurrentDialog) {
          data.actionData!.__dialogSource = 'current';
          data.actionData!.__selectDialog = definitions[dialogRef].$$id;
        } else {
          data.actionData!.__dialogSource = 'new';
        }
      }

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
        __dialogActions: this.getDialogList(manager)
      };
    }
    this.setState(data);
  }

  // 渲染描述信息
  renderDesc(action: ActionConfig) {
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
      <div className="action-control-content">{desc?.(info) || '-'}</div>
    ) : null;
  }

  getRefsFromCurrentDialog(store: any, action: any) {
    let definitions = store.schema.definitions;
    let dialogMaxIndex: number = 0;
    let dialogRefsName = '';
    if (definitions) {
      Object.keys(definitions).forEach(k => {
        const dialog = definitions[k];
        if (dialog.$$id === action.__selectDialog) {
          dialogRefsName = k;
        }
        if (k.includes('ref-')) {
          let index = Number(k.split('-')[2]);
          dialogMaxIndex = Math.max(dialogMaxIndex, index);
        }
      });
    }
    let dialogType = getFixDialogType(store.schema, action.__selectDialog);
    if (!dialogRefsName) {
      dialogRefsName = dialogMaxIndex
        ? `${dialogType}-ref-${dialogMaxIndex + 1}`
        : `${dialogType}-ref-1`;
    }
    return dialogRefsName;
  }

  @autobind
  onSubmit(type: string, config: any) {
    const {actionConfigSubmitFormatter, manager} = this.props;
    const {actionData} = this.state;
    const store = manager.store;
    const action =
      actionConfigSubmitFormatter?.(config, type, actionData, store.schema) ??
      config;
    delete action.__actionSchema;
    if (type === 'add') {
      if (['dialog', 'drawer', 'confirmDialog'].includes(action.actionType)) {
        let args =
          action.actionType === 'dialog'
            ? 'dialog'
            : action.actionType === 'drawer'
            ? 'drawer'
            : 'dialog';

        if (!config?.__dialogSource || config?.__dialogSource === 'new') {
          let actionLength = this.state.onEvent[config.eventKey].actions.length;
          let path = `${store.getSchemaPath(store.activeId)}/onEvent/${
            config.eventKey
          }/actions/${actionLength}/${args}`;
          store.setActiveDialogPath(path);
        } else if (config?.__dialogSource === 'current') {
          let dialogRefsName = this.getRefsFromCurrentDialog(store, action);
          let path = `definitions/${dialogRefsName}`;
          store.setActiveDialogPath(path);
        }
        this.addAction?.(config.eventKey, action);
      } else {
        this.addAction?.(config.eventKey, action);
      }
    } else if (type === 'update') {
      if (['dialog', 'drawer', 'confirmDialog'].includes(action.actionType)) {
        let args =
          action.actionType === 'dialog'
            ? 'dialog'
            : action.actionType === 'drawer'
            ? 'drawer'
            : 'dialog';

        if (config.__dialogSource === 'new') {
          let path = `${store.getSchemaPath(store.activeId)}/onEvent/${
            config.eventKey
          }/actions/${config.actionIndex}/${args}`;
          store.setActiveDialogPath(path);
        } else if (config.__dialogSource === 'current') {
          let dialogRefsName = this.getRefsFromCurrentDialog(store, action);
          let path = `definitions/${dialogRefsName}`;
          store.setActiveDialogPath(path);
        }
        this.updateAction?.(config.eventKey, config.actionIndex, action);
      } else {
        this.updateAction?.(config.eventKey, config.actionIndex, action);
      }
    }

    this.removeDataSchema();
    this.setState({showAcionDialog: false});
    this.setState({actionData: undefined});
  }

  @autobind
  onClose() {
    this.removeDataSchema();
    this.setState({showAcionDialog: false});
  }

  removeDataSchema() {
    const {manager} = this.props;

    // 删除事件
    if (manager.dataSchema.getScope('event-variable')) {
      manager.dataSchema.removeScope('event-variable');
    }

    // // 删除动作出参
    // Object.keys(manager.dataSchema.idMap)
    //   .filter(key => /^action-output/.test(key))
    //   .map(key => {
    //     if (manager.dataSchema.getScope(key)) {
    //       manager.dataSchema.removeScope(key);
    //     }
    //   });
  }

  render() {
    const {
      actionTree,
      actions: pluginActions,
      commonActions,
      getComponents,
      allComponents,
      render
    } = this.props;
    const {
      onEvent,
      events,
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
    return (
      <div className="ae-event-control">
        <header
          className={cx({
            'ae-event-control-header': true,
            'ae-event-control-header-oldentry': showOldEntry,
            'no-bd-btm': !eventKeys.length
          })}
        >
          {render(
            'dropdown',
            {
              type: 'dropdown-button',
              level: 'enhance',
              label: '添加事件',
              disabled: false,
              className: 'block w-full add-event-dropdown',
              closeOnClick: true,
              buttons: events.map(item => ({
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
              }))
            },
            {
              popOverContainer: null // amis 渲染挂载节点会使用 this.target
            }
          )}
        </header>
        <ul
          className={cx({
            'ae-event-control-content': true,
            'ae-event-control-content-oldentry': showOldEntry
          })}
          ref={this.dragRef}
        >
          {eventKeys.length ? (
            eventKeys.map((eventKey, eventIndex) => {
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
                      tooltipClassName="event-item-header-tip"
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
                                    {getPropOfAcion(
                                      action,
                                      'actionLabel',
                                      actionTree,
                                      pluginActions,
                                      commonActions,
                                      allComponents
                                    ) || action.actionType}
                                  </div>
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
                                    <Icon
                                      className="icon"
                                      icon="edit-full-btn"
                                    />
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
        {showEventDialog
          ? amisRender(
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
                data: eventDialogData
              }
            )
          : null}
        <ActionDialog
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
        />
      </div>
    );
  }
}

@FormItem({
  type: 'ae-eventControl'
})
export class EventControlRenderer extends EventControl {}
