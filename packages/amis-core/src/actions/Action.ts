import omit from 'lodash/omit';
import {RendererProps} from '../factory';
import {ConditionGroupValue, Api, SchemaNode} from '../types';
import {createObject} from '../utils/helper';
import {RendererEvent} from '../utils/renderer-event';
import {evalExpressionWithConditionBuilder} from '../utils/tpl';
import {dataMapping} from '../utils/tpl-builtin';
import {IBreakAction} from './BreakAction';
import {IContinueAction} from './ContinueAction';
import {ILoopAction} from './LoopAction';
import {IParallelAction} from './ParallelAction';
import {ISwitchAction} from './SwitchAction';

// 循环动作执行状态
export enum LoopStatus {
  NORMAL,
  BREAK,
  CONTINUE
}

// 监听器动作定义
export interface ListenerAction {
  actionType: string; // 动作类型 逻辑动作|自定义（脚本支撑）|reload|url|ajax|dialog|drawer 其他扩充的组件动作
  description?: string; // 事件描述，actionType: broadcast
  componentId?: string; // 组件ID，用于直接执行指定组件的动作，指定多个组件时使用英文逗号分隔
  componentName?: string; // 组件Name，用于直接执行指定组件的动作，指定多个组件时使用英文逗号分隔
  ignoreError?: boolean; // 当执行动作发生错误时，是否忽略并继续执行
  args?: Record<string, any>; // 动作配置，可以配置数据映射。注意：存在schema配置的动作都不能放在args里面，避免数据域不同导致的解析错误问题
  data?: Record<string, any> | null; // 动作数据参数，可以配置数据映射
  dataMergeMode?: 'merge' | 'override'; // 参数模式，合并或者覆盖
  outputVar?: string; // 输出数据变量名
  preventDefault?: boolean; // 阻止原有组件的动作行为
  stopPropagation?: boolean; // 阻止后续的事件处理器执行
  expression?: string | ConditionGroupValue; // 执行条件
  execOn?: string; // 执行条件，1.9.0废弃
  [propName: string]: any;
}

export interface ILogicAction extends ListenerAction {
  children?: ListenerAction[]; // 子动作
}

// 逻辑动作类型，支持并行、排他（switch）、循环（支持continue和break）
export type LogicAction =
  | IParallelAction
  | ISwitchAction
  | ILoopAction
  | IContinueAction
  | IBreakAction;

export interface ListenerContext extends React.Component<RendererProps> {
  [propName: string]: any;
}

// Action 基础接口
export interface RendererAction {
  // 运行这个 Action，每个类型的 Action 都只有一个实例，run 函数是个可重入的函数
  run: (
    action: ListenerAction,
    renderer: ListenerContext,
    event: RendererEvent<any>,
    mergeData?: any // 有些Action内部需要通过上下文数据处理专有逻辑，这里的数据是事件数据+渲染器数据
  ) => Promise<RendererEvent<any> | void>;
}

// 存储 Action 和类型的映射关系，用于后续查找
const ActionTypeMap: {[key: string]: RendererAction} = {};

// 注册 Action
export const registerAction = (type: string, action: RendererAction) => {
  ActionTypeMap[type] = action;
};

// 通过类型获取 Action 实例
export const getActionByType = (type: string) => {
  return ActionTypeMap[type];
};

// 根据动作类型获取属性排除列表
const getOmitActionProp = (type: string) => {
  let omitList: string[] = [];
  switch (type) {
    case 'toast':
      omitList = [
        'msgType',
        'msg',
        'position',
        'closeButton',
        'showIcon',
        'timeout',
        'title'
      ];
      break;
    case 'alert':
      omitList = ['msg'];
      break;
    case 'confirm':
      omitList = ['msg', 'title'];
      break;
    case 'ajax':
    case 'download':
      omitList = ['api', 'messages', 'options'];
      break;
    case 'setValue':
      omitList = ['value', 'index'];
      break;
    case 'copy':
      omitList = ['content', 'copyFormat'];
      break;
    case 'email':
      omitList = ['to', 'cc', 'bcc', 'subject', 'body'];
      break;
    case 'link':
      omitList = ['link', 'blank', 'params'];
      break;
    case 'url':
      omitList = ['url', 'blank', 'params'];
      break;
    case 'for':
      omitList = ['loopName'];
      break;
    case 'goPage':
      omitList = ['delta'];
      break;
    case 'custom':
      omitList = ['script'];
      break;
    case 'broadcast':
      omitList = ['eventName'];
      break;
    case 'dialog':
      omitList = ['dialog'];
      break;
    case 'drawer':
      omitList = ['drawer'];
      break;
    case 'confirmDialog':
      omitList = ['dialog'];
      break;
    case 'reload':
      omitList = ['resetPage'];
      break;
  }
  return omitList;
};

