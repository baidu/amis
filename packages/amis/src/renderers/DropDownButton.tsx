import React from 'react';
import {Renderer, RendererProps} from 'amis-core';
import {Overlay} from 'amis-core';
import {PopOver} from 'amis-core';
import {TooltipWrapper} from 'amis-ui';
import {isDisabled, isVisible, noop} from 'amis-core';
import {filter} from 'amis-core';
import {Icon} from 'amis-ui';
import {BaseSchema, SchemaClassName, SchemaIcon} from '../Schema';
import {ActionSchema} from './Action';
import {DividerSchema} from './Divider';
import {RootClose} from 'amis-core';
import {generateIcon} from 'amis-core';
import type {
  TooltipObject,
  Trigger
} from 'amis-ui/lib/components/TooltipWrapper';

export type DropdownButton =
  | (ActionSchema & {children?: Array<DropdownButton>})
  | DividerSchema
  | 'divider';

/**
 * 下拉按钮渲染器。
 * 文档：https://baidu.gitee.io/amis/docs/components/dropdown-button
 */
export interface DropdownButtonSchema extends BaseSchema {
  /**
   * 指定为 DropDown Button 类型
   */
  type: 'dropdown-button';

  /**
   * 是否独占一行 `display: block`
   */
  block?: boolean;

  /**
   * 给 Button 配置 className。
   */
  btnClassName?: SchemaClassName;

  /**
   * 按钮集合，支持分组
   */
  buttons?: Array<DropdownButton>;

  /**
   * 按钮文字
   */
  label?: string;

  /**
   * 按钮级别，样式
   */
  level?: 'info' | 'success' | 'danger' | 'warning' | 'primary' | 'link';

  /**
   * 按钮提示文字，hover 时显示
   */
  // tooltip?: SchemaTooltip;

  /**
   * 点击外部是否关闭
   */
  closeOnOutside?: boolean;

  /**
   * 点击内容是否关闭
   */
  closeOnClick?: boolean;

  /**
   * 按钮大小
   */
  size?: 'xs' | 'sm' | 'md' | 'lg';

  /**
   * 对齐方式
   */
  align?: 'left' | 'right';

  /**
   * 是否只显示图标。
   */
  iconOnly?: boolean;

  /**
   * 右侧图标
   */
  rightIcon?: SchemaIcon;

  /**
   * 触发条件，默认是 click
   */
  trigger?: 'click' | 'hover';

  /**
   * 是否显示下拉按钮
   */
  hideCaret?: boolean;

  /**
   * 菜单 CSS 样式
   */
  menuClassName?: string;
}

export interface DropDownButtonProps
  extends RendererProps,
    Omit<DropdownButtonSchema, 'type' | 'className'> {
  disabledTip?: string | TooltipObject;
  /**
   * 按钮提示文字，hover focus 时显示
   */
  tooltip?: string | TooltipObject;
  placement?: 'top' | 'right' | 'bottom' | 'left';
  tooltipContainer?: any;
  tooltipTrigger?: Trigger | Array<Trigger>;
  tooltipRootClose?: boolean;
  defaultIsOpened?: boolean;
  label?: any;
  // 激活状态
  isActived?: boolean;
  menuClassName?: string;
}

export interface DropDownButtonState {
  isOpened: boolean;
}

export default class DropDownButton extends React.Component<
  DropDownButtonProps,
  DropDownButtonState
