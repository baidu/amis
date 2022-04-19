import {RendererEvent} from '../utils/renderer-event';
import {
  RendererAction,
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
export class ContinueAction implements RendererAction {
  async run(
    action: ListenerAction,
    renderer: ListenerContext,
    event: RendererEvent<any>
  ) {
    renderer.loopStatus = LoopStatus.CONTINUE;
  }
}

registerAction('continue', new ContinueAction());
