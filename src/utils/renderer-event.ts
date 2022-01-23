import {ListenerAction, ListenerContext} from '../actions/Action';

// 事件监听器
export interface EventListeners {
  [propName: string]: {
    weight?: number; // 权重
    actions: ListenerAction[]; // 执行的动作集
  };
}

// 事件动作属性
export interface OnEventProps {
  onEvent?: {
    [propName: string]: {
      weight?: number; // 权重
      actions: ListenerAction[]; // 执行的动作集
    };
  };
}

// 渲染器事件监听器
export interface RendererEventListener {
  renderer: ListenerContext;
  type: string;
  weight: number;
  actions: ListenerAction[];
}

// 将事件上下文转成事件对象
export type RendererEvent<T, P = any> = {
  context: T;
  type: string;
  prevented?: boolean; // 阻止原有动作执行
  stoped?: boolean; // 阻止后续动作执行
  data?: P;
  preventDefault: () => void;
  stopPropagation: () => void;
  setData: (data: P) => void;
};

export interface RendererEventContext {
  data?: any;
  [propName: string]: any;
}

// 创建渲染器事件对象
export function createRendererEvent<T extends RendererEventContext>(
  type: string,
  context: T
): RendererEvent<T> {
  const rendererEvent = {
    context,
    type,
    prevented: false,
    stoped: false,
    preventDefault() {
      rendererEvent.prevented = true;
    },

    stopPropagation() {
      rendererEvent.stoped = true;
    },

    get data() {
      return rendererEvent.context.data;
    },

    setData(data: any) {
      rendererEvent.context.data = data;
    }
  };
  return rendererEvent;
}

export default {};
