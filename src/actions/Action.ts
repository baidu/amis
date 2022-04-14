import {extendObject} from '../utils/helper';
import {RendererEvent} from '../utils/renderer-event';
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
  description?: string; // 事件描述，actionType: broadcast
  componentId?: string; // 组件ID，用于直接执行指定组件的动作
  args?: any; // 参数，可以配置数据映射
  outputVar?: any; // 输出数据变量名
  preventDefault?: boolean; // 阻止原有组件的动作行为
  stopPropagation?: boolean; // 阻止后续的事件处理器执行
  expression?: string; // 执行条件
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
    renderer: ListenerContext,
    event: RendererEvent<any>,
    mergeData?: any // 有些Action内部需要通过上下文数据处理专有逻辑，这里的数据是事件数据+渲染器数据
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
    if (!actionInstrance && actionConfig.componentId) {
      actionInstrance = getActionByType('component');
    } else if (
      actionConfig.actionType === 'url' ||
      actionConfig.actionType === 'link' ||
      actionConfig.actionType === 'jump'
    ) {
      // 打开页面动作
      actionInstrance = getActionByType('openlink');
    }

    // 找不到就通过组件专有动作完成
    if (!actionInstrance) {
      actionInstrance = getActionByType('component');
    }

    // 这些节点的子节点运行逻辑由节点内部实现
    await runAction(actionInstrance, actionConfig, renderer, event);

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
  // 用户可能，需要用到事件数据和当前域的数据，因此merge事件数据和当前渲染器数据
  // 需要保持渲染器数据链完整
  const mergeData = extendObject(renderer.props.data, {
    event
  });

  if (
    actionConfig.expression &&
    !evalExpression(actionConfig.expression, mergeData)
  ) {
    return;
  }

  // 修正参数，处理数据映射
  let args = event.data;

  if (actionConfig.args) {
    args = dataMapping(actionConfig.args, mergeData);
  }

  await actionInstrance.run(
    {
      ...actionConfig,
      args
    },
    renderer,
    event,
    mergeData
  );

  // 阻止原有动作执行
  actionConfig.preventDefault && event.preventDefault();
  // 阻止后续动作执行
  actionConfig.stopPropagation && event.stopPropagation();
};
