import {PageSchema} from './renderers/Page';
import {TplSchema} from './renderers/Tpl';
import {RemarkSchema} from './renderers/Remark';
import {ActionSchema} from './renderers/Action';
import {AlertSchema} from './renderers/Alert';
import {AudioSchema} from './renderers/Audio';
import {ButtonGroupSchema} from './renderers/ButtonGroup';
import {ButtonToolbarSchema} from './renderers/Form/ButtonToolbar';
import {CardSchema} from './renderers/Card';
import {CardsSchema} from './renderers/Cards';
import {FormSchema} from './renderers/Form';
import {CalendarSchema} from './renderers/Calendar';
import {CarouselSchema} from './renderers/Carousel';
import {ChartSchema} from './renderers/Chart';
import {CollapseSchema} from './renderers/Collapse';
import {CollapseGroupSchema} from './renderers/CollapseGroup';
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
import {TabsSchema} from './renderers/Tabs';
import {PortletSchema} from './renderers/Portlet';
import {TasksSchema} from './renderers/Tasks';
import {VBoxSchema} from './renderers/VBox';
import {VideoSchema} from './renderers/Video';
import {WizardSchema} from './renderers/Wizard';
import {WrapperSchema} from './renderers/Wrapper';
import {TableSchema} from './renderers/Table';
import {DialogSchema, DialogSchemaBase} from './renderers/Dialog';
import {DrawerSchema} from './renderers/Drawer';
import {SearchBoxSchema} from './renderers/SearchBox';
import {SparkLineSchema} from './renderers/SparkLine';
import {TooltipWrapperSchema} from './renderers/TooltipWrapper';
import {PaginationWrapperSchema} from './renderers/PaginationWrapper';
import {PaginationSchema} from './renderers/Pagination';
import {AnchorNavSchema} from './renderers/AnchorNav';
import {AvatarSchema} from './renderers/Avatar';
import {StepsSchema} from './renderers/Steps';
import {SpinnerSchema} from './renderers/Spinner';
import {TimelineSchema} from './renderers/Timeline';
import {ArrayControlSchema} from './renderers/Form/InputArray';
import {ButtonGroupControlSchema} from './renderers/Form/ButtonGroupSelect';
import {ChainedSelectControlSchema} from './renderers/Form/ChainedSelect';
import {CheckboxControlSchema} from './renderers/Form/Checkbox';
import {CheckboxesControlSchema} from './renderers/Form/Checkboxes';
import {ComboControlSchema} from './renderers/Form/Combo';
import {ConditionBuilderControlSchema} from './renderers/Form/ConditionBuilder';
import {DiffControlSchema} from './renderers/Form/DiffEditor';
import {EditorControlSchema} from './renderers/Form/Editor';
import {FieldSetControlSchema} from './renderers/Form/FieldSet';
import {FormulaControlSchema} from './renderers/Form/Formula';
import {GroupControlSchema} from './renderers/Form/Group';
import {HiddenControlSchema} from './renderers/Form/Hidden';
import {IconPickerControlSchema} from './renderers/Form/IconPicker';
import {InputCityControlSchema} from './renderers/Form/InputCity';
import {InputColorControlSchema} from './renderers/Form/InputColor';
import {
  DateControlSchema,
  DateTimeControlSchema,
  TimeControlSchema,
  MonthControlSchema,
  QuarterControlSchema,
  YearControlSchema
} from './renderers/Form/InputDate';
import {DateRangeControlSchema} from './renderers/Form/InputDateRange';
import {FileControlSchema} from './renderers/Form/InputFile';
import {InputGroupControlSchema} from './renderers/Form/InputGroup';
import {ImageControlSchema} from './renderers/Form/InputImage';
import {MonthRangeControlSchema} from './renderers/Form/InputMonthRange';
import {QuarterRangeControlSchema} from './renderers/Form/InputQuarterRange';
import {NumberControlSchema} from './renderers/Form/InputNumber';
import {RangeControlSchema} from './renderers/Form/InputRange';
import {RatingControlSchema} from './renderers/Form/InputRating';
import {RepeatControlSchema} from './renderers/Form/InputRepeat';
import {RichTextControlSchema} from './renderers/Form/InputRichText';
import {SubFormControlSchema} from './renderers/Form/InputSubForm';
import {TableControlSchema} from './renderers/Form/InputTable';
import {TagControlSchema} from './renderers/Form/InputTag';
import {TextControlSchema} from './renderers/Form/InputText';
import {TreeControlSchema} from './renderers/Form/InputTree';
import {ListControlSchema} from './renderers/Form/ListSelect';
import {LocationControlSchema} from './renderers/Form/LocationPicker';
import {MatrixControlSchema} from './renderers/Form/MatrixCheckboxes';
import {NestedSelectControlSchema} from './renderers/Form/NestedSelect';
import {PickerControlSchema} from './renderers/Form/Picker';
import {RadiosControlSchema} from './renderers/Form/Radios';
import {SelectControlSchema} from './renderers/Form/Select';
import {StaticExactControlSchema} from './renderers/Form/Static';
import {SwitchControlSchema} from './renderers/Form/Switch';
import {TabsTransferControlSchema} from './renderers/Form/TabsTransfer';
import {TextareaControlSchema} from './renderers/Form/Textarea';
import {TransferControlSchema} from './renderers/Form/Transfer';
import {TreeSelectControlSchema} from './renderers/Form/TreeSelect';
import {UUIDControlSchema} from './renderers/Form/UUID';
import {FormControlSchema} from './renderers/Form/Control';
import {TransferPickerControlSchema} from './renderers/Form/TransferPicker';
import {TabsTransferPickerControlSchema} from './renderers/Form/TabsTransferPicker';

