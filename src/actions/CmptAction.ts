import {RendererEvent} from '../utils/renderer-event';
import {dataMapping} from '../utils/tpl-builtin';
import {
  Action,
  ListenerAction,
  ListenerContext,
  LoopStatus,
  registerAction
} from './Action';

/**
 * 组件动作
 *
 * @export
 * @class CmptAction
 * @implements {Action}
 */
export class CmptAction implements Action {
  async run(
    action: ListenerAction,
    renderer: ListenerContext,
    event: RendererEvent<any>
  ) {
    if (action.componentId) {
      debugger;
      renderer;
    } else {
      // 执行组件动作
      (await renderer.props.onAction?.(event, action, action.args)) ||
        renderer.doAction?.(action, action.args);
    }
  }
}

registerAction('component', new CmptAction());
