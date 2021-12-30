import {RendererEvent} from '../utils/renderer-event';
import {
  Action,
  ListenerAction,
  ListenerContext,
  LoopStatus,
  registerAction
} from './Action';

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
    context: ListenerContext,
    rendererEvent: RendererEvent<any>
  ) {
    // 执行自定义编排脚本
    let scriptFunc = action.script;

    if (typeof scriptFunc === 'string') {
      scriptFunc = new Function(
        'context',
        'doAction',
        'rendererEvent',
        scriptFunc
      ) as any;
    }

    // 外部可以直接调用doAction来完成动作调用
    // 可以通过上下文直接编排动作调用，通过rendererEvent来进行动作干预
    await (scriptFunc as any)?.call(
      null,
      context,
      context.doAction.bind(context),
      rendererEvent
    );
  }
}

registerAction('custom', new CustomAction());
