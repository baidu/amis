import omit from 'lodash/omit';
import {Api} from '../types';
import {normalizeApiResponseData} from '../utils/api';
import {ServerError} from '../utils/errors';
import {createObject, isEmpty} from '../utils/helper';
import {RendererEvent} from '../utils/renderer-event';
import {
  RendererAction,
  ListenerAction,
  ListenerContext,
  registerAction
} from './Action';

export interface IAjaxAction extends ListenerAction {
  args: {
    api: Api;
    messages: {
      success: string;
      failed: string;
    };
    options: object;
    [propName: string]: any;
  };
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
        action.args?.api as string,
        omit(action.args ?? {}, ['api', 'options', 'messages']),
        action.args?.options ?? {}
      );

      if (!isEmpty(result.data) || result.ok) {
        const responseData = normalizeApiResponseData(result.data);
        // 记录请求返回的数据
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
          action.args?.messages?.failed ?? result.msg,
          result
        );
      } else {
        const msg = action.args?.messages?.success ?? result.msg;
        msg &&
          env.notify(
            'success',
            msg,
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
