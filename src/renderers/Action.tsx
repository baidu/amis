import React from 'react';
import hotkeys from 'hotkeys-js';
import {Renderer, RendererProps} from '../factory';
import {filter} from '../utils/tpl';
import Button from '../components/Button';
import pick from 'lodash/pick';
import omit from 'lodash/omit';

export interface ButtonSchema extends BaseSchema {
  /**
   * 主要用于用户行为跟踪里区分是哪个按钮
   */
  id?: string;

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
   * 右侧按钮图标， iconfont 的类名
   */
  rightIcon?: SchemaIcon;

  /**
   * 右侧 icon 上的 css 类名
   */
  rightIconClassName?: SchemaClassName;
  /**
   * loading 上的css 类名
   */
  loadingClassName?: SchemaClassName;

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

  /**
   * 角标
   */
  badge?: BadgeSchema;

  /**
   * 键盘快捷键
   */
  hotKey?: string;
  /**
   * 是否显示loading效果
   */
  loadingOn?: string;

  /**
   * 自定义事件处理函数
   */
  onClick?: string | any;

  /**
   * 子内容
   */
  body?: SchemaCollection;
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

  feedback?: FeedbackDialog;

  reload?: SchemaReload;
  redirect?: string;
  ignoreConfirm?: boolean;
}

