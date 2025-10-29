import React from 'react';
import hotkeys from 'hotkeys-js';
import {
  ActionObject,
  CustomStyle,
  IScopedContext,
  isObject,
  Renderer,
  RendererProps,
  ScopedContext,
  uuid,
  setThemeClassName,
  RendererEvent,
  AMISLegacyAjaxActionButton,
  AMISButton,
  AMISLegacyDownloadActionButton,
  AMISLegacySaveAsActionButton,
  AMISLegacyUrlActionButton,
  AMISLegacyDialogActionButton,
  AMISLegacyDrawerActionButton,
  AMISLegacyToastActionButton,
  AMISLegacyCopyActionButton,
  AMISLegacyLinkActionButton,
  AMISLegacyReloadActionButton,
  AMISLegacyEmailActionButton,
  AMISLegacyBehaviorActionButton,
  AMISLegacyActionSchema,
  AMISButtonSchema
} from 'amis-core';
import {filter} from 'amis-core';
import {BadgeObject, Button, SpinnerExtraProps} from 'amis-ui';
import pick from 'lodash/pick';
import omit from 'lodash/omit';

export type ButtonSchema = AMISButton;
export type AjaxActionSchema = AMISLegacyAjaxActionButton;
export type DownloadActionSchema = AMISLegacyDownloadActionButton;
export type SaveAsActionSchema = AMISLegacySaveAsActionButton;
export type UrlActionSchema = AMISLegacyUrlActionButton;
export type DialogActionSchema = AMISLegacyDialogActionButton;
export type DrawerActionSchema = AMISLegacyDrawerActionButton;
export type ToastActionSchema = AMISLegacyToastActionButton;
export type CopyActionSchema = AMISLegacyCopyActionButton;
export type LinkActionSchema = AMISLegacyLinkActionButton;
export type ReloadActionSchema = AMISLegacyReloadActionButton;
export type EmailActionSchema = AMISLegacyEmailActionButton;
export type OtherActionSchema = AMISLegacyBehaviorActionButton;

/**
 * 按钮动作渲染器。
 * 文档：https://aisuda.bce.baidu.com/amis/zh-CN/components/action
 */
export type ActionSchema = AMISButtonSchema;

const ActionProps = [
  'id',
  'dialog',
  'drawer',
  'toast',
  'url',
  'link',
  'confirmText',
  'confirmTitle',
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
  'requireSelected',
  'countDown',
  'fileName',
  'isolateScope',
  'downloadFileName'
];
import {filterContents} from './Remark';
import {ClassNamesFn, themeable, ThemeProps} from 'amis-core';
import {autobind, createObject} from 'amis-core';
import {
  BaseSchema,
  FeedbackDialog,
  SchemaApi,
  AMISClassName,
  SchemaExpression,
  SchemaIcon,
  SchemaReload,
  SchemaTooltip,
  SchemaTpl
} from '../Schema';
import {ToastSchemaBase} from '../Schema';
import {withBadge, Icon} from 'amis-ui';
import {normalizeApi, str2AsyncFunction} from 'amis-core';
import {TooltipWrapper} from 'amis-ui';

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

type CommonKeys =
  | 'type'
  | 'className'
  | 'iconClassName'
  | 'rightIconClassName'
  | 'loadingClassName'
  | 'target';

