import {RendererEvent} from '../utils/renderer-event';
import {
  RendererAction,
  ListenerAction,
  ListenerContext,
  LogicAction,
  registerAction,
  runActions
} from './Action';

export interface IParallelAction extends ListenerAction, LogicAction {}

export class ParallelAction implements RendererAction {
  async run(
    action: IParallelAction,
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
