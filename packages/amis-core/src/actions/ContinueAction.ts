import { RendererEvent } from '../utils/renderer-event';
import {
  RendererAction,
  ListenerContext,
  LoopStatus,
  registerAction,
  ILogicAction
} from './Action';

export interface IContinueAction extends ILogicAction {
  actionType: 'continue';
}

/**
 * continue
 *
 * @export
 * @class ContinueAction
 * @implements {Action}
 */
export class ContinueAction implements RendererAction {
  async run(
    action: IContinueAction,
    renderer: ListenerContext,
    event: RendererEvent<any>
  ) {
    renderer.loopStatus = LoopStatus.CONTINUE;
  }
}

registerAction('continue', new ContinueAction());
