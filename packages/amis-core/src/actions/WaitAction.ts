import {RendererEvent} from '../utils/renderer-event';
import {
  RendererAction,
  ListenerContext,
  registerAction,
  ListenerAction
} from './Action';

export interface IWaitAction extends ListenerAction {
  actionType: 'wait';
  args: {
    time: number;
  };
}

/**
 * 事件本身相关动作
 *
 * @export
 * @class EventAction
 * @implements {Action}
 */
export class WaitAction implements RendererAction {
  async run(
    action: IWaitAction,
    renderer: ListenerContext,
    event: RendererEvent<any>
  ) {
    const time = action.args?.time;

    if (typeof time === 'number') {
      await new Promise(resolve => setTimeout(resolve, time));
    }
  }
}

registerAction('wait', new WaitAction());
