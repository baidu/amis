// https://json-schema.org/draft-07/json-schema-release-notes.html
import type {JSONSchema7} from 'json-schema';
import {ListenerAction} from './actions/Action';
import {debounceConfig, trackConfig} from './utils/renderer-event';
import type {TestIdBuilder, ValidateError} from './utils/helper';
import {AnimationsProps} from './utils/animations';

export interface Option {
  /**
   * 用来显示的文字
   */
  label?: string;

  /**
   * 可以用来给 Option 标记个范围，让数据展示更清晰。
   *
   * 这个只有在数值展示的时候显示。
   */
  scopeLabel?: string;

  /**
   * 请保证数值唯一，多个选项值一致会认为是同一个选项。
   */
  value?: any;

  /**
   * 是否禁用
   */
  disabled?: boolean;

  /**
   * 支持嵌套
   */
  children?: Options;

  /**
   * 是否可见
   */
  visible?: boolean;

  /**
   * 最好不要用！因为有 visible 就够了。
   *
   * @deprecated 用 visible
   */
  hidden?: boolean;

  /**
   * 描述，部分控件支持
   */
  description?: string;

  /**
   * 标记后数据延时加载
   */
  defer?: boolean;

  /**
   * 如果设置了，优先级更高，不设置走 source 接口加载。
   */
  deferApi?: BaseApiObject | string;

  /**
   * 标记正在加载。只有 defer 为 true 时有意义。内部字段不可以外部设置
   */
  loading?: boolean;

  /**
   * 只有设置了 defer 才有意义，内部字段不可以外部设置
   */
  loaded?: boolean;

  [propName: string]: any;
}
export interface Options extends Array<Option> {}
export type OptionValue = string | number | null | undefined | Option;

export interface BaseApiObject {
  /**
   * API 发送类型
   */
  method?: 'get' | 'post' | 'put' | 'delete' | 'patch' | 'jsonp' | 'js';

  /**
   * API 发送目标地址
   */
  url: string;

  /**
   * 用来控制携带数据. 当key 为 `&` 值为 `$$` 时, 将所有原始数据打平设置到 data 中. 当值为 $$ 将所有原始数据赋值到对应的 key 中. 当值为 $ 打头时, 将变量值设置到 key 中.
   */
  data?: {
    [propName: string]: any;
  };

  /**
   * 默认数据映射中的key如果带点，或者带大括号，会转成对象比如：
   *
   * {
   *   'a.b': '123'
   * }
   *
   * 经过数据映射后变成
   * {
   *  a: {
   *   b: '123
   *  }
   * }
   *
   * 如果想要关闭此功能，请设置 convertKeyToPath 为 false
   */
  convertKeyToPath?: boolean;

  /**
   * 用来做接口返回的数据映射。
   */
  responseData?: {
    [propName: string]: any;
  };

  /**
   * 如果 method 为 get 的接口，设置了 data 信息。
   * 默认 data 会自动附带在 query 里面发送给后端。
   *
   * 如果想通过 body 发送给后端，那么请把这个配置成 false。
   *
   * 但是，浏览器还不支持啊，设置了只是摆设。除非服务端支持 method-override
   */
  attachDataToQuery?: boolean;

  /**
   * 发送体的格式
   */
  dataType?: 'json' | 'form-data' | 'form';

  /**
   * 如果是文件下载接口，请配置这个。
   */
  responseType?: 'blob';

  /**
   * 携带 headers，用法和 data 一样，可以用变量。
   */
  headers?: {
    [propName: string]: string | number;
  };

  /**
   * 设置发送条件
   */
  sendOn?: string;

  /**
   * 默认都是追加模式，如果想完全替换把这个配置成 true
   */
  replaceData?: boolean;

  /**
   * 是否将两次返回的数据字段，做一个合并。配置返回对象中的字段名，支持配置多个。
   *
   * 比如：同时返回 log 字段，第一次返回 {log: '1'}，第二次返回 {log: '2'}，合并后的结果是 {log: ['1', '2']]}
   * 再比如：同时返回 items 字段，第一次返回 {items: [1, 2]}，第二次返回 {items: [3, 4]}，合并后的结果是 {items: [1, 2, 3, 4]}
   */
  concatDataFields?: string | Array<string>;

  /**
   * 是否自动刷新，当 url 中的取值结果变化时，自动刷新数据。
   *
   * @default true
   */
  autoRefresh?: boolean;

  /**
   * 当开启自动刷新的时候，默认是 api 的 url 来自动跟踪变量变化的。
   * 如果你希望监控 url 外的变量，请配置 trackExpression。
   */
  trackExpression?: string;

  /**
   * 如果设置了值，同一个接口，相同参数，指定的时间（单位：ms）内请求将直接走缓存。
   */
  cache?: number;

  /**
   * 强制将数据附加在 query，默认只有 api 地址中没有用变量的时候 crud 查询接口才会
   * 自动附加数据到 query 部分，如果想强制附加请设置这个属性。
   * 对于那种临时加了个变量但是又不想全部参数写一遍的时候配置很有用。
   */
  forceAppendDataToQuery?: boolean;

  /**
   * qs 配置项
   */
  qsOptions?: {
    arrayFormat?: 'indices' | 'brackets' | 'repeat' | 'comma';
    indices?: boolean;
    allowDots?: boolean;
  };

