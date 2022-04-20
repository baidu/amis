import {SchemaNode} from '../types';
import {RendererEvent} from '../utils/renderer-event';
import {
  RendererAction,
  ListenerAction,
  ListenerContext,
  registerAction
} from './Action';

export interface IDrawerAction extends ListenerAction {
  drawer: SchemaNode;
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
    renderer.props.onAction?.(event, action, action.args);
  }
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
        action.args
      );
    }
  }
}

registerAction('drawer', new DrawerAction());
registerAction('closeDrawer', new CloseDrawerAction());
