/**
 * AMIS 功能表达式，用于功能判断，分以下两种语法：
 *
 * * `${ AMISExpression } ` AMIS 表达式， 推荐使用，更安全，更易读
 * * `JSExpression` 纯 JS 表达式
 */
export type AMISExpression = string;

/**
 * AMISClassName 支持表达式，或者对象形式，key 为 CSS 类名，value 为布尔值或者表达式
 */
export type AMISClassName =
  | string
  | {
      [key: string]: boolean | undefined | null | AMISExpression;
    };

/**
 * 组件名字，可用于组件通信
 */
export type AMISName = string;

/**
 * 表单项组件变量名，用于关联数据，支持层级访问，如：`xxx.yyy` 或者 `xxx[yyy]`
 * 注意：不支持表达式
 */
export type AMISVariableName = string;

/**
 * 通过表达式来获取本地数据，如：`${xxx}`， 支持公式 如：`${TODAY()}`
 */
export type AMISLocalSource = AMISTokenizeableString;

/**
 * 配置刷新动作，这个动作通常在完成渲染器本身的固定动作后触发。
 *
 * 一般用来配置目标组件的 name 属性。多个目标可以用逗号隔开。
 *
 * 当目标是 windows 时表示刷新整个页面。
 *
 * 刷新目标的同时还支持传递参数如： `foo?a=${a}&b=${b},boo?c=${c}`
 */
export type AMISReloadTarget = AMISTokenizeableString;

/**
 * 页面跳转地址，支持相对地址。
 */
export type AMISRedirect = AMISTokenizeableString;

/**
 * AMIS 渲染器基础属性
 */
export interface AMISSchemaBase {
  /**
   * 组件唯一 id，主要用于页面设计器中定位 json 节点, 每次都是临时生成的，不要在代码中使用。
   */
  $$id?: string | undefined;

  /**
   * 组件唯一 id，主要用于组件通信，样式表规则匹配，日志采集。
   */
  id?: string | undefined;

  /**
   * 容器 CSS 类名
   */
  className?: AMISClassName;

  /**
   * 配合 definitions 一起使用，可以实现无限循环的渲染器。
   */
  $ref?: string;

  /**
   * 是否禁用，支持布尔值和表达式二选一写法。
   */
  disabled?: boolean;
  /**
   * 是否禁用的表达式写法，等价于 disabled 字段的表达式用法，可合并判定。
   */
  disabledOn?: AMISExpression;

  /**
   * 是否隐藏，推荐统一用 visible/visibleOn，hidden/hiddenOn 只是兼容旧用法。
   * @deprecated 推荐用 visible/visibleOn
   */
  hidden?: boolean;
  /**
   * 是否隐藏表达式，推荐统一用 visible/visibleOn，hidden/hiddenOn 只是兼容旧用法。
   * @deprecated 推荐用 visible/visibleOn
   */
  hiddenOn?: AMISExpression;

  /**
   * 是否显示，可用布尔值或表达式 visibleOn，合并为一组判定。
   */
  visible?: boolean;
  /**
   * 是否显示表达式，更推荐用 visible/visibleOn 组合，统一控制可见性。
   */
  visibleOn?: AMISExpression;

  /**
   * 是否静态展示，支持布尔值与表达式 staticOn 混合判定。
   */
  static?: boolean;
  /**
   * 是否静态展示表达式，合并 static 字段整体判断。
   */
  staticOn?: AMISExpression;
  /**
   * 静态展示空值占位
   */
  staticPlaceholder?: AMISTemplate;
  /**
   * 静态展示表单项类名
   */
  staticClassName?: AMISClassName;
  /**
   * 静态展示表单项Label类名
   */
  staticLabelClassName?: AMISClassName;
  /**
   * 静态展示表单项Value类名
   */
  staticInputClassName?: AMISClassName;
  staticSchema?: any;

  /**
   * 组件样式
   */
  style?: {
    [propName: string]: any;
  };

