import {RendererEvent} from '../utils/renderer-event';
import {
  RendererAction,
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
export class BreakAction implements RendererAction {
  async run(
    action: ListenerAction,
    renderer: ListenerContext,
    event: RendererEvent<any>
  ) {
    renderer.loopStatus = LoopStatus.BREAK;
  }
}

registerAction('break', new BreakAction());
