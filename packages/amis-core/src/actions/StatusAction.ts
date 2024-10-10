import {RendererEvent} from '../utils/renderer-event';
import {
  RendererAction,
  ListenerAction,
  ListenerContext,
  registerAction
} from './Action';

export interface IStatusAction extends ListenerAction {
  actionType:
    | 'static'
    | 'nonstatic'
    | 'show'
    | 'visibility'
    | 'hidden'
    | 'enabled'
    | 'disabled'
    | 'usability';
}

/**
 * 状态更新动作
 *
 * @export
 * @class StatusAction
 * @implements {Action}
 */
export class StatusAction implements RendererAction {
  async run(
    action: IStatusAction,
    renderer: ListenerContext,
    event: RendererEvent<any>
  ) {
    /**
     * 根据唯一ID查找指定组件
     * 触发组件未指定id或未指定响应组件componentId，则使用触发组件响应
     */
    const key = action.componentId || action.componentName;

    // 显隐&状态控制
    if (['show', 'hidden', 'visibility'].includes(action.actionType)) {
      let visibility =
        action.actionType === 'visibility'
          ? action.args?.value
          : action.actionType === 'show';
      return renderer.props.statusStore.setVisible(key!, visibility as any);
    } else if (['static', 'nonstatic'].includes(action.actionType)) {
      return renderer.props.statusStore.setStatic(
        key!,
        action.actionType === 'static'
      );
    } else if (
      ['enabled', 'disabled', 'usability'].includes(action.actionType)
    ) {
      let usability =
        action.actionType === 'usability'
          ? !action.args?.value
          : action.actionType === 'disabled';
      return renderer.props.statusStore.setDisable(key!, usability);
    }
  }
}

registerAction('status', new StatusAction());