  /**
   * 事件动作配置
   */
  onEvent?: {
    [propName: string]: {
      weight?: number; // 权重
      actions: AMISAction[]; // 执行的动作集
      debounce?: AMISDebounceConfig;
      track?: AMISTrackConfig;
    };
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
   * 可以在组件级别用来关闭移动端样式
   */
  useMobileUI?: boolean;
  animations?: AMISAnimations;

  /**
   * 测试 id，用于自动化测试
   */
  testid?: string;
}

export type AMISOperatorType =
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

export type AMISExpressionSimple = string | number | object | undefined;
export type AMISExpressionValue =
  | AMISExpressionSimple
  | {
      type: 'value';
      value: AMISExpressionSimple;
    };
export type AMISExpressionFunc = {
  type: 'func';
  func: string;
  args: Array<AMISExpressionComplex>;
};
export type AMISExpressionField = {
  type: 'field';
  field: string;
};
export type AMISExpressionFormula = {
  type: 'formula';
  value: string;
};

export type AMISExpressionComplex =
  | AMISExpressionValue
  | AMISExpressionFunc
  | AMISExpressionField
  | AMISExpressionFormula;

export interface AMISConditionRule {
  id: any;
  left?: AMISExpressionComplex;
  op?: AMISOperatorType;
  right?: AMISExpressionComplex | Array<AMISExpressionComplex>;
  if?: string;
  disabled?: boolean;
}

export interface AMISConditionGroupValue {
  id: string;
  conjunction: 'and' | 'or';
  not?: boolean;
  children?: Array<AMISConditionRule | AMISConditionGroupValue>;
  if?: string;
  disabled?: boolean;
}

export interface AMISConditionValue extends AMISConditionGroupValue {}

/**
 * 按钮组件，用于触发各种动作。支持点击事件、API调用、页面跳转等操作。
 */
export type AMISButtonSchema = AMISLegacyActionSchema | AMISButton;

/**
 * 可通过以下方式扩展 AMIS 渲染器组件
 *
 * ```ts
 * declare module 'amis-core' {
 *   interface AMISSchemaRegistry {
 *     'my-renderer': MyAMISSchema;
 *   }
 * }
 * ```
 */
export interface AMISSchemaRegistry {
  button: AMISButtonSchema;
  reset: AMISButtonSchema;
  submit: AMISButtonSchema;
}

export type AMISSchema = AMISSchemaRegistry[keyof AMISSchemaRegistry];
export type AMISSchemaType = keyof AMISSchemaRegistry;

/**
 * AMIS 表达式，分两种：
 * * `xxx ${ AMISExpression } ` 内置模版引擎，支持内嵌 AMIS 表达式
 * * `xxx <%- JSExpression %>` Lodash 模版引擎，通过 <% %> 内嵌 JS 表达式
 */
export type AMISTemplate = string;

export type AMISSchemaCollection =
  | AMISSchema
  | AMISTemplate
  | Array<AMISSchema | AMISTemplate>;

/**
 * 支持通过 `${ AMISExpression }` 内嵌表达式的模版字符
 */
export type AMISTokenizeableString = string;

/**
 * URL 路径, 支持通过 `${ AMISExpression }` 内嵌表达式的模版字符
 */
export type AMISUrlPath = AMISTokenizeableString;

/**
 * AMIS icon，支持 svg xml 源码
 */
export type AMISIcon = string;

/**
 * AMIS api 对象配置
 */
export interface AMISApiObject {
  /**
   * API 发送类型
   */
  method?: 'get' | 'post' | 'put' | 'patch' | 'delete' | 'jsonp' | 'js';

  /**
   * API 发送目标地址
   */
  url: AMISUrlPath;

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
   *   b: '123'
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
   * 但是，浏览器还不支持，设置了只是摆设。除非服务端支持 method-override
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
  sendOn?: AMISExpression;

  /**
   * 默认都是追加模式，如果想完全替换把这个配置成 true
   */
  replaceData?: boolean;

  /**
   * 是否将两次返回的数据字段，做一个合并。配置返回对象中的字段名，支持配置多个。
   *
   * 比如：同时返回 log 字段，第一次返回 {log: '1'}，第二次返回 {log: '2'}，合并后的结果是 {log: ['1', '2']}
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
  trackExpression?: AMISExpression;

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

  /**
   * 文件下载时，指定文件名
   */
  downloadFileName?: string;
}

/**
 * AMIS API，支持字符串和对象两种配置方式
 */
export type AMISApi = AMISUrlPath | AMISApiObject;

/**
 * AMIS 选项对象
 */
export interface AMISOption {
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
   * 禁用提示
   */
  disabledTip?: AMISTemplate;

