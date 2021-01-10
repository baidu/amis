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
import {CarouselSchema} from './renderers/Carousel';
import {ChartSchema} from './renderers/Chart';
import {CollapseSchema} from './renderers/Collapse';
import {ColorSchema} from './renderers/Color';
import {ContainerSchema} from './renderers/Container';
import {CRUDSchema} from './renderers/CRUD';
import {DateSchema} from './renderers/Date';
import {DividerSchema} from './renderers/Divider';
import {DropdownButtonSchema} from './renderers/DropDownButton';
import {EachSchema} from './renderers/Each';
import {GridSchema} from './renderers/Grid';
import {Grid2DSchema} from './renderers/Grid2D';
import {HBoxSchema} from './renderers/HBox';
import {IconSchema} from './renderers/Icon';
import {IFrameSchema} from './renderers/IFrame';
import {ImageSchema} from './renderers/Image';
import {ImagesSchema} from './renderers/Images';
import {JsonSchema} from './renderers/Json';
import {LinkSchema} from './renderers/Link';
import {ListSchema} from './renderers/List';
import {MappingSchema} from './renderers/Mapping';
import {NavSchema} from './renderers/Nav';
import {OperationSchema} from './renderers/Operation';
import {PanelSchema} from './renderers/Panel';
import {PlainSchema} from './renderers/Plain';
import {ProgressSchema} from './renderers/Progress';
import {QRCodeSchema} from './renderers/QRCode';
import {ServiceSchema} from './renderers/Service';
import {StatusSchema} from './renderers/Status';
import {SwitchSchema} from './renderers/Switch';
import {TabsSchema} from './renderers/Tabs';
import {TasksSchema} from './renderers/Tasks';
import {VBoxSchema} from './renderers/VBox';
import {VideoSchema} from './renderers/Video';
import {WizardSchema} from './renderers/Wizard';
import {WrapperSchema} from './renderers/Wrapper';
import {TableSchema} from './renderers/Table';
import {DialogSchema} from './renderers/Dialog';
import {DrawerSchema} from './renderers/Drawer';
import {SearchBoxSchema} from './renderers/SearchBox';
import {SparkLineSchema} from './renderers/SparkLine';
import {PaginationWrapperSchema} from './renderers/PaginationWrapper';
import {PaginationSchema} from './renderers/Pagination';

// 每加个类型，这补充一下。
export type SchemaType =
  | 'form'
  | 'button'
  | 'submit'
  | 'reset'
  | 'alert'
  | 'app'
  | 'audio'
  | 'button-group'
  | 'button-toolbar'
  | 'card'
  | 'cards'
  | 'carousel'
  | 'chart'
  | 'collapse'
  | 'color'
  | 'container'
  | 'crud'
  | 'custom'
  | 'date'
  | 'static-date' // 这个几个跟表单项同名，再form下面用必须带前缀 static-
  | 'datetime'
  | 'static-datetime' // 这个几个跟表单项同名，再form下面用必须带前缀 static-
  | 'time'
  | 'static-time' // 这个几个跟表单项同名，再form下面用必须带前缀 static-
  | 'month'
  | 'static-month' // 这个几个跟表单项同名，再form下面用必须带前缀 static-
  | 'dialog'
  | 'divider'
  | 'dropdown-button'
  | 'drawer'
  | 'each'
  | 'grid'
  | 'grid-2d'
  | 'hbox'
  | 'icon'
  | 'iframe'
  | 'image'
  | 'static-image' // 这个几个跟表单项同名，再form下面用必须带前缀 static-
  | 'images'
  | 'static-images' // 这个几个跟表单项同名，再form下面用必须带前缀 static-
  | 'json'
  | 'static-json' // 这个几个跟表单项同名，再form下面用必须带前缀 static-
  | 'link'
  | 'list'
  | 'static-list' // 这个几个跟表单项同名，再form下面用必须带前缀 static-
  | 'map'
  | 'mapping'
  | 'nav'
  | 'page'
  | 'pagination'
  | 'pagination-wrapper'
  | 'operation'
  | 'panel'
  | 'plain'
  | 'text'
  | 'progress'
  | 'qrcode'
  | 'qr-code'
  | 'remark'
  | 'search-box'
  | 'service'
  | 'sparkline'
  | 'status'
  | 'switch'
  | 'table'
  | 'static-table' // 这个几个跟表单项同名，再form下面用必须带前缀 static-
  | 'tabs'
  | 'html'
  | 'tpl'
  | 'tasks'
  | 'vbox'
  | 'video'
  | 'wizard'
  | 'wrapper';

export type SchemaObject =
  | PageSchema
  | TplSchema
  | RemarkSchema
  | ActionSchema
  | AlertSchema
  | AudioSchema
  | ButtonGroupSchema
  | ButtonToolbarSchema
  | CardSchema
  | CardsSchema
  | CarouselSchema
  | ChartSchema
  | CollapseSchema
  | ColorSchema
  | ContainerSchema
  | CRUDSchema
  | DateSchema
  | DialogSchema
  | DividerSchema
  | DrawerSchema
  | DropdownButtonSchema
  | EachSchema
  | GridSchema
  | Grid2DSchema
  | HBoxSchema
  | IconSchema
  | IFrameSchema
  | ImageSchema
  | ImagesSchema
  | JsonSchema
  | LinkSchema
  | ListSchema
  | MappingSchema
  | NavSchema
  | OperationSchema
  | PaginationSchema
  | PaginationWrapperSchema
  | PanelSchema
  | PlainSchema
  | ProgressSchema
  | QRCodeSchema
  | SearchBoxSchema
  | ServiceSchema
  | SparkLineSchema
  | StatusSchema
  | SwitchSchema
  | TableSchema
  | TabsSchema
  | TasksSchema
  | VBoxSchema
  | VideoSchema
  | WizardSchema
  | WrapperSchema
  | FormSchema;

export type SchemaCollection =
  | SchemaObject
  | SchemaTpl
  | Array<SchemaObject | SchemaTpl>;

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
   * 如果 method 为 get 的接口，设置了 data 信息。
   * 默认 data 会自动附带在 query 里面发送给后端。
   *
   * 如果想通过 body 发送给后端，那么请把这个配置成 false。
   *
   * 但是，浏览器还不支持啊，设置了只是摆设。
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
 * 页面跳转地址，支持相对地址。
 */
export type SchemaRedirect = string;

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

export type SchemaTokenizeableString = string;

export type SchemaUrlPath = SchemaTokenizeableString;

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

/**
 * 消息文案配置，记住这个优先级是最低的，如果你的接口返回了 msg，接口返回的优先。
 */
export type SchemaMessage = {
  /**
   * 获取失败时的提示
   */
  fetchFailed?: string;

  /**
   * 获取成功的提示，默认为空。
   */
  fetchSuccess?: string;

  /**
   * 保存失败时的提示。
   */
  saveFailed?: string;

  /**
   * 保存成功时的提示。
   */
  saveSuccess?: string;
};

export type SchemaFunction = string | Function;

export interface BaseSchema {
  type: SchemaType;

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
}

export {PageSchema};
