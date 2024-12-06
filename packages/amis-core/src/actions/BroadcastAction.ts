import {createObject} from '../utils/helper';
import {
  RendererEvent,
  dispatchGlobalEventForRenderer
} from '../utils/renderer-event';
import {
  RendererAction,
  ListenerAction,
  ListenerContext,
  registerAction
} from './Action';

export interface IBroadcastAction extends ListenerAction {
  actionType: 'broadcast';
  args: {
    eventName: string; // 事件名称，actionType: broadcast
  };
  eventName?: string; // 兼容历史
}

/**
 * broadcast
 *
 * @export
 * @class BroadcastAction
 * @implements {Action}
 */
export class BroadcastAction implements RendererAction {
  async run(
    action: IBroadcastAction,
    renderer: ListenerContext,
    event: RendererEvent<any>
  ) {
    if (!action.args?.eventName && !action.eventName) {
      console.error('eventName 未定义，请定义事件名称');
      return;
    }

    // 作为一个新的事件，需要把广播动作的args参数追加到事件数据中
    event.setData(createObject(event.data, action.data ?? {}));

    const eventName = action.args?.eventName || action.eventName!;

    // 直接触发对应的动作
    return await dispatchGlobalEventForRenderer(
      eventName,
      renderer,
      event.context.scoped,
      action.data,
      event
    );
  }
}

registerAction('broadcast', new BroadcastAction());
