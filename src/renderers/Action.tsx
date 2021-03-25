import React from 'react';
import {Renderer, RendererProps} from '../factory';
import {filter} from '../utils/tpl';
import Button from '../components/Button';
import pick from 'lodash/pick';

export interface ButtonSchema extends BaseSchema {
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
  level?:
    | 'info'
    | 'success'
    | 'warning'
    | 'danger'
    | 'link'
    | 'primary'
    | 'dark';

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
   * 当按钮时批量操作按钮时，默认必须有勾选元素才能可点击，如果此属性配置成 false，则没有点选成员也能点击。
   */
  requireSelected?: boolean;

  /**
   * 是否将弹框中数据 merge 到父级作用域。
   */
  mergeData?: boolean;

  /**
   * 可以指定让谁来触发这个动作。
   */
  target?: string;

  /**
   * 点击后的禁止倒计时（秒）
   */
  countDown?: number;

  /**
   * 倒计时文字自定义
   */
  countDownTpl?: string;
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

  feedback?: DialogSchemaBase;

  reload?: SchemaReload;
  redirect?: string;
  ignoreConfirm?: boolean;
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

  /**
   * 弹框详情
   * 文档：https://baidu.gitee.io/amis/docs/components/dialog
   */
  dialog: DialogSchemaBase;

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

  /**
   * 抽出式弹框详情
   * 文档：https://baidu.gitee.io/amis/docs/components/drawer
   */
  drawer: DrawerSchemaBase;

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
  target?: SchemaReload;
}

export interface OtherActionSchema extends ButtonSchema {
  actionType:
    | 'prev'
    | 'next'
    | 'cancel'
    | 'close'
    | 'submit'
    | 'confirm'
    | 'add'
    | 'reset'
    | 'reset-and-submit';
  [propName: string]: any;
}

export interface VanillaAction extends ButtonSchema {
  actionType?: string;
}

/**
 * 按钮动作渲染器。
 * 文档：https://baidu.gitee.io/amis/docs/components/action
 */
export type ActionSchema =
  | AjaxActionSchema
  | UrlActionSchema
  | LinkActionSchema
  | DialogActionSchema
  | DrawerActionSchema
  | CopyActionSchema
  | ReloadActionSchema
  | OtherActionSchema
  | VanillaAction;

const ActionProps = [
  'dialog',
  'drawer',
  'url',
  'link',
  'confirmText',
  'tooltip',
  'disabledTip',
  'className',
  'asyncApi',
  'redirect',
  'size',
  'level',
  'primary',
  'feedback',
  'api',
  'blank',
  'tooltipPlacement',
  'to',
  'content',
  'required',
  'type',
  'actionType',
  'label',
  'icon',
  'reload',
  'target',
  'close',
  'messages',
  'mergeData',
  'index',
  'copy',
  'payload',
  'requireSelected'
];
import {filterContents} from './Remark';
import {ClassNamesFn, themeable, ThemeProps} from '../theme';
import {autobind} from '../utils/helper';
import {
  BaseSchema,
  SchemaApi,
  SchemaClassName,
  SchemaExpression,
  SchemaIcon,
  SchemaReload,
  SchemaTooltip,
  SchemaTpl
} from '../Schema';
import {DialogSchema, DialogSchemaBase} from './Dialog';
import {DrawerSchema, DrawerSchemaBase} from './Drawer';
import {generateIcon} from '../utils/icon';
import {withBadge} from '../components/Badge';

export interface ActionProps
  extends Omit<ButtonSchema, 'className' | 'iconClassName'>,
    ThemeProps,
    Omit<AjaxActionSchema, 'type' | 'className' | 'iconClassName'>,
    Omit<UrlActionSchema, 'type' | 'className' | 'iconClassName'>,
    Omit<LinkActionSchema, 'type' | 'className' | 'iconClassName'>,
    Omit<DialogActionSchema, 'type' | 'className' | 'iconClassName'>,
    Omit<DrawerActionSchema, 'type' | 'className' | 'iconClassName'>,
    Omit<CopyActionSchema, 'type' | 'className' | 'iconClassName'>,
    Omit<ReloadActionSchema, 'type' | 'className' | 'iconClassName'>,
    Omit<OtherActionSchema, 'type' | 'className' | 'iconClassName'> {
  actionType: any;
  onAction?: (
    e: React.MouseEvent<any> | void | null,
    action: ActionSchema
  ) => void;
  isCurrentUrl?: (link: string) => boolean;
  onClick?: (e: React.MouseEvent<any>, props: any) => void;
  componentClass: React.ReactType;
  tooltipContainer?: any;
  data?: any;
  isMenuItem?: boolean;
  active?: boolean;
}

const allowedType = ['button', 'submit', 'reset'];

interface ActionState {
  inCountDown: boolean; // 是否在倒计时
  countDownEnd: number; // 倒计时结束的精确时间
  timeLeft: number; // 倒计时剩余时间
}

export class Action extends React.Component<ActionProps, ActionState> {
  static defaultProps = {
    type: 'button' as 'button',
    componentClass: 'button' as React.ReactType,
    tooltipPlacement: 'bottom' as 'bottom',
    activeClassName: 'is-active',
    countDownTpl: 'Action.countDown',
    countDown: 0
  };

  state: ActionState = {
    inCountDown: false,
    countDownEnd: 0,
    timeLeft: 0
  };

  localStorageKey: string;

  dom: any;

