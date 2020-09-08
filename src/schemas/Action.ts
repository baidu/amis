import {
  SchemaClassName,
  SchemaExpression,
  SchemaApi,
  SchemaReload,
  SchemaTpl,
  SchemaIcon,
  BaseSchema,
  SchemaTooltip
} from './Schema';

export interface ButtonSchema extends BaseSchema {
  /**
   * 是否为块状展示，默认为内联。
   */
  block?: boolean;

  /**
   * 是否禁用
   */
  disabled?: boolean;

  /**
   * 是否禁用表达式
   */
  disabledOn?: SchemaExpression;

  /**
   * 禁用时的文案提示。
   */
  disabledTip?: string;

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
   * 按钮图标， iconfont 的类名
   */
  icon?: SchemaIcon;

  /**
   * icon 上的css 类名
   */
  iconClassName?: SchemaClassName;

  /**
   * 按钮文字
   */
  label?: string;

  /**
   * 按钮样式
   */
  level?: 'info' | 'success' | 'warning' | 'danger' | 'link' | 'primary';

  /**
   * @deprecated 通过 level 来配置
   */
  primary?: boolean;

  /**
   * 按钮大小
   */
  size?: 'xs' | 'sm' | 'md' | 'lg';

  tooltip?: SchemaTooltip;
  tooltipPlacement?: 'top' | 'right' | 'bottom' | 'left';

  /**
   * 指定按钮类型，支持 button、submit或者reset三种类型。
   */
  type: 'button' | 'submit' | 'reset';

  /**
   * 是否显示
   */

  visible?: boolean;

  /**
   * 是否显示表达式
   */
  visibleOn?: SchemaExpression;

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
  activeClassName: string;

  /**
   * 如果按钮在弹框中，可以配置这个动作完成后是否关闭弹窗，或者指定关闭目标弹框。
   */
  close?: boolean | string;

  /**
   * 当按钮时批量操作按钮时，默认必须有勾选元素才能可点击，如果此属性配置成 false，则没有点选成员也能点击。
   */
  requireSelected?: boolean;
}

export interface AjaxActionSchema extends ButtonSchema {
  /**
   * 指定为发送 ajax 的行为。
   */
  actionType: 'ajax';

  /**
   * 配置 ajax 发送地址
   */
  api: SchemaApi;

  // todo
  feedback?: any;

  reload?: SchemaReload;
  redirect?: string;
}

export interface UrlActionSchema extends ButtonSchema {
  /**
   * 指定为打开链接
   */
  actionType: 'url';

  /**
   * 是否新窗口打开
   */
  blank?: boolean;

  /**
   * 打开的目标地址
   */
  url: string;
}

export interface DialogActionSchema extends ButtonSchema {
  /**
   * 指定为打开弹窗
   */
  actionType: 'dialog';

  // todo
  dialog: any;

  /**
   * 是否有下一个的表达式，正常可以不用配置，如果想要刷掉某些数据可以配置这个。
   */
  nextCondition?: SchemaExpression;
  reload?: SchemaReload;
  redirect?: string;
}

export interface DrawerActionSchema extends ButtonSchema {
  /**
   * 指定为打开弹窗，抽出式弹窗
   */
  actionType: 'drawer';
  // todo
  drawer: any;

  /**
   * 是否有下一个的表达式，正常可以不用配置，如果想要刷掉某些数据可以配置这个。
   */
  nextCondition?: SchemaExpression;
  reload?: SchemaReload;
  redirect?: string;
}

export interface CopyActionSchema extends ButtonSchema {
  /**
   * 指定为复制内容行为
   */
  actionType: 'copy';

  /**
   * 复制啥内容由此配置，支持模板语法。
   */
  copy: SchemaTpl;
}

export interface LinkActionSchema extends ButtonSchema {
  /**
   * 指定为打开链接行为，跟 url 不同的时这个行为为单页模式。
   */
  actionType: 'link';

  /**
   * 跳转到哪？支持配置相对路径。
   */
  link: string;
}

export interface ReloadActionSchema extends ButtonSchema {
  /**
   * 指定为刷新目标组件。
   */
  actionType: 'reload';

  /**
   * 指定目标组件。
   */
  target: SchemaReload;
}

export interface OtherActionSchema extends ButtonSchema {
  actionType: 'prev' | 'next' | 'cancel' | 'close' | 'submit' | 'confirm';
  [propName: string]: any;
}

export type ActionSchema =
  | AjaxActionSchema
  | UrlActionSchema
  | LinkActionSchema
  | DialogActionSchema
  | DrawerActionSchema
  | CopyActionSchema
  | ReloadActionSchema
  | OtherActionSchema;
