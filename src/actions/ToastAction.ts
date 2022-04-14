import {RendererEvent} from '../utils/renderer-event';
import {
  Action,
  ListenerAction,
  ListenerContext,
  registerAction
} from './Action';
import {resolveVariableAndFilter} from '../utils/tpl-builtin';

/**
 * 全局toast
 */
export class ToastAction implements Action {
  async run(
    action: ListenerAction,
    renderer: ListenerContext,
    event: RendererEvent<any>
  ) {
    event.context.env.notify?.(
      action.msgType || 'info',
      resolveVariableAndFilter(action.msg, event?.data, '| raw'),
      action
    );
  }
}

registerAction('toast', new ToastAction());