// 每加个类型，这补充一下。
export type SchemaType =
  | 'form'
  | 'button'
  | 'submit'
  | 'reset'
  | 'alert'
  | 'app'
  | 'audio'
  | 'avatar'
  | 'button-group'
  | 'button-toolbar'
  | 'breadcrumb'
  | 'card'
  | 'cards'
  | 'carousel'
  | 'chart'
  | 'calendar'
  | 'collapse'
  | 'collapse-group'
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
  | 'spinner'
  | 'divider'
  | 'dropdown-button'
  | 'drawer'
  | 'each'
  | 'flex'
  | 'flex-item'
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
  | 'log'
  | 'static-list' // 这个几个跟表单项同名，再form下面用必须带前缀 static-
  | 'map'
  | 'mapping'
  | 'markdown'
  | 'nav'
  | 'page'
  | 'pagination'
  | 'pagination-wrapper'
  | 'property'
  | 'operation'
  | 'panel'
  | 'plain'
  | 'text'
  | 'progress'
  | 'qrcode'
  | 'qr-code'
  | 'barcode'
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
  | 'wrapper'
  | 'web-component'
  | 'anchor-nav'
  | 'steps'
  | 'timeline'
  | 'control'
  | 'input-array'
  | 'button'
  | 'submit'
  | 'reset'
  | 'button-group-select'
  | 'button-toolbar'
  | 'chained-select'
  | 'chart-radios'
  | 'checkbox'
  | 'checkboxes'
  | 'input-city'
  | 'input-color'
  | 'combo'
  | 'condition-builder'
  | 'container'
  | 'input-date'
  | 'input-datetime'
  | 'input-time'
  | 'input-quarter'
  | 'input-year'
  | 'input-month'
  | 'input-date-range'
  | 'input-time-range'
  | 'input-datetime-range'
  | 'input-excel'
  | 'input-formula'
  | 'diff-editor'

  // editor 系列
  | 'editor'
  | 'bat-editor'
  | 'c-editor'
  | 'coffeescript-editor'
  | 'cpp-editor'
  | 'csharp-editor'
  | 'css-editor'
  | 'dockerfile-editor'
  | 'fsharp-editor'
  | 'go-editor'
  | 'handlebars-editor'
  | 'html-editor'
  | 'ini-editor'
  | 'java-editor'
  | 'javascript-editor'
  | 'json-editor'
  | 'less-editor'
  | 'lua-editor'
  | 'markdown-editor'
  | 'msdax-editor'
  | 'objective-c-editor'
  | 'php-editor'
  | 'plaintext-editor'
  | 'postiats-editor'
  | 'powershell-editor'
  | 'pug-editor'
  | 'python-editor'
  | 'r-editor'
  | 'razor-editor'
  | 'ruby-editor'
  | 'sb-editor'
  | 'scss-editor'
  | 'sol-editor'
  | 'sql-editor'
  | 'swift-editor'
  | 'typescript-editor'
  | 'vb-editor'
  | 'xml-editor'
  | 'yaml-editor'

  //
  | 'fieldset'
  | 'fieldSet'
  | 'input-file'
  | 'formula'
  | 'grid'
  | 'group'
  | 'hbox'
  | 'hidden'
  | 'icon-picker'
  | 'input-image'
  | 'input-group'
  | 'list-select'
  | 'location-picker'
  | 'matrix-checkboxes'
  | 'input-month-range'
  | 'input-quarter-range'
  | 'nested-select'
  | 'input-number'
  | 'panel'
  | 'picker'
  | 'radios'
  | 'input-range'
  | 'input-rating'
  | 'input-repeat'
  | 'input-rich-text'
  | 'select'
  | 'service'
  | 'static'
  | 'input-sub-form'
  | 'switch'
  | 'input-table'
  | 'tabs'
  | 'tabs-transfer'
  | 'input-tag'
  | 'input-text'
  | 'input-password'
  | 'input-email'
  | 'input-url'
  | 'uuid'
  | 'multi-select'
  | 'textarea'
  | 'transfer'
  | 'transfer-picker'
  | 'tabs-transfer-picker'
  | 'input-tree'
  | 'tree-select'
  | 'table-view'
  | 'portlet'
  | 'grid-nav'

  // 原生 input 类型
  | 'native-date'
  | 'native-time'
  | 'native-number'
  | 'code'
  | 'tooltip-wrapper';

