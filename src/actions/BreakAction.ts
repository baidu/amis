import {RendererEvent} from '../utils/renderer-event';
import {
  Action,
  ListenerAction,
  ListenerContext,
  LoopStatus,
  registerAction
} from './Action';

/**
 * breach
 *
 * @export
 * @class BreakAction
 * @implements {Action}
 */
export class BreakAction implements Action {
  async run(
    action: ListenerAction,
    context: ListenerContext,
    rendererEvent: RendererEvent<any>
  ) {
    context.loopStatus = LoopStatus.BREAK;
  }
}

registerAction('break', new BreakAction());
