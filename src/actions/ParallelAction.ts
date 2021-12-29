import {BroadcastEvent} from '../utils/broadcast';
import {Action, LogicAction, registerAction, runActionTree} from './Action';

export class ParallelAction implements Action {
  async run(action: LogicAction, context: any, broadcast: BroadcastEvent<any>) {
    if (action.children && action.children.length) {
      let prevent = false;
      let stop = false;
      const childActions = action.children.map((child: LogicAction) => {
        // 并行动作互不干扰，但不管哪个存在干预都对后续动作生效
        child.preventDefault && (prevent = true);
        child.stopPropagation && (stop = true);
        return runActionTree(child, context, broadcast);
      });
      await Promise.all(childActions);
      // 阻止原有动作执行
      prevent && broadcast.preventDefault();
      // 阻止后续动作执行
      stop && broadcast.stopPropagation();
    }
  }
}

registerAction('parallel', new ParallelAction());
