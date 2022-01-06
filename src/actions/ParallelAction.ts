import {RendererEvent} from '../utils/renderer-event';
import {
  Action,
  ListenerContext,
  LogicAction,
  registerAction,
  runActions
} from './Action';

export class ParallelAction implements Action {
  async run(
    action: LogicAction,
    renderer: ListenerContext,
    event: RendererEvent<any>
  ) {
    if (action.children && action.children.length) {
      const childActions = action.children.map((child: LogicAction) => {
        // 并行动作互不干扰，但不管哪个存在干预都对后续动作生效
        return runActions(child, renderer, event);
      });
      await Promise.all(childActions);
    }
  }
}

registerAction('parallel', new ParallelAction());
