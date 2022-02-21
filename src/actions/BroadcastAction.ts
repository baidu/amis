import {createObject} from '../utils/helper';
import {RendererEvent} from '../utils/renderer-event';
import {
  Action,
  ListenerAction,
  ListenerContext,
  registerAction
} from './Action';

/**
 * broadcast
 *
 * @export
 * @class BroadcastAction
 * @implements {Action}
 */
export class BroadcastAction implements Action {
  async run(
    action: ListenerAction,
    renderer: ListenerContext,
    event: RendererEvent<any>
  ) {
    if (!action.eventName) {
      console.warn('eventName 未定义，请定义事件名称');
      return;
    }

    // 作为一个新的事件，需要把广播动作的args参数追加到事件数据中
    event.setData(createObject(event.data, action.args));

    // 直接触发对应的动作
    return await event.context.env.dispatchEvent(
      action.eventName,
      renderer,
      event.context.scoped,
      action.args,
      event
    );
  }
}

registerAction('broadcast', new BroadcastAction());
