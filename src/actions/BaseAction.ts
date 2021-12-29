import {BroadcastEvent} from '../utils/broadcast';
import {Action, ListenerAction, LoopStatus, registerAction} from './Action';

/**
 * 原子动作
 *
 * @export
 * @class BaseAction
 * @implements {Action}
 */
export class BaseAction implements Action {
  async run(
    action: ListenerAction,
    context: any,
    broadcast: BroadcastEvent<any>
  ) {
    // 执行专有动作
    const renderer = context.getRendererInstance();

    await renderer.doAction?.(action, {
      ...broadcast.context.eventData,
      ...action.args // TODO:还要处理映射&表达式
    });
  }
}

registerAction('base', new BaseAction());
