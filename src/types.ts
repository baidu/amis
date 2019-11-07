export interface ApiObject {
  url: string;
  method: 'get' | 'post' | 'put' | 'patch' | 'delete';
  data?: object;
  headers?: PlainObject;
  config?: {
    withCredentials?: boolean;
    cancelExecutor?: (cancel: Function) => void;
  };
  reload?: string;
  sendOn?: string;
  adaptor?: (payload: object, response: fetcherResult, api: ApiObject) => any;
  requestAdaptor?: (api: ApiObject) => ApiObject;
  cache?: number;
  qsOptions?: any;
  dataType?: 'json' | 'form-data' | 'form';
}
export type ApiString = string;
export type Api = ApiString | ApiObject;

export interface fetcherResult {
  data?: {
    data: object;
    status: number;
    msg: string;
    errors?: {
      [propName: string]: string;
    };
  };
  status: number;
  headers: object;
}

export interface fetchOptions {
  method?: 'get' | 'post' | 'put' | 'patch' | 'delete';
  successMessage?: string;
  errorMessage?: string;
  autoAppend?: boolean;
  beforeSend?: (data: any) => any;
  onSuccess?: (json: Payload) => any;
  silent?: boolean;
  [propName: string]: any;
}

export interface Payload {
  ok: boolean;
  msg: string;
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

export type SchemaNode = number | string | Schema | SchemaArray;
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
    | 'close'
    | 'confirm'
    | 'add'
    | 'remove'
    | 'delete'
    | 'edit'
    | 'cancel'
    | 'close'
    | 'next'
    | 'prev';
  api?: Api;
  asyncApi?: Api;
  payload?: any;
  dialog?: SchemaNode;
  to?: string;
  target?: string;
  link?: string;
  url?: string;
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
  __prev?: RendererDataAlis;
  __super?: RendererData;
}
type RendererDataAlis = RendererData;

export type FunctionPropertyNames<T> = {
  [K in keyof T]: T[K] extends Function ? K : never
}[keyof T];

export interface JSONSchema {
  [propsName: string]: any;
}

export type Omit<T, K extends keyof T & any> = Pick<T, Exclude<keyof T, K>>;
export type Override<M, N> = Omit<M, Extract<keyof M, keyof N>> & N;
export type ExtractProps<
  TComponentOrTProps
> = TComponentOrTProps extends React.ComponentType<infer P> ? P : never;
