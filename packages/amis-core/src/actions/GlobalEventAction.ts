/**
 * @file GlobalEventAction.ts
 *
 * @created: 2024/11/05
 */

import {createObject} from '../utils/helper';
import {RendererEvent, dispatchGlobalEvent} from '../utils/renderer-event';
import {
  registerAction,
  RendererAction,
  ListenerAction,
  ListenerContext
} from './Action';

export interface IGlobalEventAction extends ListenerAction {
  actionType: string;
}

/**
 * GlobalEventAction
 *
 * @export
 * @class GlobalEventAction
 * @implements {RendererAction}
 */
export class GlobalEventAction implements RendererAction {
  async run(
    action: IGlobalEventAction,
    renderer: ListenerContext,
    event: RendererEvent<any>
  ) {
    if (!action.eventName) {
      console.error('eventName 未定义，请定义事件名称');
      return;
    }

    event.setData(createObject(event.data, action.data ?? {}));

    console.log(action.eventName);
    // 直接触发对应的动作
    return await dispatchGlobalEvent(action.eventName, action.data);
  }
}

registerAction('globalEvent', new GlobalEventAction());
