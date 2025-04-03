import {ListenerAction, ListenerContext, runActions} from '../actions/Action';
import {RendererProps} from '../factory';
import {IScopedContext} from '../Scoped';
import {isExpression} from './formula';
import {TreeItem, eachTree, getTree} from './helper';
import {createObject, extendObject} from './object';
import debounce from 'lodash/debounce';
import {resolveVariableAndFilterForAsync} from './resolveVariableAndFilterForAsync';
import {evalExpression, evalExpressionWithConditionBuilderAsync} from './tpl';
import type {PlainObject} from '../types';
import {debug} from './debug';

export interface debounceConfig {
  maxWait?: number;
  wait?: number;
  leading?: boolean;
  trailing?: boolean;
}

export interface trackConfig {
  id: string;
  name: string;
}
// 事件监听器
export interface EventListeners {
  [propName: string]: {
    debounce?: debounceConfig;
    track?: trackConfig;
    weight?: number; // 权重
    actions: ListenerAction[]; // 执行的动作集
  };
}

// 事件动作属性
export interface OnEventProps {
  onEvent?: {
    [propName: string]: {
      weight?: number; // 权重
      actions: ListenerAction[]; // 执行的动作集,
      debounce?: debounceConfig;
      track?: trackConfig;
    };
  };
}

// 渲染器事件监听器
export interface RendererEventListener {
  renderer: React.Component<RendererProps>;
  type: string;
  weight: number;
  debounce: debounceConfig | null;
  track: trackConfig | null;
  actions: ListenerAction[];
  executing?: boolean;
  debounceInstance?: any;
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
  pendingPromise: Promise<any>[];
  allDone: () => Promise<any>;
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
  const rendererEvent: RendererEvent<T> = Object.defineProperties(
    {
      context: extendObject({pristineData: context.data}, context),
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

      get pristineData() {
        return rendererEvent.context.pristineData;
      },

      setData(data: any) {
        rendererEvent.context.data = data;
      },

      // 用来记录那些还没完的动作
      // 有时候要等所有完成了才进行下一步
      pendingPromise: [],
      allDone() {
        return Promise.all(rendererEvent.pendingPromise);
      }
    },
    {
      context: {
        enumerable: false
      },
      pristineData: {
        enumerable: false
      },
      preventDefault: {
        enumerable: false
      },
      stopPropagation: {
        enumerable: false
      },
      setData: {
        enumerable: false
      },
      pendingPromise: {
        enumerable: false
      },
      allDone: {
        enumerable: false
      }
    }
  );
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
      const listener = rendererEventListeners.find(
        (item: RendererEventListener) =>
          item.renderer === renderer &&
          item.type === key &&
          item.actions === listeners[key].actions
      );
      if (listener?.executing) {
        listener?.debounceInstance?.cancel?.();
        rendererEventListeners = rendererEventListeners.filter(
          (item: RendererEventListener) =>
            !(
              item.renderer === listener.renderer && item.type === listener.type
            )
        );
        listener.actions.length &&
          rendererEventListeners.push({
            renderer,
            type: key,
            debounce: listener.debounce || null,
            track: listeners[key].track || null,
            weight: listener.weight || 0,
            actions: listener.actions
          });
      }
      if (!listener && listeners[key].actions?.length) {
        rendererEventListeners.push({
          renderer,
          type: key,
          debounce: listeners[key].debounce || null,
          track: listeners[key].track || null,
          weight: listeners[key].weight || 0,
          actions: listeners[key].actions
        });
      }
    }
    return (eventName?: string) => {
      // eventName用来避免过滤广播事件
      rendererEventListeners = rendererEventListeners.filter(
        (item: RendererEventListener) =>
          // 如果 eventName 为 undefined，表示全部解绑，否则解绑指定事件
          eventName === undefined
            ? item.renderer !== renderer
            : item.renderer !== renderer || item.type !== eventName
      );
    };
  }

  return undefined;
};

