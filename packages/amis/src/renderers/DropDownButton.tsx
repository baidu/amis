import React from 'react';
import {
  createObject,
  CustomStyle,
  Renderer,
  RendererProps,
  setThemeClassName
} from 'amis-core';
import {Overlay} from 'amis-core';
import {PopOver} from 'amis-core';
import {TooltipWrapper} from 'amis-ui';
import {isDisabled, isVisible, noop, filterClassNameObject} from 'amis-core';
import {filter} from 'amis-core';
import {Icon, hasIcon} from 'amis-ui';
import {
  BaseSchema,
  SchemaClassName,
  SchemaCollection,
  SchemaIcon
} from '../Schema';
import {ActionSchema} from './Action';
import {DividerSchema} from './Divider';
import {RootClose} from 'amis-core';
import type {
  TooltipObject,
  Trigger
} from 'amis-ui/lib/components/TooltipWrapper';
import {resolveVariableAndFilter} from 'amis-core';
import {isMobile} from 'amis-core';

export type DropdownButton =
  | (ActionSchema & {children?: Array<DropdownButton>})
  | DividerSchema
  | 'divider';

/**
 * 下拉按钮渲染器。
 * 文档：https://aisuda.bce.baidu.com/amis/zh-CN/components/dropdown-button
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
   * 内容区域
   */
  body?: SchemaCollection;

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

  overlayPlacement?: string;
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
    'placement' | 'tooltipTrigger' | 'tooltipRootClose' | 'overlayPlacement'
  > = {
    placement: 'top',
    tooltipTrigger: ['hover', 'focus'],
    tooltipRootClose: false,
    overlayPlacement: 'auto'
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
    e.stopPropagation();
    this.setState({
      isOpened: !this.state.isOpened
    });
  }

  async open() {
    const {
      dispatchEvent,
      data,
      buttons: _buttons,
      disabled,
      btnDisabled
    } = this.props;
    if (disabled || btnDisabled) {
      return;
    }
    const buttons =
      typeof _buttons === 'string'
        ? resolveVariableAndFilter(_buttons, data, '| raw')
        : _buttons;
    await dispatchEvent(
      'mouseenter',
      createObject(data, {
        items: buttons // 为了保持名字统一
      })
    );
    this.setState({
      isOpened: true
    });
  }

  close(e?: React.MouseEvent<any>) {
    const {buttons: _buttons, data} = this.props;
    const buttons =
      typeof _buttons === 'string'
        ? resolveVariableAndFilter(_buttons, data, '| raw')
        : _buttons;

    this.timer = setTimeout(() => {
      this.props.dispatchEvent(
        'mouseleave',
        createObject(this.props.data, {items: buttons})
      );
      this.setState({
        isOpened: false
      });
    }, 200);

    // 如果是下拉菜单，并且是下载链接，则不阻止默认事件
    if (!(e?.target as any)?.getAttribute?.('download')) {
      // PopOver hide会直接调用close方法
      e && e.preventDefault();
    }
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
    const {
      render,
      classnames: cx,
      data,
      ignoreConfirm,
      testIdBuilder,
      mobileUI
    } = this.props;
    index = typeof index === 'number' ? index.toString() : index;

    if (typeof button !== 'string' && Array.isArray(button?.children)) {
      return (
        <div
          key={index}
          className={cx('DropDown-menu', {'is-mobile': mobileUI})}
        >
          <li key={`${index}/0`} className={cx('DropDown-groupTitle')}>
            {button.icon ? (
              <Icon cx={cx} icon={button.icon} className="m-r-xs" />
            ) : null}
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
          className={cx(
            'DropDown-button',
            {
              ['is-disabled']: isDisabled(button, data)
            },
            typeof button.level === 'undefined'
              ? ''
              : button.level
              ? `Button--${button.level}`
              : '',
            filterClassNameObject(button.className, data)
          )}
        >
          {render(
            `button/${index}`,
            {
              type: 'button',
              ...(button as any),
              className: '',
              // 防止dropdown中button没有 testid或者id
              testIdBuilder: testIdBuilder?.getChild(
                button.label || index,
                data
              )
            },
            {
              isMenuItem: true,
              ignoreConfirm: ignoreConfirm
            }
          )}
        </li>
      );
    }
  }

  renderOuter() {
    const {
      render,
      buttons: _buttons,
      data,
      popOverContainer,
      classnames: cx,
      classPrefix: ns,
      children,
      body,
      align,
      closeOnClick,
      closeOnOutside,
      menuClassName,
      overlayPlacement,
      trigger,
      mobileUI
    } = this.props;

    const buttons =
      typeof _buttons === 'string'
        ? resolveVariableAndFilter(_buttons, data, '| raw')
        : _buttons;

    let popOverBody = (
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
                {
                  'is-mobile': mobileUI
                },
                menuClassName
              )}
              onClick={closeOnClick ? this.close : noop}
              onMouseEnter={this.keepOpen}
              ref={ref}
              style={{width: this.target?.offsetWidth}}
            >
              {children
                ? children
                : body
                ? render('body', body)
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
        <Overlay
          container={popOverContainer}
          target={() => this.target}
          placement={overlayPlacement}
          show
        >
          <PopOver
            overlay={trigger !== 'hover'}
            onHide={this.close}
            classPrefix={ns}
            className={cx('DropDown-popover', menuClassName)}
            style={{minWidth: this.target?.offsetWidth}}
          >
            {popOverBody}
          </PopOver>
        </Overlay>
      );
    }

    return popOverBody;
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
      size = 'default',
      label,
      level,
      primary,
      className,
      style,
      classnames: cx,
      align,
      iconOnly,
      icon,
      rightIcon,
      isActived,
      trigger,
      data,
      hideCaret,
      env,
      testIdBuilder,
      id,
      wrapperCustomStyle,
      themeCss,
      mobileUI
    } = this.props;

    return (
      <div
        className={cx(
          'DropDown ',
          {
            'DropDown--block': block,
            'DropDown--alignRight': align === 'right',
            'is-opened': this.state.isOpened,
            'is-actived': isActived,
            'is-mobile': mobileUI
          },
          className
        )}
        style={style}
        onMouseEnter={trigger === 'hover' ? this.open : () => {}}
        onMouseLeave={trigger === 'hover' ? this.close : () => {}}
        ref={this.domRef}
      >
        <TooltipWrapper
          placement={placement}
          tooltip={disabled ? disabledTip : (tooltip as any)}
          container={tooltipContainer || env?.getModalContainer}
          trigger={tooltipTrigger}
          rootClose={tooltipRootClose}
        >
          <button
            onClick={this.toogle}
            disabled={disabled || btnDisabled}
            {...testIdBuilder?.getTestId(data)}
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
              `Button--size-${size}`,
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
                themeCss: themeCss
              })
            )}
          >
            <Icon
              c={cx}
              icon={icon}
              className={cx(
                'icon m-r-xs',
                setThemeClassName({
                  ...this.props,
                  name: 'iconClassName',
                  id,
                  themeCss: themeCss
                })
              )}
            />
            {typeof label === 'string' ? filter(label, data) : label}
            {rightIcon && (
              <Icon
                cx={cx}
                icon={rightIcon}
                className={cx(
                  'icon m-l-xs',
                  setThemeClassName({
                    ...this.props,
                    name: 'iconClassName',
                    id,
                    themeCss: themeCss
                  })
                )}
              />
            )}
            {!hideCaret ? (
              <span className={cx('DropDown-caret')}>
                <Icon icon="right-arrow-bold" className="icon" />
              </span>
            ) : null}
          </button>
        </TooltipWrapper>
        {this.state.isOpened ? this.renderOuter() : null}

        <CustomStyle
          {...this.props}
          config={{
            themeCss: themeCss,
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
      </div>
    );
  }
}

@Renderer({
  type: 'dropdown-button'
})
export class DropDownButtonRenderer extends DropDownButton {}
