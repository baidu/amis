import type {ActionSchema} from './renderers/Action';
import {SchemaApiObject} from './Schema';

export interface ApiObject extends SchemaApiObject {
  config?: {
    withCredentials?: boolean;
    cancelExecutor?: (cancel: Function) => void;
  };
  body?: PlainObject;
  query?: PlainObject;
  adaptor?: (payload: object, response: fetcherResult, api: ApiObject) => any;
  requestAdaptor?: (api: ApiObject) => ApiObject;
}
export type ApiString = string;
export type Api = ApiString | ApiObject;

export interface fetcherResult {
  data?: {
    data: object;
    status: number;
    msg: string;
    msgTimeout?: number;
    errors?: {
      [propName: string]: string;
    };
    type?: string;
    [propName: string]: any; // 为了兼容其他返回格式
  };
  status: number;
  headers: object;
}

export interface fetchOptions {
  method?: 'get' | 'post' | 'put' | 'patch' | 'delete' | 'jsonp';
  successMessage?: string;
  errorMessage?: string;
  autoAppend?: boolean;
  beforeSend?: (data: any) => any;
  onSuccess?: (json: Payload) => any;
  onFailed?: (json: Payload) => any;
  silent?: boolean;
  [propName: string]: any;
}

export interface Payload {
  ok: boolean;
  msg: string;
  msgTimeout?: number;
  data: any;
  status: number;
  errors?: {
    [propName: string]: string;
  };
}

export interface Schema {
  type: string;
  detectField?: string;
  visibleOn?: string;
  hiddenOn?: string;
  children?: JSX.Element | ((props: any, schema?: any) => JSX.Element) | null;
  definitions?: Definitions;
  [propName: string]: any;
}

export interface Button {
  type: 'submit' | 'button' | 'reset';
  label?: string;
  icon?: string;
  size?: string;
  disabled?: boolean;
  className?: string;
}

export type SchemaNode = Schema | string | Array<Schema | string>;
export interface SchemaArray extends Array<SchemaNode> {}
export interface Definitions {
  [propName: string]: SchemaNode;
}
export interface Action extends Button {
  actionType?:
    | 'submit'
    | 'copy'
    | 'reload'
    | 'ajax'
    | 'dialog'
    | 'drawer'
    | 'jump'
    | 'link'
    | 'url'
    | 'email'
    | 'close'
    | 'confirm'
    | 'add'
    | 'remove'
    | 'delete'
    | 'edit'
    | 'cancel'
    | 'next'
    | 'prev'
    | 'reset'
    | 'reset-and-submit'
    | 'clear'
    | 'clear-and-submit'
    | 'toast'
    | 'goto-step'
    | 'step-submit';
  api?: Api;
  asyncApi?: Api;
  payload?: any;
  dialog?: SchemaNode;
  to?: string;
  target?: string;
  link?: string;
  url?: string;
  cc?: string;
  bcc?: string;
  subject?: string;
  body?: string;
  mergeData?: boolean;
  reload?: string;
  messages?: {
    success?: string;
    failed?: string;
  };
  feedback?: any;
  required?: Array<string>;
  [propName: string]: any;
}

export interface Location {
  pathname: string;
  search: string;
  state: any;
  hash: string;
  key?: string;
  query?: any;
}

export interface PlainObject {
  [propsName: string]: any;
}

export interface RendererData {
  [propsName: string]: any;
  __prev?: RendererDataAlias;
  __super?: RendererData;
}
type RendererDataAlias = RendererData;

export type FunctionPropertyNames<T> = {
  [K in keyof T]: T[K] extends Function ? K : never;
}[keyof T];

export interface JSONSchema {
  [propsName: string]: any;
}

// export type Omit<T, K extends keyof T & any> = Pick<T, Exclude<keyof T, K>>;
// export type Override<M, N> = Omit<M, Extract<keyof M, keyof N>> & N;
// export type ExtractProps<
//   TComponentOrTProps
// > = TComponentOrTProps extends React.ComponentType<infer P> ? P : never;

/**
 * 事件跟踪的定义
 */
export interface EventTrack {
  /**
   * 事件类型，目前有以下几种
   *
   * api: 所有 fetcher 前调用
   * url: 打开外部链接，组件有可能是 action 也有可能是 link
   * link: 打开内部链接
   * dialog: action 的弹框
   * drawer: action 的抽出式弹框
   * copy: action 里的复制
   * reload: action 里的 reload
   * email: action 里的 email
   * prev: action 里的 prev
   * next: action 里的 next
   * cancel: action 里的 cancel
   * close: action 里的 close
   * submit: 有可能是 action 里的 submit，也有可能是表单提交
   * confirm: action 里的 confirm
   * add: action 里的 add
   * reset: action 里的 reset
   * reset-and-submit: action 里的 reset-and-submit
   * formItemChange: 表单项内容变化
   * formError: 表单验证失败
   * formSubmit: 表单成功提交，在表单验证成功之后才会触发，这个可能会和 api 重合
   * tabChange: tab 切换
   * netError: api 报错
   */
  eventType:
    | 'api'
    | 'url'
    | 'link'
    | 'dialog'
    | 'drawer'
    | 'copy'
    | 'reload'
    | 'email'
    | 'prev'
    | 'next'
    | 'cancel'
    | 'close'
    | 'submit'
    | 'confirm'
    | 'reset'
    | 'reset-and-submit'
    | 'formItemChange'
    | 'tabChange';

  /**
   * 事件数据
   */
  eventData: ActionSchema | Api;
}