> {
  state: DropDownButtonState = {
    isOpened: false
  };

  static defaultProps: Pick<
    DropDownButtonProps,
    'placement' | 'tooltipTrigger' | 'tooltipRootClose'
  > = {
    placement: 'top',
    tooltipTrigger: ['hover', 'focus'],
    tooltipRootClose: false
  };

  target: any;
  timer: ReturnType<typeof setTimeout>;
  constructor(props: DropDownButtonProps) {
    super(props);

    this.open = this.open.bind(this);
    this.close = this.close.bind(this);
    this.toogle = this.toogle.bind(this);
    this.keepOpen = this.keepOpen.bind(this);
    this.domRef = this.domRef.bind(this);
  }

  componentDidMount() {
    if (this.props.defaultIsOpened) {
      this.setState({
        isOpened: true
      });
    }
  }

  domRef(ref: any) {
    this.target = ref;
  }

  toogle(e: React.MouseEvent<any>) {
    e.preventDefault();

    this.setState({
      isOpened: !this.state.isOpened
    });
  }

  async open() {
    await this.props.dispatchEvent('mouseenter', {data: this.props.buttons});
    this.setState({
      isOpened: true
    });
  }

  close() {
    this.timer = setTimeout(() => {
      this.props.dispatchEvent('mouseleave', {data: this.props.buttons});
      this.setState({
        isOpened: false
      });
    }, 200);
  }

  keepOpen() {
    if (this.timer) {
      clearTimeout(this.timer);
    }
  }

  renderButton(
    button: DropdownButton,
    index: number | string
  ): React.ReactNode {
    const {render, classnames: cx, data} = this.props;
    index = typeof index === 'number' ? index.toString() : index;

    if (typeof button !== 'string' && Array.isArray(button?.children)) {
      return (
        <div key={index} className={cx('DropDown-menu')}>
          <li key={`${index}/0`} className={cx('DropDown-groupTitle')}>
            {button.icon ? generateIcon(cx, button.icon, 'm-r-xs') : null}
            <span>{button.label}</span>
          </li>
          {button.children.map((child, childIndex) =>
            this.renderButton(child, `${index}/${childIndex + 1}`)
          )}
        </div>
      );
    }

    if (typeof button !== 'string' && !isVisible(button, data)) {
      return null;
    } else if (button === 'divider' || button.type === 'divider') {
      return <li key={index} className={cx('DropDown-divider')} />;
    } else {
      return (
        <li
          key={index}
          className={cx('DropDown-button', {
            ['is-disabled']: isDisabled(button, data)
          })}
        >
          {render(`button/${index}`, {
            type: 'button',
            ...(button as any),
            isMenuItem: true
          })}
        </li>
      );
    }
  }

  renderOuter() {
    const {
      render,
      buttons,
      data,
      popOverContainer,
      classnames: cx,
      classPrefix: ns,
      children,
      align,
      closeOnClick,
      closeOnOutside,
      menuClassName
    } = this.props;

    let body = (
      <RootClose
        disabled={!this.state.isOpened}
        onRootClose={closeOnOutside !== false ? this.close : noop}
      >
        {(ref: any) => {
          return (
            <ul
              className={cx(
                'DropDown-menu-root',
                'DropDown-menu',
                menuClassName
              )}
              onClick={closeOnClick ? this.close : noop}
              onMouseEnter={this.keepOpen}
              ref={ref}
            >
              {children
                ? children
                : Array.isArray(buttons)
                ? buttons.map((button, index) =>
                    this.renderButton(button, index)
                  )
                : null}
            </ul>
          );
        }}
      </RootClose>
    );

    if (popOverContainer) {
      return (
        <Overlay container={popOverContainer} target={() => this.target} show>
          <PopOver
            overlay
            onHide={this.close}
            classPrefix={ns}
            className={cx('DropDown-popover', menuClassName)}
            style={{minWidth: this.target?.offsetWidth}}
          >
            {body}
          </PopOver>
        </Overlay>
      );
    }

    return body;
  }

  render() {
    const {
      tooltip,
      placement,
      tooltipContainer,
      tooltipTrigger,
      tooltipRootClose,
      disabledTip,
      block,
      disabled,
      btnDisabled,
      btnClassName,
      size,
      label,
      level,
      primary,
      className,
      classnames: cx,
      align,
      iconOnly,
      icon,
      rightIcon,
      isActived,
      trigger,
      data,
      hideCaret
    } = this.props;

    const iconElement = generateIcon(cx, icon, 'm-r-xs');

    const rightIconElement = generateIcon(cx, rightIcon, 'm-l-xs');

    return (
      <div
        className={cx(
          'DropDown ',
          {
            'DropDown--block': block,
            'DropDown--alignRight': align === 'right',
            'is-opened': this.state.isOpened,
            'is-actived': isActived
          },
          className
        )}
        onMouseEnter={trigger === 'hover' ? this.open : () => {}}
        onMouseLeave={trigger === 'hover' ? this.close : () => {}}
        ref={this.domRef}
      >
        <TooltipWrapper
          placement={placement}
          tooltip={disabled ? disabledTip : tooltip}
          container={tooltipContainer}
          trigger={tooltipTrigger}
          rootClose={tooltipRootClose}
        >
          <button
            onClick={this.toogle}
            disabled={disabled || btnDisabled}
            className={cx(
              'Button',
              btnClassName,
              typeof level === 'undefined'
                ? 'Button--default'
                : level
                ? `Button--${level}`
                : '',
              {
                'Button--block': block,
                'Button--primary': primary,
                'Button--iconOnly': iconOnly
              },
              size ? `Button--${size}` : ''
            )}
          >
            {iconElement}
            {typeof label === 'string' ? filter(label, data) : label}
            {rightIconElement}
            {!hideCaret ? (
              <span className={cx('DropDown-caret')}>
                <Icon icon="caret" className="icon" />
              </span>
            ) : null}
          </button>
        </TooltipWrapper>
        {this.state.isOpened ? this.renderOuter() : null}
      </div>
    );
  }
}

@Renderer({
  type: 'dropdown-button'
})
export class DropDownButtonRenderer extends DropDownButton {}
