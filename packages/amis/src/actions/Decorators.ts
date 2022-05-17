import {createObject} from '../utils/helper';

import type {ListenerAction} from './Action';
import type {OptionsControlProps} from '../renderers/Form/Options';
import type {FormControlProps} from '../renderers/Form/Item';
import type {RendererEvent} from '../utils/renderer-event';

/**
 * 渲染器事件派发
 *
 * @param props 组件props
 * @param e 事件类型
 * @param ctx 上下文数据
 */
export async function rendererEventDispatcher<
  T extends FormControlProps,
  E = any
>(
  props: T,
  e: E,
  ctx: Record<string, any> = {}
): Promise<RendererEvent<any> | undefined> {
  const {dispatchEvent, data} = props;

  return dispatchEvent(e, createObject(data, ctx));
}

/**
 * 渲染器事件方法装饰器
 *
 * @param event 事件类型
 * @param ctx 上下文数据
 * @returns {Function}
 */
export function bindRendererEvent<T extends FormControlProps, E = any>(
  event: E,
  ctx: Record<string, any> = {}
) {
  return function (
    target: any,
    propertyKey: string,
    descriptor: TypedPropertyDescriptor<any>
  ) {
    let fn =
      descriptor.value && typeof descriptor.value === 'function'
        ? descriptor.value
        : typeof descriptor?.get === 'function'
        ? descriptor.get()
        : null;

    if (!fn || typeof fn !== 'function') {
      throw new Error(
        `decorator can only be applied to methods not: ${typeof fn}`
      );
    }

    return {
      ...descriptor,

      value: async function boundFn(...params: any[]) {
        const triggerProps = (this as TypedPropertyDescriptor<any> & {props: T})
          ?.props;
        let value = triggerProps?.value;

        // clear清除内容事件
        if (typeof event === 'string' && event === 'clear') {
          value = triggerProps?.resetValue;
        }

        const dispatcher = await rendererEventDispatcher<T>(
          triggerProps,
          event,
          {
            value
          }
        );

        if (dispatcher?.prevented) {
          return;
        }

        return fn.apply(this, [...params]);
      }
    };
  };
}