  /**
   * 支持嵌套
   */
  children?: AMISOptions;

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
  description?: AMISTemplate;

  /**
   * 标记后数据延时加载
   */
  defer?: boolean;

  /**
   * 如果设置了，优先级更高，不设置走 source 接口加载。
   */
  deferApi?: AMISApi;

  [propName: string]: any;
}

/**
 * AMIS 选项集合
 */
export interface AMISOptions extends Array<AMISOption> {}

export type AMISTooltip =
  | AMISTemplate
  | {
      /**
       * 标题
       */
      title?: AMISTemplate;

      /**
       * 内容
       */
      content: AMISTemplate;
    };

/**
 * Badge 角标。
 * 文档：https://aisuda.bce.baidu.com/amis/zh-CN/components/badge
 */
export interface AMISBadgeBase {
  className?: AMISClassName;

  /**
   * 文本内容
   */
  text?: AMISTemplate | number;

  /**
   * 大小
   */
  size?: number;

  /**
   * 角标类型
   */
  mode?: 'text' | 'dot' | 'ribbon';

  /**
   * 角标位置，相对于position的位置进行偏移
   */
  offset?: [number | string, number | string];

  /**
   * 角标位置
   */
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';

  /**
   * 封顶的数字值
   */
  overflowCount?: number;

  /**
   * 动态控制是否显示
   */
  visibleOn?: string;

  /**
   * 是否显示动画
   */
  animation?: boolean;

  /**
   * 角标的自定义样式
   */
  style?: {
    [propName: string]: any;
  };

  /**
   * 提示类型
   */
  level?: 'info' | 'warning' | 'success' | 'danger' | string;
}

export interface AMISDialogSchemaBase extends AMISSchemaBase {
  /**
   * 弹窗参数说明，值格式为 JSONSchema。
   */
  inputParams?: any;

  /**
   * 默认不用填写，自动会创建确认和取消按钮。
   */
  actions?: Array<AMISLegacyActionSchema>;

  /**
   * 内容区域
   */
  body?: AMISSchemaCollection;

  /**
   * 配置 Body 容器 className
   */
  bodyClassName?: AMISClassName;

  /**
   * 是否支持按 ESC 关闭 Dialog
   */
  closeOnEsc?: boolean;

  /**
   * 是否支持点击其他区域关闭 Dialog
   */
  closeOnOutside?: boolean;

  name?: AMISName;

  /**
   * Dialog 大小
   */
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'full';

  /**
   * Dialog 高度
   */
  height?: string;

  /**
   * Dialog 宽度
   */
  width?: string;

  /**
   * 请通过配置 title 设置标题
   */
  title?: AMISSchemaCollection;

  header?: AMISSchemaCollection;
  headerClassName?: AMISClassName;

  footer?: AMISSchemaCollection;

  /**
   * 影响自动生成的按钮，如果自己配置了按钮这个配置无效。
   */
  confirm?: boolean;

  /**
   * 是否显示关闭按钮
   */
  showCloseButton?: boolean;

  /**
   * 是否显示错误信息
   */
  showErrorMsg?: boolean;

  /**
   * 是否显示 spinner
   */
  showLoading?: boolean;

  /**
   * 是否显示蒙层
   */
  overlay?: boolean;

  /**
   * 弹框类型 confirm 确认弹框
   */
  dialogType?: 'confirm';

  /**
   * 可拖拽
   */
  draggable?: boolean;

  /**
   * 可全屏
   */
  allowFullscreen?: boolean;

  /**
   * 数据映射
   */
  data?: AMISDefaultData;

  msg?: string;
  confirmText?: AMISTemplate;
  cancelText?: AMISTemplate;
  confirmBtnLevel?: string;
  cancelBtnLevel?: string;
}

/**
 * Drawer 抽出式弹框。
 * 文档：https://aisuda.bce.baidu.com/amis/zh-CN/components/drawer
 */
export interface AMISDrawerSchemaBase extends AMISSchemaBase {
  /**
   * 弹窗参数说明，值格式为 JSONSchema。
   */
  inputParams?: any;