export const runActions = async (
  actions: ListenerAction | ListenerAction[],
  renderer: ListenerContext,
  event: any
) => {
  if (!Array.isArray(actions)) {
    actions = [actions];
  }

  for (const actionConfig of actions) {
    let actionInstrance = getActionByType(actionConfig.actionType);

    // 如果存在指定组件ID，说明是组件专有动作
    if (
      !actionInstrance &&
      (actionConfig.componentId || actionConfig.componentName)
    ) {
      actionInstrance = [
        'static',
        'nonstatic',
        'show',
        'visibility',
        'hidden',
        'enabled',
        'disabled',
        'usability'
      ].includes(actionConfig.actionType)
        ? getActionByType('status')
        : getActionByType('component');
    } else if (['url', 'link', 'jump'].includes(actionConfig.actionType)) {
      // 打开页面动作
      actionInstrance = getActionByType('openlink');
    }

    // 找不到就通过组件专有动作完成
    if (!actionInstrance) {
      actionInstrance = getActionByType('component');
    }

    try {
      // 这些节点的子节点运行逻辑由节点内部实现
      await runAction(actionInstrance, actionConfig, renderer, event);
    } catch (e) {
      const ignore = actionConfig.ignoreError ?? false;
      if (!ignore) {
        throw Error(
          `${actionConfig.actionType} 动作执行失败，原因：${
            e.message || '未知'
          }`
        );
      }
    }

    if (event.stoped) {
      break;
    }
  }
};

// 执行动作，与原有动作处理打通
export const runAction = async (
  actionInstrance: RendererAction,
  actionConfig: ListenerAction,
  renderer: ListenerContext,
  event: any
) => {
  // 追加数据
  let additional: any = {
    event
  };
  let action: ListenerAction = {...actionConfig};
  action.args = {...actionConfig.args};

  // __rendererData默认为renderer.props.data，兼容表单项值变化时的data读取
  if (!event.data.__rendererData) {
    additional = {
      event,
      __rendererData: renderer.props.data // 部分组件交互后会有更新，如果想要获取那部分数据，可以通过事件数据获取
    };
  }

  // 用户可能，需要用到事件数据和当前域的数据，因此merge事件数据和当前渲染器数据
  // 需要保持渲染器数据链完整
  // 注意：并行ajax请求结果必须通过event取值
  const mergeData = createObject(
    createObject(
      renderer.props.data.__super
        ? createObject(renderer.props.data.__super, additional)
        : additional,
      renderer.props.data
    ),
    event.data
  );
  // 兼容一下1.9.0之前的版本
  const expression = action.expression ?? action.execOn;
  // 执行条件
  let isStop = false;

  if (expression) {
    isStop = !(await evalExpressionWithConditionBuilder(
      expression,
      mergeData,
      true
    ));
  }

  if (isStop) {
    return;
  }

  // 支持表达式 >=1.10.0
  let preventDefault = false;
  if (action.preventDefault) {
    preventDefault = await evalExpressionWithConditionBuilder(
      action.preventDefault,
      mergeData,
      false
    );
  }

  let key = {
    componentId: dataMapping(action.componentId, mergeData),
    componentName: dataMapping(action.componentName, mergeData)
  };

  // 兼容args包裹的用法
  if (action.actionType === 'dialog') {
    action.dialog = {...(action.dialog ?? action.args?.dialog)};
    delete action.args?.dialog;
  } else if (action.actionType === 'drawer') {
    action.drawer = {...(action.drawer ?? action.args?.drawer)};
    delete action.args?.drawer;
  } else if (['ajax', 'download'].includes(action.actionType)) {
    const api = action.api ?? action.args?.api;
    action.api = typeof api === 'string' ? api : {...api};
    action.options = {...(action.options ?? action.args?.options)};
    action.messages = {...(action.messages ?? action.args?.messages)};
    delete action.args?.api;
    delete action.args?.options;
    delete action.args?.messages;
  }

  // 动作配置
  const args = dataMapping(action.args, mergeData, key =>
    [
      'adaptor',
      'responseAdaptor',
      'requestAdaptor',
      'responseData',
      'condition'
    ].includes(key)
  );
  const afterMappingData = dataMapping(action.data, mergeData);

  // 动作数据
  const actionData =
    args && Object.keys(args).length
      ? omit(
          {
            ...args, // 兼容历史（动作配置与数据混在一起的情况）
            ...(afterMappingData ?? {})
          },
          getOmitActionProp(action.actionType)
        )
      : afterMappingData;

  // 默认为当前数据域
  const data =
    actionData !== undefined &&
    !['ajax', 'download', 'dialog', 'drawer'].includes(action.actionType) // 避免非法配置影响对actionData的判断，导致动作配置中的数据映射失败
      ? actionData
      : mergeData;

  console.group?.(`run action ${action.actionType}`);
  console.debug(`[${action.actionType}] action args, data`, args, data);

  let stopped = false;
  const actionResult = await actionInstrance.run(
    {
      ...action,
      args,
      data: action.actionType === 'reload' ? actionData : data, // 如果是刷新动作，则只传action.data
      ...key
    },
    renderer,
    event,
    mergeData
  );
  // 二次确认弹窗如果取消，则终止后续动作
  if (action?.actionType === 'confirmDialog' && !actionResult) {
    stopped = true;
    preventDefault = true; // 这种对表单项change比较有意义，例如switch切换时弹确认弹窗，如果取消后不能把switch修改了
  }

  let stopPropagation = false;
  if (action.stopPropagation) {
    stopPropagation = await evalExpressionWithConditionBuilder(
      action.stopPropagation,
      mergeData,
      false
    );
  }
  console.debug(`[${action.actionType}] action end event`, event);
  console.groupEnd?.();

  // 阻止原有动作执行
  preventDefault && event.preventDefault();
  // 阻止后续动作执行
  (stopPropagation || stopped) && event.stopPropagation();
};
