import {RendererEvent} from '../utils/renderer-event';
import {filter} from '../utils/tpl';
import {
  RendererAction,
  ListenerAction,
  ListenerContext,
  registerAction
} from './Action';

export interface ICopyAction extends ListenerAction {
  args: {
    content: string;
    copyFormat?: string;
    [propName: string]: any;
  };
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
    if (!renderer.props.env?.copy) {
      throw new Error('env.copy is required!');
    }

    if (action.args?.content) {
      renderer.props.env.copy?.(action.args.content, {
        format: action.args?.copyFormat ?? 'text/html'
      });
    }
  }
}

registerAction('copy', new CopyAction());
