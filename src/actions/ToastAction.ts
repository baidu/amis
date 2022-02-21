import {RendererEvent} from '../utils/renderer-event';
import {
  Action,
  ListenerAction,
  ListenerContext,
  registerAction
} from './Action';

/**
 * 全局toast
 */
export class ToastAction implements Action {
  async run(
    action: ListenerAction,
    renderer: ListenerContext,
    event: RendererEvent<any>
  ) {
    event.context.env.notify?.(action.msgType, action.msg, action.options);
  }
}

registerAction('toast', new ToastAction());
