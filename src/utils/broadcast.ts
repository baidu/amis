import {TreeItem} from './helper';

export interface EventTrigger {
  eventName: string;
  context: any;
  description: string;
}

export interface listenerAction extends TreeItem {
  actionType: string; // 动作 reload|url|ajax|dialog|drawer|custom 其他扩充的组件动作
  args?: any; // 参数，可以配置数据映射
  script?: string; // 自定义JS，actionType: custom
  preventDefault?: boolean; // 阻止原有组件的动作行为
  stopPropagation?: boolean; // 阻止后续的事件处理器执行
  execOn?: string; // 执行条件
  children?: listenerAction[]; // 子动作
  [propName: string]: any; // 扩展各种Action
}

// 事件触发转换器
export interface TriggerEvents {
  [propName: string]: EventTrigger;
}

// 事件监听器
export interface EventListeners {
  [propName: string]: {
    weight?: number; // 权重
    actions: listenerAction[]; // 执行的动作集
  };
}

// 需扩展的广播属性
export interface BroadcastProps {
  triggerEvents?: TriggerEvents;
  eventListeners?: EventListeners;
}

// 广播处理器
export interface BroadcastHandler {
  handler: (...args: any[]) => void;
  preventDefault: boolean;
  stopPropagation: boolean;
}

// 广播监听器
export interface BroadcastListener {
  context: any;
  type: string;
  weight: number;
  handlers: BroadcastHandler[];
}

// 将事件上下文转成事件对象
export type BroadcastEvent<T> = {
  context: T;
  type: string;
  prevented?: boolean; // 阻止原有动作执行
  stoped?: boolean; // 阻止后续动作执行
  preventDefault: () => void;
  stopPropagation: () => void;
};

// 创建广播
export function createBroadcast<T>(
  type: string,
  context: T
): BroadcastEvent<T> {
  const broadcase = {
    context,
    type,
    prevented: false,
    stoped: false,
    preventDefault() {
      broadcase.prevented = true;
    },

    stopPropagation() {
      broadcase.stoped = true;
    }
  };
  return broadcase;
}

export default {};
