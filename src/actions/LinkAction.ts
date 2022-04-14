import {isEmpty, isObject, qsstringify} from '../utils/helper';
import {RendererEvent} from '../utils/renderer-event';
import {filter} from '../utils/tpl';
import {
  Action,
  ListenerAction,
  ListenerContext,
  registerAction
} from './Action';

export interface ILinkAction extends ListenerAction {
  link: string;
  url: string;
  params?: {
    [key: string]: string;
  };
}

/**
 * 打开页面动作
 *
 * @export
 * @class LinkAction
 * @implements {Action}
 */
export class LinkAction implements Action {
  async run(
    action: ILinkAction,
    renderer: ListenerContext,
    event: RendererEvent<any>
  ) {
    if (!renderer.props.env?.jumpTo) {
      throw new Error('env.jumpTo is required!');
    }

    let url = filter((action.url || action.link) as string, action.args, '| raw');

    // 处理参数
    if (!isEmpty(action.params)) {
      if (!isObject(action.params)) {
        throw new Error('action.params must be an object');
      }
      url += `${/\?/.test(url) ? '&' : '?'}${qsstringify(action.params)}`;
    }

    renderer.props.env.jumpTo(
      url,
      action,
      action.args
    );
  }
}

registerAction('openlink', new LinkAction());
