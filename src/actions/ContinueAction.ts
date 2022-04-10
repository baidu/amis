import {RendererEvent} from '../utils/renderer-event';
import {
  Action,
  ListenerAction,
  ListenerContext,
  LoopStatus,
  registerAction
} from './Action';

/**
 * continue
 *
 * @export
 * @class ContinueAction
 * @implements {Action}
 */
export class ContinueAction implements Action {
  async run(
    action: ListenerAction,
    renderer: ListenerContext,
    event: RendererEvent<any>
  ) {
    renderer.loopStatus = LoopStatus.CONTINUE;
  }
}

registerAction('continue', new ContinueAction());
