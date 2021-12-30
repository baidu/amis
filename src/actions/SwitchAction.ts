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
    context: ListenerContext,
    rendererEvent: RendererEvent<any>
  ) {
    const mergeData = createObject(context.props.data, {
      ...rendererEvent.context.eventData
    });

    for (const branch of action.children || []) {
      if (!branch.expression) {
        continue;
      }

      const checkResult = evalExpression(branch.expression, mergeData);

      if (checkResult) {
        runActionTree(branch, context, rendererEvent);
        // 阻止原有动作执行
        branch.preventDefault && rendererEvent.preventDefault();
        // 阻止后续动作执行
        branch.stopPropagation && rendererEvent.stopPropagation();
        // 去掉runAllMatch，这里只做排他，多个可以直接通过execOn
        break;
      }
    }
  }
}

registerAction('switch', new SwitchAction());
