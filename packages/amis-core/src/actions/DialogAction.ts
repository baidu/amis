import {
  AMISDefaultData,
  AMISDialogSchemaBase,
  AMISLegacyReloadActionButton
} from '../schema';
import {Schema, SchemaNode} from '../types';
import {extendObject} from '../utils';
import {RendererEvent} from '../utils/renderer-event';
import {filter} from '../utils/tpl';
import {
  RendererAction,
  ListenerAction,
  ListenerContext,
  registerAction
} from './Action';

export interface IAlertAction extends ListenerAction {
  actionType: 'alert';
  dialog?: AMISDialogSchemaBase;
  // 兼容历史，保留。为了和其他弹窗保持一致
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
  // 兼容历史，保留。不建议用args
  args: {
    dialog: AMISDialogSchemaBase;
  };
  dialog?: AMISDialogSchemaBase;

  /**
   * 是否等待确认结果
   */
  waitForAction?: boolean;

  /**
   * 如果等待结果，将弹窗结果保存到此处变量
   */
  outputVar?: string;
}

export interface IConfirmDialogAction extends ListenerAction {
  actionType: 'confirmDialog';
  dialog?: AMISDialogSchemaBase;

  // 兼容历史，保留。不建议用args
  args: {
    msg: string;
    title: string;
    body?: AMISLegacyReloadActionButton;
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

    let ret = renderer.handleAction
      ? renderer.handleAction(
          event,
          {
            actionType: 'dialog',
            dialog: action.dialog,
            reload: 'none',
            data: action.rawData
          },
          action.data
        )
      : renderer.props.onAction?.(
          event,
          {
            actionType: 'dialog',
            dialog: action.dialog,
            reload: 'none',
            data: action.rawData
          },
          action.data
        );

    event.pendingPromise.push(ret);
    if (action.waitForAction) {
      const {confirmed, value} = await ret;

      event.setData(
        extendObject(event.data, {
          [action.outputVar || 'dialogResponse']: {
            confirmed,
            value
          }
        })
      );
    }
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
    // todo 支持 waitForAction，等待弹窗关闭后再执行后续动作
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
    event.context.env.alert?.(
      filter(action.dialog?.msg, event.data) ?? action.args?.msg,
      filter(action.dialog?.title, event.data) ?? action.args?.title,
      filter(action.dialog?.className, event.data) ?? ''
    );
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
    let modal: any = action.dialog ?? action.args;

    if (modal.$ref && renderer.props.resolveDefinitions) {
      modal = {
        ...renderer.props.resolveDefinitions(modal.$ref),
        ...modal
      };
    }

    const type = modal?.type;

    if (!type) {
      const confirmed = await event.context.env.confirm?.(
        filter(modal?.msg, event.data) || action.args?.msg,
        filter(action.dialog?.title, event.data) || action.args?.title,
        {
          closeOnEsc:
            filter(action.dialog?.closeOnEsc, event.data) ||
            action.args?.closeOnEsc,
          size: filter(action.dialog?.size, event.data) || action.args?.size,
          confirmText:
            filter(action.dialog?.confirmText, event.data) ||
            action.args?.confirmText,
          cancelText:
            filter(action.dialog?.cancelText, event.data) ||
            action.args?.cancelText,
          confirmBtnLevel:
            filter(action.dialog?.confirmBtnLevel, event.data) ||
            action.args?.confirmBtnLevel,
          cancelBtnLevel:
            filter(action.dialog?.cancelBtnLevel, event.data) ||
            action.args?.cancelBtnLevel,
          className: filter(action.dialog?.className, event.data) || ''
        }
      );

      return confirmed;
    }

    // 自定义弹窗内容
    const confirmed = await new Promise((resolve, reject) => {
      renderer.handleAction
        ? renderer.handleAction(
            event,
            {
              actionType: 'dialog',
              dialog: modal,
              data: action.rawData,
              reload: 'none',
              callback: (result: boolean) => resolve(result)
            },
            action.data
          )
        : renderer.props.onAction?.(
            event,
            {
              actionType: 'dialog',
              dialog: modal,
              data: action.rawData,
              reload: 'none',
              callback: (result: boolean) => resolve(result)
            },
            action.data
          );
    });

    return confirmed;
  }
}

registerAction('dialog', new DialogAction());
registerAction('closeDialog', new CloseDialogAction());
registerAction('alert', new AlertAction());
registerAction('confirmDialog', new ConfirmAction());
