import {RendererEvent} from '../utils/renderer-event';
import {
  Action,
  ListenerAction,
  ListenerContext,
  registerAction
} from './Action';

/**
 * 打开弹窗动作
 *
 * @export
 * @class DialogAction
 * @implements {Action}
 */
export class DialogAction implements Action {
  async run(
    action: ListenerAction,
    renderer: ListenerContext,
    event: RendererEvent<any>
  ) {
    renderer.props.onAction?.(event, action, action.args);
  }
}

/**
 * 关闭弹窗动作
 *
 * @export
 * @class CloseDialogAction
 * @implements {Action}
 */
export class CloseDialogAction implements Action {
  async run(
    action: ListenerAction,
    renderer: ListenerContext,
    event: RendererEvent<any>
  ) {
    if (action.componentId) {
      // 关闭指定弹窗
      event.context.scoped.closeById(action.componentId);
    } else {
      // 关闭当前弹窗
      renderer.props.onAction?.(event, {
        ...action,
        actionType: 'close'
      }, action.args);
    }
  }
}

/**
 * alert提示动作
 */
export class AlertAction implements Action {
  async run(
    action: ListenerAction,
    renderer: ListenerContext,
    event: RendererEvent<any>
  ) {
    event.context.env.alert?.(action.msg);
  }
}

/**
 * confirm确认提示动作
 */
export class ConfirmAction implements Action {
  async run(
    action: ListenerAction,
    renderer: ListenerContext,
    event: RendererEvent<any>
  ) {
    event.context.env.confirm?.(action.msg, action.title);
  }
}

registerAction('dialog', new DialogAction());
registerAction('closeDialog', new CloseDialogAction());
registerAction('alert', new AlertAction());
registerAction('confirmDialog', new ConfirmAction());
