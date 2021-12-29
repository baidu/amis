import {BroadcastEvent} from '../utils/broadcast';
import {TreeItem} from '../utils/helper';
import {evalExpression} from '../utils/tpl';

// 逻辑动作类型，支持并行、分支（if-else）、循环（支持continue和break）
type LogicActionType = 'parallel' | 'branch' | 'loop' | 'continue' | 'break';

// 循环动作执行状态
export enum LoopStatus {
  NORMAL,
  BREAK,
  CONTINUE
}

// 监听器动作定义
export interface ListenerAction {
  actionType: LogicActionType | 'custom' | string; // 动作类型 逻辑动作|自定义（脚本支撑）|reload|url|ajax|dialog|drawer 其他扩充的组件动作
  args?: any; // 参数，可以配置数据映射
  preventDefault?: boolean; // 阻止原有组件的动作行为
  stopPropagation?: boolean; // 阻止后续的事件处理器执行
  execOn?: string; // 执行条件
  script?: string; // 自定义JS，actionType: custom
  [propName: string]: any; // 扩展各种Action
}

export interface LogicAction extends ListenerAction {
  children?: ListenerAction[]; // 子动作
  runAllMatch?: boolean; // 只对branch分支生效
}

// Action 基础接口
export interface Action {
  // 运行这个 Action，每个类型的 Action 都只有一个实例，run 函数是个可重入的函数
  run: (
    action: ListenerAction,
    context: any,
    broadcast: BroadcastEvent<any>
  ) => Promise<void>;
}

// 存储 Action 和类型的映射关系，用于后续查找
const ActionTypeMap: {[key: string]: Action} = {};

// 注册 Action
export const registerAction = (type: string, action: Action) => {
  ActionTypeMap[type] = action;
};

// 通过类型获取 Action 实例
export const getActionByType = (type: string) => {
  return ActionTypeMap[type];
};

export const runActionTree = async (
  handlers: ListenerAction | ListenerAction[],
  context: any,
  broadcast: BroadcastEvent<any>
) => {
  if (typeof context.loopStatus === 'undefined') {
    context.loopStatus = LoopStatus.NORMAL;
  }

  if (!Array.isArray(handlers)) {
    handlers = [handlers];
  }

  for (const action of handlers) {
    let actionInstrance = getActionByType(action.actionType);

    // 找不到就通过原子动作完成
    if (!actionInstrance) {
      actionInstrance = getActionByType('base');
    }

    // 这些节点的子节点运行逻辑由节点内部实现
    await runAction(actionInstrance, action, context, broadcast);

    // 阻止原有动作执行
    action.preventDefault && broadcast.preventDefault();
    // 阻止后续动作执行
    action.stopPropagation && broadcast.stopPropagation();

    if (broadcast.stoped) {
      break;
    }
  }
};

// 执行动作，与原有动作处理打通
export const runAction = async (
  actionInstrance: Action,
  actionConfig: ListenerAction,
  context: any,
  broadcast: BroadcastEvent<any>
) => {
  if (context.loopStatus !== LoopStatus.NORMAL) {
    return;
  }

  // merge数据域
  const mergeData = {
    ...context.props.defaultData,
    ...context.props.data,
    ...broadcast.context.eventData
  };

  if (actionConfig.execOn && !evalExpression(actionConfig.execOn, mergeData)) {
    console.log('execOn false');
    return;
  }

  await actionInstrance.run(actionConfig, context, broadcast);
};
