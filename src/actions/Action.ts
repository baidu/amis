import {RendererEvent} from '../utils/renderer-event';
import {createObject} from '../utils/helper';
import {evalExpression} from '../utils/tpl';
import {dataMapping} from '../utils/tpl-builtin';

// 逻辑动作类型，支持并行、排他（switch）、循环（支持continue和break）
type LogicActionType = 'parallel' | 'switch' | 'loop' | 'continue' | 'break';

// 循环动作执行状态
export enum LoopStatus {
  NORMAL,
  BREAK,
  CONTINUE
}

// 监听器动作定义
export interface ListenerAction {
  actionType: 'broadcast' | LogicActionType | 'custom' | string; // 动作类型 逻辑动作|自定义（脚本支撑）|reload|url|ajax|dialog|drawer 其他扩充的组件动作
  eventName?: string; // 事件名称，actionType: broadcast
  description?: string; // 事件描述，actionType: broadcast
  args?: any; // 参数，可以配置数据映射
  preventDefault?: boolean; // 阻止原有组件的动作行为
  stopPropagation?: boolean; // 阻止后续的事件处理器执行
  execOn?: string; // 执行条件
  script?: string; // 自定义JS，actionType: custom
  [propName: string]: any; // 扩展各种Action
}

export interface LogicAction extends ListenerAction {
  children?: ListenerAction[]; // 子动作
}

export interface ListenerContext {
  [propName: string]: any;
}

// Action 基础接口
export interface Action {
  // 运行这个 Action，每个类型的 Action 都只有一个实例，run 函数是个可重入的函数
  run: (
    action: ListenerAction,
    context: ListenerContext,
    rendererEvent: RendererEvent<any>
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
  actions: ListenerAction | ListenerAction[],
  renderer: ListenerContext,
  event: any
) => {
  if (!Array.isArray(actions)) {
    actions = [actions];
  }

  for (const actionConfig of actions) {
    let actionInstrance = getActionByType(actionConfig.actionType);

    // 找不到就通过组件动作完成
    if (!actionInstrance) {
      actionInstrance = getActionByType('component');
    }

    // 处理数据
    actionConfig.args &&
      (actionConfig.args = dataMapping(actionConfig.args, event.data));

    // 这些节点的子节点运行逻辑由节点内部实现
    await runAction(actionInstrance, actionConfig, renderer, event);

    // 阻止原有动作执行
    actionConfig.preventDefault && event.preventDefault();
    // 阻止后续动作执行
    actionConfig.stopPropagation && event.stopPropagation();

    if (event.stoped) {
      break;
    }
  }
};

// 执行动作，与原有动作处理打通
export const runAction = async (
  actionInstrance: Action,
  actionConfig: ListenerAction,
  renderer: ListenerContext,
  event: any
) => {
  if (actionConfig.execOn && !evalExpression(actionConfig.execOn, event.data)) {
    console.log('execOn false');
    return;
  }

  await actionInstrance.run(actionConfig, renderer, event);
};
