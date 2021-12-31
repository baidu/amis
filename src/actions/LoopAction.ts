import {RendererEvent} from '../utils/renderer-event';
import {createObject} from '../utils/helper';
import {
  Action,
  ListenerContext,
  LogicAction,
  LoopStatus,
  registerAction,
  runAction,
  runActionTree
} from './Action';
import {resolveVariable} from '../utils/tpl-builtin';

/**
 * 循环动作
 *
 * @export
 * @class LoopAction
 * @implements {Action}
 */
export class LoopAction implements Action {
  async run(
    action: LogicAction,
    renderer: ListenerContext,
    event: RendererEvent<any>
  ) {
    if (typeof action.loopName !== 'string') {
      console.warn('loopName 必须是字符串类型');
      return;
    }

    const loopData = resolveVariable(action.loopName, event.data) || [];

    // 必须是数组
    if (!loopData) {
      console.warn(`没有找到数据 ${action.loopName}`);
    } else if (!Array.isArray(loopData)) {
      console.warn(`${action.loopName} 数据不是数组`);
    } else if (action.children?.length) {
      for (const data of loopData) {
        renderer.loopStatus = LoopStatus.NORMAL;
        // 追加逻辑处理中的数据，用完还要还原
        event.setData(
          createObject(event.data, {
            ...data
          })
        );

        for (const subAction of action.children) {
          // @ts-ignore
          if (renderer.loopStatus === LoopStatus.CONTINUE) {
            continue;
          }
          await runActionTree(subAction, renderer, event);

          // @ts-ignore
          if (renderer.loopStatus === LoopStatus.BREAK || event.stoped) {
            // 还原事件数据
            event.setData({...event.data.__proto__});
            break;
          }
        }

        if (event.stoped) {
          // 还原事件数据
          event.setData({...event.data.__proto__});
          break;
        }
      }

      renderer.loopStatus = LoopStatus.NORMAL;
    }
  }
}

registerAction('loop', new LoopAction());