  /**
   * 默认不用填写，自动会创建确认和取消按钮。
   */
  actions?: Array<AMISLegacyActionSchema>;

  /**
   * 内容区域
   */
  body?: AMISSchemaCollection;

  /**
   * 配置 外层 className
   */
  className?: AMISClassName;

  /**
   * 配置 Body 容器 className
   */
  bodyClassName?: AMISClassName;

  /**
   * 配置 头部 容器 className
   */
  headerClassName?: AMISClassName;

  /**
   * 配置 头部 容器 className
   */
  footerClassName?: AMISClassName;

  /**
   * 是否支持按 ESC 关闭 Dialog
   */
  closeOnEsc?: boolean;

  name?: AMISName;

  /**
   * Dialog 大小
   */
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'full';

  /**
   * 请通过配置 title 设置标题
   */
  title?: AMISSchemaCollection;

  /**
   * 从什么位置弹出
   */
  position?: 'left' | 'right' | 'top' | 'bottom';

  /**
   * 是否展示关闭按钮
   * 当值为false时，默认开启closeOnOutside
   */
  showCloseButton?: boolean;

  /**
   * 抽屉的宽度 （当position为left | right时生效）
   */
  width?: number | string;

  /**
   * 抽屉的高度 （当position为top | bottom时生效）
   */
  height?: number | string;

  /**
   * 头部
   */
  header?: AMISSchemaCollection;

  /**
   * 底部
   */
  footer?: AMISSchemaCollection;

  /**
   * 影响自动生成的按钮，如果自己配置了按钮这个配置无效。
   */
  confirm?: boolean;

  /**
   * 是否可以拖动弹窗大小
   */
  resizable?: boolean;

  /**
   * 是否显示蒙层
   */
  overlay?: boolean;

  /**
   * 点击外部的时候是否关闭弹框。
   */
  closeOnOutside?: boolean;

  /**
   * 是否显示错误信息
   */
  showErrorMsg?: boolean;

  /**
   * 数据映射
   */
  data?: {
    [propName: string]: any;
  };
}

export interface AMISPopOverBase {
  /**
   * 类名
   */
  className?: string;

  /**
   * 弹框外层类名
   */
  popOverClassName?: string;

  /**
   * 配置当前行是否启动，要用表达式
   */
  popOverEnableOn?: AMISExpression;

  /**
   * 弹出模式
   */
  mode?: 'dialog' | 'drawer' | 'popOver';

  /**
   * 是弹窗形式的时候有用。
   */
  size?: 'sm' | 'md' | 'lg' | 'xl';

  /**
   * 弹出位置
   */
  position?:
    | 'center'
    | 'left-top'
    | 'left-top-left-top'
    | 'left-top-left-center'
    | 'left-top-left-bottom'
    | 'left-top-center-top'
    | 'left-top-center-center'
    | 'left-top-center-bottom'
    | 'left-top-right-top'
    | 'left-top-right-center'
    | 'left-top-right-bottom'
    | 'right-top'
    | 'right-top-left-top'
    | 'right-top-left-center'
    | 'right-top-left-bottom'
    | 'right-top-center-top'
    | 'right-top-center-center'
    | 'right-top-center-bottom'
    | 'right-top-right-top'
    | 'right-top-right-center'
    | 'right-top-right-bottom'
    | 'left-bottom'
    | 'left-bottom-left-top'
    | 'left-bottom-left-center'
    | 'left-bottom-left-bottom'
    | 'left-bottom-center-top'
    | 'left-bottom-center-center'
    | 'left-bottom-center-bottom'
    | 'left-bottom-right-top'
    | 'left-bottom-right-center'
    | 'left-bottom-right-bottom'
    | 'right-bottom'
    | 'right-bottom-left-top'
    | 'right-bottom-left-center'
    | 'right-bottom-left-bottom'
    | 'right-bottom-center-top'
    | 'right-bottom-center-center'
    | 'right-bottom-center-bottom'
    | 'right-bottom-right-top'
    | 'right-bottom-right-center'
    | 'right-bottom-right-bottom'
    | 'fixed-center'
    | 'fixed-left-top'
    | 'fixed-right-top'
    | 'fixed-left-bottom'
    | 'fixed-right-bottom';

