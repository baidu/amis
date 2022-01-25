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
    renderer: ListenerContext,
    event: RendererEvent<any>
  ) {
    // 执行自定义编排脚本
    let scriptFunc = action.script;

    if (typeof scriptFunc === 'string') {
      scriptFunc = new Function(
        'context',
        'doAction',
        'event',
        scriptFunc
      ) as any;
    }

    // 外部可以直接调用doAction来完成动作调用
    // 可以通过上下文直接编排动作调用，通过event来进行动作干预
    await (scriptFunc as any)?.call(
      null,
      renderer,
      renderer.props.onAction?.bind(renderer, event.context.nativeEvent) ||
        renderer.doAction?.bind(renderer),
      event,
      action
    );
  }
}

registerAction('custom', new CustomAction());
