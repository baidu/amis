import {Log} from '../renderers/Log';
import {BroadcastEvent} from '../utils/broadcast';
import {evalExpression} from '../utils/tpl';
import {Action, LogicAction, registerAction, runActionTree} from './Action';

/**
 * 分支动作
 */
export class BranchAction implements Action {
  async run(action: LogicAction, context: any, broadcast: BroadcastEvent<any>) {
    const mergeData = {
      ...context.props.defaultData,
      ...context.props.data,
      ...broadcast.context.data
    };

    for (const branch of action.children || []) {
      if (!branch.expression) {
        continue;
      }

      const checkResult = evalExpression(branch.expression, mergeData);
      if (checkResult) {
        runActionTree(branch, context, broadcast);
        // 阻止原有动作执行
        branch.preventDefault && broadcast.preventDefault();
        // 阻止后续动作执行
        branch.stopPropagation && broadcast.stopPropagation();
        // 默认执行第一个条件为真的分支，如果开启执行全部，则每个都执行一遍
        if (broadcast.stoped || !action.runAllMatch) {
          break;
        }
      }
    }
  }
}

registerAction('branch', new BranchAction());
