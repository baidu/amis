import {RendererEvent} from '../utils/renderer-event';
import {
  RendererAction,
  ListenerAction,
  ListenerContext,
  registerAction
} from './Action';

export interface IPageGoAction extends ListenerAction {
  args: {
    delta?: number;
    [propName: string]: any;
  };
}

/**
 * 返回上个页面
 *
 * @export
 * @class PageGoBackAction
 * @implements {Action}
 */
export class PageGoBackAction implements RendererAction {
  async run(
    action: ListenerAction,
    renderer: ListenerContext,
    event: RendererEvent<any>
  ) {
    window.history.back();
  }
}

/**
 * 到指定页面
 *
 * @export
 * @class PageGoAction
 * @implements {Action}
 */
export class PageGoAction implements RendererAction {
  async run(
    action: IPageGoAction,
    renderer: ListenerContext,
    event: RendererEvent<any>
  ) {
    window.history.go(action.args?.delta || 0);
  }
}

/**
 * 浏览器刷新
 *
 * @export
 * @class PageRefreshAction
 * @implements {Action}
 */
export class PageRefreshAction implements RendererAction {
  async run(
    action: ListenerAction,
    renderer: ListenerContext,
    event: RendererEvent<any>
  ) {
    window.location.reload();
  }
}

registerAction('goBack', new PageGoBackAction());
registerAction('refresh', new PageRefreshAction());
registerAction('goPage', new PageGoAction());
