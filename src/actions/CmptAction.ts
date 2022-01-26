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
    /**
     * 根据唯一ID查找指定组件
     * 触发组件未指定id或未指定响应组件componentId，则使用触发组件响应
     */
    const component =
      action.componentId && renderer.props.$schema.id !== action.componentId
        ? event.context.scoped?.getComponentById(action.componentId)
        : renderer;

    // 执行组件动作
    return (
      (await component.props.onAction?.(
        event.context.nativeEvent,
        action,
        action.args
      )) || component.doAction?.(action, action.args)
    );
  }
}

registerAction('component', new CmptAction());
