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
    | 'visibility'
    | 'hidden'
    | 'enabled'
    | 'disabled'
    | 'usability'
    | 'reload';
  args: {
    /** actionType为setValue时，目标变量的path */
    path?: string;
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
    const key = action.componentId || action.componentName;
    let component =
      key && renderer.props.$schema[action.componentId ? 'id' : 'name'] !== key
        ? event.context.scoped?.[
            action.componentId ? 'getComponentById' : 'getComponentByName'
          ](key)
        : renderer;

    const dataMergeMode = action.dataMergeMode || 'merge';

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

    if (action.actionType === 'setValue') {
      const beforeSetData = renderer?.props?.env?.beforeSetData;
      const path = action.args?.path;

      /** 如果args中携带path参数, 则认为是全局变量赋值, 否则认为是组件变量赋值 */
      if (
        path &&
        typeof path === 'string' &&
        beforeSetData &&
        typeof beforeSetData === 'function'
      ) {
        const res = await beforeSetData(renderer, action, event);

        if (res === false) {
          return;
        }
      }

      if (component?.setData) {
        return component?.setData(
          action.args?.value,
          dataMergeMode === 'override',
          action.args?.index
        );
      } else {
        return component?.props.onChange?.(action.args?.value);
      }
    }

    // 刷新
    if (action.actionType === 'reload') {
      return component?.reload?.(
        undefined,
        action.data,
        undefined,
        undefined,
        dataMergeMode === 'override',
        action.args
      );
    }

    // 执行组件动作
    return component?.doAction?.(action, action.args);
  }
}

registerAction('component', new CmptAction());
