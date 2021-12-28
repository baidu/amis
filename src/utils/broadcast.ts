import {ListenerAction} from '../actions/Action';

// 广播事件定义
export interface EventTrigger {
  eventName: string;
  context: any;
  description: string;
}

// 事件触发转换器
export interface TriggerEvents {
  [propName: string]: EventTrigger;
}

// 事件监听器
export interface EventListeners {
  [propName: string]: {
    weight?: number; // 权重
    actions: ListenerAction[]; // 执行的动作集
  };
}

// 需扩展的广播属性
export interface BroadcastProps {
  triggerEvents?: TriggerEvents;
  eventListeners?: EventListeners;
}

// 广播监听器
export interface BroadcastListener {
  context: any;
  type: string;
  weight: number;
  actions: ListenerAction[];
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