export interface ActionProps
  extends Omit<
      ButtonSchema,
      'className' | 'iconClassName' | 'rightIconClassName' | 'loadingClassName'
    >,
    Omit<ThemeProps, 'className'>,
    Omit<AjaxActionSchema, CommonKeys>,
    Omit<UrlActionSchema, CommonKeys>,
    Omit<LinkActionSchema, CommonKeys>,
    Omit<DialogActionSchema, CommonKeys>,
    Omit<DrawerActionSchema, CommonKeys>,
    Omit<ToastSchemaBase, CommonKeys>,
    Omit<CopyActionSchema, CommonKeys>,
    Omit<ReloadActionSchema, CommonKeys>,
    Omit<EmailActionSchema, CommonKeys | 'body'>,
    Omit<OtherActionSchema, CommonKeys>,
    Omit<RendererProps, 'data'>,
    SpinnerExtraProps {
  actionType: any;
  onAction?: (
    e: React.MouseEvent<any> | void | null,
    action: ActionSchema
  ) => void;
  // 可以用来监控这个动作的执行结果，包括成功与失败。
  onActionSensor?: (promise?: Promise<any>) => void;
  isCurrentUrl?: (link: string) => boolean;
  onClick?:
    | ((e: React.MouseEvent<any>, props: any) => void)
    | string
    | Function
    | null;
  componentClass: React.ElementType;
  tooltipContainer?: any;
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
    componentClass: 'button' as React.ElementType,
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
    this.localStorageKey =
      'amis-countdownend-' +
      (this.props.name || '') +
      (this.props?.$schema?.id || uuid());
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
    const {onAction, onActionSensor, disabled, countDown, env} = this.props;
    // https://reactjs.org/docs/legacy-event-pooling.html
    e.persist(); // 等 react 17之后去掉 event pooling 了，这个应该就没用了
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
    let action = pick(this.props, ActionProps) as AMISButtonSchema;
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
      action = {
        ...action,
        responseType: 'blob',
        actionType: 'ajax',
        api: normalizeApi((action as AMISLegacyAjaxActionButton).api)
      };
    }

    const sensor: any = onAction(e, action);
    if (sensor?.then) {
      onActionSensor?.(sensor);
      await sensor;
    }

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
      iconClassName,
      rightIconClassName,
      loadingClassName,
      primary,
      size,
      level,
      countDownTpl,
      block,
      className,
      style,
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
      classPrefix: ns,
      loadingConfig,
      themeCss,
      wrapperCustomStyle,
      css,
      id,
      testIdBuilder,
      env,
      tabIndex
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
            style={style}
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
    let icon = this.props.icon;
    let rightIcon = this.props.rightIcon;
    if (typeof icon === 'string') {
      icon = filter(this.props.icon, data);
    }
    if (typeof rightIcon === 'string') {
      rightIcon = filter(this.props.rightIcon, data);
    }

    const iconElement = (
      <Icon
        cx={cx}
        icon={icon}
        className="Button-icon"
        classNameProp={cx(
          iconClassName,
          setThemeClassName({
            ...this.props,
            name: 'iconClassName',
            id,
            themeCss: themeCss || css
          })
        )}
      />
    );
    const rightIconElement = (
      <Icon
        cx={cx}
        icon={rightIcon}
        className="Button-icon"
        classNameProp={cx(
          rightIconClassName,
          setThemeClassName({
            ...this.props,
            name: 'iconClassName',
            id,
            themeCss: themeCss || css
          })
        )}
      />
    );

    return (
      <>
        <Button
          loadingConfig={loadingConfig}
          className={cx(
            className,
            setThemeClassName({
              ...this.props,
              name: 'wrapperCustomStyle',
              id,
              themeCss: wrapperCustomStyle
            }),
            setThemeClassName({
              ...this.props,
              name: 'className',
              id,
              themeCss: themeCss || css
            }),
            {
              [activeClassName || 'is-active']: isActive
            }
          )}
          testIdBuilder={testIdBuilder}
          style={style}
          size={size}
          level={
            activeLevel && isActive
              ? activeLevel
              : filter(level, data) || (primary ? 'primary' : undefined)
          }
          loadingClassName={loadingClassName}
          loading={loading}
          onClick={this.handleAction}
          onMouseEnter={onMouseEnter}
          onMouseLeave={onMouseLeave}
          type={
            (type && ~allowedType.indexOf(type) ? type : 'button') as 'button'
          }
          disabled={disabled}
          componentClass={isMenuItem ? 'a' : componentClass}
          overrideClassName={isMenuItem}
          tooltip={filterContents(tooltip, data)}
          disabledTip={filterContents(disabledTip, data)}
          tooltipPlacement={tooltipPlacement}
          tooltipContainer={tooltipContainer}
          tooltipTrigger={tooltipTrigger}
          tooltipRootClose={tooltipRootClose}
          block={block}
          iconOnly={!!(icon && !label && level !== 'link')}
          tabIndex={tabIndex}
        >
          {!loading ? iconElement : ''}
          {label ? <span>{filter(String(label), data)}</span> : null}
          {rightIconElement}
        </Button>
        {/* button自定义样式 */}
        <CustomStyle
          {...this.props}
          config={{
            themeCss: themeCss || css,
            classNames: [
              {
                key: 'className',
                weights: {
                  hover: {
                    suf: ':not(:disabled):not(.is-disabled)'
                  },
                  active: {suf: ':not(:disabled):not(.is-disabled)'}
                }
              },
              {
                key: 'iconClassName',
                weights: {
                  default: {
                    important: true
                  },
                  hover: {
                    important: true,
                    suf: ':not(:disabled):not(.is-disabled)'
                  },
                  active: {
                    important: true,
                    suf: ':not(:disabled):not(.is-disabled)'
                  }
                }
              }
            ],
            wrapperCustomStyle,
            id
          }}
          env={env}
        />
      </>
    );
  }
}

export default themeable(Action);