export const bindGlobalEventForRenderer = (renderer: any) => {
  if (!renderer) {
    return undefined;
  }
  const listeners: EventListeners = renderer.props.$schema.onEvent;
  let bcs: Array<{
    renderer: any;
    bc: BroadcastChannel;
  }> = [];
  if (listeners) {
    for (let key of Object.keys(listeners)) {
      const listener = listeners[key];
      if (typeof BroadcastChannel !== 'function') {
        console.error('BroadcastChannel is not supported in your browser');
        return;
      }
      const bc = new BroadcastChannel(key);
      bcs.push({
        renderer: renderer,
        bc
      });
      bc.onmessage = e => {
        const {eventName, data} = e.data;
        const rendererEvent = createRendererEvent(eventName, {
          env: renderer?.props?.env,
          nativeEvent: eventName,
          scoped: renderer?.context,
          data
        });
        // 过滤掉当前的广播事件，避免循环广播
        const actions = listener.actions.filter(
          a => !(a.actionType === 'broadcast' && a.eventName === eventName)
        );

        runActions(actions, renderer, rendererEvent);
      };
    }
    return () => {
      bcs
        .filter(item => item.renderer === renderer)
        .forEach(item => item.bc.close());
    };
  }
  return void 0;
};

export const bindGlobalEvent = (
  eventName: string,
  callback: (data: PlainObject) => void
) => {
  if (typeof BroadcastChannel !== 'function') {
    console.error('BroadcastChannel is not supported in your browser');
    return;
  }

  const bc = new BroadcastChannel(eventName);
  bc.onmessage = e => {
    const {eventName: name, data} = e.data;
    if (name === eventName) {
      callback(data);
    }
  };

  return () => bc.close();
};

