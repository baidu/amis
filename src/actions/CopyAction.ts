import {RendererEvent} from '../utils/renderer-event';
import {filter} from '../utils/tpl';
import {
  RendererAction,
  ListenerAction,
  ListenerContext,
  LoopStatus,
  registerAction
} from './Action';

export interface ICopyAction extends ListenerAction {
  content: string;
  copyFormat?: string;
}

/**
 * 复制动作
 *
 * @export
 * @class CopyAction
 * @implements {Action}
 */
export class CopyAction implements RendererAction {
  async run(
    action: ICopyAction,
    renderer: ListenerContext,
    event: RendererEvent<any>
  ) {
    if (action.content) {
      renderer.props.env.copy?.(filter(action.content, action.args, '| raw'), {
        format: action.copyFormat
      });
    }
  }
}

registerAction('copy', new CopyAction());
