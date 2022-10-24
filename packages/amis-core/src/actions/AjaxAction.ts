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
  action: 'ajax';
  args: {
    api: Api;
    messages?: {
      success: string;
      failed: string;
    };
    options?: Record<string, any>;
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
  fetcherType: string;
  constructor(fetcherType: string = 'ajax') {
    this.fetcherType = fetcherType;
  }

  async run(
    action: IAjaxAction,
    renderer: ListenerContext,
    event: RendererEvent<any>
  ) {
    if (!renderer.props.env?.fetcher) {
      throw new Error('env.fetcher is required!');
    }
    if (this.fetcherType === 'download' && action.actionType === 'download') {
      if ((action as any).args?.api) {
        (action as any).args.api.responseType = 'blob';
      }
    }

    const env = event.context.env;
    try {
      const result = await env.fetcher(
        action.args?.api as string,
        action.data ?? {},
        action.args?.options ?? {}
      );
      const responseData =
        !isEmpty(result.data) || result.ok
          ? normalizeApiResponseData(result.data)
          : null;

      // 记录请求返回的数据
      event.setData(
        createObject(event.data, {
          ...responseData, // 兼容历史配置
          responseData: responseData,
          [action.outputVar || 'responseResult']: {
            ...responseData,
            responseData,
            responseStatus: result.status,
            responseMsg: result.msg
          }
        })
      );

      if (!action.args?.options?.silent) {
        if (!result.ok) {
          throw new ServerError(
            action.args?.messages?.failed ?? result.msg,
            result
          );
        } else {
          const msg =
            action.args?.messages?.success ?? result.msg ?? result.defaultMsg;
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
      }

      return result.data;
    } catch (e) {
      if (!action.args?.options?.silent) {
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
      }

      // 不阻塞后面执行
      // throw e;
    }
  }
}

registerAction('ajax', new AjaxAction());

registerAction('download', new AjaxAction('download'));