export interface DownloadActionSchema
  extends Omit<AjaxActionSchema, 'actionType'> {
  /**
   * 指定为下载行为
   */
  actionType: 'download';
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

export interface ToastActionSchema extends ButtonSchema {
  /**
   * 指定为打开弹窗，抽出式弹窗
   */
  actionType: 'toast';

  /**
   * 轻提示详情
   * 文档：https://baidu.gitee.io/amis/docs/components/toast
   */
  toast: ToastSchemaBase;
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

export interface EmailActionSchema extends ButtonSchema {
  /**
   * 指定为打开邮箱行为
   */
  actionType: 'email';

  /**
   * 收件人邮箱
   */
  to: string;

  /**
   * 抄送邮箱
   */
  cc?: string;

  /**
   * 匿名抄送邮箱
   */
  bcc?: string;

  /**
   * 邮件主题
   */
  subject?: string;

  /**
   * 邮件正文
   */
  body?: string;
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
  | ToastActionSchema
  | CopyActionSchema
  | ReloadActionSchema
  | EmailActionSchema
  | OtherActionSchema
  | VanillaAction;

const ActionProps = [
  'id',
  'dialog',
  'drawer',
  'toast',
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
  'cc',
  'bcc',
  'subject',
  'body',
  'content',
  'required',
  'type',
  'actionType',
  'label',
  'icon',
  'rightIcon',
  'reload',
  'target',
  'close',
  'messages',
  'mergeData',
  'index',
  'copy',
  'copyFormat',
  'payload',
  'requireSelected'
];
import {filterContents} from './Remark';
import {ClassNamesFn, themeable, ThemeProps} from '../theme';
import {autobind, createObject} from '../utils/helper';
import {
  BaseSchema,
  FeedbackDialog,
  SchemaApi,
  SchemaClassName,
  SchemaCollection,
  SchemaExpression,
  SchemaIcon,
  SchemaReload,
  SchemaTooltip,
  SchemaTpl
} from '../Schema';
import {DialogSchema, DialogSchemaBase} from './Dialog';
import {DrawerSchema, DrawerSchemaBase} from './Drawer';
import {ToastSchemaBase} from '../Schema';
import {generateIcon} from '../utils/icon';
import {BadgeSchema, withBadge} from '../components/Badge';
import {normalizeApi, str2AsyncFunction} from '../utils/api';
import {TooltipWrapper} from '../components/TooltipWrapper';
import handleAction from '../utils/handleAction';

// 构造一个假的 React 事件避免可能的报错，主要用于快捷键功能
// 来自 https://stackoverflow.com/questions/27062455/reactjs-can-i-create-my-own-syntheticevent
export const createSyntheticEvent = <T extends Element, E extends Event>(
  event: E
): React.SyntheticEvent<T, E> => {
  let isDefaultPrevented = false;
  let isPropagationStopped = false;
  const preventDefault = () => {
    isDefaultPrevented = true;
    event.preventDefault();
  };
  const stopPropagation = () => {
    isPropagationStopped = true;
    event.stopPropagation();
  };
  return {
    nativeEvent: event,
    currentTarget: event.currentTarget as EventTarget & T,
    target: event.target as EventTarget & T,
    bubbles: event.bubbles,
    cancelable: event.cancelable,
    defaultPrevented: event.defaultPrevented,
    eventPhase: event.eventPhase,
    isTrusted: event.isTrusted,
    preventDefault,
    isDefaultPrevented: () => isDefaultPrevented,
    stopPropagation,
    isPropagationStopped: () => isPropagationStopped,
    persist: () => {},
    timeStamp: event.timeStamp,
    type: event.type
  };
};

export interface ActionProps
  extends Omit<
      ButtonSchema,
      'className' | 'iconClassName' | 'rightIconClassName' | 'loadingClassName'
    >,
    ThemeProps,
    Omit<
      AjaxActionSchema,
      | 'type'
      | 'className'
      | 'iconClassName'
      | 'rightIconClassName'
      | 'loadingClassName'
    >,
    Omit<
      UrlActionSchema,
      | 'type'
      | 'className'
      | 'iconClassName'
      | 'rightIconClassName'
      | 'loadingClassName'
    >,
    Omit<
      LinkActionSchema,
      | 'type'
      | 'className'
      | 'iconClassName'
      | 'rightIconClassName'
      | 'loadingClassName'
    >,
    Omit<
      DialogActionSchema,
      | 'type'
      | 'className'
      | 'iconClassName'
      | 'rightIconClassName'
      | 'loadingClassName'
    >,
    Omit<
      DrawerActionSchema,
      | 'type'
      | 'className'
      | 'iconClassName'
      | 'rightIconClassName'
      | 'loadingClassName'
    >,
    Omit<
      ToastSchemaBase,
      | 'type'
      | 'className'
      | 'iconClassName'
      | 'rightIconClassName'
      | 'loadingClassName'
    >,
    Omit<
      CopyActionSchema,
      | 'type'
      | 'className'
      | 'iconClassName'
      | 'rightIconClassName'
      | 'loadingClassName'
    >,
    Omit<
      ReloadActionSchema,
      | 'type'
      | 'className'
      | 'iconClassName'
      | 'rightIconClassName'
      | 'loadingClassName'
    >,
    Omit<
      EmailActionSchema,
      | 'type'
      | 'className'
      | 'iconClassName'
      | 'rightIconClassName'
      | 'loadingClassName'
      | 'body'
    >,
    Omit<
      OtherActionSchema,
      | 'type'
      | 'className'
      | 'iconClassName'
      | 'rightIconClassName'
      | 'loadingClassName'
    > {
  actionType: any;
  onAction?: (
    e: React.MouseEvent<any> | void | null,
    action: ActionSchema
  ) => void;
  isCurrentUrl?: (link: string) => boolean;
  onClick?:
    | ((e: React.MouseEvent<any>, props: any) => void)
    | string
    | Function
    | null;
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
  async handleAction(e: React.MouseEvent<any>) {
    const {onAction, disabled, countDown, env} = this.props;

    // https://reactjs.org/docs/legacy-event-pooling.html
    // e.persist(); // react 17之后去掉 event pooling 了，这个应该没用了
    let onClick = this.props.onClick;

    if (typeof onClick === 'string') {
      onClick = str2AsyncFunction(onClick, 'event', 'props');
    }
    const result: any = onClick && (await onClick(e, this.props));

    if (
      disabled ||
      e.isDefaultPrevented() ||
      result === false ||
      !onAction ||
      this.state.inCountDown
    ) {
      return;
    }

    e.preventDefault();
    const action = pick(this.props, ActionProps) as ActionSchema;
    const actionType = action.actionType;

    // ajax 会在 wrapFetcher 里记录，这里再处理就重复了，因此去掉
    // add 一般是 input-table 之类的，会触发 formItemChange，为了避免重复也去掉
    if (
      actionType !== 'ajax' &&
      actionType !== 'download' &&
      actionType !== 'add'
    ) {
      env?.tracker(
        {
          eventType: actionType || this.props.type || 'click',
          eventData: omit(action, ['type', 'actionType', 'tooltipPlacement'])
        },
        this.props
      );
    }

    // download 是一种 ajax 的简写
    if (actionType === 'download') {
      action.actionType = 'ajax';
      const api = normalizeApi((action as AjaxActionSchema).api);
      api.responseType = 'blob';
      (action as AjaxActionSchema).api = api;
    }

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

  @autobind
  componentDidMount() {
    const {hotKey} = this.props;
    if (hotKey) {
      hotkeys(hotKey, event => {
        event.preventDefault();
        const click = new MouseEvent('click', {
          bubbles: true,
          cancelable: true
        });
        this.handleAction(createSyntheticEvent(click) as any);
      });
    }
  }

  @autobind
  componentWillUnmount() {
    const {hotKey} = this.props;
    if (hotKey) {
      hotkeys.unbind(hotKey);
    }
  }

  render() {
    const {
      type,
      icon,
      iconClassName,
      rightIcon,
      rightIconClassName,
      loadingClassName,
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
      tooltipTrigger,
      tooltipContainer,
      tooltipRootClose,
      loading,
      body,
      render,
      onMouseEnter,
      onMouseLeave,
      classnames: cx,
      classPrefix: ns
    } = this.props;

    if (actionType !== 'email' && body) {
      return (
        <TooltipWrapper
          classPrefix={ns}
          classnames={cx}
          placement={tooltipPlacement}
          tooltip={tooltip}
          container={tooltipContainer}
          trigger={tooltipTrigger}
          rootClose={tooltipRootClose}
        >
          <div
            className={cx('Action', className)}
            onClick={this.handleAction}
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
          >
            {render('body', body) as JSX.Element}
          </div>
        </TooltipWrapper>
      );
    }

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
    const rightIconElement = generateIcon(
      cx,
      rightIcon,
      'Button-icon',
      rightIconClassName
    );

    return (
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
        loadingClassName={loadingClassName}
        loading={loading}
        onClick={this.handleAction}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        type={type && ~allowedType.indexOf(type) ? type : 'button'}
        disabled={disabled}
        componentClass={isMenuItem ? 'a' : componentClass}
        overrideClassName={isMenuItem}
        tooltip={tooltip}
        disabledTip={disabledTip}
        tooltipPlacement={tooltipPlacement}
        tooltipContainer={tooltipContainer}
        tooltipTrigger={tooltipTrigger}
        tooltipRootClose={tooltipRootClose}
        block={block}
        iconOnly={!!(icon && !label && level !== 'link')}
      >
        {!loading ? iconElement : ''}
        {label ? <span>{filter(String(label), data)}</span> : null}
        {rightIconElement}
      </Button>
    );
  }
}

export default themeable(Action);

@Renderer({
  type: 'action'
})
// @ts-ignore 类型没搞定
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
  async handleAction(e: React.MouseEvent<any> | void | null, action: any) {
    const {env, onAction, data, ignoreConfirm, dispatchEvent} = this.props;

    // 触发渲染器事件
    const rendererEvent = await dispatchEvent(e as React.MouseEvent<any>, data);

    // 阻止原有动作执行
    if (rendererEvent?.prevented) {
      return;
    }

    if (!ignoreConfirm && action.confirmText && env.confirm) {
      env
        .confirm(filter(action.confirmText, data))
        .then((confirmed: boolean) => confirmed && onAction(e, action, data));
    } else {
      onAction(e, action, data);
    }
  }

  @autobind
  handleMouseEnter(e: React.MouseEvent<any>) {
    this.props.dispatchEvent(e, this.props.data);
  }

  @autobind
  handleMouseLeave(e: React.MouseEvent<any>) {
    this.props.dispatchEvent(e, this.props.data);
  }

  @autobind
  isCurrentAction(link: string) {
    const {env, data} = this.props;
    return env.isCurrentUrl(filter(link, data));
  }

  render() {
    const {env, disabled, btnDisabled, loading, ...rest} = this.props;

    return (
      <Action
        {...(rest as any)}
        env={env}
        disabled={disabled || btnDisabled}
        onAction={this.handleAction}
        onMouseEnter={this.handleMouseEnter}
        onMouseLeave={this.handleMouseLeave}
        loading={loading}
        isCurrentUrl={this.isCurrentAction}
        tooltipContainer={
          env.getModalContainer ? env.getModalContainer : undefined
        }
      />
    );
  }
}

@Renderer({
  type: 'button'
})
export class ButtonRenderer extends ActionRenderer {}

@Renderer({
  type: 'submit'
})
export class SubmitRenderer extends ActionRenderer {}

@Renderer({
  type: 'reset'
})
export class ResetRenderer extends ActionRenderer {}
