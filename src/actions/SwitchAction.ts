import {RendererEvent} from '../utils/renderer-event';
import {evalExpression} from '../utils/tpl';
import {
  Action,
  ListenerContext,
  LogicAction,
  registerAction,
  runActions
} from './Action';

/**
 * 排他动作
 */
export class SwitchAction implements Action {
  async run(
    action: LogicAction,
    renderer: ListenerContext,
    event: RendererEvent<any>,
    mergeData: any
  ) {
    for (const branch of action.children || []) {
      if (!branch.expression) {
        continue;
      }

      if (evalExpression(branch.expression, mergeData)) {
        await runActions(branch, renderer, event);
        // 去掉runAllMatch，这里只做排他，多个可以直接通过execOn
        break;
      }
    }
  }
}

registerAction('switch', new SwitchAction());
