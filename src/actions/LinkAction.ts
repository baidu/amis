import {Action} from '../types';
import {buildApi} from '../utils/api';
import {isEmpty, isObject, qsstringify} from '../utils/helper';
import {RendererEvent} from '../utils/renderer-event';
import {filter} from '../utils/tpl';
import omit from 'lodash/omit';
import {
  RendererAction,
  ListenerAction,
  ListenerContext,
  registerAction
} from './Action';

export interface ILinkAction extends ListenerAction {
  args: {
    link: string;
    url?: never;
    blank?: boolean;
    params?: {
      [key: string]: string;
    };
    [propName: string]: any;
  };
}

export interface IUrlAction extends ListenerAction {
  args: {
    url: string;
    link?: never;
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
    action: ListenerAction,
    renderer: ListenerContext,
    event: RendererEvent<any>
  ) {
    if (!renderer.props.env?.jumpTo) {
      throw new Error('env.jumpTo is required!');
    }

    if (!action.args) {
      console.error('action.args 未定义，请定义动作参数');
      return;
    }

    // 通过buildApi兼容较复杂的url情况
    let urlObj = buildApi(
      {
        url: (action.args.url || action.args.link) as string,
        method: 'get'
      },
      {
        ...action.args.params,
        ...omit(action.args, ['params', 'blank', 'url', 'link'])
      },
      {
        autoAppend: true
      }
    );

    renderer.props.env.jumpTo(
      urlObj.url,
      {
        actionType: action.actionType,
        ...action.args
      },
      action.args
    );
  }
}

registerAction('openlink', new LinkAction());
