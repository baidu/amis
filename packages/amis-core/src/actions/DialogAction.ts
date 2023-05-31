import {Schema, SchemaNode} from '../types';
import {RendererEvent} from '../utils/renderer-event';
import {
  RendererAction,
  ListenerAction,
  ListenerContext,
  registerAction
} from './Action';
import {render} from '../index';

export interface IAlertAction extends ListenerAction {
  actionType: 'alert';
  args: {
    msg: string;
    [propName: string]: any;
  };
}

export interface IConfirmAction extends ListenerAction {
  actionType: 'confirm';
  args: {
    title: string;
    msg: string;
    [propName: string]: any;
  };
}

export interface IDialogAction extends ListenerAction {
  actionType: 'dialog';
  args: {
    dialog: SchemaNode;
  };
  dialog?: SchemaNode; // 兼容历史
}

export interface IConfirmDialogAction extends ListenerAction {
  actionType: 'confirmDialog';
  args: {
    msg: string;
    title: string;
    body?: Schema;
    closeOnEsc?: boolean;
    size?: '' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'full';
    confirmText?: string;
    cancelText?: string;
    confirmBtnLevel?: string;
    cancelBtnLevel?: string;
  };
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
    // 防止editor preview模式下执行
    if ((action as any).$$id !== undefined) {
      return;
    }

    renderer.props.onAction?.(
      event,
      {
        actionType: 'dialog',
        dialog: action.args?.dialog || action.dialog,
        reload: 'none'
      },
      action.data
    );
  }
}

export interface ICloseDialogAction extends ListenerAction {
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
        action.data
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
    event.context.env.alert?.(action.args?.msg, action.args?.title);
  }
}

/**
 * confirm确认提示动作
 */
export class ConfirmAction implements RendererAction {
  async run(
    action: IConfirmDialogAction,
    renderer: ListenerContext,
    event: RendererEvent<any>
  ) {
    let content = action.args?.body
      ? render(action.args.body)
      : action.args.msg;

    const confirmed = await event.context.env.confirm?.(
      content,
      action.args.title,
      {
        closeOnEsc: action.args.closeOnEsc,
        size: action.args.size,
        confirmText: action.args.confirmText,
        cancelText: action.args.cancelText,
        confirmBtnLevel: action.args.confirmBtnLevel,
        cancelBtnLevel: action.args.cancelBtnLevel
      }
    );
    return confirmed;
  }
}

registerAction('dialog', new DialogAction());
registerAction('closeDialog', new CloseDialogAction());
registerAction('alert', new AlertAction());
registerAction('confirmDialog', new ConfirmAction());
