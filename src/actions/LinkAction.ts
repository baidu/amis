import {RendererEvent} from '../utils/renderer-event';
import {filter} from '../utils/tpl';
import {
  Action,
  ListenerAction,
  ListenerContext,
  registerAction
} from './Action';

/**
 * 打开页面动作
 *
 * @export
 * @class LinkAction
 * @implements {Action}
 */
export class LinkAction implements Action {
  async run(
    action: ListenerAction,
    renderer: ListenerContext,
    event: RendererEvent<any>
  ) {
    if (!renderer.props.env?.jumpTo) {
      throw new Error('env.jumpTo is required!');
    }

    renderer.props.env.jumpTo(
      filter(
        (action.to || action.url || action.link) as string,
        action.args,
        '| raw'
      ),
      action,
      action.args
    );
  }
}

registerAction('openlink', new LinkAction());