  /**
   * autoFill 是否显示自动填充错误提示
   */
  silent?: boolean;

  /**
   * 提示信息
   */
  messages?: {
    success?: string;
    failed?: string;
  };
}

export type ClassName =
  | string
  | {
      [propName: string]: boolean | undefined | null | string;
    };

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

export interface Schema {
  type: string;
  detectField?: string;
  visibleOn?: string;
  hiddenOn?: string;
  disabledOn?: string;
  staticOn?: string;
  visible?: boolean;
  hidden?: boolean;
  disabled?: boolean;
  static?: boolean;
  children?: JSX.Element | ((props: any, schema?: any) => JSX.Element) | null;
  definitions?: Definitions;
  animations?: AnimationsProps;
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

  api?: BaseApiObject | string;
  asyncApi?: BaseApiObject | string;
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

/**
 * 表达式，语法 `data.xxx > 5`。
 */
export type SchemaExpression = string;

/**
 * css类名，配置字符串，或者对象。
 *
 *     className: "red"
 *
 * 用对象配置时意味着你能跟表达式一起搭配使用，如：
 *
 *     className: {
 *         "red": "data.progress > 80",
 *         "blue": "data.progress > 60"
 *     }
 */
export type SchemaClassName =
  | string
  | {
      [propName: string]: boolean | undefined | null | SchemaExpression;
    };
export interface BaseSchemaWithoutType {
  /**
   * 组件唯一 id，主要用于页面设计器中定位 json 节点
   */
  $$id?: string;
  /**
   * 容器 css 类名
   */
  className?: SchemaClassName;

  /**
   * 配合 definitions 一起使用，可以实现无限循环的渲染器。
   */
  $ref?: string;

  /**
   * 是否禁用
   */
  disabled?: boolean;

  /**
   * 是否禁用表达式
   */
  disabledOn?: SchemaExpression;

  /**
   * 是否隐藏
   * @deprecated 推荐用 visible
   */
  hidden?: boolean;

  /**
   * 是否隐藏表达式
   * @deprecated 推荐用 visibleOn
   */
  hiddenOn?: SchemaExpression;

  /**
   * 是否显示
   */

  visible?: boolean;

  /**
   * 是否显示表达式
   */
  visibleOn?: SchemaExpression;

  /**
   * 组件唯一 id，主要用于日志采集
   */
  id?: string;

  /**
   * 事件动作配置
   */
  onEvent?: {
    [propName: string]: {
      weight?: number; // 权重
      actions: ListenerAction[]; // 执行的动作集
      debounce?: debounceConfig;
      track?: trackConfig;
    };
  };
  /**
   * 是否静态展示
   */
  static?: boolean;
  /**
   * 是否静态展示表达式
   */
  staticOn?: SchemaExpression;
  /**
   * 静态展示空值占位
   */
  staticPlaceholder?: string;
  /**
   * 静态展示表单项类名
   */
  staticClassName?: SchemaClassName;
  /**
   * 静态展示表单项Label类名
   */
  staticLabelClassName?: SchemaClassName;
  /**
   * 静态展示表单项Value类名
   */
  staticInputClassName?: SchemaClassName;
  staticSchema?: any;

  /**
   * 组件样式
   */
  style?: {
    [propName: string]: any;
  };

  /**
   * 编辑器配置，运行时可以忽略
   */
  editorSetting?: {
    /**
     * 组件行为、用途，如 create、update、remove
     */
    behavior?: string;

    /**
     * 组件名称，通常是业务名称方便定位
     */
    displayName?: string;

    /**
     * 编辑器假数据，方便展示
     */
    mock?: any;

    [propName: string]: any;
  };

  /**
   * 可以组件级别用来关闭移动端样式
   */
  useMobileUI?: boolean;

  testIdBuilder?: TestIdBuilder;
}

export type OperatorType =
  | 'equal'
  | 'not_equal'
  | 'is_empty'
  | 'is_not_empty'
  | 'like'
  | 'not_like'
  | 'starts_with'
  | 'ends_with'
  | 'less'
  | 'less_or_equal'
  | 'greater'
  | 'greater_or_equal'
  | 'between'
  | 'not_between'
  | 'select_equals'
  | 'select_not_equals'
  | 'select_any_in'
  | 'select_not_any_in'
  | {
      label: string;
      value: string;
    };

export type ExpressionSimple = string | number | object | undefined;
export type ExpressionValue =
  | ExpressionSimple
  | {
      type: 'value';
      value: ExpressionSimple;
    };
export type ExpressionFunc = {
  type: 'func';
  func: string;
  args: Array<ExpressionComplex>;
};
export type ExpressionField = {
  type: 'field';
  field: string;
};
export type ExpressionFormula = {
  type: 'formula';
  value: string;
};

export type ExpressionComplex =
  | ExpressionValue
  | ExpressionFunc
  | ExpressionField
  | ExpressionFormula;

export interface ConditionRule {
  id: any;
  left?: ExpressionComplex;
  op?: OperatorType;
  right?: ExpressionComplex | Array<ExpressionComplex>;
  if?: string;
}

export interface ConditionGroupValue {
  id: string;
  conjunction: 'and' | 'or';
  not?: boolean;
  children?: Array<ConditionRule | ConditionGroupValue>;
  if?: string;
}

export interface ConditionValue extends ConditionGroupValue {}
