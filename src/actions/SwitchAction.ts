import {Log} from '../renderers/Log';
import {RendererEvent} from '../utils/renderer-event';
import {createObject} from '../utils/helper';
import {evalExpression} from '../utils/tpl';
import {
  Action,
  ListenerContext,
  LogicAction,
  registerAction,
  runActionTree
} from './Action';

/**
 * 排他动作
 */
export class SwitchAction implements Action {
  async run(
    action: LogicAction,
    renderer: ListenerContext,
    event: RendererEvent<any>
  ) {
    for (const branch of action.children || []) {
      if (!branch.expression) {
        continue;
      }

      if (evalExpression(branch.expression, event.data)) {
        runActionTree(branch, renderer, event);
        // 阻止原有动作执行
        branch.preventDefault && event.preventDefault();
        // 阻止后续动作执行
        branch.stopPropagation && event.stopPropagation();
        // 去掉runAllMatch，这里只做排他，多个可以直接通过execOn
        break;
      }
    }
  }
}

registerAction('switch', new SwitchAction());