export type ActionRendererProps = RendererProps &
  Omit<ActionProps, 'onAction' | 'isCurrentUrl' | 'tooltipContainer'> & {
    onAction: (
      e: React.MouseEvent<any> | string | void | null,
      action: object,
      data: any,
      throwErrors?: boolean,
      delegate?: IScopedContext,
      rendererEvent?: RendererEvent<any>
    ) => void;
    btnDisabled?: boolean;
  };

@Renderer({
  type: 'action',
  alias: ['button', 'submit', 'reset']
})
// @ts-ignore 类型没搞定
@withBadge
export class ActionRenderer extends React.Component<ActionRendererProps> {
  static contextType = ScopedContext;

  state = {
    actionDisabled: false
  };

  constructor(props: ActionRendererProps, scoped: IScopedContext) {
    super(props);

    scoped.registerComponent(this);
  }

  componentWillUnmount() {
    const scoped = this.context as IScopedContext;
    scoped.unRegisterComponent(this);
  }

  /**
   * 动作处理
   */
  doAction(
    action: ActionObject,
    args: {
      value?: string | {[key: string]: string};
    }
  ) {
    const actionType = action?.actionType as any;

    if (actionType === 'click') {
      this.handleAction(actionType, action);
    }
  }

  @autobind
  async handleAction(
    e: React.MouseEvent<any> | string | void | null,
    action: any
  ) {
    try {
      const {env, onAction, data, ignoreConfirm, dispatchEvent, $schema} =
        this.props;
      let mergedData = data;
      this.setState({actionDisabled: true});

      if (action?.actionType === 'click' && isObject(action?.args)) {
        mergedData = createObject(data, action.args);
      }

      const hasOnEvent = $schema.onEvent && Object.keys($schema.onEvent).length;
      let confirmText: string = '';
      // 有些组件虽然要求这里忽略二次确认，但是如果配了事件动作还是需要在这里等待二次确认提交才可以
      if (
        this.props.showConfirmBox !== false && // 外部判断是否开启二次确认弹窗的验证,勿删
        (!ignoreConfirm || hasOnEvent) &&
        action.confirmText &&
        env.confirm &&
        (confirmText = filter(action.confirmText, mergedData))
      ) {
        let confirmed = await env.confirm(
          confirmText,
          filter(action.confirmTitle, mergedData) || undefined
        );
        if (confirmed) {
          // 触发渲染器事件
          const rendererEvent = await dispatchEvent(
            e as React.MouseEvent<any> | string,
            mergedData,
            this // 保证renderer可以拿到，避免因交互设计导致的清空情况，例如crud内itemAction
          );

          // 阻止原有动作执行
          if (rendererEvent?.prevented) {
            return;
          }

          // 因为crud里面也会处理二次确认，所以如果按钮处理过了就跳过crud的二次确认
          await onAction(
            e,
            {...action, ignoreConfirm: !!hasOnEvent},
            mergedData,
            undefined,
            undefined,
            rendererEvent
          );
        } else if (action.countDown) {
          throw new Error('cancel');
        }
      } else {
        // 触发渲染器事件
        const rendererEvent = await dispatchEvent(
          e as React.MouseEvent<any> | string,
          mergedData
        );

        // 阻止原有动作执行
        if (rendererEvent?.prevented) {
          return;
        }

        await onAction(
          e,
          action,
          mergedData,
          undefined,
          undefined,
          rendererEvent
        );
      }
    } finally {
      this.setState({actionDisabled: false});
    }
  }

  @autobind
  handleMouseEnter(e: React.MouseEvent<any>) {
    const {dispatchEvent, data} = this.props;
    dispatchEvent(
      e,
      createObject(data, {
        nativeEvent: e
      })
    );
  }

  @autobind
  handleMouseLeave(e: React.MouseEvent<any>) {
    const {dispatchEvent, data} = this.props;
    dispatchEvent(
      e,
      createObject(data, {
        nativeEvent: e
      })
    );
  }

  @autobind
  isCurrentAction(link: string) {
    const {env, data} = this.props;
    return env.isCurrentUrl(filter(link, data));
  }

  render() {
    const {env, disabled, btnDisabled, disabledOnAction, loading, ...rest} =
      this.props;
    const {actionDisabled} = this.state;
    return (
      <Action
        {...(rest as any)}
        env={env}
        disabled={
          disabled || btnDisabled || (disabledOnAction ? actionDisabled : false)
        }
        onAction={this.handleAction}
        onMouseEnter={this.handleMouseEnter}
        onMouseLeave={this.handleMouseLeave}
        loading={loading}
        isCurrentUrl={this.isCurrentAction}
        tooltipContainer={rest.popOverContainer || env.getModalContainer}
      />
    );
  }
}
