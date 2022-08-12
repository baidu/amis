import isPlainObject from 'lodash/isPlainObject';
import {ActionObject} from '../types';
import {promisify} from '../utils';
import {RendererEvent} from '../utils/renderer-event';
import {
  RendererAction,
  ListenerAction,
  ListenerContext,
  registerAction,
  runActions
} from './Action';

export interface ICustomAction extends ListenerAction {
  actionType: 'custom';
  script:
    | string
    | ((
        renderer: any,
        doAction: (action: ActionObject, data: Record<string, any>) => void,
        event: RendererEvent<any>,
        action: ListenerAction
      ) => void); // 自定义JS，actionType: custom
}

/**
 * 自定义动作，JS脚本
 *
 * @export
 * @class CustomAction
 * @implements {ActionObject}
 */
export class CustomAction implements RendererAction {
  async run(
    action: ICustomAction,
    renderer: ListenerContext,
    event: RendererEvent<any>
  ) {
    // 执行自定义编排脚本
    let scriptFunc = action.script;

    if (typeof scriptFunc === 'string') {
      scriptFunc = promisify(
        new Function('context', 'doAction', 'event', scriptFunc) as any
      );
    }

    // 外部可以直接调用doAction来完成动作调用
    // 可以通过上下文直接编排动作调用，通过event来进行动作干预
    let result = await (scriptFunc as any)?.call(
      null,
      renderer,
      (action: ListenerAction) => runActions(action, renderer, event),
      event,
      action
    );

    // 交给外部处理
    // if (isPlainObject(result)) {
    //   event.setData({...event.data, ...result});
    // }
  }
}

registerAction('custom', new CustomAction());
