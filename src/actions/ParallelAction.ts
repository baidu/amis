import {RendererEvent} from '../utils/renderer-event';
import {
  Action,
  ListenerContext,
  LogicAction,
  registerAction,
  runActionTree
} from './Action';

export class ParallelAction implements Action {
  async run(
    action: LogicAction,
    context: ListenerContext,
    rendererEvent: RendererEvent<any>
  ) {
    if (action.children && action.children.length) {
      let prevent = false;
      let stop = false;
      const childActions = action.children.map((child: LogicAction) => {
        // 并行动作互不干扰，但不管哪个存在干预都对后续动作生效
        child.preventDefault && (prevent = true);
        child.stopPropagation && (stop = true);
        return runActionTree(child, context, rendererEvent);
      });
      await Promise.all(childActions);
      // 阻止原有动作执行
      prevent && rendererEvent.preventDefault();
      // 阻止后续动作执行
      stop && rendererEvent.stopPropagation();
    }
  }
}

registerAction('parallel', new ParallelAction());