  /**
   * 触发条件，默认是 click
   */
  trigger?: 'click' | 'hover';

  /**
   * 是否显示查看更多的 icon，通常是放大图标。
   */
  showIcon?: boolean;

  /**
   * 偏移量
   */
  offset?: {
    top?: number;
    left?: number;
  };

  /**
   * 标题
   */
  title?: string;

  body?: AMISSchemaCollection;
}

export interface AMISRemarkBase extends AMISSchemaBase {
  label?: string;

  icon?: AMISIcon;

  tooltip?: any; // TODO: 后续替换为 AMISTooltip
  tooltipClassName?: AMISClassName;

  /**
   * 触发规则
   */
  trigger?: Array<'click' | 'hover' | 'focus'>;

  /**
   * 提示标题
   */
  title?: string;

  /**
   * 提示内容
   */
  content?: AMISTemplate;

  /**
   * 显示位置
   */
  placement?: 'top' | 'right' | 'bottom' | 'left';

  /**
   * 点击其他内容时是否关闭弹框信息
   */
  rootClose?: boolean;

  /**
   * icon的形状
   */
  shape?: 'circle' | 'square';
}
export interface AMISButton extends AMISSchemaBase {
  /**
   * 是否为块状展示，默认为内联。
   */
  block?: boolean;

  /**
   * 禁用时的文案提示。
   */
  disabledTip?: string;

  /**
   * 按钮图标， iconfont 的类名
   */
  icon?: AMISIcon;

  /**
   * icon 上的 CSS 类名
   */
  iconClassName?: AMISClassName;

  /**
   * 右侧按钮图标， iconfont 的类名
   */
  rightIcon?: AMISIcon;

  /**
   * 右侧 icon 上的 CSS 类名
   */
  rightIconClassName?: AMISClassName;

  /**
   * loading 上的 CSS 类名
   */
  loadingClassName?: AMISClassName;

  /**
   * 按钮文字
   */
  label?: string;

  /**
   * 按钮样式
   */
  level?:
    | 'info'
    | 'success'
    | 'warning'
    | 'danger'
    | 'link'
    | 'primary'
    | 'dark'
    | 'light'
    | 'secondary';

  /**
   * @deprecated 通过 level 来配置
   */
  primary?: boolean;

  /**
   * 按钮大小
   */
  size?: 'xs' | 'sm' | 'md' | 'lg';

  tooltip?: AMISTooltip;
  tooltipPlacement?: 'top' | 'right' | 'bottom' | 'left';

  /**
   * 指定按钮类型，支持 button、submit或者reset三种类型。
   */
  type: 'action' | 'button' | 'submit' | 'reset';

  /**
   * 提示文字，配置了操作前会要求用户确认。
   */
  confirmText?: string;

  /**
   * 如果按钮在form中，配置此属性会要求用户把指定的字段通过验证后才会触发行为。
   */
  required?: Array<string>;

  /**
   * 激活状态时的样式
   */
  activeLevel?: string;

  /**
   * 激活状态时的类名
   */
  activeClassName?: string;

  /**
   * 如果按钮在弹框中，可以配置这个动作完成后是否关闭弹窗，或者指定关闭目标弹框。
   */
  close?: boolean | string;

  /**
   * 当按钮是批量操作按钮时，默认必须有勾选元素才能点击，如果此属性配置成 false，则没有点选成员也能点击。
   */
  requireSelected?: boolean;

  /**
   * 是否将弹框中数据 merge 到父级作用域。
   */
  mergeData?: boolean;

  /**
   * 可以指定让谁来触发这个动作。
   */
  target?: AMISReloadTarget;

  /**
   * 点击后的禁止倒计时（秒）
   */
  countDown?: number;

  /**
   * 倒计时文字自定义
   */
  countDownTpl?: string;

  /**
   * 角标
   */
  badge?: AMISBadgeBase;

