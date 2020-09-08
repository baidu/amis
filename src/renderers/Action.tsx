import React from 'react';
import {Renderer, RendererProps} from '../factory';
import {filter} from '../utils/tpl';
import Button from '../components/Button';
import pick from 'lodash/pick';
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
  ButtonSchema,
  ActionSchema,
  AjaxActionSchema,
  UrlActionSchema,
  LinkActionSchema,
  DialogActionSchema,
  CopyActionSchema,
  OtherActionSchema,
  ReloadActionSchema,
  DrawerActionSchema
} from '../schemas/Action';

export interface ActionProps
  extends ButtonSchema,
    ThemeProps,
    AjaxActionSchema,
    UrlActionSchema,
    LinkActionSchema,
    DialogActionSchema,
    DrawerActionSchema,
    CopyActionSchema,
    ReloadActionSchema,
    OtherActionSchema {
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

export class Action extends React.Component<ActionProps> {
  static defaultProps = {
    type: 'button' as 'button',
    componentClass: 'button' as React.ReactType,
    tooltipPlacement: 'bottom' as 'bottom',
    activeClassName: 'is-active'
  };

  dom: any;

  @autobind
  handleAction(e: React.MouseEvent<any>) {
    const {onAction, onClick, disabled} = this.props;

    const result: any = onClick && onClick(e, this.props);

    if (disabled || e.isDefaultPrevented() || result === false || !onAction) {
      return;
    }

    e.preventDefault();
    const action = pick(this.props, ActionProps) as ActionSchema;
    onAction(e, action);
  }

  render() {
    const {
      type,
      label,
      icon,
      iconClassName,
      primary,
      size,
      level,
      disabled,
      block,
      className,
      componentClass,
      tooltip,
      disabledTip,
      tooltipPlacement,
      actionType,
      link,
      data,
      activeClassName,
      isCurrentUrl,
      isMenuItem,
      active,
      activeLevel,
      tooltipContainer,
      classnames: cx
    } = this.props;

    let isActive = !!active;

    if (actionType === 'link' && !isActive && link && isCurrentUrl) {
      isActive = isCurrentUrl(link);
    }

    return isMenuItem ? (
      <a
        className={cx(className, {
          [activeClassName || 'is-active']: isActive,
          'is-disabled': disabled
        })}
        onClick={this.handleAction}
      >
        {label}
        {icon ? <i className={cx('Button-icon', icon)} /> : null}
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
        {label ? <span>{filter(label, data)}</span> : null}
        {icon ? <i className={cx('Button-icon', icon, iconClassName)} /> : null}
      </Button>
    );
  }
}

export default themeable(Action);

@Renderer({
  test: /(^|\/)action$/,
  name: 'action'
})
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
    const {env, onAction, data} = this.props;

    if (action.confirmText && env.confirm) {
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
        type="button"
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