export type SchemaObject =
  | PageSchema
  | TplSchema
  | RemarkSchema
  | ActionSchema
  | AlertSchema
  | AudioSchema
  | AvatarSchema
  | ButtonGroupSchema
  | ButtonToolbarSchema
  | CalendarSchema
  | CardSchema
  | CardsSchema
  | CarouselSchema
  | ChartSchema
  | CollapseSchema
  | CollapseGroupSchema
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
  | SpinnerSchema
  | TableSchema
  | TabsSchema
  | TasksSchema
  | VBoxSchema
  | VideoSchema
  | WizardSchema
  | WrapperSchema
  | TooltipWrapperSchema
  | FormSchema
  | AnchorNavSchema
  | StepsSchema
  | PortletSchema
  | TimelineSchema

  // 表单项
  | FormControlSchema
  | ArrayControlSchema
  | ButtonGroupControlSchema
  | ChainedSelectControlSchema
  | CheckboxControlSchema
  | CheckboxesControlSchema
  | InputCityControlSchema
  | InputColorControlSchema
  | ComboControlSchema
  | ConditionBuilderControlSchema
  | DateControlSchema
  | DateTimeControlSchema
  | TimeControlSchema
  | MonthControlSchema
  | MonthControlSchema
  | QuarterControlSchema
  | YearControlSchema
  | DateRangeControlSchema
  | DiffControlSchema
  | EditorControlSchema
  | FieldSetControlSchema
  | FileControlSchema
  | FormulaControlSchema
  | GroupControlSchema
  | HiddenControlSchema
  | IconPickerControlSchema
  | ImageControlSchema
  | InputGroupControlSchema
  | ListControlSchema
  | LocationControlSchema
  | UUIDControlSchema
  | MatrixControlSchema
  | MonthRangeControlSchema
  | QuarterRangeControlSchema
  | NestedSelectControlSchema
  | NumberControlSchema
  | PickerControlSchema
  | RadiosControlSchema
  | RangeControlSchema
  | RatingControlSchema
  | RichTextControlSchema
  | RepeatControlSchema
  | SelectControlSchema
  | SubFormControlSchema
  | SwitchControlSchema
  | StaticExactControlSchema
  | TableControlSchema
  | TabsTransferControlSchema
  | TagControlSchema
  | TextControlSchema
  | TextareaControlSchema
  | TransferControlSchema
  | TransferPickerControlSchema
  | TabsTransferPickerControlSchema
  | TreeControlSchema
  | TreeSelectControlSchema;

export type SchemaCollection =
  | SchemaObject
  | SchemaTpl
  | Array<SchemaObject | SchemaTpl>;

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

// /**
//  * css类名，配置字符串，或者对象。
//  *
//  *   className: "red"
//  *
//  * 用对象配置时意味着你能跟表达式一起搭配使用，如：
//  *
//  *     className: {
//  *         "red": "data.progress > 80",
//  *         "blue": "data.progress > 60"
//  *     }
//  */
// export type SchemaClassName = string;

export interface SchemaApiObject {
  /**
   * API 发送类型
   */
  method?: 'get' | 'post' | 'put' | 'delete' | 'patch' | 'jsonp';

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
  sendOn?: SchemaExpression;

  /**
   * 默认都是追加模式，如果想完全替换把这个配置成 true
   */
  replaceData?: boolean;

  /**
   * 是否自动刷新，当 url 中的取值结果变化时，自动刷新数据。
   *
   * @default true
   */
  autoRefresh?: boolean;

  /**
   * 当开启自动刷新的时候，默认是 api 的 url 来自动跟踪变量变化的。
   * 如果你希望监控 url 外的变量，请配置 traceExpression。
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
  deferApi?: SchemaApi;

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

export interface FeedbackDialog extends DialogSchemaBase {
  /**
   * 可以用来配置 feedback 的出现条件
   */
  visibleOn?: string;

  /**
   * feedback 弹框取消是否中断后续操作
   */
  skipRestOnCancel?: boolean;

  /**
   * feedback 弹框确认是否中断后续操作
   */
  skipRestOnConfirm?: boolean;
}

export type RootSchema = PageSchema;

export interface ToastSchemaBase extends BaseSchema {
  /**
   * 轻提示内容
   */
  items: Array<{
    title?: SchemaCollection;
    body: SchemaCollection;
    level: 'info' | 'success' | 'error' | 'warning';
    id: string;
    position?:
      | 'top-right'
      | 'top-center'
      | 'top-left'
      | 'bottom-center'
      | 'bottom-left'
      | 'bottom-right'
      | 'center';
    closeButton?: boolean;
    showIcon?: boolean;
    timeout?: number;
  }>;

  /**
   * 弹出位置
   */
  position:
    | 'top-right'
    | 'top-center'
    | 'top-left'
    | 'bottom-center'
    | 'bottom-left'
    | 'bottom-right'
    | 'center';

  /**
   * 是否展示关闭按钮
   */
  closeButton: boolean;

  /**
   * 是否展示图标
   */
  showIcon?: boolean;

  /**
   * 持续时间
   */
  timeout: number;
}