  /**
   * 键盘快捷键
   */
  hotKey?: string;

  /**
   * 是否显示loading效果
   */
  loadingOn?: string;

  /**
   * 是否在动作结束前禁用按钮
   */
  disabledOnAction?: boolean;

  /**
   * 自定义事件处理函数
   */
  onClick?: string | any;

  /**
   * 子内容
   */
  body?: AMISSchemaCollection;

  tabIndex?: string;

  /**
   * 点击后打开的链接地址
   */
  href?: string;

  actionType?: string;
}

/**
 * 传统的带动作的按钮，旧版带动作的按钮
 */
export interface AMISButtonWithAction extends AMISButton {
  actionType?: string;
  reload?: AMISReloadTarget;
  redirect?: AMISUrlPath;
  ignoreConfirm?: boolean;

  /**
   * 是否开启请求隔离, 主要用于隔离联动CRUD, Service的请求
   */
  isolateScope?: boolean;

  data?: any;
}

export interface AMISLegacyAjaxActionButton extends AMISButtonWithAction {
  /**
   * 指定为 ajax 动作。
   */
  actionType: 'ajax';

  /**
   * 请求地址。
   */
  api: AMISApi;

  /**
   * 反馈弹窗。
   */
  feedback?: AMISFeedbackDialog;

  /**
   * 响应类型。
   */
  responseType?: 'json' | 'blob';

  /**
   * 下载文件名。
   */
  downloadFileName?: string;
}

export interface AMISLegacyDialogActionButton extends AMISButtonWithAction {
  /**
   * 指定为 dialog 动作。
   */
  actionType: 'dialog';

  /**
   * 弹窗配置。
   */
  dialog: AMISDialogSchemaBase;

  /**
   * 是否有下一个的表达式，正常可以不用配置，如果想要刷掉某些数据可以配置这个。
   */
  nextCondition?: AMISExpression;
}

export interface AMISLegacyDrawerActionButton extends AMISButtonWithAction {
  /**
   * 指定为 drawer 动作。
   */
  actionType: 'drawer';

  /**
   * 抽屉配置。
   */
  drawer: AMISDrawerSchemaBase;
  /**
   * 是否有下一个的表达式，正常可以不用配置，如果想要刷掉某些数据可以配置这个。
   */
  nextCondition?: AMISExpression;
}

export interface AMISLegacyReloadActionButton extends AMISButtonWithAction {
  /**
   * 指定为 reload 动作。
   */
  actionType: 'reload';

  /**
   * 刷新目标。
   */
  target: AMISReloadTarget;
}

export interface AMISLegacyBehaviorActionButton extends AMISButtonWithAction {
  actionType:
    | 'submit'
    | 'confirm'
    | 'reset-and-submit'
    | 'clear-and-submit'
    | 'reset'
    | 'clear'
    | 'validate'
    | 'close'
    | 'prev'
    | 'next'
    | 'cancel'
    | 'add';
  [propName: string]: any;
}

export interface AMISLegacyLinkActionButton extends AMISButtonWithAction {
  /**
   * 指定为 link 动作。
   */
  actionType: 'link';

  /**
   * 链接地址。
   */
  link?: AMISUrlPath;
}

export interface AMISLegacyUrlActionButton extends AMISButtonWithAction {
  /**
   * 指定为 url 动作。
   */
  actionType: 'url';

  /**
   * 链接地址。
   */
  url?: AMISUrlPath;

  /**
   * 是否在新窗口打开。
   */
  blank?: boolean;
}

export interface AMISLegacyJumpActionButton extends AMISButtonWithAction {
  /**
   * 指定为 jump 动作。
   */
  actionType: 'jump';

  /**
   * 跳转地址。
   */
  to?: AMISUrlPath;
}

export interface AMISLegacyEmailActionButton extends AMISButtonWithAction {
  /**
   * 指定为 email 动作。
   */
  actionType: 'email';

  /**
   * 收件人。
   */
  to?: string;

  /**
   * 抄送人。
   */
  cc?: string;

  /**
   * 密送人。
   */
  bcc?: string;

  /**
   * 主题。
   */
  subject?: AMISTemplate;

