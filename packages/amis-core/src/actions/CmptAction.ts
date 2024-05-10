import {RendererEvent} from '../utils/renderer-event';
import {createObject} from '../utils/helper';
import {
  RendererAction,
  ListenerAction,
  ListenerContext,
  registerAction
} from './Action';
import {getRendererByName} from '../factory';

export interface ICmptAction extends ListenerAction {
  actionType: string;
  args: {
    path?: string; // setValue时，目标变量的path
    value?: string | {[key: string]: string}; // setValue时，目标变量的值
    index?: number; // setValue时，支持更新指定索引的数据，一般用于数组类型
    condition?: any; // setValue时，支持更新指定条件的数据，一般用于数组类型
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
    const dataMergeMode = action.dataMergeMode || 'merge';
    const path = action.args?.path;

    /** 如果args中携带path参数, 则认为是全局变量赋值, 否则认为是组件变量赋值 */
    if (action.actionType === 'setValue' && path && typeof path === 'string') {
      const beforeSetData = event?.context?.env?.beforeSetData;
      if (beforeSetData && typeof beforeSetData === 'function') {
        const res = await beforeSetData(renderer, action, event);

        if (res === false) {
          return;
        }
      }
    }

    // 如果key没指定，则默认是当前组件
    let component = key
      ? event.context.scoped?.[
          action.componentId ? 'getComponentById' : 'getComponentByName'
        ](key)
      : renderer;
    // 如果key指定了，但是没找到组件，则报错
    if (key && !component) {
      const msg = `尝试执行一个不存在的目标组件动作（${key}），请检查目标组件非隐藏状态，且正确指定了componentId或componentName`;
      if (action.ignoreError === false) {
        throw Error(msg);
      } else {
        console.warn(msg);
      }
    }

    if (action.actionType === 'setValue') {
      if (component?.setData) {
        return component?.setData(
          action.args?.value,
          dataMergeMode === 'override',
          action.args?.index,
          action.args?.condition
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
        event.data,
        undefined,
        dataMergeMode === 'override',
        action.args
      );
    }

    // 校验表单项
    if (
      action.actionType === 'validateFormItem' &&
      getRendererByName(component?.props?.type)?.isFormItem
    ) {
      const {dispatchEvent, data} = component?.props || {};
      try {
        const valid = await component?.props.onValidate?.();
        if (valid) {
          event.setData(
            createObject(event.data, {
              [action.outputVar || `${action.actionType}Result`]: {
                error: '',
                value: component?.props?.formItem?.value
              }
            })
          );
          dispatchEvent && dispatchEvent('formItemValidateSucc', data);
        } else {
          event.setData(
            createObject(event.data, {
              [action.outputVar || `${action.actionType}Result`]: {
                error: (component?.props?.formItem?.errors || []).join(','),
                value: component?.props?.formItem?.value
              }
            })
          );
          dispatchEvent && dispatchEvent('formItemValidateError', data);
        }
      } catch (e) {
        event.setData(
          createObject(event.data, {
            [action.outputVar || `${action.actionType}Result`]: {
              error: e.message || '未知错误',
              value: component?.props?.formItem?.value
            }
          })
        );
        dispatchEvent && dispatchEvent('formItemValidateError', data);
      }
      return;
    }

    // 执行组件动作
    try {
      const result = await component?.doAction?.(
        action,
        event.data,
        true,
        action.args
      );

      if (['validate', 'submit'].includes(action.actionType)) {
        event.setData(
          createObject(event.data, {
            [action.outputVar || `${action.actionType}Result`]: {
              error: '',
              payload: result?.__payload ?? component?.props?.store?.data,
              responseData: result?.__response
            }
          })
        );
      }
      return result;
    } catch (e) {
      event.setData(
        createObject(event.data, {
          [action.outputVar || `${action.actionType}Result`]: {
            error: e.message,
            errors: e.name === 'ValidateError' ? e.detail : e,
            payload: component?.props?.store?.data
          }
        })
      );
    }
  }
}

registerAction('component', new CmptAction());
