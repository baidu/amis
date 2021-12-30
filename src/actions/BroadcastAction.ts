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
    context: ListenerContext,
    rendererEvent: RendererEvent<any>
  ) {
    if (!action.eventName) {
      console.warn('eventName 未定义，请定义事件名称');
      return;
    }

    // 直接触发对应的动作
    return await rendererEvent.context.env.dispatchEvent(
      action.eventName,
      context,
      action.args,
      rendererEvent
    );
  }
}

registerAction('broadcast', new BroadcastAction());
