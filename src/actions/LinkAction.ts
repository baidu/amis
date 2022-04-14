import {buildApi} from '../utils/api';
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
  url?: never;
  params?: {
    [key: string]: string;
  };
}

export interface IUrlAction extends ListenerAction {
  url: string;
  link?: never;
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
    action: ILinkAction | IUrlAction,
    renderer: ListenerContext,
    event: RendererEvent<any>
  ) {
    if (!renderer.props.env?.jumpTo) {
      throw new Error('env.jumpTo is required!');
    }

    // 通过buildApi兼容较复杂的url情况
    let urlObj = buildApi(
      {
        url: (action.url || action.link) as string,
        data: action.params
      },
      action.args
    );

    renderer.props.env.jumpTo(urlObj.url, action, action.args);
  }
}

registerAction('openlink', new LinkAction());
