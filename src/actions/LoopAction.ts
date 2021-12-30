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
    context: ListenerContext,
    rendererEvent: RendererEvent<any>
  ) {
    if (typeof action.loopName !== 'string') {
      console.warn('loopName 必须是字符串类型');
      return;
    }

    const mergeData: {[key: string]: any} = createObject(context.props.data, {
      ...rendererEvent.context.eventData
    });
    const loopData = resolveVariable(action.loopName, mergeData) || [];

    // 必须是数组
    if (!loopData) {
      console.warn(`没有找到数据 ${action.loopName}`);
    } else if (!Array.isArray(loopData)) {
      console.warn(`${action.loopName} 数据不是数组`);
    } else if (action.children?.length) {
      for (const data of loopData) {
        context.loopStatus = LoopStatus.NORMAL;
        // 追加逻辑处理中的数据
        context.logicData = data;
        for (const subAction of action.children) {
          // @ts-ignore
          if (context.loopStatus === LoopStatus.CONTINUE) {
            continue;
          }
          await runActionTree(subAction, context, rendererEvent);

          // @ts-ignore
          if (context.loopStatus === LoopStatus.BREAK || rendererEvent.stoped) {
            break;
          }
        }

        if (rendererEvent.stoped) {
          break;
        }
      }

      context.loopStatus = LoopStatus.NORMAL;
    }
  }
}

registerAction('loop', new LoopAction());
