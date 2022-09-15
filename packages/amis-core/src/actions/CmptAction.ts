import {RendererEvent} from '../utils/renderer-event';
import {
  RendererAction,
  ListenerAction,
  ListenerContext,
  registerAction
} from './Action';

export interface ICmptAction extends ListenerAction {
  actionType:
    | 'setValue'
    | 'static'
    | 'nonstatic'
    | 'show'
    | 'hidden'
    | 'enabled'
    | 'disabled'
    | 'reload';
  args: {
    value?: string | {[key: string]: string};
    index?: number; // setValue支持更新指定索引的数据，一般用于数组类型
  };
}

/**
 * 组件动作
 *
 * @export
 * @class CmptAction
 * @implements {Action}
 */
export class CmptAction implements RendererAction {
  async run(
    action: ICmptAction,
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

    // 显隐&状态控制
    if (['show', 'hidden'].includes(action.actionType)) {
      return renderer.props.topStore.setVisible(
        action.componentId,
        action.actionType === 'show'
      );
    } else if (['static', 'nonstatic'].includes(action.actionType)) {
      return renderer.props.topStore.setStatic(
        action.componentId,
        action.actionType === 'static'
      );
    } else if (['enabled', 'disabled'].includes(action.actionType)) {
      return renderer.props.topStore.setDisable(
        action.componentId,
        action.actionType === 'disabled'
      );
    }

    // 数据更新
    if (action.actionType === 'setValue') {
      if (component?.setData) {
        return component?.setData(action.args?.value, action.args?.index);
      } else {
        return component?.props.onChange?.(action.args?.value);
      }
    }

    // 刷新
    if (action.actionType === 'reload') {
      return component?.reload?.(undefined, action.args);
    }

    // 执行组件动作
    return component?.doAction?.(action, action.args);
  }
}

registerAction('component', new CmptAction());
