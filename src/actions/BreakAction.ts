import {BroadcastEvent} from '../utils/broadcast';
import {Action, ListenerAction, LoopStatus, registerAction} from './Action';

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
    context: any,
    broadcast: BroadcastEvent<any>
  ) {
    context.loopStatus = LoopStatus.BREAK;
  }
}

registerAction('break', new BreakAction());
