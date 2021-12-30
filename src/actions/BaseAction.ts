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
 * 原子动作
 *
 * @export
 * @class BaseAction
 * @implements {Action}
 */
export class BaseAction implements Action {
  async run(
    action: ListenerAction,
    context: ListenerContext,
    rendererEvent: RendererEvent<any>
  ) {
    const data = {
      ...context.logicData,
      ...rendererEvent.context.eventData
    };
    // 处理映射
    const args = dataMapping(action.args, data);

    // 执行专有动作
    await context.doAction?.(action, {
      ...data,
      ...args
    });
  }
}

registerAction('base', new BaseAction());
