import React from 'react';
import {Renderer, RendererProps} from '../factory';
import {RootCloseWrapper} from 'react-overlays';
import Overlay from '../components/Overlay';
import PopOver from '../components/PopOver';
import TooltipWrapper from '../components/TooltipWrapper';
import type {TooltipObject, Trigger} from '../components/TooltipWrapper';
import {isDisabled, isVisible, noop} from '../utils/helper';
import {filter} from '../utils/tpl';
import {Icon} from '../components/icons';
import {BaseSchema, SchemaClassName} from '../Schema';
import {ActionSchema} from './Action';
import {DividerSchema} from './Divider';

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
   * 按钮集合
   */
  buttons?: Array<ActionSchema | DividerSchema | 'divider'>;

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
  constructor(props: DropDownButtonProps) {
    super(props);

    this.open = this.open.bind(this);
    this.close = this.close.bind(this);
    this.toogle = this.toogle.bind(this);
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

  open() {
    this.setState({
      isOpened: true
    });
  }

  close() {
    this.setState({
      isOpened: false
    });
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
      closeOnOutside
    } = this.props;

    let body = (
      <RootCloseWrapper
        disabled={!this.state.isOpened}
        onRootClose={closeOnOutside !== false ? this.close : noop}
      >
        <ul
          className={cx('DropDown-menu')}
          onClick={closeOnClick ? this.close : noop}
        >
          {children
            ? children
            : Array.isArray(buttons)
            ? buttons.map((button, index) => {
                if (typeof button !== 'string' && !isVisible(button, data)) {
                  return null;
                } else if (button === 'divider' || button.type === 'divider') {
                  return <li key={index} className={cx('DropDown-divider')} />;
                }

                return (
                  <li
                    key={index}
                    className={isDisabled(button, data) ? 'is-disabled' : ''}
                  >
                    {render(`button/${index}`, {
                      type: 'button',
                      ...(button as any),
                      isMenuItem: true
                    })}
                  </li>
                );
              })
            : null}
        </ul>
      </RootCloseWrapper>
    );

    if (popOverContainer) {
      return (
        <Overlay container={popOverContainer} target={() => this.target} show>
          <PopOver
            overlay
            onHide={this.close}
            classPrefix={ns}
            className={cx('DropDown-popover')}
            style={{minWidth: this.target?.getBoundingClientRect().width}}
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
      data
    } = this.props;

    return (
      <div
        className={cx(
          'DropDown ',
          {
            'DropDown--block': block,
            'DropDown--alignRight': align === 'right',
            'is-opened': this.state.isOpened
          },
          className
        )}
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
            {icon ? (
              typeof icon === 'string' ? (
                <i className={cx(icon, 'm-r-xs')} />
              ) : (
                icon
              )
            ) : null}
            {typeof label === 'string' ? filter(label, data) : label}
            <span className={cx('DropDown-caret')}>
              <Icon icon="caret" className="icon" />
            </span>
          </button>
        </TooltipWrapper>
        {this.state.isOpened ? this.renderOuter() : null}
      </div>
    );
  }
}

@Renderer({
  test: /(^|\/)dropdown-button$/,
  name: 'dropdown-button'
})
export class DropDownButtonRenderer extends DropDownButton {}
