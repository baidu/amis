import { SchemaNode } from '../types';
import { RendererEvent } from '../utils/renderer-event';
import {
  RendererAction,
  ListenerAction,
  IListenerAction,
  ListenerContext,
  registerAction
} from './Action';

export interface IAlertAction extends IListenerAction {
  actionType: 'alert';
  args: {
    msg: string;
    [propName: string]: any;
  };
}

export interface IConfirmAction extends IListenerAction {
  actionType: 'confirm';
  args: {
    title: string;
    msg: string;
    [propName: string]: any;
  };
}

export interface IDialogAction extends IListenerAction {
  actionType: 'dialog';
  dialog: SchemaNode;
}

/**
 * 打开弹窗动作
 *
 * @export
 * @class DialogAction
 * @implements {Action}
 */
export class DialogAction implements RendererAction {
  async run(
    action: IDialogAction,
    renderer: ListenerContext,
    event: RendererEvent<any>
  ) {
    renderer.props.onAction?.(event, action, action.args);
  }
}

export interface ICloseDialogAction extends IListenerAction {
  actionType: 'closeDialog';
}

/**
 * 关闭弹窗动作
 *
 * @export
 * @class CloseDialogAction
 * @implements {Action}
 */
export class CloseDialogAction implements RendererAction {
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
      renderer.props.onAction?.(
        event,
        {
          ...action,
          actionType: 'close'
        },
        action.args
      );
    }
  }
}

/**
 * alert提示动作
 */
export class AlertAction implements RendererAction {
  async run(
    action: IAlertAction,
    renderer: ListenerContext,
    event: RendererEvent<any>
  ) {
    event.context.env.alert?.(action.args?.msg);
  }
}

/**
 * confirm确认提示动作
 */
export class ConfirmAction implements RendererAction {
  async run(
    action: IConfirmAction,
    renderer: ListenerContext,
    event: RendererEvent<any>
  ) {
    event.context.env.confirm?.(action.args?.msg, action.args?.title);
  }
}

registerAction('dialog', new DialogAction());
registerAction('closeDialog', new CloseDialogAction());
registerAction('alert', new AlertAction());
registerAction('confirmDialog', new ConfirmAction());
