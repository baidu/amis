import {RendererEvent} from '../utils/renderer-event';
import {dataMapping} from '../utils/tpl-builtin';
import {
  Action,
  ListenerAction,
  ListenerContext,
  LoopStatus,
  registerAction
} from './Action';

/**
 * 组件动作
 *
 * @export
 * @class CmptAction
 * @implements {Action}
 */
export class CmptAction implements Action {
  async run(
    action: ListenerAction,
    renderer: ListenerContext,
    event: RendererEvent<any>
  ) {
    // 显隐&状态控制
    if (['show', 'hidden'].includes(action.actionType)) {
      return renderer.props.rootStore.setVisible(
        action.componentId,
        action.actionType === 'show'
      );
    } else if (['enabled', 'disabled'].includes(action.actionType)) {
      return renderer.props.rootStore.setDisable(
        action.componentId,
        action.actionType === 'disabled'
      );
    }

    /**
     * 根据唯一ID查找指定组件
     * 触发组件未指定id或未指定响应组件componentId，则使用触发组件响应
     */
    const component =
      action.componentId && renderer.props.$schema.id !== action.componentId
        ? event.context.scoped?.getComponentById(action.componentId)
        : renderer;

    // 刷新
    if (action.actionType === 'reload') {
      return component.reload?.(undefined, action.args);
    }

    // 执行组件动作
    return component.doAction?.(action, action.args);
  }
}

registerAction('component', new CmptAction());
