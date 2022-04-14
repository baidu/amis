import {RendererEvent} from '../utils/renderer-event';
import {
  Action,
  ListenerAction,
  ListenerContext,
  registerAction
} from './Action';
import {resolveVariableAndFilter} from '../utils/tpl-builtin';

export interface IToastAction extends ListenerAction {
  msg: string;
  msgType?: string;
  position?:
    | 'top-right'
    | 'top-center'
    | 'top-left'
    | 'bottom-center'
    | 'bottom-left'
    | 'bottom-right'
    | 'center';
  closeButton?: boolean;
  showIcon?: boolean;
  timeout?: number;
}

/**
 * 全局toast
 */
export class ToastAction implements Action {
  async run(
    action: IToastAction,
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
