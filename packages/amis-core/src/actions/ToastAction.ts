import {RendererEvent} from '../utils/renderer-event';
import {
  RendererAction,
  ListenerContext,
  registerAction,
  ListenerAction
} from './Action';

export interface IToastAction extends ListenerAction {
  actionType: 'toast';
  args: {
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
  };
}

/**
 * 全局toast
 */
export class ToastAction implements RendererAction {
  async run(
    action: IToastAction,
    renderer: ListenerContext,
    event: RendererEvent<any>
  ) {
    if (!renderer.props.env?.notify) {
      throw new Error('env.notify is required!');
    }

    event.context.env.notify?.(
      action.args?.msgType || 'info',
      String(action.args?.msg),
      action.args
    );
  }
}

registerAction('toast', new ToastAction());
