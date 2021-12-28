import {BroadcastEvent} from '../utils/broadcast';
import {Action, ListenerAction, LoopStatus, registerAction} from './Action';

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
    context: any,
    broadcast: BroadcastEvent<any>
  ) {
    context.loopStatus = LoopStatus.CONTINUE;
  }
}

registerAction('continue', new ContinueAction());