  /**
   * 内容。
   */
  body?: AMISTemplate;
}

export interface AMISToastBase extends AMISSchemaBase {
  /**
   * 轻提示内容
   */
  items: Array<{
    title?: AMISTemplate;
    body: AMISSchemaCollection;
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

export interface AMISLegacyToastActionButton extends AMISButtonWithAction {
  /**
   * 指定为 toast 动作。
   */
  actionType: 'toast';

  /**
   * 提示配置。
   */
  toast: AMISToastBase;
}

export interface AMISLegacyCopyActionButton extends AMISButtonWithAction {
  /**
   * 指定为 copy 动作。
   */
  actionType: 'copy';

  /**
   * 内容。
   */
  content?: AMISTemplate;

  /**
   * 复制内容。
   */
  copy?: AMISTemplate;

  /**
   * 复制格式。
   */
  copyFormat?: 'text' | 'html';
}

export interface AMISLegacySaveAsActionButton extends AMISButtonWithAction {
  /**
   * 指定为 saveAs 动作。
   */
  actionType: 'saveAs';

  /**
   * 保存地址。
   */
  api: AMISApi;

  /**
   * 文件名。
   */
  fileName?: string;
}

export interface AMISLegacyDownloadActionButton extends AMISButtonWithAction {
  /**
   * 指定为 download 动作。
   */
  actionType: 'download';

  /**
   * 下载地址。
   */
  api: AMISApi;

  /**
   * 下载文件名。
   */
  downloadFileName?: string;
}

export interface AMISLegacyActionSchemaRegistry {
  'ajax': AMISLegacyAjaxActionButton;
  'dialog': AMISLegacyDialogActionButton;
  'drawer': AMISLegacyDrawerActionButton;
  'reload': AMISLegacyReloadActionButton;
  'submit': AMISLegacyBehaviorActionButton;
  'confirm': AMISLegacyBehaviorActionButton;
  'reset-and-submit': AMISLegacyBehaviorActionButton;
  'clear-and-submit': AMISLegacyBehaviorActionButton;
  'reset': AMISLegacyBehaviorActionButton;
  'clear': AMISLegacyBehaviorActionButton;
  'validate': AMISLegacyBehaviorActionButton;
  'link': AMISLegacyLinkActionButton;
  'url': AMISLegacyUrlActionButton;
  'jump': AMISLegacyJumpActionButton;
  'email': AMISLegacyEmailActionButton;
  'toast': AMISLegacyToastActionButton;
  'copy': AMISLegacyCopyActionButton;
  'saveAs': AMISLegacySaveAsActionButton;
  'close': AMISLegacyBehaviorActionButton;
  'cancel': AMISLegacyBehaviorActionButton;
  'prev': AMISLegacyBehaviorActionButton;
  'next': AMISLegacyBehaviorActionButton;
  'add': AMISLegacyBehaviorActionButton;
  'download': AMISLegacyDownloadActionButton;
}

export type AMISLegacyActionSchema =
  AMISLegacyActionSchemaRegistry[keyof AMISLegacyActionSchemaRegistry];
export type AMISLegacyActionButtonType = keyof AMISLegacyActionSchemaRegistry;

/**
 * AMIS 动作基础属性, 新版事件动作中的动作。
 * 配置在 onEvent 中。
 */
export interface AMISActionBase {
  /**
   * 动作类型 逻辑动作|自定义（脚本支撑）|reload|url|ajax|dialog|drawer 其他扩展的组件动作
   */
  actionType: string;

  /**
   * 事件描述，actionType: broadcast
   */
  description?: string;

  /**
   * 组件ID，用于直接执行指定组件的动作，指定多个组件时使用英文逗号分隔
   */
  componentId?: string;

  /**
   * 组件Name，用于直接执行指定组件的动作，指定多个组件时使用英文逗号分隔
   */
  componentName?: string;

  /**
   * 当执行动作发生错误时，是否忽略并继续执行
   */
  ignoreError?: boolean;

  /**
   * 动作配置，可以配置数据映射。注意：存在schema配置的动作都不能放在args里面，避免数据域不同导致的解析错误问题
   */
  args?: Record<string, any>;

  /**
   * 动作数据参数，可以配置数据映射
   */
  data?: AMISDefaultData;

  /**
   * 参数模式，合并或者覆盖
   */
  dataMergeMode?: 'merge' | 'override';

  /**
   * 输出数据变量名
   */
  outputVar?: string;

  /**
   * 阻止原有组件的动作行为
   */
  preventDefault?: boolean;

  /**
   * 阻止后续的事件处理器执行
   */
  stopPropagation?: boolean;

  /**
   * 执行条件
   */
  expression?: string | AMISConditionGroupValue;

  /**
   * 执行条件，1.9.0废弃
   * @deprecated
   */
  execOn?: string;
}

export interface AMISActionRegistry {
  // 故意留空，通过 Module Augmentation 的方式，扩展这个接口
}

export type AMISAction = AMISActionRegistry[keyof AMISActionRegistry];
export type AMISActionType = keyof AMISActionRegistry;
export type AMISActionCollection = AMISAction | Array<AMISAction>;
export interface AMISDebounceConfig {
  maxWait?: number;
  wait?: number;
  leading?: boolean;
  trailing?: boolean;
}
export interface AMISTrackConfig {
  id: string;
  name: string;
}

/**
 * AMIS 加载效果配置
 */
export interface AMISSpinnerConfig {
  loadingConfig?: {
    root?: string;
    show?: boolean;
  };
}

/**
 * AMIS 默认数据配置, 值部分支持表达式。如：
 *
 * {
 *  a: '${a + b}'
 * }
 *
 * 当 key 为 `&` 时表示写入到顶层输出数据
 * 当值为 `$$` 时表示获取所有输入数据
 * 二者可以结合使用，如：
 *
 * {
 *  '&': '$$',
 *  a: '123',
 *  c: '${b}'
 * }
 *
 * 表示将所有输入数据写入到顶层输出数据，同时扩展 a 和 b 字段, 假如上层数据为 {a: 1, b: 2}，则最终结果为
 *
 * {a: '123', b: 2, c: 2}
 */
export interface AMISDefaultData {
  [propName: string]: any;
}

/**
 * AMIS 动画配置
 */
export interface AMISAnimations {
  enter?: {
    type: string;
    duration?: number;
    delay?: number;
    repeat?: boolean;
    inView?: boolean;
  };
  attention?: {
    type: string;
    duration?: number;
    repeat?: string;
    delay?: number;
  };
  hover?: {
    type: string;
    duration?: number;
    delay?: number;
    repeat?: string;
  };
  exit?: {
    type: string;
    duration?: number;
    delay?: number;
    repeat?: boolean;
    outView?: boolean;
  };
}

export interface AMISDefinitions {
  [propName: string]: AMISSchemaCollection;
}

export type AMISMessageConfig = {
  /**
   * 获取失败时的提示
   */
  fetchFailed?: AMISTemplate;

  /**
   * 获取成功的提示，默认为空。
   */
  fetchSuccess?: AMISTemplate;

  /**
   * 保存失败时的提示。
   */
  saveFailed?: AMISTemplate;

  /**
   * 保存成功时的提示。
   */
  saveSuccess?: AMISTemplate;
};

export type AMISFunction<T extends Function = () => any> = string | T;

export interface AMISFeedbackDialog extends AMISDialogSchemaBase {
  /**
   * 可以用来配置 feedback 的出现条件
   */
  visibleOn?: AMISExpression;

  /**
   * feedback 弹框取消是否中断后续操作
   */
  skipRestOnCancel?: boolean;

  /**
   * feedback 弹框确认是否中断后续操作
   */
  skipRestOnConfirm?: boolean;
}

export interface AMISPageMeta {
  /**
   * 页面标题，影响浏览器窗口展示
   */
  title?: string;

  /**
   * 页面 meta 描述
   */
  description?: string;

  /**
   * 页面图标
   */
  icon?: string;

  /**
   * 路由地址
   */
  routePath?: string;

  /**
   * 是否在菜单中可见, 当页面采用动态路由时设置成 false
   */
  visibleInMenu?: boolean;

  [propName: string]: any;
}