  constructor(props: ActionProps) {
    super(props);
    this.localStorageKey = 'amis-countdownend-' + (this.props.name || '');
    const countDownEnd = parseInt(
      localStorage.getItem(this.localStorageKey) || '0'
    );
    if (countDownEnd && this.props.countDown) {
      if (Date.now() < countDownEnd) {
        this.state = {
          inCountDown: true,
          countDownEnd,
          timeLeft: Math.floor((countDownEnd - Date.now()) / 1000)
        };
        this.handleCountDown();
      }
    }
  }

  @autobind
  handleAction(e: React.MouseEvent<any>) {
    const {onAction, onClick, disabled, countDown} = this.props;

    const result: any = onClick && onClick(e, this.props);

    if (disabled || e.isDefaultPrevented() || result === false || !onAction) {
      return;
    }

    e.preventDefault();
    const action = pick(this.props, ActionProps) as ActionSchema;
    onAction(e, action);

    if (countDown) {
      const countDownEnd = Date.now() + countDown * 1000;
      this.setState({
        countDownEnd: countDownEnd,
        inCountDown: true,
        timeLeft: countDown
      });

      localStorage.setItem(this.localStorageKey, String(countDownEnd));

      setTimeout(() => {
        this.handleCountDown();
      }, 1000);
    }
  }

  @autobind
  handleCountDown() {
    // setTimeout 一般会晚于 1s，经过几十次后就不准了，所以使用真实时间进行 diff
    const timeLeft = Math.floor((this.state.countDownEnd - Date.now()) / 1000);
    if (timeLeft <= 0) {
      this.setState({
        inCountDown: false,
        timeLeft: timeLeft
      });
    } else {
      this.setState({
        timeLeft: timeLeft
      });
      setTimeout(() => {
        this.handleCountDown();
      }, 1000);
    }
  }

  render() {
    const {
      type,
      icon,
      iconClassName,
      primary,
      size,
      level,
      countDownTpl,
      block,
      className,
      componentClass,
      tooltip,
      disabledTip,
      tooltipPlacement,
      actionType,
      link,
      data,
      translate: __,
      activeClassName,
      isCurrentUrl,
      isMenuItem,
      active,
      activeLevel,
      tooltipContainer,
      classnames: cx
    } = this.props;

    let label = this.props.label;
    let disabled = this.props.disabled;
    let isActive = !!active;

    if (actionType === 'link' && !isActive && link && isCurrentUrl) {
      isActive = isCurrentUrl(link);
    }

    // 倒计时
    if (this.state.inCountDown) {
      label = filterContents(__(countDownTpl), {
        ...data,
        timeLeft: this.state.timeLeft
      }) as string;
      disabled = true;
    }

    const iconElement = generateIcon(cx, icon, 'Button-icon', iconClassName);

    return isMenuItem ? (
      <a
        className={cx(className, {
          [activeClassName || 'is-active']: isActive,
          'is-disabled': disabled
        })}
        onClick={this.handleAction}
      >
        {label}
        {iconElement}
      </a>
    ) : (
      <Button
        className={cx(className, {
          [activeClassName || 'is-active']: isActive
        })}
        size={size}
        level={
          activeLevel && isActive
            ? activeLevel
            : level || (primary ? 'primary' : undefined)
        }
        onClick={this.handleAction}
        type={type && ~allowedType.indexOf(type) ? type : 'button'}
        disabled={disabled}
        componentClass={componentClass}
        tooltip={filterContents(tooltip, data)}
        disabledTip={filterContents(disabledTip, data)}
        placement={tooltipPlacement}
        tooltipContainer={tooltipContainer}
        block={block}
        iconOnly={!!(icon && !label && level !== 'link')}
      >
        {label ? <span>{filter(String(label), data)}</span> : null}
        {iconElement}
      </Button>
    );
  }
}

export default themeable(Action);

@Renderer({
  test: /(^|\/)action$/,
  name: 'action'
})
@withBadge
export class ActionRenderer extends React.Component<
  RendererProps &
    Omit<ActionProps, 'onAction' | 'isCurrentUrl' | 'tooltipContainer'> & {
      onAction: (
        e: React.MouseEvent<any> | void | null,
        action: object,
        data: any
      ) => void;
      btnDisabled?: boolean;
    }
> {
  @autobind
  handleAction(e: React.MouseEvent<any> | void | null, action: any) {
    const {env, onAction, data, ignoreConfirm} = this.props;

    if (!ignoreConfirm && action.confirmText && env.confirm) {
      env
        .confirm(filter(action.confirmText, data))
        .then((confirmed: boolean) => confirmed && onAction(e, action, data));
    } else {
      onAction(e, action, data);
    }
  }

  @autobind
  isCurrentAction(link: string) {
    const {env, data} = this.props;
    return env.isCurrentUrl(filter(link, data));
  }

  render() {
    const {env, disabled, btnDisabled, ...rest} = this.props;

    return (
      <Action
        {...(rest as any)}
        disabled={disabled || btnDisabled}
        onAction={this.handleAction}
        isCurrentUrl={this.isCurrentAction}
        tooltipContainer={
          env.getModalContainer ? env.getModalContainer : undefined
        }
      />
    );
  }
}

@Renderer({
  test: /(^|\/)button$/,
  name: 'button'
})
export class ButtonRenderer extends ActionRenderer {}

@Renderer({
  test: /(^|\/)submit$/,
  name: 'submit'
})
export class SubmitRenderer extends ActionRenderer {}

@Renderer({
  test: /(^|\/)reset$/,
  name: 'reset'
})
export class ResetRenderer extends ActionRenderer {}
