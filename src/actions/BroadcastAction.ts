import {RendererEvent} from '../utils/renderer-event';
import {
  Action,
  ListenerAction,
  ListenerContext,
  registerAction,
  runActionTree
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

    // 直接触发对应的动作
    return await event.context.env.dispatchEvent(
      action.eventName,
      renderer,
      action.args,
      event
    );
  }
}

registerAction('broadcast', new BroadcastAction());
