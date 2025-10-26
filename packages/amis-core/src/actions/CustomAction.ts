import isPlainObject from 'lodash/isPlainObject';
import {ActionObject} from '../types';
import {promisify, str2AsyncFunction} from '../utils';
import {RendererEvent} from '../utils/renderer-event';
import {
  RendererAction,
  ListenerAction,
  ListenerContext,
  registerAction,
  runActions
} from './Action';
import {AMISFunction} from '../schema';

type ScriptType = AMISFunction<
  (
    renderer: any,
    doAction: (action: ActionObject, data: Record<string, any>) => void,
    event: RendererEvent<any>,
    action: ListenerAction
  ) => void
>;

export interface ICustomAction extends ListenerAction {
  actionType: 'custom';
  args: {
    script: ScriptType;
  };
  script?: ScriptType; // 兼容历史
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
    let scriptFunc = action.args?.script ?? action.script;

    if (typeof scriptFunc === 'string') {
      scriptFunc = str2AsyncFunction(
        scriptFunc,
        'context',
        'doAction',
        'event'
      ) as any;
    }
    const proxy = new Proxy(
      {},
      {
        get(target: {}, p: string | symbol, receiver: any): any {
          if (typeof p === 'string') {
            return event.context.scoped?.getComponentByName?.(p);
          }
        }
      }
    );
    // 外部可以直接调用doAction来完成动作调用
    // 可以通过上下文直接编排动作调用，通过event来进行动作干预
    let result = await (scriptFunc as any)?.call(
      proxy,
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
