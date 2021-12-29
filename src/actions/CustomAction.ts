import {BroadcastEvent} from '../utils/broadcast';
import {Action, ListenerAction, LoopStatus, registerAction} from './Action';

/**
 * 自定义动作，JS脚本
 *
 * @export
 * @class CustomAction
 * @implements {Action}
 */
export class CustomAction implements Action {
  async run(
    action: ListenerAction,
    context: any,
    broadcast: BroadcastEvent<any>
  ) {
    // 执行自定义编排脚本
    let scriptFunc = action.script;

    if (typeof scriptFunc === 'string') {
      scriptFunc = new Function('broadcast', scriptFunc) as any;
    }

    // 外部可以直接调用doAction来完成动作调用
    const renderer = context.getRendererInstance();

    // 可以通过上下文直接编排动作调用，通过broadcast来进行动作干预
    await (scriptFunc as any)?.call(renderer, broadcast);
  }
}

registerAction('custom', new CustomAction());
