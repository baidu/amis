import {ListenerAction, ListenerContext, runActions} from '../actions/Action';
import {RendererProps} from '../factory';
import {IScopedContext} from '../Scoped';

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
  renderer: React.Component<RendererProps>;
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

let rendererEventListeners: RendererEventListener[] = [];

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

// 绑定事件
export const bindEvent = (renderer: any) => {
  if (!renderer) {
    return undefined;
  }
  const listeners: EventListeners = renderer.props.$schema.onEvent;
  if (listeners) {
    // 暂存
    for (let key of Object.keys(listeners)) {
      const listener = rendererEventListeners.some(
        (item: RendererEventListener) =>
          item.renderer === renderer && item.type === key
      );
      if (!listener) {
        rendererEventListeners.push({
          renderer,
          type: key,
          weight: listeners[key].weight || 0,
          actions: listeners[key].actions
        });
      }
    }

    return () => {
      rendererEventListeners = rendererEventListeners.filter(
        (item: RendererEventListener) => item.renderer !== renderer
      );
    };
  }

  return undefined;
};

// 触发事件
export async function dispatchEvent(
  e: string | React.MouseEvent<any>,
  renderer: React.Component<RendererProps>,
  scoped: IScopedContext,
  data: any,
  broadcast?: RendererEvent<any>
): Promise<RendererEvent<any> | void> {
  let unbindEvent = null;
  const eventName = typeof e === 'string' ? e : e.type;
 
  renderer?.props?.env?.beforeDispatchEvent?.(
    e,
    renderer,
    scoped,
    data,
    broadcast
  );

  if (!broadcast) {
    const eventConfig = renderer?.props?.onEvent?.[eventName];

    if (!eventConfig) {
      // 没命中也没关系
      return Promise.resolve();
    }

    unbindEvent = bindEvent(renderer);
  }

  // 没有可处理的监听
  if (!rendererEventListeners.length) {
    return Promise.resolve();
  }
  // 如果是广播动作，就直接复用
  const rendererEvent =
    broadcast ||
    createRendererEvent(eventName, {
      env: renderer?.props?.env,
      nativeEvent: e,
      data,
      scoped
    });

  // 过滤&排序
  const listeners = rendererEventListeners
    .filter(
      (item: RendererEventListener) =>
        item.type === eventName &&
        (broadcast ? true : item.renderer === renderer)
    )
    .sort(
      (prev: RendererEventListener, next: RendererEventListener) =>
        next.weight - prev.weight
    );
  for (let listener of listeners) {
    await runActions(listener.actions, listener.renderer, rendererEvent);

    // 停止后续监听器执行
    if (rendererEvent.stoped) {
      break;
    }
  }

  unbindEvent?.();

  return Promise.resolve(rendererEvent);
}

export const getRendererEventListeners = () => {
  return rendererEventListeners;
};

export default {};
