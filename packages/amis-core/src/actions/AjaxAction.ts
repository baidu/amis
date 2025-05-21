import {Api, ApiObject} from '../types';
import {normalizeApi, normalizeApiResponseData} from '../utils/api';
import {ServerError} from '../utils/errors';
import {createObject, isEmpty} from '../utils/helper';
import {RendererEvent} from '../utils/renderer-event';
import {evalExpressionWithConditionBuilderAsync} from '../utils/tpl';
import {
  RendererAction,
  ListenerAction,
  ListenerContext,
  registerAction
} from './Action';

export interface IAjaxAction extends ListenerAction {
  action: 'ajax';
  api: Api;
  messages?: {
    success: string;
    failed: string;
  };
  options?: Record<string, any>;

  [propName: string]: any;
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
    if (!event.context.env?.fetcher) {
      throw new Error('env.fetcher is required!');
    }

    if (!action.api) {
      throw new Error('api is required!');
    }

    if (this.fetcherType === 'download' && action.actionType === 'download') {
      if ((action as any).api) {
        (action as any).api.responseType = 'blob';
      }
    }

    const env = event.context.env;
    const silent = action?.options?.silent || (action?.api as ApiObject).silent;
    const messages = (action?.api as ApiObject)?.messages;
    let api = normalizeApi(action.api);

    if (api.sendOn) {
      // 发送请求前，判断是否需要发送
      const sendOn = await evalExpressionWithConditionBuilderAsync(
        api.sendOn,
        action.data ?? {},
        false
      );

      if (!sendOn) {
        return;
      }
    }

    // 如果没配置data数据映射，则给一个空对象，避免将当前数据域作为接口请求参数
    if ((api as any)?.data == undefined) {
      api = {
        ...api,
        data: {}
      };
    }

    try {
      const result = await env.fetcher(
        api,
        action.data ?? {},
        action?.options ?? {}
      );
      const responseData =
        !isEmpty(result.data) || result.ok
          ? normalizeApiResponseData(result.data)
          : null;

      // 记录请求返回的数据
      event.setData(
        createObject(event.data, {
          ...event.data,
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
      if (!silent) {
        if (!result.ok) {
          throw new ServerError(
            messages?.failed ?? action.messages?.failed ?? result.msg,
            result
          );
        } else {
          const msg =
            messages?.success ??
            action.messages?.success ??
            result.msg ??
            result.defaultMsg;
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
      if (!silent) {
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
      throw e;
    }
  }
}

registerAction('ajax', new AjaxAction());

registerAction('download', new AjaxAction('download'));
