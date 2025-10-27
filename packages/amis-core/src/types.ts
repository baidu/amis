// https://json-schema.org/draft-07/json-schema-release-notes.html
import type {JSONSchema7} from 'json-schema';
import {ListenerAction} from './actions/Action';
import {debounceConfig, trackConfig} from './utils/renderer-event';
import type {TestIdBuilder, ValidateError} from './utils/helper';
import {AnimationsProps} from './utils/animations';
import {
  AMISOption,
  AMISApiObject,
  AMISClassName,
  AMISSchemaBase,
  AMISOperatorType,
  AMISExpressionValue,
  AMISExpressionSimple,
  AMISExpressionFunc,
  AMISExpressionField,
  AMISExpressionFormula,
  AMISExpressionComplex,
  AMISConditionRule,
  AMISConditionGroupValue,
  AMISConditionValue,
  AMISExpression
} from './schema';

export interface Option extends AMISOption {
  /**
   * 标记正在加载。只有 defer 为 true 时有意义。内部字段不可以外部设置
   */
  loading?: boolean;

  /**
   * 只有设置了 defer 才有意义，内部字段不可以外部设置
   */
  loaded?: boolean;
}
export interface Options extends Array<Option> {}
export type OptionValue = string | number | null | undefined | Option;

export interface BaseApiObject extends AMISApiObject {}

export type BaseApi = BaseApiObject | string;

export type ClassName = AMISClassName;

export type RequestAdaptor = (
  api: ApiObject,
  context: any
) => ApiObject | Promise<ApiObject>;

export type ResponseAdaptor = (
  payload: object,
  response: fetcherResult,
  api: ApiObject,
  context: any
) => any;

export interface ApiObject extends BaseApiObject {
  config?: {
    withCredentials?: boolean;
    cancelExecutor?: (cancel: Function) => void;
  };
  originUrl?: string; // 原始的 url 地址，记录将 data 拼接到 query 之前的地址
  jsonql?: any;
  graphql?: string;
  operationName?: string;
  body?: PlainObject;
  query?: PlainObject;
  mockResponse?: {
    status: number;
    data?: any;
    delay?: number;
  };
  adaptor?: ResponseAdaptor;
  requestAdaptor?: RequestAdaptor;
  /**
   * api 发送上下文，可以用来传递一些数据给 api 的 adaptor
   * @readonly
   */
  context?: any;
  /** 是否过滤为空字符串的 query 参数 */
  filterEmptyQuery?: boolean;
  downloadFileName?: string;
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
  headers?: object;
}

export interface fetchOptions {
  method?: 'get' | 'post' | 'put' | 'patch' | 'delete' | 'jsonp' | 'js';
  successMessage?: string;
  errorMessage?: string;
  autoAppend?: boolean;
  beforeSend?: (data: any) => any;
  onSuccess?: (json: Payload, data: any) => any;
  onFailed?: (json: Payload) => any;
  silent?: boolean;
  [propName: string]: any;
}

export interface Payload {
  ok: boolean;
  msg: string;
  defaultMsg?: string;
  msgTimeout?: number;
  data: any;
  status: number;
  errors?: {
    [propName: string]: string;
  };
}

export interface Schema extends AMISSchemaBase {
  children?: JSX.Element | ((props: any, schema?: any) => JSX.Element) | null;
  component?: React.ElementType & {
    wrapedAsFormItem?: any;
  };
  [propName: string]: any;
}

export interface ButtonObject {
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
export interface ActionObject extends ButtonObject {
  actionType?:
    | 'submit'
    | 'copy'
    | 'reload'
    | 'ajax'
    | 'saveAs'
    | 'dialog'
    | 'drawer'
    | 'confirmDialog'
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
    | 'validate'
    | 'reset-and-submit'
    | 'clear'
    | 'clear-and-submit'
    | 'toast'
    | 'goto-step'
    | 'goto-image'
    | 'expand'
    | 'collapse'
    | 'step-submit'
    | 'select'
    | 'selectAll'
    | 'clearAll'
    | 'changeTabKey'
    | 'clearSearch'
    | 'submitQuickEdit'
    | 'initDrag'
    | 'cancelDrag'
    | 'toggleExpanded'
    | 'setExpanded'
    | 'clearError';

