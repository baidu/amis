import {Api} from '../types';
import {normalizeApiResponseData} from '../utils/api';
import {ServerError} from '../utils/errors';
import {createObject, isEmpty, isVisible} from '../utils/helper';
import {RendererEvent} from '../utils/renderer-event';
import {filter} from '../utils/tpl';
import {
  RendererAction,
  ListenerAction,
  ListenerContext,
  registerAction
} from './Action';

export interface IAjaxAction extends ListenerAction {
  api: Api;
  messages: {
    success: string;
    failed: string;
  };
  options: object;
}

/**
 * 发送请求动作
 *
 * @export
 * @class AjaxAction
 * @implements {Action}
 */
export class AjaxAction implements RendererAction {
  async run(
    action: IAjaxAction,
    renderer: ListenerContext,
    event: RendererEvent<any>
  ) {
    const env = event.context.env;
    try {
      const result = await env.fetcher(
        action.api as string,
        action.args,
        action.options ?? {}
      );

      if (!isEmpty(result.data) || result.ok) {
        const responseData = normalizeApiResponseData(result.data);
        // 记录请求返回的数据
        event.setData(
          createObject(
            event.data,
            action.outputVar
              ? {
                  [`${action.outputVar}`]: responseData
                }
              : responseData
          )
        );
      }

      if (!result.ok) {
        throw new ServerError(
          (action.messages && action.messages.failed) ?? result.msg,
          result
        );
      } else {
        env.notify(
          'success',
          (action.messages && action.messages.success) ?? result.msg,
          result.msgTimeout !== undefined
            ? {
                closeButton: true,
                timeout: result.msgTimeout
              }
            : undefined
        );
      }

      return result.data;
    } catch (e) {
      if (e.type === 'ServerError') {
        const result = (e as ServerError).response;
        env.notify(
          'error',
          e.message,
          result.msgTimeout !== undefined
            ? {
                closeButton: true,
                timeout: result.msgTimeout
              }
            : undefined
        );
      } else {
        env.notify('error', e.message);
      }

      // 不阻塞后面执行
      // throw e;
    }
  }
}

registerAction('ajax', new AjaxAction());
