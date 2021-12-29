import {BroadcastEvent} from '../utils/broadcast';
import {
  Action,
  LogicAction,
  LoopStatus,
  registerAction,
  runActionTree
} from './Action';

/**
 * 循环动作
 *
 * @export
 * @class LoopAction
 * @implements {Action}
 */
export class LoopAction implements Action {
  async run(action: LogicAction, context: any, broadcast: BroadcastEvent<any>) {
    if (typeof action.loopName !== 'string') {
      console.warn('loopName 必须是字符串类型');
      return;
    }

    const mergeData = {
      ...context.props.defaultData,
      ...context.props.data,
      ...broadcast.context.data
    };

    const loopData = mergeData[action.loopName];

    // 必须是数组
    if (!loopData) {
      console.warn(`没有找到数据 ${action.loopName}`);
    } else if (!Array.isArray(loopData)) {
      console.warn(`${action.loopName} 数据不是数组`);
    } else if (action.children?.length) {
      for (const item of loopData) {
        context.loopStatus = LoopStatus.NORMAL;
        await runActionTree(action.children, context, broadcast);
        // @ts-ignore
        if (context.loopStatus === LoopStatus.BREAK || broadcast.stoped) {
          break;
        }
      }
      context.loopStatus = LoopStatus.NORMAL;
    }
  }
}

registerAction('loop', new LoopAction());
