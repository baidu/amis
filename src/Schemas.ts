import {PageSchema} from './renderers/Page';
import {TplSchema} from './renderers/Tpl';
import {RemarkSchema} from './renderers/Remark';
import {ActionSchema} from './renderers/Action';
import {AlertSchema} from './renderers/Alert';
import {AudioSchema} from './renderers/Audio';
import {ButtonGroupSchema} from './renderers/ButtonGroup';
import {ButtonToolbarSchema} from './renderers/ButtonToolbar';
import {CardSchema} from './renderers/Card';
import {CardsSchema} from './renderers/Cards';
import {FormSchema} from './renderers/Form';

// 每加个类型，这补充一下。
export type SchemaType =
  | 'page'
  | 'form'
  | 'tpl'
  | 'html'
  | 'remark'
  | 'button'
  | 'submit'
  | 'reset'
  | 'alert'
  | 'audio'
  | 'button-group'
  | 'button-toolbar'
  | 'card'
  | 'cards';

export type SchemaObject =
  | PageSchema
  | FormSchema
  | TplSchema
  | RemarkSchema
  | ActionSchema
  | AlertSchema
  | AudioSchema
  | ButtonGroupSchema
  | ButtonToolbarSchema
  | CardSchema
  | CardsSchema;

export type SchemaCollection = SchemaObject | Array<SchemaObject> | SchemaTpl;

/**
 * 表达式，语法 `data.xxx > 5`。
 */
export type SchemaExpression = string;

// /**
//  * css类名，配置字符串，或者对象。
//  *
//  *     className: "red"
//  *
//  * 用对象配置时意味着你能跟表达式一起搭配使用，如：
//  *
//  *     className: {
//  *         "red": "data.progress > 80",
//  *         "blue": "data.progress > 60"
//  *     }
//  */
// export type SchemaClassName =
//   | string
//   | {
//       [propName: string]: true | false | null | SchemaExpression;
//     };

/**
 * css类名，字符串格式
 */
export type SchemaClassName = string; // todo 支持上面那种格式。

export interface SchemaApiObject {
  /**
   * API 发送类型
   */
  method?: 'get' | 'post' | 'put' | 'delete' | 'patch';

  /**
   * API 发送目标地址
   */
  url: SchemaUrlPath;

  /**
   * 用来控制携带数据. 当key 为 `&` 值为 `$$` 时, 将所有原始数据打平设置到 data 中. 当值为 $$ 将所有原始数据赋值到对应的 key 中. 当值为 $ 打头时, 将变量值设置到 key 中.
   */
  data?: {
    [propName: string]: any;
  };

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
    [propName: string]: string;
  };

  /**
   * 设置发送条件
   */
  sendOn?: SchemaExpression;

  /**
   * 默认都是追加模式，如果想完全替换把这个配置成 true
   */
  replaceData?: boolean;

  /**
   * 是否自动刷新，当 url 中的取值结果变化时，自动刷新数据。
   */
  autoRefresh?: boolean;

  /**
   * 如果设置了值，同一个接口，相同参数，指定的时间（单位：ms）内请求将直接走缓存。
   */
  cache?: number;

  /**
   * qs 配置项
   */
  qsOptions?: {
    arrayFormat?: 'indices' | 'brackets' | 'repeat' | 'comma';
    indices?: boolean;
    allowDots?: boolean;
  };
}

export type SchemaApi = string | SchemaApiObject;

/**
 * 组件名字，这个名字可以用来定位，用于组件通信
 */
export type SchemaName = string;

/**
 * 配置刷新动作，这个动作通常在完成渲染器本省的固定动作后出发。
 *
 * 一般用来配置目标组件的 name 属性。多个目标可以用逗号隔开。
 *
 * 当目标是 windows 时表示刷新整个页面。
 *
 * 刷新目标的同时还支持传递参数如： `foo?a=${a}&b=${b},boo?c=${c}`
 */
export type SchemaReload = string;

/**
 * 支持两种语法，但是不能混着用。分别是：
 *
 * 1. `${xxx}` 或者 `${xxx|upperCase}`
 * 2. `<%= data.xxx %>`
 *
 *
 * 更多文档：https://baidu.gitee.io/amis/docs/concepts/template
 */
export type SchemaTpl = string;

/**
 * 初始数据，设置得值可用于组件内部模板使用。
 */
export type SchemaDefaultData = {
  [propName: string]: any;
};

/**
 * 用来关联 json schema 的，不用管。
 */
export type SchemaSchema = string;

/**
 * iconfont 里面的类名。
 */
export type SchemaIcon = string;

export type TokenizeableString = string;

export type SchemaUrlPath = TokenizeableString;

export type SchemaTooltip =
  | string
  | {
      /**
       * 标题
       */
      title?: string;

      /**
       * 内容
       */
      content: string;
    };

export interface BaseSchema {
  $schema?: SchemaSchema;
  type: SchemaType;
  className?: SchemaClassName;
}

export {PageSchema};