// 触发事件
export async function dispatchEvent(
  e: string | React.MouseEvent<any>,
  renderer: React.Component<RendererProps>,
  scoped: IScopedContext,
  data: any,
  broadcast?: RendererEvent<any>
): Promise<RendererEvent<any> | void> {
  let unbindEvent: ((eventName?: string) => void) | null | undefined = null;
  const eventName = typeof e === 'string' ? e : e.type;

  const from = renderer?.props.id || renderer?.props.name || '';
  debug(
    'event',
    `dispatch \`${eventName}\` from 「${renderer?.props.type || 'unknown'}${
      from ? `#${from}` : ''
    }」`,
    data
  );

  renderer?.props?.env?.beforeDispatchEvent?.(
    e,
    renderer,
    scoped,
    data,
    broadcast
  );

  broadcast && renderer.props.onBroadcast?.(e as string, broadcast, data);

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
        (broadcast
          ? true
          : item.renderer === renderer &&
            item.actions === renderer.props?.onEvent?.[eventName].actions)
    )
    .sort(
      (prev: RendererEventListener, next: RendererEventListener) =>
        next.weight - prev.weight
    );
  let executedCount = 0;
  const checkExecuted = () => {
    executedCount++;
    if (executedCount === listeners.length) {
      unbindEvent?.(eventName);
    }
  };
  for (let listener of listeners) {
    const {
      wait = 100,
      trailing = true,
      leading = false,
      maxWait = 10000
    } = listener?.debounce || {};
    if (listener?.debounce) {
      const debounced = debounce(
        async () => {
          await runActions(listener.actions, listener.renderer, rendererEvent);
          checkExecuted();
        },
        wait,
        {
          trailing,
          leading,
          maxWait
        }
      );
      rendererEventListeners.forEach(item => {
        // 找到事件队列中正在执行的事件加上标识，下次待执行队列就会把这个事件过滤掉
        if (
          item.renderer === listener.renderer &&
          listener.type === item.type
        ) {
          item.executing = true;
          item.debounceInstance = debounced;
        }
      });
      debounced();
    } else {
      await runActions(listener.actions, listener.renderer, rendererEvent);
      checkExecuted();
    }

    if (listener?.track) {
      const {id: trackId, name: trackName} = listener.track;
      renderer?.props?.env?.tracker({
        eventType: listener.type,
        eventData: {
          trackId,
          trackName
        }
      });
    }

    // 停止后续监听器执行
    if (rendererEvent.stoped) {
      break;
    }
  }
  return Promise.resolve(rendererEvent);
}

export async function dispatchGlobalEventForRenderer(
  eventName: string,
  renderer: React.Component<RendererProps>,
  scoped: IScopedContext,
  data: any,
  broadcast: RendererEvent<any>
) {
  const from = renderer?.props.id || renderer?.props.name || '';
  debug(
    'event',
    `dispatch \`${eventName}\` from 「${renderer?.props.type || 'unknown'}${
      from ? `#${from}` : ''
    }」`,
    data
  );

  renderer?.props?.env?.beforeDispatchEvent?.(
    eventName,
    renderer,
    scoped,
    data,
    broadcast
  );

  renderer.props.onBroadcast?.(eventName, broadcast, data);
  dispatchGlobalEvent(eventName, data);
}

export async function dispatchGlobalEvent(eventName: string, data: any) {
  if (typeof BroadcastChannel !== 'function') {
    console.error('BroadcastChannel is not supported in your browser');
    return;
  }

  const bc = new BroadcastChannel(eventName);
  bc.postMessage({
    eventName,
    data
  });
  bc.close();
}

export const getRendererEventListeners = () => {
  return rendererEventListeners;
};

/**
 * 兼容历史配置，追加对应name的值
 * @param props
 * @param data
 * @param valueKey
 */
export const resolveEventData = (
  props: any,
  data: any,
  valueKey: string = 'value'
) => {
  const proto = props.getData?.() ?? props.data;
  return createObject(
    proto,
    props.name && valueKey
      ? {
          ...data,
          [props.name]: data[valueKey],
          __rendererData: {
            ...proto,
            [props.name]: data[valueKey]
          }
        }
      : data
  );
};

/**
 * 基于 index、condition、oldCondition 获取匹配的事件目标
 * @param tree
 * @param ctx
 * @param index
 * @param condition
 * @param oldCondition
 * @returns
 */
export async function getMatchedEventTargets<T extends TreeItem>(
  tree: Array<T>,
  ctx: any,
  index?: string | number,
  condition?: string,
  oldCondition?: string
) {
  const targets: Array<T> = [];
  if (typeof index === 'number') {
    const row = tree[index];
    row && targets.push(row);
  } else if (typeof index === 'string') {
    index = isExpression(index)
      ? await resolveVariableAndFilterForAsync(index, ctx)
      : index;
    (index as string).split(',').forEach(i => {
      i = i.trim();
      if (i) {
        const indexes = i.split('.').map(ii => parseInt(ii, 10));
        const row: any = getTree(tree, indexes);
        row && targets.push(row);
      }
    });
  } else if (condition) {
    const promies: Array<() => Promise<void>> = [];
    eachTree(tree, item => {
      const data = item.storeType ? item.data : item;
      promies.push(async () => {
        const result = await evalExpressionWithConditionBuilderAsync(
          condition,
          createObject(ctx, data)
        );
        result && targets.push(item);
      });
    });
    await Promise.all(promies.map(fn => fn()));
  } else if (oldCondition) {
    const promies: Array<() => Promise<void>> = [];
    eachTree(tree, (item, rowIndex) => {
      const record = item.storeType ? item.data : item;
      promies.push(async () => {
        const result = evalExpression(
          oldCondition,
          createObject(ctx, {
            record,
            rowIndex,
            item: record,
            index: rowIndex,
            indexPath: item.path
          })
        );
        result && targets.push(item);
      });
    });
    await Promise.all(promies.map(fn => fn()));
  }
  return targets;
}

export default {};
