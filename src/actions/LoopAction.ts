import {RendererEvent} from '../utils/renderer-event';
import {createObject} from '../utils/helper';
import {
  RendererAction,
  ListenerAction,
  ListenerContext,
  LogicAction,
  LoopStatus,
  registerAction,
  runAction,
  runActions
} from './Action';
import {resolveVariable} from '../utils/tpl-builtin';

export interface ILoopAction extends ListenerAction, LogicAction {
  args: {
    loopName: string;
    [propName: string]: any;
  };
}

/**
 * 循环动作
 *
 * @export
 * @class LoopAction
 * @implements {Action}
 */
export class LoopAction implements RendererAction {
  async run(
    action: ILoopAction,
    renderer: ListenerContext,
    event: RendererEvent<any>,
    mergeData: any
  ) {
    const loopName = action.args?.loopName;
    if (typeof loopName !== 'string') {
      console.error('loopName 必须是字符串类型');
      return;
    }

    const loopData = resolveVariable(loopName, mergeData) || [];

    // 必须是数组
    if (!loopData) {
      console.error(`没有找到数据 ${loopName}`);
    } else if (!Array.isArray(loopData)) {
      console.error(`${loopName} 数据不是数组`);
    } else if (action.children?.length) {
      // 暂存一下
      const protoData = event.data;

      for (const data of loopData) {
        renderer.loopStatus = LoopStatus.NORMAL;
        // 追加逻辑处理中的数据，事件数据优先，用完还要还原
        event.setData(createObject(event.data, data));

        for (const subAction of action.children) {
          // @ts-ignore
          if (renderer.loopStatus === LoopStatus.CONTINUE) {
            continue;
          }
          await runActions(subAction, renderer, event);

          // @ts-ignore
          if (renderer.loopStatus === LoopStatus.BREAK || event.stoped) {
            // 还原事件数据
            event.setData(protoData);
            event.stopPropagation();
            break;
          }
        }

        if (event.stoped) {
          // 还原事件数据
          event.setData(protoData);
          break;
        }
      }

      renderer.loopStatus = LoopStatus.NORMAL;
      event.setData(protoData);
    }
  }
}

registerAction('loop', new LoopAction());
