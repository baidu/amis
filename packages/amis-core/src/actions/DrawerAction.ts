import {SchemaNode} from '../types';
import {RendererEvent} from '../utils/renderer-event';
import {
  RendererAction,
  ListenerAction,
  ListenerContext,
  registerAction
} from './Action';

export interface IDrawerAction extends ListenerAction {
  actionType: 'drawer';
  // 兼容历史，保留。不建议用args
  args: {
    drawer: SchemaNode;
  };
  drawer?: SchemaNode;
}

/**
 * 打开抽屉动作
 *
 * @export
 * @class DrawerAction
 * @implements {Action}
 */
export class DrawerAction implements RendererAction {
  async run(
    action: IDrawerAction,
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
        actionType: 'drawer',
        drawer: action.drawer,
        reload: 'none',
        data: action.rawData
      },
      action.data
    );
  }
}

export interface ICloseDrawerAction extends ListenerAction {
  actionType: 'closeDrawer';
}

/**
 * 关闭抽屉动作
 *
 * @export
 * @class CloseDrawerAction
 * @implements {Action}
 */
export class CloseDrawerAction implements RendererAction {
  async run(
    action: ListenerAction,
    renderer: ListenerContext,
    event: RendererEvent<any>
  ) {
    if (action.componentId) {
      // 关闭指定抽屉
      event.context.scoped.closeById(action.componentId);
    } else {
      // 关闭当前抽屉
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

registerAction('drawer', new DrawerAction());
registerAction('closeDrawer', new CloseDrawerAction());
