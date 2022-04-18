import {RendererEvent} from '../utils/renderer-event';
import {
  Action,
  ListenerAction,
  ListenerContext,
  registerAction
} from './Action';

export interface IPageGoAction extends ListenerAction {
  delta?: number;
}

/**
 * 返回上个页面
 *
 * @export
 * @class PageGoBackAction
 * @implements {Action}
 */
export class PageGoBackAction implements Action {
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
export class PageGoAction implements Action {
  async run(
    action: IPageGoAction,
    renderer: ListenerContext,
    event: RendererEvent<any>
  ) {
    window.history.go(action.delta || 0);
  }
}

/**
 * 浏览器刷新
 *
 * @export
 * @class PageRefreshAction
 * @implements {Action}
 */
export class PageRefreshAction implements Action {
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