  api?: BaseApi;
  asyncApi?: BaseApi;
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

export interface DataChangeReason {
  type:
    | 'input' // 用户输入
    | 'api' // api 接口返回触发
    | 'formula' // 公式计算触发
    | 'hide' // 隐藏属性变化触发
    | 'init' // 表单项初始化触发
    | 'action'; // 事件动作触发

  // 变化的字段名
  // 如果是整体变化，那么是 undefined
  name?: string;

  // 变化的值
  value?: any;
}

export interface RendererData {
  [propsName: string]: any;
  /**
   * 记录变化前的数据
   */
  __prev?: RendererDataAlias;

  /**
   * 记录变化的信息
   */
  __changeReason?: DataChangeReason;

  /**
   * 记录上层数据
   */
  __super?: RendererData;
}
type RendererDataAlias = RendererData;

export type FunctionPropertyNames<T> = {
  [K in keyof T]: T[K] extends Function ? K : never;
}[keyof T];

// 先只支持 JSONSchema draft07 好了

export type JSONSchema = JSONSchema7 & {
  group?: string; // 分组
  typeLabel?: string; // 类型说明
  rawType?: string; // 类型
};

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
    | 'tabChange'
    | 'pageLoaded'
    | 'pageHidden'
    | 'pageVisible'
    | string;

  /**
   * 事件数据
   */
  eventData?: PlainObject | Api;
}

export type ToastLevel = 'info' | 'success' | 'error' | 'warning';
export type ToastConf = {
  position?:
    | 'top-right'
    | 'top-center'
    | 'top-left'
    | 'bottom-center'
    | 'bottom-left'
    | 'bottom-right'
    | 'center';
  closeButton: boolean;
  showIcon?: boolean;
  timeout?: number;
  errorTimeout?: number;
  className?: string;
  items?: Array<any>;
  useMobileUI?: boolean;
  validateError?: ValidateError;
};

export interface OptionProps {
  className?: string;
  multi?: boolean;
  multiple?: boolean;
  valueField?: string;
  labelField?: string;
  simpleValue?: boolean; // 默认onChange 出去是整个 option 节点，如果配置了 simpleValue 就只包含值。
  options: Options;
  loading?: boolean;
  joinValues?: boolean;
  extractValue?: boolean;
  delimiter?: string;
  clearable?: boolean;
  resetValue: any;
  placeholder?: string;
  disabled?: boolean;
  creatable?: boolean;
  pathSeparator?: string;
  hasError?: boolean;
  block?: boolean;
  onAdd?: (
    idx?: number | Array<number>,
    value?: any,
    skipForm?: boolean
  ) => void;
  editable?: boolean;
  onEdit?: (value: Option, origin?: Option, skipForm?: boolean) => void;
  removable?: boolean;
  onDelete?: (value: Option) => void;
}

export type LinkItem = LinkItemProps;
interface LinkItemProps {
  id?: number;
  label: string;
  hidden?: boolean;
  open?: boolean;
  active?: boolean;
  className?: string;
  children?: Array<LinkItem>;
  path?: string;
  icon?: string;
  component?: React.ElementType;
}

export interface NavigationObject {
  label: string;
  children?: Array<LinkItem>;
  prefix?: JSX.Element;
  affix?: JSX.Element;
  className?: string;
  [propName: string]: any;
}

export type SchemaExpression = AMISExpression;
export type SchemaClassName = AMISClassName;
export type BaseSchemaWithoutType = AMISSchemaBase;
export type OperatorType = AMISOperatorType;
export type ExpressionSimple = AMISExpressionSimple;
export type ExpressionValue = AMISExpressionValue;
export type ExpressionFunc = AMISExpressionFunc;
export type ExpressionField = AMISExpressionField;
export type ExpressionFormula = AMISExpressionFormula;
export type ExpressionComplex = AMISExpressionComplex;
export type ConditionRule = AMISConditionRule;
export type ConditionGroupValue = AMISConditionGroupValue;
export type ConditionValue = AMISConditionValue;
