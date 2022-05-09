import { RendererEvent } from '../utils/renderer-event';
import {
  RendererAction,
  ListenerContext,
  LoopStatus,
  registerAction,
  ILogicAction
} from './Action';

export interface IBreakAction extends ILogicAction {
  actionType: 'break';
}

/**
 * breach
 *
 * @export
 * @class BreakAction
 * @implements {Action}
 */
export class BreakAction implements RendererAction {
  async run(
    action: IBreakAction,
    renderer: ListenerContext,
    event: RendererEvent<any>
  ) {
    renderer.loopStatus = LoopStatus.BREAK;
  }
}

registerAction('break', new BreakAction());
