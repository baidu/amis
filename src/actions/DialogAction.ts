import React from 'react';
import {render} from 'react-dom';
import {render as amisRender} from '../factory';
import {uuid} from '../utils/helper';
import {RendererEvent} from '../utils/renderer-event';
import {
  Action,
  ListenerAction,
  ListenerContext,
  registerAction
} from './Action';

let dialogs: {
  id: string;
  action: any;
  store: any;
}[] = [];

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
    const store = renderer.props.store;
    // 记录弹窗
    dialogs.push({
      id: action.dialog.id || '', // id依赖用户的配置
      action,
      store
    });
    // 打开弹窗
    store.setCurrentAction(action);
    store.openDialog(action.args);
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
    // 找到指定关闭的弹窗或者直接关闭当前
    const context = action.componentId
      ? dialogs.find(item => item.id === action.componentId)
      : dialogs[dialogs.length - 1];
    // 如果通过store去关闭，需要确保store是dialog的渲染载体
    // 但如果是弹窗里弹窗的话，关闭父弹窗会同时关闭子弹窗
    context?.store.closeDialog(false);
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
registerAction('confirm', new ConfirmAction());
