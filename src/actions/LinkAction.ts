import { buildApi } from '../utils/api';
import { RendererEvent } from '../utils/renderer-event';
import omit from 'lodash/omit';
import {
  RendererAction,
  ListenerContext,
  registerAction,
  IListenerAction
} from './Action';

export interface ILinkAction extends IListenerAction {
  actionType: 'link' | 'url' | 'jump';
  args: {
    link?: string;
    url?: never;
    blank?: boolean;
    params?: {
      [key: string]: string;
    };
    [propName: string]: any;
  };
}

/**
 * 打开页面动作
 *
 * @export
 * @class LinkAction
 * @implements {Action}
 */
export class LinkAction implements RendererAction {
  async run(
    action: ILinkAction,
    renderer: ListenerContext,
    event: RendererEvent<any>
  ) {
    if (!renderer.props.env?.jumpTo) {
      throw new Error('env.jumpTo is required!');
    }

    // 通过buildApi兼容较复杂的url情况
    let urlObj = buildApi(
      {
        url: (action.args?.url || action.args?.link) as string,
        method: 'get'
      },
      {
        ...(action.args?.params ?? {}),
        ...omit(action.args ?? {}, ['params', 'blank', 'url', 'link'])
      },
      {
        autoAppend: true
      }
    );

    renderer.props.env.jumpTo(
      urlObj.url,
      {
        actionType: action.actionType,
        type: 'button',
        ...action.args
      },
      action.args
    );
  }
}

registerAction('openlink', new LinkAction());
